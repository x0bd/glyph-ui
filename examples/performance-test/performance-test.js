import {
  Component,
  createComponent,
  h,
  hFragment,
  hString,
} from "../../packages/runtime/dist/glyphui.js";

// Helper functions
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function measureTime(callback) {
  const start = performance.now();
  callback();
  return performance.now() - start;
}

// =======================================================
// Keyed List Performance Test
// =======================================================

class KeyedListComponent extends Component {
  constructor() {
    super({}, {
      initialState: {
        items: [],
        useKeys: true,
      }
    });
  }

  addItems(count = 100) {
    const { items } = this.state;
    const newItems = [...items];
    
    for (let i = 0; i < count; i++) {
      newItems.push({
        id: items.length + i,
        text: `Item ${items.length + i}`,
        color: `hsl(${randomInt(0, 360)}, 70%, 80%)`,
      });
    }
    
    this.setState({ items: newItems });
  }

  updateRandomItems(count = 10) {
    const { items } = this.state;
    if (items.length === 0) return;
    
    const newItems = [...items];
    const updatedIndexes = new Set();
    
    // Update random items
    for (let i = 0; i < Math.min(count, items.length); i++) {
      let idx;
      do {
        idx = randomInt(0, items.length - 1);
      } while (updatedIndexes.has(idx));
      
      updatedIndexes.add(idx);
      newItems[idx] = {
        ...newItems[idx],
        text: `Updated Item ${newItems[idx].id}`,
        color: `hsl(${randomInt(0, 360)}, 70%, 80%)`,
      };
    }
    
    this.setState({ items: newItems });
  }

  shuffleItems() {
    const { items } = this.state;
    if (items.length === 0) return;
    
    this.setState({ items: shuffleArray(items) });
  }

  removeRandomItems(count = 10) {
    const { items } = this.state;
    if (items.length === 0) return;
    
    const newItems = [...items];
    const removeCount = Math.min(count, items.length);
    
    for (let i = 0; i < removeCount; i++) {
      const idx = randomInt(0, newItems.length - 1);
      newItems.splice(idx, 1);
    }
    
    this.setState({ items: newItems });
  }

  resetItems() {
    this.setState({ items: [] });
  }

  toggleKeys() {
    this.setState({ useKeys: !this.state.useKeys });
  }

  renderItem(item) {
    const { useKeys } = this.state;
    const props = useKeys ? { key: item.id, style: { backgroundColor: item.color } } : { style: { backgroundColor: item.color } };
    
    return h('div', { ...props, class: 'item' }, [
      h('span', {}, [item.text]),
      h('button', { 
        class: 'delete', 
        on: { 
          click: () => {
            this.setState({ 
              items: this.state.items.filter(i => i.id !== item.id) 
            });
          }
        }
      }, ['Delete'])
    ]);
  }

  render(props, state) {
    const { items, useKeys } = state;
    
    return h('div', {}, [
      h('div', { class: 'toggle-container' }, [
        h('label', {}, [
          h('input', { 
            type: 'checkbox', 
            checked: useKeys,
            on: { change: () => this.toggleKeys() }
          }),
          hString(' Use keys')
        ]),
        h('span', { style: { marginLeft: '10px' } }, [
          `Currently ${useKeys ? 'using' : 'not using'} keys`
        ])
      ]),
      ...items.map(item => this.renderItem(item))
    ]);
  }
}

// =======================================================
// Optimized Diffing Test
// =======================================================

class DiffingTestComponent extends Component {
  constructor() {
    super({}, {
      initialState: {
        count: 0,
        items: [],
        renderedTimes: 0
      }
    });
  }

  renderUnchanged() {
    // This should be virtually free with optimized diffing
    const time = measureTime(() => {
      // Force a re-render with the same state
      this.setState({ renderedTimes: this.state.renderedTimes + 1 });
    });
    
    document.getElementById('diffing-result').textContent = 
      `Render unchanged took: ${time.toFixed(2)}ms`;
  }

  renderChangedProps() {
    // This should only update the props that changed
    const time = measureTime(() => {
      this.setState({ 
        count: this.state.count + 1,
        renderedTimes: this.state.renderedTimes + 1
      });
    });
    
    document.getElementById('diffing-result').textContent = 
      `Render changed props took: ${time.toFixed(2)}ms`;
  }

