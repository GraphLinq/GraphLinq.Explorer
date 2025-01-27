import React, { useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { AppConfig, AppConfigContext } from "./useAppConfig";
import { SourcifySource } from "./sourcify/useSourcify";

const Main: React.FC = () => {
  const [sourcifySource, setSourcifySource] = useState<SourcifySource>(
    SourcifySource.IPFS_IPNS
  );
  const appConfig = useMemo((): AppConfig => {
    return {
      sourcifySource,
      setSourcifySource,
    };
  }, [sourcifySource, setSourcifySource]);

  return (
    <AppConfigContext.Provider value={appConfig}>
      <Header hideLogo={undefined} />
      <Outlet />
    </AppConfigContext.Provider>
  );
};

export default Main;
