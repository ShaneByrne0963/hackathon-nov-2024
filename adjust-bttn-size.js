/* This script adjusts the size of all buttons on the page based on user preferences */
function changeButtonSize(element, data) {
  // Retrieve the button size preference from the `data` object
  const selectedSize = data.buttonSize || "default";

  // Apply the new size class based on the preference
  if (selectedSize === "default") {
    if (element.hasAttribute('accessorease-button-size')) {
      // Restore the original size for default
      let styles = ['padding'];
      if (!element.hasAttribute('accessorease-min-font-size')) {
        styles.push('font-size');
        if (element.hasAttribute('accessorease-original-size')) {
          element.removeAttribute('accessorease-original-size');
        }
      }
      resetStyles(element, styles, "button-size");
      if (element.hasAttribute('accessorease-original-padding')) {
        element.removeAttribute('accessorease-original-padding');
      }
      // Run the setFontSize function to update the font sizes
      if (element.hasAttribute('accessorease-min-font-size')) {
        return setFontSize;
      }
    }
  }
  else {
    const elementStyle = window.getComputedStyle(element);

    let elementFontSize;
    if (element.hasAttribute('accessorease-original-size')) {
      elementFontSize = element.getAttribute('accessorease-original-size');
    }
    else {
      elementFontSize = parseFloat(elementStyle.getPropertyValue("font-size").replace('px', ''));
      element.setAttribute('accessorease-original-size', elementFontSize);
    }

    let elementPadding;
    if (element.hasAttribute('accessorease-original-padding')) {
      elementPadding = element.getAttribute('accessorease-original-padding');
    }
    else {
      elementPadding = elementStyle.getPropertyValue("font-size").replaceAll('px', '');
      element.setAttribute('accessorease-original-padding', elementPadding);
    }
    // Allow for both the x and y padding
    const parsedPadding = elementPadding.split(' ').map(item => parseFloat(item));

    // Calculate medium and large sizes based on the original size
    const mediumFontSize = elementFontSize * 1.2; // Medium is 20% larger than default
    const mediumPadding = parsedPadding.map(item => `${item * 1.2}px`).join(' ');
    const largeFontSize = elementFontSize * 1.5; // Large is 50% larger than default
    const largePadding = parsedPadding.map(item => `${item * 1.2}px`).join(' ');
    let styles;

    if (selectedSize === "medium") {
      styles = {
        "font-size": `${mediumFontSize}px`,
        "padding": mediumPadding,
      };
    } else if (selectedSize === "large") {
      styles = {
        "font-size": `${largeFontSize}px`,
        "padding": largePadding,
      };
    }
    updateStyles(element, styles, "button-size");
  }
}
