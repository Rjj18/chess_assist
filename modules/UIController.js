/**
 * Module for controlling the user interface
 * @module UIController
 */

export class UIController {
    #gameController;
    #elements;

    /**
     * @param {GameController} gameController - Game controller instance
     */
    constructor(gameController) {
        this.#gameController = gameController;
        this.#elements = {};
        this.#initializeElements();
        this.#setupEventListeners();
    }

    /**
     * Initializes DOM element references
     * @private
     */
    #initializeElements() {
        this.#elements = {
            // Game controls
            resetButton: document.getElementById("resetButton"),
            undoButton: document.getElementById("undoButton"),
            forceBlackMoveButton: document.getElementById("forceBlackMoveButton"),
            
            // Main element
            board: document.getElementById("board")
        };

        // Check if all required elements exist
        this.#validateElements();
    }

    /**
     * Validates that required DOM elements exist
     * @private
     */
    #validateElements() {
        const requiredElements = ['resetButton', 'board'];
        
        for (const elementName of requiredElements) {
            if (!this.#elements[elementName]) {
                throw new Error(`Required element not found: ${elementName}`);
            }
        }
        
        // Warn about optional elements not found
        const optionalElements = [
            'undoButton', 'forceBlackMoveButton'
        ];
        
        for (const elementName of optionalElements) {
            if (!this.#elements[elementName]) {
                console.warn(`Optional element not found: ${elementName}`);
            }
        }
    }

    /**
     * Sets up all interface event listeners
     * @private
     */
    #setupEventListeners() {
        this.#setupGameControls();
    }

    /**
     * Sets up game controls (reset, undo, etc.)
     * @private
     */
    #setupGameControls() {
        // Reset button
        if (this.#elements.resetButton) {
            this.#elements.resetButton.addEventListener("click", () => {
                this.#handleResetGame();
            });
        }

        // Undo move button
        if (this.#elements.undoButton) {
            this.#elements.undoButton.addEventListener("click", () => {
                this.#handleUndoMove();
            });
        }

        // Force black move button
        if (this.#elements.forceBlackMoveButton) {
            this.#elements.forceBlackMoveButton.addEventListener("click", () => {
                this.#handleForceBlackMove();
            });
        }
    }

    /**
     * Handles game reset event
     * @private
     */
    #handleResetGame() {
        try {
            this.#gameController.resetGame();
            this.#showMessage("Game reset successfully!", "success");
        } catch (error) {
            console.error("Error resetting game:", error);
            this.#showMessage("Error resetting game", "error");
        }
    }

    /**
     * Handles undo move event
     * @private
     */
    #handleUndoMove() {
        try {
            const success = this.#gameController.undoMove();
            if (success) {
                this.#showMessage("Move undone successfully!", "success");
            } else {
                this.#showMessage("No moves to undo", "warning");
            }
        } catch (error) {
            console.error("Error undoing move:", error);
            this.#showMessage("Error undoing move", "error");
        }
    }

    /**
     * Handles force black move event
     * @private
     */
    #handleForceBlackMove() {
        try {
            this.#gameController.getBlackPlayerController().makeAutomaticMove().then((result) => {
                if (result) {
                    this.#showMessage("Black move executed!", "success");
                } else {
                    this.#showMessage("Could not execute black move", "warning");
                }
            });
        } catch (error) {
            console.error("Error forcing black move:", error);
            this.#showMessage("Error executing black move", "error");
        }
    }

    /**
     * Displays a message to the user
     * @param {string} message - Message to display
     * @param {string} type - Message type ('success', 'error', 'info', 'warning')
     * @private
     */
    #showMessage(message, type = 'info') {
        // Currently uses console, but can be expanded to toast notifications
        const styles = {
            success: 'color: green; font-weight: bold;',
            error: 'color: red; font-weight: bold;',
            warning: 'color: orange; font-weight: bold;',
            info: 'color: blue; font-weight: bold;'
        };

        console.log(`%c${message}`, styles[type] || styles.info);
        
        // Future: implement toast notifications or modal
        // this.#showToast(message, type);
    }

    /**
     * Updates interface visual state based on game state
     * @param {object} gameInfo - Current game information
     */
    updateGameState(gameInfo) {
        // Update button states based on game info
        if (this.#elements.undoButton && gameInfo.history) {
            this.#elements.undoButton.disabled = gameInfo.history.length === 0;
        }

        // Update force black move button
        if (this.#elements.forceBlackMoveButton) {
            this.#elements.forceBlackMoveButton.disabled = gameInfo.turn !== 'b';
        }

        // Show game status messages
        if (gameInfo.isCheckmate) {
            const winner = gameInfo.turn === 'w' ? 'Black' : 'White';
            this.#showMessage(`Checkmate! ${winner} wins!`, "info");
        } else if (gameInfo.isCheck) {
            this.#showMessage("Check!", "warning");
        } else if (gameInfo.isDraw) {
            this.#showMessage("Game is a draw!", "info");
        } else if (gameInfo.isStalemate) {
            this.#showMessage("Stalemate!", "info");
        }
    }

    /**
     * Handles coordinate style change
     * @param {string} style - Style to apply
     * @private
     */
    #handleCoordinateStyleChange(style) {
        if (!window.boardManager) {
            this.#showMessage("BoardManager not available", "error");
            return;
        }

        try {
            window.boardManager.setCoordinateStyle(style);
            const styleNames = {
                'none': 'No borders',
                'thin': 'Thin borders',
                'frame': 'Frame borders'
            };
            this.#showMessage(`Style changed to: ${styleNames[style]}`, "success");
        } catch (error) {
            console.error("Error changing style:", error);
            this.#showMessage("Error changing style", "error");
        }
    }

    /**
     * Gets the game controller instance
     * @returns {GameController} Game controller instance
     */
    getGameController() {
        return this.#gameController;
    }

    /**
     * Exposes global functions that can be called from anywhere
     */
    exposeGlobalFunctions() {
        // Functions that can be called globally
        window.getGameInfo = () => this.#gameController.getGameInfo();
        window.undoMove = () => this.#gameController.undoMove();
        window.makeBlackMove = () => this.#gameController.getBlackPlayerController().makeAutomaticMove();
        window.resetGame = () => this.#gameController.resetGame();
    }

    /**
     * Initializes the interface visual state
     */
    initializeUI() {
        this.#showMessage("Interface initialized successfully!", "success");
    }
}
