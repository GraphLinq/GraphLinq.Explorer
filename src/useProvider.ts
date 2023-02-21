import { useEffect, useState } from "react";
import {
  JsonRpcProvider,
  JsonRpcBatchProvider,
  WebSocketProvider,
} from "@ethersproject/providers";
import { ConnectionStatus } from "./types";
import { MIN_API_LEVEL } from "./params";

export const DEFAULT_ERIGON_URL = "https://glq-dataseed.graphlinq.io";

export const useProvider = (
  chainURL?: string
): [ConnectionStatus, JsonRpcProvider | undefined] => {
  const [connStatus, setConnStatus] = useState<ConnectionStatus>(
    ConnectionStatus.CONNECTING
  );

  if (chainURL !== undefined) {
    if (chainURL === "") {
      console.info(`Using default rpc URL: ${DEFAULT_ERIGON_URL}`);
      chainURL = DEFAULT_ERIGON_URL;
    } else {
      console.log(`Using configured rpc URL: ${chainURL}`);
    }
  }
  // chainURL = DEFAULT_ERIGON_URL;

  const [provider, setProvider] = useState<JsonRpcProvider | undefined>();
  useEffect(() => {
    if (chainURL === undefined) {
      setConnStatus(ConnectionStatus.NOT_ETH_NODE);
      setProvider(undefined);
      return;
    }
    setConnStatus(ConnectionStatus.CONNECTING);

    const tryToConnect = async () => {
      let provider: JsonRpcProvider;
      if (chainURL?.startsWith("ws://") || chainURL?.startsWith("wss://")) {
        provider = new WebSocketProvider(chainURL);
      } else {
        provider = new JsonRpcBatchProvider(chainURL);
      }

      // Check if it is at least a regular ETH node
      let blockNumber: number = 0;
      try {
        blockNumber = await provider.getBlockNumber();
      } catch (err) {
        console.log(err);
        setConnStatus(ConnectionStatus.NOT_ETH_NODE);
        setProvider(undefined);
        return;
      }

      // Check if it is an Erigon node by probing a lightweight method
      try {
        await provider.send("eth_getHeaderByNumber", [`0x${blockNumber.toString(16)}`]);
      } catch (err) {
        console.log(err);
        setConnStatus(ConnectionStatus.NOT_ERIGON);
        setProvider(undefined);
        return;
      }

      setConnStatus(ConnectionStatus.CONNECTED);
      setProvider(provider);
      // Check if it has Otterscan patches by probing a lightweight method
      // try {
      //   const level = await provider.send("ots_getApiLevel", []);
      //   if (level < MIN_API_LEVEL) {
      //     setConnStatus(ConnectionStatus.NOT_OTTERSCAN_PATCHED);
      //     setProvider(undefined);
      //   } else {
      //     setConnStatus(ConnectionStatus.CONNECTED);
      //     setProvider(provider);
      //   }
      // } catch (err) {
      //   console.log(err);
      //   setConnStatus(ConnectionStatus.NOT_OTTERSCAN_PATCHED);
      //   setProvider(undefined);
      // }
    };
    tryToConnect();
  }, [chainURL]);

  return [connStatus, provider];
};
