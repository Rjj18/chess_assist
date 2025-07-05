# Chess Assist - Modern UI Theme System

## Overview

The Chess Assist application now features a modern, responsive UI with comprehensive light/dark mode support. This document outlines the theming system and how to use it.

## Features Implemented

### 🎨 Modern Theme System
- **CSS Custom Properties**: Comprehensive theming using CSS variables for consistent styling
- **Light & Dark Modes**: Two carefully crafted color schemes with proper contrast ratios
- **Smooth Transitions**: All theme changes include elegant animations
- **Accessibility Compliant**: WCAG 2.1 AA standards for color contrast and usability

### 🌙 Light/Dark Mode Toggle
- **Visual Toggle Switch**: Intuitive switch in the header with moon/sun icons
- **Keyboard Accessible**: Full keyboard navigation support (Enter/Space keys)
- **Persistent Storage**: User preference saved in localStorage
- **System Integration**: Respects user's system preference as default
- **ARIA Support**: Screen reader friendly with proper labels

### 📱 Responsive Design
- **Mobile-First**: Optimized for all screen sizes (desktop, tablet, mobile)
- **Flexible Layout**: Components adapt gracefully to different viewports
- **Touch Friendly**: Larger touch targets for mobile devices
- **Progressive Enhancement**: Works without JavaScript

### ♿ Accessibility Features
- **WCAG 2.1 AA Compliant**: Proper color contrast in both themes
- **Screen Reader Support**: ARIA labels and roles throughout
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Clear focus indicators
- **Reduced Motion**: Respects user's motion preferences
- **High Contrast**: Enhanced support for high contrast mode

## Theme System Architecture

### CSS Custom Properties Structure

```css
:root {
    /* Colors */
    --primary-bg: #ffffff;
    --secondary-bg: #f8f9fa;
    --primary-text: #2c3e50;
    --accent-primary: #3498db;
    
    /* Typography */
    --font-family-primary: 'Segoe UI', system-ui, sans-serif;
    --font-size-base: 16px;
    
    /* Spacing */
    --spacing-sm: 8px;
    --spacing-md: 16px;
    
    /* Transitions */
    --transition-fast: 0.15s ease;
}

[data-theme="dark"] {
    --primary-bg: #1a1a1a;
    --secondary-bg: #2d2d2d;
    --primary-text: #e4e6ea;
    /* ... dark theme overrides */
}
```

### ThemeManager Class

The `ThemeManager` class handles all theme-related functionality:

```javascript
// Initialize theme manager
const themeManager = new ThemeManager();

// Public API
themeManager.toggleTheme();           // Toggle between themes
themeManager.setTheme('dark');        // Set specific theme
themeManager.getCurrentTheme();       // Get current theme
```

## Usage Guide

### For Users
1. **Toggle Theme**: Click the moon/sun toggle in the header
2. **Keyboard**: Use Tab to focus the toggle, then press Enter or Space
3. **Persistence**: Your preference is automatically saved

### For Developers

#### Adding New Theme Variables
```css
:root {
    --my-new-color: #3498db;
}

[data-theme="dark"] {
    --my-new-color: #4fa8da;
}
```

#### Using Theme Variables in CSS
```css
.my-component {
    background-color: var(--primary-bg);
    color: var(--primary-text);
    transition: all var(--transition-medium);
}
```

#### Listening for Theme Changes
```javascript
document.addEventListener('themechange', (event) => {
    console.log(`Theme changed to: ${event.detail.theme}`);
    // Update component-specific theme logic
});
```

## Component Styling

### Buttons
- Modern rounded corners with subtle shadows
- Hover effects with elevation changes
- Disabled states with proper contrast
- Focus indicators for accessibility

### Tables
- Alternating row colors for readability
- Sticky headers for long lists
- Hover effects for better interaction feedback
- Proper contrast in both themes

### Layout
- Flexbox-based responsive grid
- Consistent spacing using custom properties
- Smooth animations and transitions
- Mobile-optimized touch targets

## Browser Support

- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+

## Testing

The application includes comprehensive tests for:
- Theme toggle functionality
- Persistence across sessions
- Accessibility compliance
- Responsive design
- DOM attribute updates

Run tests by opening the browser console after page load.

## Future Enhancements

Potential improvements for future versions:
- Additional color themes (blue, green, high contrast)
- Custom theme creation interface
- Advanced accessibility options
- Animation preferences
- Color picker integration

## Troubleshooting

### Theme Not Persisting
- Check if localStorage is enabled in your browser
- Ensure cookies/storage permissions are granted

### Accessibility Issues
- Verify high contrast mode is working
- Test with screen readers
- Check keyboard navigation

### Performance
- CSS custom properties provide efficient theme switching
- Animations respect `prefers-reduced-motion`
- Minimal JavaScript footprint

## Contributing

When contributing to the theme system:
1. Maintain WCAG 2.1 AA contrast ratios
2. Test in both light and dark modes
3. Verify keyboard accessibility
4. Test on multiple screen sizes
5. Update documentation for new features