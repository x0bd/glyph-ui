import {
	Component,
	h,
	hFragment,
	hString,
} from "./../../packages/runtime/dist/glyphui.js";

class CounterApp extends Component {
	constructor() {
		super({}, {
			initialState: { count: 0 }
		});
	}
	
	increment() {
		this.setState({ count: this.state.count + 1 });
	}
	
	decrement() {
		this.setState({ count: this.state.count - 1 });
	}
	
	render(props, state) {
		return hFragment([
			h("button", { on: { click: () => this.decrement() } }, ["-"]),
			h("span", {}, [
				hString("count is: "),
				hString(state.count),
			]),
			h("button", { on: { click: () => this.increment() } }, ["+"]),
		]);
	}
}

// Mount the app
const app = new CounterApp();
app.mount(document.querySelector("main")); 