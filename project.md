# Chapter 4: Results and Findings

This chapter presents the practical implementation and evaluation of the GlyphUI framework. The primary objective is to demonstrate the framework's capabilities, validate its design principles as outlined in the preceding chapters, and to provide concrete evidence of its functionality through the construction of various example applications.

## 4.1 Implementation Strategy

The implementation of the GlyphUI framework will be presented not as a single monolithic application, but as a carefully curated series of case studies. Each study is a small, focused application designed to showcase a specific feature or architectural concept of the framework. This incremental approach serves a dual purpose:

1.  **Validation:** It provides empirical evidence that the theoretical design of the framework translates into a functional and effective tool for web development. Each example acts as a "test case" for a core feature, such as state management, component composition, or performance optimization.
2.  **Demonstration:** It serves as a practical guide, illustrating the intended developer experience and API usage. By progressing from a foundational "Hello World" to more complex, stateful applications, this chapter effectively onboards a reader to the framework's ecosystem.

The sequence of these implementations is structured to build upon one another, starting with the most fundamental concepts and progressively introducing more advanced patterns. This narrative structure is designed to create a clear and comprehensive understanding of the framework's power and flexibility.

### 4.1.1 Introduction

The initial phase of the implementation serves to establish the foundational principles of the GlyphUI framework. Before demonstrating complex state management or asynchronous operations, it is essential to prove that the framework can accomplish the most fundamental task: rendering a user interface to the DOM. This section will introduce the core rendering pipeline, from the creation of a Virtual DOM (VDOM) node to its successful mounting on a web page. The goal is to demonstrate the simplicity and low barrier to entry of the framework, showing that a developer can get started with only a minimal set of functions and a basic HTML document. This forms the baseline upon which all subsequent, more complex examples will be built.

### 4.1.2 Core Principle: The Virtual DOM and Declarative Rendering

The foundational architectural pattern underpinning GlyphUI is the Virtual DOM (VDOM). The VDOM is an in-memory representation of the real Document Object Model. Rather than manipulating the browser's DOM directly on every change—an operation known to be computationally expensive—the framework first computes the changes on this lightweight, JavaScript-based representation. This section demonstrates this core principle, beginning with the simplest possible application and progressing to an interactive example that showcases the efficiency of the VDOM "diffing" and "patching" mechanism.

**A. The "Hello World" Application**

The first step is to render a static view. This requires a host HTML file and a JavaScript file to define and mount the application.

-   **Host HTML (`index.html`)**
    The HTML file provides the entry point for the application—a single `div` element into which the framework will render its output.

    ```html
    <!DOCTYPE html>
    <html lang="en">
    	<head>
    		<meta charset="UTF-8" />
    		<title>GlyphUI App</title>
    	</head>
    	<body>
    		<div id="app"></div>
    		<script type="module" src="app.js"></script>
    	</body>
    </html>
    ```

-   **Application JavaScript (`app.js`)**
    The application logic uses two primary functions from the framework: `h` and `createApp`. The `h` (hyperscript) function creates a VDOM node, in this case, a heading element. The `createApp` function initializes the application, and its `mount` method takes the root component and a target DOM element as arguments.

    ```javascript
    import { h, createApp } from "./glyph-ui/dist/glyphui.js";

    const App = () => {
    	return h("h1", { class: "main-title" }, ["Hello, GlyphUI!"]);
    };

    createApp().mount(App, document.getElementById("app"));
    ```

Executing this code results in the VDOM node being converted into a real DOM element and inserted into the `<div id="app">`, making it visible on the page.

`[Image: Screenshot of the "Hello World" application running in a browser, showing the rendered "Hello, GlyphUI!" text.]`

**B. The "Patcher" Mechanism in Action**

To demonstrate the efficiency of the VDOM, a more dynamic example is required. The following application consists of a text input field and a display area. As the user types into the input, the text is mirrored in real-time.

`[Image: Diagram illustrating the Virtual DOM diffing process. A VDOM tree is compared to a new VDOM tree, and the 'diff' is applied to the Real DOM.]`

The component utilizes the `useState` hook (which will be detailed further in a subsequent section) to manage the state of the input field.

