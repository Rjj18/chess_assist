/**
 * Interface for player controllers
 * @module PlayerController
 */

/**
 * Abstract base class for player controllers
 * Can be extended to create different types of players (human, AI, etc.)
 */
export class PlayerController {
    #chess;
    #board;
    #color;
    #movesTableController;

    /**
     * @param {Chess} chess - Chess.js instance
     * @param {Chessboard} board - Board instance
     * @param {string} color - Piece color ('w' for white, 'b' for black)
     * @param {MovesTableController} movesTableController - Moves table controller (optional)
     */
    constructor(chess, board, color, movesTableController = null) {
        if (new.target === PlayerController) {
            throw new Error("PlayerController is an abstract class");
        }
        this.#chess = chess;
        this.#board = board;
        this.#color = color;
        this.#movesTableController = movesTableController;
    }

    /**
     * Checks if it's this player's turn
     * @returns {boolean} True if it's this player's turn
     */
    isPlayerTurn() {
        return this.#chess.turn() === this.#color;
    }

    /**
     * Gets all possible moves for this player
     * @returns {Array<string>} Array of possible moves in SAN notation
     */
    getPossibleMoves() {
        if (!this.isPlayerTurn()) {
            return [];
        }
        return this.#chess.moves();
    }

    /**
     * Gets the chess instance
     * @returns {Chess} Chess.js instance
     */
    get chess() {
        return this.#chess;
    }

    /**
     * Gets the board instance
     * @returns {Chessboard} Board instance
     */
    get board() {
        return this.#board;
    }

    /**
     * Gets the player color
     * @returns {string} Player color ('w' or 'b')
     */
    get color() {
        return this.#color;
    }

    /**
     * Abstract method for making a move - must be implemented by subclass
     * @returns {Promise<object|null>} Promise that resolves with move result
     */
    async makeMove() {
        throw new Error("makeMove() must be implemented by subclass");
    }

    /**
     * Executes a specific move
     * @param {string} move - Move in SAN notation
     * @returns {object|null} Move result or null if invalid
     */
    executeMove(move) {
        if (!this.isPlayerTurn()) {
            console.log(`Not the turn of ${this.#color === 'w' ? 'white' : 'black'}`);
            return null;
        }

        const moveResult = this.#chess.move(move);
        
        if (moveResult) {
            console.log(`Move by ${this.#color === 'w' ? 'white' : 'black'} executed:`, moveResult);
            this.#board?.setPosition(this.#chess.fen());
            
            // Add move to table if controller is available
            if (this.#movesTableController) {
                const color = moveResult.color === 'w' ? 'white' : 'black';
                this.#movesTableController.addMove(moveResult.san, color);
            }
            
            return moveResult;
        } else {
            console.log(`Error executing move by ${this.#color === 'w' ? 'white' : 'black'}:`, move);
            return null;
        }
    }

    /**
     * Checks game state
     * @returns {object} Object with game state information
     */
    checkGameState() {
        return {
            isCheck: this.#chess.in_check(),
            isCheckmate: this.#chess.in_checkmate(),
            isStalemate: this.#chess.in_stalemate(),
            isDraw: this.#chess.in_draw(),
            turn: this.#chess.turn()
        };
    }
}
