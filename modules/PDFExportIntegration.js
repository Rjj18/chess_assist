/**
 * PDF Export Integration Script
 * Integrates the new Vectorial PDF Controller with the existing interface
 */

import VectorialPDFExportController from './modules/VectorialPDFExportController.js';
import { PDFExportController } from './modules/PDFExportController.js';

class PDFExportIntegration {
    constructor() {
        this.vectorialController = null;
        this.canvasController = null;
        this.currentMode = 'vectorial';
        this.isInitialized = false;
    }
    
    /**
     * Initialize both controllers
     */
    async initialize() {
        if (this.isInitialized) return;
        
        try {
            // Initialize vectorial controller
            this.vectorialController = new VectorialPDFExportController();
            await this.vectorialController.initialize();
            
            // Initialize canvas controller (fallback)
            this.canvasController = new PDFExportController();
            
            this.isInitialized = true;
            console.log('PDF Export controllers initialized successfully');
        } catch (error) {
            console.error('Error initializing PDF controllers:', error);
            // Fall back to canvas only
            this.currentMode = 'canvas';
            this.canvasController = new PDFExportController();
        }
    }
    
    /**
     * Export PDF using selected rendering mode
     */
    async exportPDF(games, options = {}) {
        if (!this.isInitialized) {
            await this.initialize();
        }
        
        const renderingMode = document.getElementById('rendering-mode')?.value || 'vectorial';
        const diagramQuality = document.getElementById('diagram-quality')?.value || 'high';
        
        console.log(`Exporting PDF with ${renderingMode} rendering, ${diagramQuality} quality`);
        
        try {
            if (renderingMode === 'vectorial' && this.vectorialController) {
                return await this.exportVectorialPDF(games, options, diagramQuality);
            } else {
                return await this.exportCanvasPDF(games, options, diagramQuality);
            }
        } catch (error) {
            console.error(`Error with ${renderingMode} rendering, falling back to canvas:`, error);
            
            // Fallback to canvas rendering
            if (renderingMode === 'vectorial' && this.canvasController) {
                return await this.exportCanvasPDF(games, options, diagramQuality);
            }
            
            throw error;
        }
    }
    
    /**
     * Export using vectorial (SVG) rendering
     */
    async exportVectorialPDF(games, options, quality) {
        const processedGames = this.prepareGamesForVectorial(games);
        
        const pdfOptions = {
            title: options.title || 'Análise de Xadrez Profissional',
            author: options.author || 'Chess Assist',
            showHeaders: options.showHeaders !== false,
            showFooters: options.showFooters !== false,
            format: 'a4',
            quality: quality
        };
        
        const pdf = await this.vectorialController.generatePDF(processedGames, pdfOptions);
        
        // Add metadata
        pdf.setProperties({
            title: pdfOptions.title,
            author: pdfOptions.author,
            subject: 'Chess Game Analysis',
            creator: 'Chess Assist - Professional Chess Analysis Tool',
            keywords: 'chess, analysis, tactics, professional, vectorial'
        });
        
        return pdf;
    }
    
    /**
     * Export using canvas rendering (fallback/compatibility)
     */
    async exportCanvasPDF(games, options, quality) {
        // Map quality to scale factor
        const qualityMap = {
            'ultra': 8,
            'high': 4,
            'medium': 2
        };
        
        const scale = qualityMap[quality] || 4;
        
        const pdfOptions = {
            ...options,
            scale: scale,
            compression: 'NONE',
            format: 'a4'
        };
        
        return await this.canvasController.generateAdvancedPDF(games, pdfOptions);
    }
    
