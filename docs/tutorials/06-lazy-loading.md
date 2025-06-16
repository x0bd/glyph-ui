# Lazy Loading Components

Lazy loading is a technique that allows you to defer loading parts of your application until they're needed. This can significantly improve initial load times, especially for larger applications. GlyphUI provides built-in support for lazy loading components.

## Why Use Lazy Loading?

Lazy loading offers several benefits:

1. **Faster initial load**: Only load what's immediately needed
2. **Reduced memory usage**: Components are loaded on demand
3. **Better user experience**: Prioritize critical UI elements
4. **Code splitting**: Break your application into smaller chunks

## How Lazy Loading Works in GlyphUI

GlyphUI implements lazy loading through two main concepts:

1. **`lazy()` function**: Wraps a component import to make it load on demand
2. **`Suspense` component**: Provides a fallback UI while the lazy component loads

## Basic Usage

Here's a simple example of lazy loading a component:

```javascript
import { h, lazy, createComponent } from "../path/to/glyphui.js";

// Create a lazy-loaded component
// The import is only executed when the component is rendered
const LazyComponent = lazy(() => import("./HeavyComponent.js"));

// Main app component
const App = createComponent(() => {
	return h("div", { class: "app" }, [
		h("h1", {}, ["My App"]),

		// Render the lazy component with a loading fallback
		h("div", { class: "lazy-container" }, [
			h(
				Suspense,
				{
					fallback: h("div", { class: "loading" }, ["Loading..."]),
				},
				[h(LazyComponent, { prop1: "value" })]
			),
		]),
	]);
});
```

## Creating a Lazy Component

To create a lazy component, use the `lazy()` function:

```javascript
const LazyComponent = lazy(() => import("./path/to/component.js"));
```

The function passed to `lazy()` must:

1. Return a Promise
2. Resolve to a component (either a class extending `Component` or a function created with `createComponent`)

## Using the Suspense Component

The `Suspense` component displays a fallback UI while the lazy component is loading:

```javascript
h(
	Suspense,
	{
		fallback: h("div", { class: "loading-spinner" }, ["Loading..."]),
	},
	[
		// Lazy components go here
		h(LazyComponent),
	]
);
```

The `fallback` prop can be any valid virtual DOM node.

## Error Handling

You can handle loading errors by adding error boundaries around your Suspense components:

```javascript
import { Component, h, lazy, Suspense } from "../path/to/glyphui.js";

class ErrorBoundary extends Component {
	constructor(props) {
		super(props, {
			initialState: { hasError: false, error: null },
		});
	}

	// Called when an error occurs in a child component
	componentDidCatch(error) {
		this.setState({ hasError: true, error });
	}

	render(props, state) {
		if (state.hasError) {
			// Render error UI
			return h("div", { class: "error-boundary" }, [
				h("h2", {}, ["Something went wrong!"]),
				h("p", {}, [state.error.message]),
			]);
		}

		// Render children normally if no error
		return props.children;
	}
}

// Usage
h(ErrorBoundary, {}, [
	h(
		Suspense,
		{
			fallback: h("div", {}, ["Loading..."]),
		},
		[h(LazyComponent)]
	),
]);
```

## Practical Example: Lazy-Loaded Tabs

Let's create a tab interface where each tab content is lazy-loaded:

```javascript
// app.js
import { Component, h, lazy, Suspense } from "../path/to/glyphui.js";

// Lazy-load tab contents
const HomeTab = lazy(() => import("./HomeTab.js"));
const AboutTab = lazy(() => import("./AboutTab.js"));
const ContactTab = lazy(() => import("./ContactTab.js"));

class TabsApp extends Component {
	constructor() {
		super(
			{},
			{
				initialState: { activeTab: "home" },
			}
		);
	}

	setActiveTab(tab) {
		this.setState({ activeTab: tab });
	}

	render(props, state) {
		return h("div", { class: "tabs-app" }, [
			// Tab navigation
			h("nav", { class: "tabs-nav" }, [
				h(
					"button",
					{
						class: state.activeTab === "home" ? "active" : "",
						on: { click: () => this.setActiveTab("home") },
					},
					["Home"]
				),

				h(
					"button",
					{
						class: state.activeTab === "about" ? "active" : "",
						on: { click: () => this.setActiveTab("about") },
					},
					["About"]
				),

				h(
					"button",
					{
						class: state.activeTab === "contact" ? "active" : "",
						on: { click: () => this.setActiveTab("contact") },
					},
					["Contact"]
				),
			]),

			// Tab content with lazy loading
			h("div", { class: "tab-content" }, [
				// Only render the active tab
				state.activeTab === "home" &&
					h(
						Suspense,
						{
							fallback: h("div", { class: "loading" }, [
								"Loading Home...",
							]),
						},
						[h(HomeTab)]
					),

				state.activeTab === "about" &&
					h(
						Suspense,
						{
							fallback: h("div", { class: "loading" }, [
								"Loading About...",
							]),
						},
						[h(AboutTab)]
					),

				state.activeTab === "contact" &&
					h(
						Suspense,
						{
							fallback: h("div", { class: "loading" }, [
								"Loading Contact...",
							]),
						},
						[h(ContactTab)]
					),
			]),
		]);
	}
}

// Mount the app
const app = new TabsApp();
app.mount(document.getElementById("app"));
```

