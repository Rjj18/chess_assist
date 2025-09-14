/**
 * Presentation App - Main initialization module
 * ES2024 Module for Chess Opening Presentation with dynamic themes
 * @module PresentationApp
 */

import { PresentationManager } from './PresentationManager.js';
import { ThemeSelectorUI } from './ThemeSelectorUI.js';

/**
 * Main Application class for the Chess Opening Presentation
 * Handles initialization and global app state with theme support
 */
export class PresentationApp {
    #presentation = null;
    #themeSelector = null;
    #isInitialized = false;

    /**
     * Initialize the presentation application
     * @param {string} themeId - Optional theme ID to load
     * @returns {Promise<void>}
     */
    async initialize(themeId = null) {
        if (this.#isInitialized) {
            console.warn('Presentation already initialized');
            return;
        }

        try {
            console.log('🚀 Initializing Chess Presentation App...');
            
            // Wait for DOM to be ready
            await this.#waitForDOM();
            
            // Create presentation manager with theme support
            this.#presentation = new PresentationManager(themeId);
            
            // Initialize theme selector UI
            this.#themeSelector = new ThemeSelectorUI(this);
            
            // Export for debugging in development
            if (typeof window !== 'undefined') {
                window.presentation = this.#presentation;
                window.app = this;
            }
            
            this.#isInitialized = true;
            
            console.log('✅ Presentation App initialized successfully!');
            this.#logKeyboardShortcuts();
            
        } catch (error) {
            console.error('❌ Failed to initialize presentation app:', error);
            throw error;
        }
    }

    /**
     * Get the presentation manager instance
     * @returns {PresentationManager|null}
     */
    getPresentation() {
        return this.#presentation;
    }

    /**
     * Check if the app is initialized
     * @returns {boolean}
     */
    isInitialized() {
        return this.#isInitialized;
    }

    /**
     * Switch to a different theme
     * @param {string} themeId - Theme identifier
     * @returns {Promise<void>}
     */
    async switchTheme(themeId) {
        if (!this.#presentation) {
            throw new Error('Presentation not initialized');
        }
        
        await this.#presentation.switchTheme(themeId);
    }

    /**
     * Get available themes
     * @returns {Array<Object>} Array of available themes
     */
    getAvailableThemes() {
        return this.#presentation?.getAvailableThemes() || [];
    }

    /**
     * Wait for DOM to be ready
     * @returns {Promise<void>}
     * @private
     */
    #waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve, { once: true });
            } else {
                resolve();
            }
        });
    }

    /**
     * Log keyboard shortcuts to console
     * @private
     */
    #logKeyboardShortcuts() {
        console.log('⌨️  Atalhos de teclado disponíveis:');
        console.log('   ← / →           : Navegação entre slides');
        console.log('   Shift + ← / →   : Navegação entre lances (todos os tabuleiros)');
        console.log('   Home / End      : Primeiro / último lance (todos os tabuleiros)');
        console.log('   Esc             : Voltar ao primeiro slide');
    }
}

/**
 * Auto-initialize when module is imported
 * Creates global app instance and starts initialization
 */
const app = new PresentationApp();
app.initialize().catch(error => {
    console.error('Failed to start presentation app:', error);
});

// Export the app instance for external access if needed
export default app;
