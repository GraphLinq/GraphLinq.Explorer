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
      {provider ? (
        <>Using Graphlinq node at {provider.connection.url}</>
      ) : (
        <>Waiting for the provider...</>
      )}
    </div>
  );
};

export default React.memo(Footer);
