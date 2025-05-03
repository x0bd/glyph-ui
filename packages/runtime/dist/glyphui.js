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

const COMPONENT_TYPE = "component";
function createComponent(ComponentClass, props = {}, children = []) {
  return {
    type: COMPONENT_TYPE,
    ComponentClass,
    props: { ...props, children },
    instance: null
  };
}
function processComponent(vdom, parentEl, index) {
  const { ComponentClass, props } = vdom;
  const instance = typeof ComponentClass === 'function' && !ComponentClass.prototype.render
    ? new FunctionalComponentWrapper(ComponentClass, props)
    : new ComponentClass(props);
  vdom.instance = instance;
  instance.mount(parentEl);
  return instance;
}
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
  }
  updateProps(newProps) {
    this.props = { ...this.props, ...newProps };
    this.vdom = this.renderFn(this.props);
    return this.vdom;
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

function setAttributes(el, attrs) {
	const { class: className, style, ...otherAttrs } = attrs;
	delete otherAttrs.key;
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
	const { on: oldEvents, ...oldAttributes } = oldAttrs;
	const { on: newEvents, ...newAttributes } = newAttrs;
	for (const name in oldAttributes) {
		if (name === 'key') continue;
		if (!(name in newAttributes)) {
			if (name === 'class') {
				el.className = '';
			} else if (name === 'style') {
				for (const styleName in oldAttributes.style) {
					removeStyle(el, styleName);
				}
			} else {
				removeAttribute(el, name);
			}
		}
	}
	for (const name in newAttributes) {
		if (name === 'key') continue;
		const oldValue = oldAttributes[name];
		const newValue = newAttributes[name];
		if (oldValue !== newValue) {
			if (name === 'class') {
				setClass(el, newValue);
			} else if (name === 'style') {
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

function mountDOM(vdom, parentEl, index) {
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

function patchDOM(oldVdom, newVdom, parentEl, index) {
  if (!oldVdom) {
    mountDOM(newVdom, parentEl, index);
    return newVdom;
  }
  if (!newVdom) {
    destroyDOM(oldVdom);
    return null;
  }
  if (oldVdom.type !== newVdom.type) {
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
  updateAttributes(el, oldVdom.props, newVdom.props);
  updateEventListeners(el, oldVdom, newVdom);
  patchChildren(oldVdom, newVdom);
  return newVdom;
}
function patchComponent(oldVdom, newVdom) {
  const { instance } = oldVdom;
  newVdom.instance = instance;
  newVdom.el = oldVdom.el;
  instance.updateProps(newVdom.props);
  return newVdom;
}
function patchChildren(oldVdom, newVdom) {
  const oldChildren = oldVdom.children || [];
  const newChildren = newVdom.children || [];
  const parentEl = oldVdom.el;
  newVdom.el = parentEl;
  const maxLength = Math.max(oldChildren.length, newChildren.length);
  for (let i = 0; i < maxLength; i++) {
    const oldChild = oldChildren[i];
    const newChild = newChildren[i];
    patchDOM(oldChild, newChild, parentEl, i);
  }
  return newVdom;
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

function createApp({ state, view, reducers = {} }) {
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
		const newVdom = view(state, emit);
		vdom = patchDOM(vdom, newVdom, parentEl);
	}
	return {
		mount(_parentEl) {
			parentEl = _parentEl;
			vdom = view(state, emit);
			mountDOM(vdom, parentEl);
			return this;
		},
		unmount() {
			destroyDOM(vdom);
			vdom = null;
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
    this.vdom = this.render(this.props, this.state, this.emit);
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
    if (this.beforeUpdate) {
      this.beforeUpdate(oldProps, this.props);
    }
    this._renderComponent();
    if (this.updated) {
      this.updated(oldProps, this.props);
    }
  }
  _renderComponent() {
    if (!this.isMounted) return;
    const newVdom = this.render(this.props, this.state, this.emit);
    this.vdom = patchDOM(this.vdom, newVdom, this.parentEl);
  }
  render(props, state, emit) {
    throw new Error('Components must implement render method');
  }
}

export { Component, DOM_TYPES, createApp, createComponent, h, hFragment, hString };
