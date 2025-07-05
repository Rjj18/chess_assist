# Chess Assist

A modern, modular chess assistant web application built with ES2024 standards. Play chess against an AI opponent with a clean, responsive interface featuring live move notation.

🎮 **[Play Online](https://rjj18.github.io/chess_assist)** 

## Features

- 🎯 **Interactive Chess Board**: Visual drag-and-drop interface with coordinates
- 🤖 **AI Opponent**: Play against an automated black player
- 📝 **Live Move Notation**: Real-time display of moves in standard algebraic notation
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔄 **Game Controls**: Reset, undo moves, and force AI moves
- ⚡ **Modern Architecture**: Modular ES2024 code with clean separation of concerns

## Quick Start

### Option 1: Play Online (Recommended)
Simply visit: [https://rjj18.github.io/chess_assist](https://rjj18.github.io/chess_assist)

### Option 2: Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/chess-assist.git
   cd chess-assist
   ```

2. **Serve the application**
   
   **With Python (recommended):**
   ```bash
   # Python 3
   python -m http.server 8000
   # or
   npm start
   ```
   
   **With Node.js:**
   ```bash
   npx serve .
   ```
   
   **With any other static server:**
   ```bash
   # Live Server extension in VS Code
   # or any static file server
   ```

3. **Open your browser**
   ```
   http://localhost:8000
   ```

## GitHub Pages Deployment

This project is ready for GitHub Pages deployment:

1. **Fork or clone** this repository to your GitHub account
2. **Enable GitHub Pages** in repository settings:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: main / (root)
3. **Your chess app** will be available at: `https://your-username.github.io/chess-assist/`

### Automatic Deployment

The project includes GitHub Actions workflow that automatically deploys to GitHub Pages when you push to the main branch.

## Project Structure

```
chess-assist/
├── index.html              # Main HTML file
├── script.js              # Main application entry point
├── styles.css             # Application styles
├── package.json           # Project configuration
├── .github/workflows/     # GitHub Actions for auto-deployment
│   └── deploy.yml
├── modules/               # ES2024 modules
│   ├── GameController.js
│   ├── BoardManager.js
│   ├── UIController.js
│   ├── MovesTableController.js
│   ├── PlayerController.js
│   └── BlackPlayerController.js
└── cm-chessboard-master/  # Chess board library
    ├── src/
    ├── assets/
    └── ...
```

## Technical Details

- **ES2024 Standards**: Uses modern JavaScript features and ES modules
- **No Build Process**: Runs directly in the browser without compilation
- **Modular Architecture**: Clean separation of concerns with ES modules
- **CDN Dependencies**: Uses chess.mjs from CDN for chess logic
- **Static Hosting**: Compatible with any static file server

## Browser Compatibility

- ✅ Chrome 91+
- ✅ Firefox 89+
- ✅ Safari 15+
- ✅ Edge 91+

## Testing

This project includes basic test infrastructure:

### Running Tests

1. **Browser Tests**: Run `npm test` and open `http://localhost:8080/tests/` in your browser
2. **Development**: Use the browser console to run `runChessTests()`

### Test Coverage

- Chess game initialization
- Valid move acceptance
- Invalid move rejection
- Module loading validation

## Dependencies

- [cm-chessboard](https://github.com/shaack/cm-chessboard) - Interactive chess board
- [chess.mjs](https://github.com/jhlywa/chess.js) - Chess game logic (via CDN)

## 🤖 AI-Powered Issue Resolution

This repository features **automated issue resolution** using GitHub Copilot! When you create an issue, our AI assistant will:

- 🔍 **Analyze** your issue description
- 💡 **Generate** a potential solution
- 🧪 **Test** the changes automatically
- 📝 **Create** a pull request for review

### How to Use
1. Create a detailed issue with clear description
2. Use keywords like "bug", "feature", "test", or "UI" 
3. Wait for the Copilot assistant to analyze and respond
4. Review the auto-generated pull request

📖 **[Learn more about the automation](docs/COPILOT_AUTOMATION.md)**

## Contributing

### Automated Contributions
- Create an issue and let the AI assistant propose a solution
- Review and test auto-generated pull requests
- Provide feedback to improve automation

### Manual Contributions
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Chess board UI powered by [cm-chessboard](https://github.com/shaack/cm-chessboard)
- Chess logic powered by [chess.js](https://github.com/jhlywa/chess.js)
- Modern JavaScript ES2024 standards

---

**Enjoy playing chess!** 🎉♟️
