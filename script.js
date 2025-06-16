import {Chessboard, FEN} from "./cm-chessboard-master/src/Chessboard.js"

const board = new Chessboard(document.getElementById("board"), {
  position: FEN.start,
  assetsUrl: "./cm-chessboard-master/assets/" // wherever you copied the assets folder to, could also be in the node_modules folder
})
