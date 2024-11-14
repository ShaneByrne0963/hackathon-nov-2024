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
      console.log("Element has bad contrast!");
      console.log(element);
    }
  }
}