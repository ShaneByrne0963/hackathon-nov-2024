
function removeBackgroundImage(element) {
  const style = window.getComputedStyle(element);

  if (hasBackgroundImage(style)) {
    // Color should be taken from user preferences

    const userBgColor = "#e1e8d8";
    // Keep background properties that affect layout and appearance
    element.style.backgroundSize = style.backgroundSize;
    element.style.backgroundPosition = style.backgroundPosition;
    element.style.backgroundRepeat = style.backgroundRepeat;

    // For elements with size set by the background image, apply explicit dimensions
    if (
      style.backgroundSize === "cover" ||
      style.backgroundSize === "contain"
    ) {
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
}
