# Stockfish Integration Guide for Chess Assist

This document provides a focused, step-by-step plan for integrating the Stockfish chess engine into the Chess Assist project. It is distilled from the broader improvement plan and includes actionable code and UI examples.

---

## 1. Choose a Stockfish Build
- Use [stockfish.wasm](https://github.com/niklasf/stockfish.wasm) or [stockfish.js](https://github.com/lichess-org/stockfish.js) for browser compatibility.
- Add the engine as a web worker for non-blocking analysis.
- **Example:**
  ```js
  const stockfish = new Worker('stockfish.js');
  stockfish.postMessage('uci');
  ```

## 2. Integrate with GameController
- Refactor AI logic to support async engine calls.
- On AI turn, send FEN to Stockfish worker and request best move.
- When Stockfish responds, apply the move and update the board.
- **Example:**
  ```js
  stockfish.postMessage('position fen ' + fen);
  stockfish.postMessage('go depth 15');
  stockfish.onmessage = function(e) {
    if (e.data.startsWith('bestmove')) {
      // parse and play move
    }
  }
  ```

## 3. UI/UX for Engine
- Add a difficulty slider (Stockfish skill level 0-20).
- Show a "thinking" indicator while the engine is calculating.
- Optionally, display engine evaluation and best line.
- **Example:**
  - Add a slider in `play.html` and show a spinner while waiting for Stockfish.

## 4. Testing and Fallbacks
- Ensure fallback to random/greedy AI if the engine fails to load.
- Test on all supported browsers and devices.
- **Example:**
  If Stockfish worker throws, use `BlackPlayerController` as fallback.

## 5. Future Extensions
- Allow user to play as black or white against Stockfish.
- Add "Analyze with Stockfish" button for any position.
- Support engine hints and move explanations.

---

## Example: Refactoring for Stockfish

Suppose you want to use Stockfish for the AI in `GameController.js`:

1. **Create a StockfishWorker.js** that loads the engine and communicates via `postMessage`.
2. **Modify `BlackPlayerController`** to optionally use Stockfish:
   ```js
   class BlackPlayerController extends PlayerController {
     async makeAutomaticMove() {
       if (this.useStockfish) {
         // send FEN to Stockfish worker, await best move
       } else {
         // fallback to random
       }
     }
   }
   ```
3. **Update the UI** to let the user pick AI strength and see engine thinking.

---

## Checklist for Implementation

- [ ] Download and add Stockfish.js/wasm to the project
- [ ] Create a web worker wrapper for Stockfish
- [ ] Refactor AI logic to support async engine calls
- [ ] Update controllers to use Stockfish for move calculation
- [ ] Add UI controls for engine strength and thinking indicator
- [ ] Implement fallback logic for engine errors
- [ ] Test on all browsers/devices
- [ ] Document usage and troubleshooting

---

**Summary:**
- Integrate Stockfish as a web worker for strong AI and analysis
- Refactor code for async engine calls and fallback support
- Enhance UI for engine controls and feedback
- See above for concrete code and UI examples to guide implementation
