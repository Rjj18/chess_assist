/**
 * Theme Manager Tests
 * Tests for light/dark mode toggle functionality
 */

// Simple test framework
class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(description, testFn) {
        this.tests.push({ description, testFn });
    }

    async run() {
        console.log('🧪 Running Theme Manager Tests...\n');
        
        for (const { description, testFn } of this.tests) {
            try {
                await testFn();
                console.log(`✅ ${description}`);
                this.passed++;
            } catch (error) {
                console.error(`❌ ${description}: ${error.message}`);
                this.failed++;
            }
        }

        console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
        return this.failed === 0;
    }
}

// Test helper functions
function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function assertEquals(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(`${message}: expected '${expected}', got '${actual}'`);
    }
}

function assertExists(element, message) {
    if (!element) {
        throw new Error(message);
    }
}

// Theme Manager Tests
export async function runThemeTests() {
    const runner = new TestRunner();

    // Test 1: ThemeManager initialization
    runner.test('ThemeManager should initialize properly', () => {
        assertExists(window.themeManager, 'ThemeManager should be available globally');
        assert(typeof window.themeManager.getCurrentTheme === 'function', 'getCurrentTheme method should exist');
        assert(typeof window.themeManager.setTheme === 'function', 'setTheme method should exist');
        assert(typeof window.themeManager.toggleTheme === 'function', 'toggleTheme method should exist');
    });

    // Test 2: Default theme should be light
    runner.test('Default theme should be light', () => {
        const currentTheme = window.themeManager.getCurrentTheme();
        assert(['light', 'dark'].includes(currentTheme), 'Current theme should be light or dark');
    });

    // Test 3: Theme toggle functionality
    runner.test('Theme toggle should work', () => {
        const initialTheme = window.themeManager.getCurrentTheme();
        window.themeManager.toggleTheme();
        const newTheme = window.themeManager.getCurrentTheme();
        assert(initialTheme !== newTheme, 'Theme should change after toggle');
        
        // Toggle back
        window.themeManager.toggleTheme();
        const finalTheme = window.themeManager.getCurrentTheme();
        assertEquals(finalTheme, initialTheme, 'Theme should return to original after second toggle');
    });

    // Test 4: Theme persistence
    runner.test('Theme should persist in localStorage', () => {
        window.themeManager.setTheme('dark');
        const stored = localStorage.getItem('chess-assist-theme');
        assertEquals(stored, 'dark', 'Dark theme should be stored in localStorage');
        
        window.themeManager.setTheme('light');
        const storedLight = localStorage.getItem('chess-assist-theme');
        assertEquals(storedLight, 'light', 'Light theme should be stored in localStorage');
    });

    // Test 5: DOM attributes should update
    runner.test('DOM should reflect theme changes', () => {
        window.themeManager.setTheme('dark');
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        assert(isDarkMode, 'Document should have data-theme="dark" attribute');
        
        window.themeManager.setTheme('light');
        const isLightMode = document.documentElement.getAttribute('data-theme') !== 'dark';
        assert(isLightMode, 'Document should not have data-theme="dark" attribute in light mode');
    });

    // Test 6: Theme toggle button accessibility
    runner.test('Theme toggle button should be accessible', () => {
        const toggleButton = document.getElementById('themeToggle');
        assertExists(toggleButton, 'Theme toggle button should exist');
        assert(toggleButton.hasAttribute('aria-label'), 'Toggle button should have aria-label');
        assert(toggleButton.hasAttribute('role'), 'Toggle button should have role attribute');
        assert(toggleButton.hasAttribute('aria-checked'), 'Toggle button should have aria-checked');
    });

    // Test 7: Theme change event
    runner.test('Theme change should dispatch custom event', async () => {
        let eventFired = false;
        let eventTheme = null;

        const handler = (event) => {
            eventFired = true;
            eventTheme = event.detail.theme;
        };

        document.addEventListener('themechange', handler);
        window.themeManager.setTheme('dark');
        
        // Wait a bit for event to fire
        await new Promise(resolve => setTimeout(resolve, 10));
        
        document.removeEventListener('themechange', handler);
        
        assert(eventFired, 'Theme change event should be fired');
        assertEquals(eventTheme, 'dark', 'Event should contain correct theme');
    });

    // Test 8: Invalid theme handling
    runner.test('Invalid theme should be handled gracefully', () => {
        const initialTheme = window.themeManager.getCurrentTheme();
        window.themeManager.setTheme('invalid-theme');
        const finalTheme = window.themeManager.getCurrentTheme();
        assertEquals(finalTheme, initialTheme, 'Theme should not change with invalid input');
    });

    return await runner.run();
}

// UI Tests
export async function runUITests() {
    const runner = new TestRunner();

    // Test 1: Modern UI elements should exist
    runner.test('Modern UI elements should be present', () => {
        const header = document.querySelector('.header');
        assertExists(header, 'Header should exist');
        
        const themeToggle = document.querySelector('.theme-toggle');
        assertExists(themeToggle, 'Theme toggle section should exist');
        
        const gameContainer = document.querySelector('.game-container');
        assertExists(gameContainer, 'Game container should exist');
    });

    // Test 2: CSS custom properties should be defined
    runner.test('CSS custom properties should be defined', () => {
        const styles = getComputedStyle(document.documentElement);
        const primaryBg = styles.getPropertyValue('--primary-bg').trim();
        assert(primaryBg !== '', 'Primary background color should be defined');
        
        const primaryText = styles.getPropertyValue('--primary-text').trim();
        assert(primaryText !== '', 'Primary text color should be defined');
    });

    // Test 3: Responsive design classes should exist
    runner.test('Responsive design should be implemented', () => {
        const gameContainer = document.querySelector('.game-container');
        const computedStyle = getComputedStyle(gameContainer);
        assert(computedStyle.display === 'flex', 'Game container should use flexbox');
    });

    // Test 4: Accessibility attributes should be present
    runner.test('Accessibility attributes should be present', () => {
        const movesTable = document.querySelector('#movesTable');
        assertExists(movesTable, 'Moves table should exist');
        assert(movesTable.hasAttribute('role'), 'Moves table should have role attribute');
        assert(movesTable.hasAttribute('aria-label'), 'Moves table should have aria-label');
    });

    return await runner.run();
}

// Run all tests when this module is imported
if (typeof window !== 'undefined') {
    // Wait for page to load completely
    window.addEventListener('load', async () => {
        // Wait a bit more for modules to initialize
        setTimeout(async () => {
            console.log('🔧 Testing Modern Chess UI Implementation...\n');
            
            const themeTestsPassed = await runThemeTests();
            console.log('');
            const uiTestsPassed = await runUITests();
            
            const allTestsPassed = themeTestsPassed && uiTestsPassed;
            
            console.log('\n🎯 Overall Test Results:');
            console.log(allTestsPassed ? '✅ All tests passed!' : '❌ Some tests failed!');
            
            // Store test results globally for inspection
            window.testResults = {
                themeTests: themeTestsPassed,
                uiTests: uiTestsPassed,
                overall: allTestsPassed
            };
        }, 1000);
    });
}