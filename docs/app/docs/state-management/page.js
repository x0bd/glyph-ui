export default function StateManagementPage() {
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
						S
					</div>
					<h1 className="font-mono text-4xl font-bold tracking-tighter">
						STATE MANAGEMENT
					</h1>
				</div>
			</header>

			<section className="space-y-10">
				<div className="flex gap-4 items-start">
					<div className="w-1 h-8 bg-primary mt-1"></div>
					<p className="font-mono text-lg">
						GlyphUI provides a simple yet powerful state management
						solution. It allows you to create stores with state and
						actions, and connect components to these stores.
					</p>
				</div>

				{/* createStore */}
				<div
					id="create-store"
					className="space-y-6 pl-5 border-l border-border"
				>
					<h2 className="font-mono text-2xl font-bold tracking-tighter flex items-center gap-3">
						<span className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs">
							1
						</span>
						createStore
					</h2>
					<p className="font-mono text-sm text-muted-foreground">
						Creates a store with state and actions. The factory
						function receives a `set` function to update the state.
					</p>

					<div className="bg-muted border border-border">
						<div className="flex items-center justify-between bg-foreground text-background px-3 py-1">
							<span className="font-mono text-xs">
								Usage from{" "}
								<code>/examples/state-management</code>
							</span>
							<div className="flex gap-2">
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
							</div>
						</div>
						<div className="bg-background p-4">
							<pre className="font-mono text-sm overflow-x-auto">
								<code className="text-primary">{`import { createStore } from 'glyphui'

// Counter Store
const counterStore = createStore((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  incrementBy: (amount) => set((state) => ({ count: state.count + amount }))
}));

// Todo Store
const todoStore = createStore((set) => ({
  todos: [],
  newTodoText: '',
  nextId: 1,
  setNewTodoText: (text) => set({ newTodoText: text }),
  addTodo: () => set((state) => {
    if (!state.newTodoText.trim()) return state;
    
    return {
      todos: [
        ...state.todos,
        {
          id: state.nextId,
          text: state.newTodoText,
          completed: false
        }
      ],
      newTodoText: '',
      nextId: state.nextId + 1
    };
  }),
  toggleTodo: (id) => set((state) => ({
    todos: state.todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  })),
  removeTodo: (id) => set((state) => ({
    todos: state.todos.filter(todo => todo.id !== id)
  })),
}));`}</code>
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
										An object containing the initial state
										and action functions.
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
										A store object with the following
										methods:
									</p>
									<ol className="list-decimal ml-5 mt-2 space-y-2">
										<li className="text-xs">
											<code className="text-primary">
												getState()
											</code>
											: Returns the current state
										</li>
										<li className="text-xs">
											<code className="text-primary">
												setState(newState)
											</code>
											: Updates the state
										</li>
										<li className="text-xs">
											<code className="text-primary">
												subscribe(listener)
											</code>
											: Subscribes to state changes
										</li>
										<li className="text-xs">
											<code className="text-primary">
												destroy()
											</code>
											: Destroys the store
										</li>
										<li className="text-xs">
											<code className="text-primary">
												actions
											</code>
											: All defined action functions
										</li>
									</ol>
								</div>
							</li>
						</ul>
					</div>
				</div>

				{/* connect */}
				<div
					id="connect"
					className="space-y-6 pl-5 border-l border-border"
				>
					<h2 className="font-mono text-2xl font-bold tracking-tighter flex items-center gap-3">
						<span className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs">
							2
						</span>
						connect
					</h2>
					<p className="font-mono text-sm text-muted-foreground">
						A higher-order component that connects a class component
						to a store. The component will receive the entire
						store's state and actions as a `store` prop.
					</p>

					<div className="bg-muted border border-border">
						<div className="flex items-center justify-between bg-foreground text-background px-3 py-1">
							<span className="font-mono text-xs">
								Usage from{" "}
								<code>/examples/state-management</code>
							</span>
							<div className="flex gap-2">
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
							</div>
						</div>
						<div className="bg-background p-4">
							<pre className="font-mono text-sm overflow-x-auto">
								<code className="text-primary">{`import { Component, h, connect } from 'glyphui'

// Counter Controls Component
class CounterControls extends Component {
  render(props) {
    const { store } = props;
    
    return h('div', { class: 'counter' }, [
      h('button', { 
        class: 'decrement',
        on: { click: () => store.decrement() }
      }, ['-']),
      h('div', { class: 'counter-value' }, [store.count.toString()]),
      h('button', { 
        on: { click: () => store.increment() }
      }, ['+']),
      h('button', { 
        class: 'reset',
        on: { click: () => store.reset() }
      }, ['Reset'])
    ]);
  }
}

// Connect CounterControls to counterStore
const ConnectedCounterControls = connect(counterStore)(CounterControls);`}</code>
							</pre>
						</div>
					</div>

					<div className="bg-muted p-6 border border-border">
						<h3 className="font-mono text-sm font-bold mb-4">
							Connecting with a Selector
						</h3>
						<p className="font-mono text-xs text-muted-foreground mb-2">
							Optionally, you can provide a selector function to
							`connect` to pass only specific parts of the store
							to the component.
						</p>
						<div className="bg-background p-4">
							<pre className="font-mono text-sm overflow-x-auto">
								<code className="text-primary">{`// ... in state-example.js
const ConnectedTodoInput = connect(todoStore, (state) => ({
  newTodoText: state.newTodoText,
  setNewTodoText: state.setNewTodoText,
  addTodo: state.addTodo
}))(TodoInput);`}</code>
							</pre>
						</div>
					</div>
				</div>

				{/* Using with Hooks */}
				<div
					id="with-hooks"
					className="space-y-6 pl-5 border-l border-border"
				>
					<h2 className="font-mono text-2xl font-bold tracking-tighter flex items-center gap-3">
						<span className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs">
							3
						</span>
						Using Stores with Hooks
					</h2>
					<p className="font-mono text-sm text-muted-foreground">
						You can easily integrate stores with functional
						components and hooks by subscribing to store changes.
					</p>

					<div className="bg-muted border border-border">
						<div className="flex items-center justify-between bg-foreground text-background px-3 py-1">
							<span className="font-mono text-xs">
								Usage Pattern
							</span>
							<div className="flex gap-2">
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
							</div>
						</div>
						<div className="bg-background p-4">
							<pre className="font-mono text-sm overflow-x-auto">
								<code className="text-primary">{`import { h, useState, useEffect } from 'glyphui'
import { counterStore } from './stores' // Assuming stores are defined elsewhere

function CounterWithHooks() {
  const [count, setCount] = useState(counterStore.getState().count);
  
  useEffect(() => {
    // The subscribe method returns an unsubscribe function
    const unsubscribe = counterStore.subscribe(
      (newState) => setCount(newState.count)
    );
    
    // Cleanup subscription on component unmount
    return unsubscribe;
  }, []); // Empty array ensures this runs only once
  
  return h('div', {}, [
    h('p', {}, \`Count: \${count}\`),
    h('button', { on: { click: counterStore.getState().increment } }, 'Increment'),
    h('button', { on: { click: counterStore.getState().decrement } }, 'Decrement')
  ]);
}`}</code>
							</pre>
						</div>
					</div>
				</div>

				{/* Advanced Usage */}
				<div
					id="advanced"
					className="space-y-6 pl-5 border-l border-border"
				>
					<h2 className="font-mono text-2xl font-bold tracking-tighter flex items-center gap-3">
						<span className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs">
							4
						</span>
						Advanced Usage
					</h2>
					<p className="font-mono text-sm text-muted-foreground">
						Advanced techniques for working with GlyphUI state
						management.
					</p>

					<div className="bg-muted border border-border">
						<div className="flex items-center justify-between bg-foreground text-background px-3 py-1">
							<span className="font-mono text-xs">
								Creating Actions with API Calls
							</span>
							<div className="flex gap-2">
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
								<div className="w-2 h-2 rounded-full bg-background/20"></div>
							</div>
						</div>
						<div className="bg-background p-4">
							<pre className="font-mono text-sm overflow-x-auto">
								<code className="text-primary">{`import { createStore } from 'glyphui/state'

// Create a store for todos
const useTodosStore = createStore({
  todos: [],
  loading: false,
  error: null,
  
  // Set loading state
  setLoading: (state, isLoading) => ({ loading: isLoading }),
  
  // Set error state
  setError: (state, error) => ({ error }),
  
  // Set todos
  setTodos: (state, todos) => ({ todos }),
  
  // Fetch todos from API
  fetchTodos: async (state) => {
    // Get the setState function
    const { setState } = useTodosStore
    
    // Set loading state
    setState({ loading: true, error: null })
    
    try {
      const response = await fetch('https://api.example.com/todos')
      const todos = await response.json()
      
      // Update state with fetched todos
      setState({ todos, loading: false })
    } catch (error) {
      // Handle error
      setState({ error: error.message, loading: false })
    }
  },
  
  // Add a new todo
  addTodo: async (state, todoText) => {
    const { setState } = useTodosStore
    setState({ loading: true, error: null })
    
    try {
      const response = await fetch('https://api.example.com/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: todoText, completed: false })
      })
      
      const newTodo = await response.json()
      
      // Update state with new todo
      setState({ 
        todos: [...state.todos, newTodo],
        loading: false 
      })
    } catch (error) {
      setState({ error: error.message, loading: false })
    }
  }
})`}</code>
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
							BEST PRACTICES
						</h3>
						<p className="font-mono text-xs text-muted-foreground">
							1. Keep your state normalized and avoid deep
							nesting.
							<br />
							2. Use multiple small stores instead of one large
							store for better organization.
							<br />
							3. Always unsubscribe from store subscriptions when
							components unmount.
							<br />
							4. Use the connect function for class components and
							direct subscriptions for functional components.
						</p>
					</div>
				</div>
			</div>

			<div className="flex justify-between items-center pt-8 mt-12 border-t border-border font-mono">
				<a
					href="/docs/hooks"
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
					PREVIOUS: HOOKS
				</a>
				<a
					href="/docs/virtual-dom"
					className="inline-flex items-center bg-foreground text-background px-4 py-2 hover:bg-foreground/90 group"
				>
					NEXT: VIRTUAL DOM
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
