import { DOM_TYPES } from "./h";
import { setAttributes } from "./attributes";
import { addEventListeners } from "./events";

/**
 * Creates the DOM nodes for a virtual DOM tree, mounts them in the DOM, and
 * modifies the vdom tree to include the corresponding DOM nodes and event listeners.
 *
 * If an index is given, the created DOM node is inserted at that index in the parent element.
 * Otherwise, it is appended to the parent element.
 *
 * If a host component is given, the event listeners attached to the DOM nodes are bound to
 * the host component.
 *
 * @param {import('./h').VNode} vdom the virtual DOM node to mount
 * @param {HTMLElement} parentEl the host element to mount the virtual DOM node to
 * @param {number} [index] the index at the parent element to mount the virtual DOM node to
 * @param {import('./component').Component} [hostComponent] The component that the listeners are added to
 */
export function mountDOM(vdom, parentEl) {
	switch (vdom.type) {
		case DOM_TYPES.TEXT: {
			createTextNode(vdom, parentEl);
			break;
		}

		case DOM_TYPES.ELEMENT: {
			createElementNode(vdom, parentEl);
			break;
		}

		case DOM_TYPES.FRAGMENT: {
			createFragmentNodes(vdom, parentEl);
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
 * @param {import('./h').TextVNode} vdom the virtual DOM node of type "text"
 * @param {Element} parentEl the host element to mount the virtual DOM node to
 * @param {number} [index] the index at the parent element to mount the virtual DOM node to
 */
function createTextNode(vdom, parentEl) {
	const { value } = vdom;

	const textNode = document.createTextNode(value);
	vdom.el = textNode;

	parentEl.append(textNode);
}

/**
 * Creates the nodes for the children of a virtual DOM fragment node and appends them to the
 * parent element.
 *
 * @param {import('./h').FragmentVNode} vdom the virtual DOM node of type "fragment"
 * @param {Element} parentEl the host element to mount the virtual DOM node to
 * @param {number} [index] the index at the parent element to mount the virtual DOM node to
 * @param {import('./component').Component} [hostComponent] The component that the listeners are added to
 */
function createFragmentNodes(vdom, parentEl) {
	const { children } = vdom;
	vdom.el = parentEl;

	children.forEach((child) => mountDOM(child, parentEl));
}

/**
 * Creates the HTML element for a virtual DOM element node and its children recursively.
 * The created `Element` is added to the `el` property of the vdom.
 *
 * If the vdom includes event listeners, these are added to the vdom object, under the
 * `listeners` property.
 *
 * @param {import('./h').ElementVNode} vdom the virtual DOM node of type "element"
 * @param {Element} parentEl the host element to mount the virtual DOM node to
 * @param {number} [index] the index at the parent element to mount the virtual DOM node to
 * @param {import('./component').Component} [hostComponent] The component that the listeners are added to
 */
function createElementNode(vdom, parentEl) {
	const { tag, props, children } = vdom;

	const element = document.createElement(tag);
	addProps(element, props, vdom);
	vdom.el = element;

	children.forEach((child) => mountDOM(child, element));
	parentEl.append(element);
}

/**
 * Adds the attributes and event listeners to an element.
 *
 * @param {Element} el The element to add the attributes to
 * @param {import('./h').ElementVNode} vdom The vdom node
 * @param {import('./component').Component} [hostComponent] The component that the listeners are added to
 */
function addProps(el, props, vdom) {
	const { on: events, ...attrs } = props;

	vdom.listeners = addEventListeners(events, el);
	setAttributes(el, attrs);
}
