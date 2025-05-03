import {
  Component,
  createComponent,
  createSlot,
  h,
  hFragment,
} from "../../packages/runtime/dist/glyphui.js";

// Card symbols for the memory game
const SYMBOLS = [
  '🚀', '🌟', '🌈', '🎮', '🔮', '🎨', '🍕', '🌮',
  '🏀', '🎸', '🐱', '🐶', '🦊', '🦄', '🐢', '🦉'
];

/**
 * Creates a shuffled deck of cards based on difficulty
 */
function createDeck(difficulty = 'medium') {
  const pairCounts = {
    easy: 6,
    medium: 8,
    hard: 12
  };
  
  const count = pairCounts[difficulty] || 8;
  const symbols = SYMBOLS.slice(0, count);
  
  // Create pairs of symbols
  const deck = [...symbols, ...symbols];
  
  // Shuffle the deck
  return deck.sort(() => Math.random() - 0.5).map((symbol, index) => ({
    id: index,
    symbol,
    isFlipped: false,
    isMatched: false
  }));
}

/**
 * Card Component - Represents a single card in the memory game
 */
class Card extends Component {
  render(props) {
    const { card, onCardClick } = props;
    
    // Apply appropriate CSS classes based on card state
    const cardClass = `card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`;
    
    return h('div', {
      class: cardClass,
      on: {
        click: () => onCardClick(card)
      }
    }, [
      // Card front (back side when not flipped)
      h('div', { class: 'card-front' }, []),
      
      // Card back (shows symbol when flipped)
      h('div', { class: 'card-back' }, [
        card.symbol
      ])
    ]);
  }
}

/**
 * GameStats Component - Displays game statistics
 */
class GameStats extends Component {
  render(props) {
    const { moves, matches, startTime } = props;
    
    // Calculate time elapsed since game start
    const timeElapsed = startTime 
      ? Math.floor((Date.now() - startTime) / 1000)
      : 0;
    
    // Format time as MM:SS
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    return h('div', { class: 'game-stats' }, [
      // Moves stat
      h('div', { class: 'stat' }, [
        h('div', { class: 'stat-value' }, [moves.toString()]),
        h('div', { class: 'stat-label' }, ['Moves'])
      ]),
      
      // Time stat
      h('div', { class: 'stat' }, [
        h('div', { class: 'stat-value' }, [timeFormatted]),
        h('div', { class: 'stat-label' }, ['Time'])
      ]),
      
      // Matches stat
      h('div', { class: 'stat' }, [
        h('div', { class: 'stat-value' }, [matches.toString()]),
        h('div', { class: 'stat-label' }, ['Matches'])
      ])
    ]);
  }
}

/**
 * GameControls Component - Provides game control buttons
 */
class GameControls extends Component {
  render(props) {
    const { onRestart, onChangeDifficulty } = props;
    
    return h('div', { class: 'game-controls' }, [
      // Restart button
      h('button', { 
        class: 'btn-primary', 
        on: { click: onRestart }
      }, ['Restart Game']),
      
      // Change difficulty button
      h('button', { 
        class: 'btn-secondary', 
        on: { click: onChangeDifficulty }
      }, ['Change Difficulty'])
    ]);
  }
}

/**
 * RestartDialog Component - Dialog for restarting the game
 */
class RestartDialog extends Component {
  render(props) {
    const { onClose, onSelectDifficulty } = props;
    
    return h('div', { class: 'restart-message' }, [
      h('h2', {}, ['Select Difficulty']),
      h('p', {}, ['Choose a difficulty level for the new game:']),
      
      // Difficulty selection buttons
      h('div', { class: 'difficulty-selector' }, [
        h('button', { 
          class: 'btn-secondary', 
          on: { click: () => onSelectDifficulty('easy') }
        }, ['Easy']),
        
        h('button', { 
          class: 'btn-secondary', 
          on: { click: () => onSelectDifficulty('medium') }
        }, ['Medium']),
        
        h('button', { 
          class: 'btn-secondary', 
          on: { click: () => onSelectDifficulty('hard') }
        }, ['Hard'])
      ]),
      
      // Cancel button
      h('button', { 
        class: 'btn-primary', 
        style: { marginTop: '1rem' },
        on: { click: onClose }
      }, ['Cancel'])
    ]);
  }
}

/**
 * Main Game Component - Controls all game logic
 */
class MemoryGame extends Component {
  constructor() {
    super({}, {
      initialState: {
        deck: createDeck('medium'),
        flippedCards: [],
        moves: 0,
        matches: 0,
        startTime: Date.now(),
        isGameComplete: false,
        showDifficultyDialog: false,
        difficulty: 'medium',
        updateTimer: 0
      }
    });
    
    // Bind methods
    this.handleCardClick = this.handleCardClick.bind(this);
    this.checkForMatch = this.checkForMatch.bind(this);
    this.restartGame = this.restartGame.bind(this);
    this.showDifficultySelector = this.showDifficultySelector.bind(this);
    this.changeDifficulty = this.changeDifficulty.bind(this);
    this.closeDifficultySelector = this.closeDifficultySelector.bind(this);
  }
  
