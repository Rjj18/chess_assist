/**
 * HTMLPrintGenerator - Perfect Quality Chess Analysis for Print
 * Generates HTML pages optimized for printing with native SVG quality
 * No PDF conversion = No quality loss
 */

class HTMLPrintGenerator {
    constructor() {
        this.pageWidth = '210mm';   // A4
        this.pageHeight = '297mm';  // A4
        this.margin = '20mm';
        this.diagramSize = '80mm';
        
        // Professional print colors
        this.colors = {
            lightSquare: '#f0d9b5',
            darkSquare: '#b58863',
            border: '#8b7355',
            text: '#333333',
            background: '#ffffff'
        };
        
        this.svgPieces = null;
    }
    
    /**
     * Load SVG pieces from cm-chessboard
     */
    async loadSVGPieces() {
        try {
            const response = await fetch('./cm-chessboard-master/assets/pieces/standard.svg');
            const svgText = await response.text();
            
            // Parse SVG to extract piece definitions
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
            
            this.svgPieces = {};
            
            // Extract symbol definitions
            const symbols = svgDoc.querySelectorAll('symbol');
            symbols.forEach(symbol => {
                const id = symbol.getAttribute('id');
                if (id) {
                    // Clone the symbol content
                    this.svgPieces[id] = symbol.cloneNode(true);
                }
            });
            
            console.log('SVG pieces loaded:', Object.keys(this.svgPieces));
            return true;
        } catch (error) {
            console.error('Error loading SVG pieces:', error);
            return false;
        }
    }
    
    /**
     * Generate complete HTML page for printing
     */
    async generatePrintPage(games, options = {}) {
        if (!this.svgPieces) {
            await this.loadSVGPieces();
        }
        
        const {
            title = 'Análise de Xadrez',
            author = 'Chess Assist',
            showGameInfo = true,
            diagramsPerPage = 4
        } = options;
        
        const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    ${this.generatePrintCSS()}
</head>
<body>
    ${this.generateHeader(title, author)}
    ${this.generateContent(games, options)}
    ${this.generateSVGDefinitions()}
    
    <script>
        // Auto-open print dialog
        window.onload = function() {
            // Small delay to ensure CSS is applied
            setTimeout(() => {
                window.print();
            }, 500);
        };
        
        // Print-specific adjustments
        window.onbeforeprint = function() {
            document.body.classList.add('printing');
        };
        
        window.onafterprint = function() {
            document.body.classList.remove('printing');
        };
    </script>
</body>
</html>`;
        
        return html;
    }
    
    /**
     * Generate print-optimized CSS
     */
    generatePrintCSS() {
        return `<style>
/* Print-optimized CSS for perfect chess diagrams */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&family=Roboto+Slab:wght@400;700&display=swap');

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

@page {
    size: A4;
    margin: ${this.margin};
    
    @top-center {
        content: "";
    }
    
    @bottom-center {
        content: counter(page);
        font-family: 'Roboto', sans-serif;
        font-size: 10pt;
        color: #666;
    }
}

body {
    font-family: 'Roboto', sans-serif;
    font-size: 10pt;
    line-height: 1.4;
    color: ${this.colors.text};
    background: ${this.colors.background};
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}

/* Header Styles */
.page-header {
    text-align: center;
    margin-bottom: 30px;
    border-bottom: 2px solid ${this.colors.border};
    padding-bottom: 15px;
}

.main-title {
    font-family: 'Roboto Slab', serif;
    font-size: 24pt;
    font-weight: 700;
    color: ${this.colors.text};
    margin-bottom: 8px;
}

.subtitle {
    font-size: 12pt;
    color: #666;
    margin-bottom: 5px;
}

.author-info {
    font-size: 10pt;
    color: #888;
}

/* Game Layout */
.game-section {
    page-break-inside: avoid;
    margin-bottom: 40px;
}

.game-header {
    margin-bottom: 20px;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
}

.game-title {
    font-family: 'Roboto Slab', serif;
    font-size: 16pt;
    font-weight: 700;
    margin-bottom: 8px;
}

.game-meta {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    font-size: 9pt;
    color: #666;
}

.meta-item {
    display: flex;
}

.meta-label {
    font-weight: 600;
    margin-right: 5px;
}

/* Positions Grid */
.positions-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20mm;
    margin-top: 20px;
}

.position-item {
    page-break-inside: avoid;
    text-align: center;
}

.position-header {
    font-size: 11pt;
    font-weight: 700;
    margin-bottom: 8px;
    color: ${this.colors.text};
}

/* Chess Board Styles */
.chess-diagram {
    width: ${this.diagramSize};
    height: ${this.diagramSize};
    margin: 0 auto 10px auto;
    border: 2px solid ${this.colors.border};
    display: block;
}

.board-square {
    stroke: none;
}

.light-square {
    fill: ${this.colors.lightSquare};
}

.dark-square {
    fill: ${this.colors.darkSquare};
}

.chess-piece {
    /* SVG pieces inherit their styling */
}

.coordinates {
    font-family: 'Roboto', sans-serif;
    font-size: 8pt;
    font-weight: 700;
    fill: ${this.colors.text};
    text-anchor: middle;
    dominant-baseline: middle;
}

/* Position Comments */
.position-comment {
    font-size: 9pt;
    line-height: 1.3;
    color: #555;
    margin-top: 5px;
    text-align: justify;
    max-width: ${this.diagramSize};
    margin-left: auto;
    margin-right: auto;
}

/* Page Breaks */
.page-break {
    page-break-before: always;
}

/* Print-specific adjustments */
@media print {
    body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }
    
