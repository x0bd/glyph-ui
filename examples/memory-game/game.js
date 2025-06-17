import {
	Component,
	createComponent,
	h,
} from "../../packages/runtime/dist/glyphui.js";

// Card symbols for the memory game
const SYMBOLS = [
	"🚀",
	"🌟",
	"🌈",
	"🎮",
	"🔮",
	"🎨",
	"🍕",
	"🌮",
	"🏀",
	"🎸",
	"🐱",
	"🐶",
];

/**
 * Creates a shuffled deck of cards based on difficulty
 */
function createDeck(difficulty = "medium") {
	const pairCounts = {
		easy: 6,
		medium: 8,
		hard: 12,
	};

	const count = pairCounts[difficulty] || 8;
	const symbols = SYMBOLS.slice(0, count);

	// Create pairs of symbols
	const deck = [...symbols, ...symbols];

	// Shuffle the deck
	return deck
		.sort(() => Math.random() - 0.5)
		.map((symbol, index) => ({
			id: index,
			symbol,
			isFlipped: false,
			isMatched: false,
		}));
}

/**
 * Card Component - Renders an individual card
 */
class Card extends Component {
	render(props) {
		const { card, onCardClick } = props;

		// Build class list based on card state
		let cardClass = "card";
		if (card.isFlipped) cardClass += " flipped";
		if (card.isMatched) cardClass += " matched";

		return h(
			"div",
			{
				class: cardClass,
				on: { click: () => onCardClick(card) },
			},
			[
				// Card front (pattern side)
				h("div", { class: "card-front" }),

				// Card back (symbol side)
				h("div", { class: "card-back" }, [card.symbol]),
			]
		);
	}
}

/**
 * GameStats Component - Displays game statistics
 */
class GameStats extends Component {
	render(props) {
		const { moves, matches, startTime } = props;

		// Calculate time elapsed
		const timeElapsed = startTime
			? Math.floor((Date.now() - startTime) / 1000)
			: 0;
		const minutes = Math.floor(timeElapsed / 60);
		const seconds = timeElapsed % 60;
		const timeFormatted = `${minutes.toString().padStart(2, "0")}:${seconds
			.toString()
			.padStart(2, "0")}`;

		return h("div", { class: "game-stats" }, [
			// Moves stat
			h("div", { class: "stat-card" }, [
				h("div", { class: "stat-value" }, [moves]),
				h("div", { class: "stat-label" }, ["Moves"]),
			]),

			// Time stat
			h("div", { class: "stat-card" }, [
				h("div", { class: "stat-value" }, [timeFormatted]),
				h("div", { class: "stat-label" }, ["Time"]),
			]),

			// Matches stat
			h("div", { class: "stat-card" }, [
				h("div", { class: "stat-value" }, [matches]),
				h("div", { class: "stat-label" }, ["Matches"]),
			]),
		]);
	}
}

/**
 * Game Controls Component
 */
class GameControls extends Component {
	render(props) {
		const { onRestart, onChangeDifficulty } = props;

		return h("div", { class: "game-controls" }, [
			h(
				"button",
				{
					class: "btn-primary",
					on: { click: onRestart },
				},
				["Restart Game"]
			),

			h(
				"button",
				{
					class: "btn-secondary",
					on: { click: onChangeDifficulty },
				},
				["Change Difficulty"]
			),
		]);
	}
}

/**
 * Difficulty Dialog Component
 */
class DifficultyDialog extends Component {
	render(props) {
		const { onClose, onSelectDifficulty } = props;

		return h("div", { class: "dialog-overlay" }, [
			h("div", { class: "dialog" }, [
				h("div", { class: "dialog-header" }, [
					h("h2", {}, ["Select Difficulty"]),
					h(
						"button",
						{
							class: "close-btn",
							on: { click: onClose },
						},
						["×"]
					),
				]),

				h("div", { class: "difficulty-options" }, [
					h(
						"button",
						{
							class: "difficulty-btn",
							on: { click: () => onSelectDifficulty("easy") },
						},
						[
							h("span", { class: "difficulty-name" }, ["Easy"]),
							h("span", { class: "difficulty-desc" }, [
								"4×3 grid, 6 pairs",
							]),
						]
					),

					h(
						"button",
						{
							class: "difficulty-btn",
							on: { click: () => onSelectDifficulty("medium") },
						},
						[
							h("span", { class: "difficulty-name" }, ["Medium"]),
							h("span", { class: "difficulty-desc" }, [
								"4×4 grid, 8 pairs",
							]),
						]
					),

					h(
						"button",
						{
							class: "difficulty-btn",
							on: { click: () => onSelectDifficulty("hard") },
						},
						[
							h("span", { class: "difficulty-name" }, ["Hard"]),
							h("span", { class: "difficulty-desc" }, [
								"6×4 grid, 12 pairs",
							]),
						]
					),
				]),
			]),
		]);
	}
}

