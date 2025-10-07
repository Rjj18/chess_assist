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
        this.#themeRegistry.set('o-garfo-no-xadrez', {
            id: 'o-garfo-no-xadrez',
            name: 'Táticas: O Garfo',
            description: 'Domine o garfo, a forma mais famosa de ataque duplo. Aprenda como qualquer peça pode atacar múltiplas peças de uma só vez.',
            level: 'beginner',
            file: 'themes/o-garfo-no-xadrez.json'
        });
        this.#themeRegistry.set('ataque-duplo-geral', {
            id: 'ataque-duplo-geral',
            name: 'Táticas: O Ataque Duplo',
            description: 'Aprenda o princípio geral do ataque duplo, onde uma única peça cria duas ameaças simultâneas no tabuleiro.',
            level: 'intermediate',
            file: 'themes/ataque-duplo-geral.json'
        });
        this.#themeRegistry.set('ataque-descoberto', {
            id: 'ataque-descoberto',
            name: 'Táticas: O Ataque Descoberto',
            description: 'Aprenda a desvendar o poder do ataque descoberto, uma tática sutil e devastadora onde uma peça sai do caminho para revelar um ataque de outra.',
            level: 'intermediate',
            file: 'themes/ataque-descoberto.json'
        });
        this.#themeRegistry.set('xeque-duplo', {
            id: 'xeque-duplo',
            name: 'Táticas: O Xeque Duplo',
            description: 'Conheça a tática mais poderosa do xadrez: o xeque duplo. Entenda por que essa ameaça dupla força o Rei a se mover.',
            level: 'advanced',
            file: 'themes/xeque-duplo.json'
        });
        this.#themeRegistry.set('aprendendo-cravada', {
            id: 'aprendendo-cravada',
            name: 'Táticas de Xadrez: A Cravada',
            description: 'Aprenda a identificar, diferenciar e explorar a cravada, uma das táticas mais comuns no xadrez.',
            level: 'intermediate',
            file: 'themes/aprendendo-cravada.json'
        });
        this.#themeRegistry.set('aprendendo-raio-x', {
            id: 'aprendendo-raio-x',
            name: 'Táticas de Xadrez: O Raio-X',
            description: 'Descubra a tática do Raio-X (ou espeto), o oposto da cravada, e como usá-la para forçar ganhos materiais.',
            level: 'intermediate',
            file: 'themes/aprendendo-raio-x.json'
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
    async loadFromUrlOrDefault(defaultTheme = 'o-garfo-no-xadrez') {
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
