import React, { useContext } from "react";
import { RuntimeContext } from "./useRuntime";

const WarningHeader: React.FC = () => {
  const { provider } = useContext(RuntimeContext);
  const chainId = provider?.network.chainId;
  if (chainId === 1 || chainId === 614) {
    return <></>;
  }

  let chainMsg = `ChainID: ${chainId}`;
  if (chainId === 3) {
    chainMsg = "Ropsten Testnet";
  } else if (chainId === 4) {
    chainMsg = "Rinkeby Testnet";
  } else if (chainId === 5) {
    chainMsg = "Görli Testnet";
  } else if (chainId === 42) {
    chainMsg = "Kovan Testnet";
  } else if (chainId === 11155111) {
    chainMsg = "Sepolia Testnet";
  }
  return (
    <div className="w-full bg-orange-400 px-2 py-1 text-center font-bold text-white">
      You are on {chainMsg}
    </div>
  );
};

export default React.memo(WarningHeader);
