/**
 * PGN Manager - Handles PGN notation, move recording and position analysis
 * @module PGNManager
 */

export class PGNManager {
    #startingPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    #moves = [];
    #currentPosition = null;

    constructor(startingFen = null) {
        this.#currentPosition = startingFen || this.#startingPosition;
        this.#moves = [];
    }

    /**
     * Get the starting position
     * @returns {string} FEN string
     */
    getStartingPosition() {
        return this.#currentPosition;
    }

    /**
     * Add a move in algebraic notation
     * @param {string} move - Move in algebraic notation (e.g., "e4", "Nf3", "O-O")
     * @param {string} comment - Optional comment for the move
     */
    addMove(move, comment = '') {
        this.#moves.push({
            move: move.trim(),
            comment: comment.trim(),
            moveNumber: Math.ceil((this.#moves.length + 1) / 2),
            isWhite: (this.#moves.length % 2) === 0
        });
    }

    /**
     * Remove the last move
     */
    removeLastMove() {
        this.#moves.pop();
    }

    /**
     * Clear all moves
     */
    clearMoves() {
        this.#moves = [];
    }

    /**
     * Get all moves
     * @returns {Array} Array of move objects
     */
    getMoves() {
        return [...this.#moves];
    }

    /**
     * Generate PGN string
     * @param {object} headers - PGN headers (Event, Site, Date, etc.)
     * @returns {string} Complete PGN string
     */
    generatePGN(headers = {}) {
        const defaultHeaders = {
            Event: headers.Event || "Chess Position",
            Site: headers.Site || "Chess Assist",
            Date: headers.Date || new Date().toISOString().split('T')[0].replace(/-/g, '.'),
            Round: headers.Round || "1",
            White: headers.White || "White",
            Black: headers.Black || "Black",
            Result: headers.Result || "*"
        };

        // Add FEN header if not starting position
        if (this.#currentPosition !== this.#startingPosition) {
            defaultHeaders.FEN = this.#currentPosition;
            defaultHeaders.SetUp = "1";
        }

        let pgn = '';

        // Add headers
        Object.entries(defaultHeaders).forEach(([key, value]) => {
            pgn += `[${key} "${value}"]\n`;
        });

        pgn += '\n';

        // Add moves
        if (this.#moves.length > 0) {
            let moveText = '';
            let currentMoveNumber = 1;
            let isWhiteTurn = true;

            // If starting from a position where black moves first
            if (this.#currentPosition !== this.#startingPosition) {
                const parts = this.#currentPosition.split(' ');
                isWhiteTurn = parts[1] === 'w';
                currentMoveNumber = parseInt(parts[5]) || 1;
            }

            this.#moves.forEach((moveObj, index) => {
                if (isWhiteTurn) {
                    moveText += `${currentMoveNumber}. ${moveObj.move}`;
                } else {
                    if (index === 0) {
                        // First move is black
                        moveText += `${currentMoveNumber}...${moveObj.move}`;
                    } else {
                        moveText += ` ${moveObj.move}`;
                    }
                }

                if (moveObj.comment) {
                    moveText += ` {${moveObj.comment}}`;
                }

                if (!isWhiteTurn) {
                    currentMoveNumber++;
                }

                isWhiteTurn = !isWhiteTurn;
                moveText += ' ';
            });

            pgn += moveText.trim() + ' ' + defaultHeaders.Result;
        } else {
            pgn += defaultHeaders.Result;
        }

        return pgn;
    }

    /**
     * Parse PGN string to extract moves and headers
     * @param {string} pgnText - PGN string
     * @returns {object} Parsed PGN data
     */
    static parsePGN(pgnText) {
        const lines = pgnText.trim().split('\n');
        const headers = {};
        let moveText = '';
        let inHeaders = true;

        lines.forEach(line => {
            line = line.trim();
            if (!line) return;

            if (inHeaders && line.startsWith('[') && line.endsWith(']')) {
                const match = line.match(/\[(\w+)\s+"([^"]+)"\]/);
                if (match) {
                    headers[match[1]] = match[2];
                }
            } else {
                inHeaders = false;
                moveText += line + ' ';
            }
        });

        // Parse moves from move text
        const moves = [];
        moveText = moveText.replace(/\{[^}]*\}/g, ''); // Remove comments for now
        moveText = moveText.replace(/\d+\.\.\./g, ''); // Remove black move indicators
        moveText = moveText.replace(/\d+\./g, ''); // Remove move numbers
        moveText = moveText.replace(/[*1-2\/]/g, ''); // Remove results

