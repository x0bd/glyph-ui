import {
  Component,
  createComponent,
  h,
  hFragment,
  hString,
  lazy,
  createDelayedComponent
} from "../../packages/runtime/dist/glyphui.js";

// =======================================================
// Regular components (would normally be in separate files)
// =======================================================

class HomePage extends Component {
  render() {
    return h('div', { class: 'card' }, [
      h('h2', {}, ['Home']),
      h('p', {}, ['Welcome to the GlyphUI lazy loading demo. Click on the navigation buttons to load different components lazily.']),
      h('p', {}, ['This component was loaded immediately because it\'s the default view.']),
      h('div', { class: 'stats' }, [
        h('h3', {}, ['Statistics']),
        h('ul', {}, [
          h('li', {}, ['Visits: 1,234']),
          h('li', {}, ['Users: 567']),
          h('li', {}, ['Pages: 42'])
        ])
      ])
    ]);
  }
}

class DashboardPage extends Component {
  constructor(props) {
    super(props, {
      initialState: {
        widgets: [
          { id: 1, title: 'Revenue', value: '$12,345', color: '#4CAF50' },
          { id: 2, title: 'Users', value: '891', color: '#2196F3' },
          { id: 3, title: 'Conversion', value: '3.2%', color: '#FFC107' },
          { id: 4, title: 'Bounce Rate', value: '42%', color: '#F44336' }
        ]
      }
    });
  }
  
  render(props, state) {
    return h('div', { class: 'card' }, [
      h('h2', {}, ['Dashboard']),
      h('p', {}, ['This dashboard component was loaded lazily!']),
      h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '10px' } }, 
        state.widgets.map(widget => 
          h('div', { 
            key: widget.id,
            style: { 
              padding: '15px', 
              borderRadius: '4px',
              backgroundColor: widget.color,
              color: 'white',
              width: '45%'
            } 
          }, [
            h('h3', {}, [widget.title]),
            h('div', { style: { fontSize: '24px', fontWeight: 'bold' } }, [widget.value])
          ])
        )
      )
    ]);
  }
}

class ProfilePage extends Component {
  constructor(props) {
    super(props, {
      initialState: {
        user: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          role: 'Administrator',
          joined: 'January 15, 2023'
        }
      }
    });
  }
  
  render(props, state) {
    const { user } = state;
    
    return h('div', { class: 'card' }, [
      h('h2', {}, ['User Profile']),
      h('p', {}, ['This profile component was loaded lazily when you clicked the Profile button.']),
      h('div', { style: { marginTop: '20px' } }, [
        h('div', { style: { display: 'flex', alignItems: 'center', marginBottom: '20px' } }, [
          h('div', { 
            style: { 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              backgroundColor: '#2196F3',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              marginRight: '15px'
            } 
          }, [user.name.charAt(0)]),
          h('div', {}, [
            h('h3', { style: { margin: '0 0 5px 0' } }, [user.name]),
            h('p', { style: { margin: '0', color: '#666' } }, [user.role])
          ])
        ]),
        h('div', { style: { marginTop: '10px' } }, [
          h('p', {}, [`Email: ${user.email}`]),
          h('p', {}, [`Joined: ${user.joined}`])
        ])
      ])
    ]);
  }
}

class SettingsPage extends Component {
  constructor(props) {
    super(props, {
      initialState: {
        notifications: true,
        darkMode: false,
        autoSave: true
      }
    });
  }
  
  toggleSetting(setting) {
    this.setState({ [setting]: !this.state[setting] });
  }
  
  render(props, state) {
    return h('div', { class: 'card' }, [
      h('h2', {}, ['Settings']),
      h('p', {}, ['This settings component was loaded lazily when you clicked the Settings button.']),
      h('div', { style: { marginTop: '20px' } }, [
        h('div', { class: 'setting' }, [
          h('label', {}, [
            h('input', { 
              type: 'checkbox', 
              checked: state.notifications,
              on: { change: () => this.toggleSetting('notifications') }
            }),
            hString(' Enable notifications')
          ])
        ]),
        h('div', { class: 'setting' }, [
          h('label', {}, [
            h('input', { 
              type: 'checkbox', 
              checked: state.darkMode,
              on: { change: () => this.toggleSetting('darkMode') }
            }),
            hString(' Dark mode')
          ])
        ]),
        h('div', { class: 'setting' }, [
          h('label', {}, [
            h('input', { 
              type: 'checkbox', 
              checked: state.autoSave,
              on: { change: () => this.toggleSetting('autoSave') }
            }),
            hString(' Auto-save')
          ])
        ])
      ]),
      h('button', { 
        style: { marginTop: '20px' },
        on: { click: () => alert('Settings saved!') }
      }, ['Save Settings'])
    ]);
  }
}

