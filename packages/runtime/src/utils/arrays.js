/**
 * it filters out the nulls and undefined values from the given array.
 *
 * @param {any[]} arr the array to filter
 * @returns {any[]} the array without nulls and undefined values
 */
export function withoutNulls(arr) {
	return arr.filter((item) => item != null);
}
