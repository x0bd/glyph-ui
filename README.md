# GlyphUI

<div align="center">
  <img src="docs/assets/glyphui-logo.png" alt="GlyphUI Logo" width="180">
  <p><strong>A lightweight JavaScript framework built to understand how frontend frameworks work.</strong></p>
  <p>
    <a href="#features">Features</a> •
    <a href="#examples">Examples</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#documentation">Documentation</a> •
    <a href="#roadmap">Roadmap</a>
  </p>
</div>

## Overview

GlyphUI is a modern JavaScript framework built from the ground up to demystify how popular frontend frameworks like React, Vue, and Svelte operate under the hood. By building a framework from scratch, we gain deep insights into core concepts like virtual DOM diffing, component lifecycle, state management, and more.

```javascript
import { Component, createComponent, h } from "glyphui";

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
const counter = new Counter();
counter.mount(document.getElementById('app'));
```

## Features

GlyphUI includes a growing list of features that mirror modern frontend frameworks:

- ✅ **Virtual DOM** - Efficient rendering through a lightweight virtual DOM implementation
- ✅ **Component Model** - Class-based components with state management and lifecycle hooks
- ✅ **State Management** - Local component state with reactive updates
- ✅ **Event Handling** - Declarative event binding with efficient cleanup
- ✅ **Component Composition** - Nest components to build complex UIs
- ✅ **Slots** - Content projection similar to Web Components
- ✅ **Efficient Updates** - Smart reconciliation to minimize DOM operations

## Examples

The repository includes several examples that demonstrate the framework's capabilities:

- **[Counter](examples/counter/counter.html)** - Simple counter demonstrating state updates
- **[Todo App](examples/todo/todo.html)** - Classic todo list with CRUD operations
- **[Tic-Tac-Toe](examples/tictactoe/index.html)** - Game with complex state management
- **[Memory Game](examples/memory-game/index.html)** - Card matching game showcasing animations and component composition
- **[Slots Demo](examples/slots-demo/slots-demo.html)** - Demonstrating content projection with slots

To run the examples:

```bash
# From the project root
npx http-server . -c-1
```

Then visit:
- http://localhost:8080/examples/counter/counter.html
- http://localhost:8080/examples/todo/todo.html
- http://localhost:8080/examples/tictactoe/index.html
- http://localhost:8080/examples/memory-game/index.html
- http://localhost:8080/examples/slots-demo/slots-demo.html

## Getting Started

### Installation

Currently, GlyphUI is available directly from this repository:

```bash
# Clone the repository
git clone https://github.com/yourusername/glyphui.git
cd glyphui

# Install dependencies
npm install

# Build the framework
cd packages/runtime
npm run build
```

### Usage

#### Importing the framework

```javascript
// From local build
import { 
  Component, 
  createComponent, 
  h, 
  hFragment 
} from "./path/to/packages/runtime/dist/glyphui.js";

// Or from a CDN (if published)
// import { Component, createComponent, h, hFragment } from "https://unpkg.com/glyphui@latest";
```

#### Creating a component

```javascript
class HelloWorld extends Component {
  constructor(props) {
    super(props, { initialState: { name: props.initialName || "World" } });
  }
  
  updateName(newName) {
    this.setState({ name: newName });
  }
  
  render(props, state) {
    return h('div', {}, [
      h('h1', {}, [`Hello, ${state.name}!`]),
      h('input', { 
        value: state.name,
        on: { 
          input: (e) => this.updateName(e.target.value) 
        }
      })
    ]);
  }
}

// Mount the component
const hello = new HelloWorld({ initialName: "GlyphUI" });
hello.mount(document.getElementById('app'));
```

## Documentation

### Core Concepts

#### Virtual DOM

GlyphUI uses a virtual DOM to efficiently update the real DOM. The virtual DOM is a lightweight JavaScript representation of the actual DOM.

```javascript
// Creating a virtual DOM node
const vNode = h('div', { class: 'container' }, [
  h('h1', {}, ['Hello, World!']),
  h('p', {}, ['This is a paragraph.'])
]);
```

#### Components

Components are the building blocks of GlyphUI applications. They encapsulate state and rendering logic.

```javascript
class MyComponent extends Component {
  // Constructor - initialize props and state
  constructor(props) {
    super(props, { initialState: { /* initial state */ } });
  }
  
  // Lifecycle hooks
  beforeMount() { /* called before component is mounted */ }
  mounted() { /* called after component is mounted */ }
  beforeUpdate(oldProps, newProps) { /* called before update */ }
  updated(oldProps, newProps) { /* called after update */ }
  beforeUnmount() { /* called before component is unmounted */ }
  unmounted() { /* called after component is unmounted */ }
  
  // Render method - returns virtual DOM
  render(props, state, emit) {
    return h('div', {}, [/* child elements */]);
  }
}
```

#### State Management

Components manage their own state and re-render when the state changes.

```javascript
// Updating state
this.setState({ count: this.state.count + 1 });

// Updating state using previous state
this.setState(prevState => ({ count: prevState.count + 1 }));
```

#### Slots

Slots allow components to accept content from parent components.

```javascript
// In child component
render() {
  return h('div', { class: 'card' }, [
    h('div', { class: 'card-header' }, [
      createSlot('header', {}, ['Default Header'])
    ]),
    h('div', { class: 'card-body' }, [
      createSlot('default', {}, ['Default Content'])
    ])
  ]);
}

// In parent component
render() {
  return createComponent(Card, {}, [
    createSlotContent('header', [h('h2', {}, ['Custom Header'])]),
    h('p', {}, ['This will go in the default slot'])
  ]);
}
```

## Project Structure

```
glyphui/
├── examples/               # Example applications
│   ├── counter/            # Simple counter example
│   ├── todo/               # Todo list application
│   ├── tictactoe/          # Tic-tac-toe game
│   ├── memory-game/        # Memory card game
│   └── slots-demo/         # Slots functionality demo
├── packages/
│   └── runtime/            # Core framework code
│       ├── src/            # Source files
│       └── dist/           # Built distribution files
└── todo.md                 # Project roadmap and todos
```

## Roadmap

See [todo.md](todo.md) for the complete roadmap of planned features.

Upcoming features include:

- Keyed Lists for efficient list rendering
- Optimized reconciliation algorithm
- Hooks for functional components
- Context API for passing data through the component tree
- Server-side rendering

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License - see the [license.md](license.md) file for details.

---

<div align="center">
  <p>Built with ❤️ as an educational exploration of frontend frameworks</p>
</div>
