# Hooks in GlyphUI

Hooks are functions that let you "hook into" GlyphUI features from functional components. They let you add state, side effects, and more to your components without writing a class.

**Important Rule**: Hooks can only be called from within a functional component or another custom hook. Don't call them from regular JavaScript functions or class components.

## `useState`

The `useState` hook lets you add state to functional components.

`const [state, setState] = useState(initialState);`

-   **`initialState`**: The initial value of the state. Can be any value, or a function that returns the initial value.
-   **Returns**: An array with two elements:
    1.  The current state value.
    2.  A function (`setState`) to update the state.

When you call `setState`, GlyphUI re-renders the component with the new state value.

**Example: A Simple Counter**

```javascript
import { h, useState } from "./glyphui.js";

const Counter = () => {
	const [count, setCount] = useState(0);

	return h("div", {}, [
		h("p", {}, [`Count: ${count}`]),
		h("button", { on: { click: () => setCount(count + 1) } }, ["+"]),
		h("button", { on: { click: () => setCount(count - 1) } }, ["-"]),
	]);
};
```

## `useEffect`

The `useEffect` hook lets you perform side effects in functional components. Examples of side effects are data fetching, subscriptions, or manually changing the DOM.

`useEffect(effectFunction, dependencies);`

-   **`effectFunction`**: The function to run. It will be executed after the component renders.
-   **`dependencies`** (optional): An array of values. The effect will only re-run if one of these values has changed since the last render.
    -   If you omit the array, the effect runs after every render.
    -   If you provide an empty array `[]`, the effect runs only once, after the initial render.

The `effectFunction` can optionally return a "cleanup" function. This function will be called before the component is unmounted or before the effect is re-run.

**Example: Fetching Data**

```javascript
import { h, useState, useEffect } from "./glyphui.js";

const UserData = ({ userId }) => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		// This effect runs when `userId` changes.
		fetch(`https://api.example.com/users/${userId}`)
			.then((res) => res.json())
			.then((data) => setUser(data));

		return () => {
			// Cleanup function (e.g., abort fetch)
			console.log("Cleaning up previous effect");
		};
	}, [userId]);

	if (!user) {
		return h("p", {}, ["Loading..."]);
	}

	return h("div", {}, [h("h2", {}, [user.name]), h("p", {}, [user.email])]);
};
```

## `useRef`

The `useRef` hook returns a mutable ref object whose `.current` property is initialized to the passed argument (`initialValue`). The returned object will persist for the full lifetime of the component.

`const refContainer = useRef(initialValue);`

`useRef` is useful for:

-   Accessing DOM elements directly.
-   Storing a mutable value that does not cause a re-render when it changes.

**Example: Focusing a Text Input**

```javascript
import { h, useRef, useEffect } from "./glyphui.js";

const TextInputWithFocusButton = () => {
	const inputEl = useRef(null);

	const onButtonClick = () => {
		// `inputEl.current` points to the mounted text input element
		inputEl.current.focus();
	};

	return hFragment([
		h("input", { ref: (el) => (inputEl.current = el), type: "text" }),
		h("button", { on: { click: onButtonClick } }, ["Focus the input"]),
	]);
};
```

_Note: In GlyphUI, you assign the ref inside the `ref` prop with a function._

## `useMemo`

The `useMemo` hook returns a memoized value. It will only recompute the memoized value when one of the dependencies has changed. This is useful for expensive calculations.

`const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);`

**Example:**

```javascript
import { h, useMemo } from "./glyphui.js";

const MyComponent = ({ numbers }) => {
	const sum = useMemo(() => {
		console.log("Calculating sum...");
		return numbers.reduce((acc, num) => acc + num, 0);
	}, [numbers]); // Only recalculates if `numbers` array changes

	return h("div", {}, [`Sum: ${sum}`]);
};
```

## `useCallback`

The `useCallback` hook returns a memoized callback function. It's useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders.

`const memoizedCallback = useCallback(() => { doSomething(a, b); }, [a, b]);`

`useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`.

**Example:**

```javascript
import { h, useState, useCallback } from "./glyphui.js";

const Button = ({ onClick, children }) => {
	console.log(`Rendering button: ${children}`);
	return h("button", { on: { click: onClick } }, [children]);
};

const Parent = () => {
	const [count, setCount] = useState(0);

	const increment = useCallback(() => {
		setCount((c) => c + 1);
	}, []); // The function identity is stable

	return h("div", {}, [
		h("p", {}, [`Count: ${count}`]),
		// Button component will not re-render unnecessarily
		// because `increment` function is memoized.
		createComponent(Button, { onClick: increment }, ["Increment"]),
	]);
};
```
