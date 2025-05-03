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
					idx: null,
					original: null,
					edited: null,
				},
				todos: ["watch OOP vs FP video", "feed the cat", "publish framework"],
			}
		});
	}

	updateCurrentTodo(currentTodo) {
		this.setState({ currentTodo });
	}

	addTodo() {
		this.setState({
			currentTodo: "",
			todos: [...this.state.todos, this.state.currentTodo],
		});
	}

	startEditingTodo(idx) {
		this.setState({
			edit: {
				idx,
				original: this.state.todos[idx],
				edited: this.state.todos[idx],
			},
		});
	}

	editTodo(edited) {
		this.setState({
			edit: { ...this.state.edit, edited },
		});
	}

	saveEditedTodo() {
		const todos = [...this.state.todos];
		todos[this.state.edit.idx] = this.state.edit.edited;

		this.setState({
			edit: { idx: null, original: null, edited: null },
			todos,
		});
	}

	cancelEditingTodo() {
		this.setState({
			edit: { idx: null, original: null, edited: null },
		});
	}

	removeTodo(idx) {
		this.setState({
			todos: this.state.todos.filter((_, i) => i !== idx),
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
			todos.map((todo, i) => this.renderTodoItem(todo, i, edit))
		);
	}

	renderTodoItem(todo, i, edit) {
		const isEditing = edit.idx === i;

		return isEditing
			? h("div", { class: "todo-item" }, [
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
			: h("div", { class: "todo-item" }, [
					hString("•"),
					h(
						"span",
						{ on: { dblclick: () => this.startEditingTodo(i) } },
						[todo]
					),
					h("button", { on: { click: () => this.removeTodo(i) } }, [
						"Done",
					]),
				]);
	}
}

// Mount the app
const app = new TodoApp();
app.mount(document.body);
