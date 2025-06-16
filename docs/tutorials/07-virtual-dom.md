# Understanding the Virtual DOM

The Virtual DOM is a core concept in GlyphUI that enables efficient rendering and updates. This tutorial explores how GlyphUI implements its Virtual DOM, how diffing works, and how changes are applied to the actual DOM.

## What is a Virtual DOM?

A Virtual DOM is a lightweight JavaScript representation of the actual DOM. Instead of directly manipulating the browser's DOM (which is slow), GlyphUI:

1. Creates a virtual representation of the UI
2. When state changes, creates a new virtual representation
3. Compares the new and old virtual representations (diffing)
4. Updates only the parts of the real DOM that have changed

This approach significantly improves performance by minimizing expensive DOM operations.

## Virtual DOM Structure in GlyphUI

In GlyphUI, the Virtual DOM is implemented as a tree of plain JavaScript objects. Each object represents a node in the DOM with the following types:

```javascript
// From packages/runtime/src/h.js
export const DOM_TYPES = {
	TEXT: "text",
	ELEMENT: "element",
	FRAGMENT: "fragment",
};
```

### Element Nodes

Element nodes represent HTML elements:

```javascript
// Structure of an element node
{
  type: DOM_TYPES.ELEMENT,
  tag: 'div',  // HTML tag name
  props: {     // Element attributes and event handlers
    class: 'container',
    id: 'main',
    on: { click: handleClick }
  },
  children: [] // Child nodes
}
```

### Text Nodes

Text nodes represent text content:

```javascript
// Structure of a text node
{
  type: DOM_TYPES.TEXT,
  value: 'Hello, world!'
}
```

### Fragment Nodes

Fragment nodes are containers for multiple nodes without creating an extra DOM element:

```javascript
// Structure of a fragment node
{
  type: DOM_TYPES.FRAGMENT,
  children: [] // Child nodes
}
```

## Creating Virtual DOM Nodes

GlyphUI provides helper functions to create virtual DOM nodes:

### The `h` Function

The `h` function (short for "hyperscript") creates element nodes:

```javascript
import { h } from "../path/to/glyphui.js";

// Create a div with class "container" and two child elements
const vNode = h("div", { class: "container" }, [
	h("h1", {}, ["Hello, world!"]),
	h("p", {}, ["Welcome to GlyphUI"]),
]);
```

### The `hString` Function

The `hString` function creates text nodes:

```javascript
import { hString } from "../path/to/glyphui.js";

// Create a text node
const textNode = hString("Hello, world!");
```

### The `hFragment` Function

The `hFragment` function creates fragment nodes:

```javascript
import { hFragment } from "../path/to/glyphui.js";

// Create a fragment with multiple children
const fragment = hFragment([
	h("h1", {}, ["Title"]),
	h("p", {}, ["Paragraph 1"]),
	h("p", {}, ["Paragraph 2"]),
]);
```

## Mounting the Virtual DOM

When you first render a component, GlyphUI mounts the virtual DOM to the real DOM:

```javascript
// From packages/runtime/src/mount-dom.js (simplified)
export function mountDOM(vdom, parentEl, index = 0) {
	switch (vdom.type) {
		case DOM_TYPES.TEXT:
			// Create a text node
			const textNode = document.createTextNode(vdom.value);
			// Insert it into the parent element
			parentEl.insertBefore(textNode, parentEl.childNodes[index] || null);
			// Store reference to the real DOM node
			vdom.el = textNode;
			break;

		case DOM_TYPES.ELEMENT:
			// Create an element
			const element = document.createElement(vdom.tag);
			// Set attributes
			setProps(element, vdom.props);
			// Mount children
			vdom.children.forEach((child, i) => {
				mountDOM(child, element, i);
			});
			// Insert it into the parent element
			parentEl.insertBefore(element, parentEl.childNodes[index] || null);
			// Store reference to the real DOM node
			vdom.el = element;
			break;

		case DOM_TYPES.FRAGMENT:
			// Mount all children directly to the parent
			vdom.children.forEach((child, i) => {
				mountDOM(child, parentEl, index + i);
			});
			break;
	}

	return vdom;
}
```

## Updating the DOM (Diffing)

