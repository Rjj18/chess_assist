/**
 * Módulo para controlar os movimentos das peças pretas (computador)
 * @module BlackPlayerController
 */

export class BlackPlayerController {
    #chess;
    #board;
    #moveDelay;

    /**
     * @param {Chess} chess - Instância do chess.js
     * @param {Chessboard} board - Instância do tabuleiro
     * @param {number} moveDelay - Delay em ms antes de fazer o movimento (padrão: 800ms)
     */
    constructor(chess, board, moveDelay = 800) {
        this.#chess = chess;
        this.#board = board;
        this.#moveDelay = moveDelay;
    }

    /**
     * Verifica se é a vez das pretas
     * @returns {boolean}
     */
    isBlackTurn() {
        return this.#chess.turn() === 'b';
    }

    /**
     * Obtém todos os movimentos legais possíveis para as pretas
     * @returns {string[]} Array com os movimentos em notação SAN
     */
    getPossibleMoves() {
        if (!this.isBlackTurn()) {
            return [];
        }
        return this.#chess.moves();
    }

    /**
     * Seleciona um movimento aleatório dentre os possíveis
     * @returns {string|null} Movimento selecionado ou null se não houver movimentos
     */
    selectRandomMove() {
        const possibleMoves = this.getPossibleMoves();
        
        if (possibleMoves.length === 0) {
            console.log("Não há movimentos possíveis para as pretas");
            return null;
        }

        const randomIndex = Math.floor(Math.random() * possibleMoves.length);
        return possibleMoves[randomIndex];
    }

    /**
     * Executa um movimento específico
     * @param {string} move - Movimento em notação SAN
     * @returns {object|null} Resultado do movimento ou null se inválido
     */
    executeMove(move) {
        if (!this.isBlackTurn()) {
            console.log("Não é a vez das pretas");
            return null;
        }

        const moveResult = this.#chess.move(move);
        
        if (moveResult) {
            console.log("Movimento das pretas executado:", moveResult);
            // Atualiza o tabuleiro visual com animação
            this.#board.setPosition(this.#chess.fen());
            return moveResult;
        } else {
            console.log("Erro ao executar movimento das pretas:", move);
            return null;
        }
    }

    /**
     * Faz um movimento automático aleatório das pretas
     * @returns {Promise<object|null>} Promise que resolve com o resultado do movimento
     */
    async makeAutomaticMove() {
        if (!this.isBlackTurn()) {
            console.log("Não é a vez das pretas, retornando");
            return null;
        }

        console.log("makeAutomaticMove chamada. Turno atual:", this.#chess.turn());
        
        const possibleMoves = this.getPossibleMoves();
        console.log("Movimentos possíveis para as pretas:", possibleMoves.length);

        if (possibleMoves.length === 0) {
            return null;
        }

        const selectedMove = this.selectRandomMove();
        console.log("Movimento escolhido:", selectedMove);

        // Aguarda o delay antes de executar o movimento
        await new Promise(resolve => setTimeout(resolve, this.#moveDelay));

        return this.executeMove(selectedMove);
    }

    /**
     * Verifica o estado do jogo após o movimento das pretas
     * @returns {object} Objeto com informações sobre o estado do jogo
     */
    checkGameState() {
        return {
            isGameOver: this.#chess.game_over(),
            isCheckmate: this.#chess.in_checkmate(),
            isDraw: this.#chess.in_draw(),
            isStalemate: this.#chess.in_stalemate(),
            isCheck: this.#chess.in_check(),
            turn: this.#chess.turn()
        };
    }

    /**
     * Altera o delay dos movimentos
     * @param {number} delay - Novo delay em ms
     */
    setMoveDelay(delay) {
        this.#moveDelay = delay;
    }

    /**
     * Obtém o delay atual
     * @returns {number} Delay em ms
     */
    getMoveDelay() {
        return this.#moveDelay;
    }

    /**
     * Define a instância do tabuleiro
     * @param {Chessboard} board - Instância do tabuleiro
     */
    setBoard(board) {
        this.#board = board;
    }

    /**
     * Obtém a instância do tabuleiro
     * @returns {Chessboard} Instância do tabuleiro
     */
    getBoard() {
        return this.#board;
    }
}
