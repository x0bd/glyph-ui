# Testing GlyphUI Applications with Vitest

Testing is essential for building reliable and maintainable applications. This guide will walk you through setting up [Vitest](https://vitest.dev/) for a GlyphUI project and demonstrate different testing strategies.

## Why Vitest?

Vitest is a modern, fast, and feature-rich testing framework. It's a great choice for GlyphUI because:

-   It's easy to set up.
-   It has a Jest-compatible API, making it familiar to many developers.
-   It's incredibly fast.
-   It supports TypeScript, JSX, and ES Modules out of the box.

## Setup

1.  **Install Vitest**:
    In your project, run:

    ```bash
    npm install -D vitest jsdom
    ```

    We install `jsdom` to simulate a DOM environment, which is necessary for some forms of component testing.

2.  **Configure Vitest**:
    Create a `vitest.config.js` file in your project root:

    ```javascript
    import { defineConfig } from "vitest/config";

    export default defineConfig({
    	test: {
    		globals: true, // so you don't have to import describe, it, expect, etc.
    		environment: "jsdom", // to simulate a DOM environment
    	},
    });
    ```

3.  **Add a Test Script**:
    In your `package.json`, add a script to run your tests:
    ```json
    "scripts": {
      "test": "vitest"
    }
    ```

## Unit Testing (White-Box Testing)

Unit tests focus on the smallest parts of your application in isolation, like a single function or a reducer. This is a form of **white-box testing** because you are typically aware of the function's implementation details.

**Example: Testing a Reducer**

Let's say you have the `createApp` reducer from the state management docs.

```javascript
// reducers.js
export const reducers = {
	increment: (state, payload) => ({
		count: state.count + (payload || 1),
	}),
	decrement: (state, payload) => ({
		count: state.count - (payload || 1),
	}),
};
```

Your test file (`reducers.test.js`) would look like this:

```javascript
import { reducers } from "./reducers.js";

describe("App Reducers", () => {
	it("should handle the increment action", () => {
		const initialState = { count: 0 };
		const newState = reducers.increment(initialState, 5);
		expect(newState.count).toBe(5);
	});

	it("should handle the decrement action", () => {
		const initialState = { count: 10 };
		const newState = reducers.decrement(initialState, 3);
		expect(newState.count).toBe(7);
	});
});
```

## Component Testing (Black-Box Testing)

Component tests check that a component renders correctly for a given set of props and that it responds to user interactions. This can often be treated as **black-box testing**, where you test the component's public interface (its props and events) without worrying about its internal implementation.

Since GlyphUI components return a VDOM (a plain JavaScript object), we can test them without even needing a DOM.

**Example: Testing a Counter Component**

```javascript
// Counter.js
import { h, useState } from "./glyphui.js";

export const Counter = () => {
	const [count, setCount] = useState(0);

	return h("div", {}, [
		h("p", {}, [`Count: ${count}`]),
		h("button", { on: { click: () => setCount(count + 1) } }, ["+"]),
	]);
};
```

Your test file (`Counter.test.js`) would look like this:

```javascript
import { h, createComponent } from "./glyphui.js";
import { Counter } from "./Counter.js";

// Helper to "render" a functional component and get its VDOM
function renderFunctional(Component, props) {
	const vdom = createComponent(Component, props);
	// In a real scenario, an instance would be created, but for functional
	// components, we can directly call the function for testing.
	return Component(vdom.props);
}

describe("Counter Component", () => {
	it("should render the initial count as 0", () => {
		const vdom = renderFunctional(Counter);

		// Find the paragraph element in the VDOM
		const paragraph = vdom.children.find((child) => child.tag === "p");

		// Check its content
		expect(paragraph.children[0]).toBe("Count: 0");
	});

	// Note: Testing state changes within hooks from outside the component
	// is complex. The best way to test this is via integration testing
	// where the component is actually mounted.
});
```

Testing the _result_ of a state change is tricky in a pure unit test. The most effective way is through integration testing where the component is fully rendered.

## Integration Testing

Integration tests verify that different parts of your application work together correctly. For example, testing that a component correctly subscribes to a store, receives updates, and re-renders.

**Example: Testing a Connected Component**

Let's test the `connect` HOC with a store and component.

```javascript
import { h, Component, createStore, connect } from "./glyphui.js";

// 1. A simple store
const myStore = createStore((set) => ({
	count: 0,
	increment: () => set((state) => ({ count: state.count + 1 })),
}));

// 2. A simple component to display the count
class MyDisplay extends Component {
	render(props) {
		return h("p", {}, [`Store count: ${props.store.count}`]);
	}
}

// 3. Connect the component to the store
const selector = (state) => ({ count: state.count });
const ConnectedDisplay = connect(myStore, selector)(MyDisplay);

// 4. A component to render the connected display
const App = () => createComponent(ConnectedDisplay);

describe("Store and Component Integration", () => {
	it("should update the component when the store changes", () => {
		// We need a DOM to mount into
		const parentEl = document.createElement("div");

		// Mount the App
		createApp().mount(App, parentEl);

		// Initial state check
		expect(parentEl.innerHTML).toBe("<p>Store count: 0</p>");

		// Dispatch an action
		myStore.getState().increment();

		// The dispatcher and patchDOM work asynchronously in GlyphUI.
		// We need to wait for the DOM to update.
		return new Promise((resolve) => {
			setTimeout(() => {
				expect(parentEl.innerHTML).toBe("<p>Store count: 1</p>");
				resolve();
			}, 100); // Wait for async render
		});
	});
});
```

This test mounts a component, dispatches an action to a global store, and then verifies that the component's DOM output was updated as expected. This gives you high confidence that your state management and rendering pipelines are working together correctly.
