import React, { PropsWithChildren } from "react";
import { Menu } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useAppConfigContext } from "./useAppConfig";
import { SourcifySource } from "./sourcify/useSourcify";
import { NavLink } from "react-router-dom";

const SourcifyMenu: React.FC = () => {
  const { sourcifySource, setSourcifySource } = useAppConfigContext();

  return (
    <Menu>
      <div className="header-menu">
        <NavLink to="/coin-information">
          <span>Coin Information</span>
        </NavLink>
        <div className="header-menu-deco"></div>
        <a href="https://status.graphlinq.io" target="_blank">
          <span>Chain Status</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0V0z" /><path fill="#2334ff" d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" /></svg>
        </a>
        <div className="header-menu-deco"></div>
        <a href="https://app.graphlinq.io" target="_blank">
          <span>Application</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0V0z" /><path fill="#2334ff" d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" /></svg>
        </a>
        <div className="header-menu-deco"></div>
        <a href="https://app.graphlinq.io" target="_blank">
          <span>Bridge</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0V0z" /><path fill="#2334ff" d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" /></svg>
        </a>
      </div>
    </Menu>
  );
};

type SourcifyMenuItemProps = {
  checked?: boolean;
  onClick: () => void;
};

const SourcifyMenuItem: React.FC<PropsWithChildren<SourcifyMenuItemProps>> = ({
  checked = false,
  onClick,
  children,
}) => (
  <Menu.Item>
    {({ active }) => (
      <button
        className={`px-2 py-1 text-left text-sm ${active ? "border-orange-200 text-gray-500" : "text-gray-400"
          } transition-transform transition-colors duration-75 ${checked ? "text-gray-900" : ""
          }`}
        onClick={onClick}
      >
        {children}
      </button>
    )}
  </Menu.Item>
);

export default React.memo(SourcifyMenu);
