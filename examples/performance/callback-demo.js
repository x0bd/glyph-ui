import {
	h,
	Component,
	createComponent,
	createApp,
} from "./../../packages/runtime/dist/glyphui.js";

// A child component that logs when it renders
class MemoizedButton extends Component {
	render(props) {
		// Log when the button renders to demonstrate re-renders
		console.log(`Rendering button: ${props.children[0]}`);

		return h(
			"button",
			{
				class: props.className || "button",
				on: { click: props.onButtonClick },
			},
			props.children
		);
	}
}

// Parent component that demonstrates callback memoization
class ParentComponent extends Component {
	constructor() {
		super(
			{},
			{
				initialState: {
					count: 0,
					theme: "light",
				},
			}
		);

		// Memoized callbacks that don't change between renders
		this.handleThemeToggle = this.handleThemeToggle.bind(this);
		this.handleCounterReset = this.handleCounterReset.bind(this);
		this.incrementCount = this.incrementCount.bind(this);

		// Use a fixed callback for the non-memoized example
		// In a real useCallback demo, this would be recreated on each render
		this.nonMemoizedCallback = () => {
			console.log("Non-memoized callback executed");
		};
	}

	// This method is bound in the constructor, so its reference doesn't change
	// This mimics useCallback with empty dependency array
	handleThemeToggle() {
		const currentTheme = this.state.theme;
		this.setState({
			theme: currentTheme === "light" ? "dark" : "light",
		});
	}

	// This method is also bound in the constructor
	// This mimics useCallback with [setCount] dependency
	handleCounterReset() {
		this.setState({ count: 0 });
	}

	incrementCount() {
		this.setState({ count: this.state.count + 1 });
		// Log to show that a new function would be created here in a hooks-based component
		console.log(
			"Count updated, in a hooks component this would create a new function"
		);
	}

	render(props, state) {
		const { count, theme } = state;

		// Log to simulate the creation of a new function on each render
		console.log(
			"Render called - in a hooks component, non-memoized functions would be recreated here"
		);

		return h("div", { class: `parent-container ${theme}` }, [
			h("div", { class: "count-display" }, [
				h("h2", {}, ["Counter Demo"]),
				h("p", {}, ["Count: " + String(count)]),
				h(
					"button",
					{
						class: "increment-button",
						on: { click: this.incrementCount },
					},
					["Increment Count"]
				),
			]),

			h("div", { class: "buttons-container" }, [
				h("h3", {}, ["Child Components"]),
				h("p", { class: "explanation" }, [
					"Open the console to see which buttons re-render when the count changes",
				]),

				// This button uses the memoized callback
				createComponent(
					MemoizedButton,
					{
						className: "theme-button",
						onButtonClick: this.handleThemeToggle,
					},
					["Toggle Theme (Memoized)"]
				),

				// This button also uses a memoized callback
				createComponent(
					MemoizedButton,
					{
						className: "reset-button",
						onButtonClick: this.handleCounterReset,
					},
					["Reset Counter (Memoized)"]
				),

				// This button uses a callback that would be recreated on each render in a hooks component
				createComponent(
					MemoizedButton,
					{
						className: "non-memoized-button",
						onButtonClick: this.nonMemoizedCallback,
					},
					["Non-memoized Button (Simulated)"]
				),
			]),

			h("div", { class: "info-panel" }, [
				h("h3", {}, ["How Callback Memoization Works"]),
				h("p", {}, [
					"Binding methods in the constructor preserves their identity across renders.",
					h("br", {}),
					"This prevents unnecessary re-renders of child components that receive the function as a prop.",
					h("br", {}),
					"The non-memoized button simulates what would happen in a hooks-based component.",
				]),
			]),
		]);
	}
}

// Mount the app
const app = new ParentComponent();
app.mount(document.querySelector("main"));
