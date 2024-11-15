
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
        // Remove default cursor
        document.body.style.cursor = "none";

        // Create parent container div
        const parentRulerContainer = document.createElement("div");
        parentRulerContainer.id = "parent-container";
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
        childRulerContainer.id = "child-container";
        parentRulerContainer.appendChild(childRulerContainer);

        // Child container styles
        childRulerContainer.style.position = "relative";
        childRulerContainer.style.top = "0";
        childRulerContainer.style.left = "0";

        // Create and add new cursor
        const customCursor = document.createElement("div");
        customCursor.id = "custom-cursor";
        childRulerContainer.appendChild(customCursor);

        // Create and add horizontal line
        const horizontalLine = document.createElement("div");
        horizontalLine.id = "horizontal-line";
        childRulerContainer.appendChild(horizontalLine);

        // Uppdate position of cursor and horizontal line
        document.addEventListener("mousemove", (event) => {
                const { clientX: x, clientY: y } = event;

                // Place cursor at mouse position
                customCursor.style.left = `${x}px`;
                customCursor.style.top = `${y}px`;

                // Inline-styling for cursor
                customCursor.style.position = "absolute";
                customCursor.style.pointerEvents = "none";
                customCursor.style.width = "3px";
                customCursor.style.height = "15px";
                customCursor.style.backgroundColor = "black";
                customCursor.style.transform = "translate(-50%, -50%) rotate(-20deg)";

                // Inling-styling for horizontal line
                horizontalLine.style.position = "absolute";
                horizontalLine.style.pointerEvents = "none";
                horizontalLine.style.width = "100vw";
                horizontalLine.style.height = "1px";
                horizontalLine.style.backgroundColor = "black";
                horizontalLine.style.transform = "translate(-50%, -50%)";

                // Place horizontal line just below mouse position
                horizontalLine.style.left = `${x}px`;
                horizontalLine.style.top = `${y + 13}px`;
        });

        document.querySelectorAll("a").forEach((link) => {
                link.addEventListener("mouseenter", enterLink);
                link.addEventListener("mouseleave", leaveLink);
        });
}

function removeRuler() {
        // Remove cursor and horizontal line
        const customCursor = document.getElementById("custom-cursor");
        const horizontalLine = document.getElementById("horizontal-line");
        const parentRulerContainer = document.getElementById("parent-container");
        const childRulerContainer = document.getElementById("child-container");

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
        const customCursor = document.getElementById("custom-cursor");
        const horizontalLine = document.getElementById("horizontal-line");

        if (customCursor && horizontalLine) {
                customCursor.style.display = 'none';
                horizontalLine.style.display = 'none';
                document.body.style.cursor = 'auto';
        }
}

// Restores customCursor and horizontalLine when leaving a link
function leaveLink() {
        const customCursor = document.getElementById("custom-cursor");
        const horizontalLine = document.getElementById("horizontal-line");

        if (customCursor && horizontalLine) {
                customCursor.style.display = 'block';
                horizontalLine.style.display = 'block';
                document.body.style.cursor = 'none';
        }
}
