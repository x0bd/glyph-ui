// https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes
// https://www.w3.org/TR/SVGTiny12/attributeTable.html#PropertyTable
// https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes
// https://developer.mozilla.org/en-US/docs/Glossary/IDL

/**
 * Sets the attributes of an element.
 *
 * It doesn't remove attributes that are not present in the new attributes,
 * except in the case of the `class` attribute.
 *
 * @param {HTMLElement} el target element
 * @param {import('./h').ElementVNodeProps} attrs attributes to set
 */
export function setAttributes(el, attrs) {
	const { class: className, style, ...otherAttrs } = attrs;

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

function setClass(el, className) {
	el.className = "";

	if (typeof className === "string") {
		el.className = className;
	}

	if (Array.isArray(className)) {
		el.classList.add(...className);
	}
}

export function setStyle(el, name, value) {
	el.style[name] = value;
}

export function removeStyle(el, name) {
	el.style[name] = null;
}

export function setAttributes(el, name, value) {
	if (value == null) {
		removeAttribute(el, name);
	} else if (name.startsWith("data-")) {
		el.setAttribute(name, value);
	} else {
		el[name] = value;
	}
}

export function removeAttribute(el, name) {
	el[name] = null;
	el.removeAttribute(name);
}
