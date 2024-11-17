/**
 * Finds the closest background color of an element
 * @param {HTMLElement} element The element to check the background color
 * @returns {String} The color of the background in rgb/rgba format
 */
function findBackgroundColor(element) {
  let currentElement = element;
  let colorList = [];

  // Move up the DOM until a background color is found, or the top of the tree is met
  while (true) {
    let style = window.getComputedStyle(currentElement);
    let elementBack = style.getPropertyValue('background-color');

    // If the background exists and is not transparent
    if (elementBack && elementBack !== 'rgba(0, 0, 0, 0)') {
      colorList.unshift(getColorRGBFromStyle(elementBack));
      // Stopping the search if the background is a solid color
      if (!elementBack.includes('a')) {
        break;
      }
    }
    if (!currentElement.parentElement) {
      colorList.unshift(getColorRGBFromStyle('rgb(255, 255, 255)'));
      break;
    }
    currentElement = currentElement.parentElement;
  }
  // Blending the colors together
  let finalValues = {};
  if (colorList.length > 1) {
    const topElement = colorList.shift();
    finalValues = colorList.reduce((prev, current) => blendColors(current, prev), topElement);
  }
  else {
    finalValues = colorList[0];
  }
  return `rgb(${finalValues.r}, ${finalValues.g}, ${finalValues.b})`;
}


/**
 * Extracts the red, green and blue values from a CSS string
 * @param {String} colorStyle A CSS style color "rgb(r, g, b)". Also works with "rgba(r, g, b, a)"
 * @returns {Object} {r: int, g: int, b: int, a?: float}
 */
function getColorRGBFromStyle(colorStyle) {
  let colorArray = colorStyle.replaceAll(' ', '').replace('a', '').replace('rgb(', '').replace(')', '').split(',');

  // Remove the aplha value, if there
  let colorObject = {
    r: parseInt(colorArray[0]),
    g: parseInt(colorArray[1]),
    b: parseInt(colorArray[2]),
  }
  if (colorArray.length > 3) {
    colorObject.a = parseFloat(colorArray[3]);
  }
  return colorObject;
}


/**
 * Gets the relative luminance of an RGB color
 * @param {Number} red The red value of the color (0-255)
 * @param {Number} green The green value of the color (0-255)
 * @param {Number} blue The blue value of the color (0-255)
 * @returns {Float} The relative luminance
 */
function getColorLuminance(red, green, blue) {

  const redRange = red / 255.0;
  const greenRange = green / 255.0;
  const blueRange = blue / 255.0;

  const redLum = (redRange <= 0.03928) ? redRange / 12.92 : Math.pow((redRange + 0.055) / 1.055, 2.4);
  const greenLum = (greenRange <= 0.03928) ? greenRange / 12.92 : Math.pow((greenRange + 0.055) / 1.055, 2.4);
  const blueLum = (blueRange <= 0.03928) ? blueRange / 12.92 : Math.pow((blueRange + 0.055) / 1.055, 2.4);

  // For the sRGB colorspace, the relative luminance of a color is defined as: 
  const luminance = 0.2126 * redLum + 0.7152 * greenLum + 0.0722 * blueLum;

  return luminance;
}


/**
 * Finds the relative luminance of 2 luminance values
 * @param {Float} lum1 Luminance value 1
 * @param {Float} lum2 Luminance value 2
 * @returns 
 */
function getRelativeLuminance(lum1, lum2) {
  return lum1 > lum2 ? (lum1 + 0.05) / (lum2 + 0.05) : (lum2 + 0.05) / (lum1 + 0.05);
}


/**
 * Converts a color object into an array to be easily used as parameters
 * @param {Object} obj The object containing the color values
 * @returns {Array} The values in an array
 */
function getColorParameters(obj, type='rgb') {
  const parameters = type.split('');
  return parameters.map(key => obj[key]);
}


/**
 * Blends two colors together
 * @param {Object} frontColor { r, g, b, a }
 * @param {Object} backColor { r, g, b }
 * @returns {Object} {r, g, b}
 */
function blendColors(frontColor, backColor) {
  return {
    r: frontColor.r + ((backColor.r - frontColor.r) * (1 - frontColor.a)),
    g: frontColor.g + ((backColor.g - frontColor.g) * (1 - frontColor.a)),
    b: frontColor.b + ((backColor.b - frontColor.b) * (1 - frontColor.a))
  };
}


