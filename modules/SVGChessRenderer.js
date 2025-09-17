/**
 * SVGChessRenderer - Professional Chess Diagram Renderer
 * Inspired by chess-pdf LaTeX/XSKak approach
 * Creates pure SVG diagrams for high-quality PDF export
 */

class SVGChessRenderer {
    constructor() {
        this.squareSize = 60; // Base square size
        this.boardSize = this.squareSize * 8;
        this.coordinateFont = 'Arial, sans-serif';
        this.coordinateFontSize = 12;
        
        // Professional color scheme (similar to LaTeX xskak)
        this.colors = {
            lightSquare: '#f0d9b5',
            darkSquare: '#b58863',
            border: '#8b7355',
            coordinates: '#333333',
            background: '#ffffff'
        };
        
        // Piece symbols mapping for SVG paths
        this.pieceSymbols = {
            'K': 'king',
            'Q': 'queen', 
            'R': 'rook',
            'B': 'bishop',
            'N': 'knight',
            'P': 'pawn'
        };
    }
    
    /**
     * Load SVG piece definitions from cm-chessboard
     */
    async loadPieceDefinitions() {
        try {
            // Use the standard SVG pieces from cm-chessboard
            const pieceResponse = await fetch('./cm-chessboard-master/assets/pieces/standard.svg');
            const piecesSvgText = await pieceResponse.text();
            
            // Parse SVG to extract piece definitions
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(piecesSvgText, 'image/svg+xml');
            
            this.pieceDefinitions = {};
            
            // Extract each piece definition
            const defs = svgDoc.querySelector('defs');
            if (defs) {
                const symbols = defs.querySelectorAll('symbol');
                symbols.forEach(symbol => {
                    const id = symbol.getAttribute('id');
                    if (id) {
                        this.pieceDefinitions[id] = symbol.innerHTML;
                    }
                });
            }
            
            return true;
        } catch (error) {
            console.warn('Could not load SVG pieces, using fallback');
            this.createFallbackPieces();
            return false;
        }
    }
    
    /**
     * Create fallback piece representations if SVG loading fails
     */
    createFallbackPieces() {
        this.pieceDefinitions = {
            'wk': '♔', 'wq': '♕', 'wr': '♖', 'wb': '♗', 'wn': '♘', 'wp': '♙',
            'bk': '♚', 'bq': '♛', 'br': '♜', 'bb': '♝', 'bn': '♞', 'bp': '♟'
        };
    }
    
    /**
     * Parse FEN to board position
     */
    parseFEN(fen) {
        const parts = fen.split(' ');
        const position = parts[0];
        const board = [];
        
        const rows = position.split('/');
        for (let rank = 0; rank < 8; rank++) {
            const row = [];
            let file = 0;
            
            for (const char of rows[rank]) {
                if (char >= '1' && char <= '8') {
                    // Empty squares
                    const emptyCount = parseInt(char);
                    for (let i = 0; i < emptyCount; i++) {
                        row.push(null);
                        file++;
                    }
                } else {
                    // Piece
                    row.push(char);
                    file++;
                }
            }
            board.push(row);
        }
        
        return board;
    }
    
