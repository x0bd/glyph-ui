import { h, Component } from "./../../packages/runtime/dist/glyphui.js";

// This example demonstrates the efficiency of the Virtual DOM patcher
class PatcherDemo extends Component {
	constructor() {
		super(
			{},
			{
				initialState: { text: "Type here..." },
			}
		);
	}

	updateText(newText) {
		this.setState({ text: newText });
	}

	render(props, state) {
		return h("div", { style: { padding: "20px" } }, [
			h("h3", {}, ["Real-time VDOM Patching Demo"]),
			h("p", {}, [
				"Type in the input field below and watch how efficiently the VDOM updates",
			]),
			h("input", {
				value: state.text,
				style: {
					padding: "8px",
					width: "100%",
					marginBottom: "10px",
				},
				on: {
					input: (event) => this.updateText(event.target.value),
				},
			}),
			h("hr", {}),
			h("p", {}, [`Display: ${state.text}`]),
			h("p", { style: { fontSize: "0.9rem", color: "#666" } }, [
				"Note: When you type, only the text content changes in the DOM, not the entire component structure.",
			]),
		]);
	}
}

// Mount the app
const app = new PatcherDemo();
app.mount(document.querySelector("main"));
