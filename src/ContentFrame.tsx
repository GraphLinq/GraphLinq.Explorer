import React, { PropsWithChildren } from "react";

type ContentFrameProps = {
  tabs?: boolean;
};

const ContentFrame: React.FC<PropsWithChildren<ContentFrameProps>> = ({
  tabs,
  children,
}) => {
  return tabs ? (
    <div className="rounded-b-lg block-content">{children}</div>
  ) : (
    <div className="rounded-lg block-content">{children}</div>
  );
};

export default ContentFrame;
