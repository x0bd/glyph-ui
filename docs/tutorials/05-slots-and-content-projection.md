# Slots and Content Projection

Slots provide a way to create flexible, reusable components by allowing parent components to pass content to child components. This concept, often called "content projection," enables you to build components with customizable sections.

## Understanding Slots

In GlyphUI, slots work by:

1. Creating named placeholders in child components
2. Passing content from parent components to fill these placeholders
3. Rendering the content in the appropriate places

This approach is similar to the slot system in frameworks like Vue or web components.

## Basic Slot Usage

GlyphUI provides two main functions for working with slots:

-   `createSlot`: Creates a slot placeholder in a component
-   `createSlotContent`: Marks content to be inserted into a specific slot

### Creating a Component with Slots

Let's create a simple card component with slots for the header, body, and footer:

```javascript
import { Component, h, createSlot } from "../path/to/glyphui.js";

class Card extends Component {
	render() {
		return h("div", { class: "card" }, [
			h("div", { class: "card-header" }, [
				// Create a slot for the header content
				createSlot("header", "Default Header"),
			]),
			h("div", { class: "card-body" }, [
				// Create a slot for the body content
				createSlot("body", "Default Body Content"),
			]),
			h("div", { class: "card-footer" }, [
				// Create a slot for the footer content
				createSlot("footer", "Default Footer"),
			]),
		]);
	}
}
```

### Using the Component with Slots

Now, let's use our Card component and provide content for its slots:

```javascript
import { Component, h, createSlotContent } from "../path/to/glyphui.js";
import { Card } from "./Card.js";

class App extends Component {
	render() {
		return h("div", { class: "app" }, [
			h(Card, {}, [
				// Provide content for the header slot
				createSlotContent("header", [h("h2", {}, ["My Card Title"])]),

				// Provide content for the body slot
				createSlotContent("body", [
					h("p", {}, ["This is the main content of the card."]),
					h("button", { on: { click: () => alert("Clicked!") } }, [
						"Click Me",
					]),
				]),

				// Provide content for the footer slot
				createSlotContent("footer", [
					h("small", {}, ["© 2023 GlyphUI"]),
				]),
			]),
		]);
	}
}
```

## Default Slot Content

You can provide default content for slots that will be used if no content is provided:

```javascript
// In the Card component
createSlot("header", h("h3", {}, ["Default Title"]));
```

If the parent doesn't provide content for the "header" slot, "Default Title" will be displayed.

## Named vs. Default Slots

GlyphUI supports both named slots and a default slot:

```javascript
import {
	Component,
	h,
	createSlot,
	createSlotContent,
} from "../path/to/glyphui.js";

// Component with named and default slots
class Layout extends Component {
	render() {
		return h("div", { class: "layout" }, [
			h("header", { class: "layout-header" }, [
				createSlot("header", "Default Header"),
			]),
			h("main", { class: "layout-content" }, [
				// Default slot (no name)
				createSlot(null, "Default Content"),
			]),
			h("footer", { class: "layout-footer" }, [
				createSlot("footer", "Default Footer"),
			]),
		]);
	}
}

// Using the Layout component
class App extends Component {
	render() {
		return h(Layout, {}, [
			// Named slot content
			createSlotContent("header", [h("h1", {}, ["My App"])]),

			// Default slot content (no name specified)
			createSlotContent(null, [
				h("p", {}, ["This content goes in the default slot."]),
			]),

			// Another named slot
			createSlotContent("footer", [h("p", {}, ["© 2023 My App"])]),
		]);
	}
}
```

## Conditional Slots

You can conditionally render slots based on whether content was provided:

```javascript
import { Component, h, createSlot } from "../path/to/glyphui.js";

class Alert extends Component {
	render(props) {
		return h("div", { class: `alert alert-${props.type || "info"}` }, [
			h("div", { class: "alert-title" }, [
				// Only show the title section if title content is provided
				props.hasSlotContent("title") ? createSlot("title") : null,
			]),
			h("div", { class: "alert-content" }, [
				createSlot(null, "Default alert message"),
			]),
		]);
	}
}
```

## Scoped Slots

For more advanced use cases, you can create scoped slots that pass data from the child component to the slot content:

