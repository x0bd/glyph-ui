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
  return (Component) => {
    return class ConnectedComponent extends Component {
      constructor(props) {
        // Initialize with selected state from the store
        const selectedState = selector(store.getState());
        
        // Call super with both props and selected state
        super({ ...props, store: selectedState });
        
        // Keep track of the selected state for updates
        this.selectedState = selectedState;
        
        // Subscribe to store changes
        this.unsubscribe = store.subscribe(storeState => {
          const nextSelectedState = selector(storeState);
          
          // Only update if the selected portion changed
          if (!Object.is(nextSelectedState, this.selectedState)) {
            this.selectedState = nextSelectedState;
            this.updateProps({ ...this.props, store: nextSelectedState });
          }
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