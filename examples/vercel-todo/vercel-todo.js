import {
  Component,
  createComponent,
  h,
  createStore,
  connect
} from "../../packages/runtime/dist/glyphui.js";

// =======================================================
// Store Definitions
// =======================================================

// Theme Store
const themeStore = createStore((set) => ({
  isDark: window.matchMedia('(prefers-color-scheme: dark)').matches, // Default to system preference
  toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
}));

// Todo Store with enhanced features
const todoStore = createStore((set) => ({
  todos: [],
  newTodoText: '',
  filter: 'all', // 'all', 'active', 'completed'
  nextId: 1,

  // Input actions
  setNewTodoText: (text) => set({ newTodoText: text }),
  
  // Todo manipulation actions
  addTodo: () => set((state) => {
    if (!state.newTodoText.trim()) return state;
    
    return {
      todos: [
        ...state.todos,
        {
          id: state.nextId,
          text: state.newTodoText,
          completed: false,
          createdAt: Date.now()
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
  
  // Batch actions
  clearCompleted: () => set((state) => ({
    todos: state.todos.filter(todo => !todo.completed)
  })),
  
  // Filter actions
  setFilter: (filter) => set({ filter }),
  
  // Computed properties (not stored in state, but calculated on access)
  getFilteredTodos: (state) => {
    switch (state.filter) {
      case 'active':
        return state.todos.filter(todo => !todo.completed);
      case 'completed':
        return state.todos.filter(todo => todo.completed);
      default:
        return state.todos;
    }
  },
  
  getStats: (state) => {
    const total = state.todos.length;
    const completed = state.todos.filter(todo => todo.completed).length;
    const active = total - completed;
    
    return { total, completed, active };
  }
}));

// =======================================================
// Components
// =======================================================

// Theme Toggle Component
class ThemeToggle extends Component {
  render(props) {
    const { store } = props;
    
    // Update document theme when isDark changes
    if (store.isDark) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
    
    return h('button', {
      class: 'theme-toggle',
      on: { click: () => store.toggleTheme() }
    }, [
      store.isDark ? '☀️' : '🌙'
    ]);
  }
}

// Connect ThemeToggle to themeStore
const ConnectedThemeToggle = connect(themeStore)(ThemeToggle);

// Todo Input Component
class TodoInput extends Component {
  constructor(props) {
    super(props);
    this.inputRef = null;
  }
  
  setInputRef(el) {
    this.inputRef = el;
    // Auto-focus the input when component mounts
    if (el) {
      setTimeout(() => el.focus(), 0);
    }
  }
  
  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.props.store.addTodo();
      
      // Refocus the input after adding
      if (this.inputRef) {
        setTimeout(() => this.inputRef.focus(), 0);
      }
    }
  }
  
  render(props) {
    const { store } = props;
    
    return h('div', { class: 'todo-input' }, [
      h('input', { 
        type: 'text',
        value: store.newTodoText,
        placeholder: 'What needs to be done?',
        ref: (el) => this.setInputRef(el),
        on: { 
          input: (e) => store.setNewTodoText(e.target.value),
          keydown: (e) => this.handleKeyDown(e)
        }
      }),
      h('button', { 
        on: { click: () => store.addTodo() }
      }, ['Add'])
    ]);
  }
}

// Connect TodoInput to todoStore
const ConnectedTodoInput = connect(todoStore, (state) => ({
  newTodoText: state.newTodoText,
  setNewTodoText: state.setNewTodoText,
  addTodo: state.addTodo
}))(TodoInput);

// TodoItem Component
class TodoItem extends Component {
  render(props) {
    const { todo, toggleTodo, removeTodo } = props;
    
    return h('div', {
      class: `todo-item ${todo.completed ? 'completed' : ''}`,
      key: todo.id
    }, [
      h('div', { class: 'todo-checkbox' }, [
        h('input', {
          type: 'checkbox',
          checked: todo.completed,
          id: `todo-${todo.id}`,
          on: { change: () => toggleTodo(todo.id) }
        }),
        h('label', { 
          for: `todo-${todo.id}`,
          on: { click: (e) => e.preventDefault() } // Prevent double toggle
        }, [todo.text])
      ]),
      h('div', { class: 'todo-actions' }, [
        h('button', {
          class: 'secondary small',
          on: { click: () => removeTodo(todo.id) }
        }, ['Remove'])
      ])
    ]);
  }
}

// TodoList Component
class TodoList extends Component {
  render(props) {
    const { store } = props;
    const filteredTodos = store.getFilteredTodos(store);
    const stats = store.getStats(store);
    
    const content = [];
    
    // Show todos or empty state
    if (filteredTodos.length === 0) {
      if (store.todos.length === 0) {
        content.push(
          h('div', { 
            style: { 
              textAlign: 'center', 
              padding: '20px',
              color: 'var(--text-secondary)'
            } 
          }, ['No tasks yet. Add your first task above!'])
        );
      } else {
        content.push(
          h('div', { 
            style: { 
              textAlign: 'center', 
              padding: '20px',
              color: 'var(--text-secondary)'
            } 
          }, [`No ${store.filter} tasks found.`])
        );
      }
    } else {
      // Create a container for the todo items
      const todoItems = h('div', { class: 'todos' }, 
        filteredTodos.map(todo => 
          h('div', {
            class: `todo-item ${todo.completed ? 'completed' : ''}`,
            key: todo.id
          }, [
            h('div', { class: 'todo-checkbox' }, [
              h('input', {
                type: 'checkbox',
                checked: todo.completed,
                id: `todo-${todo.id}`,
                on: { change: () => store.toggleTodo(todo.id) }
              }),
              h('label', { 
                for: `todo-${todo.id}`
              }, [todo.text])
            ]),
            h('div', { class: 'todo-actions' }, [
              h('button', {
                class: 'secondary small',
                on: { click: () => store.removeTodo(todo.id) }
              }, ['Remove'])
            ])
          ])
        )
      );
      
      content.push(todoItems);
    }
    
    // Add filter controls and stats
    content.push(
      h('div', { class: 'stats' }, [
        h('div', {}, [
          `${stats.active} active, ${stats.completed} completed`
        ]),
        h('div', { 
          style: { 
            display: 'flex',
            gap: '8px'
          } 
        }, [
          stats.completed > 0 ? 
            h('button', {
              class: 'secondary small',
              on: { click: () => store.clearCompleted() }
            }, ['Clear completed']) : null
        ])
      ])
    );
    
    // Add filter tabs above the todo list
    const filterTabs = h('div', { 
      style: { 
        display: 'flex',
        gap: '8px',
        marginBottom: '16px'
      } 
    }, [
      ['all', 'active', 'completed'].map(filter => 
        h('button', {
          class: `secondary small ${store.filter === filter ? 'active' : ''}`,
          style: {
            opacity: store.filter === filter ? 1 : 0.7,
            borderColor: store.filter === filter ? 'var(--accent-color)' : 'var(--border-color)'
          },
          on: { click: () => store.setFilter(filter) }
        }, [filter.charAt(0).toUpperCase() + filter.slice(1)])
      )
    ]);
    
    // Return everything wrapped in a container
    return h('div', { class: 'todos-container' }, [
      filterTabs,
      ...content
    ]);
  }
}

// Connect TodoList to todoStore
const ConnectedTodoList = connect(todoStore)(TodoList);

// Main App Component
class TodoApp extends Component {
  render() {
    return h('div', { class: 'todo-app' }, [
      createComponent(ConnectedTodoInput),
      createComponent(ConnectedTodoList)
    ]);
  }
}

// =======================================================
// Mount Components
// =======================================================

// Replace theme toggle button
const themeToggle = new ConnectedThemeToggle();
themeToggle.mount(document.getElementById('theme-toggle').parentNode, document.getElementById('theme-toggle'));
document.getElementById('theme-toggle').remove();

// Mount the todo app
const todoApp = new TodoApp();
todoApp.mount(document.getElementById('app-container')); 