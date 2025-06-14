/**
 * GlyphUI Hooks System
 *
 * This file implements a React-inspired hooks system for functional components,
 * allowing for state management and side effects without using class components.
 */

// Global state to track the current component and hooks
let currentComponent = null;
let currentHookIndex = 0;
let isHooksProcessing = false;

// Store for component hooks data
const componentHooksStore = new WeakMap();

/**
 * Initialize hooks for a component instance
 * @param {Object} componentInstance - The component instance
 */
export function initHooks(componentInstance) {
	if (!componentInstance) {
		console.error(
			"Cannot initialize hooks: No component instance provided"
		);
		return;
	}

	if (!componentHooksStore.has(componentInstance)) {
		componentHooksStore.set(componentInstance, {
			hooks: [],
			cleanupFunctions: [],
		});
	}

	// Reset hook index when beginning to process a component
	currentHookIndex = 0;
	currentComponent = componentInstance;
	isHooksProcessing = true;
}

/**
 * Finish hooks processing for the current component
 */
export function finishHooks() {
	isHooksProcessing = false;
	// currentComponent and currentHookIndex are reset by the next initHooks call
}

/**
 * Run cleanup functions for a component instance
 * @param {Object} componentInstance - The component instance
 */
export function runCleanupFunctions(componentInstance) {
	if (!componentInstance) {
		console.error("Cannot run cleanup: No component instance provided");
		return;
	}

	const hooksData = componentHooksStore.get(componentInstance);

	if (hooksData) {
		// Run all cleanup functions
		hooksData.cleanupFunctions.forEach((cleanup, index) => {
			if (typeof cleanup === "function") {
				try {
					cleanup();
				} catch (error) {
					console.error(
						`Error in useEffect cleanup for hook ${index}:`,
						error
					);
				}
			}
		});

		// Reset cleanup functions
		hooksData.cleanupFunctions = [];
	}
}

/**
 * Check if hooks can be used in the current context
 */
function checkHooksContext() {
	if (!isHooksProcessing || !currentComponent) {
		throw new Error(
			"Hooks can only be called inside a component's render function or inside another hook. " +
				"Don't call hooks outside of components or in class components."
		);
	}
	return currentComponent; // Return the current component for context
}

/**
 * useState hook for managing state in functional components
 * @param {any} initialState - The initial state value
 * @returns {Array} - [state, setState] tuple
 */
export function useState(initialState) {
	const component = checkHooksContext(); // Get the component instance for this hook

	const hooksData = componentHooksStore.get(component);
	if (!hooksData) {
		throw new Error(
			"Component hooks data not found. This is likely a bug in GlyphUI."
		);
	}

	const hookIndex = currentHookIndex++;

	// Initialize state if this is the first render
	if (hookIndex >= hooksData.hooks.length) {
		const initialValue =
			typeof initialState === "function" ? initialState() : initialState;

		hooksData.hooks[hookIndex] = {
			type: "state",
			value: initialValue,
		};
	}

	const hook = hooksData.hooks[hookIndex];

	// Create setState function for this specific hook
	const setState = (newState) => {
		// Use the captured component instance from checkHooksContext
		if (!component || component.isMounted === false) {
			console.warn(
				"Cannot update state: Component is not mounted or instance is lost"
			);
			return;
		}

		const nextState =
			typeof newState === "function" ? newState(hook.value) : newState;

		// Only update and re-render if the value actually changed
		if (hook.value !== nextState) {
			hook.value = nextState;

			// Trigger re-render for the correct component instance
			if (component._renderComponent) {
				try {
					component._renderComponent();
				} catch (error) {
					console.error(
						"Error re-rendering component after state update:",
						error
					);
				}
			}
		}
	};

	return [hook.value, setState];
}

/**
 * useEffect hook for handling side effects in functional components
 * @param {Function} effect - Function containing side effect code
 * @param {Array} deps - Dependency array to control when effect runs
 */
