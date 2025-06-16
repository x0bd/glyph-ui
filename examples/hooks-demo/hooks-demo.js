import {
	createApp,
	h,
	hFragment,
	createComponent,
	useState,
	useEffect,
	useRef,
	useMemo,
	useCallback,
} from "../../packages/runtime/dist/glyphui.js";

// Simple counter component using useState
const CounterComponent = (props) => {
	const [count, setCount] = useState(0);

	return h("div", {}, [
		h("h2", {}, ["useState Demo"]),
		h("p", {}, [`Current count: ${count}`]),
		h(
			"button",
			{
				onclick: () => setCount(count + 1),
			},
			["Increment"]
		),
		h(
			"button",
			{
				onclick: () => setCount(count - 1),
			},
			["Decrement"]
		),
		h(
			"button",
			{
				onclick: () => setCount(0),
			},
			["Reset"]
		),
	]);
};

// Timer component using useEffect and useState
const TimerComponent = (props) => {
	const [time, setTime] = useState(0);
	const [isRunning, setIsRunning] = useState(false);

	// Use useEffect to handle the timer
	useEffect(() => {
		let intervalId = null;

		if (isRunning) {
			intervalId = setInterval(() => {
				setTime((prevTime) => prevTime + 1);
			}, 1000);
		}

		// Cleanup function to clear the interval when effect is cleaned up
		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [isRunning]); // Only re-run effect when isRunning changes

	// Format seconds as mm:ss
	const formattedTime = useMemo(() => {
		const minutes = Math.floor(time / 60)
			.toString()
			.padStart(2, "0");
		const seconds = (time % 60).toString().padStart(2, "0");
		return `${minutes}:${seconds}`;
	}, [time]);

	return h("div", {}, [
		h("h2", {}, ["useEffect Demo"]),
		h("p", {}, ["Timer with automatic cleanup:"]),
		h("div", { class: "timer" }, [formattedTime]),
		h(
			"button",
			{
				onclick: () => setIsRunning(!isRunning),
			},
			[isRunning ? "Pause" : "Start"]
		),
		h(
			"button",
			{
				onclick: () => {
					setIsRunning(false);
					setTime(0);
				},
			},
			["Reset"]
		),
	]);
};

// Form component using useState and useRef
const FormComponent = (props) => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [submitted, setSubmitted] = useState(false);

	// Use a ref to store the input element
	const nameInputRef = useRef(null);

	// Focus the name input when component mounts
	useEffect(() => {
		if (nameInputRef.current) {
			nameInputRef.current.focus();
		}
	}, []);

	const handleSubmit = useCallback((e) => {
		e.preventDefault();
		setSubmitted(true);
	}, []);

	return h("div", {}, [
		h("h2", {}, ["useRef & Form Demo"]),

		submitted
			? h("div", {}, [
					h("p", {}, [`Thank you, ${name}!`]),
					h("p", {}, [`We'll contact you at ${email}`]),
					h(
						"button",
						{
							onclick: () => {
								setName("");
								setEmail("");
								setSubmitted(false);
							},
						},
						["Reset"]
					),
			  ])
			: h("form", { onsubmit: handleSubmit }, [
					h("div", {}, [
						h("label", { for: "name" }, ["Name: "]),
						h(
							"input",
							{
								id: "name",
								type: "text",
								value: name,
								oninput: (e) => setName(e.target.value),
								ref: (el) => (nameInputRef.current = el),
							},
							[]
						),
					]),
					h("div", {}, [
						h("label", { for: "email" }, ["Email: "]),
						h(
							"input",
							{
								id: "email",
								type: "email",
								value: email,
								oninput: (e) => setEmail(e.target.value),
							},
							[]
						),
					]),
					h(
						"button",
						{
							type: "submit",
							disabled: !name || !email,
						},
						["Submit"]
					),
			  ]),
	]);
};

// Expensive calculation component using useMemo
const MemoComponent = (props) => {
	const [number, setNumber] = useState(20);

	// An expensive calculation that should be memoized
	const fibonacci = useMemo(() => {
		// For larger numbers, use a more efficient algorithm
		if (number > 30) {
			console.log(
				`Using efficient algorithm for Fibonacci(${number})...`
			);
			// Use iterative approach for larger numbers
			let a = 1,
				b = 1;
			for (let i = 3; i <= number; i++) {
				const temp = a + b;
				a = b;
				b = temp;
			}
			return b;
		}

		console.log(`Calculating Fibonacci(${number}) recursively...`);

		// Use recursive approach for smaller numbers to demonstrate memoization
		const fib = (n) => {
			if (n <= 1) return n;
			if (n === 2) return 1;
			return fib(n - 1) + fib(n - 2);
		};

		return fib(number);
	}, [number]);

	return h("div", {}, [
		h("h2", {}, ["useMemo Demo"]),
		h("p", {}, ["Calculate Fibonacci numbers:"]),
		h("div", {}, [
			h(
				"input",
				{
					type: "range",
					min: 1,
					max: 40,
					value: number,
					oninput: (e) => setNumber(parseInt(e.target.value)),
				},
				[]
			),
			h("span", {}, [` n = ${number}`]),
		]),
		h("p", {}, [`Fibonacci(${number}) = ${fibonacci}`]),
		h("p", { style: "font-size: 0.8em; color: #666;" }, [
			"Note: The calculation is memoized. Check console to see when it recalculates.",
		]),
	]);
};

// Mount components with error handling
function mountComponentSafely(component, containerId) {
	try {
		const container = document.getElementById(containerId);
		if (!container) {
			console.error(`Container not found: #${containerId}`);
			return;
		}

		const app = createApp();
		app.mount(createComponent(component, {}), container);

		console.log(`Component mounted successfully in #${containerId}`);
	} catch (error) {
		console.error(`Error mounting component in #${containerId}:`, error);
		const container = document.getElementById(containerId);
		if (container) {
			container.innerHTML = `
				<div style="color: red; border: 1px solid red; padding: 10px;">
					<h3>Error Mounting Component</h3>
					<pre>${error.message}</pre>
				</div>
			`;
		}
	}
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
	console.log("DOM loaded, mounting components...");

	mountComponentSafely(CounterComponent, "counter-demo");
	mountComponentSafely(TimerComponent, "effect-demo");
	mountComponentSafely(FormComponent, "form-demo");
	mountComponentSafely(MemoComponent, "memo-demo");
});
