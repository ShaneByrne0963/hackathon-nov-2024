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
    console.log(data);
    const paletteKey = data.colorPalette;
    console.log(paletteKey);
    const allElements = document.querySelectorAll("*");

    if (paletteKey === "norm") {
        if (element.hasAttribute("accessorease-color-palette")){
            const styles = ["background-color"];
            element.removeAttribute("accessorease-color-palette");
            resetStyles(element, styles);
        }        
    }
    else if (palettes[paletteKey]) {
        const styles = {
            "background-color": palettes[paletteKey][0]
        };
        updateStyles(element, styles, 'fresh-palette');
        element.setAttribute("accessorease-color-palette", true);
        
    }
}