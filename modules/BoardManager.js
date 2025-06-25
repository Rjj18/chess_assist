/**
 * Módulo para gerenciar a configuração e estado do tabuleiro visual
 * @module BoardManager
 */

import { BORDER_TYPE, Chessboard } from "../cm-chessboard-master/src/Chessboard.js";

export class BoardManager {
    #board;
    #config;
    #defaultConfig;

    /**
     * @param {string|HTMLElement} container - Elemento container do tabuleiro
     * @param {object} config - Configurações customizadas do tabuleiro
     */
    constructor(container, config = {}) {
        this.#defaultConfig = {
            draggable: true,
            style: {
                borderType: BORDER_TYPE.thin,  // Mudança: ativando coordenadas
                showCoordinates: true,         // Mudança: exibindo coordenadas
                pieces: { file: "pieces/staunty.svg" },
                animationDuration: 300
            },
            assetsUrl: "./cm-chessboard-master/assets/"
        };

        this.#config = this.#mergeConfig(config);
        this.#board = this.#createBoard(container);
    }

    /**
     * Combina configuração padrão com configuração customizada
     * @param {object} customConfig - Configurações customizadas
     * @returns {object} Configuração final
     * @private
     */
    #mergeConfig(customConfig) {
        return {
            ...this.#defaultConfig,
            ...customConfig,
            style: {
                ...this.#defaultConfig.style,
                ...(customConfig.style || {})
            }
        };
    }

    /**
     * Cria a instância do tabuleiro
     * @param {string|HTMLElement} container - Container do tabuleiro
     * @returns {Chessboard} Instância do tabuleiro
     * @private
     */
    #createBoard(container) {
        const element = typeof container === 'string' 
            ? document.getElementById(container)
            : container;

        if (!element) {
            throw new Error(`Container do tabuleiro não encontrado: ${container}`);
        }

        return new Chessboard(element, this.#config);
    }

    /**
     * Obtém a instância do tabuleiro
     * @returns {Chessboard} Instância do tabuleiro
     */
    getBoard() {
        return this.#board;
    }

    /**
     * Define a posição inicial do tabuleiro
     * @param {string} fen - Posição em notação FEN
     */
    setInitialPosition(fen) {
        this.#board.setPosition(fen);
    }

    /**
     * Atualiza a posição do tabuleiro
     * @param {string} fen - Nova posição em notação FEN
     * @param {boolean} animate - Se deve animar a mudança
     */
    updatePosition(fen, animate = true) {
        if (animate) {
            this.#board.setPosition(fen);
        } else {
            // Desabilita animação temporariamente
            const originalDuration = this.#config.style.animationDuration;
            this.#board.setAnimationDuration(0);
            this.#board.setPosition(fen);
            this.#board.setAnimationDuration(originalDuration);
        }
    }

    /**
     * Habilita entrada de movimento para um jogador
     * @param {Function} inputHandler - Handler para eventos de input
     * @param {string} color - Cor do jogador ('white' ou 'black')
     */
    enableMoveInput(inputHandler, color) {
        this.#board.enableMoveInput(inputHandler, color);
    }

    /**
     * Desabilita entrada de movimento
     */
    disableMoveInput() {
        this.#board.disableMoveInput();
    }

    /**
     * Define duração da animação
     * @param {number} duration - Duração em milissegundos
     */
    setAnimationDuration(duration) {
        this.#config.style.animationDuration = duration;
        this.#board.setAnimationDuration(duration);
    }

    /**
     * Obtém duração atual da animação
     * @returns {number} Duração em milissegundos
     */
    getAnimationDuration() {
        return this.#config.style.animationDuration;
    }

    /**
     * Altera o tema das peças
     * @param {string} piecesFile - Arquivo SVG das peças
     */
    setPiecesTheme(piecesFile) {
        this.#config.style.pieces.file = piecesFile;
        // Note: Mudança de tema requer recriação do tabuleiro na biblioteca atual
        console.log(`Tema das peças alterado para: ${piecesFile}`);
        console.log("Note: Reinicie o jogo para aplicar o novo tema");
    }

    /**
     * Obtém configuração atual do tabuleiro
     * @returns {object} Configuração atual
     */
    getConfig() {
        return { ...this.#config };
    }

    /**
     * Redimensiona o tabuleiro
     * @param {number} size - Novo tamanho em pixels
     */
    resize(size) {
        const element = this.#board.getElement();
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        
        // Força recálculo do tabuleiro
        this.#board.redraw();
    }

    /**
     * Destaca casas específicas
     * @param {string[]} squares - Array de casas a destacar (ex: ['e4', 'e5'])
     * @param {string} highlightClass - Classe CSS para destaque
     */
    highlightSquares(squares, highlightClass = 'highlight') {
        // Implementação futura - requer extensão da biblioteca do tabuleiro
        console.log(`Destacando casas: ${squares.join(', ')} com classe: ${highlightClass}`);
    }

    /**
     * Remove todos os destaques
     */
    clearHighlights() {
        // Implementação futura - requer extensão da biblioteca do tabuleiro
        console.log("Removendo todos os destaques");
    }

    /**
     * Configura orientação do tabuleiro
     * @param {string} orientation - 'white' ou 'black'
     */
    setOrientation(orientation) {
        // Implementação futura - verificar se a biblioteca suporta
        console.log(`Orientação alterada para: ${orientation}`);
    }

    /**
     * Obtém elemento DOM do tabuleiro
     * @returns {HTMLElement} Elemento DOM
     */
    getElement() {
        return this.#board.getElement();
    }

    /**
     * Destrói o tabuleiro e limpa recursos
     */
    destroy() {
        if (this.#board && this.#board.destroy) {
            this.#board.destroy();
        }
        this.#board = null;
    }

    /**
     * Habilita ou desabilita a exibição de coordenadas
     * @param {boolean} show - Se deve mostrar coordenadas
     */
    setShowCoordinates(show) {
        this.#config.style.showCoordinates = show;
        this.#board.props.style.showCoordinates = show;
        this.#board.view.drawCoordinates();
    }

    /**
     * Verifica se as coordenadas estão sendo exibidas
     * @returns {boolean} Se as coordenadas estão visíveis
     */
    getShowCoordinates() {
        return this.#config.style.showCoordinates;
    }

    /**
     * Define o tipo de borda (afeta como as coordenadas são exibidas)
     * @param {string} borderType - Tipo da borda ('none', 'thin', 'frame')
     */
    setBorderType(borderType) {
        const validTypes = ['none', 'thin', 'frame'];
        if (!validTypes.includes(borderType)) {
            throw new Error(`Tipo de borda inválido: ${borderType}. Use: ${validTypes.join(', ')}`);
        }
        
        this.#config.style.borderType = borderType;
        this.#board.props.style.borderType = borderType;
        
        // Redesenha o tabuleiro para aplicar a mudança
        this.#board.view.redraw();
    }

    /**
     * Obtém o tipo de borda atual
     * @returns {string} Tipo de borda atual
     */
    getBorderType() {
        return this.#config.style.borderType;
    }

    /**
     * Alterna entre diferentes estilos de coordenadas
     * @param {string} style - 'none' | 'thin' | 'frame'
     */
    setCoordinateStyle(style) {
        switch (style) {
            case 'none':
                this.setShowCoordinates(false);
                this.setBorderType('none');
                break;
            case 'thin':
                this.setShowCoordinates(true);
                this.setBorderType('thin');
                break;
            case 'frame':
                this.setShowCoordinates(true);
                this.setBorderType('frame');
                break;
            default:
                throw new Error(`Estilo de coordenada inválido: ${style}. Use: none, thin, frame`);
        }
    }
}
