import { updateAttributes } from "./attributes.js";
import { COMPONENT_TYPE } from "./component-factory.js";
import { destroyDOM } from "./destroy-dom.js";
import { updateEventListeners } from "./events.js";
import { DOM_TYPES } from "./h.js";
import { mountDOM } from "./mount-dom.js";
import { isShallowEqual } from "./utils/object-utils.js";

/**
 * Updates the DOM to match the new virtual DOM tree.
 * This is the core reconciliation algorithm that determines what needs to change.
 *
 * @param {Object} oldVdom - Previous virtual DOM node
 * @param {Object} newVdom - New virtual DOM node
 * @param {HTMLElement} parentEl - Parent element containing the DOM
 * @param {Number} index - Index in the parent's children
 * @returns {Object} The updated virtual DOM node
 */
export function patchDOM(oldVdom, newVdom, parentEl, index) {
	// If there's no old vdom, mount the new one
	if (!oldVdom) {
		mountDOM(newVdom, parentEl, index);
		return newVdom;
	}

	// If there's no new vdom, destroy the old one
	if (!newVdom) {
		destroyDOM(oldVdom);
		return null;
	}

	// Fast path for identical references - nothing to change
	if (oldVdom === newVdom) {
		return newVdom;
	}

	// If the node types are different, replace the old node
	if (oldVdom.type !== newVdom.type) {
		replaceNode(oldVdom, newVdom, parentEl, index);
		return newVdom;
	}

	// Special handling for components: If ComponentClass differs, replace the node
	if (oldVdom.type === COMPONENT_TYPE && newVdom.type === COMPONENT_TYPE) {
		// Check if the underlying ComponentClass is different
		// This handles switching between different components (e.g., HomePage vs LazyComponent)
		if (oldVdom.ComponentClass !== newVdom.ComponentClass) {
			replaceNode(oldVdom, newVdom, parentEl, index);
			return newVdom;
		}
	}

	// For text nodes, do a simple value check
	if (newVdom.type === DOM_TYPES.TEXT && oldVdom.value === newVdom.value) {
		newVdom.el = oldVdom.el;
		return newVdom;
	}

	// For element nodes, check if the tag is the same
	if (newVdom.type === DOM_TYPES.ELEMENT && oldVdom.tag !== newVdom.tag) {
		replaceNode(oldVdom, newVdom, parentEl, index);
		return newVdom;
	}

	// For elements and components with the same type, check if props are unchanged
	// Note: This prop check might be redundant for components if they are always replaced
	// when ComponentClass differs, but keep it for potential edge cases or future refactoring.
	if (
		(newVdom.type === DOM_TYPES.ELEMENT ||
			newVdom.type === COMPONENT_TYPE) &&
		oldVdom.props &&
		newVdom.props &&
		isShallowEqual(oldVdom.props, newVdom.props)
	) {
		// Props are the same, just transfer children if any
		if (
			Array.isArray(oldVdom.children) &&
			Array.isArray(newVdom.children) &&
			oldVdom.children.length === 0 &&
			newVdom.children.length === 0
		) {
			// No children to update, just reuse the old element
			newVdom.el = oldVdom.el;

			// For components, we need to transfer the instance as well
			if (newVdom.type === COMPONENT_TYPE) {
				newVdom.instance = oldVdom.instance;
			}

			return newVdom;
		}
	}

	// If we made it here, we have the same type of node but some changes
	// Handle different node types
	switch (newVdom.type) {
		case DOM_TYPES.TEXT: {
			return patchText(oldVdom, newVdom);
		}

		case DOM_TYPES.ELEMENT: {
			return patchElement(oldVdom, newVdom);
		}

		case DOM_TYPES.FRAGMENT: {
			return patchChildren(oldVdom, newVdom);
		}

		case COMPONENT_TYPE: {
			// ComponentClass is the same (checked above), so patch the existing instance
			return patchComponent(oldVdom, newVdom);
		}

		default: {
			throw new Error(`Can't patch DOM of type: ${newVdom.type}`);
		}
	}
}

/**
 * Patches a text node with new content
 */
function patchText(oldVdom, newVdom) {
	const el = oldVdom.el;
	newVdom.el = el;

	// Only update if text content has changed
	if (oldVdom.value !== newVdom.value) {
		el.nodeValue = newVdom.value;
	}

	return newVdom;
}

/**
 * Patches an element node with new attributes and children
 */
function patchElement(oldVdom, newVdom) {
	// If the tag changed, replace the node
	if (oldVdom.tag !== newVdom.tag) {
		replaceNode(oldVdom, newVdom, oldVdom.el.parentElement);
		return newVdom;
	}

	// Reuse the existing DOM node
	const el = oldVdom.el;
	newVdom.el = el;

	// Only update attributes and event listeners if props actually changed
	if (!isShallowEqual(oldVdom.props, newVdom.props)) {
		updateAttributes(el, oldVdom.props, newVdom.props);
		updateEventListeners(el, oldVdom, newVdom);
	}

	// Update children
	patchChildren(oldVdom, newVdom);

	return newVdom;
}