  renderChangedStructure() {
    // This should rebuild part of the DOM
    const time = measureTime(() => {
      const newItems = [];
      const count = randomInt(1, 10);
      
      for (let i = 0; i < count; i++) {
        newItems.push({
          id: i,
          value: `New Value ${i}`
        });
      }
      
      this.setState({ 
        items: newItems,
        renderedTimes: this.state.renderedTimes + 1
      });
    });
    
    document.getElementById('diffing-result').textContent = 
      `Render changed structure took: ${time.toFixed(2)}ms`;
  }

  resetDiffing() {
    this.setState({
      count: 0,
      items: [],
      renderedTimes: 0
    });
    
    document.getElementById('diffing-result').textContent = '';
  }

  render(props, state) {
    const { count, items, renderedTimes } = state;
    
    // Build a complex structure that would benefit from optimized diffing
    return h('div', {}, [
      h('div', { class: 'stats' }, [
        h('p', {}, [`Count: ${count}`]),
        h('p', {}, [`Rendered Times: ${renderedTimes}`])
      ]),
      h('div', { class: 'list-container' }, [
        items.length === 0
          ? h('p', {}, ['No items yet. Click "Render Changed Structure" to add some.'])
          : h('div', {}, items.map(item => 
              h('div', { key: item.id, class: 'item' }, [item.value])
            ))
      ])
    ]);
  }
}

// =======================================================
// Setup and mount components
// =======================================================

// Set up the keyed list test
const keyedListComponent = new KeyedListComponent();
keyedListComponent.mount(document.getElementById('keyed-list'));

document.getElementById('add-items').addEventListener('click', () => {
  const { items, useKeys } = keyedListComponent.state;
  const startLabel = `Adding 100 items (${useKeys ? 'with' : 'without'} keys, ${items.length} existing)`;
  console.time(startLabel);
  
  keyedListComponent.addItems();
  
  console.timeEnd(startLabel);
  document.getElementById('keyed-result').textContent = 
    `Added 100 items (${useKeys ? 'with' : 'without'} keys): See console for timing`;
});

document.getElementById('update-items').addEventListener('click', () => {
  const { items, useKeys } = keyedListComponent.state;
  if (items.length === 0) {
    document.getElementById('keyed-result').textContent = 'Add items first';
    return;
  }
  
  const startLabel = `Updating 10 items (${useKeys ? 'with' : 'without'} keys, ${items.length} total)`;
  console.time(startLabel);
  
  keyedListComponent.updateRandomItems();
  
  console.timeEnd(startLabel);
  document.getElementById('keyed-result').textContent = 
    `Updated 10 items (${useKeys ? 'with' : 'without'} keys): See console for timing`;
});

document.getElementById('shuffle-items').addEventListener('click', () => {
  const { items, useKeys } = keyedListComponent.state;
  if (items.length === 0) {
    document.getElementById('keyed-result').textContent = 'Add items first';
    return;
  }
  
  const startLabel = `Shuffling ${items.length} items (${useKeys ? 'with' : 'without'} keys)`;
  console.time(startLabel);
  
  keyedListComponent.shuffleItems();
  
  console.timeEnd(startLabel);
  document.getElementById('keyed-result').textContent = 
    `Shuffled ${items.length} items (${useKeys ? 'with' : 'without'} keys): See console for timing`;
});

document.getElementById('remove-items').addEventListener('click', () => {
  const { items, useKeys } = keyedListComponent.state;
  if (items.length === 0) {
    document.getElementById('keyed-result').textContent = 'Add items first';
    return;
  }
  
  const startLabel = `Removing 10 items (${useKeys ? 'with' : 'without'} keys, ${items.length} total)`;
  console.time(startLabel);
  
  keyedListComponent.removeRandomItems();
  
  console.timeEnd(startLabel);
  document.getElementById('keyed-result').textContent = 
    `Removed 10 items (${useKeys ? 'with' : 'without'} keys): See console for timing`;
});

document.getElementById('reset-items').addEventListener('click', () => {
  keyedListComponent.resetItems();
  document.getElementById('keyed-result').textContent = '';
});

// Set up the diffing test
const diffingTestComponent = new DiffingTestComponent();
diffingTestComponent.mount(document.getElementById('diffing-container'));

document.getElementById('render-unchanged').addEventListener('click', () => {
  diffingTestComponent.renderUnchanged();
});

document.getElementById('render-changed-props').addEventListener('click', () => {
  diffingTestComponent.renderChangedProps();
});

document.getElementById('render-changed-structure').addEventListener('click', () => {
  diffingTestComponent.renderChangedStructure();
});

document.getElementById('reset-diffing').addEventListener('click', () => {
  diffingTestComponent.resetDiffing();
}); 