import {
	h,
	Component,
	createApp,
} from "./../../packages/runtime/dist/glyphui.js";

// A deliberately slow function to demonstrate the benefit of memoization
const findLargestPrime = (limit) => {
	console.log(`Calculating largest prime below ${limit}...`);
	// This is a simplified implementation of finding the largest prime below a limit
	// It's intentionally inefficient to demonstrate the performance impact
	let largestPrime = 2;
	for (let i = 3; i < limit; i += 2) {
		let isPrime = true;
		for (let j = 3; j * j <= i; j += 2) {
			if (i % j === 0) {
				isPrime = false;
				break;
			}
		}
		if (isPrime) {
			largestPrime = i;
		}
	}
	return largestPrime;
};

// Class-based component that demonstrates memoization
class PrimeCalculator extends Component {
	constructor() {
		super(
			{},
			{
				initialState: {
					numberLimit: 10000,
					unrelatedState: 0,
					largestPrime: 2, // Initialize with a value
					lastCalculatedLimit: 0,
				},
			}
		);

		// Bind methods
		this.increaseLimit = this.increaseLimit.bind(this);
		this.incrementCounter = this.incrementCounter.bind(this);
	}

	// Calculate the largest prime only when numberLimit changes
	calculateLargestPrime(numberLimit) {
		// Only calculate if needed
		if (numberLimit !== this.state.lastCalculatedLimit) {
			return findLargestPrime(numberLimit);
		}

		return this.state.largestPrime;
	}

	// Called when component is mounted
	mounted() {
		// Initial calculation
		const largestPrime = findLargestPrime(this.state.numberLimit);
		this.setState({
			largestPrime,
			lastCalculatedLimit: this.state.numberLimit,
		});
	}

	increaseLimit() {
		const newLimit = this.state.numberLimit + 10000;
		const largestPrime = findLargestPrime(newLimit);

		this.setState({
			numberLimit: newLimit,
			largestPrime,
			lastCalculatedLimit: newLimit,
		});
	}

	incrementCounter() {
		this.setState({ unrelatedState: this.state.unrelatedState + 1 });
		// No need to recalculate the prime
	}

	render(props, state) {
		const { numberLimit, unrelatedState, largestPrime } = state;

		return h("div", { class: "calculator-container" }, [
			h("h2", { class: "calculator-title" }, ["Prime Number Calculator"]),

			h("div", { class: "result-display" }, [
				h("p", {}, [
					"The largest prime below ",
					h("span", { class: "highlight" }, [String(numberLimit)]),
					" is ",
					h("span", { class: "highlight" }, [String(largestPrime)]),
					".",
				]),
			]),

			h("hr", {}),

			h("div", { class: "controls" }, [
				h("div", { class: "control-group" }, [
					h("h3", {}, ["Prime Calculation"]),
					h("p", { class: "explanation" }, [
						"Changing this will trigger the expensive calculation",
					]),
					h(
						"button",
						{
							class: "control-button slow",
							on: { click: this.increaseLimit },
						},
						["Increase Limit (Slow)"]
					),
					h("p", { class: "limit-display" }, [
						"Current limit: " + String(numberLimit),
					]),
				]),

				h("div", { class: "control-group" }, [
					h("h3", {}, ["Unrelated State"]),
					h("p", { class: "explanation" }, [
						"This counter doesn't affect the prime calculation",
					]),
					h(
						"button",
						{
							class: "control-button fast",
							on: { click: this.incrementCounter },
						},
						["Increment Counter (Fast)"]
					),
					h("p", { class: "counter-display" }, [
						"Counter: " + String(unrelatedState),
					]),
				]),
			]),

			h("div", { class: "info-panel" }, [
				h("h3", {}, ["How Memoization Works"]),
				h("p", {}, [
					"This example demonstrates memoization by only recalculating the prime when the limit changes.",
					h("br", {}),
					"Open your browser console to see when the calculation runs.",
				]),
			]),
		]);
	}
}

// Mount the app
const app = new PrimeCalculator();
app.mount(document.querySelector("main"));
