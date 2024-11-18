//global variable to support removeEventListener
let eventListenerWrapper;

function hoverStyles(element, data) {
    // constants are true if checkbox is checked, false if not checked
    const hoverHighlight = data.hoverHighlight; 
    
    if (hoverHighlight) {
        mouseTracker("highlight");

    } else {
        if (document.body.classList.contains('accessorease-event-listener')) {
            document.body.classList.remove('accessorease-event-listener');
            document.removeEventListener('mousemove', eventListenerWrapper);
        }
        clearHighlights();
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
        eventListenerWrapper = createEventListenerWrapper(checkedOption, activeArea);
        document.addEventListener('mousemove', eventListenerWrapper);
    }
}

function createEventListenerWrapper(checkedOption, activeArea) {
    return function(event) {
        eventListenerCreator(event, checkedOption, activeArea);
    };
}

function eventListenerCreator(event, checkedOption, activeArea) {
            const mouseX = event.clientX;
            const mouseY = event.clientY;
    
            // Position the active area around the mouse
            const areaWidth = 100;
            const areaHeight = checkedOption === 'highlight' ? 15 : 50;
            activeArea.style.left = `${mouseX - areaWidth - 100 / 2}px`;
            activeArea.style.top = `${mouseY - areaHeight / 2}px`;
            activeArea.style.display = 'block';
    
            // Get bounding box of the active area
            const areaRect = {
                left: mouseX - areaWidth - 100 / 2,
                right: mouseX + areaWidth / 2,
                top: mouseY - areaHeight / 2,
                bottom: mouseY + areaHeight / 2
            };
            
            checkedOption ? highlight(areaRect) : null; 
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
        } else { 
            const words = paragraph.querySelectorAll('span');
            words.forEach((word) => {
                word.style.backgroundColor = 'transparent';
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
        const words = container.innerText.split(' '); // Split text by spaces
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


/*This script is used to change the cursor to a ruler when ruler tool is selected*/
function ruler(element, data) {
  let checkbox = data.ruler;
  if (checkbox) {
          createRuler();
  } else {
          removeRuler();
  }
}

function createRuler() {
  const oldParentContainer = document.getElementById("accessorease-parent-container");
  if (oldParentContainer) {
          return;
  }

  // Remove default cursor
  document.body.style.cursor = "none";

  // Create parent container div
  const parentRulerContainer = document.createElement("div");
  parentRulerContainer.id = "accessorease-parent-container";
  document.body.appendChild(parentRulerContainer);

  // Parent container styles
  parentRulerContainer.style.position = "fixed";
  parentRulerContainer.style.width = "100vw";
  parentRulerContainer.style.height = "100vh";
  parentRulerContainer.style.pointerEvents = "none";
  parentRulerContainer.style.zIndex = "9999";
  parentRulerContainer.style.visibility = "invisible";
  parentRulerContainer.style.top = "0";
  parentRulerContainer.style.left = "0";
  
  // Create child container div
  const childRulerContainer = document.createElement("div");
  childRulerContainer.id = "accessorease-child-container";
  parentRulerContainer.appendChild(childRulerContainer);

  // Child container styles
  childRulerContainer.style.position = "relative";
  childRulerContainer.style.top = "0";
  childRulerContainer.style.left = "0";
  
  // Create and add new cursor
  const customCursor = document.createElement("div");
  customCursor.id = "accessorease-ruler";
  childRulerContainer.appendChild(customCursor);

  // Inline-styling for cursor
  customCursor.style.position = "absolute";
  customCursor.style.pointerEvents = "none";
  customCursor.style.width = "3px";
  customCursor.style.height = "15px";
  customCursor.style.backgroundColor = "black";
  customCursor.style.transform = "translate(-50%, -50%) rotate(-20deg)";
  
  // Create and add horizontal line
  const horizontalLine = document.createElement("div");
  horizontalLine.id = "accessorease-horizontal-line";
  childRulerContainer.appendChild(horizontalLine);

  // Inling-styling for horizontal line
  horizontalLine.style.position = "absolute";
  horizontalLine.style.pointerEvents = "none";
  horizontalLine.style.width = "180vw";
  horizontalLine.style.height = "1px";
  horizontalLine.style.backgroundColor = "black";
  horizontalLine.style.transform = "translate(-50%, -50%)";

  // Uppdate position of cursor and horizontal line
  document.addEventListener("mousemove", (event) => {
          const { clientX: x, clientY: y } = event;

          // Place cursor at mouse position
          customCursor.style.left = `${x}px`;
          customCursor.style.top = `${y}px`;  

          // Place horizontal line just below mouse position
          horizontalLine.style.left = '50vh';
          horizontalLine.style.top = `${y + 13}px`;
  });

  document.querySelectorAll("a").forEach((link) => {
          link.addEventListener("mouseenter", enterLink);
          link.addEventListener("mouseleave", leaveLink);
  });
}

function removeRuler() {
  // Remove cursor and horizontal line
  const customCursor = document.getElementById("accessorease-ruler");
  const horizontalLine = document.getElementById("accessorease-horizontal-line");
  const parentRulerContainer = document.getElementById("accessorease-parent-container");
  const childRulerContainer = document.getElementById("accessorease-child-container");

  // Remove EventListeners
  document.querySelectorAll("a").forEach((link) => {
          link.removeEventListener("mouseenter", enterLink);
          link.removeEventListener("mouseleave", leaveLink);
  });

  customCursor ? customCursor.remove() : null;
  horizontalLine ? horizontalLine.remove() : null;
  parentRulerContainer ? parentRulerContainer.remove() : null;
  childRulerContainer ? childRulerContainer.remove() : null

  // Restore default cursor
  document.body.style.cursor = "auto";
  document.body.style.pointerEvents = "auto";
}

// Removes customCursor and horizontalLine when hovering over a link
function enterLink() {
  const customCursor = document.getElementById("accessorease-ruler");
  const horizontalLine = document.getElementById("accessorease-horizontal-line");

  if (customCursor && horizontalLine) {
          customCursor.style.display = 'none';
          horizontalLine.style.display = 'none';
          document.body.style.cursor = 'auto';
  }
}

// Restores customCursor and horizontalLine when leaving a link
function leaveLink() {
  const customCursor = document.getElementById("accessorease-ruler");
  const horizontalLine = document.getElementById("accessorease-horizontal-line");

  if (customCursor && horizontalLine) {
          customCursor.style.display = 'block';
          horizontalLine.style.display = 'block';
          document.body.style.cursor = 'none';
  }
}