```javascript
import { h, createApp, useState } from "./glyph-ui/dist/glyphui.js";

const App = () => {
	const [text, setText] = useState("Type here...");

	return h("div", { style: { padding: "20px" } }, [
		h("h3", {}, ["Real-time VDOM Patching Demo"]),
		h("input", {
			value: text,
			on: {
				input: (event) => setText(event.target.value),
			},
		}),
		h("hr", {}),
		h("p", {}, [`Display: ${text}`]),
	]);
};

createApp().mount(App, document.getElementById("app"));
```

With every keystroke, the `setText` function is called, triggering a re-render. A new VDOM tree is generated with the updated text. The framework's `patchDOM` function then compares this new tree to the previous one. It identifies that the only change is the text content within the `<p>` tag and the `value` attribute of the `<input>`. Consequently, it performs only these minimal, targeted updates to the real DOM, avoiding the cost of re-creating the entire component structure.

`[Image: Screenshot of the interactive input application. The user has typed "Hello" in the input box, and the text "Display: Hello" is mirrored below it.]`

**Finding:**
This implementation demonstrates that the core of the GlyphUI framework is built upon the robust and performance-oriented Virtual DOM pattern. It provides a declarative API that allows developers to describe the desired state of the UI, while the framework's internals handle the DOM manipulations in the most efficient way possible. This validates the fundamental design choice of the framework and establishes a solid foundation for building more complex, interactive components.

### 4.1.3 Building Reusable UI: The Component Model

With the foundational rendering pipeline established, the next critical feature to demonstrate is the component model. Components are the primary mechanism for code reuse and abstraction in GlyphUI. They encapsulate markup, logic, and state into self-contained, reusable units. The framework supports two paradigms for component creation: modern functional components powered by hooks, and traditional class-based components, providing developers with flexibility to suit the task at hand.

**A. Functional Components and Hooks: The Modern Approach**

Functional components are the simplest and most direct way to define a piece of UI. They are plain JavaScript functions that accept properties (`props`) and return a VDOM tree. To manage state and side effects, they use Hooks, such as `useState`.

The canonical example is a counter, which manages its own state and responds to user interaction.

```javascript
import { h, createApp, useState } from "./glyph-ui/dist/glyphui.js";

const Counter = () => {
	// The useState hook initializes a state variable and a function to update it.
	const [count, setCount] = useState(0);

	return h("div", { class: "counter-container" }, [
		h("p", {}, `Current Count: ${count}`),
		h(
			"button",
			{
				on: { click: () => setCount(count + 1) },
			},
			["Increment"]
		),
		h(
			"button",
			{
				on: { click: () => setCount(count - 1) },
			},
			["Decrement"]
		),
	]);
};

createApp().mount(Counter, document.getElementById("app"));
```

In this example, `useState(0)` declares a state variable `count`, initialized to `0`. The `setCount` function is used to update this state. When a button is clicked, `setCount` is called, which triggers a re-render of the `Counter` component with the new `count` value, demonstrating a complete state-update-render cycle.

`[Image: Screenshot of the Counter component, showing the count and the two buttons.]`

**B. Class-Based Components and Lifecycle Management**

For scenarios requiring more complex logic or for developers who prefer an object-oriented paradigm, GlyphUI provides class-based components. These offer fine-grained control over the component's lifecycle.

A `Clock` component that updates itself every second is an ideal demonstration of lifecycle methods. It needs to start a timer when it is added to the DOM and, crucially, clear that timer when it is removed to prevent memory leaks.

```javascript
import { h, createApp, Component } from "./glyph-ui/dist/glyphui.js";

class Clock extends Component {
	constructor(props) {
		// Pass props and initial state to the parent Component class.
		super(props, {
			initialState: { time: new Date().toLocaleTimeString() },
		});
	}

	// Lifecycle method: called after the component is added to the DOM.
	mounted() {
		this.timerID = setInterval(() => {
			// Update the component's state, triggering a re-render.
			this.setState({ time: new Date().toLocaleTimeString() });
		}, 1000);
	}

	// Lifecycle method: called just before the component is removed from the DOM.
	beforeUnmount() {
		clearInterval(this.timerID); // Clean up the timer.
	}

	render(props, state) {
		return h("div", { class: "clock-container" }, [
			h("h2", {}, "Current Time"),
			h("p", {}, state.time),
		]);
	}
}

createApp().mount(Clock, document.getElementById("app"));
```

