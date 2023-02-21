import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import NavButton from "./NavButton";
import { ChecksummedAddress } from "../types";
import { RuntimeContext } from "../useRuntime";
import { useTransactionCount } from "../useErigonHooks";

type NavNonceProps = {
  sender: ChecksummedAddress;
  nonce: number;
};

const NavNonce: React.FC<NavNonceProps> = ({ sender, nonce }) => {
  const { provider } = useContext(RuntimeContext);
  const count = useTransactionCount(provider, sender);

  return (
    <div className="flex space-x-1 self-center pl-2">
      <NavButton sender={sender} nonce={nonce - 1} disabled={nonce === 0}>
        <FontAwesomeIcon icon={faChevronLeft} />
      </NavButton>
      <NavButton
        sender={sender}
        nonce={nonce + 1}
        disabled={count === undefined || nonce >= count - 1}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </NavButton>
      <NavButton
        sender={sender}
        nonce={count !== undefined ? count - 1 : -1}
        disabled={count === undefined || nonce >= count - 1}
      >
        <FontAwesomeIcon icon={faChevronRight} />
        <FontAwesomeIcon icon={faChevronRight} />
      </NavButton>
    </div>
  );
};

export default React.memo(NavNonce);