When a component's state changes, GlyphUI creates a new virtual DOM tree and compares it with the previous one. This process is called "diffing" or "reconciliation":

```javascript
// From packages/runtime/src/patch-dom.js (simplified)
export function patchDOM(oldVdom, newVdom, parentEl, index = 0) {
	// If the old vdom doesn't exist, mount the new one
	if (!oldVdom) {
		return mountDOM(newVdom, parentEl, index);
	}

	// If the new vdom doesn't exist, remove the old one
	if (!newVdom) {
		destroyDOM(oldVdom);
		return null;
	}

	// If the node types are different, replace the old with the new
	if (oldVdom.type !== newVdom.type || oldVdom.tag !== newVdom.tag) {
		destroyDOM(oldVdom);
		return mountDOM(newVdom, parentEl, index);
	}

	// Handle different node types
	switch (newVdom.type) {
		case DOM_TYPES.TEXT:
			// Update text if it changed
			if (oldVdom.value !== newVdom.value) {
				oldVdom.el.nodeValue = newVdom.value;
			}
			// Keep the reference to the DOM node
			newVdom.el = oldVdom.el;
			break;

		case DOM_TYPES.ELEMENT:
			// Update props
			updateProps(oldVdom.el, newVdom.props, oldVdom.props);

			// Update children
			patchChildren(oldVdom, newVdom);

			// Keep the reference to the DOM node
			newVdom.el = oldVdom.el;
			break;

		case DOM_TYPES.FRAGMENT:
			// Update fragment children
			patchChildren(oldVdom, newVdom);
			break;
	}

	return newVdom;
}
```

## Updating Children

One of the most complex parts of the Virtual DOM implementation is updating children efficiently:

```javascript
// From packages/runtime/src/patch-dom.js (simplified)
function patchChildren(oldVdom, newVdom) {
	const oldChildren = oldVdom.children || [];
	const newChildren = newVdom.children || [];
	const parentEl = oldVdom.el;

	// Simple implementation: update/create/remove children by index
	for (let i = 0; i < Math.max(oldChildren.length, newChildren.length); i++) {
		patchDOM(oldChildren[i], newChildren[i], parentEl, i);
	}
}
```

In a more advanced implementation, GlyphUI uses key-based reconciliation to efficiently update lists of elements:

```javascript
// More advanced implementation with key-based reconciliation
function patchChildren(oldVdom, newVdom) {
	const oldChildren = oldVdom.children || [];
	const newChildren = newVdom.children || [];
	const parentEl = oldVdom.el;

	// Create a map of keyed old children
	const keyedOldChildren = {};
	oldChildren.forEach((child, i) => {
		if (child.props && child.props.key != null) {
			keyedOldChildren[child.props.key] = { vdom: child, index: i };
		}
	});

	let lastIndex = 0;

	// Process new children
	newChildren.forEach((newChild, i) => {
		// If the child has a key, try to find it in old children
		if (newChild.props && newChild.props.key != null) {
			const key = newChild.props.key;
			const oldChild = keyedOldChildren[key];

			if (oldChild) {
				// Update the existing child
				patchDOM(oldChild.vdom, newChild, parentEl, i);

				// Check if we need to move the node
				if (oldChild.index < lastIndex) {
					// Move the DOM node to the correct position
					parentEl.insertBefore(
						newChild.el,
						parentEl.childNodes[i] || null
					);
				} else {
					lastIndex = oldChild.index;
				}

				// Mark as used
				delete keyedOldChildren[key];
			} else {
				// New child with key, mount it
				mountDOM(newChild, parentEl, i);
			}
		} else {
			// No key, simple update by index
			patchDOM(oldChildren[i], newChild, parentEl, i);
		}
	});

	// Remove any old keyed children that weren't reused
	Object.values(keyedOldChildren).forEach(({ vdom }) => {
		destroyDOM(vdom);
	});
}
```

## Handling Props and Events

GlyphUI handles props and events when mounting and updating elements:

