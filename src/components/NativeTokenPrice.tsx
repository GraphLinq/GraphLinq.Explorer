import { FC, memo, useContext } from "react";
import { BlockTag } from "@ethersproject/providers";
import { BigNumber } from "@ethersproject/bignumber";
import { commify } from "@ethersproject/units";
import { useChainInfo } from "../useChainInfo";
import { useLatestPrice } from "../useLatestPrice";
import { RuntimeContext } from "../useRuntime";

const TEN = BigNumber.from(10);

type NativeTokenPriceProps = {
  blockTag: BlockTag | undefined;
};

/**
 * This component displays the fiat price of the native chain token along with formatting, e.g.,
 * "$1,500.00 /ETH".
 *
 * The quote is get from internal oracle system.
 */
const NativeTokenPrice: FC<NativeTokenPriceProps> = ({ blockTag }) => {
  const {
    nativeCurrency: { symbol, decimals },
  } = useChainInfo();

  // One unit of native token, considering decimals
  const { provider } = useContext(RuntimeContext);
  const nativeTokenPrice = useLatestPrice(provider);
  return (
    <span className="text-sm">
      {nativeTokenPrice ? (
        <>
          $
          <span className="font-balance">
            {commify(nativeTokenPrice.toFixed(2).toString())}
          </span>
          <span className="text-xs text-gray-500"> / {symbol}</span>
        </>
      ) : (
        "N/A"
      )}
    </span>
  );
};

export default memo(NativeTokenPrice);
