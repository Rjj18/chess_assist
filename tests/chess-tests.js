// Basic Chess Assist Tests
import { Chess } from "https://cdn.jsdelivr.net/npm/chess.mjs@1/src/chess.mjs/Chess.js";

// Simple test runner
class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }
    
    test(name, fn) {
        this.tests.push({ name, fn });
    }
    
    async run() {
        console.log("Running Chess Assist Tests...");
        
        for (const test of this.tests) {
            try {
                await test.fn();
                console.log(`✓ ${test.name}`);
                this.passed++;
            } catch (error) {
                console.error(`✗ ${test.name}: ${error.message}`);
                this.failed++;
            }
        }
        
        console.log(`\nResults: ${this.passed} passed, ${this.failed} failed`);
        return this.failed === 0;
    }
}

// Initialize test runner
const runner = new TestRunner();

// Basic chess game tests
runner.test("Chess game initializes correctly", () => {
    const chess = new Chess();
    if (chess.fen() !== "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") {
        throw new Error("Chess game did not initialize with correct starting position");
    }
});

runner.test("Chess game accepts valid moves", () => {
    const chess = new Chess();
    const move = chess.move("e4");
    if (!move) {
        throw new Error("Valid move e4 was rejected");
    }
});

runner.test("Chess game rejects invalid moves", () => {
    const chess = new Chess();
    const move = chess.move("e5");
    if (move) {
        throw new Error("Invalid move e5 was accepted");
    }
});

runner.test("Module loading works correctly", async () => {
    // Test that our modules can be imported (basic syntax check)
    try {
        const moduleTests = [
            "../modules/GameController.js",
            "../modules/BoardManager.js",
            "../modules/UIController.js"
        ];
        
        // This is a basic existence check since we can't import in test context
        for (const modulePath of moduleTests) {
            const response = await fetch(modulePath);
            if (!response.ok) {
                throw new Error(`Module ${modulePath} not accessible`);
            }
        }
    } catch (error) {
        throw new Error(`Module loading test failed: ${error.message}`);
    }
});

// Export for browser use
if (typeof window !== 'undefined') {
    window.TestRunner = TestRunner;
    window.runChessTests = () => runner.run();
}

// Run tests if in Node.js environment
if (typeof module !== 'undefined') {
    runner.run().then(success => {
        process.exit(success ? 0 : 1);
    });
}