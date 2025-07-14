/**
 * Abstract base class for moves table controllers.
 */
export class BaseMovesTableController {
    constructor(tableBodyId) {
        if (new.target === BaseMovesTableController) {
            throw new Error("BaseMovesTableController is abstract");
        }
        this.tableBody = document.getElementById(tableBodyId);
        if (!this.tableBody) {
            console.error(`Element with ID "${tableBodyId}" not found.`);
        }
    }
    addMove() {
        throw new Error("addMove() must be implemented by subclass");
    }
    clearMoves() {
        if (this.tableBody) {
            this.tableBody.innerHTML = "";
        }
    }
}
