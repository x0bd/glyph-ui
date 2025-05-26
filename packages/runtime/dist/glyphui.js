function withoutNulls(arr) {
	return arr.filter((item) => item != null);
}

function assert(condition, message = "Assertion failed") {
	if (!condition) {
		throw new Error(message);
	}
}

const DOM_TYPES = {
	TEXT: "text",
	ELEMENT: "element",
	FRAGMENT: "fragment",
};
function h(tag, props = {}, children = []) {
	return {
		tag,
		props,
		children: mapTextNodes(withoutNulls(children)),
		type: DOM_TYPES.ELEMENT,
	};
}
function hString(str) {
	return { type: DOM_TYPES.TEXT, value: str };
}
function hFragment(vNodes) {
	assert(Array.isArray(vNodes), "hFragment expects an array of vNodes");
	return {
		type: DOM_TYPES.FRAGMENT,
		children: mapTextNodes(withoutNulls(vNodes)),
	};
}
function mapTextNodes(children) {
	return children.map((child) =>
		typeof child === "string" ? hString(child) : child
	);
}

function createSlot(name = "default", props = {}, children = []) {
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
function createSlotContent(slotName = "default", children = []) {
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
function resolveSlots(vdom, slotContents = {}) {
  if (!vdom) return null;
  if (typeof vdom !== 'object') return vdom;
  const clonedVdom = { ...vdom };
  if (vdom.props && vdom.props.__isSlot) {
    const slotName = vdom.props.name || "default";
    if (slotContents[slotName] && slotContents[slotName].length > 0) {
      return hFragment(slotContents[slotName].filter(Boolean));
    }
    return clonedVdom;
  }
  if (vdom.children && Array.isArray(vdom.children)) {
    clonedVdom.children = vdom.children
      .map(child => resolveSlots(child, slotContents))
      .filter(Boolean);
  }
  return clonedVdom;
}
function extractSlotContents(children = []) {
  const slotContents = {};
  const normalChildren = [];
  const validChildren = children.filter(Boolean);
  for (const child of validChildren) {
    if (child && child.props && child.props.__isSlotContent) {
      const targetSlot = child.__targetSlot || "default";
      slotContents[targetSlot] = (child.children || []).filter(Boolean);
    } else if (child) {
      normalChildren.push(child);
    }
  }
  if (normalChildren.length > 0 && !slotContents["default"]) {
    slotContents["default"] = normalChildren;
  }
  return slotContents;
}

let currentComponent = null;
let currentHookIndex = 0;
let isHooksProcessing = false;
const componentHooksStore = new WeakMap();
function initHooks(componentInstance) {
	if (!componentInstance) {
		console.error(
			"Cannot initialize hooks: No component instance provided"
		);
		return;
	}
	if (!componentHooksStore.has(componentInstance)) {
		componentHooksStore.set(componentInstance, {
			hooks: [],
			cleanupFunctions: [],
		});
	}
	currentHookIndex = 0;
	currentComponent = componentInstance;
	isHooksProcessing = true;
}
function finishHooks() {
	isHooksProcessing = false;
}
function runCleanupFunctions(componentInstance) {
	if (!componentInstance) {
		console.error("Cannot run cleanup: No component instance provided");
		return;
	}
	const hooksData = componentHooksStore.get(componentInstance);
	if (hooksData) {
		hooksData.cleanupFunctions.forEach((cleanup, index) => {
			if (typeof cleanup === "function") {
				try {
					cleanup();
				} catch (error) {
					console.error(
						`Error in useEffect cleanup for hook ${index}:`,
						error
					);
				}
			}
		});
		hooksData.cleanupFunctions = [];
	}
}
function checkHooksContext() {
	if (!isHooksProcessing || !currentComponent) {
		throw new Error(
			"Hooks can only be called inside a component's render function or inside another hook. " +
				"Don't call hooks outside of components or in class components."
		);
	}
	return currentComponent;
}
function useState(initialState) {
	const component = checkHooksContext();
	const hooksData = componentHooksStore.get(component);
	if (!hooksData) {
		throw new Error(
			"Component hooks data not found. This is likely a bug in GlyphUI."
		);
	}
	const hookIndex = currentHookIndex++;
	if (hookIndex >= hooksData.hooks.length) {
		const initialValue =
			typeof initialState === "function" ? initialState() : initialState;
		hooksData.hooks[hookIndex] = {
			type: "state",
			value: initialValue,
		};
	}
	const hook = hooksData.hooks[hookIndex];
	const setState = (newState) => {
		if (!component || component.isMounted === false) {
			console.warn(
				"Cannot update state: Component is not mounted or instance is lost"
			);
			return;
		}
		const nextState =
			typeof newState === "function" ? newState(hook.value) : newState;
		if (hook.value !== nextState) {
			hook.value = nextState;
			if (component._renderComponent) {
				try {
					component._renderComponent();
				} catch (error) {
					console.error(
						"Error re-rendering component after state update:",
						error
					);
				}
			}
		}
	};
	return [hook.value, setState];
}
function useEffect(effect, deps) {
	const component = checkHooksContext();
	if (typeof effect !== "function") {
		console.error("useEffect requires a function as its first argument");
		return;
	}
	const hooksData = componentHooksStore.get(component);
	if (!hooksData) {
		throw new Error(
			"Component hooks data not found. This is likely a bug in GlyphUI."
		);
	}
	const hookIndex = currentHookIndex++;
	if (hookIndex >= hooksData.hooks.length) {
		hooksData.hooks[hookIndex] = {
			type: "effect",
			deps: deps || null,
			cleanup: null,
		};
		setTimeout(() => {
			if (component.isMounted !== false) {
				try {
					const cleanup = effect();
					if (cleanup && typeof cleanup === "function") {
						const currentHooksData =
							componentHooksStore.get(component);
						if (currentHooksData) {
							currentHooksData.cleanupFunctions[hookIndex] =
								cleanup;
						}
					}
				} catch (error) {
					console.error(
						`Error running effect for hook ${hookIndex}:`,
						error
					);
				}
			}
		}, 0);
		return;
	}
	const hook = hooksData.hooks[hookIndex];
	const oldDeps = hook.deps;
	hook.deps = deps || null;
	if (deps && oldDeps) {
		const depsChanged =
			deps.length !== oldDeps.length ||
			deps.some((dep, i) => dep !== oldDeps[i]);
		if (!depsChanged) {
			return;
		}
	}
	const cleanupToRun = hooksData.cleanupFunctions[hookIndex];
	if (typeof cleanupToRun === "function") {
		try {
			cleanupToRun();
			hooksData.cleanupFunctions[hookIndex] = null;
		} catch (error) {
			console.error(
				`Error in useEffect cleanup for hook ${hookIndex}:`,
				error
			);
		}
	}
	setTimeout(() => {
		if (component.isMounted !== false) {
			try {
				const cleanup = effect();
				const currentHooksData = componentHooksStore.get(component);
				if (currentHooksData) {
					if (cleanup && typeof cleanup === "function") {
						currentHooksData.cleanupFunctions[hookIndex] = cleanup;
					} else {
						currentHooksData.cleanupFunctions[hookIndex] = null;
					}
				}
			} catch (error) {
				console.error(
					`Error running effect for hook ${hookIndex}:`,
					error
				);
			}
		}
	}, 0);
}
function useRef(initialValue) {
	const component = checkHooksContext();
	const hooksData = componentHooksStore.get(component);
	if (!hooksData) {
		throw new Error(
			"Component hooks data not found. This is likely a bug in GlyphUI."
		);
	}
	const hookIndex = currentHookIndex++;
	if (hookIndex >= hooksData.hooks.length) {
		hooksData.hooks[hookIndex] = {
			type: "ref",
			value: { current: initialValue },
		};
	}
	return hooksData.hooks[hookIndex].value;
}
function useMemo(factory, deps) {
	const component = checkHooksContext();
	if (typeof factory !== "function") {
		console.error("useMemo requires a function as its first argument");
		return undefined;
	}
	const hooksData = componentHooksStore.get(component);
	if (!hooksData) {
		throw new Error(
			"Component hooks data not found. This is likely a bug in GlyphUI."
		);
	}
	const hookIndex = currentHookIndex++;
	if (hookIndex >= hooksData.hooks.length) {
		let value;
		try {
			value = factory();
		} catch (error) {
			console.error(
				`Error calculating initial memoized value for hook ${hookIndex}:`,
				error
			);
			value = undefined;
		}
		hooksData.hooks[hookIndex] = {
			type: "memo",
			value,
			deps: deps || null,
		};
		return value;
	}
	const hook = hooksData.hooks[hookIndex];
	const oldDeps = hook.deps;
	hook.deps = deps || null;
	if (
		!deps ||
		!oldDeps ||
		deps.length !== oldDeps.length ||
		deps.some((dep, i) => dep !== oldDeps[i])
	) {
		try {
			hook.value = factory();
		} catch (error) {
			console.error(
				`Error recalculating memoized value for hook ${hookIndex}:`,
				error
			);
		}
	}
	return hook.value;
}
function useCallback(callback, deps) {
	if (typeof callback !== "function") {
		console.error("useCallback requires a function as its first argument");
		return () => {};
	}
	return useMemo(() => callback, deps);
}

function setAttributes(el, attrs) {
	const { class: className, style, ref, ...otherAttrs } = attrs;
	delete otherAttrs.key;
	if (ref && typeof ref === "function") {
		ref(el);
	}
	if (className) {
		setClass(el, className);
	}
	if (style) {
		Object.entries(style).forEach(([prop, value]) => {
			setStyle(el, prop, value);
		});
	}
	for (const [name, value] of Object.entries(otherAttrs)) {
		setAttribute(el, name, value);
	}
}
function setAttribute(el, name, value) {
	if (value == null) {
		removeAttribute(el, name);
	} else if (name.startsWith("data-")) {
		el.setAttribute(name, value);
	} else {
		el[name] = value;
	}
}
function removeAttribute(el, name) {
	try {
		el[name] = null;
	} catch {
		console.warn(`Failed to set "${name}" to null on ${el.tagName}`);
	}
	el.removeAttribute(name);
}
function setStyle(el, name, value) {
	el.style[name] = value;
}
function removeStyle(el, name) {
	el.style[name] = null;
}
function setClass(el, className) {
	el.className = "";
	if (typeof className === "string") {
		el.className = className;
	}
	if (Array.isArray(className)) {
		el.classList.add(...className);
	}
}
function updateAttributes(el, oldAttrs = {}, newAttrs = {}) {
	const { on: oldEvents, ref: oldRef, ...oldAttributes } = oldAttrs;
	const { on: newEvents, ref: newRef, ...newAttributes } = newAttrs;
	if (newRef && typeof newRef === "function" && newRef !== oldRef) {
		newRef(el);
	}
	for (const name in oldAttributes) {
		if (name === "key") continue;
		if (!(name in newAttributes)) {
			if (name === "class") {
				el.className = "";
			} else if (name === "style") {
				for (const styleName in oldAttributes.style) {
					removeStyle(el, styleName);
				}
			} else {
				removeAttribute(el, name);
			}
		}
	}
	for (const name in newAttributes) {
		if (name === "key") continue;
		const oldValue = oldAttributes[name];
		const newValue = newAttributes[name];
		if (oldValue !== newValue) {
			if (name === "class") {
				setClass(el, newValue);
			} else if (name === "style") {
				const oldStyles = oldAttributes.style || {};
				for (const styleName in oldStyles) {
					if (!(styleName in newValue)) {
						removeStyle(el, styleName);
					}
				}
				for (const styleName in newValue) {
					if (oldStyles[styleName] !== newValue[styleName]) {
						setStyle(el, styleName, newValue[styleName]);
					}
				}
			} else {
				setAttribute(el, name, newValue);
			}
		}
	}
}

function addEventListeners(listeners = {}, el) {
	const addedListeners = {};
	Object.entries(listeners).forEach(([eventName, handler]) => {
		const listener = addEventListener(eventName, handler, el);
		addedListeners[eventName] = listener;
	});
	return addedListeners;
}
function addEventListener(eventName, handler, el) {
	el.addEventListener(eventName, handler);
	return handler;
}
function removeEventListeners(listeners = {}, el) {
	Object.entries(listeners).forEach(([eventName, handler]) => {
		el.removeEventListener(eventName, handler);
	});
}
function updateEventListeners(el, oldVdom, newVdom) {
	const oldListeners = oldVdom.listeners || {};
	const oldProps = oldVdom.props || {};
	const newProps = newVdom.props || {};
	if (!oldProps.on && !newProps.on) {
		return;
	}
	if (oldProps.on) {
		removeEventListeners(oldListeners, el);
	}
	if (newProps.on) {
		newVdom.listeners = addEventListeners(newProps.on, el);
	} else {
		newVdom.listeners = {};
	}
}

function mountDOM(vdom, parentEl, index) {
	if (!vdom) return null;
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
			processComponent(vdom, parentEl);
			break;
		}
		default: {
			throw new Error(`Can't mount DOM of type: ${vdom.type}`);
		}
	}
}
function createTextNode(vdom, parentEl, index) {
	const { value } = vdom;
	const textNode = document.createTextNode(value);
	vdom.el = textNode;
	insert(textNode, parentEl, index);
}
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
function createFragmentNodes(vdom, parentEl, index) {
	const { children } = vdom;
	vdom.el = parentEl;
	children.forEach((child, i) =>
		mountDOM(child, parentEl, index ? index + i : null)
	);
}
function insert(el, parentEl, index) {
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

function isShallowEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (!obj1 || !obj2) return false;
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  return keys1.every(key => {
    if (key === 'on') {
      return obj2.hasOwnProperty(key);
    }
    if (key === 'key') return true;
    return Object.prototype.hasOwnProperty.call(obj2, key) && obj1[key] === obj2[key];
  });
}
function isDeepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (!obj1 || !obj2) return false;
  if (typeof obj1 !== typeof obj2) return false;
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;
    return obj1.every((val, idx) => isDeepEqual(val, obj2[idx]));
  }
  if (typeof obj1 === 'object') {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    return keys1.every(key => {
      if (typeof obj1[key] === 'function' && typeof obj2[key] === 'function') {
        return true;
      }
      return Object.prototype.hasOwnProperty.call(obj2, key) &&
             isDeepEqual(obj1[key], obj2[key]);
    });
  }
  return false;
}

