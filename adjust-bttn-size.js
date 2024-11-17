/* This script adjusts the size of all buttons on the page based on user preferences */
function changeButtonSize(element, data) {
  // Retrieve the button size preference from the `data` object
  const selectedSize = data.buttonSize || "default";

  // Check if the original size is already stored, if not, store it
  if (!element.dataset.originalFontSize || !element.dataset.originalPadding) {
    const computedStyle = window.getComputedStyle(element);
    element.dataset.originalFontSize = parseFloat(computedStyle.fontSize); // Store original font size
    element.dataset.originalPadding = parseFloat(computedStyle.paddingTop); // Store original padding
  }

  // Retrieve the original size from the data attributes
  const originalFontSize = parseFloat(element.dataset.originalFontSize);
  const originalPadding = parseFloat(element.dataset.originalPadding);

  // Calculate medium and large sizes based on the original size
  const mediumFontSize = originalFontSize * 1.2; // Medium is 20% larger than default
  const mediumPadding = originalPadding * 1.2;
  const largeFontSize = originalFontSize * 1.5; // Large is 50% larger than default
  const largePadding = originalPadding * 1.5;

  // Apply the new size class based on the preference
  if (selectedSize === "medium") {
    const styles = {
      "font-size": `${mediumFontSize}px`,
      "padding": `${mediumPadding}px`,
    };
    updateStyles(element, styles, "button-size");
  } else if (selectedSize === "large") {
    const styles = {
      "font-size": `${largeFontSize}px`,
      "padding": `${largePadding}px`,
    };
    updateStyles(element, styles, "button-size");
  } else {
    // Restore the original size for default
    const styles = {
      "font-size": `${originalFontSize}px`,
      "padding": `${originalPadding}px`,
    };
    updateStyles(element, styles, "button-size");
  }
}
