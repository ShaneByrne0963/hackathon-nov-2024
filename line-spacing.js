function setLineSpacing(element, data) {  
  // Get the style from the element
  const computedStyle = window.getComputedStyle(element)
  // console.log(computedStyle)

  // If there's no originalLineHeight set, take the unchanged line height and add it again on a new key
  // This will only happen once per element, and gives us a point of safety to go back to
  if (element.style.originalLineHeight === undefined) {
    console.log("Saving the original line height: " + computedStyle.lineHeight)
    element.style.originalLineHeight = computedStyle.lineHeight
  }

  // If the user sets the input-range to 1, return the line-height to the originalLineHeight
  if (data.lineSpacing === "1") {
    console.log("Going back to the original line height: " + element.style.originalLineHeight)
    element.style.lineHeight = element.style.originalLineHeight
  }

  // TODO: Write something that considers what to do when the lineHeight is set with units (px, %, em, rem, etc)
  if (computedStyle.lineHeight !== "normal") {
    // Split the value into characters in an array - eg ["1", "0", "p", "x"]
    let lineHeightCharArray = computedStyle.lineHeight.split("")
    let lineHeightNumbers = []
    let lineHeightUnits = []

    // Loop over the characters in the array
    for (let i = 0; i < lineHeightCharArray.length; i++) {

      // If they're actually numbers pretending to be strings, add them to the numbers array
      if (Number(lineHeightCharArray[i]) !== NaN) {
        lineHeightNumbers.push(lineHeightCharArray[i])
      } else {
        // If they're letters, add them to the units array.
        lineHeightUnits.push(lineHeightCharArray[i])
      }
    }
  }

  // Connect the numbers array back together as a string, and convert it to a number and multiply it by data.lineSpacing
  let lineHeightNumber = (Number(lineHeightNumbers.join(""))) * data.lineSpacing

  // Set the element's line height to the new number (stringified) with the units tacked on the end.
  element.style.lineHeight = lineHeightNumber.toString() + lineHeightUnits.join("")


}

