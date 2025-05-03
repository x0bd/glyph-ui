import { destroyDOM } from "./destroy-dom.js";
import { Dispatcher } from "./dispatcher.js";
import { mountDOM } from "./mount-dom.js";
import { patchDOM } from "./patch-dom.js";
import { extractSlotContents, resolveSlots } from "./slots.js";

/**
 * Base Component class that provides state management and lifecycle methods.
 * Components can manage their own internal state and react to changes.
 */
export class Component {
  /**
   * @param {Object} props - Properties passed to the component
   * @param {Object} options - Component configuration options
   * @param {Object} options.initialState - Initial state for the component
   */
  constructor(props = {}, { initialState = {} } = {}) {
    this.props = props;
    this.state = initialState;
    this.vdom = null;
    this.parentEl = null;
    this.isMounted = false;
    this.slotContents = {};
    
    // Extract slot content from props.children if available
    if (props.children && Array.isArray(props.children)) {
      this.slotContents = extractSlotContents(props.children);
    }
    
    // Create internal dispatcher for state updates
    this._dispatcher = new Dispatcher();
    this._subscriptions = [this._dispatcher.afterEveryCommand(this._renderComponent.bind(this))];
    
    // Bind methods to this instance
    this.setState = this.setState.bind(this);
    this.emit = this.emit.bind(this);
    this.render = this.render.bind(this);
  }
  
  /**
   * Update the component's state and trigger a re-render.
   * @param {Object|Function} stateChange - Object to merge with current state or function that returns new state
   */
  setState(stateChange) {
    const newState = typeof stateChange === 'function' 
      ? stateChange(this.state) 
      : stateChange;
      
    this.state = { ...this.state, ...newState };
    this._dispatcher.dispatch('state-updated', this.state);
  }
  
  /**
   * Emit an event to the component's dispatcher.
   * @param {string} eventName - Name of the event
   * @param {any} payload - Event payload
   */
  emit(eventName, payload) {
    this._dispatcher.dispatch(eventName, payload);
  }
  
  /**
   * Mount the component to a DOM element.
   * @param {HTMLElement} parentEl - The parent element to mount to
   * @returns {Component} - The component instance for chaining
   */
  mount(parentEl) {
    this.parentEl = parentEl;
    
    // Call lifecycle method before first render
    if (this.beforeMount) {
      this.beforeMount();
    }
    
    // Initial render
    this.vdom = this._renderWithSlots();
    mountDOM(this.vdom, parentEl);
    this.isMounted = true;
    
    // Call lifecycle method after mounting
    if (this.mounted) {
      this.mounted();
    }
    
    return this;
  }
  
  /**
   * Unmount the component and clean up resources.
   */
  unmount() {
    // Call lifecycle method before unmounting
    if (this.beforeUnmount) {
      this.beforeUnmount();
    }
    
    // Clean up DOM
    if (this.vdom) {
      destroyDOM(this.vdom);
      this.vdom = null;
    }
    
    // Clean up subscriptions
    this._subscriptions.forEach(unsubscribe => unsubscribe());
    this.isMounted = false;
    
    // Call lifecycle method after unmounting
    if (this.unmounted) {
      this.unmounted();
    }
  }
  
  /**
   * Update component with new props.
   * @param {Object} newProps - New properties for the component
   */
  updateProps(newProps) {
    const oldProps = this.props;
    this.props = { ...this.props, ...newProps };
    
    // Extract slot content from new props.children if available
    if (newProps.children && Array.isArray(newProps.children)) {
      this.slotContents = extractSlotContents(newProps.children);
    }
    
    // Call lifecycle method before update
    if (this.beforeUpdate) {
      this.beforeUpdate(oldProps, this.props);
    }
    
    // Re-render with new props
    this._renderComponent();
    
    // Call lifecycle method after update
    if (this.updated) {
      this.updated(oldProps, this.props);
    }
  }
  
  /**
   * Internal method to render the component with slots resolved.
   * @returns {Object} The rendered virtual DOM with slots resolved
   */
  _renderWithSlots() {
    const rawVdom = this.render(this.props, this.state, this.emit);
    return resolveSlots(rawVdom, this.slotContents);
  }
  
  /**
   * Internal method to handle rendering and DOM updates.
   */
  _renderComponent() {
    if (!this.isMounted) return;
    
    const newVdom = this._renderWithSlots();
    this.vdom = patchDOM(this.vdom, newVdom, this.parentEl);
  }
  
  /**
   * Render method to be overridden by subclasses.
   * @param {Object} props - Component props
   * @param {Object} state - Component state
   * @param {Function} emit - Event emitter function
   * @returns {Object} Virtual DOM node
   */
  render(props, state, emit) {
    throw new Error('Components must implement render method');
  }
} 