This example showcases two critical lifecycle methods: `mounted()` is used to set up the `setInterval`, and `beforeUnmount()` is used to perform cleanup by clearing the interval. This demonstrates the framework's capability to manage side effects that are tied to the component's presence in the DOM.

`[Image: Screenshot of the Clock component displaying the current time.]`

**Finding:**
GlyphUI provides a versatile and robust component model. It supports both modern, functional components with hooks for concise and declarative UI, and class-based components that offer detailed lifecycle management for more complex scenarios. This dual-paradigm approach ensures that developers have the appropriate tools to build a wide range of reusable and maintainable UI abstractions, from simple buttons to complex, self-updating widgets.

### 4.1.4 Managing Asynchronous Operations and Side Effects (`useEffect`)

Modern web applications are rarely self-contained; they are dynamic and data-driven, frequently needing to interact with external APIs to fetch or submit data. Such operations are asynchronous by nature and are considered "side effects" because they involve interacting with systems outside the direct control of the framework's rendering cycle. This section demonstrates how GlyphUI handles these side effects gracefully using the `useEffect` hook.

The implementation will showcase a component that fetches a list of posts from a public API. A critical requirement for a good user experience is handling the various states of this asynchronous operation: an initial loading state, a success state where the data is displayed, and an error state if the data fetch fails.

```javascript
import { h, createApp, useState, useEffect } from "./glyph-ui/dist/glyphui.js";

const PostFetcher = () => {
	// State to manage the three possible outcomes of the API call.
	const [posts, setPosts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	// The useEffect hook performs the side effect (data fetching).
	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const response = await fetch(
					"https://jsonplaceholder.typicode.com/posts?_limit=5"
				);
				if (!response.ok) {
					throw new Error("Data fetching failed");
				}
				const data = await response.json();
				setPosts(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		};

		fetchPosts();
	}, []); // The empty dependency array ensures this effect runs only once on mount.

	// Conditional rendering based on the state of the data fetch.
	if (isLoading) {
		return h("p", {}, ["Loading posts..."]);
	}

	if (error) {
		return h("p", { style: { color: "red" } }, [`Error: ${error}`]);
	}

	return h("div", { class: "posts-list" }, [
		h("h2", {}, ["Fetched Posts"]),
		...posts.map((post) =>
			h("div", { class: "post-item", key: post.id }, [
				h("h4", {}, post.title),
				h("p", {}, post.body),
			])
		),
	]);
};

createApp().mount(PostFetcher, document.getElementById("app"));
```

`[Image: Screenshot showing the "Loading posts..." text during the initial fetch.]`

This example demonstrates a complete and robust asynchronous workflow:

1.  **State Initialization**: Three state variables are initialized using `useState` to track the fetched `posts`, the `isLoading` status, and any potential `error`.
2.  **Effect Execution**: The `useEffect` hook contains the `fetch` logic. The empty dependency array `[]` passed as the second argument is crucial; it instructs GlyphUI to run the effect function only once, immediately after the component is first mounted to the DOM.
3.  **Conditional Rendering**: The component's return value changes based on the state. It displays a loading message, an error message, or the list of posts, ensuring the user is always presented with a coherent UI that reflects the current application state.
4.  **List Rendering**: Upon a successful fetch, the `posts` array is mapped into a series of VDOM nodes. The `key` prop is provided to each item, which is a critical performance optimization that helps GlyphUI's diffing algorithm efficiently update the list.

`[Image: Screenshot showing the final list of fetched posts rendered on the page.]`

**Finding:**
The `useEffect` hook in GlyphUI provides a powerful and declarative API for managing side effects and asynchronous operations. It gives developers precise control over when effects should run, enabling the creation of complex, data-driven components that can gracefully handle various states of interaction with external services. This confirms that the framework is well-equipped to build dynamic, real-world web applications.

