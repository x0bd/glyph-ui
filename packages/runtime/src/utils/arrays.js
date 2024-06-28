export function toArray(maybeArray) {
	return Array.isArray(maybeArray) ? maybeArray : [maybeArray];
}

export function withoutNulls(arr) {
	return arr.filter((item) => item != null);
}

export function arraysDiff(oldArray, newArray) {
	return {
		added: newArray.filter((newItem) => !oldArray.includes(newItem)),
		removed: oldArray.filter((oldItem) => !newArray.includes(oldItem)),
	};
}
