/**
 * Module for controlling black pieces movements (computer)
 * @module BlackPlayerController
 */

import { PlayerController } from './PlayerController.js';

export class BlackPlayerController extends PlayerController {
    #moveDelay;

    /**
     * @param {Chess} chess - Chess.js instance
     * @param {Chessboard} board - Board instance
     * @param {number} moveDelay - Delay in ms before making move (default: 800ms)
     * @param {MovesTableController} movesTableController - Moves table controller (optional)
     */
    constructor(chess, board, moveDelay = 800, movesTableController = null) {
        super(chess, board, 'b', movesTableController); // 'b' for black
        this.#moveDelay = moveDelay;
    }

    /**
     * Selects a random move from possible moves
     * @returns {string|null} Selected move or null if no moves available
     */
    selectRandomMove() {
        const possibleMoves = this.getPossibleMoves();
        if (possibleMoves.length === 0) {
            return null;
        }
        
        const randomIndex = Math.floor(Math.random() * possibleMoves.length);
        return possibleMoves[randomIndex];
    }

    /**
     * Makes a move for the player
     * @returns {Promise<object|null>} Promise that resolves with move result
     */
    async makeMove() {
        return this.makeAutomaticMove();
    }

    /**
     * Makes an automatic random move for black
     * @returns {Promise<object|null>} Promise that resolves with move result
     */
    async makeAutomaticMove() {
        if (!this.isPlayerTurn()) {
            console.log("Not black's turn, returning");
            return null;
        }

        console.log("makeAutomaticMove called. Current turn:", this.chess.turn());
        
        const possibleMoves = this.getPossibleMoves();
        console.log("Possible moves for black:", possibleMoves.length);

        if (possibleMoves.length === 0) {
            return null;
        }

        const selectedMove = this.selectRandomMove();
        console.log("Selected move:", selectedMove);

        // Wait for delay before executing move
        await new Promise(resolve => setTimeout(resolve, this.#moveDelay));

        return this.executeMove(selectedMove);
    }

    /**
     * Changes move delay
     * @param {number} delay - New delay in ms
     */
    setMoveDelay(delay) {
        this.#moveDelay = delay;
    }

    /**
     * Gets current delay
     * @returns {number} Delay in ms
     */
    getMoveDelay() {
        return this.#moveDelay;
    }
}
