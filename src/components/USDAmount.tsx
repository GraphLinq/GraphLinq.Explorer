import { FC, memo } from "react";
import { BigNumber, FixedNumber } from "@ethersproject/bignumber";
import FiatValue from "./FiatValue";

type USDAmountProps = {
  amount: BigNumber;
  amountDecimals: number;
  quote: BigNumber;
  quoteDecimals: number;
};

// TODO: fix the duplication mess with other currency display components

/**
 * USD amounts are displayed commified with 2 decimals places and $ prefix,
 * i.e., "$1,000.00".
 */
const USDAmount: FC<USDAmountProps> = ({
  amount,
  amountDecimals,
  quote,
  quoteDecimals,
}) => {
  const value = amount.mul(quote);
  const decimals = amountDecimals + quoteDecimals;
  const fiatAmount = FixedNumber.fromValue(
    value,
    decimals,
    `ufixed256x${decimals}`
  );

  return (
    <FiatValue
      value={fiatAmount}
      borderColor="border-gray-200"
      bgColor="bg-gray-100"
      fgColor="text-gray-600"
    />
  );
};

export default memo(USDAmount);
