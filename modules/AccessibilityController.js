/**
 * AccessibilityController - Gerencia funcionalidades de acessibilidade
 * Inclui conversão de texto para caixa alta, alto contraste, etc.
 */
export class AccessibilityController {
    #isUppercaseEnabled = false;
    #isHighContrastEnabled = false;
    #originalTexts = new Map();

    constructor() {
        this.#init();
    }

    #init() {
        this.#createAccessibilityPanel();
        this.#loadSavedSettings();
    }

    #createAccessibilityPanel() {
        // Criar painel de acessibilidade integrado ao header
        const panel = document.createElement('div');
        panel.id = 'accessibility-panel';
        panel.className = 'accessibility-panel';
        panel.innerHTML = `
            <div class="accessibility-content">
                <div class="accessibility-option">
                    <label for="uppercase-toggle">
                        <input type="checkbox" id="uppercase-toggle">
                        📝 Texto em Caixa Alta
                    </label>
                </div>
                <div class="accessibility-option">
                    <label for="high-contrast-toggle">
                        <input type="checkbox" id="high-contrast-toggle">
                        🎨 Alto Contraste
                    </label>
                </div>
                <div class="accessibility-option">
                    <label for="font-size-slider">
                        📏 Tamanho da Fonte: <span id="font-size-value">100%</span>
                    </label>
                    <input type="range" id="font-size-slider" min="80" max="150" value="100" step="10">
                </div>
                <div class="accessibility-actions">
                    <button id="reset-accessibility" class="reset-btn">🔄 Restaurar Padrão</button>
                </div>
            </div>
        `;

        // Criar botão de acessibilidade integrado ao header
        const accessibilityBtn = document.createElement('button');
        accessibilityBtn.id = 'accessibility-toggle';
        accessibilityBtn.className = 'accessibility-toggle';
        accessibilityBtn.innerHTML = '♿';
        accessibilityBtn.setAttribute('aria-label', 'Abrir opções de acessibilidade');
        accessibilityBtn.setAttribute('title', 'Acessibilidade (Alt + A)');

        // Adicionar CSS para o painel
        this.#addAccessibilityStyles();

        // Inserir o botão no header existente
        this.#insertIntoHeader(accessibilityBtn, panel);

        // Configurar event listeners
        this.#setupEventListeners();
    }

    #insertIntoHeader(button, panel) {
        const header = document.querySelector('.header');
        
        if (header) {
            // Procurar por controles existentes no header
            const headerControls = header.querySelector('.header-controls');
            const themeToggle = header.querySelector('.theme-toggle');
            
            if (headerControls) {
                // Se existe .header-controls, adicionar antes do theme-toggle
                headerControls.insertBefore(button, themeToggle);
                headerControls.appendChild(panel);
            } else if (themeToggle) {
                // Se existe apenas theme-toggle, criar um container
                const controlsDiv = document.createElement('div');
                controlsDiv.className = 'header-controls';
                controlsDiv.appendChild(button);
                controlsDiv.appendChild(themeToggle);
                controlsDiv.appendChild(panel);
                header.appendChild(controlsDiv);
            } else {
                // Se não há controles, criar o container do zero
                const controlsDiv = document.createElement('div');
                controlsDiv.className = 'header-controls';
                controlsDiv.appendChild(button);
                controlsDiv.appendChild(panel);
                header.appendChild(controlsDiv);
            }
        } else {
            // Fallback: adicionar ao body se não houver header
            document.body.appendChild(button);
            document.body.appendChild(panel);
        }
    }

    #addAccessibilityStyles() {
        const style = document.createElement('style');
        style.id = 'accessibility-styles';
        style.textContent = `
            /* Botão de acessibilidade integrado ao header */
            .accessibility-toggle {
                background: #4CAF50;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                padding: 8px 12px;
                border-radius: 6px;
                transition: all 0.3s ease;
                margin-right: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 40px;
                min-width: 40px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }

            .accessibility-toggle:hover {
                background: #45a049;
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            }

            .accessibility-toggle:active {
                transform: translateY(0);
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }

            /* Painel de acessibilidade como dropdown */
            .accessibility-panel {
                position: absolute;
                top: 100%;
                right: 0;
                background: #fff;
                border: 2px solid #ddd;
                border-radius: 8px;
                padding: 0;
                z-index: 10000;
                box-shadow: 0 8px 24px rgba(0,0,0,0.15);
                font-family: Arial, sans-serif;
                font-size: 14px;
                min-width: 280px;
                max-width: 320px;
                display: none;
                margin-top: 8px;
            }

            .accessibility-panel.show {
                display: block;
                animation: slideDown 0.3s ease-out;
            }

            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Certifica que o header controls tenha position relative */
            .header-controls {
                position: relative;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .accessibility-content {
                padding: 20px;
            }

            .accessibility-option {
                margin-bottom: 15px;
            }

            .accessibility-option label {
                display: flex;
                align-items: center;
                cursor: pointer;
                font-weight: 500;
                color: #333;
            }

            .accessibility-option input[type="checkbox"] {
                margin-right: 8px;
                transform: scale(1.2);
                accent-color: #4CAF50;
            }

            .accessibility-option input[type="range"] {
                width: 100%;
                margin-top: 5px;
                accent-color: #4CAF50;
            }

            .accessibility-actions {
                border-top: 1px solid #eee;
                padding-top: 15px;
                margin-top: 15px;
                text-align: center;
            }

            .reset-btn {
                background: #f44336;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: background-color 0.3s ease;
            }

            .reset-btn:hover {
                background: #d32f2f;
            }

            /* Alto contraste */
            body.high-contrast {
                background: #000 !important;
                color: #fff !important;
            }

            body.high-contrast * {
                background-color: inherit !important;
                color: inherit !important;
                border-color: #fff !important;
            }

            body.high-contrast .button,
            body.high-contrast button {
                background: #fff !important;
                color: #000 !important;
                border: 2px solid #fff !important;
            }

            body.high-contrast .accessibility-panel {
                background: #000 !important;
                border-color: #fff !important;
            }

            body.high-contrast .accessibility-toggle {
                background: #fff !important;
                color: #000 !important;
            }

            body.high-contrast .chessboard-container {
                filter: invert(1) hue-rotate(180deg);
            }

            /* Texto em caixa alta */
            body.uppercase-text * {
                text-transform: uppercase !important;
            }

            /* Responsivo */
            @media (max-width: 768px) {
                .accessibility-panel {
                    right: -10px;
                    left: -10px;
                    max-width: none;
                    min-width: auto;
                }
                
                .header-controls {
                    flex-wrap: wrap;
                }
            }

            @media (max-width: 480px) {
                .accessibility-toggle {
                    font-size: 16px;
                    padding: 6px 10px;
                    margin-right: 5px;
                }
                
                .accessibility-content {
                    padding: 15px;
                }
            }

            /* Estilo para dark theme */
            body.dark-theme .accessibility-panel {
                background: #2d2d2d;
                border-color: #555;
                color: #fff;
            }

            body.dark-theme .accessibility-option label {
                color: #fff;
            }

            body.dark-theme .reset-btn {
                background: #ff5722;
            }

            body.dark-theme .reset-btn:hover {
                background: #e64a19;
            }
        `;

        document.head.appendChild(style);
    }

    #setupEventListeners() {
        const toggle = document.getElementById('accessibility-toggle');
        const panel = document.getElementById('accessibility-panel');
        const uppercaseToggle = document.getElementById('uppercase-toggle');
        const contrastToggle = document.getElementById('high-contrast-toggle');
        const fontSizeSlider = document.getElementById('font-size-slider');
        const fontSizeValue = document.getElementById('font-size-value');
        const resetBtn = document.getElementById('reset-accessibility');

        // Toggle do painel (dropdown)
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('show');
        });

        // Fechar painel ao clicar fora
        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && !toggle.contains(e.target)) {
                panel.classList.remove('show');
            }
        });

        // Prevenir fechamento ao clicar dentro do painel
        panel.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Caixa alta
        uppercaseToggle.addEventListener('change', (e) => {
            this.#toggleUppercase(e.target.checked);
        });

        // Alto contraste
        contrastToggle.addEventListener('change', (e) => {
            this.#toggleHighContrast(e.target.checked);
        });

        // Tamanho da fonte
        fontSizeSlider.addEventListener('input', (e) => {
            const size = e.target.value;
            fontSizeValue.textContent = `${size}%`;
            this.#setFontSize(size);
        });

        // Reset
        resetBtn.addEventListener('click', () => {
            this.#resetSettings();
        });

        // Atalho de teclado (Alt + A)
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                panel.classList.toggle('show');
                toggle.focus();
            }
            
            // Fechar com Escape
            if (e.key === 'Escape' && panel.classList.contains('show')) {
                panel.classList.remove('show');
                toggle.focus();
            }
        });
    }

    #toggleUppercase(enabled) {
        this.#isUppercaseEnabled = enabled;
        
        if (enabled) {
            document.body.classList.add('uppercase-text');
        } else {
            document.body.classList.remove('uppercase-text');
        }

        this.#saveSettings();
    }

    #toggleHighContrast(enabled) {
        this.#isHighContrastEnabled = enabled;
        
        if (enabled) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }

        this.#saveSettings();
    }

    #setFontSize(percentage) {
        document.documentElement.style.fontSize = `${percentage}%`;
        this.#saveSettings();
    }

    #resetSettings() {
        // Reset checkboxes
        document.getElementById('uppercase-toggle').checked = false;
        document.getElementById('high-contrast-toggle').checked = false;
        document.getElementById('font-size-slider').value = 100;
        document.getElementById('font-size-value').textContent = '100%';

        // Reset classes
        document.body.classList.remove('uppercase-text', 'high-contrast');
        document.documentElement.style.fontSize = '100%';

        // Reset internal state
        this.#isUppercaseEnabled = false;
        this.#isHighContrastEnabled = false;

        // Clear saved settings
        localStorage.removeItem('accessibility-settings');
    }

    #saveSettings() {
        const settings = {
            uppercase: this.#isUppercaseEnabled,
            highContrast: this.#isHighContrastEnabled,
            fontSize: document.getElementById('font-size-slider').value
        };

        localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    }

    #loadSavedSettings() {
        const saved = localStorage.getItem('accessibility-settings');
        if (!saved) return;

        try {
            const settings = JSON.parse(saved);

            if (settings.uppercase) {
                document.getElementById('uppercase-toggle').checked = true;
                this.#toggleUppercase(true);
            }

            if (settings.highContrast) {
                document.getElementById('high-contrast-toggle').checked = true;
                this.#toggleHighContrast(true);
            }

            if (settings.fontSize && settings.fontSize !== '100') {
                document.getElementById('font-size-slider').value = settings.fontSize;
                document.getElementById('font-size-value').textContent = `${settings.fontSize}%`;
                this.#setFontSize(settings.fontSize);
            }
        } catch (error) {
            console.warn('Erro ao carregar configurações de acessibilidade:', error);
        }
    }

    // Métodos públicos para integração com outros módulos
    isUppercaseEnabled() {
        return this.#isUppercaseEnabled;
    }

    isHighContrastEnabled() {
        return this.#isHighContrastEnabled;
    }

    // Método para anunciar mudanças para leitores de tela
    announce(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        announcement.textContent = message;

        document.body.appendChild(announcement);

        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}
