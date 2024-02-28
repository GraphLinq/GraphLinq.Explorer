import { FC, memo, useContext } from "react";
import DecoratedAddressLink from "../components/DecoratedAddressLink";
import BlockLink from "../components/BlockLink";
import TimestampAge from "../components/TimestampAge";
import { RuntimeContext } from "../useRuntime";
import { ContractMatch, useBlockData } from "../useErigonHooks";
import { useConfig } from "../useConfig";

type ContractItemProps = {
  m: ContractMatch;
};

const ContractItem: FC<ContractItemProps> = ({
  m: { address, blockNumber },
}) => {
  const { provider, config } = useContext(RuntimeContext);
  const block = useBlockData(provider, config, blockNumber.toString());

  return (
    <tr>
      <td>
        <DecoratedAddressLink address={address} plain />
      </td>
      <td>
        <BlockLink blockTag={blockNumber} />
      </td>
      <td>{block && <TimestampAge timestamp={block.timestamp} />}</td>
    </tr>
  );
};

export default memo(ContractItem);
