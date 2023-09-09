import { useState, useEffect } from "react";
import { Block } from "@ethersproject/abstract-provider";
import { JsonRpcProvider } from "@ethersproject/providers";

export const useLatestTotalSupply = (provider?: JsonRpcProvider) => {
  const [latestTotalSupply, setLatestTotalSupply] = useState<any>();

  useEffect(() => {
    if (!provider) {
      return;
    }
    // Immediately read and set the latest block number
    const readLatestTotalSupply = async () => {
      let information: any = undefined;

      try {
        let host = `https://api-explorer.graphlinq.io`;
        const result = await fetch(`${host}/get-total-supply`);
        information = await result.json();
      } catch (e) {}
      setLatestTotalSupply(information);
    };
    readLatestTotalSupply();
    return () => { };
  }, [provider]);

  return latestTotalSupply;
};
