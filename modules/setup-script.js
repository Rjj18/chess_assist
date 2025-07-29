console.log('[DEBUG] setup-script.js loaded');

import { Chessboard, FEN, INPUT_EVENT_TYPE } from '../cm-chessboard-master/src/Chessboard.js';
import { Arrows, ARROW_TYPE } from '../cm-chessboard-master/src/extensions/arrows/Arrows.js';
import { Markers, MARKER_TYPE } from '../cm-chessboard-master/src/extensions/markers/Markers.js';
import { Chess } from "https://cdn.jsdelivr.net/npm/chess.mjs@1/src/chess.mjs/Chess.js";

const boardContainer = document.getElementById('chessboard');
if (!boardContainer) {
    console.error('[DEBUG] #chessboard container not found!');
}
const board = new Chessboard(boardContainer, {
    position: FEN.empty,
    extensions: [
        { class: Arrows },
        { class: Markers }
    ],
    assetsUrl: 'cm-chessboard-master/assets/',
    style: { aspectRatio: 1 },
    sprite: { url: 'pieces/standard.svg' },
    enableMoveInput: false
});

console.log('[DEBUG] Chessboard initialized:', board);
console.log('[DEBUG] Board extensions:', board.extensions);
console.log('[DEBUG] Available board methods:', Object.getOwnPropertyNames(board));

// Check if extensions are properly loaded
setTimeout(() => {
    console.log('[DEBUG] Checking extensions after timeout...');
    const arrowsExt = board.getExtension(Arrows);
    const markersExt = board.getExtension(Markers);
    console.log('[DEBUG] Arrows extension:', arrowsExt);
    console.log('[DEBUG] Markers extension:', markersExt);
    console.log('[DEBUG] Board.addArrow function:', typeof board.addArrow);
    console.log('[DEBUG] Board.addMarker function:', typeof board.addMarker);
    console.log('[DEBUG] ARROW_TYPE:', ARROW_TYPE);
    console.log('[DEBUG] MARKER_TYPE:', MARKER_TYPE);
}, 100);

let selectedPiece = null;
let arrowStart = null; // Move this outside the function
let gameChess = null; // Chess instance for move validation

const pieceBtns = document.querySelectorAll('.piece-btn');
if (!pieceBtns.length) {
    console.error('[DEBUG] No .piece-btn elements found!');
}
pieceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        try {
            if (btn.dataset.piece === 'clear-board') {
                // Clear all pieces from the board using setPosition with empty FEN
                board.setPosition(FEN.empty);
                
                // Clear all markers and arrows
                if (typeof board.removeMarkers === 'function') {
                    board.removeMarkers();
                }
                if (typeof board.removeArrows === 'function') {
                    board.removeArrows();
                }
                // Reset selection state
                document.querySelectorAll('.piece-btn').forEach(b => b.classList.remove('selected'));
                selectedPiece = null;
                arrowStart = null;
                console.debug('[DEBUG] Board cleared completely - pieces, arrows, and markers');
                
                // Re-attach event listeners after clearing
                setTimeout(() => {
                    console.log('[DEBUG] Re-attaching event listeners after clear');
                    attachSvgSquareListeners();
                }, 100);
                return;
            }
            
            selectedPiece = btn.dataset.piece === 'none' ? null : btn.dataset.piece;
            document.querySelectorAll('.piece-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            console.debug('[DEBUG] Piece button clicked:', btn.dataset.piece, 'Selected:', selectedPiece);
        } catch (error) {
            console.error('[DEBUG] Error in piece button click handler:', error);
        }
    });
});

// Don't auto-select any button initially - let user choose
console.debug('[DEBUG] Piece buttons initialized - no initial selection');

