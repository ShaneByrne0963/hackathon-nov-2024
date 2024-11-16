function setFontFamily(element, data) {
  const fontFamily = data.fontFamily;
  // Add style to body
  const styleGlobal = document.createElement("style");
  styleGlobal.innerHTML = `
         * {
             font-family: ${fontFamily} !important;
             line-height: 1.5 !important;
         }
     `;
  document.head.appendChild(styleGlobal);
  console.log(fontFamily);
}

function setFontSize(element, data) {
  const fontSize = data.fontSize;
  // Add style to body
  const styleGlobal = document.createElement("style");
  styleGlobal.innerHTML = `
         * {

             font-size: ${fontSize}px !important;
             line-height: 1.5 !important;
         }
     `;
  document.head.appendChild(styleGlobal);
  console.log(fontSize);
}
