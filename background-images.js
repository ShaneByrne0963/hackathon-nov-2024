
/**
 * Processes the replacement and reinstatement of background images.
 * @param {element} Element whose bg image will be removed and text colors updated
 * @param {data} User preferences
 */
function removeBackgroundImage(element, data) {
  const childElements = element.querySelectorAll("*");

  if (data.removeBg && childElements.length && !isButton(element)) {

    const style = window.getComputedStyle(element);

    if (hasBackgroundImage(style)) {
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
      return forceColorContrast;
    }

  } else {
    // Restore the original background image if present
  
      let stylesUpdate = ['width', 'height', 'background-image', 'background-color', 'background-size', 'background-position', 'background-repeat'];

      resetStyles(element, stylesUpdate, 'bg-image-updated');
    
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

// Function to check if an element has a background image
function hasBackgroundImage(style) {
  // Return True if a background image is set in the element style AND if it is not none
  return style.backgroundImage && style.backgroundImage !== "none";
}