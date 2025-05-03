import {
  Component,
  createComponent,
  createSlot,
  createSlotContent,
  h,
  hFragment,
} from "../../packages/runtime/dist/glyphui.js";

/**
 * A reusable card component with slots for header, body, and footer
 */
class Card extends Component {
  render() {
    return h("div", { class: "card" }, [
      h("div", { class: "card-header" }, [
        // Header slot - can be replaced by parent component
        createSlot("header", {}, ["Default Header"])
      ]),
      h("div", { class: "card-body" }, [
        // Default slot for the main content
        createSlot("default", {}, ["Default card content"])
      ]),
      h("div", { class: "card-footer" }, [
        // Footer slot - can be replaced by parent component
        createSlot("footer", {}, ["Default Footer"])
      ])
    ]);
  }
}

/**
 * Alert component with a slot for content
 */
class Alert extends Component {
  render(props) {
    const type = props.type || "info";
    return h("div", { class: `alert alert-${type}` }, [
      // Default slot for alert content
      createSlot()
    ]);
  }
}

/**
 * App component that uses Card and Alert components with slots
 */
class App extends Component {
  constructor() {
    super({}, {
      initialState: {
        showMore: false
      }
    });
  }
  
  toggleShowMore() {
    this.setState({ showMore: !this.state.showMore });
  }
  
  render(props, state) {
    return h("div", {}, [
      // First card with custom header and footer, default body content
      createComponent(Card, {}, [
        // Provide content for the header slot
        createSlotContent("header", [
          h("h2", {}, ["Welcome to Slots Demo"])
        ]),
        // Content for the default slot is just passed as children
        h("p", {}, ["This demonstrates how slots work in GlyphUI."]),
        h("p", {}, ["Slots allow you to customize specific parts of a component."]),
        // Provide content for the footer slot
        createSlotContent("footer", [
          h("div", {}, [
            h("button", { 
              on: { click: () => this.toggleShowMore() }
            }, [
              state.showMore ? "Show Less" : "Show More"
            ])
          ])
        ])
      ]),
      
      // Only show this content when showMore is true
      state.showMore && createComponent(Card, {}, [
        createSlotContent("header", [
          h("h3", {}, ["Additional Information"])
        ]),
        createComponent(Alert, { type: "info" }, [
          h("p", {}, ["Slots are inspired by the Web Components specification."]),
          h("p", {}, ["They provide a flexible way to compose components."])
        ]),
        h("p", {}, [
          "You can have named slots like ", 
          h("code", {}, ["header"]), 
          " and ", 
          h("code", {}, ["footer"]), 
          ", or a default slot for the main content."
        ])
      ]),
      
      // Example of a warning alert
      createComponent(Alert, { type: "warning" }, [
        h("strong", {}, ["Note: "]),
        h("span", {}, ["This is an example of an alert with a warning style."])
      ])
    ]);
  }
}

// Create and mount the app
const app = new App();
app.mount(document.getElementById("app")); 