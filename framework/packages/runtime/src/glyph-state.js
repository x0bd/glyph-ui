/**
 * GlyphState - A simple state management solution for GlyphUI
 * Inspired by Zustand's approach of minimal API surface and simplicity
 */

/**
 * Creates a new store with the initial state and actions.
 * 
 * @param {Function} createState - A function that takes a setState function and returns
 *                              an object with the initial state and actions
 * @returns {Object} An object with methods to get, set, subscribe, and destroy the store
 */
export function createStore(createState) {
  // Hold the current state
  let state;
  
  // Subscribers to state changes
  const listeners = new Set();
  
  // Handler for emitting state changes
  const setState = (partial, replace) => {
    // Calculate the next state
    const nextState = typeof partial === 'function' 
      ? partial(state)
      : partial;
    
    // Skip if nextState is identical to current state 
    if (Object.is(nextState, state)) return;
    
    // Replace state or merge with existing state
    state = replace ? nextState : { ...state, ...nextState };
    
    // Notify all listeners of the state change
    listeners.forEach(listener => listener(state));
  };
  
  // Destroy API to clean up the store
  const destroy = () => {
    listeners.clear();
  };
  
  // Get the current state
  const getState = () => state;
  
  // Subscribe to state changes
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  
  // Initialize the store with state and actions
  state = createState(setState, getState);
  
  return {
    getState,
    setState,
    subscribe,
    destroy
  };
}

/**
 * Connects a store to a GlyphUI component.
 * 
 * @param {Object} store - The store created with createStore
 * @param {Function} selector - Optional function to select specific parts of the state
 * @returns {Function} A function that takes a component and returns a new component
 *                    with the store state injected
 */
export function connect(store, selector = state => state) {
  return (ComponentClass) => {
    // Return a wrapper class that extends the original component
    return class ConnectedComponent extends ComponentClass {
      constructor(props) {
        // Get current state from the store before creating component
        const storeState = store.getState();
        const selectedState = selector(storeState);
        
        // Create a store prop with only the selected state and methods
        // IMPORTANT: We use a pure object, not the original store reference
        const storeProp = selectedState;
        
        // Call super with combined props including store prop
        super(Object.assign({}, props, { store: storeProp }));
        
        // Save references for use in update handling
        this.lastStoreState = storeState;
        this.lastSelectedState = selectedState;
        this.selector = selector;
        
        // Subscribe to store changes
        this.unsubscribe = store.subscribe(this.handleStoreChange.bind(this));
      }
      
      // Handle store changes
      handleStoreChange(newStoreState) {
        // Skip updates if component is unmounted
        if (!this.isMounted) return;
        
        // Get the selected slice of state
        const newSelectedState = this.selector(newStoreState);
        
        console.log("Connect: handleStoreChange", {
          component: this.constructor.name,
          areEqual: this.shallowEqual(newSelectedState, this.lastSelectedState),
          newSelectedState,
          lastSelectedState: this.lastSelectedState
        });
        
        // Don't update if nothing changed in the selected state
        // We do a shallow comparison of each property
        if (this.shallowEqual(newSelectedState, this.lastSelectedState)) {
          return;
        }
        
        // Save references for future comparisons
        this.lastStoreState = newStoreState;
        this.lastSelectedState = newSelectedState;
        
        // Update the component with new props
        this.updateProps({
          ...this.props,
          store: newSelectedState
        });
      }
      
      // Helper to compare objects shallowly (better than Object.is)
      shallowEqual(obj1, obj2) {
        // Quick reference equality check
        if (obj1 === obj2) return true;
        
        // Null/undefined check
        if (!obj1 || !obj2) return false;
        
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        
        // Different number of properties
        if (keys1.length !== keys2.length) return false;
        
        // Check each property
        return keys1.every(key => {
          // Special handling for functions - consider them equal if names match
          if (typeof obj1[key] === 'function' && typeof obj2[key] === 'function') {
            return obj1[key].name === obj2[key].name;
          }
          
          // Special handling for arrays
          if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
            // Different length arrays are never equal
            if (obj1[key].length !== obj2[key].length) {
              console.log(`Array length changed for ${key}: ${obj1[key].length} → ${obj2[key].length}`);
              return false;
            }
            
            // Compare each array item by reference (not deep comparison)
            for (let i = 0; i < obj1[key].length; i++) {
              if (obj1[key][i] !== obj2[key][i]) {
                console.log(`Array item ${i} changed for ${key}`);
                return false;
              }
            }
            
            return true;
          }
          
          // Regular property comparison
          const equal = obj1[key] === obj2[key];
          if (!equal) {
            console.log(`Property ${key} changed:`, obj1[key], obj2[key]);
          }
          return equal;
        });
      }
      
      // Clean up subscription when component unmounts
      beforeUnmount() {
        if (this.unsubscribe) {
          this.unsubscribe();
        }
        
        // Call parent beforeUnmount if exists
        if (super.beforeUnmount) {
          super.beforeUnmount();
        }
      }
    };
  };
}

/**
 * Creates a set of actions that can be used to update the store.
 * 
 * @param {Object} store - The store created with createStore
 * @param {Object} actions - An object with action functions
 * @returns {Object} An object with bound actions
 */
export function createActions(store, actions) {
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