        const moveTokens = moveText.trim().split(/\s+/).filter(token => token && !token.match(/^[\d\-*\/]+$/));

        moveTokens.forEach(move => {
            if (move && move.match(/^[KQRBN]?[a-h]?[1-8]?[x]?[a-h][1-8]|O-O(-O)?|[a-h][18]=[QRBN]/)) {
                moves.push(move);
            }
        });

        return {
            headers,
            moves,
            startingFEN: headers.FEN || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        };
    }

    /**
     * Create positions for each move in the game
     * @returns {Array} Array of position objects for PDF export
     */
    createPositionsForExport() {
        const positions = [];
        
        // Add starting position if there are moves
        if (this.#moves.length > 0) {
            positions.push({
                id: Date.now() + Math.random(),
                fen: this.#currentPosition,
                instruction: "Posição inicial",
                activeColor: this.#getActiveColorFromFEN(this.#currentPosition),
                originalInput: this.#currentPosition
            });
        }

        // Add positions after key moves (every 2 moves, or moves with comments)
        this.#moves.forEach((moveObj, index) => {
            // Add position every 2 moves or if move has comment
            if (index % 2 === 1 || moveObj.comment) {
                const moveDescription = this.#formatMoveDescription(moveObj, index);
                positions.push({
                    id: Date.now() + Math.random() + index,
                    fen: this.#currentPosition, // In a full implementation, this would be calculated
                    instruction: moveDescription,
                    activeColor: moveObj.isWhite ? 'black' : 'white', // After move, it's the other player's turn
                    originalInput: `Após ${moveDescription}`
                });
            }
        });

        return positions;
    }

    /**
     * Format move description for display
     * @param {object} moveObj - Move object
     * @param {number} index - Move index
     * @returns {string} Formatted move description
     * @private
     */
    #formatMoveDescription(moveObj, index) {
        const moveNumber = Math.ceil((index + 1) / 2);
        const colorPrefix = moveObj.isWhite ? `${moveNumber}.` : `${moveNumber}...`;
        let description = `${colorPrefix} ${moveObj.move}`;
        
        if (moveObj.comment) {
            description += ` (${moveObj.comment})`;
        }
        
        return description;
    }

    /**
     * Get active color from FEN
     * @param {string} fen - FEN string
     * @returns {string} 'white' or 'black'
     * @private
     */
    #getActiveColorFromFEN(fen) {
        const parts = fen.split(' ');
        return parts[1] === 'w' ? 'white' : 'black';
    }

    /**
     * Validate algebraic notation move
     * @param {string} move - Move string
     * @returns {boolean} Is valid move
     */
    static isValidMove(move) {
        // Basic algebraic notation validation
        const patterns = [
            /^[a-h][1-8]$/, // Pawn moves (e4)
            /^[a-h]x[a-h][1-8]$/, // Pawn captures (exd5)
            /^[KQRBN][a-h][1-8]$/, // Piece moves (Nf3)
            /^[KQRBN]x[a-h][1-8]$/, // Piece captures (Nxf3)
            /^[KQRBN][a-h][a-h][1-8]$/, // Disambiguated piece moves (Ngf3)
            /^[KQRBN][1-8][a-h][1-8]$/, // Disambiguated piece moves (N1f3)
            /^[KQRBN][a-h]x[a-h][1-8]$/, // Disambiguated captures (Ngxf3)
            /^[KQRBN][1-8]x[a-h][1-8]$/, // Disambiguated captures (N1xf3)
            /^O-O$/, // Kingside castling
            /^O-O-O$/, // Queenside castling
            /^[a-h][18]=[QRBN]$/, // Pawn promotion (e8=Q)
            /^[a-h]x[a-h][18]=[QRBN]$/ // Pawn capture promotion (exd8=Q)
        ];

        return patterns.some(pattern => pattern.test(move.replace(/[+#!?]/g, '')));
    }
}