# GlyphUI

<div align="center">
  <img src="docs/assets/glyphui-logo.png" alt="GlyphUI Logo" width="180">
  <p><strong>A lightweight JavaScript framework built to understand how frontend frameworks work.</strong></p>
  <p>
    <a href="#features">Features</a> •
    <a href="#examples">Examples</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#core-concepts">Core Concepts</a> •
    <a href="#roadmap">Roadmap</a>
  </p>
</div>

## Overview

GlyphUI is a modern JavaScript framework built from the ground up to demystify how popular frontend frameworks like React, Vue, and Svelte operate under the hood. By building a framework from scratch, we gain deep insights into core concepts like virtual DOM diffing, component lifecycle, state management, lazy loading, and more.

```javascript
// Example: Simple Counter Component
import { Component, h } from "./packages/runtime/dist/glyphui.js";

class Counter extends Component {
  constructor() {
    super({}, { initialState: { count: 0 } });
  }
  
  increment() {
    this.setState({ count: this.state.count + 1 });
  }
  
  render(props, state) {
    return h('div', {}, [
      h('p', {}, [`Count: ${state.count}`]),
      h('button', { on: { click: () => this.increment() } }, ['Increment'])
    ]);
  }
}

// Mount the component
mount(Counter, document.getElementById('app'));
```

## Features

GlyphUI includes a growing list of features inspired by modern frontend frameworks:

- ✅ **Virtual DOM & Diffing** - Efficient rendering and updates via a lightweight virtual DOM and reconciliation algorithm.
- ✅ **Component Model** - Class-based components with local state and lifecycle hooks (`mounted`, `updated`, `unmounted`, etc.).
- ✅ **Event Handling** - Declarative event binding (`on: { click: ... }`) with automatic cleanup.
- ✅ **Component Composition** - Build complex UIs by nesting components.
- ✅ **Slots** - Content projection for flexible component design (`createSlot`, `createSlotContent`).
- ✅ **Lazy Loading** - Load components on demand using `lazy()` and `Suspense` for better performance and code splitting.
- ✅ **State Management** - Global state management outside components using a Zustand-inspired API (`createStore`, `connect`, `createActions`).

## Examples

The repository includes several examples demonstrating the framework's capabilities:

- **[Minimal Todo App](examples/vercel-todo/index.html)** - Demonstrates state management (`createStore`), component connection (`connect`), and UI interactions.
- **[Lazy Loading](examples/lazy-loading/index.html)** - Shows how to use `lazy()` and `Suspense` to load components asynchronously.
- **[Counter](examples/counter/counter.html)** - Simple counter demonstrating local component state.
- **[Slots Demo](examples/slots-demo/slots-demo.html)** - Demonstrating content projection with slots.
- **[Tic-Tac-Toe](examples/tictactoe/index.html)** - Game with complex state management.
- **[Memory Game](examples/memory-game/index.html)** - Card matching game.

To run the examples:

```bash
# From the project root
npm run serve
# or npx http-server . -c-1
```

