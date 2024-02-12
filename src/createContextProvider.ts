import { createElement } from "react";

export type ContextProvider = (children: any[]) => React.ReactElement;

export function createContextProvider<
  TContextProvider extends (props: TContextProviderProps) => React.ReactElement,
  TContextProviderProps extends {} = any
>(
  fn: TContextProvider,
  props: TContextProviderProps
): ContextProvider {
  return (children) => createElement(fn, { ...props, children });
}
