import { createElement, useSyncExternalStore } from "react";
import { from } from "./from";
import reconciler from "./reconciler";
import { InferStateType, State, Store } from "./types";
import { StoreProvider } from "./StoreProvider";

class Container {
  version = 0;
  state: any;
  subscribers: Set<() => void> = new Set();
  setState = (newState: any) => {
    this.version++;
    this.state = newState;
    this.subscribers.forEach((s) => s());
  };
  subscribe = (onStateChange: () => void) => {
    this.subscribers.add(onStateChange);
    return () => {
      this.subscribers.delete(onStateChange);
    };
  };
}

export function createStore<T extends State<any>>(
  stateFunction: () => T
): Store<T> {
  const root = new Container();
  const container = reconciler.createContainer(
    root,
    0,
    null,
    false,
    false,
    "",
    () => {},
    null
  );

  reconciler.updateContainer(from(stateFunction, undefined), container);

  const store: Partial<Store<T>> = {
    getState() {
      return root.state;
    },
    useSelector<O>(selector: (state: InferStateType<T>) => O): O {
      let prevStateVersion = 0;
      let prevSelection: O;
      return useSyncExternalStore(root.subscribe, () => {
        if (root.version === prevStateVersion) {
          return prevSelection;
        }
        const selection = selector(root.state);
        prevStateVersion = root.version;
        prevSelection = selection;
        return selection;
      });
    },
  };

  store.Provider = (props) => {
    return StoreProvider({
      store: store as Store<T>,
      children: props.children,
    });
  };

  return store as Store<T>;
}
