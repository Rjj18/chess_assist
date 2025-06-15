var config = {
        draggable: true,
        position: 'start',
        pieceTheme: 'chessboardjs-1.0.0/img/chesspieces/wikipedia/{piece}.png',
        onDrop: function(source, target) {
          console.log('Peça movida de ' + source + ' para ' + target);
        }
      }
      var board = Chessboard('meuTabuleiro', config);