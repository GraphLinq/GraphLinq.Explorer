import React from "react";
import ContentFrame from "../ContentFrame";
import StandardSelectionBoundary from "../selection/StandardSelectionBoundary";
import PageControl from "../search/PageControl";
import ResultHeader from "../search/ResultHeader";
import PendingResults from "../search/PendingResults";
import TransactionItem from "../search/TransactionItem";
import { useFeeToggler } from "../search/useFeeToggler";
import { ProcessedTransaction } from "../types";
import { PAGE_SIZE } from "../params";

type BlockTransactionResultsProps = {
  page?: ProcessedTransaction[];
  total: number;
  pageNumber: number;
};

const BlockTransactionResults: React.FC<BlockTransactionResultsProps> = ({
  page,
  total,
  pageNumber,
}) => {
  const [feeDisplay, feeDisplayToggler] = useFeeToggler();

  return (
    <ContentFrame>
      <div className="flex items-baseline justify-between py-3">
        <div className="text-sm text-gray-500">
          {page === undefined ? (
            <>Waiting for search results...</>
          ) : (
            <>A total of {total} transactions found</>
          )}
        </div>
        <PageControl
          pageNumber={pageNumber}
          pageSize={PAGE_SIZE}
          total={total}
        />
      </div>
      <ResultHeader
        feeDisplay={feeDisplay}
        feeDisplayToggler={feeDisplayToggler}
      />
      {page ? (
        <StandardSelectionBoundary>
          {page.map((tx) => (
            <TransactionItem key={tx.hash} tx={tx} feeDisplay={feeDisplay} />
          ))}
          <div className="flex items-baseline justify-between py-3">
            <div className="text-sm text-gray-500">
              A total of {total} transactions found
            </div>
            <PageControl
              pageNumber={pageNumber}
              pageSize={PAGE_SIZE}
              total={total}
            />
          </div>
        </StandardSelectionBoundary>
      ) : (
        <PendingResults />
      )}
    </ContentFrame>
  );
};

export default React.memo(BlockTransactionResults);
