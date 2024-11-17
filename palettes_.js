// Add these functions to your existing palettes.js

// Helper function to get computed colors from an element in the webpage
function getComputedColors(element) {
    const styles = window.getComputedStyle(element);
    return {
        background: styles.backgroundColor,
        text: styles.color,
        border: styles.borderColor
    };
}

// Calculate contrast ratio between two colors
function getContrastRatio(color1, color2) {
    // Helper function to parse RGB values
    function getRGBValues(color) {
        const match = color.match(/\d+/g);
        return match ? match.map(Number) : [0, 0, 0];
    }
    
    // Calculate relative luminance
    function getLuminance(r, g, b) {
        const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    const rgb1 = getRGBValues(color1);
    const rgb2 = getRGBValues(color2);
    
    const l1 = getLuminance(...rgb1);
    const l2 = getLuminance(...rgb2);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
}

// Detect color contrast issues for an element
function detectColorIssues(element) {
    const colors = getComputedColors(element);
    const issues = [];
    const CONTRAST_THRESHOLD = 3.0; // WCAG AA standard for large text

    // Only check elements with non-transparent background
    if (colors.background !== 'rgba(0, 0, 0, 0)' && 
        colors.background !== 'transparent') {
        
        // Check text contrast
        const textContrast = getContrastRatio(colors.background, colors.text);
        if (textContrast < CONTRAST_THRESHOLD) {
            issues.push('text-contrast');
        }

        // Check border contrast if there's a visible border
        if (colors.border !== 'rgba(0, 0, 0, 0)' && 
            colors.border !== 'transparent' &&
            element.style.borderWidth !== '0px') {
            const borderContrast = getContrastRatio(colors.background, colors.border);
            if (borderContrast < CONTRAST_THRESHOLD) {
                issues.push('border-contrast');
            }
        }
    }

    return issues;
}

// Modify your existing applyPalette function
function applyPalette(element, data) {
    const paletteKey = data.colorPalette;
    
    // Handle NORMAL mode
    if (paletteKey === "norm") {
        const styles = ["background-color", "color", "border-color"];
        resetStyles(element, styles, 'color-palette');
        return;
    }

    // Check if we have a valid palette
    if (!palettes[paletteKey]) return;

    // Detect color issues
    const colorIssues = detectColorIssues(element);
    
    // Only proceed if there are issues to fix
    if (colorIssues.length > 0) {
        const styles = {};
        
        if (colorIssues.includes('text-contrast')) {
            styles["background-color"] = palettes[paletteKey][0];
            styles["color"] = palettes[paletteKey][1];
        }
        
        if (colorIssues.includes('border-contrast')) {
            styles["border-color"] = palettes[paletteKey][2];
        }

        updateStyles(element, styles, 'color-palette');
    }
}

// Save original styles of webpage elements
function saveOriginalStyles() {
    originalStyles = {};
    const allElements = document.querySelectorAll("*");
    allElements.forEach((el, index) => {
        const computed = window.getComputedStyle(el);
        originalStyles[index] = {
            element: el,
            backgroundColor: computed.backgroundColor || "",
            color: computed.color || "",
            borderColor: computed.borderColor || ""
        };
    });
}

// Initialize the color detection system
function initializeColorDetection() {
    // Save original styles when the system initializes
    saveOriginalStyles();
    
    // Create MutationObserver to handle dynamically added content
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // ELEMENT_NODE
                        applyPalette(node, {
                            colorPalette: document.body.dataset.currentPalette || 'norm'
                        });
                    }
                });
            }
        });
    });

    // Configure the observer
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}