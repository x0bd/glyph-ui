// import { createApp, h, hFragment } from "https://unpkg.com/glyphui@1.2.0";
import {
	createApp,
	h,
	hFragment,
} from "./../../packages/runtime/dist/glyphui.js";
import { makeInitialState, markReducer } from "./game.js";

const View = (state, emit) => {
	return hFragment([Header(state), Board(state, emit)]);
};

const Header = (state) => {
	if (state.winner) {
		return h("h3", { class: "win-title" }, [
			`Player ${state.winner} wins!`,
		]);
	}

	if (state.draw) {
		return h[("h3", { class: "draw-title" }, [`It's a draw!`])];
	}

	return h("h3", {}, [`It's ${state.player}'s turn!`]);
};

const Board = (state, emit) => {
	const freezeBoard = state.winner || state.draw;

	return h("table", { class: freezeBoard ? "frozen" : "" }, [
		h(
			"tbody",
			{},
			state.board.map((row, i) => Row({ row, i }, emit))
		),
	]);
};

const Row = ({ row, i }, emit) => {
	return h(
		"tr",
		{},
		row.map((cell, j) => Cell({ cell, i, j }, emit))
	);
};

const Cell = ({ cell, i, j }, emit) => {
	const mark = cell
		? h("span", { class: "cell-text" }, [cell])
		: h(
				"div",
				{
					class: "cell",
					on: { click: () => emit("mark", { row: i, col: j }) },
				},
				[]
		  );

	return h("td", {}, [mark]);
};

createApp({
	state: makeInitialState(),
	reducers: { mark: markReducer },
	view: View,
}).mount(document.body);
