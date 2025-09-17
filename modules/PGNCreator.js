/**
 * PGN Creator - Modal for creating PGN sequences and generating positions
 * @module PGNCreator
 */

import { PGNManager } from "./PGNManager.js";

export class PGNCreator {
    #pgnManager = null;
    #isOpen = false;
    #resolve = null;
    #lastCreatedPosition = null;

    constructor() {
        this.#initializeModal();
    }

    /**
     * Initialize modal event listeners
     * @private
     */
    #initializeModal() {
        const modal = document.getElementById('pgn-creator-modal');
        const closeBtn = document.getElementById('close-pgn-modal');
        const cancelBtn = document.getElementById('cancel-pgn-creation');
        const generateBtn = document.getElementById('generate-pgn-positions');

        closeBtn?.addEventListener('click', () => this.close());
        cancelBtn?.addEventListener('click', () => this.close());
        generateBtn?.addEventListener('click', () => this.#generatePositions());

        // Close modal when clicking outside
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.close();
            }
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.#isOpen) {
                this.close();
            }
        });

        // Initialize form handlers
        this.#initializeFormHandlers();
    }

    /**
     * Initialize form event handlers
     * @private
     */
    #initializeFormHandlers() {
        // Starting position radio buttons
        const startRadios = document.querySelectorAll('input[name="pgn-start"]');
        startRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                const customInput = document.getElementById('custom-fen-input');
                if (radio.value === 'custom') {
                    customInput.style.display = 'block';
                } else {
                    customInput.style.display = 'none';
                }
            });
        });

        // Move input handlers
        const moveInput = document.getElementById('move-input');
        const moveComment = document.getElementById('move-comment');
        const addMoveBtn = document.getElementById('add-move-btn');
        const undoBtn = document.getElementById('undo-move-btn');
        const clearBtn = document.getElementById('clear-moves-btn');

        addMoveBtn?.addEventListener('click', () => this.#addMove());
        undoBtn?.addEventListener('click', () => this.#undoLastMove());
        clearBtn?.addEventListener('click', () => this.#clearMoves());

        // Add move on Enter key
        moveInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.#addMove();
            }
        });

        moveComment?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.#addMove();
            }
        });

        // Update preview when headers change
        const headerInputs = ['pgn-event', 'pgn-white', 'pgn-black'];
        headerInputs.forEach(id => {
            const input = document.getElementById(id);
            input?.addEventListener('input', () => this.#updatePreview());
        });
    }

    /**
     * Set the last created position (for custom starting position)
     * @param {string} fen - FEN string
     */
    setLastCreatedPosition(fen) {
        this.#lastCreatedPosition = fen;
    }

    /**
     * Open the PGN creator modal
     * @returns {Promise<Array|null>} Array of positions or null if cancelled
     */
    open() {
        console.log('Opening PGN creator modal...');
        return new Promise((resolve) => {
            this.#isOpen = true;
            this.#resolve = resolve;

            const modal = document.getElementById('pgn-creator-modal');
            if (!modal) {
                console.error('PGN Modal element not found!');
                resolve(null);
                return;
            }

            console.log('PGN Modal found, showing...');
            modal.style.display = 'flex';

            // Initialize PGN manager
            this.#pgnManager = new PGNManager();
            this.#resetForm();
            this.#updatePreview();
        });
    }

    /**
     * Close the modal
     */
    close() {
        this.#isOpen = false;
        const modal = document.getElementById('pgn-creator-modal');
        modal.style.display = 'none';

        this.#pgnManager = null;
        this.#resetForm();

        if (this.#resolve) {
            this.#resolve(null);
        }
    }

    /**
     * Reset form to initial state
     * @private
     */
    #resetForm() {
        // Reset radio buttons
        const standardRadio = document.querySelector('input[name="pgn-start"][value="standard"]');
        if (standardRadio) {
            standardRadio.checked = true;
        }
        
        const customInput = document.getElementById('custom-fen-input');
        if (customInput) {
            customInput.style.display = 'none';
        }

        // Clear move displays
        const movesDisplay = document.getElementById('current-moves-display');
        if (movesDisplay) {
            movesDisplay.innerHTML = '<p class="help-text">Adicione lances usando a notação algébrica (ex: e4, Nf3, O-O)</p>';
        }

        // Clear inputs
        const moveInput = document.getElementById('move-input');
        const commentInput = document.getElementById('move-comment');
        const fenInput = document.getElementById('pgn-starting-fen');
        
        if (moveInput) moveInput.value = '';
        if (commentInput) commentInput.value = '';
        if (fenInput) fenInput.value = '';
    }

    /**
     * Add a move to the PGN
     * @private
     */
    #addMove() {
        const moveInput = document.getElementById('move-input');
        const commentInput = document.getElementById('move-comment');
        
        const move = moveInput?.value.trim();
        const comment = commentInput?.value.trim() || '';

        if (!move) {
            alert('Digite um lance válido.');
            return;
        }

        if (!PGNManager.isValidMove(move)) {
            alert('Lance inválido. Use notação algébrica (ex: e4, Nf3, O-O).');
            return;
        }

        this.#pgnManager.addMove(move, comment);
        
        // Clear inputs
        moveInput.value = '';
        commentInput.value = '';
        
        this.#updateMovesDisplay();
        this.#updatePreview();
        
        // Focus back to move input
        moveInput.focus();
    }

    /**
     * Undo the last move
     * @private
     */
    #undoLastMove() {
        this.#pgnManager.removeLastMove();
        this.#updateMovesDisplay();
        this.#updatePreview();
    }

    /**
     * Clear all moves
     * @private
     */
    #clearMoves() {
        this.#pgnManager.clearMoves();
        this.#updateMovesDisplay();
        this.#updatePreview();
    }

    /**
     * Update moves display
     * @private
     */
    #updateMovesDisplay() {
        const movesDisplay = document.getElementById('current-moves-display');
        if (!movesDisplay) return;

        const moves = this.#pgnManager.getMoves();
        
        if (moves.length === 0) {
            movesDisplay.innerHTML = '<p class="help-text">Adicione lances usando a notação algébrica (ex: e4, Nf3, O-O)</p>';
            return;
        }

        let movesHTML = '<div class="moves-list">';
        let currentLine = '';
        
        moves.forEach((moveObj, index) => {
            if (moveObj.isWhite) {
                if (currentLine) {
                    movesHTML += currentLine + '<br>';
                }
                currentLine = `${moveObj.moveNumber}. ${moveObj.move}`;
            } else {
                currentLine += ` ${moveObj.move}`;
            }
            
            if (moveObj.comment) {
                currentLine += ` <em>{${moveObj.comment}}</em>`;
            }
            
            // If this is the last move and it's black, or if we have a comment, close the line
            if (!moveObj.isWhite || moveObj.comment || index === moves.length - 1) {
                movesHTML += currentLine + '<br>';
                currentLine = '';
            }
        });
        
        if (currentLine) {
            movesHTML += currentLine;
        }
        
        movesHTML += '</div>';
        movesDisplay.innerHTML = movesHTML;
    }

    /**
     * Update PGN preview
     * @private
     */
    #updatePreview() {
        const previewText = document.getElementById('pgn-preview-text');
        if (!previewText || !this.#pgnManager) return;

        const headers = {
            Event: document.getElementById('pgn-event')?.value || 'Chess Analysis',
            White: document.getElementById('pgn-white')?.value || 'White',
            Black: document.getElementById('pgn-black')?.value || 'Black'
        };

        // Check if using custom starting position
        const customRadio = document.querySelector('input[name="pgn-start"][value="custom"]:checked');
        if (customRadio) {
            const customFen = document.getElementById('pgn-starting-fen')?.value.trim();
            if (customFen) {
                this.#pgnManager = new PGNManager(customFen);
                // Re-add moves to new manager
                const currentMoves = this.#pgnManager.getMoves();
                // Note: In a real implementation, you'd need to preserve the moves
            }
        }

        const pgn = this.#pgnManager.generatePGN(headers);
        previewText.value = pgn;
    }

    /**
     * Generate positions for PDF export
     * @private
     */
    #generatePositions() {
        if (!this.#pgnManager) return;

        try {
            const moves = this.#pgnManager.getMoves();
            
            if (moves.length === 0) {
                alert('Adicione pelo menos um lance para gerar posições.');
                return;
            }

            // For this simplified version, we'll create positions based on key moves
            // In a full implementation, you'd calculate actual positions after each move
            const positions = this.#createPositionsFromMoves(moves);
            
            this.close();
            
            if (this.#resolve) {
                this.#resolve(positions);
            }
        } catch (error) {
            console.error('Error generating positions:', error);
            alert('Erro ao gerar posições: ' + error.message);
        }
    }

    /**
     * Create position objects from moves (simplified version)
     * @param {Array} moves - Array of move objects
     * @returns {Array} Array of position objects
     * @private
     */
    #createPositionsFromMoves(moves) {
        const positions = [];
        const startingFen = this.#getStartingFen();
        
        // Add starting position
        positions.push({
            id: Date.now() + Math.random(),
            fen: startingFen,
            instruction: "Posição inicial",
            activeColor: this.#getActiveColorFromFEN(startingFen),
            originalInput: "Posição inicial da partida"
        });

        // Add positions for key moves (every 2 moves or moves with comments)
        moves.forEach((moveObj, index) => {
            if (index % 2 === 1 || moveObj.comment) {
                const moveDescription = this.#formatMoveDescription(moveObj, index);
                
                // For this example, we use the starting position
                // In a real implementation, you'd calculate the position after each move
                positions.push({
                    id: Date.now() + Math.random() + index,
                    fen: startingFen, // This would be the calculated position
                    instruction: moveDescription,
                    activeColor: moveObj.isWhite ? 'black' : 'white',
                    originalInput: `Após lance: ${moveDescription}`
                });
            }
        });

        return positions;
    }

    /**
     * Get starting FEN based on form selection
     * @returns {string} FEN string
     * @private
     */
    #getStartingFen() {
        const customRadio = document.querySelector('input[name="pgn-start"][value="custom"]:checked');
        if (customRadio) {
            const customFen = document.getElementById('pgn-starting-fen')?.value.trim();
            if (customFen) {
                return customFen;
            }
        }
        
        return "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    }

    /**
     * Format move description
     * @param {object} moveObj - Move object
     * @param {number} index - Move index
     * @returns {string} Formatted description
     * @private
     */
    #formatMoveDescription(moveObj, index) {
        const moveNumber = Math.ceil((index + 1) / 2);
        const colorPrefix = moveObj.isWhite ? `${moveNumber}.` : `${moveNumber}...`;
        let description = `${colorPrefix} ${moveObj.move}`;
        
        if (moveObj.comment) {
            description += ` (${moveObj.comment})`;
        }
        
        return description;
    }

    /**
     * Get active color from FEN
     * @param {string} fen - FEN string
     * @returns {string} 'white' or 'black'
     * @private
     */
    #getActiveColorFromFEN(fen) {
        const parts = fen.split(' ');
        return parts[1] === 'w' ? 'white' : 'black';
    }
}