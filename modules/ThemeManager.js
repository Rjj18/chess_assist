/**
 * Theme Manager Module
 * Handles light/dark mode toggle and persistence
 * @module ThemeManager
 */

export class ThemeManager {
    #currentTheme;
    #themeToggleButton;
    #storageKey = 'chess-assist-theme';

    constructor() {
        this.#currentTheme = this.#getStoredTheme() || this.#getSystemPreference();
        this.#initializeTheme();
        this.#setupThemeToggle();
        this.#setupSystemThemeListener();
    }

    /**
     * Gets the stored theme from localStorage
     * @returns {string|null} The stored theme or null if not found
     * @private
     */
    #getStoredTheme() {
        try {
            return localStorage.getItem(this.#storageKey);
        } catch (error) {
            console.warn('Could not access localStorage for theme:', error);
            return null;
        }
    }

    /**
     * Gets the system's preferred color scheme
     * @returns {string} 'dark' or 'light'
     * @private
     */
    #getSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    /**
     * Stores the theme preference in localStorage
     * @param {string} theme - The theme to store
     * @private
     */
    #storeTheme(theme) {
        try {
            localStorage.setItem(this.#storageKey, theme);
        } catch (error) {
            console.warn('Could not store theme in localStorage:', error);
        }
    }

    /**
     * Initializes the theme on page load
     * @private
     */
    #initializeTheme() {
        this.#applyTheme(this.#currentTheme);
    }

    /**
     * Applies the theme to the document
     * @param {string} theme - The theme to apply ('light' or 'dark')
     * @private
     */
    #applyTheme(theme) {
        const isValidTheme = theme === 'light' || theme === 'dark';
        if (!isValidTheme) {
            console.warn('Invalid theme:', theme);
            theme = 'light';
        }

        // Remove existing theme
        document.documentElement.removeAttribute('data-theme');
        
        // Apply new theme
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        this.#currentTheme = theme;
        this.#updateToggleState();
        
        // Store the preference
        this.#storeTheme(theme);

        // Dispatch custom event for other components
        this.#dispatchThemeChangeEvent(theme);
    }

    /**
     * Sets up the theme toggle button
     * @private
     */
    #setupThemeToggle() {
        this.#themeToggleButton = document.getElementById('themeToggle');
        
        if (!this.#themeToggleButton) {
            console.warn('Theme toggle button not found');
            return;
        }

        this.#themeToggleButton.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Handle keyboard navigation
        this.#themeToggleButton.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.toggleTheme();
            }
        });

        this.#updateToggleState();
    }

    /**
     * Updates the toggle button state to reflect current theme
     * @private
     */
    #updateToggleState() {
        if (!this.#themeToggleButton) return;

        const isDark = this.#currentTheme === 'dark';
        this.#themeToggleButton.setAttribute('aria-checked', isDark.toString());
        
        // Update button title for better accessibility
        const title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
        this.#themeToggleButton.setAttribute('title', title);
    }

    /**
     * Sets up listener for system theme changes
     * @private
     */
    #setupSystemThemeListener() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            mediaQuery.addEventListener('change', (event) => {
                // Only auto-switch if user hasn't manually set a preference
                const storedTheme = this.#getStoredTheme();
                if (!storedTheme) {
                    this.#applyTheme(event.matches ? 'dark' : 'light');
                }
            });
        }
    }

    /**
     * Dispatches a custom theme change event
     * @param {string} theme - The new theme
     * @private
     */
    #dispatchThemeChangeEvent(theme) {
        const event = new CustomEvent('themechange', {
            detail: { theme },
            bubbles: true
        });
        document.dispatchEvent(event);
    }

    /**
     * Toggles between light and dark themes
     * @public
     */
    toggleTheme() {
        const newTheme = this.#currentTheme === 'light' ? 'dark' : 'light';
        this.#applyTheme(newTheme);
        
        // Announce the change for screen readers
        this.#announceThemeChange(newTheme);
    }

    /**
     * Sets a specific theme
     * @param {string} theme - The theme to set ('light' or 'dark')
     * @public
     */
    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.#applyTheme(theme);
        } else {
            console.warn('Invalid theme provided:', theme);
        }
    }

    /**
     * Gets the current theme
     * @returns {string} The current theme ('light' or 'dark')
     * @public
     */
    getCurrentTheme() {
        return this.#currentTheme;
    }

    /**
     * Announces theme change for screen readers
     * @param {string} theme - The new theme
     * @private
     */
    #announceThemeChange(theme) {
        const announcement = `Switched to ${theme} mode`;
        
        // Create a temporary element for screen reader announcement
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.textContent = announcement;
        
        document.body.appendChild(announcer);
        
        // Remove the announcer after the announcement
        setTimeout(() => {
            document.body.removeChild(announcer);
        }, 1000);
    }

    /**
     * Checks if the user prefers reduced motion
     * @returns {boolean} True if user prefers reduced motion
     * @public
     */
    prefersReducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /**
     * Checks if the system prefers high contrast
     * @returns {boolean} True if system prefers high contrast
     * @public
     */
    prefersHighContrast() {
        return window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches;
    }
}