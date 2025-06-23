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

	// This method creates a new function on every render
	// This demonstrates what happens without useCallback
	getNonMemoizedCallback() {
		return () => console.log("This function is created on every render");
	}

	incrementCount() {
		this.setState({ count: this.state.count + 1 });
	}

	render(props, state) {
		const { count, theme } = state;

		return h("div", { class: `parent-container ${theme}` }, [
			h("div", { class: "count-display" }, [
				h("h2", {}, ["Counter Demo"]),
				h("p", {}, [`Count: ${count}`]),
				h(
					"button",
					{
						class: "increment-button",
						on: { click: () => this.incrementCount() },
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

				// This button creates a new function on every render
				createComponent(
					MemoizedButton,
					{
						className: "non-memoized-button",
						onButtonClick: this.getNonMemoizedCallback(),
					},
					["Non-memoized Button"]
				),
			]),

			h("div", { class: "info-panel" }, [
				h("h3", {}, ["How Callback Memoization Works"]),
				h("p", {}, [
					"Binding methods in the constructor preserves their identity across renders.",
					h("br", {}),
					"This prevents unnecessary re-renders of child components that receive the function as a prop.",
				]),
			]),
		]);
	}
}

// Mount the app
const app = new ParentComponent();
app.mount(document.querySelector("main"));
