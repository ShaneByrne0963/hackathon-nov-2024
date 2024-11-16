function hoverStyles(element, data) {
    // constants are true if checkbox is checked, false if not checked
    const hoverHighlight = data.hoverHighlight; 
    const hoverMagnifyingGlass = data.hoverMagnifyingGlass;
    
    if (hoverHighlight) {
        mouseTracker("highlight");
    } else if (hoverMagnifyingGlass) {
        mouseTracker("magnifyingGlass");
    }
}

// Creates an active area that follows the mouse
function mouseTracker(checkedOption) {
    // Create the active area element
    const activeArea = document.createElement('div');
    activeArea.id = 'active-area';
    document.body.appendChild(activeArea);

    // Placeholder active area styles
    activeArea.style.position = 'absolute';
    activeArea.style.width = '100px';
    checkedOption === 'highlight' ? activeArea.style.height = '20px' : activeArea.style.height = '50px';

    // Placeholder styles for development
    // activeArea.style.background = 'rgba(0, 255, 0, 0.2)';
    // activeArea.style.border = '1px solid green';
    activeArea.style.pointerEvents = 'none';
    activeArea.style.display = 'none';

    // Mousemove event listener
    document.addEventListener('mousemove', (event) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // Position the active area around the mouse
        const areaWidth = 100;
        const areaHeight = checkedOption === 'highlight' ? 20 : 50;
        activeArea.style.left = `${mouseX - areaWidth - 40 / 2}px`;
        activeArea.style.top = `${mouseY - areaHeight / 2}px`;
        activeArea.style.display = 'block';

        // Get bounding box of the active area
        const areaRect = {
            left: mouseX - areaWidth - 40 / 2,
            right: mouseX + areaWidth / 2,
            top: mouseY - areaHeight / 2,
            bottom: mouseY + areaHeight / 2
        };
        
        checkedOption === "highlight" ? highlight(areaRect) : null;
    });
}

/**
 * Function to highlight words that intersect with the active area
 * Only reacts to p elements, targeted in wrapWords function
 */
function highlight(areaRect) {
    const words = document.querySelectorAll('span');
    words.forEach(word => {
        const wordRect = word.getBoundingClientRect();

        // Check if word intersects with the active area
        const isInside =
            wordRect.right >= areaRect.left &&
            wordRect.left <= areaRect.right &&
            wordRect.bottom >= areaRect.top &&
            wordRect.top <= areaRect.bottom;

        if (isInside) {
            word.style.backgroundColor = 'yellow';
        } else {
            word.style.backgroundColor = 'transparent';
        }
    });
}

/**
 * Function that targets all p elements on the page and 
 * divides each word in each element to a span element
 * to allow for highlighting of individual words
 */
function wrapWords(containers) {
    containers.forEach(container => {
        const words = container.textContent.split(' '); // Split text by spaces
        container.innerHTML = ''; // Clear existing text

        words.forEach((word) => {
            const span = document.createElement('span');
            span.textContent = word;
            span.classList.add('accessorease-highlight-word')
            span.style.marginRight = '5px'; // Add space between words
            container.appendChild(span);
        });
    });
}

wrapWords(document.querySelectorAll('p'));
