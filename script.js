import {COLOR, FEN} from "./cm-chessboard-master/src/Chessboard.js"
import {Chess} from "https://cdn.jsdelivr.net/npm/chess.mjs@1/src/chess.mjs/Chess.js"
import {GameController} from "./modules/GameController.js"
import {BoardManager} from "./modules/BoardManager.js"
import {UIController} from "./modules/UIController.js"
import {MovesTableController} from "./modules/MovesTableController.js"



// Main module initialization
const chess = new Chess();
const movesTableController = new MovesTableController();

// Create board manager with custom configuration
const boardManager = new BoardManager("board", {
    position: chess.fen(),
    assetsUrl: "./cm-chessboard-master/assets/",
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

// Export boardManager for internal use
window.boardManager = boardManager;

// Initialize interface after loading everything
uiController.initializeUI();
