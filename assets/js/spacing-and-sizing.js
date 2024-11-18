function splitParagraphs(element, data) {

  if (data.breakParagraph) {
    if (element.tagName !== "P") {
      return;
    }

    const adjustedContent = [];
    const maxLength = 300;

    if (element.innerText) {

      const origAttributes = getAllAttributes(element);
      let paragraph = document.createElement("p");
      // Apply the original paragraph attributes to the new paragraph
      if (origAttributes) {
        origAttributes.forEach(attr => paragraph.setAttribute(attr.nodeName, attr.nodeValue));
      }
      let charCount = 0;

      element.childNodes.forEach(node => {

        if (node.nodeType === Node.TEXT_NODE) {
          // For text nodes: split into sentences
          // Only do this if adding this node to the paragraph would exceed the max length
          if (charCount + node.textContent.length >= maxLength) {
            // Regex to split after . : ? !
            const sentences = node.textContent.split(/(?<=[.:?!])\s+/).filter(sentence => sentence.trim() !== "");

            sentences.forEach((sentence, index) => {
              // console.log(sentence.length);
              let isFullSentence = ['.', ':', '!', '?'].some(char => sentence.endsWith(char));
              // Count the length of the paragraph so far
              // Add 1 for whitespace between sentences
              charCount += sentence.length + 1;
              // console.log('char count:' + charCount);

              // Add the node as a new text node with trailing whitespace after full sentences
              paragraph.appendChild(document.createTextNode(`${sentence}${isFullSentence ? " " : ""}`));

              if (charCount >= maxLength && isFullSentence) {
                // Add new paragraph element when max length has been exceeded

                adjustedContent.push(paragraph);
                paragraph = document.createElement("p");
                // Apply the original paragraph attributes to the new paragraph
                if (origAttributes) {
                  origAttributes.forEach(attr => paragraph.setAttribute(attr.nodeName, attr.nodeValue));
                }

                // Reset counter
                charCount = 0;
              }

            });
          } else {
            // Keep short nodes as is but add them to total char count
            paragraph.appendChild(document.createTextNode(node.textContent));
            charCount += node.textContent.length;
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // Keep element nodes as is but add them to total char count
          paragraph.appendChild(node.cloneNode(true));
          charCount += node.innerText.length;
        }
      });

      // Push last paragraph into adjusted content if not empty
      if (paragraph.childNodes.length > 0) {
        adjustedContent.push(paragraph);
      }

      if (adjustedContent.length > 1) {
        // Replace the current p element with a div containing all child p elements
        const wrapper = document.createElement("div");
        adjustedContent.forEach(p => wrapper.appendChild(p));
        // Save the original element content
        wrapper.setAttribute("accessorease-original-paragraph-content", element.innerHTML);
        // Replace the <p> element with the wrapper
        element.replaceWith(wrapper);
      }
    }

  } else {
    if (element.getAttribute("accessorease-original-paragraph-content")) {
      // Retrieve the original element content if available
      restoredParagraph = document.createElement("p");
      // Restore original attributes
      if (element.children[0].hasAttributes()) {
        Array.from(element.children[0].attributes).forEach(attr => restoredParagraph.setAttribute(attr.nodeName, attr.nodeValue));
      }
      restoredParagraph.innerHTML = element.getAttribute("accessorease-original-paragraph-content");
      element.replaceWith(restoredParagraph);
    }
  }

}

function getAllAttributes(element) {
  if (element.hasAttributes()) {
    return Array.from(element.attributes);
  } else {
    return NaN;
  }
}

function setLineSpacing(element, data) {

  // Get the style from the element
  const computedStyle = window.getComputedStyle(element);

  // If there's no originalLineHeight set, take the unchanged line height and add it again on a new key
  // This will only happen once per element, and gives us a point of safety to go back to
  if (!element.hasAttribute('data-accessorease-original-lheight')) {
    element.setAttribute('data-accessorease-original-lheight', computedStyle.getPropertyValue('line-height'));
  }

  // If the user sets the input-range to 1, return the line-height to the originalLineHeight
  if (data.lineSpacing === "1") {
    resetStyles(element, ["line-height"], "set-line-spacing");
    if (element.hasAttribute('data-accessorease-original-lheight')) {
      element.removeAttribute('data-accessorease-original-lheight');
    }
  }
  else {

    // If lineHeight is set to "normal" instead of digits and units
    if (element.getAttribute("data-accessorease-original-lheight") === "normal") {
      const styles = {
        "line-height": data.lineSpacing,
      };
      updateStyles(element, styles, "set-line-spacing");
    }
    else {
      let propertyArray = element.getAttribute("data-accessorease-original-lheight").split("");
    
      // Loop over the characters in the style to separate the numbers from the units
      let numbersArray = [];
      let unitsArray = [];
    
      propertyArray.forEach((character) => {
        // Check if it's a number (or decimal point)
        if (Number(character) || (Number(character) === 0)|| character === ".") {
          numbersArray.push(character);
        } else {
          unitsArray.push(character);
        }
      })
    
      let number = Number(numbersArray.join(""));
      let units = unitsArray.join("");
      let finalLineHeight = (data.lineSpacing * number) + units;
  
      const styles = {
        "line-height": finalLineHeight,
      };
      updateStyles(element, styles, "set-line-spacing");
    }
  }
}

/* This script adjusts the size of all buttons on the page based on user preferences */
function changeButtonSize(element, data) {
  // Retrieve the button size preference from the `data` object
  const selectedSize = data.buttonSize || "default";

  // Apply the new size class based on the preference
  if (selectedSize === "default") {
    if (element.hasAttribute('accessorease-button-size')) {
      // Restore the original size for default
      let styles = ['padding', 'box-sizing'];
      if (!element.hasAttribute('accessorease-min-font-size')) {
        styles.push('font-size');
        if (element.hasAttribute('accessorease-original-size')) {
          element.removeAttribute('accessorease-original-size');
        }
      }
      resetStyles(element, styles, "button-size");
      if (element.hasAttribute('accessorease-original-padding')) {
        element.removeAttribute('accessorease-original-padding');
      }
      // Run the setFontSize function to update the font sizes
      if (element.hasAttribute('accessorease-min-font-size')) {
        return setFontSize;
      }
    }
  }
  else {
    const elementStyle = window.getComputedStyle(element);

    let elementFontSize;
    if (element.hasAttribute('accessorease-original-size')) {
      elementFontSize = element.getAttribute('accessorease-original-size');
    }
    else {
      elementFontSize = parseFloat(elementStyle.getPropertyValue("font-size").replace('px', ''));
      element.setAttribute('accessorease-original-size', elementFontSize);
    }

    let elementPadding;
    if (element.hasAttribute('accessorease-original-padding')) {
      elementPadding = element.getAttribute('accessorease-original-padding');
    }
    else {
      elementPadding = elementStyle.getPropertyValue("font-size").replaceAll('px', '');
      element.setAttribute('accessorease-original-padding', elementPadding);
    }
    // Allow for both the x and y padding
    const parsedPadding = elementPadding.split(' ').map(item => parseFloat(item));

    // Calculate medium and large sizes based on the original size
    const mediumFontSize = elementFontSize * 1.2; // Medium is 20% larger than default
    const mediumPadding = parsedPadding.map(item => `${item * 1.2}px`).join(' ');
    const largeFontSize = elementFontSize * 1.5; // Large is 50% larger than default
    const largePadding = parsedPadding.map(item => `${item * 1.2}px`).join(' ');
    let styles;

    if (selectedSize === "medium") {
      styles = {
        "font-size": `${mediumFontSize}px`,
        "padding": mediumPadding,
        "box-sizing": "content-box"
      };
    } else if (selectedSize === "large") {
      styles = {
        "font-size": `${largeFontSize}px`,
        "padding": largePadding,
        "box-sizing": "content-box"
      };
    }
    updateStyles(element, styles, "button-size");
  }
}
