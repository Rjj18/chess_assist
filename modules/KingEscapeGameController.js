/**
 * Module for controlling the King Escape game flow.
 * @module KingEscapeGameController
 */

import { INPUT_EVENT_TYPE, COLOR } from "../cm-chessboard-master/src/Chessboard.js";

export class KingEscapeGameController {
    #chess;
    #board;
    #movesTableController;

    /**
     * @param {Chess} chess - The chess.js instance.
     * @param {Chessboard} board - The visual board instance.
     * @param {KingEscapeGameController} movesTableController - The moves table controller.
     */
    constructor(chess, board, movesTableController) {
        this.#chess = chess;
        this.#board = board;
        this.#movesTableController = movesTableController;
    }

    /**
     * Generates a random FEN for the King Escape puzzle.
     * @returns {string} A FEN string for the new puzzle.
     * @private
     */
    #generateRandomFen() {
        const occupied = new Set(["e1"]);
        const pieces = { n: 1 }; // Black pieces to place, just a knight for this version
        const fenArr = Array(8).fill(null).map(() => Array(8).fill(null));

        fenArr[7][4] = 'K'; // White King on e1

        // Place black pieces randomly on ranks 2-8
        for (const piece in pieces) {
            let square, rank, file;
            do {
                const files = 'abcdefgh';
                const ranks = '2345678';
                square = files[Math.floor(Math.random() * files.length)] + ranks[Math.floor(Math.random() * ranks.length)];
            } while (occupied.has(square));

            occupied.add(square);
            rank = 8 - parseInt(square[1], 10);
            file = square.charCodeAt(0) - 'a'.charCodeAt(0);
            fenArr[rank][file] = piece;
        }

        // Convert array to FEN string
        return fenArr.map(row => {
            let empty = 0;
            let fenRow = '';
            for (const cell of row) {
                if (cell === null) {
                    empty++;
                } else {
                    if (empty > 0) {
                        fenRow += empty;
                        empty = 0;
                    }
                    fenRow += cell;
                }
            }
            if (empty > 0) fenRow += empty;
            return fenRow;
        }).join('/') + ' w - - 0 1';
    }

    /**
     * Sets up a new puzzle.
     */
    setupNewGame() {
        const fen = this.#generateRandomFen();
        console.log("Generated FEN for King Escape:", fen);
        
        // First disable any existing move input
        try {
            this.#board.disableMoveInput();
        } catch (e) {
            // Move input might not be enabled, ignore error
        }
        
        // Load the new position into chess.js
        this.#chess.load(fen);
        console.log("Chess.js FEN after load:", this.#chess.fen());
        
        // Clear moves table first
        this.#movesTableController.clearMoves();
        
        // Set the board position with animation disabled for complete refresh
        this.#board.setPosition(this.#chess.fen(), false);
        
        // Wait a small amount of time to ensure the position is set
        setTimeout(() => {
            this.#board.enableMoveInput(this.handleInput.bind(this), COLOR.white);
        }, 100);
    }

    /**
     * Starts the game.
     */
    startGame() {
        this.setupNewGame();
    }

    /**
     * Resets the game with a new puzzle.
     */
    resetGame() {
        console.log("Resetting King Escape puzzle...");
        this.setupNewGame();
    }

    /**
     * Main handler for board input events.
     * @param {object} event - The board event.
     * @returns {boolean}
     */
    handleInput(event) {
        switch (event.type) {
            case INPUT_EVENT_TYPE.moveInputStarted:
                // Only allow moving the white King (note: piece notation is lowercase)
                return event.piece === 'wk';
            case INPUT_EVENT_TYPE.validateMoveInput:
                console.log("Chess.js thinks pieces are at:", JSON.stringify(this.#chess.board()));
                console.log("Trying to move from", event.squareFrom, "to", event.squareTo);
                
                // Try the move first
                const move = this.#chess.move({ from: event.squareFrom, to: event.squareTo });
                if (move) {
                    // In King Escape, we want to keep it white's turn so the king can move continuously
                    // Manually flip the turn back to white after the move
                    const currentFen = this.#chess.fen();
                    const fenParts = currentFen.split(' ');
                    fenParts[1] = 'w'; // Force white to move
                    const newFen = fenParts.join(' ');
                    this.#chess.load(newFen);
                    
                    // Move succeeded - update moves table and check win condition
                    this.#movesTableController.addMove(move, false);
                    this.#checkWinCondition(move.to);
                    
                    // Let the visual board handle the move animation, then sync
                    setTimeout(() => {
                        this.#board.setPosition(this.#chess.fen(), false);
                    }, 50);
                } else {
                    // Move was rejected - check if it's because the king would be in check
                    console.log("Move rejected by chess.js:", event.squareFrom, "to", event.squareTo);
                    console.log("Current chess.js FEN:", this.#chess.fen());
                    
                    // If the move was rejected and it's a king move, it's likely because it would result in check
                    // We can assume this is a check situation and show the message
                    if (event.piece === 'wk') {
                        this.#movesTableController.addCheckMessage(event.squareFrom, event.squareTo);
                    }
                }
                return !!move; // Return true if move was valid, false otherwise
            default:
                return true;
        }
    }

    /**
     * Checks if the win condition (King on 8th rank) is met.
     * @param {string} toSquare - The destination square of the move.
     * @private
     */
    #checkWinCondition(toSquare) {
        // Check if the king reached the 8th rank (any square on rank 8)
        if (toSquare.endsWith('8')) {
            this.#board.disableMoveInput();
            // Use a small timeout to allow the move animation to finish
            setTimeout(() => {
                const message = `Congratulations! The white king has reached ${toSquare} and escaped to safety!`;
                alert(message);
                console.log("King Escape: Win condition met!");
            }, 300);
        }
    }
}