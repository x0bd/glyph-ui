// import { createApp, h, hFragment } from "https://unpkg.com/glyphui@1.2.0";
import {
	Component,
	createComponent,
	h,
	hFragment,
	hString,
} from "./../../packages/runtime/dist/glyphui.js";

class TodoApp extends Component {
	constructor() {
		super({}, {
			initialState: {
				currentTodo: "",
				edit: {
					id: null,
					original: null,
					edited: null,
				},
				nextId: 3, // Starting ID for new todos
				todos: [
					{ id: 0, text: "watch OOP vs FP video" },
					{ id: 1, text: "feed the cat" },
					{ id: 2, text: "publish framework" }
				],
			}
		});
	}

	updateCurrentTodo(currentTodo) {
		this.setState({ currentTodo });
	}

	addTodo() {
		const newTodo = {
			id: this.state.nextId,
			text: this.state.currentTodo
		};

		this.setState({
			currentTodo: "",
			nextId: this.state.nextId + 1,
			todos: [...this.state.todos, newTodo],
		});
	}

	startEditingTodo(id) {
		const todo = this.state.todos.find(todo => todo.id === id);
		
		this.setState({
			edit: {
				id,
				original: todo.text,
				edited: todo.text,
			},
		});
	}

	editTodo(edited) {
		this.setState({
			edit: { ...this.state.edit, edited },
		});
	}

	saveEditedTodo() {
		const todos = this.state.todos.map(todo => {
			if (todo.id === this.state.edit.id) {
				return { ...todo, text: this.state.edit.edited };
			}
			return todo;
		});

		this.setState({
			edit: { id: null, original: null, edited: null },
			todos,
		});
	}

	cancelEditingTodo() {
		this.setState({
			edit: { id: null, original: null, edited: null },
		});
	}

	removeTodo(id) {
		this.setState({
			todos: this.state.todos.filter(todo => todo.id !== id),
		});
	}

	render(props, state) {
		return hFragment([
			this.renderCreateTodo(state),
			this.renderTodoList(state)
		]);
	}

	renderCreateTodo(state) {
		const { currentTodo } = state;
		return h("div", { class: "main" }, [
			h("label", { for: "todo-input" }, ["new todo"]),
			h("input", {
				type: "text",
				id: "todo-input",
				value: currentTodo,
				on: {
					input: ({ target }) => this.updateCurrentTodo(target.value),
					keydown: ({ key }) => {
						if (key === "Enter" && currentTodo.length >= 3) {
							this.addTodo();
						}
					},
				},
			}),
			h(
				"button",
				{
					disabled: currentTodo.length < 3,
					on: { click: () => this.addTodo() },
				},
				["Add"]
			),
		]);
	}

	renderTodoList(state) {
		const { todos, edit } = state;
		return h(
			"div",
			{ class: "todo-list" },
			todos.map(todo => this.renderTodoItem(todo, edit))
		);
	}

	renderTodoItem(todo, edit) {
		const isEditing = edit.id === todo.id;

		return isEditing
			? h("div", { key: todo.id, class: "todo-item" }, [
					h("input", {
						value: edit.edited,
						on: {
							input: ({ target }) => this.editTodo(target.value),
						},
					}),
					h("button", { on: { click: () => this.saveEditedTodo() } }, [
						"Save",
					]),
					h(
						"button",
						{ on: { click: () => this.cancelEditingTodo() } },
						["Cancel"]
					),
				])
			: h("div", { key: todo.id, class: "todo-item" }, [
					hString("•"),
					h(
						"span",
						{ on: { dblclick: () => this.startEditingTodo(todo.id) } },
						[todo.text]
					),
					h("button", { on: { click: () => this.removeTodo(todo.id) } }, [
						"Done",
					]),
				]);
	}
}

// Mount the app
const app = new TodoApp();
app.mount(document.body);
