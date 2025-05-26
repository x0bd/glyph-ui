import { destroyDOM } from "./destroy-dom.js";
import { Dispatcher } from "./dispatcher.js";
import { mountDOM } from "./mount-dom.js";
import { patchDOM } from "./patch-dom.js";
import { COMPONENT_TYPE } from "./component-factory.js";

/**
 * Creates an application with the given top-level view, initial state and reducers.
 * A reducer is a function that takes the current state and a payload and returns
 * the new state.
 *
 * @param {object} config the configuration object, containing the view, reducers and initial state
 * @returns {object} the app object
 */
export function createApp(config = {}) {
	// Extract configuration or use defaults
	const { state = {}, view = null, reducers = {} } = config || {};

	let parentEl = null;
	let vdom = null;

	const dispatcher = new Dispatcher();
	const subscriptions = [dispatcher.afterEveryCommand(renderApp)];

	function emit(eventName, payload) {
		dispatcher.dispatch(eventName, payload);
	}

	// Attach reducers
	// Reducer = f(state, payload) => state
	for (const actionName in reducers) {
		const reducer = reducers[actionName];

		const subs = dispatcher.subscribe(actionName, (payload) => {
			state = reducer(state, payload);
		});
		subscriptions.push(subs);
	}

	/**
	 * Renders the application, by first destroying the previous DOM —if any— and
	 * then mounting the new view.
	 *
	 * In the next version, a _reconciliation algorithm_ will be used to update the
	 * DOM instead of destroying and mounting the whole view.
	 */
	function renderApp() {
		if (!view || !parentEl) return;

		const newVdom = view(state, emit);
		vdom = patchDOM(vdom, newVdom, parentEl);
	}

	return {
		/**
		 * Mounts the application to the given host element or mounts a component.
		 *
		 * @param {Element|Object} vdomOrEl - Either a virtual DOM node or the parent element
		 * @param {Element} [_parentEl] - The parent element when vdomOrEl is a vdom
		 * @returns {object} the application object
		 */
		mount(vdomOrEl, _parentEl) {
			// Case 1: Called with a DOM element only (legacy mode)
			if (vdomOrEl instanceof HTMLElement && !_parentEl) {
				parentEl = vdomOrEl;

				if (view) {
					vdom = view(state, emit);
					mountDOM(vdom, parentEl);
				}

				return this;
			}

			// Case 2: Called with both vdom and parent element
			if (_parentEl instanceof HTMLElement) {
				vdom = vdomOrEl;
				parentEl = _parentEl;

				try {
					mountDOM(vdom, parentEl);
				} catch (error) {
					console.error("Error mounting component:", error);

					// Create a fallback error display
					parentEl.innerHTML = `
						<div style="color: red; border: 1px solid red; padding: 10px;">
							<h3>Error Mounting Component</h3>
							<p>${error.message}</p>
						</div>
					`;

					throw error;
				}

				return this;
			}

			// Invalid arguments
			console.error("Invalid arguments to mount():", {
				vdomOrEl,
				_parentEl,
			});
			throw new Error(
				"Invalid arguments to mount(): Expected a parent element"
			);
		},

		/**
		 * Unmounts the application from the host element by destroying the associated
		 * DOM and unsubscribing all subscriptions.
		 */
		unmount() {
			if (vdom) {
				destroyDOM(vdom);
				vdom = null;
			}

			subscriptions.forEach((unsubscribe) => unsubscribe());
		},

		/**
		 * Emits an event to the application.
		 *
		 * @param {string} eventName the name of the event to emit
		 * @param {any} payload the payload to pass to the event listeners
		 */
		emit(eventName, payload) {
			emit(eventName, payload);
		},
	};
}
