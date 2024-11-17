function hoverStyles(element, data) {
    // constants are true if checkbox is checked, false if not checked
    const hoverHighlight = data.hoverHighlight; 
    
    if (hoverHighlight) {
        mouseTracker("highlight");
        console.log(hoverHighlight);

    } else {
        if (document.body.classList.contains('accessorease-event-listener')) {
            document.body.classList.remove('accessorease-event-listener');
            document.removeEventListener('mousemove', (event) => {
                eventListenerCreator(event, checkedOption, activeArea);
            });
        }
        clearHighlights();
        console.log(hoverHighlight);
    }
}

// Creates an active area that follows the mouse
function mouseTracker(checkedOption) {

    //Check if activeArea already exists
    const oldActiveArea = document.getElementById('accessorease-active-area');
    if (oldActiveArea) {
        return;
    } 

    // Create the active area element
    const activeArea = document.createElement('div');
    activeArea.id = 'accessorease-active-area';
    document.body.appendChild(activeArea);

    //styles for active area
    activeAreaStyles(checkedOption, activeArea);

    // Mousemove event listener
    if (!document.body.classList.contains('accessorease-event-listener')) {
        document.body.classList.add('accessorease-event-listener');
        document.addEventListener('mousemove', (event) => {
            eventListenerCreator(event, checkedOption, activeArea);
        });
    }
}

function eventListenerCreator(event, checkedOption, activeArea) {
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
    });
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
    const activeArea = document.getElementById('accessorease-active-area');
    if (activeArea) {
        activeArea.remove();
    }
    
    const words = document.querySelectorAll('.accessorease-highlight-word');
    words.forEach((word) => {
        word.style.backgroundColor = 'transparent';
    });
}


function activeAreaStyles(checkedOption, activeArea) {
    if (checkedOption === 'highlight') { 
        activeArea.style.position = 'absolute';
        activeArea.style.width = '100px';
        activeArea.style.height = '15px';
        activeArea.style.pointerEvents = 'none';
        activeArea.style.display = 'none';
    }
}
