/**
 * Theme Loader - Loads lesson themes from JSON files
 * ES2024 Module for dynamic theme loading
 * @module ThemeLoader
 */

/**
 * Handles loading and validation of chess lesson themes
 */
export class ThemeLoader {
    #cache = new Map();
    #themeRegistry = new Map();

    constructor() {
        this.#initializeThemeRegistry();
    }

    /**
     * Register available themes
     * @private
     */
    #initializeThemeRegistry() {
        this.#themeRegistry.set('abertura-magica', {
            id: 'abertura-magica',
            name: 'A Abertura Mágica do Xadrez',
            description: 'Princípios fundamentais das aberturas',
            level: 'beginner',
            file: 'themes/abertura-magica.json'
        });

        this.#themeRegistry.set('ataque-duplo', {
            id: 'ataque-duplo',
            name: 'Dominando o Ataque Duplo',
            description: 'Tática de ataque duplo e garfos',
            level: 'intermediate',
            file: 'themes/ataque-duplo.json'
        });

        this.#themeRegistry.set('teste-troca', {
            id: 'teste-troca',
            name: 'Teste de Troca de Tema',
            description: 'Tema simples para testar a troca',
            level: 'beginner',
            file: 'themes/teste-troca.json'
        });
    }

    /**
     * Get list of available themes
     * @returns {Array<Object>} Array of theme metadata
     */
    getAvailableThemes() {
        return Array.from(this.#themeRegistry.values());
    }

    /**
     * Load a theme by ID
     * @param {string} themeId - The theme identifier
     * @returns {Promise<Object>} The loaded theme data
     * @throws {Error} If theme not found or invalid
     */
    async loadTheme(themeId) {
        // Check cache first
        if (this.#cache.has(themeId)) {
            console.log(`📚 Loading theme '${themeId}' from cache`);
            return this.#cache.get(themeId);
        }

        // Check if theme exists in registry
        if (!this.#themeRegistry.has(themeId)) {
            throw new Error(`Theme '${themeId}' not found in registry`);
        }

        const themeInfo = this.#themeRegistry.get(themeId);
        
        try {
            console.log(`📖 Loading theme '${themeId}' from ${themeInfo.file}`);
            
            const response = await fetch(themeInfo.file);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch theme: ${response.status} ${response.statusText}`);
            }

            const themeData = await response.json();
            
            // Validate theme data
            this.#validateTheme(themeData);
            
            // Cache the theme
            this.#cache.set(themeId, themeData);
            
            console.log(`✅ Theme '${themeId}' loaded successfully`);
            return themeData;
            
        } catch (error) {
            console.error(`❌ Failed to load theme '${themeId}':`, error);
            throw error;
        }
    }

    /**
     * Load theme from URL parameter or default
     * @param {string} defaultTheme - Default theme ID to use
     * @returns {Promise<Object>} The loaded theme data
     */
    async loadFromUrlOrDefault(defaultTheme = 'abertura-magica') {
        const urlParams = new URLSearchParams(window.location.search);
        const themeId = urlParams.get('theme') || defaultTheme;
        
        try {
            return await this.loadTheme(themeId);
        } catch (error) {
            console.warn(`Failed to load requested theme '${themeId}', falling back to default`);
            return await this.loadTheme(defaultTheme);
        }
    }

    /**
     * Basic theme validation
     * @param {Object} themeData - The theme data to validate
     * @throws {Error} If theme is invalid
     * @private
     */
    #validateTheme(themeData) {
        const required = ['metadata', 'slides'];
        const missing = required.filter(field => !themeData[field]);
        
        if (missing.length > 0) {
            throw new Error(`Invalid theme: missing required fields: ${missing.join(', ')}`);
        }

        if (!Array.isArray(themeData.slides) || themeData.slides.length === 0) {
            throw new Error('Invalid theme: slides must be a non-empty array');
        }

        // Validate metadata
        const metadataRequired = ['id', 'title', 'description', 'level'];
        const metadataMissing = metadataRequired.filter(field => !themeData.metadata[field]);
        
        if (metadataMissing.length > 0) {
            throw new Error(`Invalid theme metadata: missing fields: ${metadataMissing.join(', ')}`);
        }

        // Validate slides
        themeData.slides.forEach((slide, index) => {
            if (!slide.title || !slide.content) {
                throw new Error(`Invalid slide ${index}: missing title or content`);
            }

            // Validate examples if present
            if (slide.examples) {
                slide.examples.forEach((example, exampleIndex) => {
                    const exampleRequired = ['name', 'moves', 'description', 'pgn'];
                    const exampleMissing = exampleRequired.filter(field => !example[field]);
                    
                    if (exampleMissing.length > 0) {
                        throw new Error(`Invalid example ${exampleIndex} in slide ${index}: missing fields: ${exampleMissing.join(', ')}`);
                    }
                });
            }
        });
    }

    /**
     * Clear theme cache
     */
    clearCache() {
        this.#cache.clear();
        console.log('🗑️ Theme cache cleared');
    }

    /**
     * Get theme from cache
     * @param {string} themeId - Theme identifier
     * @returns {Object|null} Cached theme or null
     */
    getCachedTheme(themeId) {
        return this.#cache.get(themeId) || null;
    }

    /**
     * Register a new theme dynamically
     * @param {Object} themeInfo - Theme registry information
     */
    registerTheme(themeInfo) {
        if (!themeInfo.id || !themeInfo.file) {
            throw new Error('Theme registration requires id and file fields');
        }

        this.#themeRegistry.set(themeInfo.id, themeInfo);
        console.log(`📝 Registered new theme: ${themeInfo.id}`);
    }
}
