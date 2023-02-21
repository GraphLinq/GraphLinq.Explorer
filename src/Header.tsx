import { useState, useContext, memo, lazy, FC } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import PriceBox from "./PriceBox";
import SourcifyMenu from "./SourcifyMenu";
import { RuntimeContext } from "./useRuntime";
import { useGenericSearch } from "./search/search";
import Otter from "./otter.png";

const CameraScanner = lazy(() => import("./search/CameraScanner"));

const Header: FC = () => {
  const { provider } = useContext(RuntimeContext);
  const [searchRef, handleChange, handleSubmit] = useGenericSearch();
  const [isScanning, setScanning] = useState<boolean>(false);

  return (
    <>
      {isScanning && <CameraScanner turnOffScan={() => setScanning(false)} />}
      <div className="flex items-baseline justify-between px-9 py-2">
        <Link className="self-center" to="/">
          <div className="flex items-center space-x-2 font-title text-2xl font-bold text-link-blue">
          <svg version="1.1" id="Calque_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 38.7 36.9" width={32}><linearGradient fill="#201B40" id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="19.1731" y1="36.9" x2="19.1731" y2="0"><stop offset="0"></stop><stop offset="1"></stop></linearGradient><path className="st0" d="M28.4,36.9L28.4,36.9h-16c-1.6,0-3.1-0.9-3.9-2.3L0.4,20.7c-0.8-1.4-0.8-3.1,0-4.4L8.5,2.2
          C9.3,0.8,10.7,0,12.3,0h16.1c1.6,0,3.2,0.9,4,2.3l5.8,10.1c0.1,0.1,0.1,0.3,0,0.4c0,0.1-0.1,0.2-0.2,0.3l-2,1.1
          c-2.1,1.2-4.8,0.5-6-1.6l-3.2-5.5h-6.4v22.7h6.4l3.3-5.7l-5.5-3.2c-1.1-0.6-1.8-1.8-1.8-3.1v-5.4c0-0.2,0.1-0.3,0.2-0.4
          c0.2-0.1,0.3-0.1,0.5,0l13.3,7.6c0.9,0.5,1.5,1.3,1.7,2.2s0.1,1.9-0.4,2.8l-5.8,10C31.6,36,30.1,36.9,28.4,36.9z M12.4,35.9h16
          c1.3,0,2.5-0.7,3.2-1.8l5.8-10c0.4-0.6,0.5-1.3,0.3-2s-0.6-1.3-1.2-1.6L33.8,19L24,13.3v4.5c0,0.9,0.5,1.8,1.3,2.3l5.9,3.4
          c0.2,0.1,0.3,0.4,0.2,0.7l-3.7,6.4c-0.1,0.2-0.3,0.2-0.4,0.2h-7.5c-0.3,0-0.5-0.2-0.5-0.4c0,0,0,0,0-0.1V6.6c0-0.3,0.2-0.5,0.4-0.5
          c0,0,0,0,0.1,0h7.5c0.2,0,0.3,0.1,0.4,0.2L31,12c0.9,1.6,3,2.2,4.7,1.3l1.6-0.9l-5.6-9.6c-0.8-1.1-2-1.8-3.3-1.8l0,0H12.3
          C11.1,1,10,1.6,9.4,2.7L1.3,16.8c-0.6,1.1-0.6,2.4,0,3.4l8.1,13.9C10,35.2,11.1,35.9,12.4,35.9L12.4,35.9z M13.5,30.8
          c-0.2,0-0.3-0.1-0.4-0.2L6.2,18.8c-0.1-0.2-0.1-0.4,0-0.6l6.9-11.8c0.1-0.2,0.3-0.3,0.6-0.2c0.2,0.1,0.4,0.3,0.4,0.5v23.7
          c0,0.2-0.2,0.4-0.4,0.5C13.6,30.8,13.5,30.8,13.5,30.8z M7.2,18.4l5.8,10V8.5C13,8.5,7.2,18.4,7.2,18.4z"></path></svg>
            <span>GraphLinq<sup>explorer</sup></span>
          </div>
        </Link>
        <div className="flex items-baseline space-x-3">
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
              placeholder={`Type "/" to search by address / txn hash / block number${
                provider?.network.ensAddress ? " / ENS name" : ""
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
              className="rounded-r border-t border-b border-r bg-skin-button-fill px-2 py-1 text-sm text-skin-button hover:bg-skin-button-hover-fill focus:outline-none"
              type="submit"
            >
              Search
            </button>
          </form>
          <SourcifyMenu />
        </div>
      </div>
    </>
  );
};

export default memo(Header);
