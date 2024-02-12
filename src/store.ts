import { createElement, useSyncExternalStore } from "react";
import { from } from "./from";
import reconciler from "./reconciler";
import { InferStateType, State, Store } from "./types";
import { StoreProvider } from "./StoreProvider";
import { ContextProvider } from "./createContextProvider";

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

/**
 * Create a Rehoox store.
 * @param stateFunction A function that returns root state.
 * @returns Rehoox store.
 */
export function createStore<TState extends State<any>>(
  stateFunction: () => TState,
  contextProvider?: ContextProvider
): Store<TState> {
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

  if (contextProvider) {
    reconciler.updateContainer(
      contextProvider([from(stateFunction)]),
      container
    );
  } else {
    reconciler.updateContainer(from(stateFunction), container);
  }

  const store: Partial<Store<TState>> = {
    getState() {
      return root.state;
    },
    useSelector<O>(selector: (state: InferStateType<TState>) => O): O {
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
      store: store as Store<TState>,
      children: props.children,
    });
  };

  return store as Store<TState>;
}
