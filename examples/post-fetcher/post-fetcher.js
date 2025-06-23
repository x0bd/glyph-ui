import {
	h,
	Component,
	useState,
	useEffect,
} from "./../../packages/runtime/dist/glyphui.js";

// A functional component that fetches posts from an external API
class PostFetcherApp extends Component {
	constructor() {
		super(
			{},
			{
				initialState: {
					posts: [],
					isLoading: true,
					error: null,
				},
			}
		);
	}

	mounted() {
		this.fetchPosts();
	}

	async fetchPosts() {
		try {
			const response = await fetch(
				"https://jsonplaceholder.typicode.com/posts?_limit=5"
			);
			if (!response.ok) {
				throw new Error("Data fetching failed");
			}
			const data = await response.json();
			this.setState({ posts: data, isLoading: false });
		} catch (err) {
			this.setState({ error: err.message, isLoading: false });
		}
	}

	render(props, state) {
		const { posts, isLoading, error } = state;

		if (isLoading) {
			return h("div", { class: "loading-state" }, [
				h("div", { class: "spinner" }, []),
				h("p", {}, ["Loading posts..."]),
			]);
		}

		if (error) {
			return h("div", { class: "error-state" }, [
				h("p", { class: "error-message" }, [`Error: ${error}`]),
				h(
					"button",
					{
						class: "retry-button",
						on: { click: () => window.location.reload() },
					},
					["Retry"]
				),
			]);
		}

		return h("div", { class: "posts-container" }, [
			h("h2", { class: "posts-title" }, ["Fetched Posts"]),
			h("div", { class: "posts-list" }, [
				...posts.map((post) =>
					h("div", { class: "post-item", key: post.id }, [
						h("h3", { class: "post-title" }, [post.title]),
						h("p", { class: "post-body" }, [post.body]),
					])
				),
			]),
		]);
	}
}

// Mount the app
const app = new PostFetcherApp();
app.mount(document.querySelector("main"));
