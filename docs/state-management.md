# State Management in GlyphUI

Managing state is a crucial part of any web application. GlyphUI offers several ways to handle state, from local component state to a centralized global store.

## Local Component State

For state that is only used by a single component, you can use local state.

-   In **functional components**, you can use the `useState` hook.
-   In **class-based components**, you can use `this.state` and `this.setState()`.

This is the simplest way to manage state and should be your default choice for component-specific data.

(See the [Components](./components.md) and [Hooks](./hooks.md) docs for more details).

## The `createApp` Pattern

For simple applications where you want a single, centralized state, you can use the `createApp` function with a state object and reducers.

```javascript
import { createApp, h } from "./glyphui.js";

const initialState = {
	count: 0,
};

const reducers = {
	increment: (state, payload) => ({
		count: state.count + (payload || 1),
	}),
	decrement: (state, payload) => ({
		count: state.count - (payload || 1),
	}),
};

const AppView = (state, emit) => {
	return h("div", {}, [
		h("h1", {}, [`Count: ${state.count}`]),
		h("button", { on: { click: () => emit("increment") } }, ["+"]),
		h("button", { on: { click: () => emit("decrement") } }, ["-"]),
	]);
};

createApp({
	state: initialState,
	reducers: reducers,
	view: AppView,
}).mount(document.getElementById("app"));
```

### How it works:

1.  **`state`**: An initial state object for your application.
2.  **`reducers`**: An object of functions. Each function takes the current `state` and a `payload` and returns the new state.
3.  **`view`**: A function (similar to a functional component) that receives the current `state` and an `emit` function. It should return a VDOM tree.
4.  **`emit`**: The `emit` function is used to dispatch actions. You call it with the name of a reducer and an optional payload. `emit('increment', 5)`.

This pattern is inspired by the Elm architecture and is great for applications with simple to moderately complex state logic.

## Global Store (`createStore`)

For larger and more complex applications, GlyphUI provides a more powerful state management solution similar to Redux or Zustand, using `createStore`, `connect`, and `createActions`.

### 1. `createStore`

First, you create a store. `createStore` takes a function that gives you `set` and `get` functions to define your state and actions that modify it.

**`store.js`**

```javascript
import { createStore } from "./glyphui.js";

const myStore = createStore((set, get) => ({
	count: 0,
	user: null,
	increment: () => set((state) => ({ count: state.count + 1 })),
	setUser: (newUser) => set({ user: newUser }),
}));

export default myStore;
```

### 2. `createActions` (Optional)

You can bind action creators to the store to make it easier to call them from your components.

**`actions.js`**

```javascript
import { createActions } from "./glyphui.js";
import myStore from "./store.js";

const actions = {
	increment: (state) => ({ count: state.count + 1 }),
	setUser: (state, newUser) => ({ user: newUser }),
};

export const boundActions = createActions(myStore, actions);
```

Using `createActions` isn't strictly necessary if you define your action logic inside `createStore`, but it can help with organization.

### 3. `connect`

The `connect` function is a Higher-Order Component (HOC) that connects a component to the store.

**`MyComponent.js`**

```javascript
import { h, Component } from "./glyphui.js";
import myStore from "./store.js";
import { connect } from "./glyphui.js";

class MyComponent extends Component {
	render(props, state) {
		// The connected part of the store is available in props.store
		const { count } = props.store;
		const { increment } = myStore.getState(); // Get actions from the store

		return h("div", {}, [
			h("p", {}, [`Count: ${count}`]),
			h("button", { on: { click: increment } }, ["Increment"]),
		]);
	}
}

// Select which parts of the state the component needs.
const mapStateToProps = (state) => ({
	count: state.count,
});

export default connect(myStore, mapStateToProps)(MyComponent);
```

-   **`connect(store, selector)`**:
    -   `store`: The store instance created with `createStore`.
    -   `selector`: A function that takes the entire state and returns an object with the parts of the state your component needs. This prevents unnecessary re-renders.
-   The `connect` function returns another function that you pass your component to.
-   The selected state will be injected into your component's props under the `store` key (`this.props.store`).

This pattern provides a robust way to manage global state, ensuring that components only re-render when the data they care about actually changes.