### 4.1.5 Advanced Patterns for Performance

A key quality of a production-ready framework is its ability to provide tools for performance optimization. As applications grow in complexity, re-rendering components can become computationally expensive. Unnecessary calculations and re-renders can lead to a slow and unresponsive user interface. GlyphUI provides two primary hooks, `useMemo` and `useCallback`, that give developers fine-grained control to prevent this, ensuring applications remain fast and efficient.

**A. Memoizing Expensive Calculations with `useMemo`**

The `useMemo` hook is used to memoize a value, meaning it caches the result of a calculation and only re-computes it when one of its dependencies changes. This is invaluable for computationally intensive operations.

To demonstrate this, we will create a component that performs a deliberately "slow" calculation (finding the largest prime number below a given number) while also having a separate, frequently-changing piece of state (a counter).

```javascript
import { h, createApp, useState, useMemo } from "./glyph-ui/dist/glyphui.js";

// A deliberately slow function.
const findLargestPrime = (limit) => {
	console.log(`Calculating largest prime below ${limit}...`);
	// ... (complex prime calculation logic) ...
	// This is a simplified stand-in for a heavy operation.
	let largestPrime = 2;
	for (let i = 3; i < limit; i += 2) {
		let isPrime = true;
		for (let j = 3; j * j <= i; j += 2) {
			if (i % j === 0) {
				isPrime = false;
				break;
			}
		}
		if (isPrime) {
			largestPrime = i;
		}
	}
	return largestPrime;
};

const PrimeCalculator = () => {
	const [numberLimit, setNumberLimit] = useState(10000);
	const [unrelatedState, setUnrelatedState] = useState(0);

	// Without useMemo, findLargestPrime would run on every single re-render,
	// including when the 'unrelatedState' counter is incremented.

	// With useMemo, the result is cached. The calculation only re-runs
	// when 'numberLimit', its dependency, changes.
	const largestPrime = useMemo(() => {
		return findLargestPrime(numberLimit);
	}, [numberLimit]);

	return h("div", {}, [
		h(
			"p",
			{},
			`The largest prime below ${numberLimit} is ${largestPrime}.`
		),
		h("hr"),
		h("h4", {}, "Unrelated State"),
		h("p", {}, `Counter: ${unrelatedState}`),
		h(
			"button",
			{
				on: { click: () => setUnrelatedState(unrelatedState + 1) },
			},
			["Increment Counter (fast)"]
		),
		h(
			"button",
			{
				on: { click: () => setNumberLimit(numberLimit + 10000) },
			},
			["Increase Limit (slow calculation)"]
		),
	]);
};

createApp().mount(PrimeCalculator, document.getElementById("app"));
```

When the "Increment Counter" button is clicked, the component re-renders, but because `numberLimit` has not changed, the `findLargestPrime` function is not executed again. The cached value for `largestPrime` is used instead, and the UI updates instantly. The expensive calculation is only triggered when its direct dependency changes, demonstrating a significant performance optimization.

`[Image/GIF: A side-by-side comparison. The left side (without useMemo) shows noticeable lag when clicking the counter button. The right side (with useMemo) shows the counter updating instantly.]`

**B. Memoizing Functions for Child Components with `useCallback`**

In JavaScript, functions are objects. When a component re-renders, any functions defined inside it are re-created. If these functions are passed as props to child components, the children will see them as "new" props and may re-render unnecessarily, even if their own content hasn't changed. The `useCallback` hook prevents this by memoizing the function itself.

Consider a parent component that re-renders, passing a function to a child button.

