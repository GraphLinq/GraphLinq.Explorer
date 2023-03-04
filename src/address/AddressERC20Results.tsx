import { useContext, FC } from "react";
import { useSearchParams } from "react-router-dom";
import { commify } from "@ethersproject/units";
import { AddressAwareComponentProps } from "../execution/types";
import ContentFrame from "../ContentFrame";
import StandardSelectionBoundary from "../selection/StandardSelectionBoundary";
import StandardTable from "../components/StandardTable";
import StandardTHead from "../components/StandardTHead";
import StandardTBody from "../components/StandardTBody";
import PageControl from "../search/PageControl";
import ERC20Item from "./ERC20Item";
import { RuntimeContext } from "../useRuntime";
import {
  useERC20TransferCount,
  useERC20TransferList,
  useTransactionsWithReceipts,
} from "../useErigonHooks";
import { PAGE_SIZE } from "../params";

const AddressERC20Results: FC<AddressAwareComponentProps> = ({ address }) => {
  const { provider } = useContext(RuntimeContext);

  const [searchParams] = useSearchParams();
  let pageNumber = 1;
  const p = searchParams.get("p");
  if (p) {
    try {
      pageNumber = parseInt(p);
    } catch (err) {}
  }

  const total = useERC20TransferCount(provider, address);
  const page = useERC20TransferList(provider, address, pageNumber, PAGE_SIZE);
  const matches = useTransactionsWithReceipts(
    provider,
    page?.map((p) => p.hash)
  );

  document.title = `ERC20 Transfers | GraphLinq Explorer`;

  return (
    <ContentFrame key={pageNumber} tabs>
      <div className="flex items-baseline justify-between py-3">
        <div className="text-sm text-gray-500">
          {page === undefined || total === undefined ? (
            <>Waiting for search results...</>
          ) : (
            <>A total of {commify(total)} transactions found</>
          )}
        </div>
        {total !== undefined && (
          <PageControl
            pageNumber={pageNumber}
            pageSize={PAGE_SIZE}
            total={total}
          />
        )}
      </div>
      <StandardTable>
        <StandardTHead>
          <th className="w-56">Txn Hash</th>
          <th className="w-28">Method</th>
          <th className="w-28">Block</th>
          <th className="w-28">Age</th>
          <th>From</th>
          <th>To</th>
          <th className="w-44">Value</th>
        </StandardTHead>
        {matches !== undefined ? (
          <StandardSelectionBoundary>
            <StandardTBody>
              {matches.map((m) => (
                <ERC20Item key={m.hash} address={address} p={m} />
              ))}
            </StandardTBody>
          </StandardSelectionBoundary>
        ) : (
          // <PendingResults />
          <></>
        )}
      </StandardTable>
      {page !== undefined && total !== undefined && (
        <div className="flex items-baseline justify-between py-3">
          <div className="text-sm text-gray-500">
            A total of {commify(total)} transactions found
          </div>
          <PageControl
            pageNumber={pageNumber}
            pageSize={PAGE_SIZE}
            total={total}
          />
        </div>
      )}
    </ContentFrame>
  );
};

export default AddressERC20Results;
