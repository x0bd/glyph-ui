import {
  Component,
  createComponent,
  h,
  hFragment,
  hString,
  createStore,
  connect,
  createActions
} from "../../packages/runtime/dist/glyphui.js";

// =======================================================
// Store Definitions
// =======================================================

// Counter Store
const counterStore = createStore((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  incrementBy: (amount) => set((state) => ({ count: state.count + amount }))
}));

// Todo Store
const todoStore = createStore((set) => ({
  todos: [],
  newTodoText: '',
  nextId: 1,
  setNewTodoText: (text) => set({ newTodoText: text }),
  addTodo: () => set((state) => {
    if (!state.newTodoText.trim()) return state;
    
    return {
      todos: [
        ...state.todos,
        {
          id: state.nextId,
          text: state.newTodoText,
          completed: false
        }
      ],
      newTodoText: '',
      nextId: state.nextId + 1
    };
  }),
  toggleTodo: (id) => set((state) => ({
    todos: state.todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  })),
  removeTodo: (id) => set((state) => ({
    todos: state.todos.filter(todo => todo.id !== id)
  })),
  clearCompleted: () => set((state) => ({
    todos: state.todos.filter(todo => !todo.completed)
  }))
}));

// Theme Store
const themeStore = createStore((set) => ({
  theme: {
    color: '#4CAF50',
    name: 'green'
  },
  setTheme: (theme) => set({ theme })
}));

// =======================================================
// Counter Components
// =======================================================

// Counter Display Component
class CounterDisplay extends Component {
  render(props) {
    const { store } = props;
    
    return h('div', { class: 'counter-display' }, [
      h('p', {}, [`Current Count: ${store.count}`])
    ]);
  }
}

// Connect CounterDisplay to counterStore
const ConnectedCounterDisplay = connect(counterStore)(CounterDisplay);

// Counter Controls Component
class CounterControls extends Component {
  render(props) {
    const { store } = props;
    
    return h('div', { class: 'counter' }, [
      h('button', { 
        class: 'decrement',
        on: { click: () => store.decrement() }
      }, ['-']),
      h('div', { class: 'counter-value' }, [store.count.toString()]),
      h('button', { 
        on: { click: () => store.increment() }
      }, ['+']),
      h('button', { 
        class: 'reset',
        on: { click: () => store.reset() }
      }, ['Reset'])
    ]);
  }
}

// Connect CounterControls to counterStore
const ConnectedCounterControls = connect(counterStore)(CounterControls);

// Counter Bonus Component
class CounterBonus extends Component {
  constructor(props) {
    super(props, {
      initialState: {
        bonusAmount: 5
      }
    });
  }
  
  updateBonusAmount(e) {
    const value = parseInt(e.target.value) || 0;
    this.setState({ bonusAmount: value });
  }
  
  render(props, state) {
    const { store } = props;
    
    return h('div', { class: 'counter-bonus' }, [
      h('div', { style: { marginTop: '15px' } }, [
        h('input', { 
          type: 'number',
          value: state.bonusAmount,
          on: { input: (e) => this.updateBonusAmount(e) }
        }),
        h('button', { 
          on: { click: () => store.incrementBy(state.bonusAmount) }
        }, [`Add ${state.bonusAmount}`])
      ])
    ]);
  }
}

// Connect CounterBonus to counterStore
const ConnectedCounterBonus = connect(counterStore)(CounterBonus);

// =======================================================
// Todo Components
// =======================================================

// Todo Input Component
class TodoInput extends Component {
  render(props) {
    const { store } = props;
    
    return h('div', { class: 'todo-input' }, [
      h('input', { 
        type: 'text',
        value: store.newTodoText,
        placeholder: 'Add a new todo...',
        on: { 
          input: (e) => store.setNewTodoText(e.target.value)
        }
      }),
      h('button', { 
        on: { click: () => store.addTodo() }
      }, ['Add Todo'])
    ]);
  }
}

// Connect TodoInput to todoStore
const ConnectedTodoInput = connect(todoStore, (state) => ({
  newTodoText: state.newTodoText,
  setNewTodoText: state.setNewTodoText,
  addTodo: state.addTodo
}))(TodoInput);

