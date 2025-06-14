import { Component } from "./component.js";
import { createComponent } from "./component-factory.js";
import { h } from "./h.js";

/**
 * Factory function to create a lazy-loaded component.
 * 
 * @param {Function} loader - A function that returns a Promise that resolves to the Component class
 * @param {Object} options - Configuration options for the lazy component
 * @param {Function|Object} options.loading - Loading component or vdom to show while loading
 * @param {Function|Object} options.error - Error component or vdom to show on error
 * @returns {Function} A factory function that creates the lazy component
 */
export function lazy(loader, options = {}) {
  // The default loading component
  const defaultLoading = () => h('div', { style: { padding: '20px', textAlign: 'center' } }, ['Loading...']);
  
  // The default error component
  const defaultError = (error) => h('div', { style: { padding: '20px', color: 'red' } }, [
    h('p', {}, ['Error loading component:']),
    h('pre', { style: { background: '#f5f5f5', padding: '10px' } }, [error.message])
  ]);
  
  // Extract loading and error components from options
  const loadingComponent = options.loading || defaultLoading;
  const errorComponent = options.error || defaultError;
  
  // Create a wrapper component to handle the lazy loading
  class LazyComponent extends Component {
    constructor(props) {
      super(props, {
        initialState: {
          status: 'loading', // 'loading', 'loaded', 'error'
          Component: null,
          error: null
        }
      });
      
      // Start loading the component immediately
      this.loadComponent();
    }
    
    loadComponent() {
      loader()
        .then(module => {
          // Handle both ES modules with default export and direct Component classes
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
  
  // Return a factory function that creates the lazy component
  return (props = {}) => createComponent(LazyComponent, props);
}

/**
 * Creates a delayed component that is useful for testing lazy loading.
 * This simulates network delay by waiting for the specified time before resolving.
 * 
 * @param {Class} Component - The component to delay loading
 * @param {number} delayMs - The delay in milliseconds
 * @returns {Function} A function that returns a Promise that resolves to the Component
 */
export function createDelayedComponent(Component, delayMs = 1000) {
  return () => new Promise(resolve => {
    setTimeout(() => resolve(Component), delayMs);
  });
} 