function patchDOM(oldVdom, newVdom, parentEl, index) {
  if (!oldVdom) {
    mountDOM(newVdom, parentEl, index);
    return newVdom;
  }
  if (!newVdom) {
    destroyDOM(oldVdom);
    return null;
  }
  if (oldVdom === newVdom) {
    return newVdom;
  }
  if (oldVdom.type !== newVdom.type) {
    replaceNode(oldVdom, newVdom, parentEl, index);
    return newVdom;
  }
  if (oldVdom.type === COMPONENT_TYPE && newVdom.type === COMPONENT_TYPE) {
    if (oldVdom.ComponentClass !== newVdom.ComponentClass) {
      replaceNode(oldVdom, newVdom, parentEl, index);
      return newVdom;
    }
  }
  if (newVdom.type === DOM_TYPES.TEXT && oldVdom.value === newVdom.value) {
    newVdom.el = oldVdom.el;
    return newVdom;
  }
  if (newVdom.type === DOM_TYPES.ELEMENT && oldVdom.tag !== newVdom.tag) {
    replaceNode(oldVdom, newVdom, parentEl, index);
    return newVdom;
  }
  if ((newVdom.type === DOM_TYPES.ELEMENT || newVdom.type === COMPONENT_TYPE) &&
       oldVdom.props && newVdom.props && isShallowEqual(oldVdom.props, newVdom.props)) {
    if (Array.isArray(oldVdom.children) && Array.isArray(newVdom.children) &&
        oldVdom.children.length === 0 && newVdom.children.length === 0) {
      newVdom.el = oldVdom.el;
      if (newVdom.type === COMPONENT_TYPE) {
        newVdom.instance = oldVdom.instance;
      }
      return newVdom;
    }
  }
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
function patchText(oldVdom, newVdom) {
  const el = oldVdom.el;
  newVdom.el = el;
  if (oldVdom.value !== newVdom.value) {
    el.nodeValue = newVdom.value;
  }
  return newVdom;
}
function patchElement(oldVdom, newVdom) {
  if (oldVdom.tag !== newVdom.tag) {
    replaceNode(oldVdom, newVdom, oldVdom.el.parentElement);
    return newVdom;
  }
  const el = oldVdom.el;
  newVdom.el = el;
  if (!isShallowEqual(oldVdom.props, newVdom.props)) {
    updateAttributes(el, oldVdom.props, newVdom.props);
    updateEventListeners(el, oldVdom, newVdom);
  }
  patchChildren(oldVdom, newVdom);
  return newVdom;
}
function patchComponent(oldVdom, newVdom) {
  const { instance } = oldVdom;
  newVdom.instance = instance;
  newVdom.el = oldVdom.el;
  if (!isShallowEqual(oldVdom.props, newVdom.props)) {
    instance.updateProps(newVdom.props);
  }
  return newVdom;
}
function getNodeKey(vdom) {
  return vdom && vdom.props ? vdom.props.key : undefined;
}
function patchChildren(oldVdom, newVdom) {
  const oldChildren = oldVdom.children || [];
  const newChildren = newVdom.children || [];
  const parentEl = oldVdom.el;
  newVdom.el = parentEl;
  if (oldChildren.length === 0 && newChildren.length === 0) {
    return newVdom;
  }
  if (oldChildren.length === 0) {
    newChildren.forEach((child, idx) => {
      mountDOM(child, parentEl, idx);
    });
    return newVdom;
  }
  if (newChildren.length === 0) {
    oldChildren.forEach(child => {
      destroyDOM(child);
    });
    return newVdom;
  }
  const hasKeys = newChildren.some(child => getNodeKey(child) !== undefined);
  if (hasKeys) {
    patchKeyedChildren(oldChildren, newChildren, parentEl);
  } else {
    patchUnkeyedChildren(oldChildren, newChildren, parentEl);
  }
  return newVdom;
}
function patchUnkeyedChildren(oldChildren, newChildren, parentEl) {
  const maxLength = Math.max(oldChildren.length, newChildren.length);
  for (let i = 0; i < maxLength; i++) {
    const oldChild = oldChildren[i];
    const newChild = newChildren[i];
    patchDOM(oldChild, newChild, parentEl, i);
  }
}
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
  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    const newKey = getNodeKey(newChild);
    const oldEntry = newKey !== undefined ? oldKeyMap.get(newKey) : undefined;
    const referenceNode = parentEl.childNodes[i];
    if (oldEntry) {
      const oldChild = oldEntry.vdom;
      patchDOM(oldChild, newChild, parentEl, i);
      patchedKeys.add(newKey);
      if (oldEntry.index < lastPatchedIndex) {
        parentEl.insertBefore(newChild.el, referenceNode);
      } else {
        lastPatchedIndex = oldEntry.index;
      }
    } else {
      mountDOM(newChild, parentEl, i);
    }
  }
  oldKeyMap.forEach((oldEntry, key) => {
    if (!patchedKeys.has(key)) {
      destroyDOM(oldEntry.vdom);
    }
  });
}
function replaceNode(oldVdom, newVdom, parentEl, index) {
  destroyDOM(oldVdom);
  mountDOM(newVdom, parentEl, getElementIndex(oldVdom, index));
  return newVdom;
}
function getElementIndex(vdom, fallbackIndex) {
  if (!vdom || !vdom.el) {
    return fallbackIndex || 0;
  }
  const el = vdom.el;
  const parentEl = el.parentElement;
  if (!parentEl) {
    return fallbackIndex || 0;
  }
  return Array.from(parentEl.childNodes).indexOf(el);
}

