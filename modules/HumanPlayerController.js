import { PlayerController } from "./PlayerController.js";

export class HumanPlayerController extends PlayerController {
    constructor(chess, board, color, movesTableController = null) {
        super(chess, board, color, movesTableController);
    }
    async makeMove() {
        // Should be implemented by UI event system
        return Promise.reject("Human move input not implemented in base class");
    }
}
