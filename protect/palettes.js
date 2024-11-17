// Define preset palettes
const palettes = {
    norm: null, // NORMAL mode (default styling)
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
    const paletteKey = data.colorPalette;
    if (paletteKey === "norm") {
        const styles = ["background-color"];
        resetStyles(element, styles, 'color-palette');
    }
    else if (palettes[paletteKey]) {
        const styles = {
            "background-color": palettes[paletteKey][0]
        };
        updateStyles(element, styles, 'color-palette');
    }
}