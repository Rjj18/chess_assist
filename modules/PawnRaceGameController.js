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
        // Remove win message if it exists
        const oldMessage = document.getElementById('pawnRaceWinMessage');
        if (oldMessage && oldMessage.parentElement) {
            oldMessage.parentElement.removeChild(oldMessage);
        }
        // Always disable move input before enabling to avoid error
        if (this.#board && this.#board.disableMoveInput) {
            this.#board.disableMoveInput();
        }
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
            const fromRank = event.squareFrom[1];
            const toRank = event.squareTo[1];
            const piece = this.#chess.get(event.squareFrom)?.type;
            // If a white pawn is moving to the last rank, allow promotion, then end the game
            if (piece === 'p' && fromRank === '7' && toRank === '8') {
                const move = this.#chess.move({ from: event.squareFrom, to: event.squareTo, promotion: 'q' });
                if (move && move.flags.includes('p')) {
                    this.#board.setPosition(this.#chess.fen());
                    this.#movesTableController.addMove(move, false); // false for white
                    this.#showWinMessage('White');
                    this.#board.disableMoveInput();
                    return false;
                }
            }
            // If a black pawn is moving to the first rank, allow promotion, then end the game
            if (piece === 'p' && fromRank === '2' && toRank === '1') {
                const move = this.#chess.move({ from: event.squareFrom, to: event.squareTo, promotion: 'q' });
                if (move && move.flags.includes('p')) {
                    this.#board.setPosition(this.#chess.fen());
                    this.#movesTableController.addMove(move, true); // true for black
                    this.#showWinMessage('Black');
                    this.#board.disableMoveInput();
                    return false;
                }
            }
            // Now try the move as normal
            const move = this.#chess.move({ from: event.squareFrom, to: event.squareTo });
            if (move) {
                this.#board.setPosition(this.#chess.fen());
                this.#movesTableController.addMove(move, this.#chess.turn() === 'b');
                // End the game if a pawn reaches the last rank without promotion (shouldn't happen, but for safety)
                if (move.piece === 'p' && ((move.color === 'w' && move.to[1] === '8') || (move.color === 'b' && move.to[1] === '1'))) {
                    this.#showWinMessage(move.color === 'w' ? 'White' : 'Black');
                    this.#board.disableMoveInput();
                    return false;
                }
                if (this.#chess.turn() === 'b') {
                    this.#blackPlayerController.makeMove();
                }
            }
            return !!move;
        }
    }

    onBlackMoved(move) {
        this.#movesTableController.addMove(move, true);
        // Debug: log move details for black
        if (move.piece === 'p' && move.color === 'b') {
            console.log('[DEBUG] Black pawn move:', move);
        }
        // End the game if black just promoted or reached the first rank
        if (
            (move.piece === 'p' && move.color === 'b' && move.flags.includes('p')) ||
            (move.piece === 'p' && move.color === 'b' && move.to[1] === '1')
        ) {
            console.log('[DEBUG] Black promotion detected, ending game. Move:', move);
            this.#showWinMessage('Black');
            this.#board.disableMoveInput();
            return;
        }
        this.#board.setPosition(this.#chess.fen());
    }

    #checkWinCondition(move, isPromotion = false) {
        // End the game if a pawn reaches the last rank (promotion) or is promoted
        if (
            (move.piece === 'p' && ((move.color === 'w' && move.to[1] === '8') || (move.color === 'b' && move.to[1] === '1'))) ||
            isPromotion
        ) {
            this.#board.disableMoveInput();
            setTimeout(() => {
                const winner = move.color === 'w' ? 'White' : 'Black';
                const colorClass = move.color === 'w' ? 'white-message' : 'black-message';
                let messageDiv = document.getElementById('pawnRaceWinMessage');
                if (!messageDiv) {
                    messageDiv = document.createElement('div');
                    messageDiv.id = 'pawnRaceWinMessage';
                    messageDiv.style.marginTop = '1em';
                    messageDiv.style.fontWeight = 'bold';
                    messageDiv.style.fontSize = '1.2em';
                    // Only append if board/view/element exist, otherwise append to body
                    if (this.#board && this.#board.view && this.#board.view.element && this.#board.view.element.parentElement) {
                        this.#board.view.element.parentElement.appendChild(messageDiv);
                    } else {
                        document.body.appendChild(messageDiv);
                    }
                }
                messageDiv.className = colorClass;
                messageDiv.textContent = `${winner} wins the pawn race by promotion!`;
            }, 300);
        }
    }

    #showWinMessage(winner) {
        setTimeout(() => {
            const colorClass = winner === 'White' ? 'white-message' : 'black-message';
            let messageDiv = document.getElementById('pawnRaceWinMessage');
            if (!messageDiv) {
                messageDiv = document.createElement('div');
                messageDiv.id = 'pawnRaceWinMessage';
                messageDiv.style.marginTop = '1em';
                messageDiv.style.fontWeight = 'bold';
                messageDiv.style.fontSize = '1.2em';
                if (this.#board && this.#board.view && this.#board.view.element && this.#board.view.element.parentElement) {
                    this.#board.view.element.parentElement.appendChild(messageDiv);
                } else {
                    document.body.appendChild(messageDiv);
                }
            }
            messageDiv.className = colorClass;
            messageDiv.textContent = `${winner} wins the pawn race by promotion!`;
        }, 300);
    }
}
