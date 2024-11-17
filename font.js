function setFontFamily(element, data) {
  const fontFamily = data.fontFamily;

  let existingStyle = document.querySelector(".accessorease-font-style");

  if (existingStyle) {
    existingStyle.remove();
  }

  if (fontFamily !== "Default") {
    // Add style to body
    const styleGlobal = document.createElement("style");
    styleGlobal.innerHTML = `
           * {
               font-family: ${fontFamily} !important;
               line-height: 1.5 !important;
           }
       `;

    styleGlobal.className = "accessorease-font-style";

    document.head.appendChild(styleGlobal);
  }
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
