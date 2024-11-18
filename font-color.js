function setFontColor(element, data) {
  const fontColor = data.fontColor; // Get selected color

  let existingColorStyle = document.querySelector(".data-accessorease-font-color");

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

    styleGlobal.className = "data-accessorease-font-color";
    document.head.appendChild(styleGlobal);
    return forceColorContrast;
  } else {
    return [clearColorContrast, updateColorContrast];
  }
}