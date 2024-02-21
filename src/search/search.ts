import {
  ChangeEventHandler,
  FormEventHandler,
  RefObject,
  useRef,
  useState,
} from "react";
import { NavigateFunction, useNavigate } from "react-router";
import { JsonRpcProvider, TransactionResponse } from "@ethersproject/providers";
import { isAddress } from "@ethersproject/address";
import { isHexString } from "@ethersproject/bytes";
import useKeyboardShortcut from "use-keyboard-shortcut";
import { PAGE_SIZE } from "../params";
import { ProcessedTransaction, TransactionChunk } from "../types";
import { useConfig } from "../useConfig";

export const rawToProcessed = (provider: JsonRpcProvider, _rawRes: any) => {
  const _res: TransactionResponse[] = [];

  _rawRes.txs.forEach((x: any) => {
    const tx =  provider.formatter.transactionResponse(x)
    tx.timestamp = x.timestamp;
    _res.push(tx)
  })


  return {
    txs: _res.map((t, i): ProcessedTransaction => {
      // const _rawReceipt = _rawRes.receipts[i];
      // const _receipt = provider.formatter.receipt(_rawReceipt);
      return {
        blockNumber: t.blockNumber!,
        timestamp: t.timestamp,//_rawReceipt.timestamp),
        idx: 0,//_receipt.transactionIndex,
        hash: t.hash,
        from: t.from,
        to: t.to ?? null,
        createdContractAddress: '',//_receipt.contractAddress,
        value: t.value,
        fee: provider.formatter.bigNumber(0),//_receipt.gasUsed.mul(t.gasPrice!),
        gasPrice: t.gasPrice!,
        data: t.data,
        status: 1//_receipt.status!,
      };
    }),
    firstPage: _rawRes.firstPage,
    lastPage: _rawRes.lastPage,
  };
};

export class SearchController {
  private txs: ProcessedTransaction[];

  private pageStart: number;

  private pageEnd: number;

  private constructor(
    readonly address: string,
    txs: ProcessedTransaction[],
    readonly isFirst: boolean,
    readonly isLast: boolean,
    boundToStart: boolean
  ) {
    this.txs = txs;
    if (boundToStart) {
      this.pageStart = 0;
      this.pageEnd = Math.min(txs.length, PAGE_SIZE);
    } else {
      this.pageEnd = txs.length;
      this.pageStart = Math.max(0, txs.length - PAGE_SIZE);
    }
  }

  private static async readBackPage(
    provider: JsonRpcProvider,
    address: string,
    baseBlock: number,
    config: any
  ): Promise<TransactionChunk> {

    const host = config?.apiURL;
    let result = await fetch(`${host}/get-transactions-before?address=${address}&baseblock=${baseBlock}&size=${PAGE_SIZE}`);
    
    const _rawRes = (await result.json());
    // const _rawRes = await provider.send("ots_searchTransactionsBefore", [
    //   address,
    //   baseBlock,
    //   PAGE_SIZE,
    // ]);
    return rawToProcessed(provider, _rawRes);
  }

  private static async readForwardPage(
    provider: JsonRpcProvider,
    address: string,
    baseBlock: number,
    config: any
  ): Promise<TransactionChunk> {
    const host = config?.apiURL;

    let result = await fetch(`${host}/get-transactions-after?address=${address}&baseblock=${baseBlock}&size=${PAGE_SIZE}`);
    const _rawRes = (await result.json());

    // const _rawRes = await provider.send("ots_searchTransactionsAfter", [
    //   address,
    //   baseBlock,
    //   PAGE_SIZE,
    // ]);
    return rawToProcessed(provider, _rawRes);
  }

  
 static async readLastTransactions(
    provider: JsonRpcProvider,
    config: any
  ): Promise<TransactionChunk | undefined> {

    const host = config?.apiURL;

    let result = await fetch(`${host}/get-last-transactions`);
    let _rawRes = (await result.json());

    if (_rawRes.tx !== undefined) {

    // const _rawRes = await provider.send("ots_searchTransactionsAfter", [
    //   address,
    //   baseBlock,
    //   PAGE_SIZE,
    // ]);

    _rawRes.txs = _rawRes.tx
    return rawToProcessed(provider, _rawRes);
    } return undefined;
  }

  static async firstPage(
    provider: JsonRpcProvider,
    address: string,
    config: any
  ): Promise<SearchController> {
    const newTxs = await SearchController.readBackPage(provider, address, 0, config);
    return new SearchController(
      address,
      newTxs.txs,
      newTxs.firstPage,
      newTxs.lastPage,
      true
    );
  }

  static async middlePage(
    provider: JsonRpcProvider,
    address: string,
    hash: string,
    next: boolean,
    config: any
  ): Promise<SearchController> {
    const tx = await provider.getTransaction(hash);
    const newTxs = next
      ? await SearchController.readBackPage(provider, address, tx.blockNumber!, config)
      : await SearchController.readForwardPage(
          provider,
          address,
          tx.blockNumber!,
          config
        );
    return new SearchController(
      address,
      newTxs.txs,
      newTxs.firstPage,
      newTxs.lastPage,
      next
    );
  }

