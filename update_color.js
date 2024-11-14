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


/***
 * Fixes text colors if contrast is not high enough
 * @param {HTMLElement} element the element to be targeted
 */
function updateColorContrast(element, data) {
  if (element.innerText) {
    let backgroundColor = findBackgroundColor(element);
    if (backgroundColor !== 'rgb(255, 255, 255)') {
      console.log(element, backgroundColor);
    }
  }
}