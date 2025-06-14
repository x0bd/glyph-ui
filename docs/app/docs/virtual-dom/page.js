export default function VirtualDOMPage() {
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
						V
					</div>
					<h1 className="font-mono text-4xl font-bold tracking-tighter">
						VIRTUAL DOM
					</h1>
				</div>
			</header>

			<section className="space-y-10">
				<div className="flex gap-4 items-start">
					<div className="w-1 h-8 bg-primary mt-1"></div>
					<p className="font-mono text-lg">
						At the core of GlyphUI is a Virtual DOM (VDOM)
						implementation that enables efficient rendering and
						updating of the user interface. Instead of manipulating
						the real DOM directly, GlyphUI builds a lightweight tree
						of JavaScript objects that describes the UI.
					</p>
				</div>

				{/* h() */}
				<div
					id="h-function"
					className="space-y-6 pl-5 border-l border-border"
				>
					<h2 className="font-mono text-2xl font-bold tracking-tighter flex items-center gap-3">
						<span className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs">
							1
						</span>
						The `h()` Function
					</h2>
					<p className="font-mono text-sm text-muted-foreground">
						The <code>h</code> (hyperscript) function is the primary
						way to create virtual DOM nodes. It can create elements,
						components, and text nodes.
					</p>

					<div className="bg-muted border border-border">
						<div className="flex items-center justify-between bg-foreground text-background px-3 py-1">
							<span className="font-mono text-xs">Usage</span>
						</div>
						<div className="bg-background p-4">
							<pre className="font-mono text-sm overflow-x-auto">
								<code className="text-primary">{`import { h, Component } from 'glyphui'

// 1. Create a simple element
const MyButton = h('button', {
  class: 'btn',
  on: { click: () => alert('Hello!') }
}, ['Click Me']);

// 2. Create an element with children
const List = h('ul', {}, [
  h('li', {}, ['Item 1']),
  h('li', {}, ['Item 2'])
]);

// 3. Render a component
class MyComponent extends Component {
  render() {
    return h('h1', {}, [\`Hello, \${this.props.name}\`]);
  }
}
const componentNode = h(MyComponent, { name: 'World' });

// 4. Using text nodes (strings are automatically converted)
const Greeting = h('p', {}, ['Welcome to the documentation.']);`}</code>
							</pre>
						</div>
					</div>
				</div>

				{/* hFragment() */}
				<div
					id="fragment"
					className="space-y-6 pl-5 border-l border-border"
				>
					<h2 className="font-mono text-2xl font-bold tracking-tighter flex items-center gap-3">
						<span className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs">
							2
						</span>
						`hFragment()`
					</h2>
					<p className="font-mono text-sm text-muted-foreground">
						Fragments let you group a list of children without
						adding extra nodes to the DOM.
					</p>

					<div className="bg-muted border border-border">
						<div className="flex items-center justify-between bg-foreground text-background px-3 py-1">
							<span className="font-mono text-xs">
								Usage from{" "}
								<code>/examples/state-management</code>
							</span>
						</div>
						<div className="bg-background p-4">
							<pre className="font-mono text-sm overflow-x-auto">
								<code className="text-primary">{`import { h, hFragment } from 'glyphui'

function ThemeContainer(props) {
  return hFragment([
    h('h2', {}, ['Theme Selection']),
    createComponent(ConnectedThemeSelector, {}),
    createComponent(ConnectedThemeConsumer, {})
  ]);
}`}</code>
							</pre>
						</div>
					</div>
				</div>

				{/* Reconciliation */}
				<div
					id="reconciliation"
					className="space-y-6 pl-5 border-l border-border"
				>
					<h2 className="font-mono text-2xl font-bold tracking-tighter flex items-center gap-3">
						<span className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs">
							3
						</span>
						Reconciliation and Patching
					</h2>
					<p className="font-mono text-sm text-muted-foreground">
						When the application state changes, GlyphUI creates a
						new VDOM tree. It then compares this new tree with the
						previous one and efficiently updates the real DOM with
						only the necessary changes. This process is called
						reconciliation.
					</p>
					<div className="bg-muted p-6 border border-border">
						<h3 className="font-mono text-sm font-bold mb-4">
							The Patching Process
						</h3>
						<ul className="list-none space-y-4 font-mono text-xs text-muted-foreground">
							<li className="flex items-start gap-3">
								<div className="w-2 h-2 bg-foreground mt-1.5"></div>
								<div>
									<p>
										<strong>Different Node Types:</strong>{" "}
										If a node has changed its type (e.g., a
										`div` becomes a `span`), the old node is
										replaced with the new one.
									</p>
								</div>
							</li>
							<li className="flex items-start gap-3">
								<div className="w-2 h-2 bg-foreground mt-1.5"></div>
								<div>
									<p>
										<strong>Attribute Updates:</strong>{" "}
										GlyphUI compares the attributes of the
										old and new nodes and only updates the
										ones that have changed.
									</p>
								</div>
							</li>
							<li className="flex items-start gap-3">
								<div className="w-2 h-2 bg-foreground mt-1.5"></div>
								<div>
									<p>
										<strong>Keyed Lists:</strong> When
										rendering lists of items, the `key`
										attribute is crucial. It helps the
										diffing algorithm to identify which
										items have changed, been added, or been
										removed, avoiding unnecessary
										re-renders.
									</p>
								</div>
							</li>
						</ul>
					</div>
					<div className="bg-muted border border-border">
						<div className="flex items-center justify-between bg-foreground text-background px-3 py-1">
							<span className="font-mono text-xs">
								Keyed List Example from{" "}
								<code>/examples/state-management</code>
							</span>
						</div>
						<div className="bg-background p-4">
							<pre className="font-mono text-sm overflow-x-auto">
								<code className="text-primary">{`// From the TodoList component
todos.forEach(todo => {
  contentElements.push(
    h('div', {
      key: todo.id, // The key helps identify each item
      class: \`todo-item \${todo.completed ? 'completed' : ''}\`,
      id: \`todo-\${todo.id}\`
    }, [
      h('span', {
        on: { click: () => store.toggleTodo(todo.id) }
      }, [todo.text]),
      // ... action buttons
    ])
  );
});`}</code>
							</pre>
						</div>
					</div>
				</div>
			</section>

			<div className="flex justify-between items-center pt-8 mt-12 border-t border-border font-mono">
				<a
					href="/docs/state-management"
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
					PREVIOUS: STATE MANAGEMENT
				</a>
				<a
					href="/docs/components"
					className="inline-flex items-center bg-foreground text-background px-4 py-2 hover:bg-foreground/90 group"
				>
					NEXT: COMPONENTS
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
