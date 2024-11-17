function hoverStyles(element, data) {
    // constants are true if checkbox is checked, false if not checked
    const hoverHighlight = data.hoverHighlight; 
    const hoverMagnifyingGlass = data.hoverMagnifyingGlass;
    
    if (hoverHighlight) {
        mouseTracker("highlight");
    } else {
        clearHighlights();
    }
    
    if (hoverMagnifyingGlass) {
        mouseTracker("magnifyingGlass");
    }
}

// Creates an active area that follows the mouse
function mouseTracker(checkedOption) {

    //Check if activeArea already exists
    const oldActiveArea = document.getElementById('active-area');
    if (oldActiveArea) {
        return;
    } 

    // Create the active area element
    const activeArea = document.createElement('div');
    activeArea.id = 'active-area';
    document.body.appendChild(activeArea);

    // Placeholder active area styles
    activeArea.style.position = 'absolute';
    activeArea.style.width = '100px';
    checkedOption === 'highlight' ? activeArea.style.height = '15px' : activeArea.style.height = '50px';

    // Placeholder styles for development
    activeArea.style.background = 'rgba(0, 255, 0, 0.2)';
    activeArea.style.border = '1px solid green';
    activeArea.style.pointerEvents = 'none';
    activeArea.style.display = 'none';

    // Mousemove event listener
    document.addEventListener('mousemove', (event) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // Position the active area around the mouse
        const areaWidth = 100;
        const areaHeight = checkedOption === 'highlight' ? 15 : 50;
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
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach((paragraph) => {
        const paragraphRect = paragraph.getBoundingClientRect();

        const isInside =
            paragraphRect.right >= areaRect.left &&
            paragraphRect.left <= areaRect.right &&
            paragraphRect.bottom >= areaRect.top &&
            paragraphRect.top <= areaRect.bottom;
        
        if (isInside) {
            wrapWords(paragraph);

            const words = paragraph.querySelectorAll('span');
            words.forEach((word) => {
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
    })
}

/**
 * Function that targets all p elements on the page and 
 * divides each word in each element to a span element
 * to allow for highlighting of individual words
 */
function wrapWords(container) {
        const words = container.textContent.split(' '); // Split text by spaces
        container.innerHTML = ''; // Clear existing text

        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.textContent = word;
            span.classList.add('accessorease-highlight-word')
            container.appendChild(span);

            // Add a space after each word except the last one
            if (index < words.length - 1) {
                container.appendChild(document.createTextNode(' '));
            }
        });
}

function clearHighlights() {
    const words = document.querySelectorAll('.accessorease-highlight-word');
    words.forEach((word) => {
        word.style.backgroundColor = 'transparent';
    });
}
