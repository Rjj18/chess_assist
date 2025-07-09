/**
 * UI Controller
 * Manages user interface elements and event listeners for the main game.
 * @module UIController
 */
export class UIController {
    #gameController;

    /**
     * @param {GameController} gameController - The main game controller.
     */
    constructor(gameController) {
        this.#gameController = gameController;
    }

    /**
     * Initializes UI event listeners.
     */
    initializeUI() {
        this.#setupButton("resetButton", () => this.#gameController.resetGame());
        this.#setupButton("undoButton", () => this.#gameController.undoMove());
        this.#setupButton("forceBlackMoveButton", () => this.#handleForceBlackMove());
    }

    /**
     * Helper to set up a button's click listener.
     * @param {string} id - The button's element ID.
     * @param {function} action - The function to execute on click.
     * @private
     */
    #setupButton(id, action) {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener("click", action);
        } else {
            console.warn(`Button with ID "${id}" not found.`);
        }
    }

    /**
     * Handles the "Force Black Move" button click.
     * @private
     */
    async #handleForceBlackMove() {
        const blackPlayer = this.#gameController.getBlackPlayerController();
        if (blackPlayer && blackPlayer.isPlayerTurn()) {
            await blackPlayer.makeAutomaticMove();
        } else {
            console.log("Not black's turn or black player not available.");
        }
    }

    /**
     * Exposes controller functions to the global window object for debugging.
     */
    exposeGlobalFunctions() {
        window.resetGame = () => this.#gameController.resetGame();
        window.undoMove = () => this.#gameController.undoMove();
        window.forceBlackMove = () => this.#handleForceBlackMove();
        window.getGameInfo = () => this.#gameController.getGameInfo();
    }
}