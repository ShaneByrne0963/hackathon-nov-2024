
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

    if (hasBackgroundImage(style)) { //} || element.getAttribute("accessorease-style-background-image")) {
      // Save the original background image URL if it hasn't been saved already
      // if (!element.getAttribute("accessorease-style-background-image")) {
      //   element.setAttribute("accessorease-style-background-image", style.backgroundImage);
      // }

      // Color should be taken from user preferences
      // TODO: Colors should be taken from other preferences if available (check chosen palette)
      // Use color picker and contrast color only if no other palette has been chosen
      const origBgColor = findBackgroundColor(element);
      let contrastColor = getMaxContrastColor(origBgColor);

      // Keep background properties that affect layout and appearance
      // element.style.backgroundSize = style.backgroundSize;
      // element.style.backgroundPosition = style.backgroundPosition;
      // element.style.backgroundRepeat = style.backgroundRepeat;

      // For elements with size set by the background image, apply explicit dimensions
      let stylesUpdate = {
        'background-image': 'none',
        // 'background-color': 'transparent',
        'background-size': style.backgroundSize,
        'background-position': style.backgroundPosition,
        'background-repeat': style.backgroundRepeat,
      };

      let stylesOrig = {
        'background-image': style.backgroundImage,
        // 'background-color': 'transparent',
        'background-size': style.backgroundSize,
        'background-position': style.backgroundPosition,
        'background-repeat': style.backgroundRepeat,
      };


      if (
        style.backgroundSize === "cover" ||
        style.backgroundSize === "contain"
      ) {
        stylesUpdate['width'] = style.width;
        stylesUpdate['height'] = style.height;
      }


      updateStyles(element, stylesUpdate, stylesOrig);
      element.setAttribute('accessorease-bg-image-updated', true);

      data['colorContrast'] = true;
      updateColorContrast(element, data);

      // Go through each child element and check if it has text
      childElements.forEach((child) => {
        if (child.textContent.trim() !== '') {
          // Save the original text color
          // if (!child.getAttribute("accessorease-style-color")) {
          //   const childStyle = window.getComputedStyle(child);
          //   child.setAttribute("accessorease-style-color", childStyle.color);
          // }

          // data['colorContrast'] = true;
          if (isButton(child) || findBackgroundColor(child) === origBgColor) {
            //   // child.style.color = contrastColor;
            // child.setAttribute('accessorease-font-color-updated', true);
            updateColorContrast(child, data);

            //   updateStyles(child, { 'color': contrastColor });
          }
        }
      });
    }


  } else {
    // Restore the original background image if present
    // const originalBg = element.getAttribute("accessorease-style-background-image");
    if (element.hasAttribute('accessorease-bg-image-updated')) {
      let stylesUpdate = ['width', 'height', 'background-image', 'background-color', 'background-size', 'background-position', 'background-repeat'];

      if (element.hasAttribute('accessorease-updated-contrast')) {
        stylesUpdate.push('color');
      }
      resetStyles(element, stylesUpdate);

      // element.style.backgroundImage = originalBg;
      // element.style.backgroundColor = "";

      // Restore the original text color for each child
      childElements.forEach((child) => {
        if (child.hasAttribute('accessorease-updated-contrast')) {
          // originalTextColor = child.getAttribute("accessorease-style-color");
          //    if (!data.colorContrast) {
          resetStyles(child, ['color', 'background-color']);

          // child.style.color = originalTextColor;
          //    }
        }
      });
    }
  }
}


function isButton(element) {
  //let isButton = false;

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
  const [r, g, b] = hexColor.match(/\d+/g).map(Number);; //hexToRgb(hexColor);
  const luminance = getLuminance(r, g, b);

  // Return black for light colors and white for dark colors
  return luminance > 0.5 ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)";
}

// Function to check if an element has a background image
function hasBackgroundImage(style) {
  // Return True if a background image is set in the element style AND if it is not none
  return style.backgroundImage && style.backgroundImage !== "none";
}