/**
 * Converts an RGB color value to HSL
 * Source: https://gist.github.com/vahidk/05184faf3d92a0aa1b46aeaa93b07786
 * @param {Number} r The red value of the color (0-255)
 * @param {Number} g The green value of the color (0-255)
 * @param {Number} b The blue value of the color (0-255)
 * @returns {Object} { h: hue, s: saturation, l: lightness }
 */
function rgb2hsl(r, g, b) {
  r /= 255.0;
  g /= 255.0;
  b /= 255.0;
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let d = max - min;
  let h;
  if (d === 0) h = 0;
  else if (max === r) h = (((g - b) / d % 6) + 6) % 6;
  else if (max === g) h = (((b - r) / d + 2) + 6) % 6;
  else if (max === b) h = (((r - g) / d + 4) + 6) % 6;
  let l = (min + max) / 2;
  let s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return {
    h: h * 60,
    s: s * 100,
    l: l * 100
  };
}


/**
 * Converts an HSL color to RGB
 * Source: https://gist.github.com/vahidk/05184faf3d92a0aa1b46aeaa93b07786
 * @param {Number} h The hue value of the color [0-360]
 * @param {Float} s The saturation value of the color [0-100]
 * @param {Float} l The lightness value of the color [0-100]
 * @returns { r: int, g: int, b: int }
 */
function hsl2rgb(h, s, l) {
  s /= 100
  l /= 100

  const k = (n) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return {
    r: Math.round(255 * f(0)),
    g: Math.round(255 * f(8)),
    b: Math.round(255 * f(4)),
  }
}


/**
 * Updates an element's inline style attribute, keeping any unchanged styles
 * @param {HTMLElement} element The element to change the styles
 * @param {Object} styles The styles in format {"key": "value"}
 * @param {String} type The type of style change
 */
function updateStyles(element, styles, type) {
  element.setAttribute('accessorease-' + type, true);
  let elementStyle = element.getAttribute('style');
  let editedStyles = [];
  if (element.hasAttribute('accessorease-css')) {
    editedStyles = element.getAttribute('accessorease-css').split(',');
  }

  let extraStyles = '';
  if (elementStyle) {
    let elementArray = elementStyle.split('; ');
    for (let i = 0; i < elementArray.length; i++) {
      let styleData = elementArray[i].split(':');
      let prop = styleData[0];
      let value = styleData[1].replace(';', '').trim();

      if (prop in styles) {
        if (!editedStyles.includes(prop)) {
          element.setAttribute('accessorease-style-' + prop, value);
        }
        elementArray.splice(i, 1);
        i--;
      }
      else {
        // Remove the semicolon to be added later
        elementArray[i] = elementArray[i].replace(';', '');
      }
    }
    if (elementArray.length > 0) {
      extraStyles = elementArray.join('; ') + '; ';
    }
  }
  let newStyles = ``;
  let first = true;
  for (let [key, value] of Object.entries(styles)) {
    if (!editedStyles.includes(key)) {
      editedStyles.push(key);
    }
    if (!first) {
      newStyles += ` `;
    }
    first = false;
    newStyles += `${key}: ${value} !important;`;
  }
  element.setAttribute('accessorease-css', editedStyles.join());
  element.setAttribute('style', extraStyles + newStyles);
}


/**
 * Resets a set of style properties for an element
 * @param {HTMLElement} element The target element
 * @param {Array} styles The list of style properties to be reset
 * @param {String} type The type of style change
 */
function resetStyles(element, styles, type) {
  if (element.hasAttribute('accessorease-' + type)) {
    element.removeAttribute('accessorease-' + type);
    let elementStyle = element.getAttribute('style');
    let extraStyles = '';
    if (elementStyle) {
      let elementArray = elementStyle.split('; ');
      console.log(elementArray);
      for (let i = 0; i < elementArray.length; i++) {
        let prop = elementArray[i].split(':')[0];
  
        if (styles.includes(prop)) {
          elementArray.splice(i, 1);
          i--;
        }
        else {
          // Remove the semicolon to be added later
          elementArray[i] = elementArray[i].replace(';', '');
        }
      }
      if (elementArray.length > 0) {
        extraStyles = elementArray.join('; ');
        if (extraStyles[extraStyles.length - 1] !== ';') {
          extraStyles += ';';
        }
      }
    }
    let newStyles = ``;
    let first = true;
    let editedStyles = [];
    if (element.hasAttribute('accessorease-css')) {
      editedStyles = element.getAttribute('accessorease-css').split(',');
      element.removeAttribute('accessorease-css');
    }
    for (let style of styles) {
      if (editedStyles.includes(style)) {
        editedStyles.splice(editedStyles.indexOf(style), 1);
      }
      if (element.hasAttribute(`accessorease-style-${style}`)) {
        if (!first) {
          newStyles += ` `;
        }
        first = false;
        newStyles += `${style}: ${element.getAttribute(`accessorease-style-${style}`)};`;
      }
    }
    if (editedStyles.length > 0) {
      element.setAttribute('accessorease-css', editedStyles.join());
    }
    element.setAttribute('style', extraStyles + newStyles);
  }
}


