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
      const styles = {
        "font-size": `${fontSize}px`
      }
      updateStyles(element, styles, "min-font-size");
    }
    else {
      resetStyles(element, ["font-size"], "min-font-size");
      if (element.hasAttribute('accessorease-original-size')) {
        element.removeAttribute('accessorease-original-size');
      }
    }
  } else {
    resetStyles(element, ['font-size'], "min-font-size");
    if (element.hasAttribute('accessorease-original-size')) {
      element.removeAttribute('accessorease-original-size');
    }
  }
}

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
    return forceColorContrast;
  } else {
    return [clearColorContrast, updateColorContrast];
  }
}