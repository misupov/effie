import { ReactElement, createElement } from "react";
import { $stateType } from "./consts";
import { collectChildren } from "./iterator";
import { State } from "./types";

let keyCounter = 0;
/* @internal */
export function resetKeyCounter() {
  keyCounter = 0;
}

export function from<TStateFunction extends (props?: any) => State<TState>, TState = any>(
  fn: TStateFunction,
  props?: Parameters<TStateFunction>[0] & {
    key?: any;
    ref?: React.Ref<ReturnType<TStateFunction>[typeof $stateType]>;
  }
): ReturnType<TStateFunction> {
  const propsNoRef = { ...props, key: props?.key ?? keyCounter++ };
  delete (propsNoRef as any).ref;
  const el = createElement(() => {
    const result = fn(props);
    const children: ReactElement[] = [];
    collectChildren(result, children);
    return createElement(fn.name, {
      state: result,
      children,
      ref: props?.ref,
    });
  }, propsNoRef);
  el.type.displayName = fn.name;
  return el as any;
}