  // Lifecycle hook - called when component is mounted
  mounted() {
    // Set up a timer to update game time display
    this.timerInterval = setInterval(() => {
      this.setState({ updateTimer: Date.now() });
    }, 1000);
  }
  
  // Lifecycle hook - called when component is unmounted
  beforeUnmount() {
    // Clear the timer interval
    clearInterval(this.timerInterval);
  }
  
  // Handle card click event
  handleCardClick(card) {
    const { deck, flippedCards, moves, isGameComplete } = this.state;
    
    // Ignore clicks if game is complete or if card is already flipped/matched
    if (isGameComplete || flippedCards.length >= 2 || card.isFlipped || card.isMatched) {
      return;
    }
    
    // Create a new deck with the clicked card flipped
    const newDeck = deck.map(c => {
      if (c.id === card.id) {
        return { ...c, isFlipped: true };
      }
      return c;
    });
    
    // Add the card to flippedCards array
    const newFlippedCards = [...flippedCards, card];
    
    // Update state with the flipped card
    this.setState({
      deck: newDeck,
      flippedCards: newFlippedCards,
      moves: moves + 1
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
    
    // Create new deck based on match result
    const newDeck = deck.map(card => {
      if (flippedCards.some(c => c.id === card.id)) {
        // If cards match, mark them as matched
        if (card1.symbol === card2.symbol) {
          return { ...card, isMatched: true };
        }
        // If no match, flip them back
        return { ...card, isFlipped: false };
      }
      return card;
    });
    
    // Check if cards match and increment matches counter properly
    const isMatch = card1.symbol === card2.symbol;
    
    // Check if all cards are matched (game complete)
    const isGameComplete = newDeck.every(card => card.isMatched);
    
    // Update state
    this.setState({
      deck: newDeck,
      flippedCards: [],
      matches: isMatch ? matches + 1 : matches, // Increment by 1 for each pair
      isGameComplete
    });
  }
  
  // Restart the game
  restartGame() {
    this.setState({
      deck: createDeck(this.state.difficulty),
      flippedCards: [],
      moves: 0,
      matches: 0,
      startTime: Date.now(),
      isGameComplete: false
    });
  }
  
  // Show difficulty selector dialog
  showDifficultySelector() {
    this.setState({ showDifficultyDialog: true });
  }
  
  // Close difficulty selector dialog
  closeDifficultySelector() {
    this.setState({ showDifficultyDialog: false });
  }
  
  // Change difficulty and restart
  changeDifficulty(difficulty) {
    this.setState({
      difficulty,
      showDifficultyDialog: false,
      deck: createDeck(difficulty),
      flippedCards: [],
      moves: 0,
      matches: 0,
      startTime: Date.now(),
      isGameComplete: false
    });
  }
  
  render(props, state) {
    const { deck, moves, matches, startTime, showDifficultyDialog, isGameComplete } = state;
    
    // Calculate board dimensions based on difficulty and screen width
    const { difficulty } = state;
    const windowWidth = window.innerWidth;
    
    // Set columns based on difficulty and screen width
    let columns;
    if (difficulty === 'easy') {
      // For easy, use 3 columns on small screens, 4 on larger screens
      columns = windowWidth < 640 ? 3 : 4;
    } else if (difficulty === 'medium') {
      // For medium, use 4 columns regardless of screen size
      columns = 4;
    } else if (difficulty === 'hard') {
      // For hard, use 4 on small screens, 6 on medium, 8 on very large screens
      if (windowWidth < 640) {
        columns = 4;
      } else if (windowWidth < 900) {
        columns = 6;
      } else {
        columns = 8;
      }
    } else {
      columns = 4; // Default
    }
    
    // Set additional className for the game board based on difficulty
    const boardClassName = `game-board game-board-${difficulty}`;
    
    const boardStyle = {
      gridTemplateColumns: `repeat(${columns}, 1fr)`
    };
    
    return h('div', { class: 'game-container' }, [
      // Game stats component at the top
      createComponent(GameStats, {
        moves,
        matches,
        startTime
      }),
      
      // Game controls for restart and difficulty
      createComponent(GameControls, {
        onRestart: this.restartGame,
        onChangeDifficulty: this.showDifficultySelector
      }),
      
      // Game board with cards
      h('div', { 
        class: boardClassName,
        style: boardStyle
      }, 
        deck.map(card => 
          createComponent(Card, {
            key: card.id,
            card,
            onCardClick: this.handleCardClick
          })
        )
      ),
      
      // Victory overlay when game is complete
      isGameComplete && h('div', { class: 'victory-overlay' }, [
        h('div', { class: 'victory-card' }, [
          h('h2', {}, ['Congratulations!']),
          h('p', {}, [`You completed the game in ${moves} moves and found all ${matches} pairs!`]),
          h('button', { 
            class: 'btn-primary',
            on: { click: this.restartGame }
          }, ['Play Again'])
        ])
      ]),
      
      // Difficulty selector dialog
      showDifficultyDialog && createComponent(RestartDialog, {
        onClose: this.closeDifficultySelector,
        onSelectDifficulty: this.changeDifficulty
      })
    ]);
  }
}

// Create and mount the game
const game = new MemoryGame();
game.mount(document.getElementById('app')); 