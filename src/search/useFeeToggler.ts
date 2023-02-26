import { useState } from "react";

export enum FeeDisplay {
  TX_FEE,
  TX_FEE_USD,
  GAS_PRICE,
}

export const useFeeToggler = (): [FeeDisplay, () => void] => {
  const [feeDisplay, setFeeDisplay] = useState<FeeDisplay>(FeeDisplay.GAS_PRICE);
  const feeDisplayToggler = () => {
    setFeeDisplay(feeDisplay + 1);
    if (feeDisplay === FeeDisplay.GAS_PRICE) {
      setFeeDisplay(0);
    }
  };

  return [feeDisplay, feeDisplayToggler];
};
