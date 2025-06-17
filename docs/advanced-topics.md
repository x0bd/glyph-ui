# Advanced Topics in GlyphUI

This section covers some of the more advanced features of GlyphUI that can help you optimize your application and build more flexible components.

## Lazy Loading Components

Code-splitting your application can greatly improve its initial load time. GlyphUI provides a `lazy` utility to easily load components on demand.

The `lazy` function takes a dynamic import function as its first argument.

`const LazyComponent = lazy(() => import('./MyComponent.js'));`

You can then use `LazyComponent` just like any other component.

```javascript
import { h, createComponent, lazy } from "./glyphui.js";

// This component will only be downloaded and parsed when it's about to be rendered.
const LazyLoaded = lazy(() => import("./SomeHeavyComponent.js"));

const App = () => {
	return h("div", {}, [
		h("h1", {}, ["Welcome"]),
		createComponent(LazyLoaded, { someProp: "value" }),
	]);
};
```

### Loading and Error States

The `lazy` function also accepts an options object as a second argument, where you can provide components to render while the lazy component is loading or if an error occurs.

```javascript
const LoadingComponent = () => h("p", {}, ["Loading..."]);
const ErrorComponent = ({ error }) => h("p", {}, [`Error: ${error.message}`]);

const LazyLoaded = lazy(() => import("./SomeHeavyComponent.js"), {
	loading: LoadingComponent,
	error: ErrorComponent,
});
```

If you don't provide these, GlyphUI will use its own simple default loading and error components.

## Slots

Slots are a mechanism for component composition that allows you to pass VDOM templates from a parent component to a child component. This is very useful for creating reusable layout components.

The system consists of two parts: `createSlot` used inside a component, and `createSlotContent` used when you instantiate that component.

### Defining Slots in a Component

Inside your component (let's call it `Card`), you use `createSlot` to define areas where content can be injected.

**`Card.js`**

```javascript
import { h, Component, createSlot } from "./glyphui.js";

class Card extends Component {
	render(props) {
		return h("div", { class: "card" }, [
			h("div", { class: "card-header" }, [
				// This is the "header" slot.
				createSlot("header", {}, [
					// Default content for the header slot
					h("h3", {}, ["Default Header"]),
				]),
			]),
			h("div", { class: "card-body" }, [
				// This is the default slot.
				createSlot("default", {}, [
					h("p", {}, ["Default card content."]),
				]),
			]),
		]);
	}
}
```

### Providing Content for Slots

When you use the `Card` component, you can provide content for its slots using `createSlotContent`.

**`App.js`**

```javascript
import { h, createComponent, createSlotContent } from "./glyphui.js";
import Card from "./Card.js";

const App = () => {
	return createComponent(Card, {}, [
		// Content for the "header" slot
		createSlotContent("header", [
			h("h2", { style: { color: "purple" } }, ["My Custom Header"]),
		]),

		// Content for the "default" slot
		createSlotContent("default", [
			h("p", {}, ["This is the body of my card."]),
			h("a", { href: "#" }, ["Learn More"]),
		]),
	]);
};
```

-   Any children passed to a component that are not wrapped in `createSlotContent` will be placed in the `default` slot.
-   If you provide content for a slot, it will replace the default content defined in the component.

Slots are a powerful way to create flexible and reusable components that separate layout from content.
