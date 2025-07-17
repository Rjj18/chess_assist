import { FenGenerator } from "./FenGenerator.js";

/**
 * Generates a random FEN for the Lone Knight puzzle and calculates optimal moves.
 * The puzzle consists of a white knight on corners (a1-a8, h1, h8) and 8 black pawns spread throughout the board.
 */
export class LoneKnightFenGenerator extends FenGenerator {
    /**
     * Generates a random FEN for the Lone Knight puzzle.
     * @returns {object} Object with FEN string and optimal move count
     */
    generateFen() {
        const boardArray = Array(8).fill(null).map(() => Array(8).fill(null));
        const occupied = new Set();

        // Define knight starting positions (corners: a1-a8, h1, h8)
        const knightPositions = [
            'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8',
            'h1', 'h8'
        ];

        // Select random knight position
        const knightSquare = knightPositions[Math.floor(Math.random() * knightPositions.length)];
        const knightFile = knightSquare.charCodeAt(0) - 'a'.charCodeAt(0);
        const knightRank = 8 - parseInt(knightSquare[1], 10);
        boardArray[knightRank][knightFile] = 'N'; // White knight
        occupied.add(knightSquare);

        // Store pawn positions for optimal calculation
        const pawnPositions = [];
        
        // Place exactly 8 black pawns randomly throughout the board
        for (let i = 0; i < 8; i++) {
            let square, rank, file;
            do {
                file = Math.floor(Math.random() * 8);
                rank = Math.floor(Math.random() * 8);
                square = String.fromCharCode('a'.charCodeAt(0) + file) + (8 - rank);
            } while (occupied.has(square));
            
            occupied.add(square);
            boardArray[rank][file] = 'p'; // Black pawn
            pawnPositions.push(square);
        }

        const fen = this.arrayToFen(boardArray, 'w', '-', '-', 0, 1);
        const optimalMoves = this.calculateOptimalMoves(knightSquare, pawnPositions);

        return {
            fen: fen,
            optimalMoves: optimalMoves,
            knightStart: knightSquare,
            pawnPositions: pawnPositions
        };
    }

    /**
     * Calculates the optimal number of moves to capture all pawns using a greedy nearest-neighbor approach.
     * @param {string} knightStart - Starting position of the knight
     * @param {Array<string>} pawnPositions - Array of pawn positions
     * @returns {number} Estimated optimal number of moves
     */
    calculateOptimalMoves(knightStart, pawnPositions) {
        const knightMoves = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];

        // Convert square notation to coordinates
        const squareToCoords = (square) => {
            const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
            const rank = parseInt(square[1]) - 1;
            return [file, rank];
        };

        // Calculate minimum knight moves between two squares using BFS
        const knightDistance = (from, to) => {
            const [fromFile, fromRank] = squareToCoords(from);
            const [toFile, toRank] = squareToCoords(to);
            
            if (fromFile === toFile && fromRank === toRank) return 0;
            
            const queue = [[fromFile, fromRank, 0]];
            const visited = new Set();
            visited.add(`${fromFile},${fromRank}`);
            
            while (queue.length > 0) {
                const [file, rank, moves] = queue.shift();
                
                for (const [df, dr] of knightMoves) {
                    const newFile = file + df;
                    const newRank = rank + dr;
                    const key = `${newFile},${newRank}`;
                    
                    if (newFile >= 0 && newFile < 8 && newRank >= 0 && newRank < 8 && !visited.has(key)) {
                        if (newFile === toFile && newRank === toRank) {
                            return moves + 1;
                        }
                        
                        visited.add(key);
                        queue.push([newFile, newRank, moves + 1]);
                    }
                }
            }
            return Infinity; // Should never happen on a valid board
        };

        // Use greedy nearest-neighbor approach
        let totalMoves = 0;
        let currentPosition = knightStart;
        const remainingPawns = [...pawnPositions];

        while (remainingPawns.length > 0) {
            let nearestPawn = null;
            let minDistance = Infinity;

            // Find the nearest pawn
            for (let i = 0; i < remainingPawns.length; i++) {
                const distance = knightDistance(currentPosition, remainingPawns[i]);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestPawn = i;
                }
            }

            // Move to the nearest pawn
            if (nearestPawn !== null) {
                totalMoves += minDistance;
                currentPosition = remainingPawns[nearestPawn];
                remainingPawns.splice(nearestPawn, 1);
            }
        }

        return totalMoves;
    }
}