    /**
     * Prepare games data for vectorial rendering
     */
    prepareGamesForVectorial(games) {
        return games.map(game => ({
            // Game metadata
            white: game.metadata?.white || game.white || 'Brancas',
            black: game.metadata?.black || game.black || 'Pretas',
            event: game.metadata?.event || game.event || 'Análise Chess Assist',
            site: game.metadata?.site || game.site || 'Chess Assist',
            date: game.metadata?.date || game.date || new Date().toISOString().split('T')[0],
            result: game.metadata?.result || game.result || '*',
            
            // Positions for analysis
            positions: game.keyPositions?.map((pos, index) => ({
                fen: pos.fen,
                moveNumber: pos.moveNumber || `${index + 1}`,
                comment: pos.comment || pos.description || '',
                isKeyPosition: true,
                analysis: pos.analysis || ''
            })) || []
        }));
    }
    
    /**
     * Get available rendering modes
     */
    getAvailableModes() {
        const modes = ['canvas'];
        
        if (this.vectorialController) {
            modes.unshift('vectorial');
        }
        
        return modes;
    }
    
    /**
     * Check if vectorial rendering is available
     */
    isVectorialAvailable() {
        return this.vectorialController !== null;
    }
    
    /**
     * Get quality options for current mode
     */
    getQualityOptions(mode = null) {
        const currentMode = mode || this.currentMode;
        
        if (currentMode === 'vectorial') {
            return {
                'ultra': { name: 'Ultra (4K)', description: 'Para impressão profissional' },
                'high': { name: 'Alta (2K)', description: 'Padrão recomendado' },
                'medium': { name: 'Média (1K)', description: 'Para visualização' }
            };
        } else {
            return {
                'ultra': { name: 'Ultra (8x)', description: 'Máxima qualidade' },
                'high': { name: 'Alta (4x)', description: 'Boa qualidade' },
                'medium': { name: 'Média (2x)', description: 'Qualidade básica' }
            };
        }
    }
}

// Global instance
let pdfExportIntegration = null;

/**
 * Initialize PDF export integration
 */
async function initializePDFExport() {
    if (!pdfExportIntegration) {
        pdfExportIntegration = new PDFExportIntegration();
        await pdfExportIntegration.initialize();
    }
    return pdfExportIntegration;
}

/**
 * Export PDF with automatic controller selection
 */
async function exportPDFWithBestQuality(games, options = {}) {
    const integration = await initializePDFExport();
    return await integration.exportPDF(games, options);
}

/**
 * Update UI based on available features
 */
async function updatePDFExportUI() {
    const integration = await initializePDFExport();
    const renderingSelect = document.getElementById('rendering-mode');
    
    if (renderingSelect) {
        // Clear existing options
        renderingSelect.innerHTML = '';
        
        // Add available modes
        const modes = integration.getAvailableModes();
        
        modes.forEach(mode => {
            const option = document.createElement('option');
            option.value = mode;
            
            if (mode === 'vectorial') {
                option.text = '🔥 Vetorial (Qualidade Profissional - LaTeX Quality)';
                option.selected = true;
            } else {
                option.text = 'Canvas (Compatibilidade)';
            }
            
            renderingSelect.appendChild(option);
        });
        
        // Add change handler
        renderingSelect.addEventListener('change', function() {
            const qualitySelect = document.getElementById('diagram-quality');
            if (qualitySelect) {
                updateQualityOptions(this.value);
            }
        });
        
        // Initialize quality options
        updateQualityOptions(renderingSelect.value);
    }
}

/**
 * Update quality options based on rendering mode
 */
function updateQualityOptions(mode) {
    const qualitySelect = document.getElementById('diagram-quality');
    if (!qualitySelect) return;
    
    qualitySelect.innerHTML = '';
    
    const options = pdfExportIntegration.getQualityOptions(mode);
    
    Object.entries(options).forEach(([value, config]) => {
        const option = document.createElement('option');
        option.value = value;
        option.text = `${config.name} - ${config.description}`;
        
        if (value === 'high') {
            option.selected = true;
        }
        
        qualitySelect.appendChild(option);
    });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updatePDFExportUI);
} else {
    updatePDFExportUI();
}

// Export for use in other modules
window.PDFExportIntegration = {
    initialize: initializePDFExport,
    export: exportPDFWithBestQuality,
    updateUI: updatePDFExportUI
};