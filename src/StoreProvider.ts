import { createContext, createElement, useContext, useState } from "react";
import { Store } from "./types";

const Context = createContext<Store<any> | undefined>(undefined);
Context.displayName = "Effie";

export interface UseSelector<StateType = unknown> {
  <TState extends StateType = StateType, Selected = unknown>(
    selector: (state: TState) => Selected
  ): Selected;

  withTypes: <
    OverrideStateType extends StateType
  >() => UseSelector<OverrideStateType>;
}

const useSelector = (<T, O = any>(selector: (state: T) => O) => {
  const store = useContext(Context);
  if (!store) {
    throw new Error("Store is not provided.");
  }
  return store?.useSelector(selector);
}) as UseSelector;

Object.assign(useSelector, {
  withTypes: <TState>() =>
    useSelector as <O>(selector: (state: TState) => O) => O,
});

export { useSelector };

export function StoreProvider<TStore extends Store<any>>({
  store,
  children,
}: React.PropsWithChildren<{ store: TStore }>) {
  const [storeValue] = useState(store);
  return createElement(Context.Provider, { value: storeValue, children });
}

export interface TypedUseSelectorHook<TState> {
  <TSelected>(selector: (state: TState) => TSelected): TSelected;
}
