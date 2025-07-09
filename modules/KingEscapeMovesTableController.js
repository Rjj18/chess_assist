/**
 * King Escape Moves Table Controller
 * Manages the moves table UI for the King Escape game mode.
 * @module KingEscapeMovesTableController
 */
export class KingEscapeMovesTableController {
    #tableBody;
    #moveCounter = 0;

    /**
     * @param {string} tableBodyId The ID of the table body element.
     */
    constructor(tableBodyId) {
        this.#tableBody = document.getElementById(tableBodyId);
        if (!this.#tableBody) {
            console.error(`Element with ID "${tableBodyId}" not found.`);
        }
    }

    /**
     * Adds a new move to the table.
     * @param {object} move - The move object from chess.js, containing the SAN.
     * @param {boolean} isInCheck - Whether the king is in check after this move.
     */
    addMove(move, isInCheck = false) {
        if (!this.#tableBody || !move) return;

        this.#moveCounter++;
        const row = document.createElement("tr");
        row.id = `king-move-${this.#moveCounter}`;
        
        let moveDisplay = move.san;
        if (isInCheck) {
            moveDisplay += ' <span class="check-indicator">Check!</span>';
        }
        
        row.innerHTML = `<td>${this.#moveCounter}</td><td>${moveDisplay}</td>`;
        this.#tableBody.appendChild(row);

        this.#scrollToLastMove();
    }

    /**
     * Adds a check message when a move is rejected due to check.
     * @param {string} fromSquare - The square the king tried to move from.
     * @param {string} toSquare - The square the king tried to move to.
     */
    addCheckMessage(fromSquare, toSquare) {
        if (!this.#tableBody) return;

        this.#moveCounter++;
        const row = document.createElement("tr");
        row.id = `king-move-${this.#moveCounter}`;
        row.className = "check-warning-row";
        
        const moveAttempt = `${fromSquare}-${toSquare}`;
        const checkMessage = `<span class="check-indicator">Check! Cannot move to ${toSquare}</span>`;
        
        row.innerHTML = `<td>${this.#moveCounter}</td><td>${checkMessage}</td>`;
        this.#tableBody.appendChild(row);

        this.#scrollToLastMove();
    }

    /**
     * Clears all moves from the table.
     */
    clearMoves() {
        if (this.#tableBody) {
            this.#tableBody.innerHTML = '';
        }
        this.#moveCounter = 0;
    }

    /**
     * Scrolls the container to the latest move.
     * @private
     */
    #scrollToLastMove() {
        const container = this.#tableBody.closest('.moves-table-container');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }
}