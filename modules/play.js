import {Chess} from "https://cdn.jsdelivr.net/npm/chess.mjs@1/src/chess.mjs/Chess.js"
import {GameController} from "./GameController.js"
import {BoardManager} from "./BoardManager.js"
import {UIController} from "./UIController.js"
import {MovesTableController} from "./MovesTableController.js"
import {ThemeManager} from "./ThemeManager.js"

// Initialize theme manager first for proper visual initialization
const themeManager = new ThemeManager();

// Main module initialization
const chess = new Chess();
const movesTableController = new MovesTableController();

// Create board manager with custom configuration
const boardManager = new BoardManager("board", {
    position: chess.fen(),
    style: {
        pieces: { file: "pieces/staunty.svg" },
        animationDuration: 300,
        showCoordinates: true,    // Display coordinates a-h, 1-8
        borderType: "thin"        // Thin border with inline coordinates
    }
});

// Create GameController that internally manages BlackPlayerController
const gameController = new GameController(chess, boardManager.getBoard(), movesTableController);

// Create UI controller and initialize interface
const uiController = new UIController(gameController);

// Start the game
gameController.startGame();

// Export functions for global use (console, HTML, etc.)
uiController.exposeGlobalFunctions();

// Export modules for global use
window.boardManager = boardManager;
window.themeManager = themeManager;

// Initialize interface after loading everything
uiController.initializeUI();

// Listen for theme changes to update any theme-dependent components
document.addEventListener('themechange', (event) => {
    console.log(`Theme changed to: ${event.detail.theme}`);
    // Here we could update chessboard themes or other components if needed
});
