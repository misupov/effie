import { ReactElement, createElement } from "react";
import { collectChildren } from "./iterator";
import { $stateType, State } from "./types";

let keyCounter = 0;
export function resetKeyCounter() {
  keyCounter = 0;
}

export function from<TF extends (props?: any) => State<any>>(
  fn: TF,
  props?: Parameters<TF>[0] & {
    key?: any;
    ref?: React.Ref<ReturnType<TF>[typeof $stateType]>;
  }
): ReturnType<TF> {
  const propsNoRef = { ...props, key: props?.key ?? keyCounter++ };
  delete (propsNoRef as any).ref;
  const el = createElement(
    () => {
      const result = fn(props);
      const children: ReactElement[] = [];
      collectChildren(result, children);
      return createElement(fn.name, {
        state: result,
        children,
        ref: props?.ref,
      });
    },
    propsNoRef
  );
  el.type.displayName = fn.name;
  return el as any;
}
