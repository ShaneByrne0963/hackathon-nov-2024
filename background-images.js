function removeBackgroundImage(element, data) {
  console.log("remove bg is ", data.removeBg);

  if (data.removeBg) {
    const style = window.getComputedStyle(element);

    if (hasBackgroundImage(style)) {
      // Save the original background image URL if it hasn't been saved already
      if (!element.getAttribute("data-original-bg")) {
        element.setAttribute("data-original-bg", style.backgroundImage);
      }

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
  } else {
    // Restore the original background image if present
    const originalBg = element.getAttribute("data-original-bg");
    if (originalBg) {
      element.style.backgroundImage = originalBg;
      element.style.backgroundColor = ""; // Clear the background color to show the image
      element.removeAttribute("data-original-bg"); // Optional: Remove the data attribute if not needed for future toggles
    }
  }
}