Then visit the URLs listed in the terminal or navigate to `/examples/` in your browser (e.g., http://localhost:8080/examples/vercel-todo/index.html).

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/glyphui.git # Replace with actual repo URL if known
cd glyphui

# Install dependencies (at the root)
npm install

# Build the framework runtime
cd packages/runtime
npm run build
```

### Usage

Import the necessary functions and classes from the built runtime file:

```javascript
// From local build
import { 
  Component, 
  createComponent, 
  h, 
  hFragment,
  mount,
  lazy,
  Suspense,
  createStore,
  connect,
  createActions
} from "./path/to/packages/runtime/dist/glyphui.js"; 
```

## Core Concepts

### Virtual DOM (`h` function)

GlyphUI uses a virtual DOM (VDOM) created by the `h` (hyperscript) function to represent the desired UI structure.

```javascript
const vNode = h('div', { class: 'container' }, [
  h('h1', {}, ['Hello, World!']),
  h('p', {}, ['This is a paragraph.'])
]);
```

### Components

Components are reusable UI pieces. Class components extend `Component` and must implement a `render` method.

```javascript
class MyComponent extends Component {
  constructor(props) {
    super(props, { initialState: { message: 'Initial' } });
  }
  
  // Lifecycle hooks (optional)
  mounted() { console.log('Component mounted!'); }
  
  render(props, state) {
    return h('div', {}, [state.message]);
  }
}
```

### Mounting

Use the `mount` function to render a component into a DOM element.

```javascript
mount(MyComponent, document.getElementById('app'));
```

### Local State (`setState`)

Class components manage their own state. Use `this.setState()` to update state and trigger a re-render.

```javascript
this.setState({ message: 'Updated Message' });

// Functional update
this.setState(prevState => ({ count: prevState.count + 1 }));
```

### Lazy Loading (`lazy`, `Suspense`)

Split your code and load components only when needed.

```javascript
import { lazy, Suspense, mount, h } from "glyphui";

// Define a lazy-loaded component
const LazyComponent = lazy(() => import('./LazyLoadedComponent.js'));

// Use Suspense to provide a fallback UI
mount(() => 
  h(Suspense, { fallback: h('p', {}, ['Loading...']) }, [
    h(LazyComponent, { prop1: 'value' })
  ])
, document.getElementById('app'));
```

### State Management (`createStore`, `connect`, `createActions`)

Manage global application state inspired by Zustand.

```javascript
import { createStore, connect, createActions, Component, h, mount } from "glyphui";

// 1. Define actions
const counterActions = (setState, getState) => ({
  increment: () => setState({ count: getState().count + 1 }),
  decrement: () => setState({ count: getState().count - 1 }),
});

// 2. Create the store
const useCounterStore = createStore(
  {
    count: 0,
    name: 'Counter Store'
  },
  counterActions
);

// 3. Create a component
class CounterDisplay extends Component {
  render(props, state) {
    const { count, name } = props.store; // State comes via props
    return h('p', {}, [`${name}: ${count}`]);
  }
}

// 4. Connect the component to the store
const ConnectedCounter = connect(useCounterStore)(CounterDisplay);

// 5. Create controls (optional)
class CounterControls extends Component {
  render(props) {
    const { increment, decrement } = props.store.actions; // Actions via props
    return h('div', {}, [
      h('button', { on: { click: increment } }, ['+']),
      h('button', { on: { click: decrement } }, ['-'])
    ]);
  }
}
const ConnectedControls = connect(useCounterStore)(CounterControls);

// 6. Mount connected components
mount(() => 
  h('div', {}, [
    h(ConnectedCounter), 
    h(ConnectedControls)
  ])
, document.getElementById('app'));

// You can also access store outside components
const { getState, setState, subscribe, actions } = useCounterStore;
console.log(getState().count);
actions.increment();
subscribe((newState) => console.log('State changed:', newState));
```

## Project Structure

```
glyphui/
├── examples/               # Example applications
│   ├── counter/
│   ├── lazy-loading/
│   ├── memory-game/
│   ├── slots-demo/
│   ├── tictactoe/
│   └── vercel-todo/        # Renamed from minimal-todo
├── packages/
│   └── runtime/            # Core framework code
│       ├── src/            # Source files (JS)
│       └── dist/           # Built distribution file (glyphui.js)
├── docs/
│   └── assets/             # Logo, diagrams etc.
├── .gitignore
├── LICENSE
├── package.json            # Root package file (for workspace)
├── README.md
└── todo.md                 # Project roadmap and todos
```

## Roadmap

See [todo.md](todo.md) for the complete roadmap.

Key upcoming features:

- Hooks for functional components
- Context API
- Server-side Rendering (SSR)
- TypeScript Support
- Improved Developer Experience (DX)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT

---

<div align="center">
  <p>Built with ❤️ as an educational exploration of frontend frameworks</p>
</div>
