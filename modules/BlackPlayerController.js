/**
 * Módulo para controlar os movimentos das peças pretas (computador)
 * @module BlackPlayerController
 */

import { PlayerController } from './PlayerController.js';

export class BlackPlayerController extends PlayerController {
    #moveDelay;

    /**
     * @param {Chess} chess - Instância do chess.js
     * @param {Chessboard} board - Instância do tabuleiro
     * @param {number} moveDelay - Delay em ms antes de fazer o movimento (padrão: 800ms)
     */
    constructor(chess, board, moveDelay = 800) {
        super(chess, board, 'b'); // 'b' para pretas
        this.#moveDelay = moveDelay;
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
     * Implementação do método abstrato da classe pai
     * Faz um movimento automático aleatório das pretas
     * @returns {Promise<object|null>} Promise que resolve com o resultado do movimento
     */
    async makeMove() {
        return this.makeAutomaticMove();
    }

    /**
     * Faz um movimento automático aleatório das pretas
     * @returns {Promise<object|null>} Promise que resolve com o resultado do movimento
     */
    async makeAutomaticMove() {
        if (!this.isPlayerTurn()) {
            console.log("Não é a vez das pretas, retornando");
            return null;
        }

        console.log("makeAutomaticMove chamada. Turno atual:", this.chess.turn());
        
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
}