And here's an example of one of the lazy-loaded tab components:

```javascript
// HomeTab.js
import { Component, h } from "../path/to/glyphui.js";

export default class HomeTab extends Component {
	render() {
		return h("div", { class: "home-tab" }, [
			h("h2", {}, ["Welcome Home"]),
			h("p", {}, ["This is the home tab content, loaded lazily."]),
			// More content...
		]);
	}
}
```

## Advanced: Preloading Components

For better user experience, you might want to preload components before they're needed:

```javascript
// Define lazy components
const ProfilePage = lazy(() => import("./ProfilePage.js"));
const SettingsPage = lazy(() => import("./SettingsPage.js"));

// Preload the settings page when hovering over the settings button
function preloadSettings() {
	// This triggers the import but doesn't render the component
	SettingsPage.preload();
}

// In your component render method
h(
	"button",
	{
		on: {
			click: () => navigateTo("/settings"),
			mouseover: preloadSettings,
		},
	},
	["Settings"]
);
```

## Best Practices

1. **Choose the right components to lazy load**:

    - Large components not needed immediately
    - Components in different routes/tabs
    - Optional features

2. **Provide meaningful loading states**:

    - Use skeletons or spinners that match the expected content size
    - Consider the loading time when designing the UI

3. **Group related components**:

    - If components are often used together, consider bundling them

4. **Test with network throttling**:
    - Ensure your loading states provide a good experience on slow connections

## Complete Example: Lazy-Loaded Modal

Here's a complete example of a lazy-loaded modal component:

```javascript
// app.js
import { Component, h, lazy, Suspense } from "../path/to/glyphui.js";

// Lazy-load the heavy modal component
const HeavyModal = lazy(() => import("./HeavyModal.js"));

class App extends Component {
	constructor() {
		super(
			{},
			{
				initialState: { showModal: false },
			}
		);
	}

	toggleModal() {
		this.setState({ showModal: !this.state.showModal });
	}

	render(props, state) {
		return h("div", { class: "app" }, [
			h("h1", {}, ["Lazy Modal Example"]),

			h(
				"button",
				{
					on: { click: () => this.toggleModal() },
				},
				["Open Modal"]
			),

			// Only load the modal when it's needed
			state.showModal &&
				h(
					Suspense,
					{
						fallback: h("div", { class: "modal-loading" }, [
							h("div", { class: "spinner" }),
							h("p", {}, ["Loading modal..."]),
						]),
					},
					[
						h(HeavyModal, {
							onClose: () => this.toggleModal(),
							title: "Lazy Loaded Modal",
						}),
					]
				),
		]);
	}
}

// HeavyModal.js
import { Component, h } from "../path/to/glyphui.js";

export default class HeavyModal extends Component {
	render(props) {
		return h("div", { class: "modal-overlay" }, [
			h("div", { class: "modal" }, [
				h("div", { class: "modal-header" }, [
					h("h2", {}, [props.title || "Modal"]),
					h(
						"button",
						{
							class: "close-button",
							on: { click: props.onClose },
						},
						["×"]
					),
				]),
				h("div", { class: "modal-body" }, [
					h("p", {}, ["This modal was loaded lazily!"]),
					// Imagine lots of complex content here...
				]),
			]),
		]);
	}
}
```

## Next Steps

Now that you understand lazy loading in GlyphUI, you can:

-   Optimize your application's loading performance
-   Create more complex loading strategies
-   Combine lazy loading with other techniques like code splitting
-   Explore the [Virtual DOM Implementation](07-virtual-dom.md) to understand how GlyphUI renders components