// Todo List Component
class TodoList extends Component {
  render(props) {
    const { store } = props;
    const { todos } = store;
    
    // Build an array of elements to render
    const contentElements = [];
    
    // Show "no todos" message or the list
    if (!Array.isArray(todos) || todos.length === 0) {
      contentElements.push(h('p', {}, ['No todos yet. Add some!']));
    } else {
      // Add all the todo items
      todos.forEach(todo => {
        contentElements.push(
          h('div', {
            key: todo.id,
            class: `todo-item ${todo.completed ? 'completed' : ''}`,
            id: `todo-${todo.id}`
          }, [
            // Todo text
            h('span', { 
              style: { cursor: 'pointer' },
              on: { click: () => store.toggleTodo(todo.id) }
            }, [todo.text]),
            
            // Action buttons
            h('div', { class: 'todo-actions' }, [
              h('button', { 
                on: { click: () => store.toggleTodo(todo.id) } 
              }, [todo.completed ? 'Undo' : 'Complete']),
              
              h('button', { 
                class: 'decrement',
                on: { click: () => store.removeTodo(todo.id) } 
              }, ['Remove'])
            ])
          ])
        );
      });
      
      // Add the clear completed button if needed
      if (todos.some(todo => todo.completed)) {
        contentElements.push(
          h('button', {
            style: { marginTop: '10px' },
            on: { click: () => store.clearCompleted() }
          }, ['Clear Completed'])
        );
      }
    }
    
    // Return the main container div with the content
    return h('div', { class: 'todos', id: 'todos-list' }, contentElements);
  }
}

// Connect TodoList to todoStore
const ConnectedTodoList = connect(todoStore)(TodoList);

// =======================================================
// Theme Components
// =======================================================

// Available theme colors
const themeColors = [
  { name: 'green', color: '#4CAF50' },
  { name: 'blue', color: '#2196F3' },
  { name: 'purple', color: '#9C27B0' },
  { name: 'orange', color: '#FF9800' },
  { name: 'red', color: '#f44336' }
];

// Theme Selector Component
class ThemeSelector extends Component {
  render(props) {
    const { store } = props;
    const { theme } = store;
    
    return h('div', { class: 'theme-selector' }, [
      h('p', {}, [`Current theme: ${theme.name}`]),
      h('div', { class: 'color-picker' }, 
        themeColors.map(colorOption => 
          h('div', {
            key: colorOption.name,
            class: `color-swatch ${colorOption.name === theme.name ? 'active' : ''}`,
            style: { backgroundColor: colorOption.color },
            on: { click: () => store.setTheme(colorOption) }
          })
        )
      )
    ]);
  }
}

// Connect ThemeSelector to themeStore
const ConnectedThemeSelector = connect(themeStore)(ThemeSelector);

// Theme Consumer Component
class ThemeConsumer extends Component {
  render(props) {
    const { store } = props;
    const { theme } = store;
    
    return h('div', { 
      style: { 
        marginTop: '10px',
        padding: '15px',
        borderRadius: '4px',
        backgroundColor: theme.color,
        color: 'white'
      } 
    }, [
      h('p', {}, [`This element uses the theme color: ${theme.name}`])
    ]);
  }
}

// Connect ThemeConsumer to themeStore
const ConnectedThemeConsumer = connect(themeStore)(ThemeConsumer);

// =======================================================
// Container Components
// =======================================================

// Counter Container Component
class CounterContainer extends Component {
  render() {
    return h('div', { class: 'counter-container' }, [
      createComponent(ConnectedCounterDisplay),
      createComponent(ConnectedCounterControls),
      createComponent(ConnectedCounterBonus)
    ]);
  }
}

// Todo Container Component
class TodoContainer extends Component {
  render() {
    return h('div', { class: 'todo-container' }, [
      createComponent(ConnectedTodoInput),
      createComponent(ConnectedTodoList)
    ]);
  }
}

// Theme Container Component
class ThemeContainer extends Component {
  render() {
    return h('div', { class: 'theme-container' }, [
      createComponent(ConnectedThemeSelector),
      createComponent(ConnectedThemeConsumer)
    ]);
  }
}

// =======================================================
// Mount Components
// =======================================================

// Mount components to the DOM
const counterContainer = new CounterContainer();
counterContainer.mount(document.getElementById('counter-container'));

const todoContainer = new TodoContainer();
todoContainer.mount(document.getElementById('todo-container'));

const themeContainer = new ThemeContainer();
themeContainer.mount(document.getElementById('theme-container')); 