import { Chess } from "https://cdn.jsdelivr.net/npm/chess.mjs@1/src/chess.mjs/Chess.js";
import { BoardManager } from "./BoardManager.js";
import { ThemeManager } from "./ThemeManager.js";
import { KingEscapeGameController } from "./KingEscapeGameController.js";
import { KingEscapeMovesTableController } from "./KingEscapeMovesTableController.js";

// Initialize theme manager for consistent theming
const themeManager = new ThemeManager();

// Initialize main components
const chess = new Chess();
const movesTableController = new KingEscapeMovesTableController("kingMovesTableBody");

// Create the board manager for the King Escape game
const boardManager = new BoardManager("king-board", {
    assetsUrl: "./cm-chessboard-master/assets/",
    style: {
        pieces: { file: "pieces/staunty.svg" },
        animationDuration: 300,
        showCoordinates: true,
        borderType: "thin"
    },
    responsive: true
});

// Create the game controller
const gameController = new KingEscapeGameController(chess, boardManager.getBoard(), movesTableController);

// Start the game
gameController.startGame();

// Reset button functionality
const resetBtn = document.getElementById("resetKingGameButton");
if (resetBtn) {
    resetBtn.addEventListener("click", () => gameController.resetGame());
}