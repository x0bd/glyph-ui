import { Component, h } from "../../packages/runtime/dist/glyphui.js";

const SYMBOLS = ["🚀", "🌟", "🌈", "🎮", "🔮", "🎨", "🍕", "🌮"];

function createDeck() {
	const deck = [...SYMBOLS, ...SYMBOLS];
	// Simple shuffle
	for (let i = deck.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[deck[i], deck[j]] = [deck[j], deck[i]];
	}
	return deck;
}

class MemoryGame extends Component {
	constructor() {
		super(
			{},
			{
				initialState: {
					deck: createDeck(),
					flippedIndices: [],
					matchedSymbols: [],
					moves: 0,
					isChecking: false, // Prevent clicks during match check
				},
			}
		);
		this.handleCardClick = this.handleCardClick.bind(this);
	}

	handleCardClick(index) {
		const { flippedIndices, deck, matchedSymbols, isChecking } = this.state;
		const symbol = deck[index];

		if (
			isChecking ||
			flippedIndices.includes(index) ||
			matchedSymbols.includes(symbol)
		) {
			return; // Ignore clicks if checking, card is already flipped, or card is matched
		}

		const newFlippedIndices = [...flippedIndices, index];

		this.setState({ flippedIndices: newFlippedIndices });

		if (newFlippedIndices.length === 2) {
			this.setState({ isChecking: true });
			setTimeout(() => this.checkForMatch(), 1000);
		}
	}

	checkForMatch() {
		const { flippedIndices, deck, matchedSymbols, moves } = this.state;
		const [index1, index2] = flippedIndices;
		const symbol1 = deck[index1];
		const symbol2 = deck[index2];

		const newMatchedSymbols = [...matchedSymbols];
		if (symbol1 === symbol2) {
			newMatchedSymbols.push(symbol1);
		}

		this.setState({
			flippedIndices: [],
			matchedSymbols: newMatchedSymbols,
			moves: moves + 1,
			isChecking: false,
		});
	}

	render(props, state) {
		const { deck, flippedIndices, matchedSymbols, moves } = state;
		const isGameWon = matchedSymbols.length === SYMBOLS.length;

		return h("div", { class: "game-container" }, [
			h("div", { class: "info" }, [`Moves: ${moves}`]),
			h(
				"div",
				{ class: "board" },
				deck.map((symbol, index) => {
					const isFlipped = flippedIndices.includes(index);
					const isMatched = matchedSymbols.includes(symbol);

					let cardClass = "card";
					if (isFlipped || isMatched) {
						cardClass += " flipped";
					}
					if (isMatched) {
						cardClass += " matched";
					}

					return h(
						"div",
						{
							class: cardClass,
							key: index,
							on: {
								click: () => this.handleCardClick(index),
							},
						},
						[h("span", { class: "content" }, [symbol])]
					);
				})
			),
			isGameWon &&
				h("div", { class: "win-message" }, [
					"Congratulations, You Win!",
				]),
		]);
	}
}

// Mount the game
const app = new MemoryGame();
app.mount(document.getElementById("app"));