function attachSvgSquareListeners() {
    console.log('[DEBUG] attachSvgSquareListeners() called');
    
    const squares = document.querySelectorAll('rect.square[data-square]');
    console.log('[DEBUG] Found', squares.length, 'SVG squares');
    
    // Use a single event listener on the board container to avoid conflicts
    const boardSvg = document.querySelector('#chessboard svg');
    if (!boardSvg) {
        console.error('[DEBUG] Could not find board SVG element');
        return;
    }
    
    // Remove any existing custom listeners
    if (boardSvg._customClickHandler) {
        boardSvg.removeEventListener('click', boardSvg._customClickHandler);
    }
    
    // Create a single click handler for the entire board
    const clickHandler = (e) => {
        try {
            // Find the clicked square element
            let squareEl = e.target;
            while (squareEl && !squareEl.getAttribute('data-square')) {
                squareEl = squareEl.parentElement;
            }
            
            if (!squareEl || !squareEl.getAttribute('data-square')) {
                return; // Not a square click
            }
            
            const square = squareEl.getAttribute('data-square');
            console.debug('[DEBUG] Click event:', { square, alt: e.altKey, shift: e.shiftKey, selectedPiece });
            
            // Shift+Alt+Left click: start/end arrow
            if (e.shiftKey && e.altKey) {
                if (typeof square !== 'string' || !square.match(/^[a-h][1-8]$/)) {
                    console.warn('[DEBUG] Invalid square for arrow:', square);
                    return;
                }
                if (!arrowStart) {
                    arrowStart = square;
                    console.debug('[DEBUG] Arrow start set:', square);
                } else {
                    if (
                        arrowStart !== square &&
                        typeof arrowStart === 'string' && arrowStart.match(/^[a-h][1-8]$/) &&
                        typeof square === 'string' && square.match(/^[a-h][1-8]$/)
                    ) {
                        console.log('[DEBUG] Attempting to draw arrow from', arrowStart, 'to', square);
                        if (typeof board.addArrow === 'function') {
                            board.addArrow(ARROW_TYPE.default, arrowStart, square);
                            console.debug('[DEBUG] Arrow drawn from', arrowStart, 'to', square);
                            
                            // Check if arrow was actually added to DOM
                            setTimeout(() => {
                                const arrows = document.querySelectorAll('.arrows');
                                console.log('[DEBUG] Arrow groups in DOM:', arrows.length);
                                arrows.forEach((group, i) => {
                                    console.log(`[DEBUG] Arrow group ${i}:`, group, 'children:', group.children.length);
                                });
                            }, 100);
                        } else {
                            console.error('[DEBUG] board.addArrow is not a function!');
                        }
                    } else {
                        console.warn('[DEBUG] Invalid arrow endpoints:', arrowStart, square);
                    }
                    arrowStart = null;
                }
                return;
            }
            
            // Alt+Left click: highlight square (frame, green)
            if (e.altKey) {
                console.log('[DEBUG] Alt+Click - attempting to add frame marker to', square);
                if (typeof board.addMarker === 'function') {
                    board.addMarker(MARKER_TYPE.frame, square);
                    console.debug('[DEBUG] Highlighted square (frame, green):', square);
                    
                    // Check if marker was actually added to DOM
                    setTimeout(() => {
                        const markers = document.querySelectorAll('.markers');
                        console.log('[DEBUG] Marker groups in DOM:', markers.length);
                        markers.forEach((group, i) => {
                            console.log(`[DEBUG] Marker group ${i}:`, group, 'children:', group.children.length);
                        });
                    }, 100);
                } else {
                    console.error('[DEBUG] board.addMarker is not a function!');
                }
                return;
            }
            
            // Shift+Left click: highlight square (dot, red)
            if (e.shiftKey) {
                console.log('[DEBUG] Shift+Click - attempting to add dot marker to', square);
                if (typeof board.addMarker === 'function') {
                    board.addMarker(MARKER_TYPE.dot, square);
                    console.debug('[DEBUG] Highlighted square (dot, red):', square);
                } else {
                    console.error('[DEBUG] board.addMarker is not a function!');
                }
                return;
            }
            
            // Normal left click: place/remove piece
            console.debug('[DEBUG] SVG Square clicked:', square, 'Selected piece:', selectedPiece);
            
            // Reset arrow start when placing/removing pieces
            arrowStart = null;
            
            if (selectedPiece === null || selectedPiece === undefined) {
                // No piece selected - remove piece from square
                board.setPiece(square, null);
                console.debug('[DEBUG] Removed piece from', square, '(no piece selected)');
            } else {
                // Place the selected piece
                board.setPiece(square, selectedPiece);
                console.debug('[DEBUG] Placed piece', selectedPiece, 'on', square);
            }
        } catch (error) {
            console.error('[DEBUG] Error in square click handler:', error);
            // Reset states to prevent getting stuck
            arrowStart = null;
        }
    };
    
    // Store the handler so we can remove it later
    boardSvg._customClickHandler = clickHandler;
    
    // Add the event listener
    boardSvg.addEventListener('click', clickHandler, true); // Use capture phase
    
    console.log('[DEBUG] Finished attaching board-wide click listener');
}
// Try to attach listeners multiple times with different delays to ensure it works
setTimeout(() => {
    console.log('[DEBUG] Calling attachSvgSquareListeners after 300ms delay');
    attachSvgSquareListeners();
}, 300);

setTimeout(() => {
    console.log('[DEBUG] Calling attachSvgSquareListeners after 600ms delay (fallback)');
    attachSvgSquareListeners();
}, 600);

// Also try when the page is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('[DEBUG] Calling attachSvgSquareListeners after DOMContentLoaded');
        attachSvgSquareListeners();
    }, 100);
});

