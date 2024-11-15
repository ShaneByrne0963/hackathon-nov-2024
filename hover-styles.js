function hoverStyles(element, data) {

    const hoverHighlight = data.hoverHighlight; 
    const hoverMagnifyingGlass = data.hoverMagnifyingGlass;
    
    if (hoverHighlight) {
        document.addEventListener("mouseover", (event) => {
            event.target.style.color = "red";
        });
    } 
}