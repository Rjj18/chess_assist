import {COLOR, FEN} from "./cm-chessboard-master/src/Chessboard.js"
import {Chess} from "https://cdn.jsdelivr.net/npm/chess.mjs@1/src/chess.mjs/Chess.js"
import {GameController} from "./modules/GameController.js"
import {BoardManager} from "./modules/BoardManager.js"
import {UIController} from "./modules/UIController.js"



// Inicialização dos módulos principais
const chess = new Chess();

// Cria o gerenciador do tabuleiro com configuração customizada
const boardManager = new BoardManager("board", {
    position: chess.fen(),
    style: {
        pieces: { file: "pieces/staunty.svg" },
        animationDuration: 300,
        showCoordinates: true,    // Exibe coordenadas a-h, 1-8
        borderType: "thin"        // Borda fina com coordenadas inline
    }
});

// Cria o GameController que internamente gerencia o BlackPlayerController
const gameController = new GameController(chess, boardManager.getBoard());

// Cria o controlador da UI
const uiController = new UIController(gameController);

// Inicia o jogo
gameController.startGame();

// Exporta funções para uso global (console, HTML, etc.)
uiController.exposeGlobalFunctions();

// Exporta boardManager para uso interno
window.boardManager = boardManager;

// Inicializa a interface após carregar tudo
uiController.initializeUI();
