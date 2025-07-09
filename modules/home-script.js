// Home page script - only handles theme management
import { ThemeManager } from "./ThemeManager.js";

// Initialize theme manager for the home page
const themeManager = new ThemeManager();

// The ThemeManager automatically sets up the theme toggle button
// No need for additional event listeners as it's handled internally

// Debug current theme
console.log("Current theme on home page:", themeManager.getCurrentTheme());

// Add manual test function
window.testTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    console.log("Current data-theme attribute:", currentTheme);
    const computedBg = getComputedStyle(document.body).backgroundColor;
    console.log("Current body background color:", computedBg);
};

// Export theme manager to window for debugging
window.themeManager = themeManager;
