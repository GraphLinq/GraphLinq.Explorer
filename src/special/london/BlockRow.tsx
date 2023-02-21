import React from "react";
import { FixedNumber } from "@ethersproject/bignumber";
import { commify, formatEther } from "@ethersproject/units";
import BlockLink from "../../components/BlockLink";
import TimestampAge from "../../components/TimestampAge";
import Blip from "./Blip";
import { ExtendedBlock } from "../../useErigonHooks";
import { useChainInfo } from "../../useChainInfo";

const ELASTICITY_MULTIPLIER = 2;

type BlockRowProps = {
  block: ExtendedBlock;
  baseFeeDelta: number;
};

const BlockRow: React.FC<BlockRowProps> = ({ block, baseFeeDelta }) => {
  const {
    nativeCurrency: { symbol },
  } = useChainInfo();
  const gasTarget = block.gasLimit.div(ELASTICITY_MULTIPLIER);
  const burntFees =
    block?.baseFeePerGas && block.baseFeePerGas.mul(block.gasUsed);
  const netFeeReward = block && block.feeReward.sub(burntFees ?? 0);
  const totalReward = block.blockReward.add(netFeeReward ?? 0);

  return (
    <div className="grid grid-cols-9 gap-x-2 px-3 py-2 hover:bg-skin-table-hover">
      <div>
        <BlockLink blockTag={block.number} />
      </div>
      <div
        className={`text-right ${
          block.gasUsed.gt(gasTarget)
            ? "text-emerald-500"
            : block.gasUsed.lt(gasTarget)
            ? "text-red-500"
            : ""
        }`}
      >
        {commify(block.gasUsed.toString())}
      </div>
      <div className="text-right text-gray-400">
        {commify(gasTarget.toString())}
      </div>
      <div className="text-right">
        <div className="relative">
          <span>
            {FixedNumber.from(block.baseFeePerGas)
              .divUnsafe(FixedNumber.from(1e9))
              .round(0)
              .toUnsafeFloat()}{" "}
            Gwei
          </span>
          <Blip value={baseFeeDelta} />
        </div>
      </div>
      <div className="col-span-2 text-right">
        {commify(formatEther(totalReward))} {symbol}
      </div>
      <div className="col-span-2 text-right text-orange-500 line-through">
        {commify(formatEther(block.gasUsed.mul(block.baseFeePerGas!)))} {symbol}
      </div>
      <div className="text-right text-gray-400">
        <TimestampAge timestamp={block.timestamp} />
      </div>
    </div>
  );
};

export default React.memo(BlockRow);
