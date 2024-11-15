
/*This script is used to change the cursor to a ruler when ruler tool is selected*/
function ruler(element, data) {
        let checkbox = data.ruler
        if (checkbox) {
                createRuler();
        } else {
                removeRuler();
        }
}

function createRuler() {
        // Remove default cursor
        document.body.style.cursor = "none";

        // Create and add new cursor
        const customCursor = document.createElement("div");
        customCursor.id = "custom-cursor";
        document.body.appendChild(customCursor);

        // Create and add horizontal line
        const horizontalLine = document.createElement("div");
        horizontalLine.id = "horizontal-line";
        document.body.appendChild(horizontalLine);

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
                horizontalLine.style.width = "1500px";
                horizontalLine.style.height = "1px";
                horizontalLine.style.backgroundColor = "black";
                horizontalLine.style.transform = "translate(-50%, -50%)";

                // Place horizontal line just below mouse position
                horizontalLine.style.left = `${x}px`;
                horizontalLine.style.top = `${y + 13}px`;
        });
}

function removeRuler() {
        // Remove cursor and horizontal line
        const customCursor = document.getElementById("custom-cursor");
        const horizontalLine = document.getElementById("horizontal-line");

        customCursor.remove();
        horizontalLine.remove();

        // Restore default cursor
        document.body.style.cursor = "default";
}


