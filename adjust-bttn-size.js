/* This script adjusts the size of all buttons on the page based on user preferences */
function changeButtonSize(element, data) {
  // Retrieve the button size preference from the `data` object
  const selectedSize = data.buttonSize || "default";

  // Get the computed style of the current button
  const computedStyle = window.getComputedStyle(element);
  const currentFontSize = parseFloat(computedStyle.fontSize); // Current font size in pixels
  const currentPadding = parseFloat(computedStyle.paddingTop); // Assuming equal top/bottom padding

  // Calculate medium and large sizes based on the current size
  const mediumFontSize = currentFontSize * 1.2; // Medium is 20% larger than default
  const mediumPadding = currentPadding * 1.2;
  const largeFontSize = currentFontSize * 1.5; // Large is 50% larger than default
  const largePadding = currentPadding * 1.5;

  // Apply the new size class based on the preference
  if (selectedSize === "medium") {
    const styles = {
      "font-size": `${mediumFontSize}px`,
      "padding": `${mediumPadding}px`
    };
    updateStyles(element, styles, "button-size");
  } else if (selectedSize === "large") {
    const styles = {
      "font-size": `${largeFontSize}px`,
      "padding": `${largePadding}px`
    };
    updateStyles(element, styles, "button-size");
  } else {
    resetStyles(element, ["font-size", "padding"], "button-size");
  }
}