const COMPONENT_TYPE = "component";
function createComponent(ComponentClass, props = {}, children = []) {
	return {
		type: COMPONENT_TYPE,
		ComponentClass,
		props: { ...props, children },
		instance: null,
	};
}
function processComponent(vdom, parentEl, index) {
	const { ComponentClass, props } = vdom;
	let instance;
	try {
		const isFunctional =
			typeof ComponentClass === "function" &&
			(!ComponentClass.prototype || !ComponentClass.prototype.render);
		instance = isFunctional
			? new FunctionalComponentWrapper(ComponentClass, props)
			: new ComponentClass(props);
		vdom.instance = instance;
		instance.mount(parentEl);
		return instance;
	} catch (error) {
		console.error("Error processing component:", error);
		const errorEl = document.createElement("div");
		errorEl.style.color = "red";
		errorEl.style.padding = "10px";
		errorEl.style.border = "1px solid red";
		errorEl.style.margin = "10px 0";
		errorEl.innerHTML = `
			<h3>Component Error</h3>
			<p>${error.message}</p>
		`;
		if (parentEl) {
			parentEl.appendChild(errorEl);
		}
		throw error;
	}
}
class FunctionalComponentWrapper {
	constructor(renderFn, props = {}) {
		this.renderFn = renderFn;
		this.props = props || {};
		this.vdom = null;
		this.parentEl = null;
		this.slotContents = {};
		this.isMounted = false;
		if (props && props.children && Array.isArray(props.children)) {
			this.slotContents = extractSlotContents(props.children);
		}
		this._renderComponent = this._renderComponent.bind(this);
	}
	mount(parentEl) {
		if (!parentEl) {
			console.error("Cannot mount component: No parent element provided");
			throw new Error(
				"Cannot mount component: No parent element provided"
			);
		}
		this.parentEl = parentEl;
		initHooks(this);
		try {
			const rawVdom = this.renderFn(this.props);
			finishHooks();
			this.vdom = resolveSlots(rawVdom, this.slotContents);
			mountDOM(this.vdom, parentEl);
			this.isMounted = true;
		} catch (error) {
			console.error("Error mounting functional component:", error);
			finishHooks();
			throw error;
		}
		return this;
	}
	unmount() {
		runCleanupFunctions(this);
		if (this.vdom) {
			destroyDOM(this.vdom);
			this.vdom = null;
		}
		this.isMounted = false;
	}
	updateProps(newProps) {
		this.props = { ...this.props, ...newProps };
		if (newProps && newProps.children && Array.isArray(newProps.children)) {
			this.slotContents = extractSlotContents(newProps.children);
		}
		return this._renderComponent();
	}
	_renderComponent() {
		if (!this.isMounted || !this.parentEl) return;
		try {
			initHooks(this);
			const rawVdom = this.renderFn(this.props);
			finishHooks();
			const newVdom = resolveSlots(rawVdom, this.slotContents);
			this.vdom = patchDOM(this.vdom, newVdom, this.parentEl);
			return this.vdom;
		} catch (error) {
			console.error("Error rendering functional component:", error);
			finishHooks();
			return this.vdom;
		}
	}
}

