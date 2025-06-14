export default function HooksPage() {
	return (
		<article className="space-y-8">
			<header className="border-b border-border pb-6 mb-8">
				<div className="flex items-center gap-2 mb-4">
					<div className="inline-block bg-foreground text-background px-3 py-1 font-mono text-xs">
						FRAMEWORK CORE
					</div>
					<div className="h-px bg-border flex-grow"></div>
				</div>
				<div className="flex items-center gap-4">
					<div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center font-mono text-sm font-bold">
						H
					</div>
					<h1 className="font-mono text-4xl font-bold tracking-tighter">
						HOOKS
					</h1>
				</div>
			</header>

			<section className="space-y-10">
				<div className="flex gap-4 items-start">
					<div className="w-1 h-8 bg-primary mt-1"></div>
					<p className="font-mono text-lg">
						GlyphUI includes a powerful hooks system for functional
						components. Hooks are functions that let you “hook into”
						GlyphUI features from your components, enabling state
						management and side effects without writing a class.
					</p>
				</div>

				{/* useState */}
				<div
					id="use-state"
					className="space-y-6 pl-5 border-l border-border"
				>
					<h2 className="font-mono text-2xl font-bold tracking-tighter flex items-center gap-3">
						<span className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs">
							1
						</span>
						useState
					</h2>
					<p className="font-mono text-sm text-muted-foreground">
						Manages state in functional components, returning a
						state value and a function to update it.
					</p>

					<div className="bg-muted border border-border">
						<div className="flex items-center justify-between bg-foreground text-background px-3 py-1">
							<span className="font-mono text-xs">
								Usage from <code>/examples/hooks-demo</code>
							</span>
							<div className="flex gap-2">
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
							</div>
						</div>
						<div className="bg-background p-4">
							<pre className="font-mono text-sm overflow-x-auto">
								<code className="text-primary">{`import { h, useState } from 'glyphui'

const CounterComponent = (props) => {
	const [count, setCount] = useState(0);

	return h("div", {}, [
		h("h2", {}, ["useState Demo"]),
		h("p", {}, [\`Current count: \${count}\`]),
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
};`}</code>
							</pre>
						</div>
					</div>

					<div className="bg-muted p-6 border border-border">
						<h3 className="font-mono text-sm font-bold mb-4">
							Parameters
						</h3>
						<ul className="list-none space-y-4 font-mono">
							<li className="flex items-start gap-3">
								<div className="w-2 h-2 bg-foreground mt-1.5"></div>
								<div>
									<code className="text-primary">
										initialState
									</code>
									<p className="text-xs mt-1 text-muted-foreground">
										The initial state value or a function
										that returns the initial state.
									</p>
								</div>
							</li>
						</ul>
					</div>

					<div className="bg-muted p-6 border border-border">
						<h3 className="font-mono text-sm font-bold mb-4">
							Returns
						</h3>
						<ul className="list-none space-y-4 font-mono">
							<li className="flex items-start gap-3">
								<div className="w-2 h-2 bg-foreground mt-1.5"></div>
								<div>
									<p className="text-xs">
										An array containing:
									</p>
									<ol className="list-decimal ml-5 mt-2 space-y-2">
										<li className="text-xs">
											<code className="text-primary">
												state
											</code>
											: The current state value
										</li>
										<li className="text-xs">
											<code className="text-primary">
												setState
											</code>
											: Function to update the state
										</li>
									</ol>
								</div>
							</li>
						</ul>
					</div>
				</div>

				{/* useEffect */}
				<div
					id="use-effect"
					className="space-y-6 pl-5 border-l border-border"
				>
					<h2 className="font-mono text-2xl font-bold tracking-tighter flex items-center gap-3">
						<span className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs">
							2
						</span>
						useEffect
					</h2>
					<p className="font-mono text-sm text-muted-foreground">
						Handles side effects in functional components, with
						support for cleanup functions and dependency arrays.
					</p>

					<div className="bg-muted border border-border">
						<div className="flex items-center justify-between bg-foreground text-background px-3 py-1">
							<span className="font-mono text-xs">
								Usage from <code>/examples/hooks-demo</code>
							</span>
							<div className="flex gap-2">
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
							</div>
						</div>
						<div className="bg-background p-4">
							<pre className="font-mono text-sm overflow-x-auto">
								<code className="text-primary">{`import { h, useState, useEffect, useMemo } from 'glyphui'

const TimerComponent = (props) => {
	const [time, setTime] = useState(0);
	const [isRunning, setIsRunning] = useState(false);

	useEffect(() => {
		let intervalId = null;

		if (isRunning) {
			intervalId = setInterval(() => {
				setTime((prevTime) => prevTime + 1);
			}, 1000);
		}

		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [isRunning]);

	const formattedTime = useMemo(() => {
		const minutes = Math.floor(time / 60)
			.toString()
			.padStart(2, "0");
		const seconds = (time % 60).toString().padStart(2, "0");
		return \`\${minutes}:\${seconds}\`;
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
};`}</code>
							</pre>
						</div>
					</div>

					<div className="bg-muted p-6 border border-border">
						<h3 className="font-mono text-sm font-bold mb-4">
							Parameters
						</h3>
						<ul className="list-none space-y-4 font-mono">
							<li className="flex items-start gap-3">
								<div className="w-2 h-2 bg-foreground mt-1.5"></div>
								<div>
									<code className="text-primary">effect</code>
									<p className="text-xs mt-1 text-muted-foreground">
										Function containing side effect code.
										Can optionally return a cleanup
										function.
									</p>
								</div>
							</li>
							<li className="flex items-start gap-3">
								<div className="w-2 h-2 bg-foreground mt-1.5"></div>
								<div>
									<code className="text-primary">deps</code>{" "}
									<span className="text-xs">(optional)</span>
									<p className="text-xs mt-1 text-muted-foreground">
										Dependency array that controls when the
										effect runs. If omitted, effect runs
										after every render.
									</p>
								</div>
							</li>
						</ul>
					</div>
				</div>

				{/* useRef */}
				<div
					id="use-ref"
					className="space-y-6 pl-5 border-l border-border"
				>
					<h2 className="font-mono text-2xl font-bold tracking-tighter flex items-center gap-3">
						<span className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs">
							3
						</span>
						useRef
					</h2>
					<p className="font-mono text-sm text-muted-foreground">
						Creates a mutable reference object that persists across
						renders.
					</p>

					<div className="bg-muted border border-border">
						<div className="flex items-center justify-between bg-foreground text-background px-3 py-1">
							<span className="font-mono text-xs">
								Usage from <code>/examples/hooks-demo</code>
							</span>
							<div className="flex gap-2">
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
							</div>
						</div>
						<div className="bg-background p-4">
							<pre className="font-mono text-sm overflow-x-auto">
								<code className="text-primary">{`import { h, useState, useEffect, useRef, useCallback } from 'glyphui'

const FormComponent = (props) => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [submitted, setSubmitted] = useState(false);

	const nameInputRef = useRef(null);

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
					h("p", {}, [\`Thank you, \${name}!\`]),
					h("p", {}, [\`We'll contact you at \${email}\`]),
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
};`}</code>
							</pre>
						</div>
					</div>
				</div>

				{/* useMemo */}
				<div
					id="use-memo"
					className="space-y-6 pl-5 border-l border-border"
				>
					<h2 className="font-mono text-2xl font-bold tracking-tighter flex items-center gap-3">
						<span className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs">
							4
						</span>
						useMemo
					</h2>
					<p className="font-mono text-sm text-muted-foreground">
						Memoizes a value, recalculating only when dependencies
						change.
					</p>

					<div className="bg-muted border border-border">
						<div className="flex items-center justify-between bg-foreground text-background px-3 py-1">
							<span className="font-mono text-xs">
								Usage from <code>/examples/hooks-demo</code>
							</span>
							<div className="flex gap-2">
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
							</div>
						</div>
						<div className="bg-background p-4">
							<pre className="font-mono text-sm overflow-x-auto">
								<code className="text-primary">{`import { h, useState, useMemo } from 'glyphui'

const MemoComponent = (props) => {
	const [number, setNumber] = useState(20);

	const fibonacci = useMemo(() => {
		if (number > 30) {
			let a = 1, b = 1;
			for (let i = 3; i <= number; i++) {
				const temp = a + b;
				a = b;
				b = temp;
			}
			return b;
		}

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
			h("span", {}, [\` n = \${number}\`]),
		]),
		h("p", {}, [\`Fibonacci(\${number}) = \${fibonacci}\`]),
	]);
};`}</code>
							</pre>
						</div>
					</div>
				</div>

				{/* useCallback */}
				<div
					id="use-callback"
					className="space-y-6 pl-5 border-l border-border"
				>
					<h2 className="font-mono text-2xl font-bold tracking-tighter flex items-center gap-3">
						<span className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs">
							5
						</span>
						useCallback
					</h2>
					<p className="font-mono text-sm text-muted-foreground">
						Memoizes a callback function, preventing unnecessary
						re-renders when passed to child components. The example
						below is from the `FormComponent`.
					</p>

					<div className="bg-muted border border-border">
						<div className="flex items-center justify-between bg-foreground text-background px-3 py-1">
							<span className="font-mono text-xs">
								Usage from <code>/examples/hooks-demo</code>
							</span>
							<div className="flex gap-2">
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
							</div>
						</div>
						<div className="bg-background p-4">
							<pre className="font-mono text-sm overflow-x-auto">
								<code className="text-primary">{`import { h, useState, useCallback } from 'glyphui'

// ...inside FormComponent
	const handleSubmit = useCallback((e) => {
		e.preventDefault();
		setSubmitted(true);
	}, []);

	return h("div", {}, [
		// ...
		h("form", { onsubmit: handleSubmit }, [
      // ... form inputs
    ])
  ]);
// ...`}</code>
							</pre>
						</div>
					</div>
				</div>
			</section>

			<div className="bg-muted p-6 border border-border mt-8">
				<div className="flex gap-3 items-start">
					<div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">
						!
					</div>
					<div>
						<h3 className="font-mono text-sm font-bold mb-2">
							IMPORTANT
						</h3>
						<p className="font-mono text-xs text-muted-foreground">
							Hooks can only be called inside a component's render
							function or inside another hook. Don't call hooks
							outside of components or in class components.
						</p>
					</div>
				</div>
			</div>

			<div className="flex justify-between items-center pt-8 mt-12 border-t border-border font-mono">
				<a
					href="/docs/components"
					className="inline-flex items-center hover:text-primary group"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="mr-2 transform group-hover:-translate-x-1 transition-transform"
					>
						<line x1="19" y1="12" x2="5" y2="12"></line>
						<polyline points="12 19 5 12 12 5"></polyline>
					</svg>
					PREVIOUS: COMPONENTS
				</a>
				<a
					href="/docs/state-management"
					className="inline-flex items-center bg-foreground text-background px-4 py-2 hover:bg-foreground/90 group"
				>
					NEXT: STATE MANAGEMENT
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="ml-2 transform group-hover:translate-x-1 transition-transform"
					>
						<line x1="5" y1="12" x2="19" y2="12"></line>
						<polyline points="12 5 19 12 12 19"></polyline>
					</svg>
				</a>
			</div>
		</article>
	);
}
