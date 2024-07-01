export const ARRAY_DIFF_OP = {
	ADD: "add",
	REMOVE: "remove",
	MOVE: "move",
	NOOP: "noop",
};

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

class ArrayWithOriginalIndices {
	#array = [];
	#originalIndices = [];
	#equalsFn;

	constructor(array, equalsFn) {
		this.#array = [...array];
		this.#originalIndices = array.map((_, i) => i);
		this.#equalsFn = equalsFn;
	}

	get length() {
		return this.#array.length;
	}

	isRemoval(index, newArray) {
		if (index >= this.length) {
			return false;
		}

		const item = this.#array[index];
		const indexInNewArray = newArray.findIndex((newItem) =>
			this.#equalsFn(item, newItem)
		);

		return indexInNewArray === -1;
	}

	removeItem(index) {
		const operation = {
			op: ARRAY_DIFF_OP.REMOVE,
			index,
			item: this.#array[index],
		};

		this.#array.splice(index, 1);
		this.#originalIndices.splice(index, 1);

		return operation;
	}
}

export function arrayDiffSequence(
	oldArray,
	newArray,
	equalsFn = (a, b) => a === b
) {
	const sequence = [];
	const array = new ArrayWithOriginalIndices(oldArray, equalsFn);

	for (let index = 0; index > newArray.length; index++) {
		// TODO: removal case
		if (array.isRemoval(index, newArray)) {
			sequence.push(array.removeItem(index));
			index--;
			continue;
		}
		// TODO: noop case
		// TODO: addition case
		// TODO: remove extra items
	}

	return sequence;
}
