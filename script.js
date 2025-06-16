import {Chessboard, FEN, INPUT_EVENT_TYPE} from "./cm-chessboard-master/src/Chessboard.js"

const board = new Chessboard(document.getElementById("board"), {
  position: FEN.start,
  assetsUrl: "./cm-chessboard-master/assets/"
});

function inputHandler(event) {
    console.log("Input Event:", event); // For debugging
    if (event.type === INPUT_EVENT_TYPE.moveInputStarted || 
        event.type === INPUT_EVENT_TYPE.validateMoveInput) {
        return true; // Allow starting and validating the move
    }
    // Allow other event types (like moveInputFinished) to proceed with default library behavior
    return true; 
}

board.enableMoveInput(inputHandler);

const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", () => {
    board.setPosition(FEN.start);
});
