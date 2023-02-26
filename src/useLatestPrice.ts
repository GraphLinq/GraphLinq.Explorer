import { useState, useEffect } from "react";
import { JsonRpcProvider } from "@ethersproject/providers";
import { useConfig } from "./useConfig";

export const useLatestPrice = (provider?: JsonRpcProvider) => {
  const [latestPrice, setLatestPrice] = useState<number>();
  const config = useConfig();

  useEffect(() => {
    if (!provider) {
      return;
    }
    const readLatestBlock = async () => {
      const response = await fetch(config?.coingeckoPriceUrl ? config?.coingeckoPriceUrl : '');
      const result = await response.json();
      if (result["market_data"] != undefined && result["market_data"]["current_price"]["usd"] != undefined) {
        setLatestPrice(Number(result["market_data"]["current_price"]["usd"]));
      }
    };
    readLatestBlock();
    return () => { };
  }, [provider]); // when provider is set

  return latestPrice;
};
