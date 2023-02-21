import { FC, useContext } from "react";
import Blockies from "react-blockies";
import { AddressAwareComponentProps } from "../execution/types";
import StandardSubtitle from "../StandardSubtitle";
import Copy from "../components/Copy";
import Faucet from "../components/Faucet";
import AddressAttributes from "./AddressAttributes";
import { RuntimeContext } from "../useRuntime";
import { useChainInfo } from "../useChainInfo";

type AddressSubtitleProps = AddressAwareComponentProps & {
  isENS: boolean | undefined;
  addressOrName: string;
};

const AddressSubtitle: FC<AddressSubtitleProps> = ({
  address,
  isENS,
  addressOrName,
}) => {
  const { config } = useContext(RuntimeContext);
  const { network, faucets } = useChainInfo();

  return (
    <StandardSubtitle>
      <div className="flex items-baseline space-x-2">
        <Blockies
          className="self-center rounded"
          seed={address.toLowerCase()}
          scale={3}
        />
        <span>Address</span>
        <span className="font-address text-base text-gray-500">{address}</span>
        <Copy value={address} rounded />
        {/* Only display faucets for testnets who actually have any */}
        {network === "testnet" && faucets && faucets.length > 0 && (
          <Faucet address={address} rounded />
        )}
        {isENS && (
          <span className="rounded-lg bg-gray-200 px-2 py-1 text-xs text-gray-500">
            ENS: {addressOrName}
          </span>
        )}
        {config?.experimental && <AddressAttributes address={address} full />}
      </div>
    </StandardSubtitle>
  );
};

export default AddressSubtitle;
