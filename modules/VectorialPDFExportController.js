/**
 * VectorialPDFExportController - Professional PDF Export with SVG
 * Inspired by chess-pdf LaTeX quality approach
 * Uses pure SVG rendering for professional diagram quality
 */

import SVGChessRenderer from './SVGChessRenderer.js';

class VectorialPDFExportController {
    constructor() {
        this.pageWidth = 210; // A4 width in mm
        this.pageHeight = 297; // A4 height in mm
        this.margin = 20;
        this.lineHeight = 6;
        this.diagramSize = 80; // Size in mm for diagrams
        
        // Professional typography settings
        this.fonts = {
            title: { size: 16, weight: 'bold' },
            subtitle: { size: 12, weight: 'normal' },
            body: { size: 10, weight: 'normal' },
            moves: { size: 10, weight: 'bold' },
            comments: { size: 9, weight: 'normal' },
            coordinates: { size: 8, weight: 'bold' }
        };
        
        this.svgRenderer = null;
    }
    
    /**
     * Initialize the PDF controller
     */
    async initialize() {
        this.svgRenderer = new SVGChessRenderer();
        await this.svgRenderer.initialize();
        return this;
    }
    
    /**
     * Generate professional PDF with SVG diagrams
     */
    async generatePDF(games, options = {}) {
        if (!this.svgRenderer) {
            await this.initialize();
        }
        
        const {
            title = 'Análise de Xadrez',
            author = 'Chess Assist',
            showHeaders = true,
            showFooters = true,
            diagramsPerPage = 'auto',
            format = 'a4'
        } = options;
        
        // Use jsPDF with high quality settings
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: format,
            compress: false, // No compression for maximum quality
            precision: 16 // High precision
        });
        
        // Set document properties
        pdf.setProperties({
            title: title,
            author: author,
            creator: 'Chess Assist - Professional Chess Analysis',
            keywords: 'chess, analysis, tactics, games'
        });
        
        let currentY = this.margin;
        let pageNumber = 1;
        
        // Add title page
        this.addTitlePage(pdf, title, author);
        
        // Process each game
        for (let gameIndex = 0; gameIndex < games.length; gameIndex++) {
            const game = games[gameIndex];
            
            // Start new page for each game (except first)
            if (gameIndex > 0) {
                pdf.addPage();
                pageNumber++;
                currentY = this.margin;
            } else {
                currentY = this.margin;
            }
            
            // Add game header
            currentY = this.addGameHeader(pdf, game, currentY);
            
            // Add game content with diagrams
            currentY = await this.addGameContent(pdf, game, currentY, pageNumber);
            
            // Add footer if enabled
            if (showFooters) {
                this.addFooter(pdf, pageNumber);
            }
        }
        
        return pdf;
    }
    
    /**
     * Add professional title page
     */
    addTitlePage(pdf, title, author) {
        const centerX = this.pageWidth / 2;
        const centerY = this.pageHeight / 2;
        
        // Main title
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(24);
        pdf.setTextColor(44, 62, 80); // Dark blue
        pdf.text(title, centerX, centerY - 20, { align: 'center' });
        
        // Subtitle
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(14);
        pdf.setTextColor(100, 100, 100);
        pdf.text('Análise Profissional de Partidas', centerX, centerY - 5, { align: 'center' });
        
        // Author
        pdf.setFontSize(12);
        pdf.text(`Por: ${author}`, centerX, centerY + 10, { align: 'center' });
        
        // Date
        const date = new Date().toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        pdf.setFontSize(10);
        pdf.text(date, centerX, centerY + 20, { align: 'center' });
        
        // Decorative line
        pdf.setDrawColor(44, 62, 80);
        pdf.setLineWidth(0.5);
        pdf.line(centerX - 40, centerY + 30, centerX + 40, centerY + 30);
        
        // Add new page for content
        pdf.addPage();
    }
    
    /**
     * Add game header with metadata
     */
    addGameHeader(pdf, game, y) {
        const leftX = this.margin;
        let currentY = y + 10;
        
        // Game title
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(this.fonts.title.size);
        pdf.setTextColor(0, 0, 0);
        
        const gameTitle = `${game.white || 'Brancas'} vs ${game.black || 'Pretas'}`;
        pdf.text(gameTitle, leftX, currentY);
        currentY += this.lineHeight * 1.5;
        
        // Game metadata
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(this.fonts.subtitle.size);
        pdf.setTextColor(60, 60, 60);
        
        const metadata = [
            `Evento: ${game.event || 'Não especificado'}`,
            `Local: ${game.site || 'Não especificado'}`,
            `Data: ${game.date || 'Não especificada'}`,
            `Resultado: ${game.result || '*'}`
        ];
        
        metadata.forEach(info => {
            pdf.text(info, leftX, currentY);
            currentY += this.lineHeight;
        });
        
        // Separator line
        currentY += 5;
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.3);
        pdf.line(leftX, currentY, this.pageWidth - this.margin, currentY);
        
        return currentY + 10;
    }
    
    /**
     * Add game content with SVG diagrams
     */
    async addGameContent(pdf, game, startY, pageNumber) {
        let currentY = startY;
        
        // Check if we have positions to display
        if (!game.positions || game.positions.length === 0) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(this.fonts.body.size);
            pdf.setTextColor(100, 100, 100);
            pdf.text('Nenhuma posição selecionada para análise.', this.margin, currentY);
            return currentY + this.lineHeight;
        }
        
        // Process each position
        for (let i = 0; i < game.positions.length; i++) {
            const position = game.positions[i];
            
            // Check if we need a new page
            if (currentY > this.pageHeight - this.margin - this.diagramSize - 30) {
                pdf.addPage();
                pageNumber++;
                currentY = this.margin;
                this.addFooter(pdf, pageNumber);
            }
            
            // Add position header
            currentY = this.addPositionHeader(pdf, position, currentY, i + 1);
            
            // Add SVG diagram
            currentY = await this.addSVGDiagram(pdf, position.fen, currentY);
            
            // Add move analysis if available
            if (position.comment) {
                currentY = this.addPositionComment(pdf, position.comment, currentY);
            }
            
            currentY += 10; // Space between positions
        }
        
        return currentY;
    }
    
    /**
     * Add position header
     */
    addPositionHeader(pdf, position, y, positionNumber) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(this.fonts.moves.size);
        pdf.setTextColor(0, 0, 0);
        
        const moveText = position.moveNumber ? 
            `${positionNumber}. Lance ${position.moveNumber}` :
            `${positionNumber}. Posição de Análise`;
        
        pdf.text(moveText, this.margin, y);
        
        return y + this.lineHeight + 5;
    }
    
    /**
     * Add SVG diagram to PDF
     */
    async addSVGDiagram(pdf, fen, y) {
        try {
            // Create high-quality SVG diagram
            const svgElement = this.svgRenderer.createSVGDiagram(fen, {
                showCoordinates: true,
                borderWidth: 2,
                scale: 2 // High resolution for crisp output
            });
            
            // Convert SVG to string
            const svgString = this.svgRenderer.svgToString(svgElement);
            
            // Calculate position (centered)
            const diagramX = (this.pageWidth - this.diagramSize) / 2;
            
            // Add SVG to PDF with high quality
            await this.addSVGToPDF(pdf, svgString, diagramX, y, this.diagramSize, this.diagramSize);
            
            return y + this.diagramSize + 10;
            
        } catch (error) {
            console.error('Error adding SVG diagram:', error);
            
            // Fallback: add error message
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(this.fonts.body.size);
            pdf.setTextColor(200, 0, 0);
            pdf.text('Erro ao renderizar diagrama', this.margin, y);
            
            return y + this.lineHeight;
        }
    }
    
    /**
     * Add SVG to PDF with maximum quality
     */
    async addSVGToPDF(pdf, svgString, x, y, width, height) {
        try {
            // Method 1: Try to use direct SVG support if available
            if (pdf.addSVG && typeof pdf.addSVG === 'function') {
                pdf.addSVG(svgString, x, y, width, height);
                return;
            }
            
            // Method 2: Convert SVG to high-quality canvas and then to image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // High resolution for crisp output
            const scaleFactor = 4;
            const canvasWidth = width * scaleFactor * 3.78; // Convert mm to pixels (approx)
            const canvasHeight = height * scaleFactor * 3.78;
            
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            
            // Scale context for high resolution
            ctx.scale(scaleFactor * 3.78, scaleFactor * 3.78);
            
            // Create image from SVG
            const img = new Image();
            const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);
            
            return new Promise((resolve, reject) => {
                img.onload = function() {
                    try {
                        // Clear canvas with white background
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(0, 0, width, height);
                        
                        // Draw SVG image
                        ctx.drawImage(img, 0, 0, width, height);
                        
                        // Convert to high-quality image
                        const imageData = canvas.toDataURL('image/png', 1.0);
                        
                        // Add to PDF
                        pdf.addImage(imageData, 'PNG', x, y, width, height, undefined, 'NONE');
                        
                        URL.revokeObjectURL(url);
                        resolve();
                    } catch (error) {
                        URL.revokeObjectURL(url);
                        reject(error);
                    }
                };
                
                img.onerror = function() {
                    URL.revokeObjectURL(url);
                    reject(new Error('Failed to load SVG image'));
                };
                
                img.src = url;
            });
            
        } catch (error) {
            console.error('Error adding SVG to PDF:', error);
            throw error;
        }
    }
    
    /**
     * Add position comment
     */
    addPositionComment(pdf, comment, y) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(this.fonts.comments.size);
        pdf.setTextColor(60, 60, 60);
        
        // Split long comments into multiple lines
        const maxWidth = this.pageWidth - (this.margin * 2);
        const lines = pdf.splitTextToSize(comment, maxWidth);
        
        lines.forEach(line => {
            pdf.text(line, this.margin, y);
            y += this.lineHeight;
        });
        
        return y + 5;
    }
    
    /**
     * Add footer
     */
    addFooter(pdf, pageNumber) {
        const footerY = this.pageHeight - 10;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(120, 120, 120);
        
        // Page number (centered)
        pdf.text(`Página ${pageNumber}`, this.pageWidth / 2, footerY, { align: 'center' });
        
        // Generated by Chess Assist (right)
        pdf.text('Gerado por Chess Assist', this.pageWidth - this.margin, footerY, { align: 'right' });
    }
}

export default VectorialPDFExportController;