/**
 * Módulo para controlar o fluxo geral do jogo de xadrez
 * @module GameController
 */

import { COLOR, INPUT_EVENT_TYPE, FEN } from "../cm-chessboard-master/src/Chessboard.js";
import { BlackPlayerController } from "./BlackPlayerController.js";

export class GameController {
    #chess;
    #board;
    #blackPlayerController;

    /**
     * @param {Chess} chess - Instância do chess.js
     * @param {Chessboard} board - Instância do tabuleiro visual
     */
    constructor(chess, board) {
        this.#chess = chess;
        this.#board = board;
        // Cria internamente o controlador das pretas
        this.#blackPlayerController = new BlackPlayerController(chess, board);
    }

    /**
     * Handler principal para eventos de input do tabuleiro
     * @param {object} event - Evento do tabuleiro
     * @returns {boolean} Se o evento deve ser processado
     */
    handleInput(event) {
        console.log("Input Event:", event);
        
        switch (event.type) {
            case INPUT_EVENT_TYPE.moveInputStarted:
                return this.#handleMoveStarted(event);
                
            case INPUT_EVENT_TYPE.validateMoveInput:
                return this.#handleMoveValidation(event);
                
            case INPUT_EVENT_TYPE.moveInputFinished:
                return this.#handleMoveFinished(event);
                
            default:
                return true;
        }
    }

    /**
     * Manipula o início de um movimento
     * @param {object} event - Evento do tabuleiro
     * @returns {boolean}
     * @private
     */
    #handleMoveStarted(event) {
        // Permite iniciar o movimento
        return true;
    }

    /**
     * Valida se um movimento é legal
     * @param {object} event - Evento do tabuleiro
     * @returns {boolean} Se o movimento é válido
     * @private
     */
    #handleMoveValidation(event) {
        const move = {
            from: event.squareFrom,
            to: event.squareTo,
            promotion: event.promotion || 'q' // Promoção padrão para rainha
        };
        
        // Tenta fazer o movimento no objeto chess
        const moveResult = this.#chess.move(move);
        
        if (moveResult) {
            console.log("Movimento legal:", moveResult);
            return true;
        } else {
            console.log("Movimento ilegal:", move);
            return false;
        }
    }

    /**
     * Processa a finalização de um movimento
     * @param {object} event - Evento do tabuleiro
     * @returns {boolean}
     * @private
     */
    #handleMoveFinished(event) {
        console.log("Movimento finalizado. Turno atual:", this.#chess.turn());
        
        // Atualiza a posição do tabuleiro visual
        this.#board.setPosition(this.#chess.fen());
        
        // Verifica se o jogo terminou
        if (this.#checkGameEnd()) {
            return true;
        }
        
        // Verifica se há xeque
        this.#checkForCheck();
        
        // Gerencia alternância de turnos
        this.#handleTurnChange();
        
        return true;
    }

    /**
     * Verifica se o jogo terminou
     * @returns {boolean} Se o jogo terminou
     * @private
     */
    #checkGameEnd() {
        if (this.#chess.game_over()) {
            if (this.#chess.in_checkmate()) {
                const winner = this.#chess.turn() === 'w' ? 'Pretas' : 'Brancas';
                alert(`Xeque-mate! ${winner} venceram!`);
            } else if (this.#chess.in_draw()) {
                alert('Empate!');
            } else if (this.#chess.in_stalemate()) {
                alert('Afogamento! Empate!');
            }
            return true;
        }
        return false;
    }

    /**
     * Verifica se há xeque e notifica
     * @private
     */
    #checkForCheck() {
        if (this.#chess.in_check()) {
            const player = this.#chess.turn() === 'w' ? 'Brancas' : 'Pretas';
            console.log(`${player} estão em xeque!`);
        }
    }

    /**
     * Gerencia a alternância de turnos
     * @private
     */
    #handleTurnChange() {
        if (this.#chess.turn() === 'b') {
            // Vez das pretas (computador)
            console.log("É a vez das pretas - fazendo movimento automático");
            this.#board.disableMoveInput();
            this.#makeBlackMove();
        } else {
            // Vez das brancas (jogador humano)
            console.log("É a vez das brancas - habilitando input");
            this.#board.enableMoveInput(this.handleInput.bind(this), COLOR.white);
        }
    }

    /**
     * Executa movimento das pretas usando o controlador
     * @private
     */
    async #makeBlackMove() {
        try {
            const moveResult = await this.#blackPlayerController.makeAutomaticMove();
            
            if (moveResult) {
                const gameState = this.#blackPlayerController.checkGameState();
                
                if (gameState.isGameOver) {
                    this.#handleGameEnd(gameState);
                    return;
                }
                
                if (gameState.isCheck) {
                    console.log("Brancas estão em xeque!");
                }
                
                // Habilita movimento para as brancas
                console.log("Habilitando movimento para as brancas");
                this.#board.enableMoveInput(this.handleInput.bind(this), COLOR.white);
            } else {
                console.log("Erro ao executar movimento das pretas");
                this.#board.enableMoveInput(this.handleInput.bind(this), COLOR.white);
            }
        } catch (error) {
            console.error("Erro no movimento das pretas:", error);
            this.#board.enableMoveInput(this.handleInput.bind(this), COLOR.white);
        }
    }

    /**
     * Manipula o fim do jogo
     * @param {object} gameState - Estado atual do jogo
     * @private
     */
    #handleGameEnd(gameState) {
        if (gameState.isCheckmate) {
            alert("Xeque-mate! As pretas venceram!");
        } else if (gameState.isDraw) {
            alert("Empate!");
        } else if (gameState.isStalemate) {
            alert("Afogamento! Empate!");
        }
    }

    /**
     * Inicia o jogo permitindo movimento das brancas
     */
    startGame() {
        this.#board.enableMoveInput(this.handleInput.bind(this), COLOR.white);
    }

    /**
     * Reseta o jogo para o estado inicial
     */
    resetGame() {
        this.#chess.reset();
        this.#board.setPosition(FEN.start);
        this.#board.enableMoveInput(this.handleInput.bind(this), COLOR.white);
        console.log("Jogo resetado");
    }

    /**
     * Desfaz o último movimento
     * @returns {boolean} Se o movimento foi desfeito com sucesso
     */
    undoMove() {
        const move = this.#chess.undo();
        if (move) {
            this.#board.setPosition(this.#chess.fen());
            const currentPlayer = this.#chess.turn() === 'w' ? COLOR.white : COLOR.black;
            this.#board.enableMoveInput(this.handleInput.bind(this), currentPlayer);
            console.log("Movimento desfeito:", move);
            return true;
        }
        return false;
    }

    /**
     * Obtém informações atuais do jogo
     * @returns {object} Informações do estado do jogo
     */
    getGameInfo() {
        return {
            turn: this.#chess.turn(),
            isCheck: this.#chess.in_check(),
            isCheckmate: this.#chess.in_checkmate(),
            isDraw: this.#chess.in_draw(),
            isStalemate: this.#chess.in_stalemate(),
            fen: this.#chess.fen(),
            pgn: this.#chess.pgn()
        };
    }

    /**
     * Obtém o controlador das peças pretas
     * @returns {BlackPlayerController} Instância do controlador das pretas
     */
    getBlackPlayerController() {
        return this.#blackPlayerController;
    }
}
