import React, { useContext } from "react";
import { RuntimeContext } from "./useRuntime";

const Footer: React.FC = () => {
  const { provider } = useContext(RuntimeContext);

  return (
    <div
      className={`footer w-full ${provider?.network.chainId === 614
        ? "bg-link-blue text-gray-200"
        : "bg-orange-400 text-white warning"
        } text-center`}
    >
      <a style={{margin:"20px", color:"#7272ff"}} href="#"><u>live on mainnet</u></a>  
      <>GraphLinq Network © Copyright 2023. All Rights Reserved.</>
    </div>
  );
};

export default React.memo(Footer);
