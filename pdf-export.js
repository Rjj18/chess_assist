/**
 * PDF Export Main Script
 * Handles user interactions and coordinates PDF generation
 */

document.addEventListener('DOMContentLoaded', function() {
    // UI Elements
    const exportBtn = document.getElementById('export-pdf-btn');
    const pgnInput = document.getElementById('pgn-input');
    const fileInput = document.getElementById('pgn-file-input');
    const positionsList = document.getElementById('positions-list');
    const processAdvancedBtn = document.getElementById('process-advanced-pgn');
    
    // Advanced options
    const renderingModeSelect = document.getElementById('rendering-mode');
    const diagramQualitySelect = document.getElementById('diagram-quality');
    
    // Global state
    let currentGames = [];
    let advancedProcessor = null;
    
    // Initialize
    initializeInterface();
    
    /**
     * Initialize interface and event handlers
     */
    function initializeInterface() {
        // Initialize Advanced PGN Processor
        if (window.AdvancedPGNProcessor) {
            advancedProcessor = new AdvancedPGNProcessor();
        }
        
        // File input handler
        if (fileInput) {
            fileInput.addEventListener('change', handleFileUpload);
        }
        
        // PGN textarea handler
        if (pgnInput) {
            pgnInput.addEventListener('input', handlePGNInput);
        }
        
        // Advanced processing button
        if (processAdvancedBtn) {
            processAdvancedBtn.addEventListener('click', handleAdvancedProcessing);
        }
        
        // Export button
        if (exportBtn) {
            exportBtn.addEventListener('click', handlePDFExport);
        }
        
        // Rendering mode change
        if (renderingModeSelect) {
            renderingModeSelect.addEventListener('change', handleRenderingModeChange);
        }
        
        console.log('PDF Export interface initialized');
    }
    
    /**
     * Handle file upload
     */
    async function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        try {
            const text = await readFileAsText(file);
            if (pgnInput) {
                pgnInput.value = text;
            }
            await handlePGNInput({ target: { value: text } });
        } catch (error) {
            console.error('Error reading file:', error);
            showError('Erro ao ler arquivo PGN');
        }
    }
    
    /**
     * Handle PGN input changes
     */
    async function handlePGNInput(event) {
        const pgnText = event.target.value.trim();
        
        if (pgnText.length === 0) {
            currentGames = [];
            updatePositionsList([]);
            updateExportButton();
            return;
        }
        
        try {
            // Try to process with advanced processor first
            if (advancedProcessor) {
                const games = await advancedProcessor.parseMultiGamePGN(pgnText);
                if (games && games.length > 0) {
                    currentGames = games;
                    displayGamesOverview(games);
                    updateExportButton();
                    return;
                }
            }
            
            // Fallback to simple processing
            currentGames = [{ 
                pgn: pgnText,
                metadata: extractSimpleMetadata(pgnText),
                keyPositions: []
            }];
            
            updatePositionsList([]);
            updateExportButton();
            
        } catch (error) {
            console.error('Error processing PGN:', error);
            showError('Erro ao processar PGN: ' + error.message);
        }
    }
    
    /**
     * Handle advanced PGN processing
     */
    async function handleAdvancedProcessing() {
        if (!advancedProcessor || !pgnInput?.value) {
            showError('Nenhum PGN disponível para processamento');
            return;
        }
        
        try {
            showProgress('Processando PGN...');
            
            const games = await advancedProcessor.parseMultiGamePGN(pgnInput.value);
            
            if (games && games.length > 0) {
                // Extract key positions for each game
                for (const game of games) {
                    const positions = advancedProcessor.extractKeyPositions(game);
                    game.keyPositions = positions;
                }
                
                currentGames = games;
                displayGamesWithPositions(games);
                updateExportButton();
                
                showSuccess(`✅ Processamento concluído! ${games.length} jogo(s) encontrado(s)`);
            } else {
                showError('Nenhum jogo válido encontrado no PGN');
            }
            
        } catch (error) {
            console.error('Error in advanced processing:', error);
            showError('Erro no processamento avançado: ' + error.message);
        } finally {
            hideProgress();
        }
    }
    
    /**
     * Handle PDF export
     */
    async function handlePDFExport() {
        if (currentGames.length === 0) {
            showError('Nenhum jogo carregado para exportar');
            return;
        }
        
        try {
            showProgress('Gerando PDF profissional...');
            
            // Get export options
            const options = getExportOptions();
            
            let pdf;
            
            // Use new integration if available
            if (window.PDFExportIntegration) {
                pdf = await window.PDFExportIntegration.export(currentGames, options);
            } else {
                // Fallback to original controller
                pdf = await window.pdfController.generateAdvancedPDF(currentGames, options);
            }
            
            if (pdf) {
                // Generate filename
                const filename = generateFilename(currentGames, options);
                
                // Download PDF
                pdf.save(filename);
                
                showSuccess('✅ PDF gerado com sucesso!');
            } else {
                throw new Error('Falha na geração do PDF');
            }
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            showError('Erro ao gerar PDF: ' + error.message);
        } finally {
            hideProgress();
        }
    }
    
    /**
     * Handle rendering mode change
     */
    function handleRenderingModeChange(event) {
        const mode = event.target.value;
        const qualitySelect = document.getElementById('diagram-quality');
        
        if (qualitySelect) {
            // Update quality options based on mode
            if (window.PDFExportIntegration) {
                window.PDFExportIntegration.updateUI();
            }
        }
        
        // Show quality info
        const infoElement = document.querySelector('.rendering-info');
        if (infoElement) {
            infoElement.remove();
        }
        
        const info = document.createElement('div');
        info.className = 'rendering-info';
        info.style.cssText = 'margin-top: 5px; font-size: 12px; color: #666;';
        
        if (mode === 'vectorial') {
            info.innerHTML = '🔥 <strong>Qualidade Profissional:</strong> SVG vetorial, similar ao LaTeX/XSKak';
            info.style.color = '#d4691a';
        } else {
            info.innerHTML = '📄 <strong>Compatibilidade:</strong> Renderização Canvas tradicional';
        }
        
        event.target.parentNode.appendChild(info);
    }
    
    /**
     * Get export options from form
     */
    function getExportOptions() {
        return {
            title: document.getElementById('header-left')?.value || 'Análise de Xadrez',
            author: document.getElementById('header-right')?.value || 'Chess Assist',
            showHeaders: document.getElementById('include-game-info')?.checked !== false,
            showFooters: document.getElementById('generate-solution-pages')?.checked !== false,
            renderingMode: document.getElementById('rendering-mode')?.value || 'vectorial',
            quality: document.getElementById('diagram-quality')?.value || 'high',
            includeGameInfo: document.getElementById('include-game-info')?.checked !== false,
            includeSolutionSpace: document.getElementById('include-solution-space')?.checked || false,
            generateSolutionPages: document.getElementById('generate-solution-pages')?.checked || false
        };
    }
    
    /**
     * Generate filename for PDF
     */
    function generateFilename(games, options) {
        const timestamp = new Date().toISOString().split('T')[0];
        
        if (games.length === 1 && games[0].metadata) {
            const game = games[0].metadata;
            const white = (game.white || 'Brancas').substring(0, 10);
            const black = (game.black || 'Pretas').substring(0, 10);
            return `chess_analysis_${white}_vs_${black}_${timestamp}.pdf`;
        } else {
            return `chess_analysis_${games.length}_games_${timestamp}.pdf`;
        }
    }
    
    /**
     * Display games overview
     */
    function displayGamesOverview(games) {
        if (!positionsList) return;
        
        positionsList.innerHTML = `
            <div class="games-overview">
                <h4>📋 Jogos Carregados: ${games.length}</h4>
                ${games.map((game, index) => `
                    <div class="game-item">
                        <strong>Jogo ${index + 1}:</strong>
                        ${game.metadata?.white || 'Brancas'} vs ${game.metadata?.black || 'Pretas'}
                        <small>(${game.metadata?.event || 'Evento não especificado'})</small>
                    </div>
                `).join('')}
                <div class="process-hint">
                    💡 Use o botão "🎯 Processar PGN Completo" para extrair posições-chave automaticamente
                </div>
            </div>
        `;
    }
    
    /**
     * Display games with positions
     */
    function displayGamesWithPositions(games) {
        if (!positionsList) return;
        
        const totalPositions = games.reduce((sum, game) => sum + (game.keyPositions?.length || 0), 0);
        
        positionsList.innerHTML = `
            <div class="games-with-positions">
                <h4>✅ ${games.length} Jogo(s) Processado(s) - ${totalPositions} Posições</h4>
                ${games.map((game, gameIndex) => `
                    <div class="game-section">
                        <h5>🏆 Jogo ${gameIndex + 1}: ${game.metadata?.white || 'Brancas'} vs ${game.metadata?.black || 'Pretas'}</h5>
                        <div class="positions-grid">
                            ${(game.keyPositions || []).map((pos, posIndex) => `
                                <div class="position-card">
                                    <strong>Posição ${posIndex + 1}</strong>
                                    <div class="position-info">
                                        <small>Lance: ${pos.moveNumber || 'N/A'}</small>
                                        ${pos.comment ? `<div class="comment">${pos.comment}</div>` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    /**
     * Update positions list
     */
    function updatePositionsList(positions) {
        if (!positionsList) return;
        
        if (positions.length === 0) {
            positionsList.innerHTML = `
                <div class="no-positions">
                    <p>📝 Nenhuma posição selecionada</p>
                    <p><small>Carregue um arquivo PGN ou cole o conteúdo acima</small></p>
                </div>
            `;
            return;
        }
        
        positionsList.innerHTML = positions.map((pos, index) => `
            <div class="position-item">
                <span class="position-number">${index + 1}</span>
                <span class="position-info">Lance ${pos.moveNumber || 'N/A'}</span>
                ${pos.comment ? `<small class="position-comment">${pos.comment}</small>` : ''}
            </div>
        `).join('');
    }
    
    /**
     * Update export button state
     */
    function updateExportButton() {
        if (!exportBtn) return;
        
        const hasGames = currentGames.length > 0;
        const hasPositions = currentGames.some(game => 
            game.keyPositions && game.keyPositions.length > 0
        );
        
        exportBtn.disabled = !hasGames;
        
        if (hasGames && hasPositions) {
            exportBtn.textContent = `📄 Exportar PDF (${currentGames.length} jogo(s))`;
            exportBtn.className = 'button primary';
        } else if (hasGames) {
            exportBtn.textContent = `📄 Exportar PDF (informações apenas)`;
            exportBtn.className = 'button primary';
        } else {
            exportBtn.textContent = '📄 Exportar PDF';
            exportBtn.className = 'button primary';
        }
    }
    
    /**
     * Extract simple metadata from PGN
     */
    function extractSimpleMetadata(pgn) {
        const metadata = {};
        const lines = pgn.split('\n');
        
        for (const line of lines) {
            const match = line.match(/\[(\w+)\s+"([^"]+)"\]/);
            if (match) {
                metadata[match[1].toLowerCase()] = match[2];
            }
        }
        
        return metadata;
    }
    
    /**
     * Utility functions
     */
    function readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = e => reject(e);
            reader.readAsText(file);
        });
    }
    
    function showProgress(message) {
        // Simple progress indicator
        if (exportBtn) {
            exportBtn.disabled = true;
            exportBtn.textContent = message;
        }
    }
    
    function hideProgress() {
        if (exportBtn) {
            exportBtn.disabled = false;
            updateExportButton();
        }
    }
    
    function showError(message) {
        console.error(message);
        alert('Erro: ' + message);
    }
    
    function showSuccess(message) {
        console.log(message);
        // Could implement a toast notification here
    }
});