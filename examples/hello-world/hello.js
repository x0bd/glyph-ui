import { h, Component } from "./../../packages/runtime/dist/glyphui.js";

class HelloWorldApp extends Component {
	constructor() {
		super(
			{},
			{
				initialState: { greeting: "Hello, World!" },
			}
		);

		this.greetings = [
			"Hello, World!",
			"Hola, Mundo!",
			"Bonjour, Monde!",
			"Ciao, Mondo!",
			"こんにちは世界！",
			"你好，世界！",
			"Привет, мир!",
		];
	}

	changeGreeting() {
		const currentIndex = this.greetings.indexOf(this.state.greeting);
		const nextIndex = (currentIndex + 1) % this.greetings.length;
		this.setState({ greeting: this.greetings[nextIndex] });
	}

	render(props, state) {
		return h("div", {}, [
			h("div", { class: "greeting" }, [state.greeting]),
			h(
				"button",
				{
					class: "change-btn",
					on: { click: () => this.changeGreeting() },
				},
				["Next →"]
			),
		]);
	}
}

// Mount the app
const app = new HelloWorldApp();
app.mount(document.querySelector("main"));
