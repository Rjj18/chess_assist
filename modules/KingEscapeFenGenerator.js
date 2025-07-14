import { FenGenerator } from "./FenGenerator.js";

/**
 * Generates a random FEN for the King Escape puzzle.
 * The puzzle consists of a white king on e1 and a black knight on a random square from ranks 2 to 8.
 * In the future, this can be expanded for more logic.
 */
export class KingEscapeFenGenerator extends FenGenerator {
    generateFen() {
        const occupied = new Set(["e1"]);
        const pieces = { n: 1 }; // Black pieces to place
        const boardArray = Array(8).fill(null).map(() => Array(8).fill(null));
        boardArray[7][4] = 'K'; // White king on e1
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
        return this.arrayToFen(boardArray, 'w', '-', '-', 0, 1);
    }
}
