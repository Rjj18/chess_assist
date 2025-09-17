/**
 * Position Creator - Modal editor for creating custom chess positions
 * @module PositionCreator
 */

import { Chessboard, FEN, INPUT_EVENT_TYPE } from "../cm-chessboard-master/src/Chessboard.js";
import { getChessboardAssetsPath } from "./ChessboardHelper.js";

export class PositionCreator {
    #board = null;
    #selectedPiece = null;
    #selectedColor = 'w';
    #isOpen = false;
    #resolve = null;

    constructor() {
        this.#initializeModal();
    }

    /**
     * Initialize modal event listeners
     * @private
     */
    #initializeModal() {
        const modal = document.getElementById('position-creator-modal');
        const closeBtn = document.getElementById('close-modal');
        const cancelBtn = document.getElementById('cancel-custom-position');
        const saveBtn = document.getElementById('save-custom-position');

        closeBtn?.addEventListener('click', () => this.close());
        cancelBtn?.addEventListener('click', () => this.close());
        saveBtn?.addEventListener('click', () => {
            console.log('Save button clicked!');
            this.#savePosition();
        });

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
    }

    /**
     * Open the position creator modal
     * @returns {Promise<object|null>} Position object or null if cancelled
     */
    open() {
        console.log('Opening position creator modal...');
        return new Promise((resolve) => {
            this.#isOpen = true;
            this.#resolve = resolve;

            const modal = document.getElementById('position-creator-modal');
            if (!modal) {
                console.error('Modal element not found!');
                resolve(null);
                return;
            }
            
            console.log('Modal found, showing...');
            modal.style.display = 'flex';

            // Initialize board after modal is visible
            setTimeout(() => {
                console.log('Initializing modal components...');
                this.#initializeBoard();
                this.#initializePiecePalette();
                this.#initializeMoveSelector();
            }, 100);
        });
    }

    /**
     * Close the modal
     */
    close() {
        this.#isOpen = false;
        const modal = document.getElementById('position-creator-modal');
        modal.style.display = 'none';

        // Cleanup
        if (this.#board) {
            this.#board.destroy();
            this.#board = null;
        }

        this.#selectedPiece = null;
        this.#selectedColor = 'w';

        // Clear instruction input
        const instructionInput = document.getElementById('custom-instruction');
        if (instructionInput) {
            instructionInput.value = '';
        }

        // Reset move selector
        this.#updateMoveSelector('w');

        if (this.#resolve) {
            this.#resolve(null);
            this.#resolve = null;
        }
    }

    /**
     * Close the modal without resolving the promise (used after successful save)
     * @private
     */
    #closeWithoutResolving() {
        this.#isOpen = false;
        const modal = document.getElementById('position-creator-modal');
        modal.style.display = 'none';

        // Cleanup
        if (this.#board) {
            this.#board.destroy();
            this.#board = null;
        }

        this.#selectedPiece = null;
        this.#selectedColor = 'w';

        // Clear instruction input
        const instructionInput = document.getElementById('custom-instruction');
        if (instructionInput) {
            instructionInput.value = '';
        }

        // Reset move selector
        this.#updateMoveSelector('w');
    }

    /**
     * Initialize the chess board
     * @private
     */
    #initializeBoard() {
        console.log('Initializing board...');
        const boardContainer = document.getElementById('editor-chessboard');
        if (!boardContainer) {
            console.error('Board container not found!');
            return;
        }

        console.log('Board container found, clearing content...');
        // Clear any existing content
        boardContainer.innerHTML = '';

        try {
            console.log('Creating chessboard instance...');
            this.#board = new Chessboard(boardContainer, {
                position: FEN.empty,
                assetsUrl: getChessboardAssetsPath(),
                style: {
                    aspectRatio: 1,
                    borderType: 'frame',
                    showCoordinates: true
                },
                sprite: { url: 'pieces/staunty.svg' },
                responsive: false
            });

            console.log('Chessboard created successfully:', this.#board);
            
            // Add click handler for placing pieces
            this.#attachBoardClickHandlers();
            this.#updateFENDisplay();
        } catch (error) {
            console.error('Error creating chessboard:', error);
        }
    }

    /**
     * Attach click handlers to board squares
     * @private
     */
    #attachBoardClickHandlers() {
        if (!this.#board) return;

        // Use the chessboard's input events
        this.#board.enableMoveInput((event) => {
            console.log('Board input event:', event);
            
            if (event.type === INPUT_EVENT_TYPE.squareClick || event.type === 'squareClick') {
                const square = event.square;
                console.log('Square clicked:', square, 'Selected piece:', this.#selectedPiece);
                
                if (square && this.#selectedPiece) {
                    this.#placePiece(square, this.#selectedPiece);
                }
            }
        });

        // Fallback: Direct DOM event handling
        setTimeout(() => {
            const boardElement = document.getElementById('editor-chessboard');
            if (boardElement) {
                boardElement.addEventListener('click', (e) => {
                    // Find the closest square element
                    const square = this.#findSquareFromClick(e);
                    if (square && this.#selectedPiece) {
                        console.log('Fallback click - Square:', square, 'Piece:', this.#selectedPiece);
                        this.#placePiece(square, this.#selectedPiece);
                    }
                });
            }
        }, 500);
    }

    /**
     * Find square from click event
     * @param {Event} event - Click event
     * @returns {string|null} Square notation
     * @private
     */
    #findSquareFromClick(event) {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Calculate square based on position (assuming 8x8 grid)
        const squareSize = rect.width / 8;
        const file = Math.floor(x / squareSize);
        const rank = 8 - Math.floor(y / squareSize);
        
        if (file >= 0 && file < 8 && rank >= 1 && rank <= 8) {
            return String.fromCharCode(97 + file) + rank; // a1, b2, etc.
        }
        
        return null;
    }

    /**
     * Place a piece on the board
     * @param {string} square - Square notation
     * @param {string} piece - Piece notation
     * @private
     */
    #placePiece(square, piece) {
        if (!this.#board) {
            console.error('Board not initialized');
            return;
        }

        console.log('Placing piece:', piece, 'on square:', square);
        
        let currentPosition = this.#board.getPosition();
        console.log('Current position before placement:', currentPosition);
        
        // If position is a string (FEN), convert to object
        if (typeof currentPosition === 'string') {
            currentPosition = this.#fenToPosition(currentPosition);
            console.log('Converted FEN to position object:', currentPosition);
        }
        
        if (piece === 'clear') {
            // Remove piece from square
            delete currentPosition[square];
        } else {
            // Place piece on square
            currentPosition[square] = piece;
        }

        console.log('New position after placement:', currentPosition);
        
        // Convert back to FEN for setPosition
        const newFen = this.#positionToFEN(currentPosition, this.#selectedColor);
        console.log('Setting board position with FEN:', newFen);
        
        this.#board.setPosition(newFen, false);
        this.#updateFENDisplay();
    }

    /**
     * Convert FEN string to position object
     * @param {string} fen - FEN string
     * @returns {object} Position object
     * @private
     */
    #fenToPosition(fen) {
        const position = {};
        const boardPart = fen.split(' ')[0];
        const ranks = boardPart.split('/');
        
        for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
            const rank = 8 - rankIndex; // 8, 7, 6, ..., 1
            const rankStr = ranks[rankIndex];
            let fileIndex = 0;
            
            for (let i = 0; i < rankStr.length; i++) {
                const char = rankStr[i];
                
                if (char >= '1' && char <= '8') {
                    // Empty squares
                    fileIndex += parseInt(char);
                } else {
                    // Piece
                    const file = String.fromCharCode(97 + fileIndex); // a, b, c, ...
                    const square = file + rank;
                    
                    // Convert piece character to piece notation
                    const isWhite = char === char.toUpperCase();
                    const pieceType = char.toLowerCase();
                    const pieceNotation = (isWhite ? 'w' : 'b') + pieceType;
                    
                    position[square] = pieceNotation;
                    fileIndex++;
                }
            }
        }
        
        return position;
    }

    /**
     * Initialize piece palette
     * @private
     */
    #initializePiecePalette() {
        const pieceBtns = document.querySelectorAll('#editor-piece-palette .piece-btn');
        console.log('Found piece buttons:', pieceBtns.length);
        
        pieceBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const piece = btn.dataset.piece;
                console.log('Piece button clicked:', piece);
                
                if (piece === 'clear-board') {
                    this.#clearBoard();
                } else if (piece === 'initial-position') {
                    this.#setInitialPosition();
                } else {
                    this.#selectPiece(piece, btn);
                }
            });
        });
    }

    /**
     * Select a piece for placement
     * @param {string} piece - Piece notation
     * @param {Element} btnElement - Button element
     * @private
     */
    #selectPiece(piece, btnElement) {
        console.log('Selecting piece:', piece);
        
        // Remove previous selection
        document.querySelectorAll('#editor-piece-palette .piece-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        this.#selectedPiece = piece;
        btnElement.classList.add('selected');
        
        console.log('Selected piece set to:', this.#selectedPiece);
    }

    /**
     * Clear the board
     * @private
     */
    #clearBoard() {
        if (!this.#board) return;

        console.log('Clearing board');
        this.#board.setPosition(FEN.empty, false);
        this.#updateFENDisplay();
        
        // Clear selection
        document.querySelectorAll('#editor-piece-palette .piece-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        this.#selectedPiece = null;
    }

    /**
     * Set initial chess position
     * @private
     */
    #setInitialPosition() {
        if (!this.#board) return;

        console.log('Setting initial position');
        this.#board.setPosition(FEN.start, false);
        this.#updateFENDisplay();
    }

    /**
     * Initialize move selector
     * @private
     */
    #initializeMoveSelector() {
        const whiteBtn = document.getElementById('editor-white-first');
        const blackBtn = document.getElementById('editor-black-first');

        whiteBtn?.addEventListener('click', () => {
            this.#updateMoveSelector('w');
        });

        blackBtn?.addEventListener('click', () => {
            this.#updateMoveSelector('b');
        });
    }

    /**
     * Update move selector
     * @param {string} color - 'w' or 'b'
     * @private
     */
    #updateMoveSelector(color) {
        this.#selectedColor = color;

        const whiteBtn = document.getElementById('editor-white-first');
        const blackBtn = document.getElementById('editor-black-first');

        whiteBtn?.classList.toggle('selected', color === 'w');
        blackBtn?.classList.toggle('selected', color === 'b');

        this.#updateFENDisplay();
    }

    /**
     * Update FEN display
     * @private
     */
    #updateFENDisplay() {
        if (!this.#board) return;

        try {
            let position = this.#board.getPosition();
            
            // If position is a string (FEN), convert to object first
            if (typeof position === 'string') {
                position = this.#fenToPosition(position);
            }
            
            const fen = this.#positionToFEN(position, this.#selectedColor);
            
            const fenDisplay = document.getElementById('editor-fen-display');
            if (fenDisplay) {
                fenDisplay.textContent = fen;
            }
        } catch (error) {
            console.error('Error updating FEN display:', error);
        }
    }

    /**
     * Convert position to FEN
     * @param {object} position - Board position
     * @param {string} activeColor - Active color
     * @returns {string} FEN string
     * @private
     */
    #positionToFEN(position, activeColor = 'w') {
        const rows = [];
        
        // Convert position to 8x8 array
        for (let rank = 8; rank >= 1; rank--) {
            let row = '';
            let emptyCount = 0;
            
            for (let file = 0; file < 8; file++) {
                const square = String.fromCharCode(97 + file) + rank; // a1, b1, etc.
                const piece = position[square];
                
                if (piece) {
                    if (emptyCount > 0) {
                        row += emptyCount;
                        emptyCount = 0;
                    }
                    // Convert piece notation (wk -> K, bp -> p, etc.)
                    const pieceChar = piece.charAt(1);
                    const isWhite = piece.charAt(0) === 'w';
                    row += isWhite ? pieceChar.toUpperCase() : pieceChar.toLowerCase();
                } else {
                    emptyCount++;
                }
            }
            
            if (emptyCount > 0) {
                row += emptyCount;
            }
            
            rows.push(row);
        }
        
        const boardPart = rows.join('/');
        return `${boardPart} ${activeColor} - - 0 1`;
    }

    /**
     * Save the current position
     * @private
     */
    #savePosition() {
        console.log('Save position method called!');
        if (!this.#board) return;

        try {
            let position = this.#board.getPosition();
            console.log('Current board position:', position);
            
            // If position is a string (FEN), convert to object first
            if (typeof position === 'string') {
                position = this.#fenToPosition(position);
            }
            
            const fen = this.#positionToFEN(position, this.#selectedColor);
            const instruction = document.getElementById('custom-instruction')?.value.trim() || '';

            console.log('Generated FEN:', fen);
            console.log('Instruction:', instruction);

            // Validate that there's at least one piece
            const pieceCount = Object.keys(position).length;
            if (pieceCount === 0) {
                alert('Adicione pelo menos uma peça ao tabuleiro.');
                return;
            }

            const result = {
                fen: fen,
                instruction: instruction,
                activeColor: this.#selectedColor === 'w' ? 'white' : 'black'
            };

            console.log('Saving position result:', result);

            if (this.#resolve) {
                console.log('Resolving promise with result:', result);
                this.#resolve(result);
                this.#resolve = null; // Prevent double resolution
            }

            this.#closeWithoutResolving();
            
        } catch (error) {
            console.error('Error saving position:', error);
            alert('Erro ao salvar posição: ' + error.message);
        }
    }
}