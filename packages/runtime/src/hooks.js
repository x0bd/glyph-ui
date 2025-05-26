/**
 * GlyphUI Hooks System
 *
 * This file implements a React-inspired hooks system for functional components,
 * allowing for state management and side effects without using class components.
 */

// Global state to track the current component and hooks
let currentComponent = null;
let currentHookIndex = 0;

// Store for component hooks data
const componentHooksStore = new WeakMap();

/**
 * Initialize hooks for a component instance
 * @param {Object} componentInstance - The component instance
 */
export function initHooks(componentInstance) {
	if (!componentHooksStore.has(componentInstance)) {
		componentHooksStore.set(componentInstance, {
			hooks: [],
			cleanupFunctions: [],
		});
	}

	// Reset hook index when beginning to process a component
	currentHookIndex = 0;
	currentComponent = componentInstance;
}

/**
 * Finish hooks processing for the current component
 */
export function finishHooks() {
	currentComponent = null;
	currentHookIndex = 0;
}

/**
 * Run cleanup functions for a component instance
 * @param {Object} componentInstance - The component instance
 */
export function runCleanupFunctions(componentInstance) {
	const hooksData = componentHooksStore.get(componentInstance);

	if (hooksData) {
		// Run all cleanup functions
		hooksData.cleanupFunctions.forEach((cleanup) => {
			if (typeof cleanup === "function") {
				try {
					cleanup();
				} catch (error) {
					console.error("Error in useEffect cleanup:", error);
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
	if (!currentComponent) {
		throw new Error(
			"Hooks can only be called inside a component's render function or inside another hook. " +
				"Don't call hooks outside of components or in class components."
		);
	}
}

/**
 * useState hook for managing state in functional components
 * @param {any} initialState - The initial state value
 * @returns {Array} - [state, setState] tuple
 */
export function useState(initialState) {
	checkHooksContext();

	const hooksData = componentHooksStore.get(currentComponent);
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
		const nextState =
			typeof newState === "function" ? newState(hook.value) : newState;

		// Only update and re-render if the value actually changed
		if (hook.value !== nextState) {
			hook.value = nextState;

			// Trigger re-render
			if (currentComponent._renderComponent) {
				currentComponent._renderComponent();
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
	checkHooksContext();

	const hooksData = componentHooksStore.get(currentComponent);
	const hookIndex = currentHookIndex++;

	// Initialize hook if this is the first render
	if (hookIndex >= hooksData.hooks.length) {
		hooksData.hooks[hookIndex] = {
			type: "effect",
			deps: deps || null,
			cleanup: null,
		};

		// Schedule effect to run after render
		setTimeout(() => {
			if (currentComponent.isMounted !== false) {
				const cleanup = effect();

				if (cleanup && typeof cleanup === "function") {
					hooksData.cleanupFunctions[hookIndex] = cleanup;
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
		// Check if dependencies are the same
		const depsChanged =
			deps.length !== oldDeps.length ||
			deps.some((dep, i) => dep !== oldDeps[i]);

		if (!depsChanged) {
			return;
		}
	}

	// Run cleanup from previous effect if exists
	if (hooksData.cleanupFunctions[hookIndex]) {
		try {
			hooksData.cleanupFunctions[hookIndex]();
		} catch (error) {
			console.error("Error in useEffect cleanup:", error);
		}
	}

	// Schedule effect to run after render
	setTimeout(() => {
		if (currentComponent.isMounted !== false) {
			const cleanup = effect();

			if (cleanup && typeof cleanup === "function") {
				hooksData.cleanupFunctions[hookIndex] = cleanup;
			} else {
				hooksData.cleanupFunctions[hookIndex] = null;
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
	checkHooksContext();

	const hooksData = componentHooksStore.get(currentComponent);
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
	checkHooksContext();

	const hooksData = componentHooksStore.get(currentComponent);
	const hookIndex = currentHookIndex++;

	// Initialize hook if this is the first render
	if (hookIndex >= hooksData.hooks.length) {
		const value = factory();
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
		hook.value = factory();
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
	return useMemo(() => callback, deps);
}
