/**
 * Performs a shallow equality check between two objects.
 * Returns true if both objects have the same keys and values,
 * where values are compared with strict equality (===).
 * 
 * @param {Object} obj1 - First object to compare
 * @param {Object} obj2 - Second object to compare
 * @returns {boolean} True if objects are shallowly equal
 */
export function isShallowEqual(obj1, obj2) {
  // Handle null or undefined
  if (obj1 === obj2) return true;
  if (!obj1 || !obj2) return false;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  // Check if both objects have the same number of keys
  if (keys1.length !== keys2.length) return false;
  
  // Check if all keys in obj1 exist in obj2 with the same value
  return keys1.every(key => {
    if (key === 'on') {
      // Special handling for event listeners object
      // Just check if the object exists in both, don't compare functions
      return obj2.hasOwnProperty(key);
    }
    
    // Skip the 'key' special property in shallow comparison
    if (key === 'key') return true;
    
    return Object.prototype.hasOwnProperty.call(obj2, key) && obj1[key] === obj2[key];
  });
}

/**
 * Performs a deep equality check between two objects.
 * Not generally needed for VDOM diffing but useful for testing.
 * 
 * @param {any} obj1 - First object to compare
 * @param {any} obj2 - Second object to compare
 * @returns {boolean} True if objects are deeply equal
 */
export function isDeepEqual(obj1, obj2) {
  // Handle primitives and references
  if (obj1 === obj2) return true;
  
  // Handle null/undefined
  if (!obj1 || !obj2) return false;
  
  // Handle different types
  if (typeof obj1 !== typeof obj2) return false;
  
  // Handle arrays
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;
    return obj1.every((val, idx) => isDeepEqual(val, obj2[idx]));
  }
  
  // Handle objects
  if (typeof obj1 === 'object') {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) return false;
    
    return keys1.every(key => {
      // Skip function comparisons
      if (typeof obj1[key] === 'function' && typeof obj2[key] === 'function') {
        return true;
      }
      
      return Object.prototype.hasOwnProperty.call(obj2, key) && 
             isDeepEqual(obj1[key], obj2[key]);
    });
  }
  
  // Handle other non-matching values
  return false;
} 