import { createContext, useContext } from "react";
import { Fetcher } from "swr";
import useSWRImmutable from "swr/immutable";
import { OtterscanRuntime } from "./useRuntime";

export type ChainInfo = {
  network: string | undefined;
  faucets: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
};

export const defaultChainInfo: ChainInfo = {
  network: undefined,
  faucets: [],
  nativeCurrency: {
    name: "GLQ",
    symbol: "GLQ",
    decimals: 18,
  },
};

export const ChainInfoContext = createContext<ChainInfo | undefined>(undefined);

const chainInfoFetcher: Fetcher<ChainInfo, [string, number]> = async ([
  assetsURLPrefix,
  chainId,
]) => {
  const info: ChainInfo = {
    network: "GraphLinq",
    faucets: [],
    nativeCurrency: {
      name: "GLQ",
      symbol: "GLQ",
      decimals: 18,
    }
  };
  return info;
};

export const useChainInfoFromMetadataFile = (
  runtime: OtterscanRuntime | undefined
): ChainInfo | undefined => {
  const assetsURLPrefix = runtime?.config?.assetsURLPrefix;
  const chainId = runtime?.provider?.network.chainId;

  const { data, error } = useSWRImmutable(
    assetsURLPrefix !== undefined && chainId !== undefined
      ? [assetsURLPrefix, chainId]
      : null,
    chainInfoFetcher
  );
  if (error) {
    return defaultChainInfo;
  }
  return data;
};

export const useChainInfo = (): ChainInfo => {
  const chainInfo = useContext(ChainInfoContext);
  if (chainInfo === undefined) {
    throw new Error("no chain info");
  }
  return chainInfo;
};
