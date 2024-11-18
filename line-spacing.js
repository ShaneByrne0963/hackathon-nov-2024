function setLineSpacing(element, data) {

  // Get the style from the element
  const computedStyle = window.getComputedStyle(element);

  // If there's no originalLineHeight set, take the unchanged line height and add it again on a new key
  // This will only happen once per element, and gives us a point of safety to go back to
  if (!element.hasAttribute('data-accessorease-original-lheight')) {
    element.setAttribute('data-accessorease-original-lheight', computedStyle.getPropertyValue('line-height'));
  }

  // If the user sets the input-range to 1, return the line-height to the originalLineHeight
  if (data.lineSpacing === "1") {
    resetStyles(element, ["line-height"], "set-line-spacing");
    if (element.hasAttribute('data-accessorease-original-lheight')) {
      element.removeAttribute('data-accessorease-original-lheight');
    }
  }
  else {

    // If lineHeight is set to "normal" instead of digits and units
    if (element.getAttribute("data-accessorease-original-lheight") === "normal") {
      const styles = {
        "line-height": data.lineSpacing,
      };
      updateStyles(element, styles, "set-line-spacing");
    }
    else {
      let propertyArray = element.getAttribute("data-accessorease-original-lheight").split("");
    
      // Loop over the characters in the style to separate the numbers from the units
      let numbersArray = [];
      let unitsArray = [];
    
      propertyArray.forEach((character) => {
        // Check if it's a number (or decimal point)
        if (Number(character) || (Number(character) === 0)|| character === ".") {
          numbersArray.push(character);
        } else {
          unitsArray.push(character);
        }
      })
    
      let number = Number(numbersArray.join(""));
      let units = unitsArray.join("");
      let finalLineHeight = (data.lineSpacing * number) + units;
  
      const styles = {
        "line-height": finalLineHeight,
      };
      updateStyles(element, styles, "set-line-spacing");
    }
  }
}

