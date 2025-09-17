/**
 * PDF Export Controller - Handles diagram creation and PDF export functionality
 * @module PDFExportController
 * @version 1.1.0
 */

import { BoardManager } from "./BoardManager.js";
import { getChessboardAssetsPath } from "./ChessboardHelper.js";
import { PositionCreator } from "./PositionCreator.js";
import { PGNCreator } from "./PGNCreator.js";

export class PDFExportController {
    #positions = [];
    #boardCounter = 0;
    #jsPDF = null;
    #positionCreator = null;
    #pgnCreator = null;
    svgPiecesCache = null; // Cache for SVG pieces

    constructor() {
        this.#initializeJsPDF();
        this.#initializeEventListeners();
        this.#positionCreator = new PositionCreator();
        this.#pgnCreator = new PGNCreator();
        this.#updateUI();
    }

    /**
     * Initialize jsPDF library
     * @private
     */
    #initializeJsPDF() {
        // jsPDF is loaded from CDN in HTML
        if (typeof window.jspdf !== 'undefined') {
            this.#jsPDF = window.jspdf.jsPDF;
        } else {
            console.error('jsPDF library not loaded');
            // Try alternative global reference
            this.#jsPDF = window.jsPDF;
        }
    }

    /**
     * Initialize event listeners for the UI
     * @private
     */
    #initializeEventListeners() {
        const addPositionBtn = document.getElementById('add-position-btn');
        const addExamplesBtn = document.getElementById('add-examples-btn');
        const createPositionBtn = document.getElementById('create-position-btn');
        const createPgnBtn = document.getElementById('create-pgn-btn');
        const clearAllBtn = document.getElementById('clear-all-btn');
        const exportPdfBtn = document.getElementById('export-pdf-btn');
        const positionInput = document.getElementById('position-input');
        const instructionInput = document.getElementById('instruction-input');

        addPositionBtn?.addEventListener('click', () => {
            this.#addPosition();
        });

        addExamplesBtn?.addEventListener('click', () => {
            this.#addExamples();
        });

        createPositionBtn?.addEventListener('click', () => {
            this.#createCustomPosition();
        });

        createPgnBtn?.addEventListener('click', () => {
            this.#createPGN();
        });

        clearAllBtn?.addEventListener('click', () => {
            this.#clearAllPositions();
        });

        exportPdfBtn?.addEventListener('click', () => {
            this.#exportToPDF();
        });

        // Add position when Enter is pressed in instruction input
        instructionInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.#addPosition();
            }
        });

        // Auto-resize textarea
        positionInput?.addEventListener('input', (e) => {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
        });
    }

    /**
     * Add a new position from user input
     * @private
     */
    #addPosition() {
        const positionInput = document.getElementById('position-input');
        const instructionInput = document.getElementById('instruction-input');
        
        const positionText = positionInput?.value.trim();
        const instruction = instructionInput?.value.trim() || '';

        if (!positionText) {
            alert('Por favor, insira uma posição FEN ou PGN.');
            return;
        }

        try {
            const fen = this.#parsePosition(positionText);
            const activeColor = this.#getActiveColorFromFEN(fen);
            
            const position = {
                id: Date.now() + Math.random(),
                originalInput: positionText,
                fen: fen,
                instruction: instruction,
                activeColor: activeColor
            };

            this.#positions.push(position);
            this.#renderPositionPreview(position);
            this.#updateUI();

            // Clear inputs
            positionInput.value = '';
            instructionInput.value = '';
            positionInput.style.height = 'auto';

        } catch (error) {
            alert(`Erro ao processar posição: ${error.message}`);
        }
    }

    /**
     * Add example positions for testing
     * @private
     */
    #addExamples() {
        const examples = [
            {
                fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                instruction: "Posição inicial do jogo"
            },
            {
                fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
                instruction: "Abertura Italiana"
            },
            {
                fen: "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3",
                instruction: "Defesa dos Dois Cavalos"
            },
            {
                fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 5",
                instruction: "Defesa Italiana"
            },
            {
                fen: "rnbqkb1r/ppp2ppp/3p1n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 4",
                instruction: "Defesa Francesa"
            },
            {
                fen: "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 2",
                instruction: "Defesa Francesa - 1...d5"
            }
        ];

        examples.forEach(example => {
            const position = {
                id: Date.now() + Math.random(),
                originalInput: example.fen,
                fen: example.fen,
                instruction: example.instruction,
                activeColor: this.#getActiveColorFromFEN(example.fen)
            };

            this.#positions.push(position);
            this.#renderPositionPreview(position);
        });

        this.#updateUI();
    }

    /**
     * Open custom position creator
     * @private
     */
    async #createCustomPosition() {
        console.log('Create custom position button clicked');
        try {
            console.log('Opening position creator...');
            const result = await this.#positionCreator.open();
            console.log('Position creator result:', result);
            
            if (result) {
                const position = {
                    id: Date.now() + Math.random(),
                    originalInput: result.fen,
                    fen: result.fen,
                    instruction: result.instruction,
                    activeColor: result.activeColor
                };

                console.log('Adding position to list:', position);
                this.#positions.push(position);
                this.#renderPositionPreview(position);
                this.#updateUI();
            } else {
                console.log('Position creation cancelled');
            }
        } catch (error) {
            console.error('Error creating custom position:', error);
            alert('Erro ao criar posição personalizada: ' + error.message);
        }
    }

    /**
     * Parse position input (FEN or simple PGN move)
     * @param {string} input - Position input
     * @returns {string} FEN string
     * @private
     */
    #parsePosition(input) {
        // Check if input is already a FEN
        if (this.#isValidFEN(input)) {
            return input;
        }

        // If it's a simple move notation, start from starting position
        // This is a simplified implementation - for full PGN parsing, you'd need a chess library
        if (input.match(/^[a-h][1-8][-x][a-h][1-8]/) || input.match(/^[KQRBN]?[a-h]?[1-8]?[x]?[a-h][1-8]/)) {
            // For now, return starting position - in a full implementation, you'd apply the moves
            return "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        }

        // Try to extract FEN from longer text
        const fenMatch = input.match(/([rnbqkpRNBQKP1-8\/\s]+\s[wb]\s[KQkq-]+\s[a-h1-8-]+\s\d+\s\d+)/);
        if (fenMatch) {
            return fenMatch[1];
        }

        throw new Error('Formato não reconhecido. Use notação FEN ou PGN simples.');
    }

    /**
     * Check if string is a valid FEN
     * @param {string} fen - FEN string to validate
     * @returns {boolean} Is valid FEN
     * @private
     */
    #isValidFEN(fen) {
        if (!fen || typeof fen !== 'string') return false;
        
        const parts = fen.split(' ');
        if (parts.length !== 6) return false;
        
        // Basic validation of board position
        const ranks = parts[0].split('/');
        if (ranks.length !== 8) return false;
        
        return true;
    }

    /**
     * Extract active color from FEN
     * @param {string} fen - FEN string
     * @returns {string} 'white' or 'black'
     * @private
     */
    #getActiveColorFromFEN(fen) {
        const parts = fen.split(' ');
        return parts[1] === 'w' ? 'white' : 'black';
    }

    /**
     * Render preview of a position
     * @param {object} position - Position object
     * @private
     */
    #renderPositionPreview(position) {
        const positionsList = document.getElementById('positions-list');
        if (!positionsList) return;

        const boardId = `preview-board-${position.id}`;
        
        const positionDiv = document.createElement('div');
        positionDiv.className = 'position-item';
        positionDiv.dataset.positionId = position.id;
        
        positionDiv.innerHTML = `
            <div class="position-preview">
                <div id="${boardId}" class="preview-board"></div>
                <div class="position-info">
                    <div class="active-color">
                        <span class="color-indicator ${position.activeColor}"></span>
                        ${position.activeColor === 'white' ? 'Brancas jogam' : 'Pretas jogam'}
                    </div>
                    <div class="instruction">${position.instruction || 'Sem instrução'}</div>
                </div>
                <button class="remove-btn" onclick="window.pdfController?.removePosition('${position.id}')">
                    ❌
                </button>
            </div>
        `;

        positionsList.appendChild(positionDiv);

        // Create small board for preview
        setTimeout(() => {
            try {
                console.log('Creating preview board for position:', position);
                console.log('Position FEN:', position.fen);
                
                // Use the correct FEN field based on position structure
                const fenToUse = position.fen || position.content || position.originalInput;
                console.log('Using FEN:', fenToUse);
                
                if (!fenToUse) {
                    console.error('No valid FEN found in position:', position);
                    return;
                }
                
                const boardManager = new BoardManager(boardId, {
                    position: fenToUse, // Set position directly in config
                    style: {
                        borderType: 'none',
                        showCoordinates: false,
                        pieces: { file: "pieces/staunty.svg" }
                    },
                    responsive: false
                });
                
                // Don't call setPosition again since it's already set in config
                
                // Store board manager for cleanup
                position.previewBoard = boardManager;
            } catch (error) {
                console.error('Error creating preview board:', error);
            }
        }, 100);
    }

    /**
     * Remove a position
     * @param {string} positionId - Position ID to remove
     */
    removePosition(positionId) {
        const position = this.#positions.find(p => p.id.toString() === positionId);
        if (position?.previewBoard) {
            position.previewBoard.destroy();
        }

        this.#positions = this.#positions.filter(p => p.id.toString() !== positionId);
        
        const positionElement = document.querySelector(`[data-position-id="${positionId}"]`);
        positionElement?.remove();
        
        this.#updateUI();
    }

    /**
     * Clear all positions
     * @private
     */
    #clearAllPositions() {
        // Destroy all preview boards
        this.#positions.forEach(position => {
            if (position.previewBoard) {
                position.previewBoard.destroy();
            }
        });

        this.#positions = [];
        const positionsList = document.getElementById('positions-list');
        if (positionsList) {
            positionsList.innerHTML = '';
        }
        this.#updateUI();
    }

    /**
     * Update UI state
     * @private
     */
    #updateUI() {
        const positionCount = document.getElementById('position-count');
        const exportBtn = document.getElementById('export-pdf-btn');
        
        if (positionCount) {
            positionCount.textContent = this.#positions.length;
        }
        
        if (exportBtn) {
            exportBtn.disabled = this.#positions.length === 0;
        }
    }

    /**
     * Export positions to PDF
     * @private
     */
    async #exportToPDF() {
        if (this.#positions.length === 0 || !this.#jsPDF) {
            return;
        }

        try {
            const pdfTitle = document.getElementById('pdf-title')?.value || 'Chess Diagrams';
            const showCoordinates = document.getElementById('show-coordinates')?.checked ?? true;
            const showMoveIndicator = document.getElementById('show-move-indicator')?.checked ?? true;

            // Create PDF document
            const pdf = new this.#jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // PDF dimensions
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 20;
            const usableWidth = pageWidth - (2 * margin);
            const usableHeight = pageHeight - (2 * margin);

            // Calculate diagram size (3 columns, 2 rows = 6 per page)
            const diagramsPerRow = 3;
            const diagramsPerCol = 2;
            const diagramsPerPage = diagramsPerRow * diagramsPerCol;
            
            const diagramWidth = (usableWidth - (diagramsPerRow - 1) * 10) / diagramsPerRow;
            const diagramHeight = (usableHeight - (diagramsPerCol - 1) * 10 - 40) / diagramsPerCol; // -40 for text space

            // Add title to first page
            pdf.setFontSize(16);
            pdf.text(pdfTitle, pageWidth / 2, margin, { align: 'center' });

            let currentPage = 0;
            let diagramsOnCurrentPage = 0;

            for (let i = 0; i < this.#positions.length; i++) {
                const position = this.#positions[i];
                
                // Add new page if needed
                if (diagramsOnCurrentPage >= diagramsPerPage) {
                    pdf.addPage();
                    currentPage++;
                    diagramsOnCurrentPage = 0;
                }

                // Calculate position on page
                const row = Math.floor(diagramsOnCurrentPage / diagramsPerRow);
                const col = diagramsOnCurrentPage % diagramsPerRow;
                
                const x = margin + col * (diagramWidth + 10);
                const y = margin + 30 + row * (diagramHeight + 10); // +30 for title space

                // Generate diagram SVG
                const svgData = await this.#generateSimpleBoard(position, diagramWidth, showCoordinates);
                
                if (svgData) {
                    // Add diagram to PDF with lossless compression
                    // Using 'FAST' compression to preserve PNG quality without JPEG artifacts
                    pdf.addImage(svgData, 'PNG', x, y, diagramWidth, diagramWidth * 0.8, undefined, 'FAST');
                    
                    // Add move indicator
                    if (showMoveIndicator) {
                        pdf.setFontSize(10);
                        const colorText = position.activeColor === 'white' ? '○ Brancas jogam' : '● Pretas jogam';
                        pdf.text(colorText, x, y + diagramWidth * 0.8 + 5);
                    }
                    
                    // Add instruction
                    if (position.instruction) {
                        pdf.setFontSize(8);
                        const lines = pdf.splitTextToSize(position.instruction, diagramWidth);
                        pdf.text(lines, x, y + diagramWidth * 0.8 + 12);
                    }
                }

                diagramsOnCurrentPage++;
            }

            // Save PDF
            const filename = `${pdfTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
            pdf.save(filename);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Erro ao gerar PDF: ' + error.message);
        }
    }

    /**
     * Generate SVG data for a position
     * @param {object} position - Position object
     * @param {number} size - Diagram size
     * @param {boolean} showCoordinates - Show coordinates
     * @returns {Promise<string>} SVG data URL
     * @private
     */
    /**
     * Open PGN creator modal
     * @private
     */
    #createPGN() {
        this.#pgnCreator.open((pgn, instruction) => {
            if (pgn) {
                // Add the created PGN to the list
                const positionData = {
                    type: 'pgn',
                    content: pgn,
                    instruction: instruction || 'Sequência PGN'
                };
                
                this.#positions.push(positionData);
                this.#renderPositionPreview(positionData);
                this.#updateUI();
                
                // Clear input fields
                document.getElementById('position-input').value = '';
                document.getElementById('instruction-input').value = '';
            }
        });
    }

    /**
     * Generate chess diagram SVG using BoardManager
     * @param {object} position - Position object
     * @param {number} size - Diagram size in pixels
     * @param {boolean} showCoordinates - Whether to show coordinates
     * @returns {Promise<string|null>} Data URL or null if failed
     * @private
     */
    async #generateDiagramSVG(position, size = 200, showCoordinates = false) {
        return new Promise((resolve) => {
            // Create a temporary visible container for rendering
            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '0px';
            tempContainer.style.top = '0px';
            tempContainer.style.width = `${size}px`;
            tempContainer.style.height = `${size}px`;
            tempContainer.style.visibility = 'visible';
            tempContainer.style.zIndex = '9999';
            document.body.appendChild(tempContainer);

            const boardId = `temp-export-board-${Date.now()}`;
            const boardDiv = document.createElement('div');
            boardDiv.id = boardId;
            boardDiv.style.width = `${size}px`;
            boardDiv.style.height = `${size}px`;
            tempContainer.appendChild(boardDiv);

            try {
                const fenToUse = position.fen || position.content || position.originalInput;
                console.log('Creating board for SVG export with FEN:', fenToUse);

                // Create board with the target position directly
                const boardManager = new BoardManager(boardId, {
                    position: fenToUse, // Use target FEN directly
                    style: {
                        borderType: showCoordinates ? 'thin' : 'none',
                        showCoordinates: showCoordinates,
                        pieces: { file: "pieces/staunty.svg" }
                    },
                    responsive: false,
                    animationDuration: 0
                });

                // Don't call setPosition since it's already set in config
                
                // Wait for rendering and then capture
                setTimeout(() => {
                    this.#captureBoardAsImage(boardDiv, size).then((dataURL) => {
                        // Cleanup
                        try {
                            boardManager.destroy();
                        } catch (e) {
                            console.warn('Error destroying board:', e);
                        }
                        document.body.removeChild(tempContainer);
                        resolve(dataURL);
                    }).catch((error) => {
                        console.error('Error capturing board:', error);
                        try {
                            boardManager.destroy();
                        } catch (e) {
                            console.warn('Error destroying board:', e);
                        }
                        document.body.removeChild(tempContainer);
                        resolve(null);
                    });
                }, 1000);

            } catch (error) {
                console.error('Error creating board:', error);
                document.body.removeChild(tempContainer);
                resolve(null);
            }
        });
    }

    /**
     * Capture board element as image using html2canvas-like approach
     * @param {HTMLElement} element - Element to capture
     * @param {number} size - Target size
     * @returns {Promise<string>} Data URL
     * @private
     */
    async #captureBoardAsImage(element, size) {
        return new Promise((resolve, reject) => {
            try {
                // Try to use the SVG directly if available
                const svgElement = element.querySelector('svg');
                if (svgElement) {
                    console.log('Found SVG element, attempting direct conversion...');
                    
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = size * 3; // High resolution
                    canvas.height = size * 3;

                    // Create image from SVG
                    const svgData = new XMLSerializer().serializeToString(svgElement);
                    
                    // Fix SVG for standalone rendering
                    const fixedSVG = svgData
                        .replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
                        .replace(/width="[^"]*"/, `width="${size * 3}"`)
                        .replace(/height="[^"]*"/, `height="${size * 3}"`);

                    const blob = new Blob([fixedSVG], { type: 'image/svg+xml;charset=utf-8' });
                    const url = URL.createObjectURL(blob);

                    const img = new Image();
                    img.onload = () => {
                        ctx.fillStyle = 'white';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        const dataURL = canvas.toDataURL('image/png', 1.0);
                        URL.revokeObjectURL(url);
                        console.log('SVG conversion successful');
                        resolve(dataURL);
                    };

                    img.onerror = () => {
                        URL.revokeObjectURL(url);
                        console.log('SVG conversion failed, trying alternative...');
                        this.#fallbackCapture(element, size).then(resolve).catch(reject);
                    };

                    img.src = url;
                } else {
                    console.log('No SVG found, using fallback capture...');
                    this.#fallbackCapture(element, size).then(resolve).catch(reject);
                }
            } catch (error) {
                console.error('Error in captureboardAsImage:', error);
                this.#fallbackCapture(element, size).then(resolve).catch(reject);
            }
        });
    }

    /**
     * Fallback capture method
     * @param {HTMLElement} element - Element to capture
     * @param {number} size - Target size
     * @returns {Promise<string>} Data URL
     * @private
     */
    async #fallbackCapture(element, size) {
        return new Promise((resolve) => {
            // Create a simple placeholder image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = size * 2;
            canvas.height = size * 2;

            // Draw a basic chessboard pattern
            ctx.fillStyle = '#f0d9b5';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const squareSize = canvas.width / 8;
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if ((row + col) % 2 === 1) {
                        ctx.fillStyle = '#b58863';
                        ctx.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);
                    }
                }
            }

            // Add text indicating diagram
            ctx.fillStyle = 'black';
            ctx.font = `${size / 10}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText('Chess Position', canvas.width / 2, canvas.height / 2);

            resolve(canvas.toDataURL('image/png'));
        });
    }

    /**
     * Parse FEN string to position object
     * @param {string} fen - FEN string
     * @returns {object} Position object
     * @private
     */
    #parseFEN(fen) {
        const position = {};
        const fenParts = fen.split(' ');
        const boardPart = fenParts[0];
        const ranks = boardPart.split('/');

        for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
            const rank = 8 - rankIndex;
            const rankData = ranks[rankIndex];
            let file = 1;

            for (const char of rankData) {
                if (char >= '1' && char <= '8') {
                    file += parseInt(char);
                } else {
                    const fileChar = String.fromCharCode(96 + file); // a-h
                    const squareName = fileChar + rank;
                    const color = char === char.toUpperCase() ? 'w' : 'b';
                    const pieceType = char.toLowerCase();
                    position[squareName] = color + pieceType;
                    file++;
                }
            }
        }

        return position;
    }

    /**
     * Get Unicode symbol for piece
     * @param {string} piece - Piece code (e.g., 'wk', 'bp')
     * @returns {string} Unicode symbol
     * @private
     */
    #getPieceSymbol(piece) {
        const symbols = {
            'wk': '♔', 'wq': '♕', 'wr': '♖', 'wb': '♗', 'wn': '♘', 'wp': '♙',
            'bk': '♚', 'bq': '♛', 'br': '♜', 'bb': '♝', 'bn': '♞', 'bp': '♟'
        };
        return symbols[piece] || '';
    }

    /**
     * Generate high-quality chess board using canvas drawing
     * @param {object} position - Position object
     * @param {number} size - Board size in pixels
     * @param {boolean} showCoordinates - Whether to show coordinates
     * @returns {Promise<string>} Data URL
     * @private
     */
    async #generateSimpleBoard(position, size = 200, showCoordinates = false) {
        return new Promise(async (resolve) => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const scale = 4; // High resolution
                canvas.width = size * scale;
                canvas.height = size * scale;

                // Get FEN string
                const fenToUse = position.fen || position.content || position.originalInput;
                console.log('Generating board for FEN:', fenToUse);

                // Parse FEN to get piece positions
                const parsedPosition = this.#parseFEN(fenToUse);

                // Set high quality rendering
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                // Draw board background
                ctx.fillStyle = '#f5f5dc'; // Beige background
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw chessboard squares
                const squareSize = (size * scale) / 8;
                for (let rank = 0; rank < 8; rank++) {
                    for (let file = 0; file < 8; file++) {
                        const isLight = (rank + file) % 2 === 0;
                        ctx.fillStyle = isLight ? '#f0d9b5' : '#b58863';
                        
                        const x = file * squareSize;
                        const y = rank * squareSize;
                        ctx.fillRect(x, y, squareSize, squareSize);
                    }
                }

                // Load and cache SVG pieces for maximum quality
                const svgPieces = await this.#loadSVGPieces();

                // Draw pieces with SVG for perfect quality
                for (let rank = 8; rank >= 1; rank--) {
                    for (let file = 1; file <= 8; file++) {
                        const fileChar = String.fromCharCode(96 + file); // a-h
                        const squareName = fileChar + rank;
                        const piece = parsedPosition[squareName];
                        
                        if (piece) {
                            const x = (file - 1) * squareSize;
                            const y = (8 - rank) * squareSize;
                            const pieceSize = squareSize * 0.9; // Slightly smaller than square
                            const offset = squareSize * 0.05; // Center the piece
                            
                            // Try to draw SVG piece first
                            if (svgPieces[piece]) {
                                await this.#drawSVGPiece(ctx, svgPieces[piece], 
                                    x + offset, y + offset, pieceSize);
                            } else {
                                // Fallback to Unicode symbols
                                await this.#drawUnicodePiece(ctx, piece, 
                                    x + squareSize / 2, y + squareSize / 2, squareSize);
                            }
                        }
                    }
                }

                // Add coordinates if requested
                if (showCoordinates) {
                    ctx.font = `${squareSize * 0.15}px Arial`;
                    ctx.fillStyle = '#333333';
                    ctx.textAlign = 'center';
                    
                    // File letters (a-h)
                    for (let file = 1; file <= 8; file++) {
                        const letter = String.fromCharCode(96 + file);
                        const x = (file - 1) * squareSize + squareSize / 2;
                        ctx.fillText(letter, x, canvas.height - squareSize * 0.1);
                    }
                    
                    // Rank numbers (1-8)
                    ctx.textAlign = 'left';
                    for (let rank = 1; rank <= 8; rank++) {
                        const y = (8 - rank) * squareSize + squareSize * 0.2;
                        ctx.fillText(rank.toString(), squareSize * 0.05, y);
                    }
                }

                // Add clean border
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = scale * 2;
                ctx.strokeRect(0, 0, canvas.width, canvas.height);

                const dataURL = canvas.toDataURL('image/png', 1.0);
                console.log('High-quality SVG board generated successfully');
                resolve(dataURL);

            } catch (error) {
                console.error('Error generating board:', error);
                resolve(null);
            }
        });
    }

    /**
     * Load SVG pieces from the chess assets
     * @returns {Promise<Object>} Object with piece codes as keys and SVG elements as values
     * @private
     */
    async #loadSVGPieces() {
        if (!this.svgPiecesCache) {
            try {
                // Load the SVG sprite file
                const svgPath = './cm-chessboard-master/assets/pieces/standard.svg';
                const response = await fetch(svgPath);
                const svgText = await response.text();
                
                // Parse SVG and extract individual pieces
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
                
                this.svgPiecesCache = {};
                
                // Extract each piece by ID
                const pieceIds = ['wk', 'wq', 'wr', 'wb', 'wn', 'wp', 'bk', 'bq', 'br', 'bb', 'bn', 'bp'];
                
                for (const pieceId of pieceIds) {
                    const pieceGroup = svgDoc.getElementById(pieceId);
                    if (pieceGroup) {
                        // Create individual SVG for each piece
                        const pieceSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        pieceSvg.setAttribute('viewBox', '0 0 40 40');
                        pieceSvg.setAttribute('width', '40');
                        pieceSvg.setAttribute('height', '40');
                        
                        // Clone the piece group
                        const clonedGroup = pieceGroup.cloneNode(true);
                        pieceSvg.appendChild(clonedGroup);
                        
                        this.svgPiecesCache[pieceId] = pieceSvg;
                    }
                }
                
                console.log('SVG pieces loaded successfully:', Object.keys(this.svgPiecesCache));
                
            } catch (error) {
                console.error('Error loading SVG pieces:', error);
                // Fallback to null - will use Unicode symbols as backup
                this.svgPiecesCache = {};
            }
        }
        
        return this.svgPiecesCache;
    }

    /**
     * Draw SVG piece on canvas with high quality
     * @param {CanvasRenderingContext2D} ctx Canvas context
     * @param {SVGElement} svgElement SVG element to draw
     * @param {number} x X position
     * @param {number} y Y position  
     * @param {number} size Size to draw
     * @returns {Promise<void>}
     * @private
     */
    async #drawSVGPiece(ctx, svgElement, x, y, size) {
        return new Promise((resolve) => {
            try {
                if (!svgElement) {
                    resolve();
                    return;
                }

                // Convert SVG to data URL
                const svgData = new XMLSerializer().serializeToString(svgElement);
                const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                const url = URL.createObjectURL(svgBlob);

                // Create image and draw to canvas
                const img = new Image();
                img.onload = () => {
                    try {
                        // Draw with high quality scaling
                        ctx.save();
                        ctx.imageSmoothingEnabled = true;
                        ctx.imageSmoothingQuality = 'high';
                        ctx.drawImage(img, x, y, size, size);
                        ctx.restore();
                        
                        URL.revokeObjectURL(url);
                        resolve();
                    } catch (error) {
                        console.error('Error drawing SVG piece:', error);
                        URL.revokeObjectURL(url);
                        resolve();
                    }
                };
                
                img.onerror = () => {
                    console.error('Error loading SVG piece image');
                    URL.revokeObjectURL(url);
                    resolve();
                };
                
                img.src = url;
                
            } catch (error) {
                console.error('Error in drawSVGPiece:', error);
                resolve();
            }
        });
    }

    /**
     * Draw Unicode piece as fallback when SVG is not available
     * @param {CanvasRenderingContext2D} ctx Canvas context
     * @param {string} piece Piece code (e.g., 'wk', 'bp')
     * @param {number} x X position (center)
     * @param {number} y Y position (center)
     * @param {number} squareSize Size of the square
     * @returns {Promise<void>}
     * @private
     */
    async #drawUnicodePiece(ctx, piece, x, y, squareSize) {
        return new Promise((resolve) => {
            try {
                const pieceSymbol = this.#getPieceSymbol(piece);
                const fontSize = squareSize * 0.8;
                
                ctx.font = `${fontSize}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                const isWhite = piece.startsWith('w');
                const scale = 4; // Same scale as board generation
                
                // Shadow for depth
                ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
                ctx.fillText(pieceSymbol, x + scale, y + scale);
                
                // Main piece
                ctx.fillStyle = isWhite ? '#ffffff' : '#000000';
                ctx.fillText(pieceSymbol, x, y);
                
                // Outline for better definition
                ctx.strokeStyle = isWhite ? '#000000' : '#ffffff';
                ctx.lineWidth = scale / 2;
                ctx.strokeText(pieceSymbol, x, y);
                
                resolve();
            } catch (error) {
                console.error('Error drawing Unicode piece:', error);
                resolve();
            }
        });
    }
}

// Make the controller globally accessible for remove buttons
window.pdfController = null;