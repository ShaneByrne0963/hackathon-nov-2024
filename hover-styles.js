function hoverStyles(element, data) {
    // True if checkbox is checked, false if not checked
    const hoverHighlight = data.hoverHighlight; 
    const hoverMagnifyingGlass = data.hoverMagnifyingGlass;
    
    // Test
    if (hoverHighlight) {
        mouseTracker();
    } 
}

// Follow mouse
function mouseTracker() {
    console.log('Mouse tracker is running');
    // Create the active area element
    const activeArea = document.createElement('div');
    activeArea.id = 'active-area';
    document.body.appendChild(activeArea);
    console.log('Active area', activeArea);

    // Placeholder active area styles
    activeArea.style.position = 'absolute';
    activeArea.style.width = '100px';
    activeArea.style.height = '50px';
    activeArea.style.background = 'rgba(0, 255, 0, 0.2)';
    activeArea.style.border = '1px solid green';
    activeArea.style.pointerEvents = 'none';
    activeArea.style.display = 'none';

    // Mousemove event listener
    document.addEventListener('mousemove', (event) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // Position the active area around the mouse
        const areaSizeWidth = 100;
        const areaSizeHeight = 50;
        activeArea.style.left = `${mouseX - areaSizeWidth / 2}px`;
        activeArea.style.top = `${mouseY - areaSizeHeight / 2}px`;
        activeArea.style.display = 'block'; // Ensure the active area is visible
    });

}