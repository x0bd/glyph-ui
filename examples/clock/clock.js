import { h, Component } from "./../../packages/runtime/dist/glyphui.js";

class Clock extends Component {
	constructor(props) {
		// Pass props and initial state to the parent Component class.
		super(props, {
			initialState: { time: new Date().toLocaleTimeString() },
		});
	}

	// Lifecycle method: called after the component is added to the DOM.
	mounted() {
		this.timerID = setInterval(() => {
			// Update the component's state, triggering a re-render.
			this.setState({ time: new Date().toLocaleTimeString() });
		}, 1000);
	}

	// Lifecycle method: called just before the component is removed from the DOM.
	beforeUnmount() {
		clearInterval(this.timerID); // Clean up the timer.
	}

	render(props, state) {
		return h("div", { class: "clock-container" }, [
			h("h2", { class: "clock-title" }, ["Current Time"]),
			h("div", { class: "clock-display" }, [
				h("span", { class: "time" }, [state.time]),
			]),
			h("p", { class: "clock-info" }, [
				"This component uses lifecycle methods to start and clean up a timer.",
			]),
		]);
	}
}

// Mount the app
const app = new Clock();
app.mount(document.querySelector("main"));
