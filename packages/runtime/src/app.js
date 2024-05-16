import { destroyDOM } from "./destroy-dom";
import { Dispatcher } from "./dispatcher";
import { mountDOM } from "./mount-dom";

/**
 * @typedef Application
 * @type {object}
 *
 * @property {(parentEl: HTMLElement) => void} mount - Mounts the application into the DOM.
 * @property {function} unmount - Unmounts the application from the DOM.
 */

/**
 * Creates an application with the given root component (the top-level component in the view tree).
 * When the application is mounted, the root component is instantiated with the given props
 * and mounted into the DOM.
 *
 * @param {import('./component').Component} RootComponent the top-level component of the application's view tree
 * @param {Object.<string, Any>} props the top-level component's props
 *
 * @returns {Application} the app object
 */

export function createApp({ state, view, reducers }) {
	let parentEl = null;
	let vdom = null;

	const dispatcher = new Dispatcher();
	const subscriptions = [dispatcher.afterEveryCommand(renderApp)];

	function emit(eventName, payload) {
		dispatcher.dispatch(eventName, payload);
	}

	for (const actionName in reducers) {
		const reducer = reducers[actionName];

		const subs = dispatcher.subscribe(actionName, (payload) => {
			state = reducer(state, payload);
		});
		subscriptions.push(subs);
	}

	function renderApp() {
		if (vdom) {
			destroyDOM(vdom);
		}

		vdom = view(state, emit);
		mountDOM(vdom, parentEl);
	}

	return {
		mount(_parentEl) {
			parentEl = _parentEl;
			renderApp();
		},

		umount() {
			destroyDOM(vdom);
			vdom = null;
			subscriptions.forEach((unsubscribe) => unsubscribe());
		},
	};
}
