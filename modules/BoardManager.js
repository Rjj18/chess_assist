/**
 * Board Manager - Handles visual chess board configuration and management
 * @module BoardManager
 */

import { Chessboard } from "../cm-chessboard-master/src/Chessboard.js";

// Border type constants
const BORDER_TYPE = {
    none: "none",
    thin: "thin", 
    frame: "frame"
};

export class BoardManager {
    #board;
    #config;
    #elementId;

    /**
     * @param {string} elementId - ID of the DOM element where the board will be rendered
     * @param {object} customConfig - Custom configuration for the board (optional)
     */
    constructor(elementId, customConfig = {}) {
        this.#elementId = elementId;
        this.#config = this.#mergeConfig(customConfig);
        this.#createBoard();
    }

    /**
     * Merges custom configuration with default settings
     * @param {object} customConfig - Custom configuration
     * @returns {object} Merged configuration
     * @private
     */
    #mergeConfig(customConfig) {
        // Detectar se estamos em uma subpasta (como games/)
        const currentPath = window.location.pathname;
        const isInSubfolder = currentPath.includes('/games/');
        const assetsPath = isInSubfolder ? "../cm-chessboard-master/assets/" : "cm-chessboard-master/assets/";
        
        const defaultConfig = {
            position: "start",
            assetsUrl: assetsPath,  // Configurar caminho correto dos assets
            style: {
                borderType: BORDER_TYPE.thin,  // Change: activating coordinates
                showCoordinates: true,         // Change: showing coordinates
                pieces: { file: "pieces/staunty.svg" },
                animationDuration: 300
            },
            responsive: true,
            animationDuration: 300
        };

        return this.#deepMerge(defaultConfig, customConfig);
    }

    /**
     * Performs deep merge of two objects
     * @param {object} target - Target object
     * @param {object} source - Source object
     * @returns {object} Merged object
     * @private
     */
    #deepMerge(target, source) {
        const result = { ...target };
        
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.#deepMerge(target[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
        
        return result;
    }

    /**
     * Creates the visual chess board
     * @private
     */
    #createBoard() {
        try {
            this.#board = new Chessboard(document.getElementById(this.#elementId), this.#config);
            console.log("Board created successfully with config:", this.#config);
        } catch (error) {
            console.error("Error creating board:", error);
            throw new Error(`Failed to create board: ${error.message}`);
        }
    }

    /**
     * Gets the board instance
     * @returns {Chessboard} Board instance
     */
    getBoard() {
        return this.#board;
    }

    /**
     * Gets the current board configuration
     * @returns {object} Current configuration
     */
    getConfig() {
        return { ...this.#config }; // Returns a copy to prevent external modification
    }

    /**
     * Updates board configuration
     * @param {object} newConfig - New configuration to apply
     */
    updateConfig(newConfig) {
        this.#config = this.#mergeConfig(newConfig);
        
        // Update existing board properties
        if (this.#board) {
            Object.assign(this.#board.props, this.#config);
            this.#board.view.redraw();
        }
    }

    /**
     * Sets a new position on the board
     * @param {string} fen - FEN notation of the position
     * @param {boolean} animated - Whether to animate the position change (default: true)
     */
    setPosition(fen, animated = true) {
        if (this.#board) {
            this.#board.setPosition(fen, animated);
        }
    }

    /**
     * Gets the current position
     * @returns {string} Current position in FEN notation
     */
    getPosition() {
        return this.#board ? this.#board.getPosition() : null;
    }

    /**
     * Enables move input on the board
     * @param {function} inputHandler - Function to handle input events
     * @param {string} color - Color that can move ('white' or 'black')
     */
    enableMoveInput(inputHandler, color) {
        if (this.#board) {
            this.#board.enableMoveInput(inputHandler, color);
        }
    }

    /**
     * Disables move input on the board
     */
    disableMoveInput() {
        if (this.#board) {
            this.#board.disableMoveInput();
        }
    }

    /**
     * Shows or hides coordinate display
     * @param {boolean} show - Whether to show coordinates
     */
    setShowCoordinates(show) {
        this.#config.style.showCoordinates = show;
        this.#board.props.style.showCoordinates = show;
        this.#board.view.drawCoordinates();
    }

    /**
     * Checks if coordinates are being displayed
     * @returns {boolean} Whether coordinates are visible
     */
    getShowCoordinates() {
        return this.#config.style.showCoordinates;
    }

    /**
     * Sets border type (affects how coordinates are displayed)
     * @param {string} borderType - Border type ('none', 'thin', 'frame')
     */
    setBorderType(borderType) {
        const validTypes = ['none', 'thin', 'frame'];
        if (!validTypes.includes(borderType)) {
            throw new Error(`Invalid border type: ${borderType}. Use: ${validTypes.join(', ')}`);
        }
        
        this.#config.style.borderType = borderType;
        this.#board.props.style.borderType = borderType;
        
        // Redraw board to apply change
        this.#board.view.redraw();
    }

    /**
     * Gets current border type
     * @returns {string} Current border type
     */
    getBorderType() {
        return this.#config.style.borderType;
    }

    /**
     * Sets coordinate style (convenience method)
     * @param {string} style - Style name ('none', 'thin', 'frame')
     */
    setCoordinateStyle(style) {
        this.setBorderType(style);
        
        // Automatically show/hide coordinates based on style
        if (style === 'none') {
            this.setShowCoordinates(false);
        } else {
            this.setShowCoordinates(true);
        }
    }

    /**
     * Adds markers to specific squares
     * @param {Array} markers - Array of marker objects
     */
    addMarkers(markers) {
        if (this.#board && this.#board.addMarkers) {
            this.#board.addMarkers(markers);
        }
    }

    /**
     * Removes all markers from the board
     */
    removeMarkers() {
        if (this.#board && this.#board.removeMarkers) {
            this.#board.removeMarkers();
        }
    }

    /**
     * Destroys the board and cleans up resources
     */
    destroy() {
        if (this.#board && this.#board.destroy) {
            this.#board.destroy();
        }
        this.#board = null;
    }
}
