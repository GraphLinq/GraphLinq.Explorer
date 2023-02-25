import { useState, useContext, memo, lazy, FC } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import PriceBox from "./PriceBox";
import SourcifyMenu from "./SourcifyMenu";
import { RuntimeContext } from "./useRuntime";
import { useGenericSearch } from "./search/search";
import Otter from "./otter.png";
import { useLatestBlockHeader } from "./useLatestBlock";
import Logo from "./Logo";

const CameraScanner = lazy(() => import("./search/CameraScanner"));

const Header: FC<{ hideLogo: boolean }> = ({ hideLogo }) => {
  const { provider } = useContext(RuntimeContext);
  const [searchRef, handleChange, handleSubmit] = useGenericSearch();
  const [isScanning, setScanning] = useState<boolean>(false);

  const latestBlock = useLatestBlockHeader(provider);

  return (
    <>
      {isScanning && <CameraScanner turnOffScan={() => setScanning(false)} />}
      <div className="header">
        {!hideLogo && (
          <Link className="self-center header-logo" to="/">
            <Logo />
          </Link>
        )}
        <SourcifyMenu />
        {!hideLogo && (
          <div className="flex items-baseline space-x-3">
            <div>
              {/* GAS PRICE GWEI */}
              {latestBlock && <span className="info header-gas text-sm" >Gas: <span>{(((latestBlock as any)?.gasPrice.toString()) / 1000000000).toFixed(0)} Gwei</span></span>}
            </div>
            {provider?.network.chainId === 1 && <PriceBox />}
            <form
              className="flex"
              onSubmit={handleSubmit}
              autoComplete="off"
              spellCheck={false}
            >
              <input
                className="w-full rounded-l border-t border-b border-l px-2 py-1 text-sm focus:outline-none"
                type="text"
                size={60}
                placeholder={`Type "/" to search by address / txn hash / block number${provider?.network.ensAddress ? " / ENS name" : ""
                  }`}
                onChange={handleChange}
                ref={searchRef}
              />
              {/* <button
              className="border bg-skin-button-fill px-2 py-1 text-sm text-skin-button hover:bg-skin-button-hover-fill focus:outline-none"
              type="button"
              onClick={() => setScanning(true)}
              title="Scan an ETH address using your camera"
            >
              <FontAwesomeIcon icon={faQrcode} />
            </button> */}
              <button
                className="rounded-r ml-2 bg-skin-button-fill px-2 py-1 text-sm text-skin-button hover:bg-skin-button-hover-fill focus:outline-none bt"
                type="submit"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default memo(Header);
