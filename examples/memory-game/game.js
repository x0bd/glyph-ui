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
					startTime: Date.now(),
					isGameComplete: false,
					showDifficultyDialog: false,
					difficulty: "medium",
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
	}

	// Set up timer when component is mounted
	mounted() {
		this.timerInterval = setInterval(() => {
			this.setState({ updateTimer: Date.now() });
		}, 1000);
	}

	// Clean up timer when component is unmounted
	beforeUnmount() {
		clearInterval(this.timerInterval);
	}

	// Handle card click event
	handleCardClick(card) {
		const { deck, flippedCards, moves, isGameComplete } = this.state;

		// Ignore clicks if game is complete or card is already flipped/matched
		if (
			isGameComplete ||
			flippedCards.length >= 2 ||
			card.isFlipped ||
			card.isMatched
		) {
			return;
		}

		// Create a new deck with the clicked card flipped
		const newDeck = deck.map((c) => {
			if (c.id === card.id) {
				return { ...c, isFlipped: true };
			}
			return c;
		});

		// Add card to flippedCards array
		const newFlippedCards = [...flippedCards, card];

		// Update state
		this.setState({
			deck: newDeck,
			flippedCards: newFlippedCards,
			moves: moves + 1,
		});

		// If we have 2 flipped cards, check for a match
		if (newFlippedCards.length === 2) {
			setTimeout(this.checkForMatch, 800);
		}
	}

	// Check if flipped cards match
	checkForMatch() {
		const { deck, flippedCards, matches } = this.state;
		const [card1, card2] = flippedCards;

		// Check if cards match
		const isMatch = card1.symbol === card2.symbol;

		// Update deck based on match result
		const newDeck = deck.map((card) => {
			if (flippedCards.some((c) => c.id === card.id)) {
				if (isMatch) {
					return { ...card, isMatched: true };
				} else {
					return { ...card, isFlipped: false };
				}
			}
			return card;
		});

		// Check if all cards are matched (game complete)
		const isGameComplete = newDeck.every((card) => card.isMatched);

		// Update state
		this.setState({
			deck: newDeck,
			flippedCards: [],
			matches: isMatch ? matches + 1 : matches,
			isGameComplete,
		});
	}

	// Restart game with current difficulty
	restartGame() {
		this.setState({
			deck: createDeck(this.state.difficulty),
			flippedCards: [],
			moves: 0,
			matches: 0,
			startTime: Date.now(),
			isGameComplete: false,
		});
	}

	// Show difficulty dialog
	showDifficultyDialog() {
		this.setState({ showDifficultyDialog: true });
	}

	// Close difficulty dialog
	closeDifficultyDialog() {
		this.setState({ showDifficultyDialog: false });
	}

	// Change difficulty and restart game
	changeDifficulty(difficulty) {
		this.setState({
			difficulty,
			deck: createDeck(difficulty),
			flippedCards: [],
			moves: 0,
			matches: 0,
			startTime: Date.now(),
			isGameComplete: false,
			showDifficultyDialog: false,
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

		// Determine board class based on difficulty
		const boardClass = `game-board game-board-${difficulty}`;

		return h("div", { class: "game-container" }, [
			// Game stats
			createComponent(GameStats, { moves, matches, startTime }),

			// Game controls
			createComponent(GameControls, {
				onRestart: this.restartGame,
				onChangeDifficulty: this.showDifficultyDialog,
			}),

			// Game board
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

			// Difficulty dialog
			showDifficultyDialog &&
				createComponent(DifficultyDialog, {
					onClose: this.closeDifficultyDialog,
					onSelectDifficulty: this.changeDifficulty,
				}),

			// Victory overlay
			isGameComplete &&
				h("div", { class: "victory-overlay" }, [
					h("div", { class: "victory-card" }, [
						h("h2", {}, ["You Win!"]),
						h("p", {}, [
							`You completed the game in ${moves} moves and ${Math.floor(
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
