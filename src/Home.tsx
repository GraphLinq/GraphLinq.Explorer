import { useMemo, useState, useEffect, useContext, lazy, FC, memo } from "react";
import { NavLink } from "react-router-dom";
import { commify } from "@ethersproject/units";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBurn, faQrcode } from "@fortawesome/free-solid-svg-icons";
import Logo from "./Logo";
import Timestamp from "./components/Timestamp";
import { useLatestBlockHeader } from "./useLatestBlock";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { AppConfig, AppConfigContext } from "./useAppConfig";
import { blockURL, slotURL } from "./url";
import { useGenericSearch } from "./search/search";
import { useFinalizedSlotNumber, useSlotTimestamp } from "./useConsensus";
import { SourcifySource } from "./sourcify/useSourcify";
import { SearchController } from "./search/search";
import ResultHeader from "./search/ResultHeader";
import { useFeeToggler } from "./search/useFeeToggler";
import TransactionItem from "./search/TransactionItem";
import MethodName from "./components/MethodName";
import BlockLink from "./components/BlockLink";
import TransactionLink from "./components/TransactionLink";
import TimestampAge from "./components/TimestampAge";
import TransactionDirection, {
  Direction,
  Flags,
} from "./components/TransactionDirection";
import TransactionValue from "./components/TransactionValue";
import TransactionItemFiatFee from "./search/TransactionItemFiatFee";
import { ProcessedTransaction } from "./types";
import { FeeDisplay } from "./search/useFeeToggler";
import { RuntimeContext } from "./useRuntime";
import { useSendsToMiner } from "./useErigonHooks";
import { formatValue } from "./components/formatter";
import TransactionAddressHome from "./components/TransactionAddressHome";
import TransactionAddress from "./components/TransactionAddress";
import { BlockNumberContext } from "./useBlockTagContext";
import StandardSelectionBoundary from "./selection/StandardSelectionBoundary"
import { useConfig } from "./useConfig";

const CameraScanner = lazy(() => import("./search/CameraScanner"));

