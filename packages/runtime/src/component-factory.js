import { DOM_TYPES } from "./h.js";

/**
 * Special DOM type for components
 */
export const COMPONENT_TYPE = "component";

/**
 * Creates a virtual node for a component.
 * This allows components to be used in the virtual DOM tree.
 * 
 * @param {Function|Class} ComponentClass - The component constructor or class
 * @param {Object} props - Props to pass to the component
 * @param {Array} children - Child elements to pass to the component
 * @returns {Object} Virtual DOM node representing the component
 */
export function createComponent(ComponentClass, props = {}, children = []) {
  // Create a virtual node of component type
  return {
    type: COMPONENT_TYPE,
    ComponentClass,
    props: { ...props, children },
    instance: null
  };
}

/**
 * Processes a component vdom node by instantiating the component and mounting it.
 * This is called by the mountDOM function when it encounters a component vdom node.
 * 
 * @param {Object} vdom - The virtual DOM node for the component
 * @param {HTMLElement} parentEl - The parent element to mount to
 * @param {Number} index - The index in the parent element to mount at
 * @returns {Object} The component instance
 */
export function processComponent(vdom, parentEl, index) {
  const { ComponentClass, props } = vdom;
  
  // Create an instance of the component
  const instance = typeof ComponentClass === 'function' && !ComponentClass.prototype.render
    ? new FunctionalComponentWrapper(ComponentClass, props)
    : new ComponentClass(props);
  
  // Store the instance on the vdom
  vdom.instance = instance;
  
  // Mount the component
  instance.mount(parentEl);
  
  return instance;
}

/**
 * Wrapper class for functional components to make them work with the component system.
 * This allows functional components to be used like class components.
 */
class FunctionalComponentWrapper {
  constructor(renderFn, props = {}) {
    this.renderFn = renderFn;
    this.props = props;
    this.vdom = null;
    this.parentEl = null;
  }
  
  mount(parentEl) {
    this.parentEl = parentEl;
    this.vdom = this.renderFn(this.props);
    return this;
  }
  
  unmount() {
    // No special cleanup needed for functional components
  }
  
  updateProps(newProps) {
    this.props = { ...this.props, ...newProps };
    this.vdom = this.renderFn(this.props);
    return this.vdom;
  }
} 