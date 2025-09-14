/**
 * Theme Selector UI - Interface for theme selection
 * ES2024 Module for theme selection interface
 * @module ThemeSelectorUI
 */

/**
 * Manages the theme selector dropdown and UI interactions
 */
export class ThemeSelectorUI {
    #selector = null;
    #app = null;
    #isInitialized = false;

    /**
     * Initialize the theme selector UI
     * @param {PresentationApp} app - The presentation app instance
     * @param {string} selectorId - ID of the select element
     */
    constructor(app, selectorId = 'theme-selector') {
        this.#app = app;
        this.#selector = document.getElementById(selectorId);
        this.#initialize();
    }

    /**
     * Initialize the selector with available themes
     * @private
     */
    async #initialize() {
        if (!this.#selector || this.#isInitialized) {
            return;
        }

        try {
            // Wait for app to be ready
            while (!this.#app.isInitialized()) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            const themes = this.#app.getAvailableThemes();
            this.#populateSelector(themes);
            this.#setupEventListeners();
            this.#setCurrentTheme();
            this.#isInitialized = true;

            console.log('🎨 Theme selector initialized');

        } catch (error) {
            console.error('Failed to initialize theme selector:', error);
            this.#showError();
        }
    }

    /**
     * Populate the selector with theme options
     * @param {Array<Object>} themes - Available themes
     * @private
     */
    #populateSelector(themes) {
        // Clear existing options
        this.#selector.innerHTML = '';

        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Selecione um tema...';
        defaultOption.disabled = true;
        this.#selector.appendChild(defaultOption);

        // Add theme options
        themes.forEach(theme => {
            const option = document.createElement('option');
            option.value = theme.id;
            option.textContent = `${theme.name} (${this.#getLevelEmoji(theme.level)} ${theme.level})`;
            option.title = theme.description;
            this.#selector.appendChild(option);
        });
    }

    /**
     * Setup event listeners for theme selection
     * @private
     */
    #setupEventListeners() {
        this.#selector.addEventListener('change', async (event) => {
            const selectedTheme = event.target.value;
            
            if (selectedTheme) {
                await this.#switchTheme(selectedTheme);
            }
        });
    }

    /**
     * Switch to the selected theme
     * @param {string} themeId - Theme identifier
     * @private
     */
    async #switchTheme(themeId) {
        try {
            // Show loading state
            this.#setLoadingState(true);
            
            console.log(`🔄 Switching to theme: ${themeId}`);
            
            // Switch theme
            await this.#app.switchTheme(themeId);
            
            // Update page title
            const currentTheme = this.#app.getPresentation()?.getCurrentTheme();
            if (currentTheme) {
                const pageTitle = document.getElementById('page-title');
                if (pageTitle) {
                    pageTitle.textContent = currentTheme.metadata.title;
                }
            }

            console.log(`✅ Successfully switched to theme: ${themeId}`);

        } catch (error) {
            console.error('❌ Failed to switch theme:', error);
            
            // Reset selector to previous value
            this.#setCurrentTheme();
            
            // Show error message
            this.#showErrorMessage('Erro ao carregar tema. Tente novamente.');
            
        } finally {
            this.#setLoadingState(false);
        }
    }

    /**
     * Set the current theme in the selector
     * @private
     */
    #setCurrentTheme() {
        const currentTheme = this.#app.getPresentation()?.getCurrentTheme();
        if (currentTheme) {
            this.#selector.value = currentTheme.metadata.id;
        }
    }

    /**
     * Set loading state for the selector
     * @param {boolean} isLoading - Whether the selector is loading
     * @private
     */
    #setLoadingState(isLoading) {
        this.#selector.disabled = isLoading;
        
        if (isLoading) {
            this.#selector.style.opacity = '0.6';
            this.#selector.style.cursor = 'wait';
        } else {
            this.#selector.style.opacity = '1';
            this.#selector.style.cursor = 'pointer';
        }
    }

    /**
     * Show error state in selector
     * @private
     */
    #showError() {
        this.#selector.innerHTML = '<option value="">Erro ao carregar temas</option>';
        this.#selector.disabled = true;
    }

    /**
     * Show temporary error message
     * @param {string} message - Error message to show
     * @private
     */
    #showErrorMessage(message) {
        // Create temporary error message
        const errorDiv = document.createElement('div');
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background-color: var(--error-bg, #ffebee);
            color: var(--error-text, #d32f2f);
            padding: var(--spacing-sm) var(--spacing-md);
            border: 1px solid var(--error-border, #e57373);
            border-radius: var(--radius-sm);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;

        // Add animation keyframes
        if (!document.querySelector('#error-animation-style')) {
            const style = document.createElement('style');
            style.id = 'error-animation-style';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(errorDiv);

        // Remove after 3 seconds
        setTimeout(() => {
            errorDiv.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Get emoji for difficulty level
     * @param {string} level - Difficulty level
     * @returns {string} Emoji representation
     * @private
     */
    #getLevelEmoji(level) {
        const levelEmojis = {
            'beginner': '🌱',
            'intermediate': '🎯',
            'advanced': '🚀'
        };
        return levelEmojis[level] || '📚';
    }

    /**
     * Public API to refresh themes
     */
    async refresh() {
        if (this.#app.isInitialized()) {
            const themes = this.#app.getAvailableThemes();
            this.#populateSelector(themes);
            this.#setCurrentTheme();
        }
    }

    /**
     * Get current selected theme ID
     * @returns {string} Current theme ID
     */
    getCurrentThemeId() {
        return this.#selector.value;
    }
}
