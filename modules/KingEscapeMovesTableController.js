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
     */
    addMove(move) {
        if (!this.#tableBody || !move) return;

        this.#moveCounter++;
        const row = document.createElement("tr");
        row.id = `king-move-${this.#moveCounter}`;
        row.innerHTML = `<td>${this.#moveCounter}</td><td>${move.san}</td>`;
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