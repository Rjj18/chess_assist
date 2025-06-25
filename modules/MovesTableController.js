/**
 * Controlador da tabela de lances
 * Responsável por exibir e atualizar a tabela com os movimentos da partida
 */
export class MovesTableController {
    #tableBody;
    #moves;
    #currentMoveNumber;

    constructor() {
        this.#moves = [];
        this.#currentMoveNumber = 1;
        this.#initializeElements();
    }

    /**
     * Inicializa os elementos DOM necessários
     * @private
     */
    #initializeElements() {
        this.#tableBody = document.getElementById('movesTableBody');
        if (!this.#tableBody) {
            console.error('Elemento movesTableBody não encontrado');
        }
    }

    /**
     * Adiciona um novo lance à tabela
     * @param {string} move - O movimento em notação algébrica (ex: "e4", "Nf3", "O-O")
     * @param {string} color - Cor do jogador ("white" ou "black")
     */
    addMove(move, color) {
        if (!this.#tableBody) return;

        // Se é um movimento das brancas, cria uma nova linha
        if (color === 'white') {
            const row = document.createElement('tr');
            row.id = `move-${this.#currentMoveNumber}`;
            
            row.innerHTML = `
                <td>${this.#currentMoveNumber}</td>
                <td class="white-move">${move}</td>
                <td class="black-move">-</td>
            `;
            
            this.#tableBody.appendChild(row);
            this.#moves.push({ number: this.#currentMoveNumber, white: move, black: null });
        } 
        // Se é um movimento das pretas, atualiza a linha existente
        else if (color === 'black') {
            const currentRow = document.getElementById(`move-${this.#currentMoveNumber}`);
            if (currentRow) {
                const blackCell = currentRow.querySelector('.black-move');
                if (blackCell) {
                    blackCell.textContent = move;
                }
                
                // Atualiza o array de movimentos
                const moveIndex = this.#moves.findIndex(m => m.number === this.#currentMoveNumber);
                if (moveIndex !== -1) {
                    this.#moves[moveIndex].black = move;
                }
            }
            
            this.#currentMoveNumber++;
        }

        // Scroll automático para o último movimento
        this.#scrollToLastMove();
    }

    /**
     * Remove o último movimento da tabela
     * @returns {boolean} True se um movimento foi removido, false caso contrário
     */
    removeLastMove() {
        if (!this.#tableBody || this.#moves.length === 0) return false;

        const lastMove = this.#moves[this.#moves.length - 1];
        
        // Se o último movimento tem movimento das pretas, remove apenas ele
        if (lastMove.black) {
            const row = document.getElementById(`move-${lastMove.number}`);
            if (row) {
                const blackCell = row.querySelector('.black-move');
                if (blackCell) {
                    blackCell.textContent = '-';
                }
            }
            lastMove.black = null;
        }
        // Se só tem movimento das brancas, remove a linha inteira
        else if (lastMove.white) {
            const row = document.getElementById(`move-${lastMove.number}`);
            if (row) {
                row.remove();
            }
            this.#moves.pop();
            this.#currentMoveNumber--;
        }

        return true;
    }

    /**
     * Limpa toda a tabela de movimentos
     */
    clearMoves() {
        if (this.#tableBody) {
            this.#tableBody.innerHTML = '';
        }
        this.#moves = [];
        this.#currentMoveNumber = 1;
    }

    /**
     * Faz scroll automático para o último movimento
     * @private
     */
    #scrollToLastMove() {
        const container = this.#tableBody.closest('.moves-table-container');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    /**
     * Obtém todos os movimentos em formato de string
     * @returns {string} Movimentos em notação PGN
     */
    getMovesAsString() {
        return this.#moves.map(move => {
            if (move.black) {
                return `${move.number}. ${move.white} ${move.black}`;
            } else {
                return `${move.number}. ${move.white}`;
            }
        }).join(' ');
    }

    /**
     * Obtém o array de movimentos
     * @returns {Array} Array com os movimentos
     */
    getMoves() {
        return [...this.#moves];
    }

    /**
     * Destaca um movimento específico na tabela
     * @param {number} moveNumber - Número do movimento a destacar
     */
    highlightMove(moveNumber) {
        // Remove destaque anterior
        const previousHighlight = this.#tableBody.querySelector('.highlighted');
        if (previousHighlight) {
            previousHighlight.classList.remove('highlighted');
        }

        // Adiciona novo destaque
        const row = document.getElementById(`move-${moveNumber}`);
        if (row) {
            row.classList.add('highlighted');
        }
    }
}
