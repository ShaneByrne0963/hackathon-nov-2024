/**
 * Finds the closest background color of an element
 * @param {HTMLElement} element The element to check the background color
 * @returns {String} The color of the background in rgb/rgba format
 */
function findBackgroundColor(element) {
  let currentElement = element;
  let backgroundColor = null;

  // Move up the DOM until a background color is found, or the top of the tree is met
  while (!backgroundColor) {
    let style = window.getComputedStyle(currentElement);
    let elementBack = style.getPropertyValue('background-color');

    // If the background exists and is not transparent
    if (elementBack && elementBack !== 'rgba(0, 0, 0, 0)') {
      backgroundColor = elementBack;
      break;
    }
    if (!currentElement.parentElement) {
      backgroundColor = 'rgb(255, 255, 255)';
      break;
    }
    currentElement = currentElement.parentElement;
  }
  return backgroundColor;
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
 * Gets the relative luminence of an RGB color
 * @param {Number} red The red value of the color (0-255)
 * @param {Number} green The green value of the color (0-255)
 * @param {Number} blue The blue value of the color (0-255)
 * @returns {Float} The relative luminence
 */
function getColorLuminence(red, green, blue) {

  const redRange = red / 255.0;
  const greenRange = green / 255.0;
  const blueRange = blue / 255.0;

  const redLum = (redRange <= 0.03928) ? redRange / 12.92 : Math.pow((redRange + 0.055) / 1.055, 2.4);
  const greenLum = (greenRange <= 0.03928) ? greenRange / 12.92 : Math.pow((greenRange + 0.055) / 1.055, 2.4);
  const blueLum = (blueRange <= 0.03928) ? blueRange / 12.92 : Math.pow((blueRange + 0.055) / 1.055, 2.4);

  // For the sRGB colorspace, the relative luminance of a color is defined as: 
  const luminence = 0.2126 * redLum + 0.7152 * greenLum + 0.0722 * blueLum;

  return luminence;
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


/***
 * Fixes text colors if contrast is not high enough
 * @param {HTMLElement} element the element to be targeted
 */
function updateColorContrast(element, data) {
  if (element.innerText) {
    // Get the colors of the text and its background
    const backgroundColorCss = findBackgroundColor(element);
    let backgroundColor = getColorRGBFromStyle(backgroundColorCss);
    const elementStyle = window.getComputedStyle(element);
    const textColorCss = elementStyle.getPropertyValue('color');
    let textColor = getColorRGBFromStyle(textColorCss);

    let backLuminence = getColorLuminence(...getColorParameters(backgroundColor));
    let textLuminence = getColorLuminence(...getColorParameters(textColor));
    let relativeLuminance = getRelativeLuminance(backLuminence, textLuminence);

    if (relativeLuminance < 18) {
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
        let backNewLuminence = getColorLuminence(...getColorParameters(backNewRgb));
        let textNewLuminence = getColorLuminence(...getColorParameters(textNewRgb));
        let newRelativeLuminace = getRelativeLuminance(backNewLuminence, textNewLuminence);

        if (newRelativeLuminace >= 18) {
          goodContrast = true;
          element.setAttribute('accessorease-data-text-color', textColorCss);
          element.setAttribute('accessorease-data-back-color', backgroundColorCss);
          
          // Make sure to include !important tags so they override everything
          let elementStyle = element.getAttribute('style');
          if (elementStyle) {

          }
          else {
            element.setAttribute(
              'style',
              `color: rgb(${getColorParameters(textNewRgb).join()}) !important;
                background-color: rgb(${getColorParameters(backNewRgb).join()}) !important;`
            );
          }

          // console.log('Background RGB: ', backNewRgb);
          // console.log('Text RGB: ', textNewRgb);
          // console.log('Final Contrast: ', `${newRelativeLuminace}:1`);
          // console.log(element);
          // console.log('-------------------------------------------');
        }
      }
    }
  }
}