```javascript
import {
	h,
	createApp,
	useState,
	useCallback,
	createComponent,
} from "./glyph-ui/dist/glyphui.js";

// A child component that logs when it renders.
// NOTE: For this example, we'll treat it as a class component to ensure it can be
// memoized effectively by reference, as functional components might be re-evaluated.
class MemoizedButton extends Component {
	render(props) {
		console.log(`Rendering button: ${props.children[0]}`);
		return h(
			"button",
			{ on: { click: props.onButtonClick } },
			props.children
		);
	}
}

const ParentComponent = () => {
	const [count, setCount] = useState(0);
	const [theme, setTheme] = useState("light");

	// Without useCallback, a new 'handleThemeToggle' function would be
	// created every time 'count' changes, causing the button to re-render.

	// With useCallback, the function's identity is preserved across re-renders,
	// as long as its dependencies (none, in this case) don't change.
	const handleThemeToggle = useCallback(() => {
		setTheme((currentTheme) =>
			currentTheme === "light" ? "dark" : "light"
		);
	}, []);

	return h("div", { class: theme }, [
		h("p", {}, `Count: ${count}`),
		h("button", { on: { click: () => setCount(count + 1) } }, [
			"Increment Count",
		]),

		// This is the CORRECT way to render a child component in GlyphUI.
		createComponent(MemoizedButton, { onButtonClick: handleThemeToggle }, [
			"Toggle Theme",
		]),
	]);
};

createApp().mount(ParentComponent, document.getElementById("app"));
```

When the "Increment Count" button is clicked, the `ParentComponent` re-renders. Without `useCallback`, the console would log "Rendering button: Toggle Theme" every time, because a new `handleThemeToggle` function is created. With `useCallback`, however, the `MemoizedButton` does not re-render, because the `handleThemeToggle` prop it receives is the exact same function instance as before. This prevents a cascade of unnecessary renders down the component tree.

**Finding:**
GlyphUI provides a comprehensive set of tools for performance optimization that are essential for developing complex, high-performance applications. The `useMemo` hook effectively eliminates redundant, expensive calculations, while `useCallback` prevents unnecessary re-renders of child components. The inclusion of these hooks demonstrates that the framework is not only concerned with functionality but also with providing developers the means to ensure their applications are efficient and scalable.

### 4.1.6 Architecture for Scalable Applications

As applications grow, managing state and composing components become significant architectural challenges. A simple component-based state is insufficient for data that needs to be shared across disparate parts of the application. Furthermore, creating reusable and flexible layout components is key to a maintainable codebase. This section demonstrates the architectural patterns GlyphUI provides to solve these problems: a global state management solution and a powerful component composition system using "slots".

**A. Global State Management (`createStore` and `connect`)**

For application-level state, such as user authentication or a shopping cart, GlyphUI provides a centralized store pattern, inspired by libraries like Redux. This pattern decouples state from the components that use it, allowing for a more predictable and maintainable data flow.

To demonstrate this, we will implement a simple shopping cart. A `ProductList` component will dispatch actions to add items, while a separate `CartStatus` component will display the current number of items in the cart.

`[Image: Diagram showing the unidirectional data flow: Component -> Action -> Store -> Updated State -> Component.]`

1.  **The Store (`store.js`)**:
    The store is defined using `createStore`, which holds the state and the functions that can modify it.

    ```javascript
    import { createStore } from "./glyph-ui/dist/glyphui.js";

    export const cartStore = createStore((set) => ({
    	items: [],
    	addToCart: (product) =>
    		set((state) => ({
    			items: [...state.items, product],
    		})),
    }));
    ```

2.  **The Application Components (`app.js`)**:
    Two components are created. `ProductList` is a simple component that triggers a state change. `CartStatus` is a class-based component that will be connected to the store. The `connect` Higher-Order Component (HOC) links a component to the store, ensuring it re-renders only when the selected part of the state changes.

    ```javascript
    import {
    	h,
    	createApp,
    	Component,
    	createComponent,
    	connect,
    } from "./glyph-ui/dist/glyphui.js";
    import { cartStore } from "./store.js";

    const products = [
    	{ id: 1, name: "Laptop" },
    	{ id: 2, name: "Mouse" },
    ];

    // This component dispatches actions to the store.
    const ProductList = () => {
    	const { addToCart } = cartStore.getState();
    	return h("div", {}, [
    		h("h3", {}, ["Products"]),
    		...products.map((p) =>
    			h(
    				"button",
    				{
    					on: { click: () => addToCart(p) },
    				},
    				[`Add ${p.name} to Cart`]
    			)
    		),
    	]);
    };

    // This component will be connected to the store.
    class CartStatus extends Component {
    	render(props) {
    		// The connected state is passed via props.store
    		const itemCount = props.store.itemCount;
    		return h("p", {}, `Items in cart: ${itemCount}`);
    	}
    }

    // The selector function picks the relevant state for the component.
    const cartSelector = (state) => ({
    	itemCount: state.items.length,
    });

    const ConnectedCartStatus = connect(cartStore, cartSelector)(CartStatus);

    // The main App component renders both child components.
    const App = () => {
    	return h("div", {}, [
    		createComponent(ConnectedCartStatus, {}),
    		createComponent(ProductList, {}),
    	]);
    };

    createApp().mount(App, document.getElementById("app"));
    ```

