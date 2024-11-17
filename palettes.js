// Define preset palettes
const palettes = {
    norm: null, // NORMAL mode (default styling)
    prot: ["#0077B6", "#8E44AD", "#2ECC71", "#F1C40F"], // Protanopia
    deut: ["#1ABC9C", "#9B59B6", "#16A085", "#F4D03F"], // Deuteranopia
    trit: ["#E74C3C", "#F39C12", "#27AE60", "#8E44AD"], // Tritanopia
};

// Function to apply a palette
function applyPalette(element, data) {
    const paletteKey = data.colorPalette;
    if (paletteKey === "norm") {
        const styles = ["background-color", "color", "border-color"];
        resetStyles(element, styles, 'color-palette');
        return updateColorContrast;
    }
    else if (palettes[paletteKey]) {
        const styles = {
            "background-color": palettes[paletteKey][0],
            "color": palettes[paletteKey][1],
            "border-color": palettes[paletteKey][2]
        };
        updateStyles(element, styles, 'color-palette');
        return forceColorContrast;
    }
}