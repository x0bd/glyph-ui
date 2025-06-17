# Getting Started with GlyphUI

Welcome to GlyphUI! This guide will walk you through setting up a simple GlyphUI application.

## What is GlyphUI?

GlyphUI is a lightweight JavaScript framework for building user interfaces. It is designed to be simple, efficient, and easy to learn. It uses a Virtual DOM to efficiently update the UI, and provides features like components, hooks, and state management to help you build modern web applications.

## Setup

To start using GlyphUI, you just need to include the framework's JavaScript file in your HTML. You can either download it or link to it directly.

Here is a basic HTML structure to get you started:

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>My GlyphUI App</title>
	</head>
	<body>
		<div id="app"></div>
		<script type="module" src="path/to/glyphui.js"></script>
		<script type="module" src="app.js"></script>
	</body>
</html>
```

In this setup:

-   We have a `div` with the id `app`. This will be the root container for our application.
-   We include the `glyphui.js` file. Make sure the path is correct.
-   We include our application's main JavaScript file, `app.js`. It's important to use `type="module"`.

## Your First Component

Now, let's create a simple "Hello, World!" component in `app.js`.

```javascript
import { h, createApp } from "path/to/glyphui.js";

const App = () => {
	return h("div", {}, [h("h1", {}, ["Hello, GlyphUI!"])]);
};

createApp().mount(App, document.getElementById("app"));
```

Let's break this down:

-   We import `h` and `createApp` from `glyphui.js`.
-   `h` is a function to create virtual DOM nodes (elements). The first argument is the tag name, the second is for props (like attributes or event listeners), and the third is an array of child nodes.
-   We define a simple functional component `App` that returns a `div` containing an `h1`.
-   `createApp().mount(App, ...)` initializes the application, takes our main component `App`, and mounts it to the DOM element with the id `app`.

And that's it! You should now see "Hello, GlyphUI!" on your page. You're now ready to start building amazing applications with GlyphUI.