```javascript
// From packages/runtime/src/attributes.js (simplified)
function setProps(el, props) {
	if (!props) return;

	// Handle special props
	for (const [key, value] of Object.entries(props)) {
		if (key === "class" || key === "className") {
			// Handle class names
			el.className = value;
		} else if (key === "style") {
			// Handle styles
			if (typeof value === "string") {
				el.style.cssText = value;
			} else {
				for (const [styleKey, styleValue] of Object.entries(value)) {
					el.style[styleKey] = styleValue;
				}
			}
		} else if (key === "on") {
			// Handle event listeners
			for (const [event, handler] of Object.entries(value)) {
				el.addEventListener(event, handler);
			}
		} else {
			// Handle regular attributes
			el.setAttribute(key, value);
		}
	}
}

function updateProps(el, newProps, oldProps = {}) {
	// Remove old props that don't exist in new props
	for (const key of Object.keys(oldProps)) {
		if (key === "on") {
			// Remove old event listeners
			for (const event of Object.keys(oldProps.on)) {
				if (!newProps.on || !newProps.on[event]) {
					el.removeEventListener(event, oldProps.on[event]);
				}
			}
		} else if (!(key in newProps)) {
			// Remove attribute
			el.removeAttribute(key);
		}
	}

	// Set new props
	setProps(el, newProps);
}
```

## Cleaning Up

When components are removed, GlyphUI cleans up DOM nodes and event listeners:

```javascript
// From packages/runtime/src/destroy-dom.js (simplified)
export function destroyDOM(vdom) {
	if (!vdom) return;

	switch (vdom.type) {
		case DOM_TYPES.TEXT:
		case DOM_TYPES.ELEMENT:
			// Remove event listeners
			if (vdom.props && vdom.props.on) {
				for (const [event, handler] of Object.entries(vdom.props.on)) {
					vdom.el.removeEventListener(event, handler);
				}
			}

			// Remove the element from the DOM
			if (vdom.el && vdom.el.parentNode) {
				vdom.el.parentNode.removeChild(vdom.el);
			}

			// Recursively destroy children
			if (vdom.children) {
				vdom.children.forEach(destroyDOM);
			}
			break;

		case DOM_TYPES.FRAGMENT:
			// Recursively destroy children
			if (vdom.children) {
				vdom.children.forEach(destroyDOM);
			}
			break;
	}
}
```

## Performance Optimizations

GlyphUI includes several optimizations to improve Virtual DOM performance:

1. **Memoization**: Components can use `useMemo` to avoid recalculating values
2. **Key-based reconciliation**: Using keys to efficiently update lists
3. **Batched updates**: Multiple state changes can be batched into a single render
4. **Lazy evaluation**: Only create virtual DOM nodes when needed

## Example: Component Rendering Cycle

Here's how the Virtual DOM works in a complete component lifecycle:

```javascript
import { Component, h } from "../path/to/glyphui.js";

class Counter extends Component {
	constructor() {
		super({}, { initialState: { count: 0 } });
	}

	increment() {
		this.setState({ count: this.state.count + 1 });
	}

	render(props, state) {
		// Create a new virtual DOM tree
		return h("div", { class: "counter" }, [
			h("button", { on: { click: () => this.increment() } }, ["-"]),
			h("span", {}, [`Count: ${state.count}`]),
			h("button", { on: { click: () => this.increment() } }, ["+"]),
		]);
	}
}

// 1. Create component instance
const counter = new Counter();

// 2. Initial mount - creates virtual DOM and mounts to real DOM
counter.mount(document.getElementById("app"));

// 3. When increment() is called:
//    - setState updates the component state
//    - render() creates a new virtual DOM tree
//    - patchDOM compares old and new trees
//    - Only the span with the count text is updated in the real DOM
```

## Conclusion

The Virtual DOM is a powerful abstraction that makes UI updates efficient. GlyphUI's implementation follows these key principles:

1. **Declarative rendering**: Define what the UI should look like, not how to change it
2. **Minimal DOM operations**: Only update what has actually changed
3. **Efficient diffing**: Smart comparison of old and new virtual DOM trees
4. **Automatic cleanup**: Handle DOM node and event listener cleanup

By understanding how the Virtual DOM works, you can write more efficient components and better understand the performance characteristics of your GlyphUI applications.

## Next Steps

Now that you understand the Virtual DOM implementation, you can:

-   Optimize your components for better performance
-   Use keys effectively when rendering lists
-   Build more complex UI patterns
-   Explore [Event Handling](08-event-handling.md) in GlyphUI
