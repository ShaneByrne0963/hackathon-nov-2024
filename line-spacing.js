function setLineSpacing(element, data) {
  console.log("Function Running!")
  console.log(element.style.lineHeight)
  console.log(data.lineSpacing)

  // Get the style from the element
  const computedStyle = window.getComputedStyle(element)

  // If there's no originalLineHeight set, take the unchanged line height and add it again on a new key
  // This will only happen once per element, and gives us a point of safety to go back to
  if (element.style.originalLineHeight === undefined) {
    element.style.originalLineHeight = computedStyle.lineHeight
  }

  // If the user sets the input-range to 1, return the line-height to the originalLineHeight
  if (data.lineSpacing === "1") {
    element.style.lineHeight = element.style.originalLineHeight
  }

  let propertyArray = element.style.originalLineHeight.split("")

  // Loop over the characters in the style to separate the numbers from the units
  let numbersArray = []
  let unitsArray = []

  propertyArray.forEach((character) => {
    // Check if it's a number (or decimal point)
    if (Number(character) || (Number(character) === 0)|| character === ".") {
      numbersArray.push(character)
    } else {
      unitsArray.push(character)
    }
  })

  let number = Number(numbersArray.join(""))
  let units = unitsArray.join("")

  element.style.lineHeight = (data.lineSpacing * Number(numbersArray.join(""))) + units
  console.log(element.style.lineHeight)

}

