// Define preset palettes
const palettes = {
        norm: null, // NORMAL mode (default styling)
        prot: ["#0077B6", "#8E44AD", "#2ECC71", "#F1C40F"], // Protanopia
        deut: ["#1ABC9C", "#9B59B6", "#16A085", "#F4D03F"], // Deuteranopia
        trit: ["#E74C3C", "#F39C12", "#27AE60", "#8E44AD"], // Tritanopia
};

// Store original styles to restore NORMAL mode
let originalStyles = {};

// Initialize the form and load the saved selection
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("palette-form");

    // Save original styles when the page loads
    originalStyles = {
        background: document.body.style.background,
        color: document.body.style.color,
    };

    // Load saved palette from localStorage
    const savedPalette = localStorage.getItem("selectedPalette");
    if (savedPalette) {
        form.elements["palettes"].value = savedPalette;
        applyPalette(savedPalette);
    }

    // Add event listener to save user's selection
    form.addEventListener("change", (event) => {
        const selected = event.target.value;
        if (palettes.hasOwnProperty(selected)) {
            localStorage.setItem("selectedPalette", selected);
            applyPalette(selected);
        }
    });
});

// Function to apply a palette
function applyPalette(element, data) {
    if (paletteKey === "norm") {
        // NORMAL mode: restore original styles
        document.body.style.background = originalStyles.background;
        document.body.style.color = originalStyles.color;
    } else if (palettes[paletteKey]) {
        // Apply custom palette styles
        const colors = palettes[paletteKey];
        document.body.style.background = colors[0];
        document.body.style.color = colors[1];
    }
}