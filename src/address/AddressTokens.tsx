import { FC, useContext, useMemo, useState } from "react";
import { Switch } from "@headlessui/react";
import { getAddress } from "@ethersproject/address";
import { AddressAwareComponentProps } from "../execution/types";
import ContentFrame from "../ContentFrame";
import StandardSelectionBoundary from "../selection/StandardSelectionBoundary";
import StandardTable from "../components/StandardTable";
import StandardTHead from "../components/StandardTHead";
import StandardTBody from "../components/StandardTBody";
import TokenBalance from "./TokenBalance";
import { RuntimeContext } from "../useRuntime";
import { useERC20Holdings } from "../useErigonHooks";
import { getWhitelistedTokenSet, useTokenSet } from "../kleros/useTokenList";

const AddressTokens: FC<AddressAwareComponentProps> = ({ address }) => {
  const { provider } = useContext(RuntimeContext);
  // const erc20List = [address]//useERC20Holdings(provider, address);

  const [enabled, setEnabled] = useState<boolean>(true);
  const tokenSet = getWhitelistedTokenSet()//useTokenSet(provider?.network.chainId);
  // const filteredList = useMemo(() => {
  //   if (erc20List === undefined) {
  //     return undefined;
  //   }
  //   return erc20List.filter((t) => tokenSet.has(getAddress(t)));
  // }, [erc20List, tokenSet]);
  // const tokenList = tokenSet;//enabled ? filteredList : erc20List;

  return (
    <ContentFrame tabs>
      {tokenSet && (
        <StandardSelectionBoundary>
          <TotalBar
            erc20List={tokenSet.map((t) => t.address)}
            filteredList={tokenSet}
            filterApplied={enabled}
            applyFilter={setEnabled}
          />
          <StandardTable>
            <StandardTHead>
              <th className="w-96">Token</th>
              <th>Balance</th>
            </StandardTHead>
            <StandardTBody>
              {tokenSet.map((t) => (
                <TokenBalance
                  key={t.address}
                  holderAddress={address}
                  tokenAddress={t.address}
                />
              ))}
            </StandardTBody>
          </StandardTable>
          <TotalBar
            erc20List={tokenSet}
            filteredList={tokenSet}
            filterApplied={enabled}
            applyFilter={setEnabled}
          />
        </StandardSelectionBoundary>
      )}
    </ContentFrame>
  );
};

type TotalBarProps = {
  erc20List: ReadonlyArray<unknown>;
  filteredList: ReadonlyArray<unknown>;
  filterApplied: boolean;
  applyFilter: (apply: boolean) => void;
};

const TotalBar: FC<TotalBarProps> = ({
  erc20List,
  filteredList,
  filterApplied,
  applyFilter,
}) => (
  <div className="flex items-baseline justify-between py-3">
    <div className="text-sm text-gray-500">
      {erc20List === undefined || filteredList === undefined ? (
        <>Waiting for search results...</>
      ) : (
        <>
          {filterApplied ? filteredList.length : erc20List.length} tokens found
          (
          <Switch
            className="hover:cursor-pointer hover:underline"
            onChange={() => applyFilter(!filterApplied)}
          >
            {filterApplied ? (
              <>{erc20List.length - filteredList.length} hidden</>
            ) : (
              <>hide spam</>
            )}
          </Switch>
          )
        </>
      )}
    </div>
  </div>
);

export default AddressTokens;
