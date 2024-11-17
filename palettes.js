// Define preset palettes
const palettes = {
    norm: null, // NORMAL mode (default styling)
    prot: {
        colors: ["#0077B6", "#8E44AD", "#2ECC71", "#F1C40F"],
        contrastThreshold: 3.0  // WCAG AA standard
    },
    deut: {
        colors: ["#1ABC9C", "#9B59B6", "#16A085", "#F4D03F"],
        contrastThreshold: 3.0
    },
    trit: {
        colors: ["#E74C3C", "#F39C12", "#27AE60", "#8E44AD"],
        contrastThreshold: 3.0
    }
};

// Store original styles to restore NORMAL mode
let originalStyles = {};

// Function to save original styles of all elements
function saveOriginalStyles() {
    const allElements = document.querySelectorAll("*");
    originalStyles = {};
    allElements.forEach((el, index) => {
        originalStyles[index] = {
            element: el,
            backgroundColor: el.style.backgroundColor || "",
            color: el.style.color || "",
            borderColor: el.style.borderColor || "",
        };
    });
}

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