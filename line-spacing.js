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
}