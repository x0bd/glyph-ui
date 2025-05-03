import { updateAttributes } from "./attributes.js";
import { COMPONENT_TYPE } from "./component-factory.js";
import { destroyDOM } from "./destroy-dom.js";
import { updateEventListeners } from "./events.js";
import { DOM_TYPES } from "./h.js";
import { mountDOM } from "./mount-dom.js";

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
  
  // If the node types are different, replace the old node
  if (oldVdom.type !== newVdom.type) {
    // Special handling for components
    if (oldVdom.type === COMPONENT_TYPE && newVdom.type === COMPONENT_TYPE) {
      if (oldVdom.ComponentClass !== newVdom.ComponentClass) {
        replaceNode(oldVdom, newVdom, parentEl, index);
        return newVdom;
      }
    } else {
      replaceNode(oldVdom, newVdom, parentEl, index);
      return newVdom;
    }
  }
  
  // If we made it here, we have the same type of node
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
  
  // Update props (attributes and event listeners)
  updateAttributes(el, oldVdom.props, newVdom.props);
  updateEventListeners(el, oldVdom, newVdom);
  
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
  
  // Update the props on the component instance
  instance.updateProps(newVdom.props);
  
  return newVdom;
}

/**
 * Patches the children of a node (element or fragment)
 */
function patchChildren(oldVdom, newVdom) {
  const oldChildren = oldVdom.children || [];
  const newChildren = newVdom.children || [];
  const parentEl = oldVdom.el;
  
  // Set reference to parent element
  newVdom.el = parentEl;
  
  // Simple implementation: patch children one by one based on index
  // A more optimized version would use key-based reconciliation
  const maxLength = Math.max(oldChildren.length, newChildren.length);
  
  for (let i = 0; i < maxLength; i++) {
    const oldChild = oldChildren[i];
    const newChild = newChildren[i];
    
    patchDOM(oldChild, newChild, parentEl, i);
  }
  
  return newVdom;
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
