import React from "react";
import { FeeDisplay } from "./useFeeToggler";

export type ResultHeaderProps = {
  feeDisplay: FeeDisplay;
  feeDisplayToggler: () => void;
};

const ResultHeader: React.FC<ResultHeaderProps> = ({
  feeDisplay,
  feeDisplayToggler,
}) => (
  <div className="grid grid-cols-12 gap-x-4 text-sm font-bold pb-2">
    <div className="col-span-2">Txn Hash</div>
    <div>Method</div>
    <div>Block</div>
    <div>Age</div>
    <div className="col-span-2">From</div>
    <div className="col-span-2">To</div>
    <div className="col-span-2">Value</div>
    <div>
      <button
        className="text-link-blue hover:text-link-blue-hover"
        onClick={feeDisplayToggler}
      >
        {feeDisplay === FeeDisplay.TX_FEE && "Txn Fee"}
        {feeDisplay === FeeDisplay.TX_FEE_USD && "Txn Fee (USD)"}
        {feeDisplay === FeeDisplay.GAS_PRICE && "Gas Price"}
      </button>
    </div>
  </div>
);

export default React.memo(ResultHeader);
