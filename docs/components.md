# Components in GlyphUI

Components are the building blocks of a GlyphUI application. They are reusable pieces of UI that can have their own state and logic. GlyphUI supports both functional components and class-based components.

## Functional Components

Functional components are the simplest way to create components in GlyphUI. They are just JavaScript functions that take `props` as an argument and return a VDOM tree.

**Example:**

```javascript
import { h, createComponent } from "./glyphui.js";

const Greeting = (props) => {
	return h("h1", {}, [`Hello, ${props.name}!`]);
};

// To use this component:
const app = createComponent(Greeting, { name: "Alice" });
```

### Props

`props` are passed as the first argument to the functional component. They are an object containing data and functions that the component can use. Children passed to a component are available under `props.children`.

## Class-based Components

For more complex scenarios where you need state, lifecycle methods, or more organization, you can use class-based components. These components extend the `Component` class from GlyphUI.

**Example:**

```javascript
import { h, Component } from "./glyphui.js";

class Counter extends Component {
	constructor(props) {
		super(props, { initialState: { count: 0 } });
	}

	render(props, state) {
		return h("div", {}, [
			h("p", {}, [`Count: ${state.count}`]),
			h(
				"button",
				{
					on: {
						click: () => this.setState({ count: state.count + 1 }),
					},
				},
				["Increment"]
			),
		]);
	}
}

// To use this component:
// const counter = createComponent(Counter, {});
```

### `render(props, state)`

The `render` method is the only required method in a class component. It should return a VDOM tree. It receives the component's `props` and `state` as arguments.

### `state` and `setState()`

-   The `constructor` is where you initialize the component's state. You pass an `initialState` object to `super()`.
-   The `state` is available as the second argument in `render` and as `this.state` inside the component's methods.
-   To update the state, you call `this.setState()`. This method takes an object with the new state values. When you call `setState`, GlyphUI will re-render the component and its children. `setState` can also take a function that receives the previous state and returns the new state.

### Lifecycle Methods

Class components have several lifecycle methods that you can use to run code at specific times:

-   **`beforeMount()`**: Called right before the component is mounted to the DOM.
-   **`mounted()`**: Called after the component has been mounted to the DOM. Useful for DOM manipulations or data fetching.
-   **`beforeUpdate(oldProps, newProps)`**: Called before the component is re-rendered due to new props.
-   **`updated(oldProps, newProps)`**: Called after the component has been updated.
-   **`beforeUnmount()`**: Called right before the component is unmounted and destroyed.
-   **`unmounted()`**: Called after the component has been unmounted.

### `emit`

Class components have an `emit` method (passed as the third argument to `render` or available as `this.emit`) that can be used for communication, although direct state management with `setState` is more common for internal component logic.

## Functional vs. Class Components

-   **Functional Components**: Best for simple, presentational UI. With the introduction of Hooks, they can also manage state and side effects, making them a powerful choice for most cases.
-   **Class Components**: Useful for complex logic, when you need lifecycle methods, or for developers who prefer the object-oriented style.
