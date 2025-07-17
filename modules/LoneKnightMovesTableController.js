import { BaseMovesTableController } from "./BaseMovesTableController.js";

/**
 * Lone Knight Moves Table Controller
 * Manages the moves table UI for the Lone Knight game mode.
 * @module LoneKnightMovesTableController
 */
export class LoneKnightMovesTableController extends BaseMovesTableController {
    #moveCounter = 0;

    /**
     * @param {string} tableBodyId The ID of the table body element.
     */
    constructor(tableBodyId) {
        super(tableBodyId);
    }

    /**
     * Adds a new move to the table.
     * @param {object} move - The move object from chess.js, containing the SAN.
     * @param {boolean} isIllegal - Whether the move was illegal.
     */
    addMove(move, isIllegal = false) {
        if (!this.tableBody || !move) return;
        this.#moveCounter++;
        const row = document.createElement("tr");
        row.id = `lone-knight-move-${this.#moveCounter}`;
        
        let moveDisplay = move.san;
        if (isIllegal) {
            moveDisplay += ' <span class="illegal-indicator">Illegal!</span>';
            row.className = "illegal-warning-row";
        }
        
        row.innerHTML = `<td>${this.#moveCounter}</td><td>${moveDisplay}</td>`;
        this.tableBody.appendChild(row);
        this.#scrollToLastMove();
    }

    /**
     * Adds an illegal move message when a move is rejected.
     * @param {string} fromSquare - The square the knight tried to move from.
     * @param {string} toSquare - The square the knight tried to move to.
     */
    addIllegalMoveMessage(fromSquare, toSquare) {
        if (!this.tableBody) return;
        this.#moveCounter++;
        const row = document.createElement("tr");
        row.id = `lone-knight-move-${this.#moveCounter}`;
        row.className = "illegal-warning-row";
        const moveAttempt = `${fromSquare}-${toSquare}`;
        const illegalMessage = `<span class="illegal-indicator">Illegal Move! Cannot move to ${toSquare}</span>`;
        row.innerHTML = `<td>${this.#moveCounter}</td><td>${illegalMessage}</td>`;
        this.tableBody.appendChild(row);
        this.#scrollToLastMove();
    }

    /**
     * Clears all moves from the table.
     */
    clearMoves() {
        if (this.tableBody) {
            this.tableBody.innerHTML = '';
        }
        this.#moveCounter = 0;
    }

    /**
     * Scrolls the container to the latest move.
     * @private
     */
    #scrollToLastMove() {
        const container = this.tableBody.closest('.moves-table-container');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }
}
