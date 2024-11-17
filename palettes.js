// Define preset palettes
const palettes = {
    norm: [], // NORMAL mode (default styling)
    prot: ["#0077B6", "#8E44AD", "#2ECC71", "#F1C40F"], // Protanopia
    deut: ["#1ABC9C", "#9B59B6", "#16A085", "#F4D03F"], // Deuteranopia
    trit: ["#E74C3C", "#F39C12", "#27AE60", "#8E44AD"], // Tritanopia
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

// Function to apply a palette
function applyPalette(element, data) {
    console.log(data);
    const paletteKey = data.colorPalette;
    console.log(paletteKey);
    const allElements = document.querySelectorAll("*");

    if (paletteKey === "norm") {
        // NORMAL mode: restore original styles
        for (const key in originalStyles) {
            const { element, backgroundColor, color, borderColor } = originalStyles[key];
            element.style.backgroundColor = backgroundColor;
            element.style.color = color;
            element.style.borderColor = borderColor;
        }
    } else if (palettes[paletteKey]) {
        // Apply custom palette
        const colors = palettes[paletteKey];
        allElements.forEach((el, index) => {
            el.style.backgroundColor = colors[index % colors.length]; // Cycle through colors
            el.style.color = colors[(index + 1) % colors.length];
            el.style.borderColor = colors[(index + 2) % colors.length];
        });
    }
}

// Listen for messages from the popup script
// chrome.runtime.onMessage.addListener((message) => {
//     if (message.action === "applyPalette") {
//         const { palette } = message;
//         if (!Object.keys(originalStyles).length) {
//             saveOriginalStyles();
//         }
//         applyPalette(palette);
//     }
// });