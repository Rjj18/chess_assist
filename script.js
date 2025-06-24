import {BORDER_TYPE, Chessboard, COLOR, FEN, INPUT_EVENT_TYPE} from "./cm-chessboard-master/src/Chessboard.js"
import {Chess} from "https://cdn.jsdelivr.net/npm/chess.mjs@1/src/chess.mjs/Chess.js"



const chess = new Chess();

const board = new Chessboard(document.getElementById("board"), {
    position: chess.fen(),
    draggable: true,
    style: {borderType: BORDER_TYPE.none, pieces: {file: "pieces/staunty.svg"}, animationDuration: 300},
    assetsUrl: "./cm-chessboard-master/assets/"
});

function inputHandler(event) {
    console.log("Input Event:", event);
    
    if (event.type === INPUT_EVENT_TYPE.moveInputStarted) {
        // Permite iniciar o movimento
        return true;
    }
    
    if (event.type === INPUT_EVENT_TYPE.validateMoveInput) {
        // Verifica se o movimento é legal usando chess.js
        const move = {
            from: event.squareFrom,
            to: event.squareTo,
            promotion: event.promotion || 'q' // Promoção padrão para rainha
        };
        
        // Tenta fazer o movimento no objeto chess
        const moveResult = chess.move(move);
        
        if (moveResult) {
            // Movimento é legal
            console.log("Movimento legal:", moveResult);
            return true;
        } else {
            // Movimento é ilegal
            console.log("Movimento ilegal:", move);
            return false;
        }
    }
    
    if (event.type === INPUT_EVENT_TYPE.moveInputFinished) {
        console.log("Movimento finalizado. Turno atual:", chess.turn());
        
        // O movimento já foi validado e aceito
        // Atualiza a posição do tabuleiro visual
        board.setPosition(chess.fen());
        
        // Verifica se o jogo terminou
        if (chess.game_over()) {
            if (chess.in_checkmate()) {
                const winner = chess.turn() === 'w' ? 'Pretas' : 'Brancas';
                alert(`Xeque-mate! ${winner} venceram!`);
            } else if (chess.in_draw()) {
                alert('Empate!');
            } else if (chess.in_stalemate()) {
                alert('Afogamento! Empate!');
            }
            return true;
        } else if (chess.in_check()) {
            const player = chess.turn() === 'w' ? 'Brancas' : 'Pretas';
            console.log(`${player} estão em xeque!`);
        }
        
        // Verifica se é a vez das pretas (computador)
        if (chess.turn() === 'b') {
            console.log("É a vez das pretas - fazendo movimento automático");
            // Desabilita input do usuário temporariamente
            board.disableMoveInput();
            
            // Faz movimento automático das pretas após um pequeno delay
            setTimeout(() => {
                makeRandomBlackMove();
            }, 800); // Aumentei o delay para 800ms
        } else {
            // É a vez das brancas (jogador humano)
            console.log("É a vez das brancas - habilitando input");
            board.enableMoveInput(inputHandler, COLOR.white);
        }
        
        return true;
    }
    
    return true;
}

// Inicia permitindo apenas as brancas moverem (chess.js sempre começa com brancas)
board.enableMoveInput(inputHandler, COLOR.white);

const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", () => {
    chess.reset(); // Reseta o estado do chess.js
    board.setPosition(FEN.start); // Reseta a posição visual
    board.enableMoveInput(inputHandler, COLOR.white); // Permite apenas brancas moverem
    console.log("Jogo resetado");
});

// Função para fazer movimento aleatório das pretas
function makeRandomBlackMove() {
    console.log("makeRandomBlackMove chamada. Turno atual:", chess.turn());
    
    if (chess.turn() !== 'b') {
        console.log("Não é a vez das pretas, retornando");
        return; // Não é a vez das pretas
    }
    
    // Obtém todos os movimentos legais possíveis
    const possibleMoves = chess.moves();
    console.log("Movimentos possíveis para as pretas:", possibleMoves.length);
    
    if (possibleMoves.length === 0) {
        console.log("Não há movimentos possíveis para as pretas");
        return;
    }
    
    // Seleciona um movimento aleatório
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    const randomMove = possibleMoves[randomIndex];
    console.log("Movimento escolhido:", randomMove);
    
    // Executa o movimento
    const moveResult = chess.move(randomMove);
    
    if (moveResult) {
        console.log("Movimento das pretas executado:", moveResult);
        
        // Atualiza o tabuleiro visual com animação
        board.setPosition(chess.fen());
        
        // Verifica se o jogo terminou após o movimento das pretas
        if (chess.game_over()) {
            if (chess.in_checkmate()) {
                alert("Xeque-mate! As pretas venceram!");
            } else if (chess.in_draw()) {
                alert("Empate!");
            } else if (chess.in_stalemate()) {
                alert("Afogamento! Empate!");
            }
            return;
        }
        
        // Verifica se as brancas estão em xeque
        if (chess.in_check()) {
            console.log("Brancas estão em xeque!");
        }
        
        // Habilita movimento para as brancas novamente
        console.log("Habilitando movimento para as brancas");
        board.enableMoveInput(inputHandler, COLOR.white);
    } else {
        console.log("Erro ao executar movimento das pretas");
        // Se por algum motivo o movimento falhou, reabilita as brancas
        board.enableMoveInput(inputHandler, COLOR.white);
    }
}

// Função para obter informações do jogo
function getGameInfo() {
    return {
        turn: chess.turn(),
        isCheck: chess.in_check(),
        isCheckmate: chess.in_checkmate(),
        isDraw: chess.in_draw(),
        isStalemate: chess.in_stalemate(),
        fen: chess.fen(),
        pgn: chess.pgn()
    };
}

// Função para desfazer movimento (opcional)
function undoMove() {
    const move = chess.undo();
    if (move) {
        board.setPosition(chess.fen());
        const currentPlayer = chess.turn() === 'w' ? COLOR.white : COLOR.black;
        board.enableMoveInput(inputHandler, currentPlayer);
        console.log("Movimento desfeito:", move);
        return true;
    }
    return false;
}

// Exportar funções úteis (se necessário)
window.getGameInfo = getGameInfo;
window.undoMove = undoMove;
window.makeRandomBlackMove = makeRandomBlackMove;
