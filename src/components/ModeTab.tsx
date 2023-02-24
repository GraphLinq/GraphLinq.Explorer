import { FC, PropsWithChildren } from "react";
import { Tab } from "@headlessui/react";

type ModeTabProps = {
  disabled?: boolean | undefined;
};

const ModeTab: FC<PropsWithChildren<ModeTabProps>> = ({
  disabled,
  children,
}) => (
  <Tab
    className={({ selected }) =>
      `modetab bt ${
        disabled
          ? "cursor-default border-gray-100 text-gray-300 disabled"
          : ""
      } text-xs ${selected ? "border-blue-300 active" : ""}`
    }
    disabled={disabled}
  >
    {children}
  </Tab>
);

export default ModeTab;