    /**
     * Create complete SVG diagram with professional layout
     */
    createSVGDiagram(fen, options = {}) {
        const {
            showCoordinates = true,
            borderWidth = 2,
            scale = 1
        } = options;
        
        const actualSquareSize = this.squareSize * scale;
        const actualBoardSize = actualSquareSize * 8;
        const margin = showCoordinates ? 20 * scale : 5 * scale;
        const totalSize = actualBoardSize + (margin * 2);
        
        // Create SVG element
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', totalSize);
        svg.setAttribute('height', totalSize);
        svg.setAttribute('viewBox', `0 0 ${totalSize} ${totalSize}`);
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        
        // Add background
        const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        background.setAttribute('width', totalSize);
        background.setAttribute('height', totalSize);
        background.setAttribute('fill', this.colors.background);
        svg.appendChild(background);
        
        // Create defs section for piece symbols
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        svg.appendChild(defs);
        
        // Board group
        const boardGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        boardGroup.setAttribute('transform', `translate(${margin}, ${margin})`);
        svg.appendChild(boardGroup);
        
        // Draw board border
        if (borderWidth > 0) {
            const border = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            border.setAttribute('x', -borderWidth);
            border.setAttribute('y', -borderWidth);
            border.setAttribute('width', actualBoardSize + (borderWidth * 2));
            border.setAttribute('height', actualBoardSize + (borderWidth * 2));
            border.setAttribute('fill', this.colors.border);
            border.setAttribute('stroke', 'none');
            boardGroup.appendChild(border);
        }
        
        // Draw squares
        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
                const isLight = (rank + file) % 2 === 0;
                const square = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                
                square.setAttribute('x', file * actualSquareSize);
                square.setAttribute('y', rank * actualSquareSize);
                square.setAttribute('width', actualSquareSize);
                square.setAttribute('height', actualSquareSize);
                square.setAttribute('fill', isLight ? this.colors.lightSquare : this.colors.darkSquare);
                square.setAttribute('stroke', 'none');
                
                boardGroup.appendChild(square);
            }
        }
        
        // Parse FEN and place pieces
        const board = this.parseFEN(fen);
        this.placePieces(boardGroup, board, actualSquareSize, scale);
        
        // Add coordinates if requested
        if (showCoordinates) {
            this.addCoordinates(svg, actualBoardSize, margin, scale);
        }
        
        return svg;
    }
    
    /**
     * Place pieces on the board
     */
    placePieces(boardGroup, board, squareSize, scale) {
        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
                const piece = board[rank][file];
                if (piece) {
                    this.placePiece(boardGroup, piece, file, rank, squareSize, scale);
                }
            }
        }
    }
    
    /**
     * Place individual piece
     */
    placePiece(boardGroup, piece, file, rank, squareSize, scale) {
        const color = piece === piece.toUpperCase() ? 'w' : 'b';
        const pieceType = piece.toLowerCase();
        const pieceId = color + pieceType;
        
        // Calculate position (center of square)
        const x = file * squareSize + (squareSize * 0.1);
        const y = rank * squareSize + (squareSize * 0.1);
        const pieceSize = squareSize * 0.8;
        
        if (this.pieceDefinitions && this.pieceDefinitions[pieceId]) {
            // Use SVG piece definition
            const pieceGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            pieceGroup.setAttribute('transform', `translate(${x}, ${y})`);
            
            const pieceUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            pieceUse.setAttribute('href', `#${pieceId}`);
            pieceUse.setAttribute('width', pieceSize);
            pieceUse.setAttribute('height', pieceSize);
            
            pieceGroup.appendChild(pieceUse);
            boardGroup.appendChild(pieceGroup);
        } else {
            // Fallback to text representation
            const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            textElement.setAttribute('x', x + (squareSize * 0.4));
            textElement.setAttribute('y', y + (squareSize * 0.6));
            textElement.setAttribute('font-family', 'serif');
            textElement.setAttribute('font-size', squareSize * 0.7);
            textElement.setAttribute('text-anchor', 'middle');
            textElement.setAttribute('dominant-baseline', 'middle');
            textElement.setAttribute('fill', color === 'w' ? '#ffffff' : '#000000');
            textElement.setAttribute('stroke', color === 'w' ? '#000000' : '#ffffff');
            textElement.setAttribute('stroke-width', '1');
            
            const pieceSymbol = this.pieceDefinitions[pieceId] || piece;
            textElement.textContent = pieceSymbol;
            
            boardGroup.appendChild(textElement);
        }
    }
    
    /**
     * Add coordinate labels around the board
     */
    addCoordinates(svg, boardSize, margin, scale) {
        const fontSize = this.coordinateFontSize * scale;
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
        
        // File labels (bottom)
        for (let i = 0; i < 8; i++) {
            const x = margin + (i * (boardSize / 8)) + (boardSize / 16);
            const y = margin + boardSize + (fontSize * 1.2);
            
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x);
            text.setAttribute('y', y);
            text.setAttribute('font-family', this.coordinateFont);
            text.setAttribute('font-size', fontSize);
            text.setAttribute('font-weight', 'bold');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', this.colors.coordinates);
            text.textContent = files[i];
            
            svg.appendChild(text);
        }
        
        // Rank labels (left)
        for (let i = 0; i < 8; i++) {
            const x = margin - (fontSize * 0.8);
            const y = margin + (i * (boardSize / 8)) + (boardSize / 16) + (fontSize * 0.3);
            
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x);
            text.setAttribute('y', y);
            text.setAttribute('font-family', this.coordinateFont);
            text.setAttribute('font-size', fontSize);
            text.setAttribute('font-weight', 'bold');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', this.colors.coordinates);
            text.textContent = ranks[i];
            
            svg.appendChild(text);
        }
    }
    
    /**
     * Convert SVG to string for PDF embedding
     */
    svgToString(svgElement) {
        const serializer = new XMLSerializer();
        let svgString = serializer.serializeToString(svgElement);
        
        // Ensure proper XML declaration and namespace
        if (!svgString.includes('<?xml')) {
            svgString = '<?xml version="1.0" encoding="UTF-8"?>' + svgString;
        }
        
        return svgString;
    }
    
    /**
     * Initialize renderer (load pieces if needed)
     */
    async initialize() {
        await this.loadPieceDefinitions();
        return this;
    }
}

export default SVGChessRenderer;