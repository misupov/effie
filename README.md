# Rehoox

Welcome to Rehoox, the friendly and powerful state management library for React applications! With Rehoox, you can harness the full potential of Functional components and React Hooks to effortlessly manage your application state.

## What problems does Rehoox solve?

We all love React Hooks, don't we? The more we learn about them, the more we want to refactor our code and eliminate other cumbersome approaches like singleton fetch API instances, factory methods, and dependency injection techniques.

However, hooks do come with their limitations.

Firstly, hooks cannot be used outside of the React context. This means you can't use hooks, for example, in Redux's reducers.

Secondly, the order and count of hooks within a single component must remain the same across re-renders. This can be a challenge when you want to create an array of hooks and load multiple resources simultaneously, like with TanStack's useQuery. To work around this limitation, you may resort to a hacky approach of creating a list of invisible components, each invoking useQuery and pushing the query result to a global application state (such as the Redux store) or updating React Context.

Lastly, it's common to need data retrieved from a backend API in multiple places. The naive approach would be to use the useEffect hook every time you need to fetch the data. However, this leads to multiple requests for the same data from multiple components. To share data between components, you can use React Contexts or libraries like React Query, SWR, or Apollo Client. These libraries maintain internal caches and minimize duplicate requests. But personally, I believe in keeping the application state and mutation logic separate from the presentation layer.

With Rehoox, you can overcome these challenges and enjoy a clean and efficient state management solution. Let's dive in and unleash the power of Rehoox in your projects!

## Create a store

To get started with Rehoox, you'll need to create a store for your application state. This process is similar to Redux:

```typescript
import { createStore, useSelector } from "react-rehoox";
import { RootStore } from "./RootStore";

export const store = createStore(RootStore);
export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector = useSelector.withTypes<RootState>();
```

Here, we import the necessary functions from `"react-rehoox"` and define our store using the `createStore` function. We also define the `RootState` type, which represents the type of our store's state. Additionally, we create a custom hook `useAppSelector` using `useSelector.withTypes<RootState>()` to access the state within our components.

Now, let's take a closer look at the `RootStore`.

```typescript
import { from, state } from "react-rehoox";

export function RootStore() {
  const [ids, setIds] = useState([1, 2, 3]);

  return state({
    state1: from(State1),
    state2: from(State2),
    arrayOfStates: ids.map((id) => from(StateWithId, { id })),
    setIds,
  });
}
```

In the `RootStore` function, we define our application's state. It resembles a React Functional Component and returns a state object that consists of several sub-components. Here, we use the `useState` hook to manage the `ids` state. The `arrayOfStates` field is dynamically created based on the length of the `ids` state, using the `map` function to generate sub-states of type `StateWithId`. The code of `State1`, `State2` and `StateWithId` is not listed here, but you can imagine they are similar to the `RootStore` - they can use hooks and return some properties and mutation functions.

Now, let's see how you can use the store in your code:

```typescript
store.getState().setIds([4, 5, 6]);
```

## Using store from React Components

If you are within a React component, you can use the `useAppSelector` hook to access the state and actions:

```typescript
function MyComponent() {
  const { setIds, arrayOfStates } = useAppSelector((state) => state);

  return (
    <>
      <div>
        { arrayOfStates.map((state) => <StateComponent key={state.id} state={state} />) }
      </div>
      <button onClick={() => setIds([4, 5, 6])}>Set IDs</button>
    </>;
  );
}
```

In the above example, we use the `useAppSelector` hook to extract the `setIds` and `arrayOfStates` from the store's state. We can then use them in our component to render the `StateComponent` for each state and update the ids state by clicking the button.

With Rehoox, managing your application state becomes a breeze, allowing you to focus on building amazing user experiences. Let's continue exploring the powerful features of Rehoox!