/**
 * Patches component node by updating props on the component instance
 */
function patchComponent(oldVdom, newVdom) {
	const { instance } = oldVdom;

	// Update the component instance reference
	newVdom.instance = instance;
	newVdom.el = oldVdom.el;

	// Only update props if they've actually changed
	if (!isShallowEqual(oldVdom.props, newVdom.props)) {
		instance.updateProps(newVdom.props);
	}

	return newVdom;
}

/**
 * Extracts the key from a virtual DOM node's props.
 * Returns undefined if no key is found.
 */
function getNodeKey(vdom) {
	return vdom && vdom.props ? vdom.props.key : undefined;
}

/**
 * Patches the children of a node (element or fragment) with optimized key-based reconciliation
 */
function patchChildren(oldVdom, newVdom) {
	const oldChildren = oldVdom.children || [];
	const newChildren = newVdom.children || [];
	const parentEl = oldVdom.el;

	// Set reference to parent element
	newVdom.el = parentEl;

	// Shortcut for common cases

	// 1. No children in either old or new vdom
	if (oldChildren.length === 0 && newChildren.length === 0) {
		return newVdom;
	}

	// 2. No old children, just mount all new ones
	if (oldChildren.length === 0) {
		// Just mount all children
		newChildren.forEach((child, idx) => {
			mountDOM(child, parentEl, idx);
		});
		return newVdom;
	}

	// 3. No new children, remove all old ones
	if (newChildren.length === 0) {
		// Just remove all children
		oldChildren.forEach((child) => {
			destroyDOM(child);
		});
		return newVdom;
	}

	// Check if we can use keyed reconciliation
	const hasKeys = newChildren.some(
		(child) => getNodeKey(child) !== undefined
	);

	if (hasKeys) {
		// Use optimized keyed reconciliation
		patchKeyedChildren(oldChildren, newChildren, parentEl);
	} else {
		// Fall back to index-based reconciliation
		patchUnkeyedChildren(oldChildren, newChildren, parentEl);
	}

	return newVdom;
}

/**
 * Patches children using index-based reconciliation (original algorithm)
 */
function patchUnkeyedChildren(oldChildren, newChildren, parentEl) {
	const maxLength = Math.max(oldChildren.length, newChildren.length);

	for (let i = 0; i < maxLength; i++) {
		const oldChild = oldChildren[i];
		const newChild = newChildren[i];

		patchDOM(oldChild, newChild, parentEl, i);
	}
}

/**
 * Patches children using key-based reconciliation for more efficient updates.
 * This version uses a common algorithm for better stability.
 */
function patchKeyedChildren(oldChildren, newChildren, parentEl) {
	const oldKeyMap = new Map();
	oldChildren.forEach((child, i) => {
		const key = getNodeKey(child);
		if (key !== undefined) {
			oldKeyMap.set(key, { vdom: child, index: i });
		}
	});

	let lastPatchedIndex = 0;
	const patchedKeys = new Set();

	// Iterate through new children to patch, move, or create nodes
	for (let i = 0; i < newChildren.length; i++) {
		const newChild = newChildren[i];
		const newKey = getNodeKey(newChild);
		const oldEntry =
			newKey !== undefined ? oldKeyMap.get(newKey) : undefined;

		const referenceNode = parentEl.childNodes[i]; // Node *currently* at this position

		if (oldEntry) {
			// Key found: Patch the existing node
			const oldChild = oldEntry.vdom;
			patchDOM(oldChild, newChild, parentEl, i);
			patchedKeys.add(newKey);

			// Check if the node needs to be moved
			if (oldEntry.index < lastPatchedIndex) {
				// Move node forward
				parentEl.insertBefore(newChild.el, referenceNode);
			} else {
				// Node is in correct relative order or doesn't need moving
				lastPatchedIndex = oldEntry.index;
			}
		} else {
			// Key not found: Mount a new node
			mountDOM(newChild, parentEl, i);
		}
	}

	// Remove any old children whose keys were not found in the new children
	oldKeyMap.forEach((oldEntry, key) => {
		if (!patchedKeys.has(key)) {
			destroyDOM(oldEntry.vdom);
		}
	});

	// Note: This implementation assumes all children are keyed if any are.
	// Handling mixed keyed/unkeyed children would require more complex logic.
}

/**
 * Replaces an old node with a new one
 */
function replaceNode(oldVdom, newVdom, parentEl, index) {
	destroyDOM(oldVdom);
	mountDOM(newVdom, parentEl, getElementIndex(oldVdom, index));
	return newVdom;
}

/**
 * Gets the index of an element in its parent
 */
function getElementIndex(vdom, fallbackIndex) {
	// If we have no element, return the fallback
	if (!vdom || !vdom.el) {
		return fallbackIndex || 0;
	}

	const el = vdom.el;
	const parentEl = el.parentElement;

	if (!parentEl) {
		return fallbackIndex || 0;
	}

	// Find the index of the element in its parent
	return Array.from(parentEl.childNodes).indexOf(el);
}