    .chess-diagram {
        break-inside: avoid;
    }
    
    .position-item {
        break-inside: avoid;
    }
    
    .game-section {
        break-inside: avoid;
    }
}

/* Screen preview styles */
@media screen {
    body {
        max-width: 210mm;
        margin: 20px auto;
        box-shadow: 0 0 20px rgba(0,0,0,0.1);
        padding: ${this.margin};
    }
    
    .page-break {
        border-top: 2px dashed #ccc;
        margin: 40px 0;
        padding-top: 40px;
    }
}
</style>`;
    }
    
    /**
     * Generate page header
     */
    generateHeader(title, author) {
        const date = new Date().toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        return `
        <div class="page-header">
            <h1 class="main-title">${title}</h1>
            <p class="subtitle">Análise Profissional de Partidas de Xadrez</p>
            <p class="author-info">Por: ${author} • ${date}</p>
        </div>
        `;
    }
    
    /**
     * Generate main content
     */
    generateContent(games, options) {
        let html = '';
        
        games.forEach((game, gameIndex) => {
            if (gameIndex > 0) {
                html += '<div class="page-break"></div>';
            }
            
            html += this.generateGameSection(game, gameIndex + 1, options);
        });
        
        return html;
    }
    
    /**
     * Generate game section
     */
    generateGameSection(game, gameNumber, options) {
        const positions = game.keyPositions || [];
        
        let html = `
        <div class="game-section">
            <div class="game-header">
                <h2 class="game-title">Jogo ${gameNumber}: ${game.metadata?.white || 'Brancas'} vs ${game.metadata?.black || 'Pretas'}</h2>
                
                ${options.showGameInfo ? `
                <div class="game-meta">
                    <div class="meta-item">
                        <span class="meta-label">Evento:</span>
                        <span>${game.metadata?.event || 'Não especificado'}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Local:</span>
                        <span>${game.metadata?.site || 'Não especificado'}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Data:</span>
                        <span>${game.metadata?.date || 'Não especificada'}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Resultado:</span>
                        <span>${game.metadata?.result || '*'}</span>
                    </div>
                </div>
                ` : ''}
            </div>
            
            <div class="positions-grid">
                ${positions.map((position, index) => this.generatePositionItem(position, index + 1)).join('')}
            </div>
        </div>
        `;
        
        return html;
    }
    
    /**
     * Generate position item with SVG diagram
     */
    generatePositionItem(position, positionNumber) {
        return `
        <div class="position-item">
            <div class="position-header">Posição ${positionNumber}</div>
            ${this.generateSVGDiagram(position.fen)}
            ${position.comment ? `<div class="position-comment">${position.comment}</div>` : ''}
        </div>
        `;
    }
    
    /**
     * Generate SVG chess diagram
     */
    generateSVGDiagram(fen) {
        const board = this.parseFEN(fen);
        const squareSize = 10; // SVG units
        const boardSize = squareSize * 8;
        const coordinateSpace = 6;
        const totalSize = boardSize + (coordinateSpace * 2);
        
        let svg = `
        <svg class="chess-diagram" viewBox="0 0 ${totalSize} ${totalSize}" xmlns="http://www.w3.org/2000/svg">
            <defs id="piece-definitions">
                <!-- Piece definitions will be inserted here -->
            </defs>
            
            <!-- Board background -->
            <rect x="0" y="0" width="${totalSize}" height="${totalSize}" fill="${this.colors.background}"/>
            
            <!-- Squares -->
        `;
        
        // Generate squares
        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
                const isLight = (rank + file) % 2 === 0;
                const x = coordinateSpace + (file * squareSize);
                const y = coordinateSpace + (rank * squareSize);
                
                svg += `<rect x="${x}" y="${y}" width="${squareSize}" height="${squareSize}" 
                        class="board-square ${isLight ? 'light-square' : 'dark-square'}"/>`;
            }
        }
        
        // Generate pieces
        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
                const piece = board[rank][file];
                if (piece) {
                    const x = coordinateSpace + (file * squareSize);
                    const y = coordinateSpace + (rank * squareSize);
                    svg += this.generatePieceSVG(piece, x, y, squareSize);
                }
            }
        }
        
        // Add coordinates
        svg += this.generateCoordinates(coordinateSpace, boardSize, squareSize);
        
        svg += `</svg>`;
        
        return svg;
    }
    
    /**
     * Generate piece SVG
     */
    generatePieceSVG(piece, x, y, size) {
        const color = piece === piece.toUpperCase() ? 'w' : 'b';
        const pieceType = piece.toLowerCase();
        const pieceId = color + pieceType;
        
        // For now, use simple text representation
        // TODO: Integrate actual SVG pieces from cm-chessboard
        const pieceSymbols = {
            'wk': '♔', 'wq': '♕', 'wr': '♖', 'wb': '♗', 'wn': '♘', 'wp': '♙',
            'bk': '♚', 'bq': '♛', 'br': '♜', 'bb': '♝', 'bn': '♞', 'bp': '♟'
        };
        
        const symbol = pieceSymbols[pieceId] || piece;
        const textColor = color === 'w' ? '#ffffff' : '#000000';
        const strokeColor = color === 'w' ? '#000000' : '#ffffff';
        
        return `
        <text x="${x + size/2}" y="${y + size/2}" 
              font-family="serif" font-size="${size * 0.7}" 
              text-anchor="middle" dominant-baseline="middle"
              fill="${textColor}" stroke="${strokeColor}" stroke-width="0.5"
              class="chess-piece">
            ${symbol}
        </text>`;
    }
    
    /**
     * Generate coordinate labels
     */
    generateCoordinates(coordinateSpace, boardSize, squareSize) {
        let coords = '';
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
        
        // File labels (bottom)
        for (let i = 0; i < 8; i++) {
            const x = coordinateSpace + (i * squareSize) + (squareSize / 2);
            const y = coordinateSpace + boardSize + (coordinateSpace * 0.7);
            
            coords += `<text x="${x}" y="${y}" class="coordinates">${files[i]}</text>`;
        }
        
        // Rank labels (left)
        for (let i = 0; i < 8; i++) {
            const x = coordinateSpace * 0.4;
            const y = coordinateSpace + (i * squareSize) + (squareSize / 2);
            
            coords += `<text x="${x}" y="${y}" class="coordinates">${ranks[i]}</text>`;
        }
        
        return coords;
    }
    
    /**
     * Generate SVG piece definitions
     */
    generateSVGDefinitions() {
        if (!this.svgPieces) return '';
        
        let defs = '<svg style="display: none;"><defs>';
        
        Object.entries(this.svgPieces).forEach(([id, symbol]) => {
            defs += symbol.outerHTML;
        });
        
        defs += '</defs></svg>';
        
        return defs;
    }
    
    /**
     * Parse FEN to board array
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
                    const emptyCount = parseInt(char);
                    for (let i = 0; i < emptyCount; i++) {
                        row.push(null);
                        file++;
                    }
                } else {
                    row.push(char);
                    file++;
                }
            }
            board.push(row);
        }
        
        return board;
    }
    
    /**
     * Open HTML in new window/tab for printing
     */
    openPrintWindow(htmlContent) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Auto-focus for immediate printing
        printWindow.focus();
        
        return printWindow;
    }
}

export default HTMLPrintGenerator;