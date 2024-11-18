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
              let isFullSentence = ['.', ':', '!', '?'].some(char => sentence.endsWith(char));
              // Count the length of the paragraph so far
              // Add 1 for whitespace between sentences
              charCount += sentence.length + 1;

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
        wrapper.setAttribute("data-accessorease-original-paragraph-content", element.innerHTML);
        // Replace the <p> element with the wrapper
        element.replaceWith(wrapper);
      }
    }

  } else {
    if (element.getAttribute("data-accessorease-original-paragraph-content")) {
      // Retrieve the original element content if available
      restoredParagraph = document.createElement("p");
      // Restore original attributes
      if (element.children[0].hasAttributes()) {
        Array.from(element.children[0].attributes).forEach(attr => restoredParagraph.setAttribute(attr.nodeName, attr.nodeValue));
      }
      restoredParagraph.innerHTML = element.getAttribute("data-accessorease-original-paragraph-content");
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

