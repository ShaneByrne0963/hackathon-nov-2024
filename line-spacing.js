function setLineSpacing(element, data) {
  console.log("lineHeight before: " + element.style.lineHeight)
   element.style.lineHeight = data.lineSpacing
   console.log("lineHeight after: " + element.style.lineHeight)
}