/**
 * Main Game Component
 */
class MemoryGame extends Component {
	constructor() {
		super(
			{},
			{
				initialState: {
					deck: createDeck("medium"),
					flippedCards: [],
					moves: 0,
					matches: 0,
					startTime: null,
					isGameComplete: false,
					showDifficultyDialog: false,
					difficulty: "medium",
					timerUpdate: 0,
				},
			}
		);

		// Bind methods
		this.handleCardClick = this.handleCardClick.bind(this);
		this.checkForMatch = this.checkForMatch.bind(this);
		this.restartGame = this.restartGame.bind(this);
		this.showDifficultyDialog = this.showDifficultyDialog.bind(this);
		this.closeDifficultyDialog = this.closeDifficultyDialog.bind(this);
		this.changeDifficulty = this.changeDifficulty.bind(this);
		this.startGame = this.startGame.bind(this);
	}

	startGame() {
		this.setState({
			deck: createDeck(this.state.difficulty),
			flippedCards: [],
			moves: 0,
			matches: 0,
			startTime: Date.now(),
			isGameComplete: false,
			showDifficultyDialog: false,
		});
	}

	mounted() {
		this.startGame();
		this.timerInterval = setInterval(() => {
			if (this.state.startTime && !this.state.isGameComplete) {
				this.setState({ timerUpdate: Date.now() });
			}
		}, 1000);
	}

	beforeUnmount() {
		clearInterval(this.timerInterval);
	}

	handleCardClick(card) {
		const { flippedCards, isGameComplete, deck } = this.state;
		if (isGameComplete || flippedCards.length >= 2 || card.isFlipped) {
			return;
		}

		const newDeck = deck.map((c) =>
			c.id === card.id ? { ...c, isFlipped: true } : c
		);

		const newFlippedCards = [
			...flippedCards,
			newDeck.find((c) => c.id === card.id),
		];

		this.setState({
			deck: newDeck,
			flippedCards: newFlippedCards,
			moves: this.state.moves + 1,
		});

		if (newFlippedCards.length === 2) {
			setTimeout(this.checkForMatch, 700);
		}
	}

	checkForMatch() {
		const { flippedCards, deck, matches } = this.state;
		const [card1, card2] = flippedCards;
		const isMatch = card1.symbol === card2.symbol;

		let newDeck;
		if (isMatch) {
			newDeck = deck.map((card) =>
				card.symbol === card1.symbol
					? { ...card, isMatched: true }
					: card
			);
		} else {
			newDeck = deck.map((card) =>
				card.id === card1.id || card.id === card2.id
					? { ...card, isFlipped: false }
					: card
			);
		}

		const newMatches = isMatch ? matches + 1 : matches;
		const isGameComplete = newDeck.every((card) => card.isMatched);

		this.setState({
			deck: newDeck,
			flippedCards: [],
			matches: newMatches,
			isGameComplete,
		});
	}

	restartGame() {
		this.startGame();
	}

	showDifficultyDialog() {
		this.setState({ showDifficultyDialog: true });
	}

	closeDifficultyDialog() {
		this.setState({ showDifficultyDialog: false });
	}

	changeDifficulty(difficulty) {
		this.setState({ difficulty }, () => {
			this.startGame();
		});
	}

	render(props, state) {
		const {
			deck,
			moves,
			matches,
			startTime,
			isGameComplete,
			showDifficultyDialog,
			difficulty,
		} = state;
		const boardClass = `game-board game-board-${difficulty}`;

		return h("div", { class: "game-container" }, [
			createComponent(GameStats, { moves, matches, startTime }),
			createComponent(GameControls, {
				onRestart: this.restartGame,
				onChangeDifficulty: this.showDifficultyDialog,
			}),
			h(
				"div",
				{ class: boardClass },
				deck.map((card) =>
					createComponent(Card, {
						key: card.id,
						card,
						onCardClick: this.handleCardClick,
					})
				)
			),
			showDifficultyDialog &&
				createComponent(DifficultyDialog, {
					onClose: this.closeDifficultyDialog,
					onSelectDifficulty: this.changeDifficulty,
				}),
			isGameComplete &&
				h("div", { class: "victory-overlay" }, [
					h("div", { class: "victory-card" }, [
						h("h2", {}, ["You Win!"]),
						h("p", {}, [
							`Completed in ${moves} moves and ${Math.floor(
								(Date.now() - startTime) / 1000
							)} seconds.`,
						]),
						h(
							"button",
							{
								class: "btn-primary",
								on: { click: this.restartGame },
							},
							["Play Again"]
						),
					]),
				]),
		]);
	}
}

// Create and mount the game
const game = new MemoryGame();
game.mount(document.getElementById("app"));
