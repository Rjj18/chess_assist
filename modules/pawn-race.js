import { Chess } from "https://cdn.jsdelivr.net/npm/chess.mjs@1/src/chess.mjs/Chess.js";
import { PawnRaceGameController } from "./PawnRaceGameController.js";
import { BoardManager } from "./BoardManager.js";
import { UIController } from "./UIController.js";
import { MovesTableController } from "./MovesTableController.js";
import { ThemeManager } from "./ThemeManager.js";

// Initialize theme manager first
const themeManager = new ThemeManager();

// Main module initialization
const chess = new Chess();
const movesTableController = new MovesTableController("pawnRaceMovesTableBody");

// Create board manager
const boardManager = new BoardManager("pawn-race-board", {
    assetsUrl: "./cm-chessboard-master/assets/",
    style: {
        pieces: { file: "pieces/staunty.svg" },
        animationDuration: 300,
        showCoordinates: true,
        borderType: "thin"
    }
});

// Create GameController
const gameController = new PawnRaceGameController(chess, boardManager.getBoard(), movesTableController);

// Create UI controller
const uiController = new UIController(gameController, "resetPawnRaceButton");

// Start the game
gameController.startGame();

// Expose global functions
uiController.exposeGlobalFunctions();

// Export modules for global use
window.boardManager = boardManager;
window.themeManager = themeManager;

// Initialize UI
uiController.initializeUI();
