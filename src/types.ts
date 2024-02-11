import { PropsWithChildren, ReactElement } from "react";

export type State<TState> = React.ReactNode & { [$stateType]: TState };

export type InferStateType<T> = T extends State<infer S>
  ? InferStateType<S>
  : T extends Function
  ? T
  : {
      [P in keyof T]: InferStateType<T[P]>;
    };

export type Store<T> = {
  getState(): InferStateType<T>;
  useSelector<O>(selector: (state: InferStateType<T>) => O): O;
  Provider(props: PropsWithChildren): ReactElement;
};

export const $name = Symbol("name");
export const $ = Symbol("$");
export const $stateType: unique symbol = Symbol('$stateType');
