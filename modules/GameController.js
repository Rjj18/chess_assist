/**
 * Module for controlling the general chess game flow
 * @module GameController
 */

import { COLOR, INPUT_EVENT_TYPE, FEN } from "../cm-chessboard-master/src/Chessboard.js";
import { BlackPlayerController } from "./BlackPlayerController.js";

export class GameController {
    #chess;
    #board;
    #blackPlayerController;
    #movesTableController;

    /**
     * @param {Chess} chess - Chess.js instance
     * @param {Chessboard} board - Visual board instance
     * @param {MovesTableController} movesTableController - Moves table controller
     */
    constructor(chess, board, movesTableController = null) {
        this.#chess = chess;
        this.#board = board;
        this.#movesTableController = movesTableController;
        // Creates the black player controller internally
        this.#blackPlayerController = new BlackPlayerController(chess, board, 800, movesTableController);
    }

    /**
     * Main handler for board input events
     * @param {object} event - Board event
     * @returns {boolean} Whether the event should be processed
     */
    handleInput(event) {
        console.log("Input Event:", event);
        
        switch (event.type) {
            case INPUT_EVENT_TYPE.moveInputStarted:
                return this.#handleMoveStarted(event);
                
            case INPUT_EVENT_TYPE.validateMoveInput:
                return this.#handleMoveValidation(event);
                
            case INPUT_EVENT_TYPE.moveInputFinished:
                return this.#handleMoveFinished(event);
                
            default:
                return true;
        }
    }

    /**
     * Handles the start of a move
     * @param {object} event - Board event
     * @returns {boolean}
     * @private
     */
    #handleMoveStarted(event) {
        // Allow move to start
        return true;
    }

    /**
     * Validates if a move is legal
     * @param {object} event - Board event
     * @returns {boolean} Whether the move is valid
     * @private
     */
    #handleMoveValidation(event) {
        const move = {
            from: event.squareFrom,
            to: event.squareTo,
            promotion: event.promotion || 'q' // Default promotion to queen
        };
        
        // Try to make the move in the chess object
        const moveResult = this.#chess.move(move);
        
        if (moveResult) {
            console.log("Legal move:", moveResult);
            
            // Add move to table if controller is available
            if (this.#movesTableController) {
                const color = moveResult.color === 'w' ? 'white' : 'black';
                this.#movesTableController.addMove(moveResult.san, color);
            }
            
            return true;
        } else {
            console.log("Illegal move:", move);
            return false;
        }
    }

    /**
     * Processes move completion
     * @param {object} event - Board event
     * @returns {boolean}
     * @private
     */
    #handleMoveFinished(event) {
        console.log("Move finished. Current turn:", this.#chess.turn());
        
        // Update visual board position
        this.#board.setPosition(this.#chess.fen());
        
        // Check if game ended
        if (this.#checkGameEnd()) {
            return true;
        }
        
        // If it's black's turn, trigger automatic move
        if (this.#chess.turn() === 'b') {
            setTimeout(() => {
                this.#blackPlayerController.makeAutomaticMove().then((result) => {
                    if (result) {
                        console.log("Black move executed:", result);
                        // Check game end again after black move
                        this.#checkGameEnd();
                    }
                });
            }, 100);
        }
        
        return true;
    }

    /**
     * Checks if the game has ended and handles end conditions
     * @returns {boolean} Whether the game has ended
     * @private
     */
    #checkGameEnd() {
        if (this.#chess.in_checkmate()) {
            const winner = this.#chess.turn() === 'w' ? 'Black' : 'White';
            console.log(`Game over - Checkmate! ${winner} wins!`);
            this.#board.disableMoveInput();
            return true;
        }
        
        if (this.#chess.in_draw()) {
            console.log("Game over - Draw!");
            this.#board.disableMoveInput();
            return true;
        }
        
        if (this.#chess.in_stalemate()) {
            console.log("Game over - Stalemate!");
            this.#board.disableMoveInput();
            return true;
        }
        
        return false;
    }

    /**
     * Starts the game
     */
    startGame() {
        console.log("Starting new game");
        this.#board.enableMoveInput(this.handleInput.bind(this), COLOR.white);
    }

    /**
     * Resets the game to initial state
     */
    resetGame() {
        console.log("GameController.resetGame() called");
        this.#chess.reset();
        this.#board.setPosition(FEN.start);
        
        // Disable move input first, then re-enable it
        this.#board.disableMoveInput();
        this.#board.enableMoveInput(this.handleInput.bind(this), COLOR.white);
        
        // Clear moves table
        if (this.#movesTableController) {
            console.log("Calling movesTableController.clearMoves()");
            this.#movesTableController.clearMoves();
        } else {
            console.error("MovesTableController not found when resetting game");
        }
        
        console.log("Game reset");
    }

    /**
     * Undoes the last move
     * @returns {boolean} Whether the move was successfully undone
     */
    undoMove() {
        console.log("GameController.undoMove() called");
        const move = this.#chess.undo();
        if (move) {
            this.#board.setPosition(this.#chess.fen());
            
            // Disable move input first, then re-enable it for the correct player
            this.#board.disableMoveInput();
            const currentPlayer = this.#chess.turn() === 'w' ? COLOR.white : COLOR.black;
            this.#board.enableMoveInput(this.handleInput.bind(this), currentPlayer);
            
            // Remove move from table
            if (this.#movesTableController) {
                console.log("Calling movesTableController.removeLastMove()");
                this.#movesTableController.removeLastMove();
            } else {
                console.error("MovesTableController not found when undoing move");
            }
            
            console.log("Move undone:", move);
            return true;
        } else {
            console.log("No move to undo");
        }
        return false;
    }

    /**
     * Gets current game information
     * @returns {object} Game state information
     */
    getGameInfo() {
        return {
            turn: this.#chess.turn(),
            isCheck: this.#chess.in_check(),
            isCheckmate: this.#chess.in_checkmate(),
            isDraw: this.#chess.in_draw(),
            isStalemate: this.#chess.in_stalemate(),
            fen: this.#chess.fen(),
            history: this.#chess.history(),
            ascii: this.#chess.ascii()
        };
    }

    /**
     * Gets the black player controller instance
     * @returns {BlackPlayerController} The black player controller
     */
    getBlackPlayerController() {
        return this.#blackPlayerController;
    }
}