document.getElementById('clear-arrows').addEventListener('click', () => {
    try {
        console.log('[DEBUG] Clear arrows button clicked');
        console.log('[DEBUG] board.removeArrows function:', typeof board.removeArrows);
        
        if (typeof board.removeArrows === 'function') {
            board.removeArrows();
            console.log('[DEBUG] All arrows cleared using board.removeArrows()');
        } else {
            const arrowsExt = board.getExtension(Arrows);
            console.log('[DEBUG] Arrows extension:', arrowsExt);
            if (arrowsExt && typeof arrowsExt.clear === 'function') {
                arrowsExt.clear();
                console.log('[DEBUG] All arrows cleared using extension.clear()');
            } else {
                console.warn('[DEBUG] No method found to clear arrows');
            }
        }
        
        // Reset arrow start state
        arrowStart = null;
    } catch (error) {
        console.error('[DEBUG] Error clearing arrows:', error);
    }
});

document.getElementById('clear-markers').addEventListener('click', () => {
    try {
        console.log('[DEBUG] Clear markers button clicked');
        console.log('[DEBUG] board.removeMarkers function:', typeof board.removeMarkers);
        
        if (typeof board.removeMarkers === 'function') {
            board.removeMarkers();
            console.log('[DEBUG] All markers cleared using board.removeMarkers()');
        } else {
            const markersExt = board.getExtension(Markers);
            console.log('[DEBUG] Markers extension:', markersExt);
            if (markersExt && typeof markersExt.clear === 'function') {
                markersExt.clear();
                console.log('[DEBUG] All markers cleared using extension.clear()');
            } else {
                console.warn('[DEBUG] No method found to clear markers');
            }
        }
    } catch (error) {
        console.error('[DEBUG] Error clearing markers:', error);
    }
});

