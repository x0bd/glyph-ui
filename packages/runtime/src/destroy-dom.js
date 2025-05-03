import { COMPONENT_TYPE } from "./component-factory.js";
import { removeEventListeners } from "./events.js";
import { DOM_TYPES } from "./h.js";
import { assert } from "./utils/assert";

/**
 * Removes event listeners, removes elements from the DOM, and cleans up references.
 *
 * @param {object} vdom the vdom element to destroy
 */
export function destroyDOM(vdom) {
	if (!vdom) return;

	switch (vdom.type) {
		case DOM_TYPES.TEXT: {
			removeTextNode(vdom);
			break;
		}

		case DOM_TYPES.ELEMENT: {
			removeElementNode(vdom);
			break;
		}

		case DOM_TYPES.FRAGMENT: {
			removeFragmentNodes(vdom);
			break;
		}
		
		case COMPONENT_TYPE: {
			removeComponentNode(vdom);
			break;
		}

		default: {
			throw new Error(`Cannot destroy DOM of type: ${vdom.type}`);
		}
	}
}

/**
 * Removes the text node from the DOM and cleans up the vdom.
 *
 * @param {object} vdom vdom text node
 */
function removeTextNode(vdom) {
	const { el } = vdom;
	el.remove();
	vdom.el = null; // Clean up reference to the DOM node
}

/**
 * Removes the element node from the DOM, removes event listeners, and cleans up the vdom.
 *
 * @param {object} vdom vdom element node
 */
function removeElementNode(vdom) {
	const { el, listeners, children } = vdom;

	// Remove all event listeners
	if (listeners) {
		removeEventListeners(listeners, el);
		vdom.listeners = null;
	}

	// Destroy all children recursively
	if (children) {
		children.forEach(destroyDOM);
		vdom.children = null;
	}

	// Remove element from DOM
	el.remove();
	vdom.el = null;
}

/**
 * Removes the fragment nodes vdom recursively.
 *
 * @param {object} vdom vdom fragment node
 */
function removeFragmentNodes(vdom) {
	const { children } = vdom;

	if (children) {
		// Destroy all children recursively
		children.forEach(destroyDOM);
		vdom.children = null;
	}
}

/**
 * Unmounts a component node and cleans up references.
 * 
 * @param {object} vdom the component vdom node to remove
 */
function removeComponentNode(vdom) {
	const { instance } = vdom;
	
	// Call the component's unmount method
	if (instance && typeof instance.unmount === 'function') {
		instance.unmount();
	}
	
	// Clean up references
	vdom.instance = null;
	vdom.el = null;
}