This implementation demonstrates a clean separation of concerns. The `ProductList` does not need to know about the `CartStatus`, and vice-versa. They both communicate indirectly through the centralized store, a pattern that is crucial for building scalable applications.

**B. Component Composition with Slots**

To create highly reusable UI, it is often necessary to pass markup from a parent to a child component. GlyphUI facilitates this through a `slots` system, using `createSlot` and `createSlotContent`.

Here we create a generic `Card` component that defines named slots for a `header` and a `default` body, then populate it from a parent component.

1.  **The Reusable `Card` Component (`Card.js`)**

    ```javascript
    import { h, Component, createSlot } from "./glyph-ui/dist/glyphui.js";

    export class Card extends Component {
    	render() {
    		return h("div", { class: "card" }, [
    			h("div", { class: "card-header" }, [
    				createSlot("header", {}, [h("h3", {}, ["Default Header"])]),
    			]),
    			h("div", { class: "card-body" }, [
    				createSlot("default", {}, [
    					h("p", {}, ["Default content."]),
    				]),
    			]),
    		]);
    	}
    }
    ```

2.  **Using the `Card` Component (`app.js`)**

    ```javascript
    import {
    	h,
    	createApp,
    	createComponent,
    	createSlotContent,
    } from "./glyph-ui/dist/glyphui.js";
    import { Card } from "./Card.js";

    const App = () => {
    	return createComponent(Card, {}, [
    		// This content is targeted to the 'header' slot.
    		createSlotContent("header", [h("h2", {}, ["My Profile"])]),
    		// This content is for the 'default' slot.
    		createSlotContent("default", [
    			h("p", {}, ["This is my user profile information."]),
    		]),
    	]);
    };

    createApp().mount(App, document.getElementById("app"));
    ```

This demonstrates that the `Card` component does not need to know about the content it will eventually display. It only provides the structure (the slots), making it an extremely flexible and reusable layout component.

**Finding:**
GlyphUI provides robust architectural patterns essential for building large-scale, maintainable applications. The global store offers a predictable and decoupled state management solution, while the slots system provides a powerful and clean API for component composition. Together, these features enable the creation of complex applications from a set of simple, reusable, and independent parts.

### 4.1.7 The Capstone Project: The Memory Game

To provide a comprehensive validation of the framework, this section details the implementation of a complete, interactive application: a card-matching Memory Game. This capstone project is non-trivial and serves to demonstrate the synergy of the framework's features, requiring component-based architecture, local state management for the game's logic, event handling for user interaction, list rendering for the game board, and asynchronous operations to manage game flow.

The application is built as a single, stateful class-based component, `MemoryGame`, which encapsulates all the logic and rendering for the game.

`[Image: Screenshot of the Memory Game in the middle of a game, with several cards flipped and some pairs matched.]`

**Implementation (`game.js`)**