// Start Game button functionality
document.getElementById('start-game').addEventListener('click', () => {
    try {
        console.log('[DEBUG] Start game button clicked');
        
        // First disable any existing move input
        try {
            board.disableMoveInput();
        } catch (e) {
            console.log('[DEBUG] Move input was not enabled, continuing...');
        }
        
        // Get current board position as FEN
        const currentFEN = board.getPosition();
        console.log('[DEBUG] Current board FEN:', currentFEN);
        console.log('[DEBUG] FEN length:', currentFEN.length);
        console.log('[DEBUG] FEN parts:', currentFEN.split(' '));
        
        // Check if there are pieces on the board
        if (!currentFEN || currentFEN === FEN.empty) {
            alert('Please set up some pieces on the board before starting a game!');
            return;
        }
        
        // Alternative approach: Create Chess.js instance and manually set pieces
        try {
            gameChess = new Chess(); // Start with empty board
            gameChess.clear(); // Clear the board
            
            // Get pieces from the visual board and add them to Chess.js
            const allSquares = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8',
                              'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8',
                              'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8',
                              'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8',
                              'e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8',
                              'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8',
                              'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8',
                              'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8'];
            
            const visualPieces = {};
            allSquares.forEach(square => {
                const piece = board.getPiece(square);
                if (piece) {
                    visualPieces[square] = piece;
                    
                    // Convert cm-chessboard piece notation to Chess.js notation
                    // cm-chessboard: 'wr', 'wp', 'bk', etc.
                    // Chess.js: { type: 'r', color: 'w' }, { type: 'p', color: 'w' }, { type: 'k', color: 'b' }, etc.
                    const color = piece.charAt(0); // 'w' or 'b'
                    const type = piece.charAt(1);  // 'r', 'p', 'k', etc.
                    
                    try {
                        gameChess.put({ type: type, color: color }, square);
                    } catch (e) {
                        console.error('[DEBUG] Error putting piece', piece, 'on', square, ':', e);
                    }
                }
            });
            
            console.log('[DEBUG] Visual pieces:', visualPieces);
            console.log('[DEBUG] Chess instance created with manual piece placement');
            console.log('[DEBUG] Chess board state:', gameChess.ascii());
            
            // Now get the FEN from the manually created position
            const chessFEN = gameChess.fen();
            console.log('[DEBUG] Chess.js FEN:', chessFEN);
            
        } catch (error) {
            console.error('[DEBUG] Error creating Chess instance:', error);
            alert('Invalid chess position. Please check your setup.');
            return;
        }
        
        // Enable move input with proper chess rule validation
        board.enableMoveInput((event) => {
            console.log('[DEBUG] Move input event:', event);
            
            if (event.type === INPUT_EVENT_TYPE.moveInputStarted) {
                console.log('[DEBUG] Move started from:', event.square);
                
                // Check if there's a piece on the square and if it's the right color to move
                const piece = gameChess.get(event.square);
                console.log('[DEBUG] Piece at', event.square, ':', piece);
                console.log('[DEBUG] Chess board state:');
                console.log(gameChess.ascii());
                
                if (!piece) {
                    console.log('[DEBUG] No piece on', event.square, 'in Chess.js instance');
                    return false;
                }
                
                const currentTurn = gameChess.turn();
                console.log('[DEBUG] Current turn:', currentTurn, 'Piece color:', piece.color);
                if (piece.color !== currentTurn) {
                    console.log('[DEBUG] Wrong color piece selected. Current turn:', currentTurn, 'Piece color:', piece.color);
                    return false;
                }
                
                return true;
                
            } else if (event.type === INPUT_EVENT_TYPE.validateMoveInput) {
                console.log('[DEBUG] Validating move from', event.squareFrom, 'to', event.squareTo);
                
                // Use chess.js to validate if the move is legal
                const moves = gameChess.moves({ 
                    square: event.squareFrom, 
                    verbose: true 
                });
                
                const isValidMove = moves.some(move => move.to === event.squareTo);
                console.log('[DEBUG] Move validation result:', isValidMove);
                
                return isValidMove;
                
            } else if (event.type === INPUT_EVENT_TYPE.moveInputFinished) {
                console.log('[DEBUG] Move completed:', event.squareFrom, '->', event.squareTo);
                
                // Make the move in the chess instance
                const move = gameChess.move({
                    from: event.squareFrom,
                    to: event.squareTo,
                    promotion: 'q' // Auto-promote to queen for simplicity
                });
                
                if (move) {
                    console.log('[DEBUG] Move executed:', move);
                    
                    // Update turn indicator
                    const turnIndicator = document.getElementById('turn-indicator');
                    if (turnIndicator) {
                        turnIndicator.textContent = gameChess.turn() === 'w' ? 'White to move' : 'Black to move';
                    }
                    
                    // Debug available methods
                    console.log('[DEBUG] Available Chess.js methods:', Object.getOwnPropertyNames(gameChess));
                    console.log('[DEBUG] Chess.js prototype methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(gameChess)));
                    
                    // Check for game end conditions using different method names
                    try {
                        if (gameChess.isCheckmate && gameChess.isCheckmate()) {
                            setTimeout(() => {
                                alert(`Checkmate! ${gameChess.turn() === 'w' ? 'Black' : 'White'} wins!`);
                            }, 100);
                        } else if (gameChess.isStalemate && gameChess.isStalemate()) {
                            setTimeout(() => {
                                alert('Stalemate! The game is a draw.');
                            }, 100);
                        } else if (gameChess.inCheck && gameChess.inCheck()) {
                            console.log('[DEBUG] Check detected');
                            if (turnIndicator) {
                                turnIndicator.textContent = `${gameChess.turn() === 'w' ? 'White' : 'Black'} to move (Check!)`;
                            }
                        } else if (gameChess.isCheck && gameChess.isCheck()) {
                            console.log('[DEBUG] Check detected (using isCheck)');
                            if (turnIndicator) {
                                turnIndicator.textContent = `${gameChess.turn() === 'w' ? 'White' : 'Black'} to move (Check!)`;
                            }
                        }
                    } catch (error) {
                        console.error('[DEBUG] Error checking game state:', error);
                    }
                    
                    return true;
                } else {
                    console.error('[DEBUG] Failed to make move in chess instance');
                    return false;
                }
            }
            
            return true;
        });
        
        // Change the button text to indicate game mode
        const startBtn = document.getElementById('start-game');
        const gameStatus = document.getElementById('game-status');
        const turnIndicator = document.getElementById('turn-indicator');
        
        startBtn.textContent = 'Setup Mode';
        gameStatus.style.display = 'block';
        turnIndicator.textContent = gameChess.turn() === 'w' ? 'White to move' : 'Black to move';
        
        startBtn.onclick = () => {
            // Switch back to setup mode
            try {
                board.disableMoveInput();
            } catch (e) {
                console.log('[DEBUG] Move input was already disabled');
            }
            gameChess = null;
            startBtn.textContent = 'Start Game';
            gameStatus.style.display = 'none';
            startBtn.onclick = null;
            // Re-attach our custom event handlers
            setTimeout(() => {
                attachSvgSquareListeners();
            }, 100);
            console.log('[DEBUG] Switched back to setup mode');
        };
        
        // Remove our custom event listeners to avoid conflicts with move input
        const boardSvg = document.querySelector('#chessboard svg');
        if (boardSvg && boardSvg._customClickHandler) {
            boardSvg.removeEventListener('click', boardSvg._customClickHandler, true);
        }
        
        console.log('[DEBUG] Game mode enabled - you can now move pieces with chess rules');
        console.log('[DEBUG] Current turn:', gameChess.turn() === 'w' ? 'White' : 'Black');
        
    } catch (error) {
        console.error('[DEBUG] Error starting game:', error);
        alert('Error starting game mode. Please try again.');
    }
});

