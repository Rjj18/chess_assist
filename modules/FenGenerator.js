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
    #arrayToFen(boardArray, activeColor = 'w', castling = '-', enPassant = '-', halfmoveClock = 0, fullmoveNumber = 1) {
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

    /**
     * Generates a random FEN for the King Escape puzzle.
     * The puzzle consists of a white king on e1 and a single black knight
     * placed randomly on ranks 2 through 8.
     *
     * @returns {string} A FEN string for the new puzzle.
     */
    generateKingEscapeFen() {
        const occupied = new Set(["e1"]);
        const pieces = { n: 1 }; // Black pieces to place
        const boardArray = Array(8).fill(null).map(() => Array(8).fill(null));

        boardArray[7][4] = 'K'; // White King on e1

        // Place black pieces randomly on ranks 2-8
        for (const piece in pieces) {
            let square, rank, file;
            do {
                const files = 'abcdefgh';
                const ranks = '2345678';
                square = files[Math.floor(Math.random() * files.length)] + ranks[Math.floor(Math.random() * ranks.length)];
            } while (occupied.has(square));

            occupied.add(square);
            rank = 8 - parseInt(square[1], 10);
            file = square.charCodeAt(0) - 'a'.charCodeAt(0);
            boardArray[rank][file] = piece;
        }

        return this.#arrayToFen(boardArray, 'w', '-', '-', 0, 1);
    }

    /**
     * Generates a FEN for the Pawn Race game.
     * This game consists of 8 white pawns on the 2nd rank and 8 black pawns on the 7th rank.
     * @returns {string} A FEN string for the Pawn Race game.
     */
    generatePawnRaceFen() {
        return '8/pppppppp/8/8/8/8/PPPPPPPP/8 w - - 0 1';
    }
}