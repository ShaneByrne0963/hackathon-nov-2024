function setFontFamily(element, data) {
  const fontFamily = data.fontFamily;

  let existingStyle = document.querySelector(".data-accessorease-font-style");

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

    styleGlobal.className = "data-accessorease-font-style";

    document.head.appendChild(styleGlobal);
  }
}

function setFontSize(element, data) {
  const fontSize = data.fontSize;

  if (data.isMinFontSize && fontSize && element.innerText) {

    const elementStyle = window.getComputedStyle(element);

    let elementFontSize;
    if (element.hasAttribute('data-accessorease-original-size')) {
      elementFontSize = element.getAttribute('data-accessorease-original-size');
    }
    else {
      elementFontSize = parseFloat(elementStyle.getPropertyValue("font-size").replace('px', ''));
      element.setAttribute('data-accessorease-original-size', elementFontSize);
    }

    if (elementFontSize < parseFloat(fontSize)) {
      const styles = {
        "font-size": `${fontSize}px`
      }
      updateStyles(element, styles, "min-font-size");
    }
    else {
      resetStyles(element, ["font-size"], "min-font-size");
      if (element.hasAttribute('data-accessorease-original-size')) {
        element.removeAttribute('data-accessorease-original-size');
      }
    }
  } else {
    resetStyles(element, ['font-size'], "min-font-size");
    if (element.hasAttribute('data-accessorease-original-size')) {
      element.removeAttribute('data-accessorease-original-size');
    }
  }
}
