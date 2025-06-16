# GlyphShop - E-Commerce Example

This is a minimal e-commerce application built with GlyphUI to demonstrate various features of the framework.

## Features Demonstrated

-   **Class and Functional Components**: Using both component styles
-   **Global State Management**: Using `createStore` and `createActions`
-   **Lazy Loading**: Loading components on demand with custom `Suspense` implementation
-   **Content Projection**: Using slots for flexible component design
-   **Event Handling**: Responding to user interactions
-   **Conditional Rendering**: Showing different UI based on application state

## Running the Example

1. Open the `index.html` file in your browser or use a local server:

    ```
    npx http-server . -o
    ```

2. Interact with the application to explore its features:
    - Browse products by category
    - Sort products by price or name
    - View product details
    - Add products to cart
    - Manage cart items (change quantity, remove items)
    - Checkout

## Implementation Notes

### Custom Suspense Component

Since the framework doesn't export a `Suspense` component, we've implemented a simple version:

```javascript
class Suspense extends Component {
	constructor(props) {
		super(props, { initialState: { isLoading: true } });
	}

	render(props, state) {
		const { fallback, children } = props;

		// If we're still loading, show the fallback UI
		if (state.isLoading) {
			return fallback;
		}

		// Otherwise, show the children
		return children[0];
	}

	mounted() {
		// Attempt to load the lazy component
		Promise.resolve(this.props.children[0])
			.then(() => {
				this.setState({ isLoading: false });
			})
			.catch((error) => {
				console.error("Error loading component:", error);
				this.setState({ isLoading: false });
			});
	}
}
```

### Modal Component with Slots

The Modal component uses slots for flexible content:

```javascript
class Modal extends Component {
	render(props) {
		return h("div", { class: "modal-overlay" }, [
			h("div", { class: "modal" }, [
				h("div", { class: "modal-header" }, [
					createSlot("header", "Modal Title"),
					h(
						"button",
						{
							class: "close-button",
							on: { click: props.onClose },
						},
						["×"]
					),
				]),
				h("div", { class: "modal-content" }, [
					createSlot("content", "Modal Content"),
				]),
			]),
		]);
	}
}
```

## Structure

-   `index.html`: HTML structure and CSS styles
-   `app.js`: Main application code
    -   Component definitions
    -   Store and actions
    -   Event handlers
    -   UI rendering

## Credits

-   Product images from [Unsplash](https://unsplash.com/)
-   Font: Geist Mono
-   Design inspired by Vercel's minimal aesthetic
