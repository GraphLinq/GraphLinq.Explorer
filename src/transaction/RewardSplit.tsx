import React, { useContext } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBurn, faCoins } from "@fortawesome/free-solid-svg-icons";
import FormattedBalance from "../components/FormattedBalance";
import PercentageGauge from "../components/PercentageGauge";
import { RuntimeContext } from "../useRuntime";
import { useBlockDataFromTransaction } from "../useErigonHooks";
import { useChainInfo } from "../useChainInfo";
import { TransactionData } from "../types";

type RewardSplitProps = {
  txData: TransactionData;
};

const parseBigInt = (str: string, base = 16) => {
  let strN = str.replace('0x', '');
  let num = 0n;
  let base2 = BigInt(base);
  for (const digit of strN) {
      num *= base2;
      num += BigInt(parseInt(digit, 16));
  }
  return num.toString();
}

const RewardSplit: React.FC<RewardSplitProps> = ({ txData }) => {
  const { provider } = useContext(RuntimeContext);
  const block = useBlockDataFromTransaction(provider, txData);

  const {
    nativeCurrency: { symbol },
  } = useChainInfo();
  const paidFees = txData.gasPrice.mul(txData.confirmedData!.gasUsed);
  const burntFees = block && provider
    ? provider.formatter.bigNumber(parseBigInt(`${block.baseFeePerGas}`)).mul(txData.confirmedData!.gasUsed)
    : BigNumber.from(0);

  const minerReward = paidFees.sub(burntFees);
  const burntPerc =
    Math.round(burntFees.mul(10000).div(paidFees).toNumber()) / 100;
  const minerPerc = Math.round((100 - burntPerc) * 100) / 100;

  return (
    <div className="inline-block">
      <div className="grid grid-cols-2 items-center gap-x-2 gap-y-1 text-sm">
        {/* <PercentageGauge
          perc={burntPerc}
          bgColor="bg-orange-100"
          bgColorPerc="bg-orange-500"
          textColor="text-orange-800"
        />
        <br></br> */}
        <div className="flex items-baseline space-x-1">
          <span className="flex space-x-1 text-orange-500">
            <span title="Burnt fees">
              <FontAwesomeIcon icon={faBurn} size="1x" />
            </span>
            <span style={{ whiteSpace: 'nowrap' }}>
              <span className="line-through">
                <FormattedBalance value={burntFees} />
              </span>{" "}
              {symbol} ({burntPerc}%)
            </span>
          </span>
        </div>
        <br></br>
        <PercentageGauge
          perc={minerPerc}
          bgColor="bg-amber-100"
          bgColorPerc="bg-amber-300"
          textColor="text-amber-700"
        />
        <br></br>
        <div className="flex items-baseline space-x-1">
          <span className="flex space-x-1">
            <span className="text-amber-300" title="Miner fees">
              <FontAwesomeIcon icon={faCoins} size="1x" />
            </span>
            <span style={{ whiteSpace: 'nowrap' }}>
              <FormattedBalance value={minerReward} symbol={symbol} /> ({minerPerc}%)
            </span>
          </span>
        </div>
        <br></br>
      </div>
    </div>
  );
};

export default React.memo(RewardSplit);
