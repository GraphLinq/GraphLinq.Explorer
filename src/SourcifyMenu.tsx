import React, { PropsWithChildren } from "react";
import { Menu } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useAppConfigContext } from "./useAppConfig";
import { SourcifySource } from "./sourcify/useSourcify";

const SourcifyMenu: React.FC = () => {
  const { sourcifySource, setSourcifySource } = useAppConfigContext();

  return (
    <Menu>
      <div className="relative self-stretch">
        <Menu.Button className="flex h-full w-full items-center justify-center space-x-2 rounded border px-2 py-1 text-sm">
          <FontAwesomeIcon icon={faBars} size="1x" />
        </Menu.Button>
        <Menu.Items className="absolute right-0 mt-1 flex min-w-max flex-col rounded-b border bg-white p-1 text-sm">
          <div className="border-b border-gray-300 px-2 py-1 text-xs">
            Links
          </div>
          <SourcifyMenuItem
            checked={true}
            onClick={() => {}}
          >
            <a href="https://status.graphlinq.io" target="_blank">Chain Status
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={16} display={"-webkit-inline-box"}>
                <path fill="#6b7c93" d="M5.64,4.22H19.78V18.36L15.54,14.12L9.88,19.78L4.22,14.12L9.88,8.46L5.64,4.22M17.66,6.34H10.59L12.71,8.46L7.05,14.12L9.88,16.95L15.54,11.29L17.66,13.41V6.34H17.66Z" />
              </svg>
            </a>
          </SourcifyMenuItem>
          <SourcifyMenuItem
            checked={true}
            onClick={() => {}}
          >
            <a href="https://app.graphlinq.io" target="_blank">Application
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={16} display={"-webkit-inline-box"}>
                <path fill="#6b7c93" d="M5.64,4.22H19.78V18.36L15.54,14.12L9.88,19.78L4.22,14.12L9.88,8.46L5.64,4.22M17.66,6.34H10.59L12.71,8.46L7.05,14.12L9.88,16.95L15.54,11.29L17.66,13.41V6.34H17.66Z" />
              </svg>
            </a>
          </SourcifyMenuItem>
          <SourcifyMenuItem
            checked={true}
            onClick={() => {}}
          >
            <a href="https://app.graphlinq.io" target="_blank">Bridge
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={16} display={"-webkit-inline-box"}>
                <path fill="#6b7c93" d="M5.64,4.22H19.78V18.36L15.54,14.12L9.88,19.78L4.22,14.12L9.88,8.46L5.64,4.22M17.66,6.34H10.59L12.71,8.46L7.05,14.12L9.88,16.95L15.54,11.29L17.66,13.41V6.34H17.66Z" />
              </svg>
            </a>
          </SourcifyMenuItem>
          {/* <SourcifyMenuItem
            checked={sourcifySource === SourcifySource.IPFS_IPNS}
            onClick={() => setSourcifySource(SourcifySource.IPFS_IPNS)}
          >
            Resolve IPNS
          </SourcifyMenuItem> */}
          {/* <SourcifyMenuItem
            checked={sourcifySource === SourcifySource.CENTRAL_SERVER}
            onClick={() => setSourcifySource(SourcifySource.CENTRAL_SERVER)}
          >
            Sourcify Servers
          </SourcifyMenuItem> */}
        </Menu.Items>
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
        className={`px-2 py-1 text-left text-sm ${
          active ? "border-orange-200 text-gray-500" : "text-gray-400"
        } transition-transform transition-colors duration-75 ${
          checked ? "text-gray-900" : ""
        }`}
        onClick={onClick}
      >
        {children}
      </button>
    )}
  </Menu.Item>
);

export default React.memo(SourcifyMenu);
