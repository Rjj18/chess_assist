// Home page script - handles theme management and navbar interactions
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

// ===== NAVBAR DROPDOWN ENHANCEMENTS =====
// Handle dropdown menu interactions for better mobile experience
document.addEventListener('DOMContentLoaded', () => {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('.nav-link');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        
        // On mobile, toggle dropdown on click instead of hover
        if (dropdownLink) {
            dropdownLink.addEventListener('click', (e) => {
                // Check if we're on mobile (touch device)
                if ('ontouchstart' in window) {
                    e.preventDefault();
                    
                    // Close other dropdowns
                    dropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.classList.remove('active');
                        }
                    });
                    
                    // Toggle current dropdown
                    dropdown.classList.toggle('active');
                }
            });
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
});