// The ratios that have to be met to be considered good contrast
const minRatios = {
  regular: 7,
  large: 4.5,
  graphics: 3
}
// A list of any class name that is used by frameworks for icons
const iconClassNames = [
  'fa-solid',
  'fa-regular',
  'fa-light',
  'fa-thin',
  'fa-brands',
  'material-icons'
]
/***
 * Fixes text colors if contrast is not high enough
 * @param {HTMLElement} element The element to be targeted
 * @param {Object} data The user's preferences
 */
function updateColorContrast(element, data) {
  if (data.colorContrast) {
    if (element.innerText) {
      // Get the colors of the text and its background
      const backgroundColorCss = findBackgroundColor(element);
      let backgroundColor = getColorRGBFromStyle(backgroundColorCss);
      const elementStyle = window.getComputedStyle(element);
      const textColorCss = elementStyle.getPropertyValue('color');
      let textColor = getColorRGBFromStyle(textColorCss);

      // If the text has an alpha value, blend the color with the background color
      if ("a" in textColor && textColor.a < 1) {
        textColor = blendColors(textColor, backgroundColor);
      }

      // Finding the minimum ratio to be required
      let minRatio = minRatios.regular;
      // Icons / Graphics
      const iconClasses = iconClassNames.filter(className => element.classList.contains(className));
      if (element.tagName === 'SVG' || element.tagName === 'CANVAS' || iconClasses.length > 0) {
        minRatio = minRatios.graphics;
      }
      else {
        // Text
        let fontSize = elementStyle.getPropertyValue('font-size');
        let fontWeight = elementStyle.getPropertyValue('font-weight');
        const isBold = (fontWeight === 'bold' || parseInt(fontWeight) >= 700);
        fontSize = parseFloat(fontSize.replace('px', ''));
        
        // Determine if the text is large
        if ((isBold && fontSize >= 18.66) || fontSize >= 24) {
          minRatio = minRatios.large;
        }
      }
  
      let backLuminance = getColorLuminance(...getColorParameters(backgroundColor));
      let textLuminance = getColorLuminance(...getColorParameters(textColor));
      let relativeLuminance = getRelativeLuminance(backLuminance, textLuminance);
  
      if (relativeLuminance < minRatio) {
        let backHsl = rgb2hsl(...getColorParameters(backgroundColor));
        let textHsl = rgb2hsl(...getColorParameters(textColor));
        let goodContrast = false;
  
        // Gradually changing the values of the colors until the contrast is strong enough
        // Text will always be changed first
        while (!goodContrast) {
          if (backHsl.l > 50) {
            if (textHsl.l > 0) {
              textHsl.l--;
            }
            else if (backHsl.l < 100) {
              textHsl.l = 0;
              backHsl.l++;
            }
            else {
              // Should never get to this but just in case
              backHsl.l = 100;
              goodContrast = true;
            }
          }
          else {
            if (textHsl.l < 100) {
              textHsl.l++;
            }
            else if (backHsl.l > 0) {
              textHsl.l = 100;
              backHsl.l--;
            }
            else {
              // Should never get to this but just in case
              backHsl.l = 0;
              goodContrast = true;
            }
          }
          // Check if the contrast is better now
          let backNewRgb = hsl2rgb(...getColorParameters(backHsl, 'hsl'));
          let textNewRgb = hsl2rgb(...getColorParameters(textHsl, 'hsl'));
          let backNewLuminance = getColorLuminance(...getColorParameters(backNewRgb));
          let textNewLuminance = getColorLuminance(...getColorParameters(textNewRgb));
          let newRelativeLuminance = getRelativeLuminance(backNewLuminance, textNewLuminance);
  
          if (newRelativeLuminance >= minRatio) {
            goodContrast = true;

            // Make sure to include !important tags so they override everything
            const newStyles = {
              "color": `rgb(${getColorParameters(textNewRgb).join()})`,
              "background-color": `rgb(${getColorParameters(backNewRgb).join()})`
            }
            updateStyles(element, newStyles, 'updated-contrast');
          }
        }
      }
    }
  }
  else {
    // Setting the original colors back
    resetStyles(element, ['color', 'background-color'], 'updated-contrast');
  }
}