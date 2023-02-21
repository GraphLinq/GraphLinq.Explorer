import { FC, memo } from "react";
import { Interface } from "@ethersproject/abi";
import DecodedFragment from "./DecodedFragment";
import { ABIAwareComponentProps } from "../../execution/types";

const DecodedABI: FC<ABIAwareComponentProps> = ({ abi }) => {
  const intf = new Interface(abi);
  return (
    <div className="overflow-x-auto border">
      {intf.fragments.map((f, i) => (
        <DecodedFragment key={i} intf={intf} fragment={f} />
      ))}
    </div>
  );
};

export default memo(DecodedABI);
