# Hooks and Functional Components

GlyphUI supports functional components with hooks, similar to React. This approach provides a more concise way to create components with state and side effects.

## What Are Hooks?

Hooks are functions that let you "hook into" GlyphUI's state and lifecycle features from functional components. They provide a way to use state and other GlyphUI features without writing a class.

GlyphUI provides several built-in hooks:

-   `useState`: Adds state to functional components
-   `useEffect`: Performs side effects in functional components
-   `useRef`: Creates a mutable reference that persists across renders
-   `useMemo`: Memoizes a computed value for performance
-   `useCallback`: Memoizes a function for performance

## Creating a Counter with Hooks

Let's rewrite our counter component from the previous tutorial using hooks:

```javascript
import { createComponent, h, useState } from "../path/to/glyphui.js";

// Counter component using hooks
const Counter = createComponent(() => {
	// useState returns a state value and a setter function
	const [count, setCount] = useState(0);

	// Event handler functions
	const increment = () => setCount(count + 1);
	const decrement = () => setCount(count - 1);

	// Return the virtual DOM structure
	return h("div", { class: "counter" }, [
		h("button", { on: { click: decrement } }, ["-"]),
		h("span", { class: "count" }, [`Count: ${count}`]),
		h("button", { on: { click: increment } }, ["+"]),
	]);
});

// Mount the component
Counter().mount(document.getElementById("app"));
```

## Understanding Hooks

### useState

The `useState` hook allows you to add state to functional components:

```javascript
const [state, setState] = useState(initialValue);
```

-   `initialValue`: The initial state value
-   Returns an array with two elements:
    -   `state`: The current state value
    -   `setState`: A function to update the state

When you call `setState`, the component re-renders with the new state.

### useEffect

The `useEffect` hook lets you perform side effects in functional components:

```javascript
useEffect(() => {
	// Side effect code here

	// Optional: Return a cleanup function
	return () => {
		// Cleanup code here
	};
}, [dependencies]);
```

-   First argument: Function containing the effect code
-   Second argument: Array of dependencies that trigger the effect when changed
    -   Empty array (`[]`): Effect runs only once after the first render
    -   No array: Effect runs after every render
    -   Array with values: Effect runs when any dependency changes

Example: Updating document title when count changes

```javascript
import { createComponent, h, useState, useEffect } from "../path/to/glyphui.js";

const TitleCounter = createComponent(() => {
	const [count, setCount] = useState(0);

	// Effect to update document title when count changes
	useEffect(() => {
		document.title = `Count: ${count}`;

		// Cleanup function (optional)
		return () => {
			document.title = "GlyphUI App";
		};
	}, [count]); // Only re-run when count changes

	return h("div", {}, [
		h("p", {}, [`Current count: ${count}`]),
		h("button", { on: { click: () => setCount(count + 1) } }, [
			"Increment",
		]),
	]);
});
```

### useRef

The `useRef` hook creates a mutable reference that persists across renders:

```javascript
const refContainer = useRef(initialValue);
```

Example: Focusing an input element

```javascript
import { createComponent, h, useRef, useEffect } from "../path/to/glyphui.js";

const FocusInput = createComponent(() => {
	// Create a ref to store the input element
	const inputRef = useRef(null);

	// Focus the input after component mounts
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

	return h("div", {}, [
		h("input", {
			ref: (el) => {
				inputRef.current = el;
			},
			type: "text",
			placeholder: "I will be focused",
		}),
	]);
});
```

## Rules of Hooks

When using hooks, follow these important rules:

1. Only call hooks at the top level of your component function
2. Don't call hooks inside loops, conditions, or nested functions
3. Only call hooks from GlyphUI functional components

## Component Composition

Functional components can be composed just like class components:

```javascript
import { createComponent, h, useState } from "../path/to/glyphui.js";

// Button component
const Button = createComponent((props) => {
	return h(
		"button",
		{
			class: props.className || "",
			on: { click: props.onClick },
		},
		[props.children]
	);
});

// Counter component using Button components
const Counter = createComponent(() => {
	const [count, setCount] = useState(0);

	return h("div", { class: "counter" }, [
		Button(
			{
				onClick: () => setCount(count - 1),
				className: "decrement-btn",
			},
			["-"]
		),

		h("span", { class: "count" }, [`Count: ${count}`]),

		Button(
			{
				onClick: () => setCount(count + 1),
				className: "increment-btn",
			},
			["+"]
		),
	]);
});
```

## Next Steps

Now that you understand hooks and functional components, you can:

-   Try combining multiple hooks in a single component
-   Build more complex UIs with component composition
-   Learn about [Global State Management](04-state-management.md) in GlyphUI
