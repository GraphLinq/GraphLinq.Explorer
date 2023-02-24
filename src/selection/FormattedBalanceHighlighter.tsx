import { FC, memo } from "react";
import { useSelectionContext } from "./useSelection";
import FormattedBalance, {
  FormattedBalanceProps,
} from "../components/FormattedBalance";

// TODO: replace all occurences with SelectionHighlighter and remove this component
const FormattedBalanceHighlighter: FC<FormattedBalanceProps> = ({
  value,
  ...rest
}) => {
  const [selection, setSelection] = useSelectionContext();
  const select = () => {
    setSelection({ type: "value", content: value.toString() });
  };
  const deselect = () => {
    setSelection(null);
  };

  return (
    <span
      className={`truncate rounded border border-dashed px-1 hover:border-transparent hover:bg-transparent balance-highlight ${
        selection !== null &&
        selection.type === "value" &&
        selection.content === value.toString()
          ? "active"
          : "border-transparent"
      }`}
      onMouseEnter={select}
      onMouseLeave={deselect}
    >
      <FormattedBalance value={value} {...rest} />
    </span>
  );
};

export default memo(FormattedBalanceHighlighter);
