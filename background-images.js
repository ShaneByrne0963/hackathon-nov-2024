// /**
//  * Calls function that replaces the background image with the selected color
//  * @param {element} Element whose bg image will be removed and text colors updated
//  * @param {data} User preferences
//  */
// function updateReplacementColor(element, data) {
//   removeBackgroundImage(element, data);
// }

/**
 * Processes the replacement and reinstatement of background images.
 * Automatically sets a contrasting text color.
 * @param {element} Element whose bg image will be removed and text colors updated
 * @param {data} User preferences
 */
function removeBackgroundImage(element, data) {
  const childElements = element.querySelectorAll("*");

  if (data.removeBg && childElements.length) {

    const style = window.getComputedStyle(element);

    if (hasBackgroundImage(style) || element.getAttribute("data-original-bg")) {
      // Save the original background image URL if it hasn't been saved already
      if (!element.getAttribute("data-original-bg")) {
        element.setAttribute("data-original-bg", style.backgroundImage);
      }

      // Color should be taken from user preferences
      // TODO: Colors should be taken from other preferences if available (check chosen palette)
      // Use color picker and contrast color only if no other palette has been chosen
      //let userBgColor = 'rgba(0,0,0,0)';//data.replacementColor;
      let contrastColor = getMaxContrastColor(findBackgroundColor(element));

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
      //element.style.backgroundColor = userBgColor;
      element.style.backgroundColor = "transparent";
      // Go through each child element and check if it has text
      childElements.forEach((child) => {
        if (child.textContent.trim() !== '') {
          // Save the original text color
          if (!child.getAttribute("data-original-color")) {
            const childStyle = window.getComputedStyle(child);
            child.setAttribute("data-original-color", childStyle.color);
          }
          if (!data.colorContrast && findBackgroundColor(child) === findBackgroundColor(element)) {
            child.style.color = contrastColor;
          }
        }
      });
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
      element.style.backgroundColor = "";
      // element.removeAttribute("data-original-bg");

      // Restore the original text color for each child
      childElements.forEach((child) => {
        if (child.textContent.trim()) {
          originalTextColor = child.getAttribute("data-original-color");
          if (originalTextColor && !data.colorContrast) {
            child.style.color = originalTextColor;
            // child.removeAttribute("data-original-color");
          }
        }
      });
    }
  }
}

// Adapted from https://dev.to/alvaromontoro/building-your-own-color-contrast-checker-4j7o

function getLuminance(r, g, b) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// function hexToRgb(hex) {
//   var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
//   hex = hex.replace(shorthandRegex, function (m, r, g, b) {
//     return r + r + g + g + b + b;
//   });

//   var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//   return result ? [
//     parseInt(result[1], 16),
//     parseInt(result[2], 16),
//     parseInt(result[3], 16)
//   ] : null;
// }

function getMaxContrastColor(hexColor) {
  const [r, g, b] = hexColor.match(/\d+/g).map(Number);; //hexToRgb(hexColor);
  const luminance = getLuminance(r, g, b);

  // Return black for light colors and white for dark colors
  return luminance > 0.5 ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)";
}