// =======================================================
// Custom loading component
// =======================================================

class CustomLoadingComponent extends Component {
  constructor(props) {
    super(props, {
      initialState: { dots: 1 }
    });
    
    // Update the loading animation
    this.interval = setInterval(() => {
      this.setState({ dots: (this.state.dots % 3) + 1 });
    }, 300);
  }
  
  beforeUnmount() {
    // Clean up the interval when component is unmounted
    clearInterval(this.interval);
  }
  
  render() {
    const { dots } = this.state;
    const dotsStr = '.'.repeat(dots);
    
    return h('div', { 
      style: { 
        padding: '30px', 
        textAlign: 'center',
        background: '#f9f9f9',
        borderRadius: '4px',
        margin: '20px 0' 
      } 
    }, [
      h('div', { style: { fontSize: '20px', marginBottom: '10px' } }, [`Loading${dotsStr}`]),
      h('div', { 
        style: { 
          height: '4px', 
          width: '100%', 
          backgroundColor: '#eee',
          borderRadius: '2px',
          overflow: 'hidden'
        } 
      }, [
        h('div', { 
          style: { 
            height: '100%', 
            width: `${(dots / 3) * 100}%`, 
            backgroundColor: '#4CAF50',
            transition: 'width 0.3s ease-in-out'
          } 
        })
      ])
    ]);
  }
}

// =======================================================
// Main Application
// =======================================================

class App extends Component {
  constructor() {
    super({}, {
      initialState: {
        currentPage: 'home',
        useCustomLoading: true,
        loadingDelay: 1500
      }
    });
    
    // Create the lazy components with the current settings
    this.initializeLazyComponents();
  }
  
  initializeLazyComponents() {
    const { useCustomLoading, loadingDelay } = this.state;
    
    // Create loading options
    const loadingOptions = useCustomLoading 
      ? { loading: CustomLoadingComponent }
      : {};
    
    // Create lazy components
    this.lazyComponents = {
      home: () => createComponent(HomePage),
      dashboard: lazy(createDelayedComponent(DashboardPage, loadingDelay), loadingOptions),
      profile: lazy(createDelayedComponent(ProfilePage, loadingDelay), loadingOptions),
      settings: lazy(createDelayedComponent(SettingsPage, loadingDelay), loadingOptions)
    };
  }
  
  updateSettings(useCustomLoading, loadingDelay) {
    this.setState({ 
      useCustomLoading, 
      loadingDelay,
      // Reset to home when changing settings
      currentPage: 'home'
    });
    
    // Reinitialize the lazy components with new settings
    this.initializeLazyComponents();
  }
  
  navigateTo(page) {
    this.setState({ currentPage: page });
    
    // Update active button
    document.querySelectorAll('.nav button').forEach(btn => {
      btn.classList.remove('active');
    });
    document.getElementById(`${page}-btn`).classList.add('active');
  }
  
  render(props, state) {
    const { currentPage } = state;
    
    // Get the component for the current page
    const CurrentPage = this.lazyComponents[currentPage];
    
    return h('div', {}, [
      createComponent(CurrentPage)
    ]);
  }
}

// =======================================================
// Mount the application and set up event listeners
// =======================================================

const app = new App();
app.mount(document.getElementById('content'));

// Set up navigation button listeners
document.getElementById('home-btn').addEventListener('click', () => app.navigateTo('home'));
document.getElementById('dashboard-btn').addEventListener('click', () => app.navigateTo('dashboard'));
document.getElementById('profile-btn').addEventListener('click', () => app.navigateTo('profile'));
document.getElementById('settings-btn').addEventListener('click', () => app.navigateTo('settings'));

// Set up settings button listener
document.getElementById('apply-settings').addEventListener('click', () => {
  const useCustomLoading = document.getElementById('custom-loading').checked;
  const loadingDelay = parseInt(document.getElementById('loading-delay').value, 10);
  app.updateSettings(useCustomLoading, loadingDelay);
}); 