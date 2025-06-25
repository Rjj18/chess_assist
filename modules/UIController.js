/**
 * Módulo para controlar a interface do usuário
 * @module UIController
 */

export class UIController {
    #gameController;
    #elements;

    /**
     * @param {GameController} gameController - Instância do controlador do jogo
     */
    constructor(gameController) {
        this.#gameController = gameController;
        this.#elements = {};
        this.#initializeElements();
        this.#setupEventListeners();
    }

    /**
     * Inicializa referências aos elementos DOM
     * @private
     */
    #initializeElements() {
        this.#elements = {
            // Controles do jogo
            resetButton: document.getElementById("resetButton"),
            undoButton: document.getElementById("undoButton"),
            forceBlackMoveButton: document.getElementById("forceBlackMoveButton"),
            
            // Informações do jogo
            gameInfoButton: document.getElementById("gameInfoButton"),
            gameInfoDisplay: document.getElementById("gameInfoDisplay"),
            gameInfoContent: document.getElementById("gameInfoContent"),
            
            // Elemento principal
            board: document.getElementById("board")
        };

        // Verifica se todos os elementos obrigatórios existem
        this.#validateElements();
    }

    /**
     * Valida se todos os elementos DOM necessários existem
     * @private
     */
    #validateElements() {
        const requiredElements = ['resetButton', 'board'];
        
        for (const elementName of requiredElements) {
            if (!this.#elements[elementName]) {
                throw new Error(`Elemento obrigatório não encontrado: ${elementName}`);
            }
        }
        
        // Avisa sobre elementos opcionais não encontrados
        const optionalElements = [
            'undoButton', 'forceBlackMoveButton',
            'gameInfoButton', 'gameInfoDisplay', 'gameInfoContent'
        ];
        
        for (const elementName of optionalElements) {
            if (!this.#elements[elementName]) {
                console.warn(`Elemento opcional não encontrado: ${elementName}`);
            }
        }
    }

    /**
     * Configura todos os event listeners da interface
     * @private
     */
    #setupEventListeners() {
        this.#setupGameControls();
        this.#setupInfoControls();
    }

    /**
     * Configura controles do jogo (reset, undo, etc.)
     * @private
     */
    #setupGameControls() {
        // Botão de reset
        if (this.#elements.resetButton) {
            this.#elements.resetButton.addEventListener("click", () => {
                this.#handleResetGame();
            });
        }

        // Botão de desfazer movimento
        if (this.#elements.undoButton) {
            this.#elements.undoButton.addEventListener("click", () => {
                this.#handleUndoMove();
            });
        }

        // Botão para forçar movimento das pretas
        if (this.#elements.forceBlackMoveButton) {
            this.#elements.forceBlackMoveButton.addEventListener("click", () => {
                this.#handleForceBlackMove();
            });
        }


    }

    /**
     * Configura controles de informações
     * @private
     */
    #setupInfoControls() {
        if (this.#elements.gameInfoButton) {
            this.#elements.gameInfoButton.addEventListener("click", () => {
                this.#handleToggleGameInfo();
            });
        }
    }

    /**
     * Manipula o evento de reset do jogo
     * @private
     */
    #handleResetGame() {
        try {
            this.#gameController.resetGame();
            this.#showMessage("Jogo resetado com sucesso!", "success");
        } catch (error) {
            console.error("Erro ao resetar o jogo:", error);
            this.#showMessage("Erro ao resetar o jogo", "error");
        }
    }

    /**
     * Manipula o evento de desfazer movimento
     * @private
     */
    #handleUndoMove() {
        try {
            const success = this.#gameController.undoMove();
            if (success) {
                this.#showMessage("Movimento desfeito com sucesso!", "success");
            } else {
                this.#showMessage("Não há movimentos para desfazer", "warning");
            }
        } catch (error) {
            console.error("Erro ao desfazer movimento:", error);
            this.#showMessage("Erro ao desfazer movimento", "error");
        }
    }

    /**
     * Manipula o evento de forçar movimento das pretas
     * @private
     */
    async #handleForceBlackMove() {
        try {
            this.#showMessage("Fazendo movimento das pretas...", "info");
            const moveResult = await this.#gameController.getBlackPlayerController().makeAutomaticMove();
            
            if (moveResult) {
                this.#showMessage("Movimento das pretas executado!", "success");
            } else {
                this.#showMessage("Não foi possível executar movimento das pretas", "warning");
            }
        } catch (error) {
            console.error("Erro ao forçar movimento das pretas:", error);
            this.#showMessage("Erro ao executar movimento das pretas", "error");
        }
    }



    /**
     * Manipula mudança de estilo de coordenadas
     * @param {string} style - Estilo a ser aplicado
     * @private
     */
    #handleSetCoordinateStyle(style) {
        if (!window.boardManager) {
            this.#showMessage("BoardManager não disponível", "error");
            return;
        }

        try {
            window.boardManager.setCoordinateStyle(style);
            const styleNames = {
                'none': 'Sem bordas',
                'thin': 'Bordas finas',
                'frame': 'Bordas com moldura'
            };
            this.#showMessage(`Estilo alterado para: ${styleNames[style]}`, "success");
        } catch (error) {
            console.error("Erro ao alterar estilo:", error);
            this.#showMessage("Erro ao alterar estilo", "error");
        }
    }

    /**
     * Manipula o evento de mostrar/esconder informações do jogo
     * @private
     */
    #handleToggleGameInfo() {
        if (!this.#elements.gameInfoDisplay || !this.#elements.gameInfoContent) {
            this.#showMessage("Elementos de informação não encontrados", "error");
            return;
        }

        try {
            const isVisible = !this.#elements.gameInfoDisplay.classList.contains('hidden');
            
            if (isVisible) {
                this.#elements.gameInfoDisplay.classList.add('hidden');
                this.#elements.gameInfoButton.textContent = 'Mostrar Info do Jogo';
            } else {
                const gameInfo = this.#gameController.getGameInfo();
                this.#elements.gameInfoContent.textContent = JSON.stringify(gameInfo, null, 2);
                this.#elements.gameInfoDisplay.classList.remove('hidden');
                this.#elements.gameInfoButton.textContent = 'Esconder Info do Jogo';
            }
        } catch (error) {
            console.error("Erro ao mostrar informações:", error);
            this.#showMessage("Erro ao mostrar informações", "error");
        }
    }



    /**
     * Exibe uma mensagem para o usuário
     * @param {string} message - Mensagem a ser exibida
     * @param {string} type - Tipo da mensagem ('success', 'error', 'info', 'warning')
     * @private
     */
    #showMessage(message, type = 'info') {
        // Por enquanto usa console, mas pode ser expandido para toast notifications
        const styles = {
            success: 'color: green; font-weight: bold;',
            error: 'color: red; font-weight: bold;',
            warning: 'color: orange; font-weight: bold;',
            info: 'color: blue; font-weight: bold;'
        };

        console.log(`%c${message}`, styles[type] || styles.info);
        
        // Futuro: implementar toast notifications ou modal
        // this.#showToast(message, type);
    }

    /**
     * Atualiza o estado visual da interface baseado no estado do jogo
     * @param {object} gameInfo - Informações atuais do jogo
     */
    updateGameState(gameInfo) {
        // Atualiza elementos da UI baseado no estado do jogo
        this.#updateTurnIndicator(gameInfo.turn);
        this.#updateGameStatus(gameInfo);
    }

    /**
     * Atualiza indicador de turno
     * @param {string} turn - Turno atual ('w' ou 'b')
     * @private
     */
    #updateTurnIndicator(turn) {
        const currentPlayer = turn === 'w' ? 'Brancas' : 'Pretas';
        console.log(`%cTurno atual: ${currentPlayer}`, 'color: purple; font-weight: bold;');
        
        // Futuro: atualizar elemento visual de turno
        // this.#elements.turnIndicator.textContent = `Turno: ${currentPlayer}`;
    }

    /**
     * Atualiza status do jogo (xeque, xeque-mate, etc.)
     * @param {object} gameInfo - Informações do jogo
     * @private
     */
    #updateGameStatus(gameInfo) {
        if (gameInfo.isCheckmate) {
            const winner = gameInfo.turn === 'w' ? 'Pretas' : 'Brancas';
            this.#showMessage(`Xeque-mate! ${winner} venceram!`, 'success');
        } else if (gameInfo.isDraw) {
            this.#showMessage('Empate!', 'info');
        } else if (gameInfo.isStalemate) {
            this.#showMessage('Afogamento! Empate!', 'info');
        } else if (gameInfo.isCheck) {
            const player = gameInfo.turn === 'w' ? 'Brancas' : 'Pretas';
            this.#showMessage(`${player} estão em xeque!`, 'warning');
        }
    }

    /**
     * Habilita ou desabilita controles da interface
     * @param {boolean} enabled - Se os controles devem estar habilitados
     */
    setControlsEnabled(enabled) {
        this.#elements.resetButton.disabled = !enabled;
        
        // Futuro: controlar outros botões
        // this.#elements.undoButton.disabled = !enabled;
        // this.#elements.hintButton.disabled = !enabled;
    }

    /**
     * Adiciona botões dinâmicos à interface
     * @param {string} id - ID do botão
     * @param {string} text - Texto do botão
     * @param {Function} clickHandler - Função a ser chamada no click
     * @param {string} containerSelector - Seletor do container onde adicionar o botão
     */
    addButton(id, text, clickHandler, containerSelector = 'body') {
        const button = document.createElement('button');
        button.id = id;
        button.textContent = text;
        button.addEventListener('click', clickHandler);
        
        const container = document.querySelector(containerSelector);
        if (container) {
            container.appendChild(button);
            this.#elements[id] = button;
        } else {
            console.warn(`Container não encontrado: ${containerSelector}`);
        }
    }

    /**
     * Remove um botão da interface
     * @param {string} id - ID do botão a ser removido
     */
    removeButton(id) {
        const button = this.#elements[id];
        if (button && button.parentNode) {
            button.parentNode.removeChild(button);
            delete this.#elements[id];
        }
    }

    /**
     * Obtém referência a um elemento da interface
     * @param {string} elementName - Nome do elemento
     * @returns {HTMLElement|null} Elemento DOM ou null se não encontrado
     */
    getElement(elementName) {
        return this.#elements[elementName] || null;
    }

    /**
     * Exporta funções para o objeto window (compatibilidade)
     */
    exposeGlobalFunctions() {
        // Funções que podem ser chamadas globalmente
        window.getGameInfo = () => this.#gameController.getGameInfo();
        window.undoMove = () => this.#gameController.undoMove();
        window.makeBlackMove = () => this.#gameController.getBlackPlayerController().makeAutomaticMove();
        window.resetGame = () => this.#gameController.resetGame();
    }

    /**
     * Inicializa o estado visual da interface
     */
    initializeUI() {
        this.#showMessage("Interface inicializada com sucesso!", "success");
    }
}
