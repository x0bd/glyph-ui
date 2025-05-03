// TODOCS

import { setAttributes } from "./attributes";
import { COMPONENT_TYPE, processComponent } from "./component-factory";
import { addEventListeners } from "./events";
import { DOM_TYPES } from "./h";

/**
 * Creates the DOM nodes for a virtual DOM tree, mounts them in the DOM, and
 * modifies the vdom tree to include the corresponding DOM nodes and event listeners.
 *
 * @param {object} oldVDom the virtual DOM node to mount
 * @param {HTMLElement} parentEl the host element to mount the virtual DOM node to
 */
export function mountDOM(vdom, parentEl, index) {
	// Skip null or undefined vdom nodes
	if (!vdom) return null;
	
	// Ensure vdom has a type
	if (vdom.type === undefined) {
		console.warn('Invalid vdom node:', vdom);
		return null;
	}
	
	switch (vdom.type) {
		case DOM_TYPES.TEXT: {
			createTextNode(vdom, parentEl, index);
			break;
		}

		case DOM_TYPES.ELEMENT: {
			createElementNode(vdom, parentEl, index);
			break;
		}

		case DOM_TYPES.FRAGMENT: {
			createFragmentNodes(vdom, parentEl, index);
			break;
		}

		case COMPONENT_TYPE: {
			processComponent(vdom, parentEl, index);
			break;
		}

		default: {
			throw new Error(`Can't mount DOM of type: ${vdom.type}`);
		}
	}
}

/**
 * Creates the text node for a virtual DOM text node.
 * The created `Text` is added to the `el` property of the vdom.
 *
 * Note that `Text` is a subclass of `CharacterData`, which is a subclass of `Node`,
 * but not of `Element`. Methods like `append()`, `prepend()`, `before()`, `after()`,
 * or `remove()` are not available on `Text` nodes.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Text}
 *
 * @param {object} vdom the virtual DOM node of type "text"
 * @param {Element} parentEl the host element to mount the virtual DOM node to
 */
function createTextNode(vdom, parentEl, index) {
	const { value } = vdom;

	const textNode = document.createTextNode(value);
	vdom.el = textNode;

	insert(textNode, parentEl, index);
}

/**
 * Creates the HTML element for a virtual DOM element node and its children recursively.
 * The created `Element` is added to the `el` property of the vdom.
 *
 * If the vdom includes event listeners, these are added to the vdom object, under the
 * `listeners` property.
 *
 * @param {object} vdom the virtual DOM node of type "element"
 * @param {Element} parentEl the host element to mount the virtual DOM node to
 */
function createElementNode(vdom, parentEl, index) {
	const { tag, props, children } = vdom;

	const element = document.createElement(tag);
	addProps(element, props, vdom);
	vdom.el = element;

	children.forEach((child) => mountDOM(child, element));
	insert(element, parentEl, index);
}

function addProps(el, props, vdom) {
	const { on: events, ...attrs } = props;

	vdom.listeners = addEventListeners(events, el);
	setAttributes(el, attrs);
}

/**
 * Creates the fragment for a virtual DOM fragment node and its children recursively.
 * The vdom's `el` property is set to be the `parentEl` passed to the function.
 * This is because a fragment loses its children when it is appended to the DOM, so
 * we can't use it to reference the fragment's children.
 *
 * Note that `DocumentFragment` is a subclass of `Node`, but not of `Element`.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment}
 *
 * @param {object} vdom the virtual DOM node of type "fragment"
 * @param {Element} parentEl the host element to mount the virtual DOM node to
 */
function createFragmentNodes(vdom, parentEl, index) {
	const { children } = vdom;
	vdom.el = parentEl;

	children.forEach((child, i) =>
		mountDOM(child, parentEl, index ? index + i : null)
	);
}

function insert(el, parentEl, index) {
	// If index is null or undefined, simply append.
	// Note the usage of == instead of ===.
	if (index == null) {
		parentEl.append(el);
		return;
	}

	if (index < 0) {
		throw new Error(
			`Index must be a positive number integer, got ${index}`
		);
	}

	const children = parentEl.childNodes;

	if (index >= children.length) {
		parentEl.append(el);
	} else {
		parentEl.insertBefore(el, children[index]);
	}
}
