import { FC, memo, useContext, useEffect, useState } from "react";
import DecoratedAddressLink from "../components/DecoratedAddressLink";
import BlockLink from "../components/BlockLink";
import TimestampAge from "../components/TimestampAge";
import CanBeEmptyText from "../components/CanBeEmptyText";
import { RuntimeContext } from "../useRuntime";
import {
  ContractMatch,
  useBlockData,
  useERC20Metadata,
} from "../useErigonHooks";
import InfoRow from "../components/InfoRow";

type ERC20temProps = {
  m: ContractMatch;
};

const ERC20Item: FC<ERC20temProps> = ({ m: { address } }) => {
  const { provider } = useContext(RuntimeContext);
  const [erc20meta, setErc20Meta] = useState<any>(undefined);

  useEffect(() => {
    if (provider && erc20meta === undefined) {
      useERC20Metadata(provider, address, 0).then(setErc20Meta);
    }
  });

  return (
    <>
    { erc20meta && (<>
      <InfoRow title="Type">ERC20 Token</InfoRow>
      <InfoRow title="Name"><CanBeEmptyText text={erc20meta.name} /></InfoRow>
      <InfoRow title="Symbol"><CanBeEmptyText text={erc20meta.symbol} /></InfoRow>
      <InfoRow title="Decimals">{ erc20meta.decimals }</InfoRow>
      <InfoRow title="TotalSupply">{ erc20meta.totalSupply }</InfoRow>
    </>)}
    </>
  );
};

export default memo(ERC20Item);
