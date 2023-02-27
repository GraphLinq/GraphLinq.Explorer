import { FC, useContext } from "react";
import { AddressAwareComponentProps } from "../execution/types";
import AddressHighlighter from "./AddressHighlighter";
import DecoratedAddressLink from "./DecoratedAddressLink";
import { useSelectedTransaction } from "../useSelectedTransaction";
import { useBlockNumberContext } from "../useBlockTagContext";
import { RuntimeContext } from "../useRuntime";
import { useBlockDataFromTransaction, useHasCode } from "../useErigonHooks";
import { AddressContext, ChecksummedAddress } from "../types";
import PlainAddress from "./PlainAddress";

export type TransactionAddressProps = AddressAwareComponentProps & {
  selectedAddress?: ChecksummedAddress | undefined;
  addressCtx?: AddressContext | undefined;
  creation?: boolean | undefined;
  miner?: boolean | undefined;
  showCodeIndicator?: boolean;
};

const TransactionAddressHome: FC<TransactionAddressProps> = ({
  address,
  selectedAddress,
  addressCtx,
  creation,
  miner,
  showCodeIndicator = false,
}) => {
  const txData = useSelectedTransaction();
  // TODO: push down creation coloring logic into DecoratedAddressLink
  const _creation =
    creation || address === txData?.confirmedData?.createdContractAddress;

  const { provider } = useContext(RuntimeContext);
  const block = useBlockDataFromTransaction(provider, txData);

  const blockNumber = useBlockNumberContext();
  const hasCode = useHasCode(
    provider,
    address,
    blockNumber !== undefined
      ? blockNumber === "latest"
        ? "latest"
        : blockNumber - 1
      : undefined
  );

  return (
    <PlainAddress
    address={address}
    linkable={true}
    dontOverrideColors={true}
  />
  );
};

export default TransactionAddressHome;
