# Global State Management

While local component state is useful for UI-specific state, many applications need to share state between components. GlyphUI provides a global state management solution inspired by Zustand, making it easy to create and consume global state.

## Core Concepts

GlyphUI's state management system is built around these core concepts:

1. **Store**: A container for global state with methods for updating and subscribing to changes
2. **Actions**: Functions that modify the store's state
3. **Connect**: A function to connect components to the store

## Creating a Store

To create a global store, use the `createStore` function:

```javascript
import { createStore } from "../path/to/glyphui.js";

// Create a store with initial state
const useCounterStore = createStore({
	count: 0,
	text: "Hello, GlyphUI!",
});
```

## Adding Actions

Actions are functions that update the store state. You can create actions using the `createActions` function:

```javascript
import { createStore, createActions } from "../path/to/glyphui.js";

// Create a store with initial state
const useCounterStore = createStore({
	count: 0,
	text: "Hello, GlyphUI!",
});

// Create actions to update the store
const counterActions = createActions(useCounterStore, (setState, getState) => ({
	increment: () => {
		// Get current state
		const currentState = getState();

		// Update state
		setState({ count: currentState.count + 1 });
	},

	decrement: () => {
		setState({ count: getState().count - 1 });
	},

	reset: () => {
		setState({ count: 0 });
	},

	updateText: (newText) => {
		setState({ text: newText });
	},
}));
```

## Connecting Components to the Store

### Class Components

To connect a class component to the store, use the `connect` function:

```javascript
import { Component, h, connect } from "../path/to/glyphui.js";
import { useCounterStore, counterActions } from "./store.js";

// Create a component
class CounterDisplay extends Component {
	render(props) {
		// Access store state from props.store
		const { count, text } = props.store;

		return h("div", {}, [
			h("h2", {}, [text]),
			h("p", {}, [`Count: ${count}`]),
			h("button", { on: { click: counterActions.increment } }, [
				"Increment",
			]),
			h("button", { on: { click: counterActions.decrement } }, [
				"Decrement",
			]),
			h("button", { on: { click: counterActions.reset } }, ["Reset"]),
		]);
	}
}

// Connect the component to the store
const ConnectedCounterDisplay = connect(useCounterStore)(CounterDisplay);

// Mount the connected component
const counter = new ConnectedCounterDisplay();
counter.mount(document.getElementById("app"));
```

### Functional Components

For functional components, you can use the store directly:

```javascript
import { createComponent, h } from "../path/to/glyphui.js";
import { useCounterStore, counterActions } from "./store.js";

const CounterDisplay = createComponent(() => {
	// Get the current state from the store
	const state = useCounterStore.getState();

	// Subscribe to store updates
	useEffect(() => {
		// This will be called whenever the store state changes
		const unsubscribe = useCounterStore.subscribe(() => {
			// Force re-render when store changes
			forceUpdate();
		});

		// Cleanup subscription when component unmounts
		return unsubscribe;
	}, []);

	return h("div", {}, [
		h("h2", {}, [state.text]),
		h("p", {}, [`Count: ${state.count}`]),
		h("button", { on: { click: counterActions.increment } }, ["Increment"]),
		h("button", { on: { click: counterActions.decrement } }, ["Decrement"]),
		h("button", { on: { click: counterActions.reset } }, ["Reset"]),
	]);
});
```

## Selecting Specific State

You can optimize performance by selecting only the parts of the state you need:

```javascript
// Select only the count from the store
const ConnectedCounter = connect(useCounterStore, (state) => ({
	count: state.count,
}))(CounterComponent);

// Select only the text from the store
const ConnectedText = connect(useCounterStore, (state) => ({
	text: state.text,
}))(TextComponent);
```

## Complete Example

Here's a complete example of a counter application with global state:

```javascript
// store.js
import { createStore, createActions } from "../path/to/glyphui.js";

// Create store
export const useCounterStore = createStore({
	count: 0,
	text: "Global Counter",
});

// Create actions
export const counterActions = createActions(
	useCounterStore,
	(setState, getState) => ({
		increment: () => setState({ count: getState().count + 1 }),
		decrement: () => setState({ count: getState().count - 1 }),
		reset: () => setState({ count: 0 }),
		updateText: (newText) => setState({ text: newText }),
	})
);

// app.js
import { Component, h, connect, createComponent } from "../path/to/glyphui.js";
import { useCounterStore, counterActions } from "./store.js";

// Counter display component
class CounterDisplay extends Component {
	render(props) {
		return h("div", { class: "counter-display" }, [
			h("h2", {}, [props.store.text]),
			h("p", { class: "count" }, [`Count: ${props.store.count}`]),
		]);
	}
}

// Counter controls component
class CounterControls extends Component {
	render() {
		return h("div", { class: "counter-controls" }, [
			h("button", { on: { click: counterActions.decrement } }, ["-"]),
			h("button", { on: { click: counterActions.reset } }, ["Reset"]),
			h("button", { on: { click: counterActions.increment } }, ["+"]),
		]);
	}
}

// Text input component
const TextInput = createComponent(() => {
	const state = useCounterStore.getState();

	return h("div", { class: "text-input" }, [
		h("input", {
			type: "text",
			value: state.text,
			on: {
				input: (e) => counterActions.updateText(e.target.value),
			},
		}),
	]);
});

// Connect components to store
const ConnectedDisplay = connect(useCounterStore)(CounterDisplay);

// App component
class App extends Component {
	render() {
		return h("div", { class: "app" }, [
			h(ConnectedDisplay),
			h(CounterControls),
			h(TextInput),
		]);
	}
}

// Mount the app
const app = new App();
app.mount(document.getElementById("app"));
```

## Best Practices

1. **Keep state minimal**: Only store what you need in global state
2. **Use selectors**: Select only the parts of state your component needs
3. **Organize by feature**: Group related state and actions together
4. **Avoid direct state mutation**: Always use actions to update state

## Next Steps

Now that you understand global state management, you can:

-   Create more complex state management solutions for your applications
-   Combine local and global state for optimal performance
-   Learn about [Slots and Content Projection](05-slots-and-content-projection.md) in GlyphUI
