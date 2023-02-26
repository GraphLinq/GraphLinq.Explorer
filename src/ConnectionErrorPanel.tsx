import React, { PropsWithChildren } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { ConnectionStatus } from "./types";
import { OtterscanConfig } from "./useConfig";
import Logo from "./Logo";
import Loader from "./components/Loader";

type ConnectionErrorPanelProps = {
  connStatus: ConnectionStatus;
  config?: OtterscanConfig;
};

const ConnectionErrorPanel: React.FC<ConnectionErrorPanelProps> = ({
  connStatus,
  config,
}) => {
  return (
    <div className="flex h-screen flex-col font-sans">
      <div className="min-w-lg m-auto h-60 max-w-lg text-lg text-white waiting">
        <Logo/>
        <Loader/>

      {connStatus !== undefined && connStatus === ConnectionStatus.ERROR &&
                <div className="loading">  <Step type="error" msg="Error occured">
                <p>Error while trying to connect on the GraphLinq Network, please try again later, the node access for the explorer may be in maintenance.</p>
                <br/>
                </Step> </div> }


      </div>
    </div>
  );
};

type StepProps = {
  type: "wait" | "ok" | "error";
  msg: string;
};

const Step: React.FC<PropsWithChildren<StepProps>> = React.memo(
  ({ type, msg, children }) => (
    <>
      <div className="flex space-x-2">
        {type === "wait" && (
          <span className="text-white">
            <FontAwesomeIcon icon={faClock} size="1x" />
          </span>
        )}
        {type === "ok" && (
          <span className="text-emerald-600">
            <FontAwesomeIcon icon={faCheckCircle} size="1x" />
          </span>
        )}
        {type === "error" && (
          <span className="text-red-600">
            <FontAwesomeIcon icon={faTimesCircle} size="1x" />
          </span>
        )}
        <span>{msg}</span>
      </div>
      {children && <div className="ml-7 mt-4 text-sm">{children}</div>}
    </>
  )
);

export default React.memo(ConnectionErrorPanel);
