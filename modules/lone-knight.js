import { Chess } from "https://cdn.jsdelivr.net/npm/chess.mjs@1/src/chess.mjs/Chess.js";
import { BoardManager } from "./BoardManager.js";
import { ThemeManager } from "./ThemeManager.js";
import { LoneKnightGameController } from "./LoneKnightGameController.js";
import { LoneKnightMovesTableController } from "./LoneKnightMovesTableController.js";

// Initialize theme manager for consistent theming
const themeManager = new ThemeManager();

// Initialize main components
const chess = new Chess();
const movesTableController = new LoneKnightMovesTableController("loneKnightMovesTableBody");

// Create the board manager for the Lone Knight game
const boardManager = new BoardManager("lone-knight-board", {
    position: "8/8/8/8/8/8/8/8 w - - 0 1", // Empty board initially
    assetsUrl: "cm-chessboard-master/assets/",
    style: {
        pieces: { file: "pieces/staunty.svg" },
        animationDuration: 300,
        showCoordinates: true,
        borderType: "thin"
    },
    responsive: true
});

// Create the game controller
const gameController = new LoneKnightGameController(chess, boardManager.getBoard(), movesTableController);

// Start the game
gameController.startGame();

// Reset button functionality
const resetBtn = document.getElementById("resetLoneKnightButton");
if (resetBtn) {
    resetBtn.addEventListener("click", () => gameController.resetGame());
}
