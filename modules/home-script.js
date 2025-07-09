import { ThemeManager } from "./ThemeManager.js";

// Initialize theme manager for the home page
const themeManager = new ThemeManager();

// Theme toggle support
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        themeManager.toggleTheme();
    });
}