const Home: FC = () => {

  const [controller, setController] = useState<SearchController>();
  const [feeDisplay, feeDisplayToggler] = useFeeToggler();
  const [sourcifySource, setSourcifySource] = useState<SourcifySource>(
    SourcifySource.IPFS_IPNS
  );



  const appConfig = useMemo((): AppConfig => {
    return {
      sourcifySource,
      setSourcifySource,
    };
  }, [sourcifySource, setSourcifySource]);

  const { provider } = useContext(RuntimeContext);
  const [searchRef, handleChange, handleSubmit] = useGenericSearch();

  const latestBlock = useLatestBlockHeader(provider);
  const finalizedSlotNumber = useFinalizedSlotNumber();
  const slotTime = useSlotTimestamp(finalizedSlotNumber);
  const [isScanning, setScanning] = useState<boolean>(false);
  const [txs, setTxs] = useState([]);
  const config = useConfig();

  useEffect(() => {
    if (provider === undefined) return;
    SearchController.readLastTransactions(provider, config).then((res: any) => {
      if (res.txs) {
        setTxs(res.txs)
      }
    })

  }, [latestBlock, provider]);

  document.title = "Home | Graphlinq Explorer";

  return (
    <div className="flex grow flex-col">
      <AppConfigContext.Provider value={appConfig}>
        <Header hideLogo={true} />
        <Outlet />
      </AppConfigContext.Provider>
      <div className="flex grow flex-col items-center pb-5">
        {/* {isScanning && <CameraScanner turnOffScan={() => setScanning(false)} />} */}
        <div className="home-logo mt-5 mb-10 flex max-h-64 grow items-end">
          <Logo />
        </div>
        <form
          className="home-form flex w-1/3 flex-col"
          onSubmit={handleSubmit}
          autoComplete="off"
          spellCheck={false}
        >
          <div className="mb-10 flex">
            <input
              className="w-full rounded-l border-l border-t border-b px-2 py-1 focus:outline-none big"
              type="text"
              size={50}
              placeholder={`Search by address / txn hash / block number${provider?.network.ensAddress ? " / ENS name" : ""
                }`}
              onChange={handleChange}
              ref={searchRef}
              autoFocus
            />
            {/* <button
              className="flex items-center justify-center rounded-r border bg-skin-button-fill px-2 py-1 text-base text-skin-button hover:bg-skin-button-hover-fill focus:outline-none"
              type="button"
              // onClick={() => setScanning(true)}
              title="Scan an ETH address using your camera"
            >
              <FontAwesomeIcon icon={faQrcode} />
            </button> */}
          </div>
          <button
            className="mx-auto mb-10 rounded bg-skin-button-fill px-3 py-1 hover:bg-skin-button-hover-fill focus:outline-none bt btm"
            type="submit"
          >
            Search
          </button>
        </form>
        {/* {latestBlock && (
          <NavLink
            className="mt-5 flex flex-col items-center space-y-1 text-sm text-gray-500 hover:text-link-blue latest-block"
            to={blockURL(latestBlock.number)}
          >
            <div className="latest-block-title">
              <span>Latest block: {commify(latestBlock.number)}</span>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#2334ff"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8z" /></svg>
            </div>
            <div className="info">
              <Timestamp value={latestBlock.timestamp} />
            </div>
          </NavLink>
        )} */}

        {txs.length > 0 && 
        
          (
            <>
                      <div className="latest-block-title">
              <span>Last 50 transactions</span>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#2334ff"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8z" /></svg>
            </div>
          <div className="block-content home-latest-blocks rounded-lg">
          <div className="address-wrapper">
                   
                  <ResultHeader
                  feeDisplay={feeDisplay}
                  feeDisplayToggler={feeDisplayToggler}
                />


      {txs.map((tx: ProcessedTransaction) => {      
        let direction: Direction | undefined;
        direction = Direction.OUT;
        return (
          <BlockNumberContext.Provider key={tx.hash} value={tx.blockNumber}>
            <div
              className={`grid grid-cols-12 gap-x-4 text-sm ${
                  "hover:bg-skin-table-hover"
              } px-2 py-3`}
            >
              <span className="col-span-2">
                <TransactionLink txHash={tx.hash} fail={tx.status === 0} />
              </span>
              {tx.to !== null ? <MethodName data={tx.data} /> : <span></span>}
              <span>
                <BlockLink blockTag={tx.blockNumber} />
              </span>
              <TimestampAge timestamp={tx.timestamp ?? 0} />
              <span className="col-span-2 flex items-baseline justify-between space-x-2 pr-2">
                <span className="truncate">
                  {tx.from && (
                    <TransactionAddressHome
                      address={tx.from}
                      miner={tx.miner === tx.from}
                    />
                  )}
                </span>

              </span>
              <span
                className="col-span-2 flex items-baseline"
                title={tx.to ?? tx.createdContractAddress}
              >
                <span className="truncate">
                  {tx.to ? (
                    <TransactionAddressHome
                      address={tx.to}
                      miner={tx.miner === tx.to}
                      showCodeIndicator
                    />
                  ) : (
                    <TransactionAddressHome
                      address={tx.createdContractAddress!}
                      creation
                      showCodeIndicator
                    />
                  )}
                </span>
              </span>
              <span className="col-span-2 truncate">
                <TransactionValue value={tx.value} />
              </span>
              <span className="truncate font-balance text-xs text-gray-500">
                {feeDisplay === FeeDisplay.TX_FEE && formatValue(tx.fee, 18)}
                {feeDisplay === FeeDisplay.TX_FEE_USD && (
                  <TransactionItemFiatFee blockTag={tx.blockNumber} fee={tx.fee} />
                )}
                {feeDisplay === FeeDisplay.GAS_PRICE && formatValue(tx.gasPrice, 9)}
              </span>
            </div>
          </BlockNumberContext.Provider>
        );
        })
      
        }
         
        </div>
        </div>
        </>)}

   

        {finalizedSlotNumber !== undefined && (
          <NavLink
            className="mt-5 flex flex-col items-center space-y-1 text-sm text-gray-500 hover:text-link-blue"
            to={slotURL(finalizedSlotNumber)}
          >
            <div>Finalized slot: {commify(finalizedSlotNumber)}</div>
            {slotTime && <Timestamp value={slotTime} />}
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default memo(Home);
