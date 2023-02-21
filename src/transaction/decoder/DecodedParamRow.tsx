import { FC, memo, ReactNode, useState } from "react";
import { ParamType } from "@ethersproject/abi";
import { Switch } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { faQuestionCircle as faQuestionCircleSolid } from "@fortawesome/free-solid-svg-icons";
import Uint256Decoder from "./Uint256Decoder";
import AddressDecoder from "./AddressDecoder";
import BooleanDecoder from "./BooleanDecoder";
import BytesDecoder from "./BytesDecoder";
import DefaultDecoder from "./DefaultDecoder";
import SelectionHighlighter, {
  valueSelector,
} from "../../selection/SelectionHighlighter";

type DecodedParamRowProps = {
  prefix?: ReactNode;
  i?: number | undefined;
  r: any;
  paramType: ParamType;
  arrayElem?: number | undefined;
  help?: string | undefined;
};

const DecodedParamRow: FC<DecodedParamRowProps> = ({
  prefix,
  i,
  r,
  paramType,
  arrayElem,
  help,
}) => {
  const [showHelp, setShowHelp] = useState<boolean>(false);

  return (
    <>
      <tr className="grid grid-cols-12 gap-x-2 py-2 hover:bg-gray-100">
        <td className="col-span-3 pl-1">
          <div className="flex items-baseline space-x-2">
            <span>
              {prefix && <span className="text-gray-300">{prefix}</span>}
              {arrayElem !== undefined ? (
                <span className="text-gray-400">
                  {" "}
                  [<span className="text-black">{arrayElem}</span>]
                </span>
              ) : (
                <>
                  {paramType.name ?? <span className="italic">param_{i}</span>}{" "}
                  {i !== undefined && (
                    <span className="text-xs text-gray-400">({i})</span>
                  )}
                </>
              )}
            </span>
            {help && (
              <Switch
                checked={showHelp}
                onChange={setShowHelp}
                className="self-center text-gray-500"
              >
                <FontAwesomeIcon
                  icon={showHelp ? faQuestionCircleSolid : faQuestionCircle}
                  size="1x"
                />
              </Switch>
            )}
          </div>
          {help && showHelp && <div className="mt-2 text-gray-400">{help}</div>}
        </td>
        <td className="col-span-1 text-gray-500">{paramType.type}</td>
        <td className="col-span-8 flex break-all pr-1">
          <SelectionHighlighter
            myType="value"
            myContent={r.toString()}
            selector={valueSelector}
          >
            {paramType.baseType === "uint256" ? (
              <Uint256Decoder r={r} />
            ) : paramType.baseType === "address" ? (
              <AddressDecoder r={r.toString()} />
            ) : paramType.baseType === "bool" ? (
              <BooleanDecoder r={r} />
            ) : paramType.baseType === "bytes" ? (
              <BytesDecoder r={r} />
            ) : paramType.baseType === "tuple" ||
              paramType.baseType === "array" ? (
              <></>
            ) : (
              <DefaultDecoder r={r} />
            )}
          </SelectionHighlighter>
        </td>
      </tr>
      {paramType.baseType === "tuple" &&
        r.map((e: any, idx: number) => (
          <DecodedParamRow
            key={idx}
            prefix={
              paramType.name ? (
                paramType.name + "."
              ) : (
                <span className="italic">param_{i}.</span>
              )
            }
            i={idx}
            r={e}
            paramType={paramType.components[idx]}
          />
        ))}
      {paramType.baseType === "array" &&
        r.map((e: any, idx: number) => (
          <DecodedParamRow
            key={idx}
            prefix={paramType.name ?? <span className="italic">param_{i}</span>}
            r={e}
            paramType={paramType.arrayChildren}
            arrayElem={idx}
          />
        ))}
    </>
  );
};

export default memo(DecodedParamRow);
