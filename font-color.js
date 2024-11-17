function setFontColor(element, data) {
  const fontColor = data.fontColor; // Get selected color

  let existingColorStyle = document.querySelector(".accessorease-font-color");

  // Remove existing style if it exists
  if (existingColorStyle) {
    existingColorStyle.remove();
  }

  if (fontColor !== "Default") {
    // Create and apply new style
    const styleGlobal = document.createElement("style");
    styleGlobal.innerHTML = `
           * {
               color: ${fontColor} !important;
           }
       `;

    styleGlobal.className = "accessorease-font-color";
    document.head.appendChild(styleGlobal);
  }
}