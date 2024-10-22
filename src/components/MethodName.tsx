import React from "react";
import { useMethodSelector } from "../use4Bytes";

type MethodNameProps = {
  data: string;
};

const MethodName: React.FC<MethodNameProps> = ({ data }) => {
  const [isSimpleTransfer, methodName, methodTitle] = useMethodSelector(data);

  return (
    <div
      className={`${
        isSimpleTransfer ? "bg-blue-500" : "bg-green-500"
      } flex max-w-max items-baseline rounded-lg px-3 py-1 text-xs`}
    >
      <p className="truncate" title={methodTitle}>
        {methodName}
      </p>
    </div>
  );
};

export default React.memo(MethodName);