```javascript
import {
	Component,
	h,
	createSlot,
	createSlotContent,
} from "../path/to/glyphui.js";

// List component with scoped slot
class List extends Component {
	constructor(props) {
		super(props, {
			initialState: {
				items: props.items || [],
			},
		});
	}

	render(props, state) {
		return h(
			"ul",
			{ class: "list" },
			state.items.map((item, index) =>
				h("li", { key: index }, [
					// Pass the item and index to the slot
					createSlot("item", h("span", {}, [item]), { item, index }),
				])
			)
		);
	}
}

// Using the List with scoped slot
class App extends Component {
	constructor() {
		super(
			{},
			{
				initialState: {
					fruits: ["Apple", "Banana", "Cherry", "Date"],
				},
			}
		);
	}

	render(props, state) {
		return h("div", { class: "app" }, [
			h(List, { items: state.fruits }, [
				// Access the scoped slot variables (item and index)
				createSlotContent("item", (scope) =>
					h("div", { class: "fruit-item" }, [
						h("span", { class: "index" }, [`${scope.index + 1}. `]),
						h("span", { class: "name" }, [scope.item]),
						h(
							"button",
							{
								on: {
									click: () =>
										alert(`You selected ${scope.item}`),
								},
							},
							["Select"]
						),
					])
				),
			]),
		]);
	}
}
```

## Best Practices

1. **Use descriptive slot names**: Choose clear names that indicate the purpose of each slot
2. **Provide default content**: Always include sensible defaults for optional slots
3. **Document available slots**: When creating reusable components, document which slots are available
4. **Keep slots focused**: Each slot should have a single, clear purpose

## Complete Example: Tab Component

Here's a complete example of a tab component using slots:

```javascript
// tabs.js
import {
	Component,
	h,
	createSlot,
	createSlotContent,
} from "../path/to/glyphui.js";

// Tab component
export class Tab extends Component {
	render(props) {
		return h(
			"div",
			{
				class: "tab-content",
				style: `display: ${props.active ? "block" : "none"}`,
			},
			[
				// Default slot for tab content
				createSlot(null),
			]
		);
	}
}

// Tabs container component
export class Tabs extends Component {
	constructor(props) {
		super(props, {
			initialState: {
				activeTab: 0,
			},
		});
	}

	setActiveTab(index) {
		this.setState({ activeTab: index });
	}

	render(props, state) {
		// Extract child Tab components
		const tabComponents = props.children.filter(
			(child) => child.tag && child.tag.name === "Tab"
		);

		// Create tab buttons
		const tabButtons = tabComponents.map((tab, index) =>
			h(
				"button",
				{
					class: `tab-button ${
						state.activeTab === index ? "active" : ""
					}`,
					on: { click: () => this.setActiveTab(index) },
				},
				[
					// Use the tab's title slot or a default title
					createSlot(`tab-title-${index}`, `Tab ${index + 1}`),
				]
			)
		);

		// Create tab content with active state
		const tabContent = tabComponents.map((tab, index) => {
			// Clone the tab component and add the active prop
			const tabWithProps = {
				...tab,
				props: {
					...tab.props,
					active: state.activeTab === index,
				},
			};
			return tabWithProps;
		});

		return h("div", { class: "tabs-container" }, [
			h("div", { class: "tab-buttons" }, tabButtons),
			h("div", { class: "tab-contents" }, tabContent),
		]);
	}
}

// app.js
import { Component, h, createSlotContent } from "../path/to/glyphui.js";
import { Tabs, Tab } from "./tabs.js";

class App extends Component {
	render() {
		return h("div", { class: "app" }, [
			h(Tabs, {}, [
				h(Tab, {}, [
					// Title for the first tab
					createSlotContent("tab-title-0", ["Home"]),
					// Content for the first tab
					h("h2", {}, ["Welcome to GlyphUI"]),
					h("p", {}, ["This is the home tab content."]),
				]),

				h(Tab, {}, [
					// Title for the second tab
					createSlotContent("tab-title-1", ["About"]),
					// Content for the second tab
					h("h2", {}, ["About GlyphUI"]),
					h("p", {}, [
						"GlyphUI is a lightweight JavaScript framework.",
					]),
				]),

				h(Tab, {}, [
					// Title for the third tab
					createSlotContent("tab-title-2", ["Contact"]),
					// Content for the third tab
					h("h2", {}, ["Contact Us"]),
					h("p", {}, ["Email: info@glyphui.example"]),
				]),
			]),
		]);
	}
}

// Mount the app
const app = new App();
app.mount(document.getElementById("app"));
```

## Next Steps

Now that you understand slots and content projection, you can:

-   Create more flexible and reusable components
-   Build complex UI patterns like modals, tabs, and accordions
-   Learn about [Lazy Loading](06-lazy-loading.md) in GlyphUI
