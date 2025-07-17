/**
 * Module for controlling the Lone Knight game flow.
 * @module LoneKnightGameController
 */

import { INPUT_EVENT_TYPE, COLOR } from "../cm-chessboard-master/src/Chessboard.js";
import { LoneKnightFenGenerator } from "./LoneKnightFenGenerator.js";
import { BaseGameController } from "./BaseGameController.js";

export class LoneKnightGameController extends BaseGameController {
    #fenGenerator;
    #optimalMoves = 0;
    #currentMoves = 0;

    /**
     * @param {Chess} chess - The chess.js instance.
     * @param {Chessboard} board - The visual board instance.
     * @param {LoneKnightMovesTableController} movesTableController - The moves table controller.
     */
    constructor(chess, board, movesTableController) {
        super(chess, board, movesTableController);
        this.#fenGenerator = new LoneKnightFenGenerator();
    }

    /**
     * Sets up a new puzzle.
     */
    setupNewGame() {
        const fenData = this.#fenGenerator.generateFen();
        this.#optimalMoves = fenData.optimalMoves;
        this.#currentMoves = 0;
        
        console.log("Generated FEN for Lone Knight:", fenData.fen);
        console.log("Optimal moves:", this.#optimalMoves);
        console.log("Knight starts at:", fenData.knightStart);
        console.log("Pawn positions:", fenData.pawnPositions);
        
        // Update the challenge display
        this.#updateChallengeDisplay();
        
        // First disable any existing move input
        try {
            this.board.disableMoveInput();
        } catch (e) {
            // Move input might not be enabled, ignore error
        }
        
        // Load the new position into chess.js
        this.chess.load(fenData.fen);
        console.log("Chess.js FEN after load:", this.chess.fen());
        
        // Clear moves table first
        this.movesTableController.clearMoves();
        
        // Set the board position with animation disabled for complete refresh
        this.board.setPosition(this.chess.fen(), false);
        
        // Wait a small amount of time to ensure the position is set
        setTimeout(() => {
            this.board.enableMoveInput(this.handleInput.bind(this), COLOR.white);
        }, 100);
    }

    /**
     * Updates the challenge display with current and optimal moves.
     * @private
     */
    #updateChallengeDisplay() {
        const challengeElement = document.getElementById('loneKnightChallenge');
        if (challengeElement) {
            const performance = this.#currentMoves <= this.#optimalMoves ? 
                '<span class="optimal-performance">🎯 Optimal!</span>' : 
                '<span class="sub-optimal-performance">📈 Can do better</span>';
            
            challengeElement.innerHTML = `
                <div class="challenge-info">
                    <div class="optimal-moves">Target: ${this.#optimalMoves} moves</div>
                    <div class="current-moves">Current: ${this.#currentMoves} moves</div>
                    ${this.#currentMoves > 0 ? performance : ''}
                </div>
            `;
        }
    }

    /**
     * Main handler for board input events.
     * @param {object} event - The board event.
     * @returns {boolean}
     */
    handleInput(event) {
        switch (event.type) {
            case INPUT_EVENT_TYPE.moveInputStarted:
                // Only allow moving the white Knight (note: piece notation is lowercase)
                return event.piece === 'wn';
            case INPUT_EVENT_TYPE.validateMoveInput:
                console.log("Chess.js thinks pieces are at:", JSON.stringify(this.chess.board()));
                console.log("Trying to move from", event.squareFrom, "to", event.squareTo);
                
                // Try the move first
                const move = this.chess.move({ from: event.squareFrom, to: event.squareTo });
                if (move) {
                    // In Lone Knight, we want to keep it white's turn so the knight can move continuously
                    // Manually flip the turn back to white after the move
                    const currentFen = this.chess.fen();
                    const fenParts = currentFen.split(' ');
                    fenParts[1] = 'w'; // Force white to move
                    const newFen = fenParts.join(' ');
                    this.chess.load(newFen);
                    
                    // Move succeeded - update moves table and increment counter
                    this.#currentMoves++;
                    this.movesTableController.addMove(move, false);
                    this.#updateChallengeDisplay();
                    
                    // Check if knight captured a pawn
                    if (move.captured) {
                        this.#checkWinCondition();
                    }
                    
                    // Let the visual board handle the move animation, then sync
                    setTimeout(() => {
                        this.board.setPosition(this.chess.fen(), false);
                    }, 50);
                } else {
                    // Move was rejected - check if it's because the move is invalid
                    console.log("Move rejected by chess.js:", event.squareFrom, "to", event.squareTo);
                    console.log("Current chess.js FEN:", this.chess.fen());
                    
                    // If the move was rejected and it's a knight move, show illegal move message
                    if (event.piece === 'wn') {
                        this.movesTableController.addIllegalMoveMessage(event.squareFrom, event.squareTo);
                    }
                }
                return !!move; // Return true if move was valid, false otherwise
            default:
                return true;
        }
    }

    /**
     * Checks if the win condition (all pawns captured) is met.
     * @private
     */
    #checkWinCondition() {
        // Check if there are any black pawns left on the board
        const position = this.chess.fen();
        const boardPart = position.split(' ')[0];
        
        // Count black pawns in the FEN string
        const blackPawnCount = (boardPart.match(/p/g) || []).length;
        
        if (blackPawnCount === 0) {
            this.board.disableMoveInput();
            // Use a small timeout to allow the move animation to finish
            setTimeout(() => {
                const performance = this.#currentMoves <= this.#optimalMoves ? 
                    `🎯 Perfect! You solved it in ${this.#currentMoves} moves (optimal: ${this.#optimalMoves})!` :
                    `✅ Good job! You solved it in ${this.#currentMoves} moves. The optimal solution was ${this.#optimalMoves} moves. Try again for a better score!`;
                
                alert(performance);
                console.log("Lone Knight: Win condition met!");
                console.log(`Player moves: ${this.#currentMoves}, Optimal: ${this.#optimalMoves}`);
            }, 300);
        }
    }
}
