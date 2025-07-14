import { Chess } from "https://cdn.jsdelivr.net/npm/chess.mjs@1/src/chess.mjs/Chess.js";
import { BoardManager } from "./BoardManager.js";
import { ThemeManager } from "./ThemeManager.js";
import { MovesTableController } from "./MovesTableController.js";
import { PawnRaceGameController } from "./PawnRaceGameController.js";
import { PawnRaceFenGenerator } from "./FenGenerator.js";


// Initialize theme manager first
const themeManager = new ThemeManager();

// Main module initialization
const chess = new Chess();
const fenGenerator = new PawnRaceFenGenerator();
const fen = fenGenerator.generateFen();
const boardManager = new BoardManager("pawn-race-board", {
    position: fen, // Set the starting position for the board
    assetsUrl: "cm-chessboard-master/assets/",
    style: {
        borderType: "thin",
        showCoordinates: true,
        pieces: { file: "pieces/staunty.svg" },
        animationDuration: 300
    },
    responsive: true
});

// Use the correct table body ID from your HTML
const movesTableController = new MovesTableController('pawnRaceMovesTableBody');

// Create and start the game controller
const gameController = new PawnRaceGameController(chess, boardManager, movesTableController);
gameController.startGame();

// Wire up the reset button
const resetBtn = document.getElementById('resetPawnRaceButton');
if (resetBtn) {
    resetBtn.addEventListener('click', () => gameController.resetGame());
}
