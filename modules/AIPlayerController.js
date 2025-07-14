import { PlayerController } from "./PlayerController.js";

export class AIPlayerController extends PlayerController {
    /**
     * @param {Chess} chess
     * @param {Chessboard} board
     * @param {string} color
     * @param {MovesTableController} movesTableController
     * @param {function} strategy - Function that receives game and returns a move
     */
    constructor(chess, board, color, movesTableController = null, strategy = null) {
        super(chess, board, color, movesTableController);
        this.strategy = strategy || (() => null);
    }
    async makeMove() {
        // Call the strategy function to get a move
        return Promise.resolve(this.strategy(this.chess));
    }
}
