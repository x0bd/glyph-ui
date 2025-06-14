import { DOM_TYPES, h, hFragment } from "./h.js";

/**
 * Creates a slot where parent components can inject content
 * 
 * @param {string} name - The name of the slot (default is "default")
 * @param {Object} props - Additional properties for the slot
 * @param {Array} children - Default content if no slot content is provided
 * @returns {Object} A virtual DOM node representing the slot
 */
export function createSlot(name = "default", props = {}, children = []) {
  return {
    type: DOM_TYPES.ELEMENT,
    tag: "slot",
    props: {
      ...props,
      name,
      __isSlot: true
    },
    children,
    __slotName: name
  };
}

/**
 * Creates content to be inserted into a named slot
 * 
 * @param {string} slotName - The name of the target slot (default is "default")
 * @param {Array} children - Content to insert into the slot
 * @returns {Object} A virtual DOM node with slot targeting information
 */
export function createSlotContent(slotName = "default", children = []) {
  return {
    type: DOM_TYPES.ELEMENT,
    tag: "slot-content",
    props: {
      __isSlotContent: true,
      name: slotName
    },
    children,
    __targetSlot: slotName
  };
}

/**
 * Resolves slots by replacing slot elements with their corresponding content
 * or using default content if no content is provided.
 * 
 * @param {Object} vdom - The virtual DOM tree to process
 * @param {Object} slotContents - Map of slot names to content
 * @returns {Object} A new virtual DOM tree with resolved slots
 */
export function resolveSlots(vdom, slotContents = {}) {
  if (!vdom) return null;
  
  // Handle primitive values
  if (typeof vdom !== 'object') return vdom;
  
  // Deep clone the vdom to avoid modifying the original
  const clonedVdom = { ...vdom };
  
  // If this is a slot, replace it with the corresponding content or use default
  if (vdom.props && vdom.props.__isSlot) {
    const slotName = vdom.props.name || "default";
    if (slotContents[slotName] && slotContents[slotName].length > 0) {
      // Wrap the slot content in a fragment to ensure it has a proper vdom structure
      return hFragment(slotContents[slotName].filter(Boolean));
    }
    return clonedVdom;
  }
  
  // For elements and fragments, process children recursively
  if (vdom.children && Array.isArray(vdom.children)) {
    // Process each child and filter out any null results
    clonedVdom.children = vdom.children
      .map(child => resolveSlots(child, slotContents))
      .filter(Boolean); // Remove null/undefined values
  }
  
  return clonedVdom;
}

/**
 * Extracts slot contents from children array
 * 
 * @param {Array} children - Children array potentially containing slot content
 * @returns {Object} Map of slot names to content
 */
export function extractSlotContents(children = []) {
  const slotContents = {};
  const normalChildren = [];
  
  // Filter out null values from children
  const validChildren = children.filter(Boolean);
  
  for (const child of validChildren) {
    // Check if the child is slot content
    if (child && child.props && child.props.__isSlotContent) {
      const targetSlot = child.__targetSlot || "default";
      // Filter out null values from slot content children
      slotContents[targetSlot] = (child.children || []).filter(Boolean);
    } else if (child) {
      normalChildren.push(child);
    }
  }
  
  // If there are normal children but no default slot content,
  // use the normal children as the default slot content
  if (normalChildren.length > 0 && !slotContents["default"]) {
    slotContents["default"] = normalChildren;
  }
  
  return slotContents;
} 