export function useEffect(effect, deps) {
	const component = checkHooksContext(); // Get the component instance for this hook

	if (typeof effect !== "function") {
		console.error("useEffect requires a function as its first argument");
		return;
	}

	const hooksData = componentHooksStore.get(component);
	if (!hooksData) {
		throw new Error(
			"Component hooks data not found. This is likely a bug in GlyphUI."
		);
	}

	const hookIndex = currentHookIndex++;

	// Initialize hook if this is the first render
	if (hookIndex >= hooksData.hooks.length) {
		hooksData.hooks[hookIndex] = {
			type: "effect",
			deps: deps || null,
			cleanup: null, // This will be populated after effect runs
		};

		// Schedule effect to run after render
		setTimeout(() => {
			// Use the captured component instance
			if (component.isMounted !== false) {
				try {
					const cleanup = effect();

					if (cleanup && typeof cleanup === "function") {
						// Store cleanup for the correct component instance and hook
						const currentHooksData =
							componentHooksStore.get(component);
						if (currentHooksData) {
							currentHooksData.cleanupFunctions[hookIndex] =
								cleanup;
						}
					}
				} catch (error) {
					console.error(
						`Error running effect for hook ${hookIndex}:`,
						error
					);
				}
			}
		}, 0);

		return;
	}

	const hook = hooksData.hooks[hookIndex];
	const oldDeps = hook.deps;

	// Update deps for future comparisons
	hook.deps = deps || null;

	// Skip effect if deps haven't changed
	if (deps && oldDeps) {
		const depsChanged =
			deps.length !== oldDeps.length ||
			deps.some((dep, i) => dep !== oldDeps[i]);

		if (!depsChanged) {
			return;
		}
	}

	// Run cleanup from previous effect if exists for this specific hook index
	const cleanupToRun = hooksData.cleanupFunctions[hookIndex];
	if (typeof cleanupToRun === "function") {
		try {
			cleanupToRun();
			hooksData.cleanupFunctions[hookIndex] = null; // Clear after running
		} catch (error) {
			console.error(
				`Error in useEffect cleanup for hook ${hookIndex}:`,
				error
			);
		}
	}

	// Schedule effect to run after render
	setTimeout(() => {
		// Use the captured component instance
		if (component.isMounted !== false) {
			try {
				const cleanup = effect();

				// Store cleanup for the correct component instance and hook
				const currentHooksData = componentHooksStore.get(component);
				if (currentHooksData) {
					if (cleanup && typeof cleanup === "function") {
						currentHooksData.cleanupFunctions[hookIndex] = cleanup;
					} else {
						currentHooksData.cleanupFunctions[hookIndex] = null;
					}
				}
			} catch (error) {
				console.error(
					`Error running effect for hook ${hookIndex}:`,
					error
				);
			}
		}
	}, 0);
}

/**
 * useRef hook for persistent mutable values
 * @param {any} initialValue - The initial ref value
 * @returns {Object} - An object with a current property
 */
export function useRef(initialValue) {
	const component = checkHooksContext(); // Get the component instance for this hook

	const hooksData = componentHooksStore.get(component);
	if (!hooksData) {
		throw new Error(
			"Component hooks data not found. This is likely a bug in GlyphUI."
		);
	}

	const hookIndex = currentHookIndex++;

	// Initialize hook if this is the first render
	if (hookIndex >= hooksData.hooks.length) {
		hooksData.hooks[hookIndex] = {
			type: "ref",
			value: { current: initialValue },
		};
	}

	return hooksData.hooks[hookIndex].value;
}

/**
 * useMemo hook for memoizing expensive calculations
 * @param {Function} factory - Function that creates the memoized value
 * @param {Array} deps - Dependency array to control when to recalculate
 * @returns {any} - The memoized value
 */
export function useMemo(factory, deps) {
	const component = checkHooksContext(); // Get the component instance for this hook

	if (typeof factory !== "function") {
		console.error("useMemo requires a function as its first argument");
		return undefined;
	}

	const hooksData = componentHooksStore.get(component);
	if (!hooksData) {
		throw new Error(
			"Component hooks data not found. This is likely a bug in GlyphUI."
		);
	}

	const hookIndex = currentHookIndex++;

	// Initialize hook if this is the first render
	if (hookIndex >= hooksData.hooks.length) {
		let value;
		try {
			value = factory();
		} catch (error) {
			console.error(
				`Error calculating initial memoized value for hook ${hookIndex}:`,
				error
			);
			value = undefined;
		}

		hooksData.hooks[hookIndex] = {
			type: "memo",
			value,
			deps: deps || null,
		};
		return value;
	}

	const hook = hooksData.hooks[hookIndex];
	const oldDeps = hook.deps;

	// Update deps for future comparisons
	hook.deps = deps || null;

	// Recalculate only if deps have changed or deps is null
	if (
		!deps ||
		!oldDeps ||
		deps.length !== oldDeps.length ||
		deps.some((dep, i) => dep !== oldDeps[i])
	) {
		try {
			hook.value = factory();
		} catch (error) {
			console.error(
				`Error recalculating memoized value for hook ${hookIndex}:`,
				error
			);
			// Optionally, retain the old value or set to undefined
			// hook.value = undefined;
		}
	}

	return hook.value;
}

/**
 * useCallback hook for memoizing callbacks
 * @param {Function} callback - The callback function to memoize
 * @param {Array} deps - Dependency array to control when to update the callback
 * @returns {Function} - The memoized callback
 */
export function useCallback(callback, deps) {
	if (typeof callback !== "function") {
		console.error("useCallback requires a function as its first argument");
		return () => {};
	}

	return useMemo(() => callback, deps);
}
