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
 * @returns {Array} [r, g, b]
 */
function getColorRGBFromStyle(colorStyle) {
  let colorArray = colorStyle.replaceAll(' ', '').replace('a', '').replace('rgb(', '').replace(')', '').split(',').map(number => parseInt(number));

  // Remove the aplha value, if there
  if (colorArray.length > 3) {
    colorArray.pop();
  }
  return colorArray;
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
 * Converts an RGB color value to HSV
 * Source: https://stackoverflow.com/questions/8022885/rgb-to-hsv-color-in-javascript
 * @param {Number} r The red value of the color (0-255)
 * @param {Number} g The green value of the color (0-255)
 * @param {Number} b The blue value of the color (0-255)
 * @returns {Object} { h: hue, s: saturation, v: value }
 */
function rgb2hsv (r, g, b) {
  let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
  rabs = r / 255;
  gabs = g / 255;
  babs = b / 255;
  v = Math.max(rabs, gabs, babs),
  diff = v - Math.min(rabs, gabs, babs);
  diffc = c => (v - c) / 6 / diff + 1 / 2;
  percentRoundFn = num => Math.round(num * 100) / 100;
  if (diff == 0) {
      h = s = 0;
  } else {
      s = diff / v;
      rr = diffc(rabs);
      gg = diffc(gabs);
      bb = diffc(babs);

      if (rabs === v) {
          h = bb - gg;
      } else if (gabs === v) {
          h = (1 / 3) + rr - bb;
      } else if (babs === v) {
          h = (2 / 3) + gg - rr;
      }
      if (h < 0) {
          h += 1;
      }else if (h > 1) {
          h -= 1;
      }
  }
  return {
      h: Math.round(h * 360),
      s: percentRoundFn(s * 100),
      v: percentRoundFn(v * 100)
  };
}


/**
 * Converts a HSV color to RGB
 * Source: https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
 * @param {Number} h The hue value of the color [0-360]
 * @param {Float} s The saturation value of the color [0-100]
 * @param {Float} v The value of the color [0-100]
 * @returns 
 */
function hsv2rgb(h,s,v) {
  // Converting saturation and value to be between 0 and 1
  const saturation = (s < 1) ? s : s / 100.0
  const value = (v < 1) ? v : v / 100.0

  let f= (n,k=(n+h/60)%6) => value - value*saturation*Math.max( Math.min(k,4-k,1), 0);
  return {
    r: Math.round(f(5) * 255),
    g: Math.round(f(3) * 255),
    b: Math.round(f(1) * 255)
  };
}


/***
 * Fixes text colors if contrast is not high enough
 * @param {HTMLElement} element the element to be targeted
 */
function updateColorContrast(element, data) {
  if (element.innerText) {
    // Get the colors of the text and its background
    let backgroundColor = getColorRGBFromStyle(findBackgroundColor(element));
    const elementStyle = window.getComputedStyle(element);
    let textColor = getColorRGBFromStyle(elementStyle.getPropertyValue('color'));

    let backLuminence = getColorLuminence(...backgroundColor);
    let textLuminence = getColorLuminence(...textColor);
    let relativeLuminance = getRelativeLuminance(backLuminence, textLuminence);

    if (relativeLuminance < 3) {
      // Will temporarily leave these in so you guys can test it
      console.log('RGB: ', textColor);
      console.log('HSV: ', rgb2hsv(...textColor));
    }
  }
}