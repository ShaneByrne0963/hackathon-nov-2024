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
           }
       `;

    styleGlobal.className = "accessorease-font-style";

    document.head.appendChild(styleGlobal);
  }
}

function setFontSize(element, data) {
  console.clear();
  const fontSize = data.fontSize;

  if (data.isMinFontSize && fontSize) {

    const elementStyle = window.getComputedStyle(element);

    let elementFontSize;
    if (element.hasAttribute('accessorease-original-size')) {
      elementFontSize = element.getAttribute('accessorease-original-size');
    }
    else {
      elementFontSize = parseFloat(elementStyle.getPropertyValue("font-size").replace('px', ''));
      element.getAttribute('accessorease-original-size');
    }

    if (elementFontSize < parseFloat(fontSize)) {
      elementFontSize = fontSize;
    }
    const styles = {
      "font-size": `${elementFontSize}px`
    }
    updateStyles(element, styles, "min-font-size");
  } else {
    const styles = ['font-size'];
    resetStyles(element, styles, "min-font-size");
  }
}
