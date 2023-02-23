import React, { PropsWithChildren } from "react";

const StandardSubtitle: React.FC<PropsWithChildren> = ({ children }) => (
  <div className="pb-2 text-xl text-white">{children}</div>
);

export default StandardSubtitle;
