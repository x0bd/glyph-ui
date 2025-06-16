# Creating Your First Component

In this tutorial, we'll create a simple counter component using GlyphUI. This will introduce you to the basic concepts of components, state management, and event handling.

## Prerequisites

-   Basic knowledge of HTML, CSS, and JavaScript
-   A local development environment with a web server

## Setting Up

First, create a new HTML file with the following structure:

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>My First GlyphUI Component</title>
		<style>
			body {
				font-family: system-ui, sans-serif;
				max-width: 600px;
				margin: 0 auto;
				padding: 2rem;
			}
			button {
				padding: 0.5rem 1rem;
				margin: 0 0.5rem;
				font-size: 1rem;
			}
			.counter {
				display: flex;
				align-items: center;
				justify-content: center;
				margin: 2rem 0;
			}
			.count {
				margin: 0 1rem;
				font-size: 1.5rem;
			}
		</style>
	</head>
	<body>
		<h1>My First GlyphUI Component</h1>
		<div id="app"></div>

		<script type="module" src="counter.js"></script>
	</body>
</html>
```

Next, create a JavaScript file named `counter.js` in the same directory:

```javascript
// Import GlyphUI from your local path
// Adjust the path based on your project structure
import { Component, h, hFragment } from "../path/to/glyphui.js";

class Counter extends Component {
	constructor() {
		// Initialize with a count of 0
		super({}, { initialState: { count: 0 } });
	}

	// Method to increment the counter
	increment() {
		this.setState({ count: this.state.count + 1 });
	}

	// Method to decrement the counter
	decrement() {
		this.setState({ count: this.state.count - 1 });
	}

	// Render method defines the component's UI
	render(props, state) {
		return h("div", { class: "counter" }, [
			h("button", { on: { click: () => this.decrement() } }, ["-"]),
			h("span", { class: "count" }, [`Count: ${state.count}`]),
			h("button", { on: { click: () => this.increment() } }, ["+"]),
		]);
	}
}

// Mount the component to the DOM
const counter = new Counter();
counter.mount(document.getElementById("app"));
```

## Understanding the Code

Let's break down what's happening in our counter component:

### 1. Imports

```javascript
import { Component, h, hFragment } from "../path/to/glyphui.js";
```

We import the necessary functions from GlyphUI:

-   `Component`: The base class for creating components
-   `h`: Function to create virtual DOM elements
-   `hFragment`: Function to create document fragments (not used in this example)

### 2. Component Class

```javascript
class Counter extends Component {
	constructor() {
		super({}, { initialState: { count: 0 } });
	}
	// ...
}
```

We create a `Counter` class that extends the `Component` class. In the constructor, we:

-   Call `super()` to initialize the parent class
-   Pass an empty object as props (first argument)
-   Set the initial state with `{ count: 0 }` (second argument)

### 3. State Management

```javascript
increment() {
  this.setState({ count: this.state.count + 1 });
}

decrement() {
  this.setState({ count: this.state.count - 1 });
}
```

We define methods to update the component's state:

-   `increment()`: Increases the count by 1
-   `decrement()`: Decreases the count by 1
-   Both use `this.setState()` to update the state, which triggers a re-render

### 4. Rendering

```javascript
render(props, state) {
  return h('div', { class: 'counter' }, [
    h('button', { on: { click: () => this.decrement() } }, ['-']),
    h('span', { class: 'count' }, [`Count: ${state.count}`]),
    h('button', { on: { click: () => this.increment() } }, ['+'])
  ]);
}
```

The `render` method:

-   Takes `props` and `state` as arguments
-   Returns a virtual DOM structure created with the `h` function
-   Binds click events to our increment and decrement methods
-   Displays the current count from the state

### 5. Mounting

```javascript
const counter = new Counter();
counter.mount(document.getElementById("app"));
```

Finally, we:

-   Create an instance of our `Counter` component
-   Mount it to the DOM element with the ID "app"

## Running the Example

To run this example:

1. Make sure you have the GlyphUI framework files accessible
2. Adjust the import path in `counter.js` to point to your GlyphUI build
3. Open the HTML file in a browser or use a local development server

## Next Steps

Now that you've created your first component, you can:

-   Try adding more features to the counter (reset button, step size control)
-   Explore component composition by creating child components
-   Learn about [Hooks and Functional Components](03-hooks-and-functional-components.md) in GlyphUI
