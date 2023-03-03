import { FC, memo } from "react";

type PercentageGaugeProps = {
  perc: number;
  bgColor: string;
  bgColorPerc: string;
  textColor: string;
};

const PercentageGauge: FC<PercentageGaugeProps> = ({
  perc,
  bgColor,
  bgColorPerc,
  textColor,
}) => (
  <div className="relative h-6 w-60 border-l-2 border-gray-400">
    <div className="absolute flex h-full w-60">
      <div className={`my-auto h-5 w-60 rounded-r-lg ${bgColor}`}></div>
    </div>
    <div className="absolute flex h-full w-60">
      <div
        className={`my-auto h-5 rounded-r-lg ${bgColorPerc}`}
        style={{ width: `${perc}%` }}
      ></div>
    </div>
    <div
      className={`text-sans absolute flex h-full w-60 mix-blend-multiply ${textColor}`}
    >
      <span className="m-auto">{perc}%</span>
    </div>
  </div>
);

export default memo(PercentageGauge);
