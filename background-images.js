
/**
 * Processes the replacement and reinstatement of background images.
 * Automatically sets a contrasting text color.
 * @param {element} Element whose bg image will be removed and text colors updated
 * @param {data} User preferences
 */
function removeBackgroundImage(element, data) {
  const childElements = element.querySelectorAll("*");

  if (data.removeBg && childElements.length && !isButton(element)) {

    const style = window.getComputedStyle(element);

    if (hasBackgroundImage(style)) {
      // Save the original background image URL if it hasn't been saved already

      const origBgColor = findBackgroundColor(element);

      // For elements with size set by the background image, apply explicit dimensions
      let newStyles = {
        'background-image': 'none',
        'background-size': style.backgroundSize,
        'background-position': style.backgroundPosition,
        'background-repeat': style.backgroundRepeat,
      };

      if (
        style.backgroundSize === "cover" ||
        style.backgroundSize === "contain"
      ) {
        newStyles['width'] = style.width;
        newStyles['height'] = style.height;
      }

      updateStyles(element, newStyles, 'bg-image-updated');
    }

  } else {
    // Restore the original background image if present
    if (element.hasAttribute('accessorease-bg-image-updated')) {
      let stylesUpdate = ['width', 'height', 'background-image', 'background-color', 'background-size', 'background-position', 'background-repeat'];

      if (element.hasAttribute('accessorease-updated-contrast')) {
        stylesUpdate.push('color');
      }
      resetStyles(element, stylesUpdate, 'bg-image-updated');
    }
  }
}

function isButton(element) {

  if (
    (element.hasAttribute('role') && element.getAttribute('role').includes('button')) ||
    (element.hasAttribute('type') && element.getAttribute('type').includes('button'))
  ) {
    return true;
  }
  return false;

}

// Adapted from https://dev.to/alvaromontoro/building-your-own-color-contrast-checker-4j7o
function getLuminance(r, g, b) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getMaxContrastColor(hexColor) {
  const [r, g, b] = hexColor.match(/\d+/g).map(Number);
  const luminance = getLuminance(r, g, b);

  // Return black for light colors and white for dark colors
  return luminance > 0.5 ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)";
}

// Function to check if an element has a background image
function hasBackgroundImage(style) {
  // Return True if a background image is set in the element style AND if it is not none
  return style.backgroundImage && style.backgroundImage !== "none";
}