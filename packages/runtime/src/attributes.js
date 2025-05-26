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
 * @param {object} attrs attributes to set
 */
export function setAttributes(el, attrs) {
	const { class: className, style, ref, ...otherAttrs } = attrs;

	// Delete the "key" property if it exists
	delete otherAttrs.key;

	// Handle the ref attribute if provided
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

/**
 * Sets the attribute on the element.
 *
 * @param {Element} el The element to add the attribute to
 * @param {string} name The name of the attribute
 * @param {(string|number|null)} value The value of the attribute
 */
export function setAttribute(el, name, value) {
	if (value == null) {
		removeAttribute(el, name);
	} else if (name.startsWith("data-")) {
		el.setAttribute(name, value);
	} else {
		el[name] = value;
	}
}

/**
 * Removes the attribute from the element.
 *
 * @param {Element} el the element where the attribute is set
 * @param {string} name name of the attribute
 */
export function removeAttribute(el, name) {
	try {
		el[name] = null;
	} catch {
		// Setting 'size' to null on an <input> throws an error.
		// Removing the attribute instead works. (Done below.)
		console.warn(`Failed to set "${name}" to null on ${el.tagName}`);
	}

	el.removeAttribute(name);
}

export function setStyle(el, name, value) {
	el.style[name] = value;
}

export function removeStyle(el, name) {
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

/**
 * Updates the attributes of an element by comparing old and new attributes.
 * Removes attributes that are not present in the new attributes,
 * updates attributes that have changed, and adds new attributes.
 *
 * @param {HTMLElement} el - The element to update attributes on
 * @param {Object} oldAttrs - The old attributes object
 * @param {Object} newAttrs - The new attributes object
 */
export function updateAttributes(el, oldAttrs = {}, newAttrs = {}) {
	const { on: oldEvents, ref: oldRef, ...oldAttributes } = oldAttrs;
	const { on: newEvents, ref: newRef, ...newAttributes } = newAttrs;

	// Handle ref attribute if changed
	if (newRef && typeof newRef === "function" && newRef !== oldRef) {
		newRef(el);
	}

	// Handle removed attributes
	for (const name in oldAttributes) {
		// Skip event handlers and special props like 'key'
		if (name === "key") continue;

		// If attribute doesn't exist in new set, remove it
		if (!(name in newAttributes)) {
			if (name === "class") {
				el.className = "";
			} else if (name === "style") {
				// Remove all styles
				for (const styleName in oldAttributes.style) {
					removeStyle(el, styleName);
				}
			} else {
				removeAttribute(el, name);
			}
		}
	}

	// Set new or changed attributes
	for (const name in newAttributes) {
		// Skip event handlers and special props
		if (name === "key") continue;

		const oldValue = oldAttributes[name];
		const newValue = newAttributes[name];

		// Only update if values are different
		if (oldValue !== newValue) {
			if (name === "class") {
				setClass(el, newValue);
			} else if (name === "style") {
				// Handle style updates
				const oldStyles = oldAttributes.style || {};

				// Remove styles not in new set
				for (const styleName in oldStyles) {
					if (!(styleName in newValue)) {
						removeStyle(el, styleName);
					}
				}

				// Set new styles
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
