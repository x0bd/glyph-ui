import { DOM_TYPES } from "./h.js";
import { extractSlotContents, resolveSlots } from "./slots.js";
import { finishHooks, initHooks, runCleanupFunctions } from "./hooks.js";
import { patchDOM } from "./patch-dom.js";
import { mountDOM } from "./mount-dom.js";
import { destroyDOM } from "./destroy-dom.js";

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
		instance: null,
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
	const instance =
		typeof ComponentClass === "function" && !ComponentClass.prototype.render
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
		this.slotContents = {};
		this.isMounted = false;

		// Extract slot content from props.children if available
		if (props.children && Array.isArray(props.children)) {
			this.slotContents = extractSlotContents(props.children);
		}

		// Method to trigger re-renders for hook updates
		this._renderComponent = this._renderComponent.bind(this);
	}

	mount(parentEl) {
		this.parentEl = parentEl;

		// Initialize hooks for this component instance
		initHooks(this);

		// Render the component
		const rawVdom = this.renderFn(this.props);

		// Finish hooks processing for this render
		finishHooks();

		// Process slots
		this.vdom = resolveSlots(rawVdom, this.slotContents);

		// Mount the DOM
		mountDOM(this.vdom, parentEl);

		this.isMounted = true;

		return this;
	}

	unmount() {
		// Run cleanup functions for hooks (like useEffect)
		runCleanupFunctions(this);

		// Clean up DOM
		if (this.vdom) {
			destroyDOM(this.vdom);
			this.vdom = null;
		}

		this.isMounted = false;
	}

	updateProps(newProps) {
		this.props = { ...this.props, ...newProps };

		// Update slot contents when props change
		if (newProps.children && Array.isArray(newProps.children)) {
			this.slotContents = extractSlotContents(newProps.children);
		}

		return this._renderComponent();
	}

	/**
	 * Internal method to handle rendering and DOM updates.
	 */
	_renderComponent() {
		if (!this.isMounted) return;

		// Initialize hooks for this render
		initHooks(this);

		// Render the component
		const rawVdom = this.renderFn(this.props);

		// Finish hooks processing for this render
		finishHooks();

		// Process slots
		const newVdom = resolveSlots(rawVdom, this.slotContents);

		// Patch the DOM
		this.vdom = patchDOM(this.vdom, newVdom, this.parentEl);

		return this.vdom;
	}
}
