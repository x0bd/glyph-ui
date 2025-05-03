// import { createApp, h, hFragment } from "https://unpkg.com/glyphui@1.2.0";
import {
	Component,
	h,
	hFragment,
} from "./../../packages/runtime/dist/glyphui.js";
import { makeInitialState, markReducer } from "./game.js";

class TicTacToeApp extends Component {
	constructor() {
		super({}, {
			initialState: makeInitialState()
		});
	}
	
	mark(position) {
		// Validate the move
		const { row, col } = position;
		if (row > 3 || row < 0 || row > 3 || col < 0) {
			return; // Invalid move
		}
		
		if (this.state.board[row][col]) {
			return; // Cell already marked
		}
		
		// Use the game logic from the existing code
		this.setState(markReducer(this.state, position));
	}
	
	render(props, state) {
		return hFragment([this.renderHeader(state), this.renderBoard(state)]);
	}
	
	renderHeader(state) {
		if (state.winner) {
			return h("h3", { class: "win-title" }, [
				`Player ${state.winner} wins!`,
			]);
		}

		if (state.draw) {
			return h("h3", { class: "draw-title" }, [`It's a draw!`]);
		}

		return h("h3", {}, [`It's ${state.player}'s turn!`]);
	}
	
	renderBoard(state) {
		const freezeBoard = state.winner || state.draw;

		return h("table", { class: freezeBoard ? "frozen" : "" }, [
			h(
				"tbody",
				{},
				state.board.map((row, i) => this.renderRow(row, i))
			),
		]);
	}
	
	renderRow(row, i) {
		return h(
			"tr",
			{},
			row.map((cell, j) => this.renderCell(cell, i, j))
		);
	}
	
	renderCell(cell, i, j) {
		const mark = cell
			? h("span", { class: "cell-text" }, [cell])
			: h(
					"div",
					{
						class: "cell",
						on: { click: () => this.mark({ row: i, col: j }) },
					},
					[]
			  );

		return h("td", {}, [mark]);
	}
}

// Create and mount the game
const game = new TicTacToeApp();
game.mount(document.body);
