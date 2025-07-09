import { INPUT_EVENT_TYPE, COLOR } from "../cm-chessboard-master/src/Chessboard.js";
import { FenGenerator } from "./FenGenerator.js";
import { BlackPlayerController } from "./BlackPlayerController.js";

export class PawnRaceGameController {
    #chess;
    #board;
    #movesTableController;
    #fenGenerator;
    #blackPlayerController;

    constructor(chess, board, movesTableController) {
        this.#chess = chess;
        this.#board = board;
        this.#movesTableController = movesTableController;
        this.#fenGenerator = new FenGenerator();
        this.#blackPlayerController = new BlackPlayerController(chess, board, this.onBlackMoved.bind(this));
    }

    startGame() {
        this.setupNewGame();
    }

    setupNewGame() {
        const fen = this.#fenGenerator.generatePawnRaceFen();
        this.#chess.load(fen);
        this.#board.setPosition(this.#chess.fen(), false);
        this.#movesTableController.clearMoves();
        this.#board.enableMoveInput(this.handleInput.bind(this), COLOR.white);
    }

    resetGame() {
        this.setupNewGame();
    }

    handleInput(event) {
        if (event.type === INPUT_EVENT_TYPE.moveInputStarted) {
            return true; // Allow moving any piece
        }
        if (event.type === INPUT_EVENT_TYPE.validateMoveInput) {
            const move = this.#chess.move({ from: event.squareFrom, to: event.squareTo });
            if (move) {
                this.#board.setPosition(this.#chess.fen());
                this.#movesTableController.addMove(move, this.#chess.turn() === 'b');
                this.#checkWinCondition(move.to, 'w');
                if (this.#chess.turn() === 'b') {
                    this.#blackPlayerController.makeMove();
                }
            }
            return !!move;
        }
    }

    onBlackMoved(move) {
        this.#movesTableController.addMove(move, true);
        this.#checkWinCondition(move.to, 'b');
        this.#board.setPosition(this.#chess.fen());
    }

    #checkWinCondition(toSquare, color) {
        const rank = toSquare.charAt(1);
        if ((color === 'w' && rank === '8') || (color === 'b' && rank === '1')) {
            this.#board.disableMoveInput();
            setTimeout(() => {
                const winner = color === 'w' ? 'White' : 'Black';
                alert(`${winner} wins the pawn race!`);
            }, 300);
        }
    }
}
