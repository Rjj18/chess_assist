/**
 * Presentation Manager Module
 * Dynamic presentation system that loads themes from JSON
 * @module PresentationManager
 */

import { Chess } from "https://cdn.jsdelivr.net/npm/chess.mjs@1/src/chess.mjs/Chess.js";
import { Chessboard } from "../cm-chessboard-master/src/Chessboard.js";
import { ThemeManager } from "./ThemeManager.js";
import { ThemeLoader } from "./ThemeLoader.js";

/**
 * Represents a slide with text and chess examples
 */
export class Slide {
    #title;
    #text;
    #examples;

    constructor({ title, text, examples = [] }) {
        this.#title = title;
        this.#text = text;
        this.#examples = examples;
    }

    get title() { return this.#title; }
    get text() { return this.#text; }
    get examples() { return this.#examples; }
}

/**
 * Represents a chess example with moves and description
 */
export class ChessExample {
    #name;
    #moves;
    #description;
    #pgn;

    constructor({ name, moves, description, pgn }) {
        this.#name = name;
        this.#moves = moves;
        this.#description = description;
        this.#pgn = pgn;
    }

    get name() { return this.#name; }
    get moves() { return this.#moves; }
    get description() { return this.#description; }
    get pgn() { return this.#pgn; }
}

/**
 * Manages chess board state for move-by-move navigation
 */
export class GameState {
    #positions;
    #moves;
    #currentMoveIndex;
    #maxMoves;

    constructor() {
        this.#positions = [];
        this.#moves = [];
        this.#currentMoveIndex = 0;
        this.#maxMoves = 0;
    }

    initialize(pgn) {
        const game = new Chess();
        const pgnMoves = this.#parsePgn(pgn);
        
        this.#positions = [game.fen()];
        this.#moves = [];
        
        for (const move of pgnMoves) {
            try {
                const moveObj = game.move(move);
                this.#moves.push(moveObj);
                this.#positions.push(game.fen());
            } catch (e) {
                console.warn(`Invalid move ${move}:`, e.message);
            }
        }
        
        this.#maxMoves = this.#positions.length - 1;
        this.#currentMoveIndex = 0;
    }

    #parsePgn(pgn) {
        return pgn
            .replace(/\d+\./g, '')
            .trim()
            .split(/\s+/)
            .filter(move => move && move !== '');
    }

    getCurrentPosition() {
        return this.#positions[this.#currentMoveIndex];
    }

    getCurrentMove() {
        if (this.#currentMoveIndex === 0) return null;
        return this.#moves[this.#currentMoveIndex - 1];
    }

    canGoNext() {
        return this.#currentMoveIndex < this.#maxMoves;
    }

    canGoPrevious() {
        return this.#currentMoveIndex > 0;
    }

    next() {
        if (this.canGoNext()) {
            this.#currentMoveIndex++;
            return true;
        }
        return false;
    }

    previous() {
        if (this.canGoPrevious()) {
            this.#currentMoveIndex--;
            return true;
        }
        return false;
    }

    goToStart() {
        this.#currentMoveIndex = 0;
    }

    goToEnd() {
        this.#currentMoveIndex = this.#maxMoves;
    }

    getMoveNumber() {
        return Math.ceil(this.#currentMoveIndex / 2);
    }

    isWhiteMove() {
        return this.#currentMoveIndex % 2 === 1;
    }
}

/**
 * Manages individual chess board with navigation controls
 */
export class BoardController {
    #board;
    #gameState;
    #containerId;
    #moveDisplay;
    #controls;

    constructor(containerId, pgn) {
        this.#containerId = containerId;
        this.#gameState = new GameState();
        this.#gameState.initialize(pgn);
        this.#createBoard();
        this.#createControls();
        this.#updateDisplay();
    }

    #createBoard() {
        const container = document.getElementById(this.#containerId);
        // Detectar se estamos em uma subpasta (como games/)
        const currentPath = window.location.pathname;
        const isInSubfolder = currentPath.includes('/games/');
        const assetsPath = isInSubfolder ? "../cm-chessboard-master/assets/" : "cm-chessboard-master/assets/";
        
        this.#board = new Chessboard(container, {
            position: this.#gameState.getCurrentPosition(),
            assetsUrl: assetsPath,
            style: {
                pieces: { file: "pieces/staunty.svg" },
                showCoordinates: true,
                borderType: "thin"
            },
            responsive: true
        });
    }

    #createControls() {
        const container = document.getElementById(this.#containerId).parentElement;
        
        // Move display
        this.#moveDisplay = document.createElement('div');
        this.#moveDisplay.className = 'move-display';
        
        // Control buttons
        this.#controls = document.createElement('div');
        this.#controls.className = 'board-controls';
        this.#controls.innerHTML = `
            <button class="first-move-btn">⏮️ Início</button>
            <button class="prev-move-btn">⬅️ Anterior</button>
            <button class="next-move-btn">➡️ Próximo</button>
            <button class="last-move-btn">⏭️ Final</button>
        `;

        // Instructions
        const instructions = document.createElement('div');
        instructions.className = 'board-instructions';
        instructions.textContent = 'Use os botões ou Shift + ← / → para navegar pelos lances';

        container.appendChild(this.#moveDisplay);
        container.appendChild(this.#controls);
        container.appendChild(instructions);

        this.#setupEventListeners();
    }

    #setupEventListeners() {
        const firstBtn = this.#controls.querySelector('.first-move-btn');
        const prevBtn = this.#controls.querySelector('.prev-move-btn');
        const nextBtn = this.#controls.querySelector('.next-move-btn');
        const lastBtn = this.#controls.querySelector('.last-move-btn');

        firstBtn.addEventListener('click', () => {
            this.#gameState.goToStart();
            this.#updateDisplay();
        });

        prevBtn.addEventListener('click', () => {
            this.#gameState.previous();
            this.#updateDisplay();
        });

        nextBtn.addEventListener('click', () => {
            this.#gameState.next();
            this.#updateDisplay();
        });

        lastBtn.addEventListener('click', () => {
            this.#gameState.goToEnd();
            this.#updateDisplay();
        });
    }

    #updateDisplay() {
        // Update board position
        this.#board.setPosition(this.#gameState.getCurrentPosition());

        // Update move display
        const currentMove = this.#gameState.getCurrentMove();
        if (currentMove) {
            const moveNumber = this.#gameState.getMoveNumber();
            const isWhite = this.#gameState.isWhiteMove();
            this.#moveDisplay.textContent = isWhite 
                ? `${moveNumber}. ${currentMove.san}`
                : `${moveNumber}... ${currentMove.san}`;
        } else {
            this.#moveDisplay.textContent = 'Posição inicial';
        }

        // Update button states
        const firstBtn = this.#controls.querySelector('.first-move-btn');
        const prevBtn = this.#controls.querySelector('.prev-move-btn');
        const nextBtn = this.#controls.querySelector('.next-move-btn');
        const lastBtn = this.#controls.querySelector('.last-move-btn');

        firstBtn.disabled = !this.#gameState.canGoPrevious();
        prevBtn.disabled = !this.#gameState.canGoPrevious();
        nextBtn.disabled = !this.#gameState.canGoNext();
        lastBtn.disabled = !this.#gameState.canGoNext();
    }

    // Public API for keyboard navigation
    goNext() {
        if (this.#gameState.next()) {
            this.#updateDisplay();
            return true;
        }
        return false;
    }

    goPrevious() {
        if (this.#gameState.previous()) {
            this.#updateDisplay();
            return true;
        }
        return false;
    }

    goToStart() {
        this.#gameState.goToStart();
        this.#updateDisplay();
    }

    goToEnd() {
        this.#gameState.goToEnd();
        this.#updateDisplay();
    }
}

/**
 * Main Presentation Manager class
 */
export class PresentationManager {
    #slides;
    #currentSlideIndex;
    #boardControllers;
    #themeManager;
    #themeLoader;
    #slidesContainer;
    #navigationControls;
    #currentTheme;
    #keyboardHandler;

    /**
     * Create a new PresentationManager
     * @param {string} themeId - Theme ID to load, or null to load from URL
     * @param {string} containerId - Container element ID
     */
    constructor(themeId = null, containerId = 'slides-container') {
        this.#currentSlideIndex = 0;
        this.#boardControllers = new Map();
        this.#themeManager = new ThemeManager();
        this.#themeLoader = new ThemeLoader();
        this.#slidesContainer = document.getElementById(containerId);
        this.#initialize(themeId);
    }

    #cleanup() {
        // Clear slides container
        if (this.#slidesContainer) {
            this.#slidesContainer.innerHTML = '';
        }
        
        // Clear board controllers
        this.#boardControllers.clear();
        
        // Remove keyboard event listeners (prevent duplicates)
        if (this.#keyboardHandler) {
            document.removeEventListener('keydown', this.#keyboardHandler);
            this.#keyboardHandler = null;
        }
        
        console.log('🧹 Cleaned up previous presentation content');
    }

    async #initialize(themeId) {
        try {
            // Clear previous content if reinitializing
            if (this.#slides && this.#slides.length > 0) {
                this.#cleanup();
            }
            
            // Load theme data
            if (themeId) {
                this.#currentTheme = await this.#themeLoader.loadTheme(themeId);
            } else {
                this.#currentTheme = await this.#themeLoader.loadFromUrlOrDefault();
            }
            
            // Convert theme data to slides
            this.#slides = this.#currentTheme.slides.map(slideData => new Slide({
                title: slideData.title,
                text: slideData.content,
                examples: slideData.examples ? slideData.examples.map(ex => new ChessExample(ex)) : []
            }));
            
            // Update page title with theme title
            document.title = `${this.#currentTheme.metadata.title} - Chess Assist`;
            
            // Reset slide index
            this.#currentSlideIndex = 0;
            
            // Initialize presentation
            this.#createSlides();
            this.#setupNavigation();
            this.#setupKeyboardShortcuts();
            this.#showSlide(0);
            
            console.log(`🎯 Presentation initialized with theme: ${this.#currentTheme.metadata.title}`);
            
        } catch (error) {
            console.error('Failed to initialize presentation:', error);
            this.#showError(error.message);
        }
    }

    #createSlides() {
        this.#slides.forEach((slide, slideIndex) => {
            const slideElement = this.#createSlideElement(slide, slideIndex);
            this.#slidesContainer.appendChild(slideElement);
        });
    }

    #createSlideElement(slide, slideIndex) {
        const slideDiv = document.createElement('div');
        slideDiv.className = `slide ${slideIndex === 0 ? 'active' : ''}`;
        slideDiv.innerHTML = `
            <h2>${slide.title}</h2>
            <p>${this.#formatText(slide.text)}</p>
        `;

        // Add examples
        slide.examples.forEach((example, exampleIndex) => {
            const exampleDiv = this.#createExampleElement(example, slideIndex, exampleIndex);
            slideDiv.appendChild(exampleDiv);
        });

        return slideDiv;
    }

    #createExampleElement(example, slideIndex, exampleIndex) {
        const exampleDiv = document.createElement('div');
        exampleDiv.className = 'chess-example';
        
        const boardId = `board-${slideIndex}-${exampleIndex}`;
        
        exampleDiv.innerHTML = `
            <h4>${example.name}</h4>
            <div class="example-moves">${example.moves}</div>
            <p style="font-size: 0.9em; margin: 5px 0;">${example.description}</p>
            <div class="board-container" id="${boardId}"></div>
        `;

        // Create board controller after DOM insertion
        setTimeout(() => {
            const boardController = new BoardController(boardId, example.pgn);
            this.#boardControllers.set(`${slideIndex}-${exampleIndex}`, boardController);
        }, 100 + (exampleIndex * 50));

        return exampleDiv;
    }

    #formatText(text) {
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }

