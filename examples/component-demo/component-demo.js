import { Component, createComponent, h, hFragment } from "../../packages/runtime/dist/glyphui.js";

// Counter component with internal state
class Counter extends Component {
  constructor(props) {
    super(props, {
      initialState: {
        count: props.initialCount || 0
      }
    });
  }
  
  // Lifecycle method called after the component is mounted
  mounted() {
    console.log(`Counter mounted with initial count: ${this.state.count}`);
  }
  
  // Increment counter
  increment() {
    this.setState({ count: this.state.count + 1 });
  }
  
  // Decrement counter
  decrement() {
    this.setState({ count: this.state.count - 1 });
  }
  
  // Reset counter to initial value
  reset() {
    this.setState({ count: this.props.initialCount || 0 });
  }
  
  // Render method returns the virtual DOM representation
  render(props, state) {
    return h('div', { class: 'counter' }, [
      h('h2', {}, [props.title || 'Counter']),
      h('div', { class: 'counter-value' }, [state.count.toString()]),
      h('div', { class: 'counter-actions' }, [
        h('button', { on: { click: () => this.increment() } }, ['Increment']),
        h('button', { on: { click: () => this.decrement() } }, ['Decrement']),
        h('button', { on: { click: () => this.reset() } }, ['Reset'])
      ])
    ]);
  }
}

// Container component that manages multiple counters
class CounterContainer extends Component {
  constructor() {
    super({}, {
      initialState: {
        counters: [
          { id: 1, title: 'Counter 1', initialCount: 0 },
          { id: 2, title: 'Counter 2', initialCount: 10 }
        ]
      }
    });
  }
  
  // Add a new counter
  addCounter() {
    const newId = this.state.counters.length + 1;
    this.setState({
      counters: [
        ...this.state.counters,
        {
          id: newId,
          title: `Counter ${newId}`,
          initialCount: Math.floor(Math.random() * 100)
        }
      ]
    });
  }
  
  // Render method creates multiple counter components
  render(props, state) {
    return h('div', {}, [
      h('h2', {}, ['Counter Container']),
      h('button', { 
        on: { click: () => this.addCounter() }
      }, ['Add Counter']),
      
      // Render each counter component
      ...state.counters.map(counter => 
        createComponent(Counter, {
          key: counter.id,
          title: counter.title,
          initialCount: counter.initialCount
        })
      )
    ]);
  }
}

// Create and mount the main container component
const container = new CounterContainer();
container.mount(document.getElementById('app')); 