```javascript
import { Component, h } from "./glyph-ui/dist/glyphui.js";

const SYMBOLS = ["🚀", "🌟", "🌈", "🎮", "🔮", "🎨", "🍕", "🌮"];

// Helper function to create and shuffle the deck of cards.
function createDeck() {
	const deck = [...SYMBOLS, ...SYMBOLS];
	for (let i = deck.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[deck[i], deck[j]] = [deck[j], deck[i]];
	}
	return deck;
}

class MemoryGame extends Component {
	constructor() {
		super(
			{},
			{
				// All game state is managed within the component.
				initialState: {
					deck: createDeck(),
					flippedIndices: [],
					matchedSymbols: [],
					moves: 0,
					isChecking: false, // Prevents clicks during the match-check delay.
				},
			}
		);
		this.handleCardClick = this.handleCardClick.bind(this);
	}

	// Handles the core game logic when a card is clicked.
	handleCardClick(index) {
		const { flippedIndices, deck, matchedSymbols, isChecking } = this.state;
		if (
			isChecking ||
			flippedIndices.includes(index) ||
			matchedSymbols.includes(deck[index])
		) {
			return; // Ignore clicks if busy, or card is already revealed.
		}

		const newFlippedIndices = [...flippedIndices, index];
		this.setState({ flippedIndices: newFlippedIndices });

		// If two cards are flipped, check for a match after a delay.
		if (newFlippedIndices.length === 2) {
			this.setState({ isChecking: true });
			setTimeout(() => this.checkForMatch(), 1000);
		}
	}

	checkForMatch() {
		const { flippedIndices, deck, matchedSymbols, moves } = this.state;
		const [index1, index2] = flippedIndices;

		const newMatchedSymbols = [...matchedSymbols];
		if (deck[index1] === deck[index2]) {
			newMatchedSymbols.push(deck[index1]);
		}

		this.setState({
			flippedIndices: [], // Flip cards back down.
			matchedSymbols: newMatchedSymbols,
			moves: moves + 1,
			isChecking: false,
		});
	}

	// Renders the entire game UI based on the current state.
	render(props, state) {
		const { deck, flippedIndices, matchedSymbols, moves } = state;
		const isGameWon = matchedSymbols.length === SYMBOLS.length;

		return h("div", { class: "game-container" }, [
			h("div", { class: "info" }, [`Moves: ${moves}`]),
			h(
				"div",
				{ class: "board" },
				// List rendering: The deck array is mapped to card elements.
				deck.map((symbol, index) => {
					const isFlipped = flippedIndices.includes(index);
					const isMatched = matchedSymbols.includes(symbol);

					let cardClass = "card";
					if (isFlipped || isMatched) cardClass += " flipped";
					if (isMatched) cardClass += " matched";

					return h(
						"div",
						{
							class: cardClass,
							key: index, // Key prop for efficient list updates.
							on: { click: () => this.handleCardClick(index) },
						},
						[h("span", { class: "content" }, [symbol])]
					);
				})
			),
			isGameWon && h("div", { class: "win-message" }, ["You Win!"]),
		]);
	}
}

const app = new MemoryGame();
app.mount(document.getElementById("app"));
```

This implementation effectively synthesizes the core features of GlyphUI:

-   **Component-Based Architecture**: The entire application is encapsulated within the `MemoryGame` class component.
-   **State Management**: `this.state` and `this.setState()` are used to manage all aspects of the game: the shuffled deck, which cards are currently flipped, which pairs have been successfully matched, and the player's move count.
-   **Event Handling**: The `on: { click }` property is used on each card to trigger the `handleCardClick` method, which contains the central game logic.
-   **Asynchronous Operations**: The native `setTimeout` function is used to create a delay before non-matching cards are flipped back over. The `isChecking` state variable is used to prevent user input during this asynchronous delay, demonstrating how to manage application state during side effects.
-   **List Rendering & Keys**: The `deck.map()` function is used to dynamically render the grid of cards from the state array. The essential `key` prop is assigned to each card, ensuring the framework can efficiently update, add, or remove cards from the DOM during re-renders.
-   **Conditional Rendering**: The "You Win!" message is conditionally rendered only when the `isGameWon` variable is true, demonstrating how the UI can dynamically change based on application state.

**Finding:**
The successful implementation of the Memory Game serves as a comprehensive validation of the GlyphUI framework. It proves that the individual features—components, state management, event handling, and asynchronous control—do not merely function in isolation but integrate seamlessly to create a complete, interactive, and stateful web application. This capstone project confirms that the framework's design is robust and its feature set is sufficient for building the kind of dynamic applications it was designed for, thus achieving the project's primary objective.
