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
  const fontSize = data.fontSize;

  if (data.isMinFontSize && fontSize && element.innerText) {

    const elementStyle = window.getComputedStyle(element);

    let elementFontSize;
    if (element.hasAttribute('accessorease-original-size')) {
      elementFontSize = element.getAttribute('accessorease-original-size');
    }
    else {
      elementFontSize = parseFloat(elementStyle.getPropertyValue("font-size").replace('px', ''));
      element.setAttribute('accessorease-original-size', elementFontSize);
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
