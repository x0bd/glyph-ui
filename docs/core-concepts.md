# Core Concepts of GlyphUI

This section covers the fundamental concepts that power GlyphUI. Understanding these will help you use the framework more effectively.

## The Virtual DOM (VDOM)

Like many modern UI frameworks, GlyphUI uses a Virtual DOM (VDOM). The VDOM is a lightweight JavaScript object that is a representation of the actual DOM.

When you make changes to your application's state, GlyphUI first creates a new VDOM tree. It then compares this new VDOM tree with the previous one (a process called "diffing"). Finally, it calculates the most efficient way to update the real DOM to match the new VDOM, minimizing direct DOM manipulations, which are often slow.

This approach leads to better performance and a more declarative way of writing your UI.

## The `h` function

The `h` function is the core of creating VDOM nodes in GlyphUI. It's a shorthand for "hyperscript," which means "script that generates HTML structures."

The `h` function takes three arguments:

1.  **`tag`**: The HTML tag name of the element (e.g., `'div'`, `'p'`, `'h1'`).
2.  **`props`**: An object containing attributes, properties, and event listeners for the element. This is optional.
3.  **`children`**: An array of child nodes. These can be other `h` calls, strings (which are automatically converted to text nodes), or null/undefined values (which are ignored). This is optional.

**Example:**

```javascript
import { h } from "./glyphui.js";

const vdom = h("div", { id: "container", class: "main" }, [
	h("h1", { style: { color: "blue" } }, ["Hello, World!"]),
	h("p", {}, ["This is a paragraph created with GlyphUI."]),
	"Just a string node.",
]);
```

### Special `props`

-   **`class`**: Can be a string (`'my-class'`) or an array of strings (`['class-a', 'class-b']`).
-   **`style`**: An object of CSS properties (e.g., `{ color: 'red', backgroundColor: '#eee' }`).
-   **`on`**: An object where keys are event names (`click`, `input`) and values are the handler functions.
-   **`key`**: A special attribute used to identify nodes during diffing, helping to optimize the rendering of lists. It should be a unique string or number.

## Helper `h` functions

GlyphUI also provides helpers for creating other types of VDOM nodes:

-   **`hString(string)`**: Explicitly creates a text node. Usually not needed as strings in children array are handled automatically.
-   **`hFragment(children)`**: Creates a fragment node. A fragment is a way to group multiple children without adding an extra element to the DOM.

**Example of `hFragment`:**

```javascript
import { h, hFragment } from "./glyphui.js";

// This will render an h1 and a p tag directly inside the parent,
// without a wrapping element.
const fragment = hFragment([
	h("h1", {}, ["Title"]),
	h("p", {}, ["Some text."]),
]);
```

## Rendering

The rendering process in GlyphUI consists of two main parts:

1.  **Mounting**: When an application or component is first rendered, GlyphUI takes the VDOM tree and creates the corresponding real DOM elements, and inserts them into the page. The `createApp().mount()` function starts this process.

2.  **Patching**: When the state of your application changes, a new VDOM tree is created. GlyphUI's `patchDOM` function is responsible for comparing the old and new VDOM trees and applying only the necessary changes to the real DOM. This includes:
    -   Adding, removing, or reordering elements.
    -   Updating attributes and properties.
    -   Updating event listeners.
    -   Changing text content.

This efficient update process is what makes GlyphUI fast and responsive.
