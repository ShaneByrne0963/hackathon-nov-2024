// Define preset palettes
const palettes = {
    norm: null, // NORMAL mode (default styling)
    prot: {
        colors: ["#0077B6", "#8E44AD", "#2ECC71", "#F1C40F"],
        contrastThreshold: 3.0 // Protanopia
    },
    deut: {
        colors: ["#1ABC9C", "#9B59B6", "#16A085", "#F4D03F"],
        contrastThreshold: 3.0 // Deuteranopia
    },
    trit: {
        colors: ["#E74C3C", "#F39C12", "#27AE60", "#8E44AD"],
        contrastThreshold: 3.0 // Tritanopia
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

// Helper function to get computed colors
function getComputedColors(element) {
    const styles = window.getComputedStyle(element);
    return {
        background: styles.backgroundColor,
        text: styles.color,
        border: styles.borderColor
    };
}
// Convert color to RGB array
function getRGB(color) {
    const temp = document.createElement('div');
    temp.style.color = color;
    document.body.appendChild(temp);
    const style = window.getComputedStyle(temp);
    const rgb = style.color.match(/\d+/g).map(Number);
    document.body.removeChild(temp);
    return rgb;
}

// Calculate relative luminance for WCAG contrast
function calculateRelativeLuminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio between two colors
function getContrastRatio(color1, color2) {
    const rgb1 = getRGB(color1);
    const rgb2 = getRGB(color2);
    
    const l1 = calculateRelativeLuminance(...rgb1);
    const l2 = calculateRelativeLuminance(...rgb2);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
}

// Enhanced function to detect problematic color combinations
function detectColorIssues(element) {
    const colors = getComputedColors(element);
    const issues = [];

    // Skip transparent backgrounds
    if (colors.background !== 'rgba(0, 0, 0, 0)') {
        // Check text contrast
        const textContrast = getContrastRatio(colors.background, colors.text);
        if (textContrast < 3.0) {
            issues.push('text-contrast');
        }

        // Check border contrast if border exists
        if (colors.border !== 'rgba(0, 0, 0, 0)') {
            const borderContrast = getContrastRatio(colors.background, colors.border);
            if (borderContrast < 3.0) {
                issues.push('border-contrast');
            }
        }
    }

    return issues;
}



// Function to apply a palette
function applyPalette(element, data) {
    const paletteKey = data.colorPalette;

    // Handle NORMAL mode
    if (paletteKey === "norm") {
        const styles = ["background-color", "color", "border-color"];
        resetStyles(element, styles, 'color-palette');
        return
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

//    else if (palettes[paletteKey]) {
//        const styles = {
//            "background-color": palettes[paletteKey][0]
//        };

        updateStyles(element, styles, 'color-palette');
    }
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