function destroyDOM(vdom) {
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
function removeTextNode(vdom) {
	const { el } = vdom;
	el.remove();
	vdom.el = null;
}
function removeElementNode(vdom) {
	const { el, listeners, children } = vdom;
	if (listeners) {
		removeEventListeners(listeners, el);
		vdom.listeners = null;
	}
	if (children) {
		children.forEach(destroyDOM);
		vdom.children = null;
	}
	el.remove();
	vdom.el = null;
}
function removeFragmentNodes(vdom) {
	const { children } = vdom;
	if (children) {
		children.forEach(destroyDOM);
		vdom.children = null;
	}
}
function removeComponentNode(vdom) {
	const { instance } = vdom;
	if (instance && typeof instance.unmount === 'function') {
		instance.unmount();
	}
	vdom.instance = null;
	vdom.el = null;
}

class Dispatcher {
	#subs = new Map();
	#afterHandlers = [];
	subscribe(commandName, handler) {
		if (!this.#subs.has(commandName)) {
			this.#subs.set(commandName, []);
		}
		const handlers = this.#subs.get(commandName);
		if (handlers.includes(handler)) {
			return () => {};
		}
		handlers.push(handler);
		return () => {
			const idx = handlers.indexOf(handler);
			handlers.splice(idx, 1);
		};
	}
	afterEveryCommand(handler) {
		this.#afterHandlers.push(handler);
		return () => {
			const idx = this.#afterHandlers.indexOf(handler);
			this.#afterHandlers.splice(idx, 1);
		};
	}
	dispatch(commandName, payload) {
		if (this.#subs.has(commandName)) {
			this.#subs.get(commandName).forEach((handler) => handler(payload));
		} else {
			console.warn(`No handlers for command: ${commandName}`);
		}
		this.#afterHandlers.forEach((handler) => handler());
	}
}

function createApp(config = {}) {
	const { state = {}, view = null, reducers = {} } = config || {};
	let parentEl = null;
	let vdom = null;
	const dispatcher = new Dispatcher();
	const subscriptions = [dispatcher.afterEveryCommand(renderApp)];
	function emit(eventName, payload) {
		dispatcher.dispatch(eventName, payload);
	}
	for (const actionName in reducers) {
		const reducer = reducers[actionName];
		const subs = dispatcher.subscribe(actionName, (payload) => {
			state = reducer(state, payload);
		});
		subscriptions.push(subs);
	}
	function renderApp() {
		if (!view || !parentEl) return;
		const newVdom = view(state, emit);
		vdom = patchDOM(vdom, newVdom, parentEl);
	}
	return {
		mount(vdomOrEl, _parentEl) {
			if (vdomOrEl instanceof HTMLElement && !_parentEl) {
				parentEl = vdomOrEl;
				if (view) {
					vdom = view(state, emit);
					mountDOM(vdom, parentEl);
				}
				return this;
			}
			if (_parentEl instanceof HTMLElement) {
				vdom = vdomOrEl;
				parentEl = _parentEl;
				try {
					mountDOM(vdom, parentEl);
				} catch (error) {
					console.error("Error mounting component:", error);
					parentEl.innerHTML = `
						<div style="color: red; border: 1px solid red; padding: 10px;">
							<h3>Error Mounting Component</h3>
							<p>${error.message}</p>
						</div>
					`;
					throw error;
				}
				return this;
			}
			console.error("Invalid arguments to mount():", {
				vdomOrEl,
				_parentEl,
			});
			throw new Error(
				"Invalid arguments to mount(): Expected a parent element"
			);
		},
		unmount() {
			if (vdom) {
				destroyDOM(vdom);
				vdom = null;
			}
			subscriptions.forEach((unsubscribe) => unsubscribe());
		},
		emit(eventName, payload) {
			emit(eventName, payload);
		},
	};
}

class Component {
  constructor(props = {}, { initialState = {} } = {}) {
    this.props = props;
    this.state = initialState;
    this.vdom = null;
    this.parentEl = null;
    this.isMounted = false;
    this.slotContents = {};
    if (props.children && Array.isArray(props.children)) {
      this.slotContents = extractSlotContents(props.children);
    }
    this._dispatcher = new Dispatcher();
    this._subscriptions = [this._dispatcher.afterEveryCommand(this._renderComponent.bind(this))];
    this.setState = this.setState.bind(this);
    this.emit = this.emit.bind(this);
    this.render = this.render.bind(this);
  }
  setState(stateChange) {
    const newState = typeof stateChange === 'function'
      ? stateChange(this.state)
      : stateChange;
    this.state = { ...this.state, ...newState };
    this._dispatcher.dispatch('state-updated', this.state);
  }
  emit(eventName, payload) {
    this._dispatcher.dispatch(eventName, payload);
  }
  mount(parentEl) {
    this.parentEl = parentEl;
    if (this.beforeMount) {
      this.beforeMount();
    }
    this.vdom = this._renderWithSlots();
    mountDOM(this.vdom, parentEl);
    this.isMounted = true;
    if (this.mounted) {
      this.mounted();
    }
    return this;
  }
  unmount() {
    if (this.beforeUnmount) {
      this.beforeUnmount();
    }
    if (this.vdom) {
      destroyDOM(this.vdom);
      this.vdom = null;
    }
    this._subscriptions.forEach(unsubscribe => unsubscribe());
    this.isMounted = false;
    if (this.unmounted) {
      this.unmounted();
    }
  }
  updateProps(newProps) {
    const oldProps = this.props;
    this.props = { ...this.props, ...newProps };
    if (newProps.children && Array.isArray(newProps.children)) {
      this.slotContents = extractSlotContents(newProps.children);
    }
    if (this.beforeUpdate) {
      this.beforeUpdate(oldProps, this.props);
    }
    this._renderComponent();
    if (this.updated) {
      this.updated(oldProps, this.props);
    }
  }
  _renderWithSlots() {
    const rawVdom = this.render(this.props, this.state, this.emit);
    return resolveSlots(rawVdom, this.slotContents);
  }
  _renderComponent() {
    if (!this.isMounted) return;
    const newVdom = this._renderWithSlots();
    this.vdom = patchDOM(this.vdom, newVdom, this.parentEl);
  }
  render(props, state, emit) {
    throw new Error('Components must implement render method');
  }
}

function lazy(loader, options = {}) {
  const defaultLoading = () => h('div', { style: { padding: '20px', textAlign: 'center' } }, ['Loading...']);
  const defaultError = (error) => h('div', { style: { padding: '20px', color: 'red' } }, [
    h('p', {}, ['Error loading component:']),
    h('pre', { style: { background: '#f5f5f5', padding: '10px' } }, [error.message])
  ]);
  const loadingComponent = options.loading || defaultLoading;
  const errorComponent = options.error || defaultError;
  class LazyComponent extends Component {
    constructor(props) {
      super(props, {
        initialState: {
          status: 'loading',
          Component: null,
          error: null
        }
      });
      this.loadComponent();
    }
    loadComponent() {
      loader()
        .then(module => {
          const ComponentClass = module.default || module;
          this.setState({
            status: 'loaded',
            Component: ComponentClass
          });
        })
        .catch(error => {
          console.error('Failed to load lazy component:', error);
          this.setState({
            status: 'error',
            error
          });
        });
    }
    render(props, state) {
      const { status, Component, error } = state;
      switch (status) {
        case 'loading':
          return typeof loadingComponent === 'function'
            ? createComponent(loadingComponent, {})
            : loadingComponent;
        case 'loaded':
          return createComponent(Component, props);
        case 'error':
          return typeof errorComponent === 'function'
            ? createComponent(errorComponent, { error })
            : errorComponent;
        default:
          return null;
      }
    }
  }
  return (props = {}) => createComponent(LazyComponent, props);
}
function createDelayedComponent(Component, delayMs = 1000) {
  return () => new Promise(resolve => {
    setTimeout(() => resolve(Component), delayMs);
  });
}

function createStore(createState) {
  let state;
  const listeners = new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === 'function'
      ? partial(state)
      : partial;
    if (Object.is(nextState, state)) return;
    state = replace ? nextState : { ...state, ...nextState };
    listeners.forEach(listener => listener(state));
  };
  const destroy = () => {
    listeners.clear();
  };
  const getState = () => state;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  state = createState(setState, getState);
  return {
    getState,
    setState,
    subscribe,
    destroy
  };
}
function connect(store, selector = state => state) {
  return (ComponentClass) => {
    return class ConnectedComponent extends ComponentClass {
      constructor(props) {
        const storeState = store.getState();
        const selectedState = selector(storeState);
        const storeProp = selectedState;
        super(Object.assign({}, props, { store: storeProp }));
        this.lastStoreState = storeState;
        this.lastSelectedState = selectedState;
        this.selector = selector;
        this.unsubscribe = store.subscribe(this.handleStoreChange.bind(this));
      }
      handleStoreChange(newStoreState) {
        if (!this.isMounted) return;
        const newSelectedState = this.selector(newStoreState);
        console.log("Connect: handleStoreChange", {
          component: this.constructor.name,
          areEqual: this.shallowEqual(newSelectedState, this.lastSelectedState),
          newSelectedState,
          lastSelectedState: this.lastSelectedState
        });
        if (this.shallowEqual(newSelectedState, this.lastSelectedState)) {
          return;
        }
        this.lastStoreState = newStoreState;
        this.lastSelectedState = newSelectedState;
        this.updateProps({
          ...this.props,
          store: newSelectedState
        });
      }
      shallowEqual(obj1, obj2) {
        if (obj1 === obj2) return true;
        if (!obj1 || !obj2) return false;
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        if (keys1.length !== keys2.length) return false;
        return keys1.every(key => {
          if (typeof obj1[key] === 'function' && typeof obj2[key] === 'function') {
            return obj1[key].name === obj2[key].name;
          }
          if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
            if (obj1[key].length !== obj2[key].length) {
              console.log(`Array length changed for ${key}: ${obj1[key].length} → ${obj2[key].length}`);
              return false;
            }
            for (let i = 0; i < obj1[key].length; i++) {
              if (obj1[key][i] !== obj2[key][i]) {
                console.log(`Array item ${i} changed for ${key}`);
                return false;
              }
            }
            return true;
          }
          const equal = obj1[key] === obj2[key];
          if (!equal) {
            console.log(`Property ${key} changed:`, obj1[key], obj2[key]);
          }
          return equal;
        });
      }
      beforeUnmount() {
        if (this.unsubscribe) {
          this.unsubscribe();
        }
        if (super.beforeUnmount) {
          super.beforeUnmount();
        }
      }
    };
  };
}
function createActions(store, actions) {
  const boundActions = {};
  for (const key in actions) {
    if (typeof actions[key] === 'function') {
      boundActions[key] = (...args) => {
        const currentState = store.getState();
        const result = actions[key](currentState, ...args);
        if (result && typeof result === 'object') {
          store.setState(result);
        }
        return result;
      };
    }
  }
  return boundActions;
}

export { Component, DOM_TYPES, connect, createActions, createApp, createComponent, createDelayedComponent, createSlot, createSlotContent, createStore, h, hFragment, hString, isDeepEqual, isShallowEqual, lazy, useCallback, useEffect, useMemo, useRef, useState };