    #setupNavigation() {
        this.#navigationControls = document.querySelector('.navigation');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        // Remove existing listeners by cloning elements (removes all listeners)
        const newPrevBtn = prevBtn.cloneNode(true);
        const newNextBtn = nextBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
        nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);

        // Add new listeners
        newPrevBtn.addEventListener('click', () => this.#previousSlide());
        newNextBtn.addEventListener('click', () => this.#nextSlide());
    }

    #setupKeyboardShortcuts() {
        // Remove existing handler if any
        if (this.#keyboardHandler) {
            document.removeEventListener('keydown', this.#keyboardHandler);
        }
        
        // Create new handler
        this.#keyboardHandler = (event) => {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }

            switch (event.key) {
                case 'ArrowLeft':
                    event.preventDefault();
                    if (event.shiftKey) {
                        this.#navigateAllBoards('previous');
                    } else {
                        this.#previousSlide();
                    }
                    break;

                case 'ArrowRight':
                    event.preventDefault();
                    if (event.shiftKey) {
                        this.#navigateAllBoards('next');
                    } else {
                        this.#nextSlide();
                    }
                    break;

                case 'Home':
                    event.preventDefault();
                    this.#navigateAllBoards('start');
                    break;

                case 'End':
                    event.preventDefault();
                    this.#navigateAllBoards('end');
                    break;

                case 'Escape':
                    event.preventDefault();
                    this.#goToFirstSlide();
                    break;
            }
        };
        
        // Add the new handler
        document.addEventListener('keydown', this.#keyboardHandler);
    }

    #navigateAllBoards(direction) {
        const currentSlideBoards = Array.from(this.#boardControllers.keys())
            .filter(key => key.startsWith(`${this.#currentSlideIndex}-`))
            .map(key => this.#boardControllers.get(key));

        currentSlideBoards.forEach(board => {
            switch (direction) {
                case 'next':
                    board.goNext();
                    break;
                case 'previous':
                    board.goPrevious();
                    break;
                case 'start':
                    board.goToStart();
                    break;
                case 'end':
                    board.goToEnd();
                    break;
            }
        });
    }

    #showSlide(index) {
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        this.#updateNavigationButtons();
    }

    #updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        prevBtn.disabled = this.#currentSlideIndex === 0;
        nextBtn.disabled = this.#currentSlideIndex === this.#slides.length - 1;
    }

    #nextSlide() {
        if (this.#currentSlideIndex < this.#slides.length - 1) {
            this.#currentSlideIndex++;
            this.#showSlide(this.#currentSlideIndex);
        }
    }

    #previousSlide() {
        if (this.#currentSlideIndex > 0) {
            this.#currentSlideIndex--;
            this.#showSlide(this.#currentSlideIndex);
        }
    }

    #goToFirstSlide() {
        this.#currentSlideIndex = 0;
        this.#showSlide(this.#currentSlideIndex);
    }

    #showError(message) {
        this.#slidesContainer.innerHTML = `
            <div style="
                padding: 2rem;
                text-align: center;
                color: var(--error-text, #d32f2f);
                background-color: var(--error-bg, #ffebee);
                border: 1px solid var(--error-border, #e57373);
                border-radius: var(--radius-md, 8px);
                margin: 2rem auto;
                max-width: 600px;
            ">
                <h2>❌ Erro ao Carregar Apresentação</h2>
                <p>${message}</p>
                <button onclick="location.reload()" style="
                    background-color: var(--btn-primary-bg);
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: var(--radius-sm, 4px);
                    cursor: pointer;
                    margin-top: 1rem;
                ">Tentar Novamente</button>
            </div>
        `;
    }

    // Public API
    getCurrentSlide() {
        return this.#currentSlideIndex;
    }

    getTotalSlides() {
        return this.#slides?.length || 0;
    }

    getCurrentTheme() {
        return this.#currentTheme;
    }

    getAvailableThemes() {
        return this.#themeLoader.getAvailableThemes();
    }

    async switchTheme(themeId) {
        try {
            const newTheme = await this.#themeLoader.loadTheme(themeId);
            
            // Update URL without reload
            const url = new URL(window.location);
            url.searchParams.set('theme', themeId);
            window.history.pushState({}, '', url);
            
            // Reinitialize with new theme
            await this.#initialize(themeId);
            
        } catch (error) {
            console.error('Failed to switch theme:', error);
            throw error;
        }
    }
}
