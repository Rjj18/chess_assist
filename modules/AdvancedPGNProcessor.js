/**
 * Advanced PGN Processor - Inspired by pgn2pdf.com functionality
 * Processes complete PGN files with multiple games, metadata, and automatic diagram generation
 * @module AdvancedPGNProcessor
 * @version 1.0.0
 */

export class AdvancedPGNProcessor {
    constructor() {
        this.games = [];
        this.currentGame = null;
    }

    /**
     * Parse complete PGN text with multiple games
     * @param {string} pgnText Raw PGN text
     * @returns {Array} Array of parsed games with metadata and positions
     */
    parseMultiGamePGN(pgnText) {
        try {
            // Split PGN into individual games
            const games = this.#splitIntoGames(pgnText);
            const parsedGames = [];

            for (const gameText of games) {
                const game = this.#parseIndividualGame(gameText);
                if (game) {
                    parsedGames.push(game);
                }
            }

            console.log(`Parsed ${parsedGames.length} games from PGN`);
            return parsedGames;

        } catch (error) {
            console.error('Error parsing PGN:', error);
            return [];
        }
    }

    /**
     * Extract key positions from a game automatically
     * @param {Object} game Parsed game object
     * @returns {Array} Array of key positions with context
     */
    extractKeyPositions(game) {
        const keyPositions = [];
        
        // Always include starting position
        if (game.startingFen) {
            keyPositions.push({
                fen: game.startingFen,
                moveNumber: 0,
                comment: game.metadata.Event || 'Starting Position',
                isStarting: true,
                gameInfo: this.#formatGameInfo(game.metadata)
            });
        }

        // Extract positions with comments (critical moments)
        game.moves.forEach((move, index) => {
            if (move.comment && move.comment.trim().length > 0) {
                keyPositions.push({
                    fen: move.fen,
                    moveNumber: move.moveNumber,
                    move: move.san,
                    comment: move.comment,
                    gameInfo: this.#formatGameInfo(game.metadata),
                    isCritical: true
                });
            }
        });

        // Include final position if game is decided
        if (game.result && game.result !== '*' && game.moves.length > 0) {
            const lastMove = game.moves[game.moves.length - 1];
            keyPositions.push({
                fen: lastMove.fen,
                moveNumber: lastMove.moveNumber,
                move: lastMove.san,
                comment: `Final position. Result: ${game.result}`,
                gameInfo: this.#formatGameInfo(game.metadata),
                isFinal: true
            });
        }

        return keyPositions;
    }

    /**
     * Generate positions for tactical problems
     * @param {Object} game Game with FEN starting position
     * @returns {Array} Positions formatted for PDF export
     */
    generateTacticalProblems(game) {
        const problems = [];

        if (game.metadata.FEN) {
            // This is a tactical position
            problems.push({
                fen: game.metadata.FEN,
                instruction: this.#generateTacticalInstruction(game),
                gameInfo: this.#formatGameInfo(game.metadata),
                isTactical: true,
                solution: game.moves.length > 0 ? this.#formatSolution(game.moves) : null
            });
        }

        return problems;
    }

