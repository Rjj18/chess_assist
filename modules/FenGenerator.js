/**
 * @module FenGenerator
 * A utility class for generating FEN strings for various chess puzzles and scenarios.
 */

export class FenGenerator {

    /**
     * Converts a 2D array representation of a chessboard to a FEN string.
     * @param {Array<Array<string|null>>} boardArray - 8x8 array representing the board.
     * @param {string} activeColor - 'w' for white, 'b' for black.
     * @param {string} castling - Castling availability (e.g., 'KQkq', '-').
     * @param {string} enPassant - En passant target square (e.g., 'e3', '-').
     * @param {number} halfmoveClock - Halfmove clock.
     * @param {number} fullmoveNumber - Fullmove number.
     * @returns {string} The complete FEN string.
     * @private
     */
    arrayToFen(boardArray, activeColor = 'w', castling = '-', enPassant = '-', halfmoveClock = 0, fullmoveNumber = 1) {
        const fenRows = boardArray.map(row => {
            let empty = 0;
            let fenRow = '';
            for (const cell of row) {
                if (cell === null) {
                    empty++;
                } else {
                    if (empty > 0) {
                        fenRow += empty;
                        empty = 0;
                    }
                    fenRow += cell;
                }
            }
            if (empty > 0) {
                fenRow += empty;
            }
            return fenRow;
        });
        return `${fenRows.join('/')} ${activeColor} ${castling} ${enPassant} ${halfmoveClock} ${fullmoveNumber}`;
    }

// Classe base não implementa métodos específicos de puzzles
// Para KingEscapeFenGenerator, use import do arquivo KingEscapeFenGenerator.js
}


export class PawnRaceFenGenerator extends FenGenerator {
    /**
     * Gera um FEN para o jogo Pawn Race.
     * 8 peões brancos na 2ª fileira e 8 peões pretos na 7ª fileira.
     * @returns {string} FEN para o Pawn Race.
     */
    generateFen() {
        return '8/pppppppp/8/8/8/8/PPPPPPPP/8 w - - 0 1';
    }
}