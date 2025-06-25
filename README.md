# Chess Assist

A modern, modular chess assistant web application built with ES2024 standards. Play chess against an AI opponent with a clean, responsive interface featuring live move notation.

![Chess Assist](https://via.placeholder.com/800x400/4CAF50/FFFFFF?text=Chess+Assist)

## Features

- 🎯 **Interactive Chess Board**: Visual drag-and-drop interface with coordinates
- 🤖 **AI Opponent**: Play against an automated black player
- 📝 **Live Move Notation**: Real-time display of moves in standard algebraic notation
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔄 **Game Controls**: Reset, undo moves, and force AI moves
- ⚡ **Modern Architecture**: Modular ES2024 code with clean separation of concerns

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chess_assist
   ```

2. **Serve the application**
   ```bash
   python -m http.server 8000
   ```

3. **Open in browser**
   Navigate to `http://localhost:8000`

## Architecture

The application follows a modular architecture with clear separation of responsibilities:

### Core Modules

- **`GameController`** - Manages game flow, move validation, and game state
- **`BoardManager`** - Handles visual board configuration and rendering
- **`UIController`** - Manages user interface interactions and controls
- **`MovesTableController`** - Handles the moves notation table
- **`BlackPlayerController`** - AI logic for automated black piece moves
- **`PlayerController`** - Abstract base class for player implementations

### Project Structure

```
chess_assist/
├── index.html                 # Main HTML file
├── script.js                  # Application entry point
├── styles.css                 # All CSS styles
├── modules/                   # Modular JavaScript components
│   ├── GameController.js
│   ├── BoardManager.js
│   ├── UIController.js
│   ├── MovesTableController.js
│   ├── BlackPlayerController.js
│   └── PlayerController.js
└── cm-chessboard-master/      # Chess board library
    ├── src/
    └── assets/
```

## Usage

### Basic Gameplay

1. **Make moves**: Click and drag white pieces to make your moves
2. **AI responds**: Black pieces move automatically after a short delay
3. **View notation**: All moves are recorded in the notation table on the right
4. **Control game**: Use the buttons to reset, undo, or force AI moves

### Game Controls

- **Reset Position**: Restart the game to the initial position
- **Undo Move**: Remove the last move made by either player
- **Force Black Move**: Make the AI play immediately (if it's black's turn)

### Move Notation

The moves table displays standard algebraic notation:
- **Format**: `1. e4 e5` (move number, white move, black move)
- **Special notation**: Castling (O-O, O-O-O), captures (x), check (+), checkmate (#)
- **Auto-scroll**: Table automatically scrolls to show the latest moves

## Customization

### Board Configuration

The board can be customized in `script.js`:

```javascript
const boardManager = new BoardManager("board", {
    style: {
        pieces: { file: "pieces/staunty.svg" },
        animationDuration: 300,
        showCoordinates: true,
        borderType: "thin"
    }
});
```

### AI Behavior

Modify the AI delay and behavior in `BlackPlayerController.js`:

```javascript
constructor(chess, board, moveDelay = 800) {
    // moveDelay controls how long AI waits before moving
}
```

### Styling

All styles are centralized in `styles.css`:
- Board and table layout
- Responsive breakpoints
- Color scheme and typography
- Button and interaction styles

## Browser Support

- **Modern browsers** with ES2024 module support
- **Chrome 91+**, **Firefox 89+**, **Safari 15+**, **Edge 91+**
- **Mobile browsers** with touch support for piece movement

## Dependencies

- **[cm-chessboard](https://github.com/shaack/cm-chessboard)** - Chess board UI component
- **[chess.mjs](https://github.com/jhlywa/chess.js)** - Chess game logic and validation
- **No build tools required** - Pure ES modules

## Development

### Code Style

- **ES2024 modules** with private fields and methods
- **JSDoc comments** for all public APIs
- **Consistent naming** with camelCase and meaningful prefixes
- **Error handling** with try-catch blocks and user feedback

### Adding Features

1. **Create new modules** in the `modules/` directory
2. **Import and initialize** in `script.js`
3. **Add styles** to `styles.css`
4. **Update documentation** as needed

### Testing

The application can be tested by:
1. Starting the local server
2. Opening browser developer tools
3. Playing various game scenarios
4. Checking console for any errors

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes with proper documentation
4. Test thoroughly across different browsers
5. Submit a pull request

## License

This project is open source. Please check the license file for details.

## Acknowledgments

- **Chess.js** for providing robust chess game logic
- **cm-chessboard** for the interactive board component
- **Modern web standards** for enabling clean, modular architecture

---

**Enjoy playing chess!** 🎉♟️