    /**
     * Split PGN text into individual games
     * @param {string} pgnText Complete PGN text
     * @returns {Array} Array of individual game strings
     * @private
     */
    #splitIntoGames(pgnText) {
        // Remove extra whitespace and normalize line endings
        const normalized = pgnText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        
        // Split by empty lines between games (games typically separated by double newlines)
        const games = [];
        const lines = normalized.split('\n');
        let currentGame = [];
        let inGame = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Start of metadata (new game)
            if (line.startsWith('[') && line.endsWith(']')) {
                if (inGame && currentGame.length > 0) {
                    // Save previous game
                    games.push(currentGame.join('\n'));
                    currentGame = [];
                }
                inGame = true;
                currentGame.push(lines[i]);
            }
            // Continuation of current game
            else if (inGame) {
                currentGame.push(lines[i]);
            }
        }

        // Add last game
        if (currentGame.length > 0) {
            games.push(currentGame.join('\n'));
        }

        return games.filter(game => game.trim().length > 0);
    }

    /**
     * Parse individual game from PGN text
     * @param {string} gameText Single game PGN text
     * @returns {Object} Parsed game object
     * @private
     */
    #parseIndividualGame(gameText) {
        try {
            const game = {
                metadata: {},
                moves: [],
                comments: [],
                variations: [],
                result: '*',
                startingFen: null
            };

            const lines = gameText.split('\n');
            let moveText = '';
            
            // Parse metadata (headers)
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                    const match = trimmed.match(/\[(\w+)\s+"([^"]+)"\]/);
                    if (match) {
                        game.metadata[match[1]] = match[2];
                    }
                } else if (trimmed && !trimmed.startsWith('[')) {
                    moveText += trimmed + ' ';
                }
            }

            // Set starting FEN if provided
            if (game.metadata.FEN) {
                game.startingFen = game.metadata.FEN;
            } else {
                game.startingFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
            }

            // Parse moves and comments
            game.moves = this.#parseMoves(moveText, game.startingFen);
            game.result = game.metadata.Result || this.#extractResult(moveText);

            return game;

        } catch (error) {
            console.error('Error parsing individual game:', error);
            return null;
        }
    }

    /**
     * Parse moves with comments from move text
     * @param {string} moveText Raw move text
     * @param {string} startingFen Starting position FEN
     * @returns {Array} Array of move objects
     * @private
     */
    #parseMoves(moveText, startingFen) {
        const moves = [];
        // This is a simplified parser - in a real implementation,
        // you'd use a proper chess library like chess.js
        
        // Remove result indicators
        const cleanText = moveText.replace(/\s*(1-0|0-1|1\/2-1\/2|\*)\s*$/, '');
        
        // Basic move extraction (simplified)
        const movePattern = /(\d+\.(?:\.\.)?\s*)?([NBRQK]?[a-h]?[1-8]?x?[a-h][1-8](?:=[NBRQ])?[+#]?)(\s*\{([^}]+)\})?/g;
        let match;
        let moveNumber = 1;
        let currentFen = startingFen;

        while ((match = movePattern.exec(cleanText)) !== null) {
            const san = match[2];
            const comment = match[4] || '';
            
            if (san && san.length > 1) {
                // In a real implementation, you'd calculate the actual FEN
                // For now, we'll use a placeholder
                moves.push({
                    san: san,
                    moveNumber: Math.ceil(moves.length / 2) + 1,
                    fen: currentFen, // Placeholder - would calculate actual FEN
                    comment: comment.trim()
                });
            }
        }

        return moves;
    }

    /**
     * Extract game result from move text
     * @param {string} moveText Move text
     * @returns {string} Game result
     * @private
     */
    #extractResult(moveText) {
        const resultMatch = moveText.match(/(1-0|0-1|1\/2-1\/2|\*)$/);
        return resultMatch ? resultMatch[1] : '*';
    }

    /**
     * Format game information for display
     * @param {Object} metadata Game metadata
     * @returns {string} Formatted game info
     * @private
     */
    #formatGameInfo(metadata) {
        const parts = [];
        
        if (metadata.Event) parts.push(metadata.Event);
        if (metadata.White && metadata.Black) {
            parts.push(`${metadata.White} vs ${metadata.Black}`);
        }
        if (metadata.Date && metadata.Date !== '????.??.??') {
            parts.push(metadata.Date);
        }
        if (metadata.Round) parts.push(`Round ${metadata.Round}`);

        return parts.join(' • ');
    }

    /**
     * Generate tactical instruction from game metadata
     * @param {Object} game Game object
     * @returns {string} Tactical instruction
     * @private
     */
    #generateTacticalInstruction(game) {
        const metadata = game.metadata;
        let instruction = '';

        // Check for common tactical themes in event or title
        if (metadata.Event) {
            const event = metadata.Event.toLowerCase();
            if (event.includes('mate in')) {
                instruction = metadata.Event;
            } else if (event.includes('white to move') || event.includes('black to move')) {
                instruction = metadata.Event;
            } else {
                instruction = `${metadata.Event} - Find the best move`;
            }
        } else {
            // Default instruction based on turn
            const fen = metadata.FEN || '';
            const isWhiteToMove = fen.includes(' w ');
            instruction = `${isWhiteToMove ? 'White' : 'Black'} to move - Find the best continuation`;
        }

        return instruction;
    }

    /**
     * Format solution from moves
     * @param {Array} moves Array of move objects
     * @returns {string} Formatted solution
     * @private
     */
    #formatSolution(moves) {
        if (!moves || moves.length === 0) return '';
        
        const solution = moves.slice(0, 5) // First 5 moves
            .map(move => `${move.moveNumber}.${move.san}`)
            .join(' ');
            
        return solution + (moves.length > 5 ? '...' : '');
    }
}