# Introduction to GlyphUI

GlyphUI is a lightweight JavaScript framework built from the ground up to help developers understand how modern frontend frameworks like React, Vue, and Svelte work under the hood. By implementing core concepts like a virtual DOM, component model, and state management, GlyphUI provides insights into the inner workings of these popular frameworks.

## Why GlyphUI?

While there are many production-ready frameworks available, GlyphUI serves a different purpose:

-   **Educational**: Learn how frontend frameworks implement features like virtual DOM diffing, component lifecycle, and state management
-   **Lightweight**: No dependencies, minimal API surface, easy to understand codebase
-   **Transparent**: Every part of the framework is accessible and understandable
-   **Customizable**: Extend or modify the framework to experiment with different approaches

## Core Features

GlyphUI includes several key features found in modern frameworks:

-   **Virtual DOM**: Efficient rendering through a lightweight virtual DOM implementation
-   **Component Model**: Both class-based and functional components with hooks
-   **State Management**: Local component state and global state management
-   **Event Handling**: Declarative event binding with automatic cleanup
-   **Lifecycle Hooks**: Component lifecycle methods like `mounted`, `updated`, and `unmounted`
-   **Slots**: Content projection for flexible component composition
-   **Lazy Loading**: Load components on demand for better performance

## Framework Architecture

GlyphUI is structured around these core modules:

1. **Virtual DOM (h.js)**: Creates and manages virtual DOM nodes
2. **Component (component.js)**: Base class for all components
3. **DOM Operations (mount-dom.js, patch-dom.js)**: Handles DOM creation and updates
4. **State Management (glyph-state.js)**: Provides global state management
5. **Hooks (hooks.js)**: Implements React-like hooks for functional components

## Next Steps

Now that you have an overview of GlyphUI, proceed to the [Creating Your First Component](02-first-component.md) tutorial to start building with the framework.
