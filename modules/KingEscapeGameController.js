/**
 * Module for controlling the King Escape game flow.
 * @module KingEscapeGameController
 */

import { INPUT_EVENT_TYPE } from "../cm-chessboard-master/src/Chessboard.js";

export class KingEscapeGameController {
    #chess;
    #board;
    #movesTableController;

    /**
     * @param {Chess} chess - The chess.js instance.
     * @param {Chessboard} board - The visual board instance.
     * @param {KingEscapeMovesTableController} movesTableController - The moves table controller.
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
        this.#chess.load(fen);
        this.#board.setPosition(this.#chess.fen());
        this.#movesTableController.clearMoves();
        this.#board.enableMoveInput(this.handleInput.bind(this));
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
                // Only allow moving the white King
                return event.piece === 'wK';
            case INPUT_EVENT_TYPE.validateMoveInput:
                const move = this.#chess.move({ from: event.squareFrom, to: event.squareTo });
                if (move) {
                    this.#board.setPosition(this.#chess.fen());
                    this.#movesTableController.addMove(move);
                    this.#checkWinCondition(move.to);
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
        if (toSquare === 'e8') {
            this.#board.disableMoveInput();
            // Use a small timeout to allow the move animation to finish
            setTimeout(() => alert("You win! The king reached e8!"), 300);
        }
    }
}