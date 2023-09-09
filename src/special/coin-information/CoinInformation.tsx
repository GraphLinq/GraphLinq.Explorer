import React, { useContext } from "react";
import { useLatestBlockHeader, useLatestBlockNumber } from "../../useLatestBlock";
import { RuntimeContext } from "../../useRuntime";
import StandardFrame from "../../StandardFrame";
import ContentFrame from "../../ContentFrame";
import StandardSubtitle from "../../StandardSubtitle";
import NavBlock from "../../block/NavBlock";
import InfoRow from "../../components/InfoRow";
import Loader from "../../components/Loader";
import { useLatestTotalSupply } from "../../useLatestTotalSupply";
import TransactionValue from "../../components/TransactionValue";
import { BigNumber } from "ethers";

const CoinInformation: React.FC = () => {
  const { provider } = useContext(RuntimeContext);
  const latestBlockNumber = useLatestBlockNumber(provider);
  const information: any = useLatestTotalSupply(provider);
  if (!provider || !latestBlockNumber) {
    return <div className="grow"></div>;
  }

  const numberOfBlockPerDay = 5760;
  const numberOfBlockPerYear = numberOfBlockPerDay * 365;
  const numberOfRewardsPerYear = numberOfBlockPerYear * 5;
  const percentageOfInflationPerYear = (numberOfRewardsPerYears: number, totalSupply: number) => {
    return (numberOfRewardsPerYears*100/totalSupply).toFixed(2) + ' %';
  };

  return (
    <StandardFrame>
      <StandardSubtitle>
        <div className="flex items-baseline space-x-1">
          <span className="text-white">GLQ Coin Information</span>
          <span className="text-base text-gray-500">at Block {information ? information.blockNumber : '...'}</span>
        </div>
      </StandardSubtitle>
      {information ? (
        <ContentFrame>
          <InfoRow title="Total Supply">
            <TransactionValue value={BigNumber.from(information.totalSupply + '000000000000000000')} />
          </InfoRow>
          <InfoRow title="Rewards Per Block">
            <TransactionValue value={BigNumber.from('5000000000000000000')} />
          </InfoRow>
          <InfoRow title="Number Of GLQ Rewarded Since GenesisQ (Block (14700 + 1))">
            <TransactionValue value={BigNumber.from(information.numberOfGLQRewardedSinceGENESISQ + '000000000000000000')} />
          </InfoRow>
          <InfoRow title="Number Of GLQ At Genesis Block">
            <TransactionValue value={BigNumber.from(information.numberOfGLQAtGENESISBLOCK + '000000000000000000')} />
          </InfoRow>
          <InfoRow title="Inflation Percentage on 365 lasts day">
            {percentageOfInflationPerYear(numberOfRewardsPerYear, information.totalSupply)}
          </InfoRow>
          <InfoRow title="Number of GLQ Rewards Per Year">
            <TransactionValue value={BigNumber.from(numberOfRewardsPerYear + '000000000000000000')} />
          </InfoRow>
          <InfoRow title="Last Refresh Date">
            {(new Date(information.date)).toLocaleString()}
          </InfoRow>
        </ContentFrame>
      ) : (<Loader/>)}
    </StandardFrame>
  );
};

export default React.memo(CoinInformation);
