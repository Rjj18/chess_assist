/**
 * @module BaseGameController
 */

import { INPUT_EVENT_TYPE, COLOR } from "../cm-chessboard-master/src/Chessboard.js";

export class BaseGameController {
    #chess;
    #board;
    #movesTableController;

    constructor(chess, board, movesTableController) {
        if (this.constructor === BaseGameController) {
            throw new Error("BaseGameController is an abstract class and cannot be instantiated directly.");
        }
        this.#chess = chess;
        this.#board = board;
        this.#movesTableController = movesTableController;
    }

    get chess() {
        return this.#chess;
    }

    get board() {
        return this.#board;
    }

    get movesTableController() {
        return this.#movesTableController;
    }

    /**
     * Starts the game by setting up a new game.
     */
    startGame() {
        this.setupNewGame();
    }

    /**
     * Resets the game by setting up a new one.
     */
    resetGame() {
        console.log(`${this.constructor.name}.resetGame() called`);
        this.setupNewGame();
    }

    /**
     * Abstract method to set up a new game. Must be implemented by subclasses.
     */
    setupNewGame() {
        throw new Error("setupNewGame() must be implemented by a subclass.");
    }

    /**
     * Abstract method to handle board input. Must be implemented by subclasses.
     * @param {object} event - The board input event.
     */
    handleInput(event) {
        throw new Error("handleInput() must be implemented by a subclass.");
    }
}
