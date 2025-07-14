import { FenGenerator } from "./FenGenerator.js";

/**
 * Generates a random FEN for the King Escape puzzle.
 * The puzzle consists of a white king on e1 and a black knight on a random square from ranks 2 to 8.
 * In the future, this can be expanded for more logic.
 */
export class KingEscapeFenGenerator extends FenGenerator {
    /**
     * Generates a random FEN for the King Escape puzzle with difficulty levels.
     * @param {"easy"|"medium"|"hard"|"extreme"} level - Difficulty level
     * @returns {string} FEN string
     */
    generateFen(level = "easy") {
        const occupied = new Set(["e1"]);
        const boardArray = Array(8).fill(null).map(() => Array(8).fill(null));
        boardArray[7][4] = 'K'; // White king on e1

        // Define black pieces for each level
        const pieceSets = {
            easy:   { p: 3, n: 1, b: 1 },
            medium: { p: 4, n: 1, b: 1, r: 1 },
            hard:   { p: 4, n: 2, b: 2, r: 1 },
            extreme:{ p: 6, n: 2, b: 2, r: 2 }
        };
        const pieces = pieceSets[level] || pieceSets["easy"];

        // Place each piece type
        for (const [piece, count] of Object.entries(pieces)) {
            for (let i = 0; i < count; i++) {
                let square, rank, file;
                do {
                    const files = 'abcdefgh';
                    const ranks = '234567'; // Avoid 1st and last row
                    square = files[Math.floor(Math.random() * files.length)] + ranks[Math.floor(Math.random() * ranks.length)];
                } while (occupied.has(square));
                occupied.add(square);
                rank = 8 - parseInt(square[1], 10);
                file = square.charCodeAt(0) - 'a'.charCodeAt(0);
                boardArray[rank][file] = piece;
            }
        }
        return this.arrayToFen(boardArray, 'w', '-', '-', 0, 1);
    }
}
