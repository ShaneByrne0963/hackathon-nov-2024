// TODO: To be replaced by an overarching function in script.js going through each page element:

// Select all relevant elements on the page
const elements = document.querySelectorAll(
  "body, header, div, section, article"
);

// Loop through each element and check for a background image
elements.forEach((element) => {
  // Get current element style to preserve it
  const style = window.getComputedStyle(element);

  // TODO: Check first if user has chosen to remove all background images
  // If yes, check for background image:
  if (hasBackgroundImage(style)) {
    // Color should be taken from user preferences
    const userBgColor = "#e1e8d8";
    // Call function to remove background image and set the custom bg color
    removeBackgroundImage(element, style, userBgColor);
  }
});

function removeBackgroundImage(element, style, userBgColor) {
  // Keep background properties that affect layout and appearance
  element.style.backgroundSize = style.backgroundSize;
  element.style.backgroundPosition = style.backgroundPosition;
  element.style.backgroundRepeat = style.backgroundRepeat;

  // For elements with size set by the background image, apply explicit dimensions
  if (style.backgroundSize === "cover" || style.backgroundSize === "contain") {
    element.style.width = style.width;
    element.style.height = style.height;
  }

  element.style.backgroundImage = "none";
  element.style.backgroundColor = userBgColor;
}

// Function to check if an element has a background image
function hasBackgroundImage(style) {
  // Return True if a background image is set in the element style AND if it is not none
  return style.backgroundImage && style.backgroundImage !== "none";
}
