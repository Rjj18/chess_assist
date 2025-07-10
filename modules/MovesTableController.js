/**
 * Moves table controller
 * Responsible for displaying and updating the table with game moves
 */
export class MovesTableController {
    #tableBody;
    #moves;
    #currentMoveNumber;

    constructor() {
        this.#moves = [];
        this.#currentMoveNumber = 1;
        this.#initializeElements();
    }

    /**
     * Initializes necessary DOM elements
     * @private
     */
    #initializeElements() {
        this.#tableBody = document.getElementById('pawnRaceMovesTableBody');
        if (!this.#tableBody) {
            console.error('Element pawnRaceMovesTableBody not found');
        }
    }

    /**
     * Adds a new move to the table
     * @param {string} move - The move in algebraic notation (e.g., "e4", "Nf3", "O-O")
     * @param {string} color - Player color ("white" or "black")
     */
    addMove(move, color) {
        if (!this.#tableBody) return;

        // If it's a white move, create a new row
        if (color === 'white') {
            const row = document.createElement('tr');
            row.id = `move-${this.#currentMoveNumber}`;
            
            row.innerHTML = `
                <td>${this.#currentMoveNumber}</td>
                <td class="white-move">${move}</td>
                <td class="black-move">-</td>
            `;
            
            this.#tableBody.appendChild(row);
            this.#moves.push({ number: this.#currentMoveNumber, white: move, black: null });
        } 
        // If it's a black move, update the existing row
        else if (color === 'black') {
            const currentRow = document.getElementById(`move-${this.#currentMoveNumber}`);
            if (currentRow) {
                const blackCell = currentRow.querySelector('.black-move');
                if (blackCell) {
                    blackCell.textContent = move;
                }
                
                // Update the moves array
                const moveIndex = this.#moves.findIndex(m => m.number === this.#currentMoveNumber);
                if (moveIndex !== -1) {
                    this.#moves[moveIndex].black = move;
                }
            }
            
            this.#currentMoveNumber++;
        }

        // Auto scroll to the last move
        this.#scrollToLastMove();
    }

    /**
     * Removes the last move from the table
     * @returns {boolean} True if a move was removed, false otherwise
     */
    removeLastMove() {
        console.log("MovesTableController.removeLastMove() called");
        if (!this.#tableBody || this.#moves.length === 0) {
            console.log("No moves to remove or table body not found");
            return false;
        }

        const lastMove = this.#moves[this.#moves.length - 1];
        console.log("Last move:", lastMove);
        
        // If the last move has a black move, remove only it
        if (lastMove.black) {
            const row = document.getElementById(`move-${lastMove.number}`);
            if (row) {
                const blackCell = row.querySelector('.black-move');
                if (blackCell) {
                    blackCell.textContent = '-';
                    console.log("Removed black move from row", lastMove.number);
                }
            }
            lastMove.black = null;
        }
        // If it only has a white move, remove the entire row
        else if (lastMove.white) {
            const row = document.getElementById(`move-${lastMove.number}`);
            if (row) {
                row.remove();
                console.log("Removed entire row", lastMove.number);
            }
            this.#moves.pop();
            this.#currentMoveNumber--;
        }

        return true;
    }

    /**
     * Clears the entire moves table
     */
    clearMoves() {
        console.log("MovesTableController.clearMoves() called");
        if (this.#tableBody) {
            this.#tableBody.innerHTML = '';
            console.log("Table body cleared");
        } else {
            console.error("Table body not found when trying to clear moves");
        }
        this.#moves = [];
        this.#currentMoveNumber = 1;
        console.log("Moves array reset, current move number:", this.#currentMoveNumber);
    }

    /**
     * Auto scrolls to the last move
     * @private
     */
    #scrollToLastMove() {
        const container = this.#tableBody.closest('.moves-table-container');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    /**
     * Gets all moves in string format
     * @returns {string} Moves in PGN notation
     */
    getMovesAsString() {
        return this.#moves.map(move => {
            if (move.black) {
                return `${move.number}. ${move.white} ${move.black}`;
            } else {
                return `${move.number}. ${move.white}`;
            }
        }).join(' ');
    }

    /**
     * Gets the moves array
     * @returns {Array} Array with the moves
     */
    getMoves() {
        return [...this.#moves];
    }

    /**
     * Highlights a specific move in the table
     * @param {number} moveNumber - Move number to highlight
     */
    highlightMove(moveNumber) {
        // Remove previous highlight
        const previousHighlight = this.#tableBody.querySelector('.highlighted');
        if (previousHighlight) {
            previousHighlight.classList.remove('highlighted');
        }

        // Add new highlight
        const row = document.getElementById(`move-${moveNumber}`);
        if (row) {
            row.classList.add('highlighted');
        }
    }
}
