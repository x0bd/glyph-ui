/**
 * Adds event listeners to an event target and returns an object containing
 * the added listeners.
 *
 * @param {object} listeners The event listeners to add
 * @param {EventTarget} el The element to add the listeners to
 * @returns {object} The added listeners
 */
export function addEventListeners(listeners = {}, el) {
	const addedListeners = {};

	Object.entries(listeners).forEach(([eventName, handler]) => {
		const listener = addEventListener(eventName, handler, el);
		addedListeners[eventName] = listener;
	});

	return addedListeners;
}

/**
 * Adds an event listener to an event target and returns the listener.
 *
 * @param {string} eventName the name of the event to listen to
 * @param {(event: Event) => void} handler the event handler
 * @param {EventTarget} el the element to add the event listener to
 * @returns {(event: Event) => void} the event handler
 */
export function addEventListener(eventName, handler, el) {
	el.addEventListener(eventName, handler);
	return handler;
}

/**
 * Removes the event listeners from an event target.
 *
 * @param {object} listeners the event listeners to remove
 * @param {EventTarget} el the element to remove the event listeners from
 */
export function removeEventListeners(listeners = {}, el) {
	Object.entries(listeners).forEach(([eventName, handler]) => {
		el.removeEventListener(eventName, handler);
	});
}

/**
 * Updates the event listeners on an element by removing old ones and adding new ones.
 * 
 * @param {HTMLElement} el - Element to update listeners on
 * @param {Object} oldVdom - Old virtual DOM node with listeners
 * @param {Object} newVdom - New virtual DOM node with listeners
 */
export function updateEventListeners(el, oldVdom, newVdom) {
	const oldListeners = oldVdom.listeners || {};
	const oldProps = oldVdom.props || {};
	const newProps = newVdom.props || {};
	
	// No event listeners in either old or new vdom
	if (!oldProps.on && !newProps.on) {
		return;
	}
	
	// Remove old listeners
	if (oldProps.on) {
		removeEventListeners(oldListeners, el);
	}
	
	// Add new listeners
	if (newProps.on) {
		newVdom.listeners = addEventListeners(newProps.on, el);
	} else {
		newVdom.listeners = {};
	}
}