  static async lastPage(
    provider: JsonRpcProvider,
    address: string,
    config: any
  ): Promise<SearchController> {
    const newTxs = await SearchController.readForwardPage(provider, address, 0, config);
    return new SearchController(
      address,
      newTxs.txs,
      newTxs.firstPage,
      newTxs.lastPage,
      false
    );
  }

  getPage(): ProcessedTransaction[] {
    return this.txs.slice(this.pageStart, this.pageEnd);
  }

  async prevPage(
    provider: JsonRpcProvider,
    hash: string,
    config: any
  ): Promise<SearchController> {
    // Already on this page
    if (this.txs[this.pageEnd - 1].hash === hash) {
      return this;
    }

    if (this.txs[this.pageStart].hash === hash) {
      const overflowPage = this.txs.slice(0, this.pageStart);
      const baseBlock = this.txs[0].blockNumber;
      const prevPage = await SearchController.readForwardPage(
        provider,
        this.address,
        baseBlock,
        config
      );
      return new SearchController(
        this.address,
        prevPage.txs.concat(overflowPage),
        prevPage.firstPage,
        prevPage.lastPage,
        false
      );
    }

    return this;
  }

  async nextPage(
    provider: JsonRpcProvider,
    hash: string,
    config: any
  ): Promise<SearchController> {
    // Already on this page
    if (this.txs[this.pageStart].hash === hash) {
      return this;
    }

    if (this.txs[this.pageEnd - 1].hash === hash) {
      const overflowPage = this.txs.slice(this.pageEnd);
      const baseBlock = this.txs[this.txs.length - 1].blockNumber;
      const nextPage = await SearchController.readBackPage(
        provider,
        this.address,
        baseBlock,
        config
      );
      return new SearchController(
        this.address,
        overflowPage.concat(nextPage.txs),
        nextPage.firstPage,
        nextPage.lastPage,
        true
      );
    }

    return this;
  }
}

const doSearch = async (q: string, navigate: NavigateFunction) => {
  // Cleanup
  q = q.trim();

  let maybeAddress = q;
  let maybeIndex = "";
  const sepIndex = q.lastIndexOf(":");
  if (sepIndex !== -1) {
    maybeAddress = q.substring(0, sepIndex);
    maybeIndex = q.substring(sepIndex + 1);
  }

  // Plain address?
  if (isAddress(maybeAddress)) {
    navigate(
      `/address/${maybeAddress}${
        maybeIndex !== "" ? `?nonce=${maybeIndex}` : ""
      }`,
      { replace: true }
    );
    return;
  }

  // Tx hash?
  if (isHexString(q, 32)) {
    navigate(`/tx/${q}`, { replace: true });
    return;
  }

  // Block number?
  const blockNumber = parseInt(q);
  if (!isNaN(blockNumber)) {
    navigate(`/block/${blockNumber}`, { replace: true });
    return;
  }

  // Epoch?
  if (q.startsWith("epoch:")) {
    const mayBeEpoch = q.substring(6);
    const epoch = parseInt(mayBeEpoch);
    if (!isNaN(epoch)) {
      navigate(`/epoch/${epoch}`, { replace: true });
      return;
    }
  }

  // Slot?
  if (q.startsWith("slot:")) {
    const mayBeSlot = q.substring(5);
    const slot = parseInt(mayBeSlot);
    if (!isNaN(slot)) {
      navigate(`/slot/${slot}`, { replace: true });
      return;
    }
  }

  // Validator?
  if (q.startsWith("validator:")) {
    const mayBeValidator = q.substring(10);

    // Validator by index
    if (mayBeValidator.match(/^\d+$/)) {
      const validatorIndex = parseInt(mayBeValidator);
      navigate(`/validator/${validatorIndex}`, { replace: true });
      return;
    }

    // Validator by public key
    if (mayBeValidator.length === 98 && isHexString(mayBeValidator, 48)) {
      navigate(`/validator/${mayBeValidator}`, { replace: true });
      return;
    }
  }

  // Assume it is an ENS name
  navigate(
    `/address/${maybeAddress}${
      maybeIndex !== "" ? `?nonce=${maybeIndex}` : ""
    }`,
    { replace: true }
  );
};

export const useGenericSearch = (): [
  RefObject<HTMLInputElement>,
  ChangeEventHandler<HTMLInputElement>,
  FormEventHandler<HTMLFormElement>
] => {
  const [searchString, setSearchString] = useState<string>("");
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const searchTerm = e.target.value.trim();
    setCanSubmit(searchTerm.length > 0);
    setSearchString(searchTerm);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!canSubmit) {
      return;
    }

    if (searchRef.current) {
      searchRef.current.value = "";
    }
    doSearch(searchString, navigate);
  };

  const searchRef = useRef<HTMLInputElement>(null);
  useKeyboardShortcut(["/"], () => {
    searchRef.current?.focus();
  });

  return [searchRef, handleChange, handleSubmit];
};
