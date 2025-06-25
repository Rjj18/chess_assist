/**
 * Interface para controladores de jogadores
 * @module PlayerController
 */

/**
 * Classe base abstrata para controladores de jogadores
 * Pode ser extendida para criar diferentes tipos de jogadores (humano, IA, etc.)
 */
export class PlayerController {
    #chess;
    #board;
    #color;

    /**
     * @param {Chess} chess - Instância do chess.js
     * @param {Chessboard} board - Instância do tabuleiro
     * @param {string} color - Cor das peças ('w' para branco, 'b' para preto)
     */
    constructor(chess, board, color) {
        if (new.target === PlayerController) {
            throw new Error("PlayerController é uma classe abstrata");
        }
        this.#chess = chess;
        this.#board = board;
        this.#color = color;
    }

    /**
     * Verifica se é a vez deste jogador
     * @returns {boolean}
     */
    isPlayerTurn() {
        return this.#chess.turn() === this.#color;
    }

    /**
     * Obtém todos os movimentos legais possíveis
     * @returns {string[]} Array com os movimentos em notação SAN
     */
    getPossibleMoves() {
        if (!this.isPlayerTurn()) {
            return [];
        }
        return this.#chess.moves();
    }

    /**
     * Método abstrato - deve ser implementado pelas subclasses
     * @returns {Promise<object|null>} Promise que resolve com o resultado do movimento
     */
    async makeMove() {
        throw new Error("makeMove() deve ser implementado pela subclasse");
    }

    /**
     * Executa um movimento específico
     * @param {string} move - Movimento em notação SAN
     * @returns {object|null} Resultado do movimento ou null se inválido
     */
    executeMove(move) {
        if (!this.isPlayerTurn()) {
            console.log(`Não é a vez das ${this.#color === 'w' ? 'brancas' : 'pretas'}`);
            return null;
        }

        const moveResult = this.#chess.move(move);
        
        if (moveResult) {
            console.log(`Movimento das ${this.#color === 'w' ? 'brancas' : 'pretas'} executado:`, moveResult);
            this.#board?.setPosition(this.#chess.fen());
            return moveResult;
        } else {
            console.log(`Erro ao executar movimento das ${this.#color === 'w' ? 'brancas' : 'pretas'}:`, move);
            return null;
        }
    }

    /**
     * Verifica o estado do jogo
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

    // Getters protegidos
    get chess() { return this.#chess; }
    get board() { return this.#board; }
    get color() { return this.#color; }

    /**
     * Define a instância do tabuleiro
     * @param {Chessboard} board - Instância do tabuleiro
     */
    setBoard(board) {
        this.#board = board;
    }
}
