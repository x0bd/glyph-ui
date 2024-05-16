import { withoutNulls } from "./utils/arrays";

export const DOM_TYPES = {
	TEXT: "text",
	ELEMENT: "element",
	FRAGMENT: "fragment",
};

/**
 * Hypertext function: creates a virtual node representing an element with
 * the passed in tag or component constructor.
 *
 * The props are added to the element as attributes.
 * There are some special props:
 * - `on`: an object containing event listeners to add to the element
 * - `class`: a string or array of strings to add to the element's class list
 * - `style`: an object containing CSS properties to add to the element's style
 *
 * The children are added to the element as child nodes.
 * If a child is a string, it is converted to a text node using `hString()`.
 *
 * @param {(string|object)} tag the tag name of the element
 * @param {object} props the props to add to the element
 * @param {array} children the children to add to the element
 * @returns {ElementVNode} the virtual node
 */
export function h(tag, props = {}, children = []) {
	return {
		tag,
		props,
		children: mapTextNodes(withoutNulls(children)),
		type: DOM_TYPES.ELEMENT,
	};
}

function mapTextNodes(children) {
	return children.map((child) => {
		typeof child === "string" ? hString(child) : child;
	});
}

/**
 * @typedef TextVNode
 * @type {object}
 * @property {string} type - The type of the virtual node = 'text'.
 * @property {string} value - The text of the text node.
 * @property {Text} [el] - The mounted element.
 */

/**
 * Creates a text virtual node.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Text}
 *
 * @param {string} str the text to add to the text node
 * @returns {TextVNode} the virtual node
 */
export function hString(str) {
	return { type: DOM_TYPES.TEXT, value: str };
}

export function hFragment(vNodes) {
	return {
		type: DOM_TYPES.FRAGMENT,
		children: mapTextNodes(withoutNulls(vNodes)),
	};
}
