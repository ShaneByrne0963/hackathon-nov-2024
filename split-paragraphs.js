
function splitParagraphs(element, data) {
  //console.log(element.childNodes);
  //console.log(element.childNodes[0]);
  if (data.breakParagraph) {

    const adjustedContent = [];
    const maxLength = 400;

    if (element.innerText) {
      //console.log(element.innerText)
      let paragraph = document.createElement("p");
      let charCount = 0;
      element.childNodes.forEach(node => {

        if (node.nodeType === Node.TEXT_NODE) {
          // For text nodes, split by sentences
          console.log(node.textContent.length);
          console.log(node.textContent);
          // Only do this for nodes that exceed the max length
          if (charCount + node.textContent.length >= maxLength) {
            // Regex to split after . : ? !
            const sentences = node.textContent.split(/(?<=[.:?!])\s+/).filter(sentence => sentence.trim() !== "");

            sentences.forEach((sentence, index) => {
              console.log(sentence.length);
              // Count the length of the paragraph so far
              // Add 1 for whitespace between sentences
              charCount += sentence.length + 1;
              console.log('char count:' + charCount);

              paragraph.appendChild(document.createTextNode(`${sentence} `));

              // Add the sentence as a new text node with trailing whitespace
              //adjustedContent.push(document.createTextNode(`${sentence} `));
              if (charCount >= maxLength) { // (index < sentences.length - 1) {
                adjustedContent.push(paragraph);
                paragraph = document.createElement("p");

                // Add line breaks after each sentence

                //adjustedContent.push(document.createElement("br"));
                //adjustedContent.push(document.createElement("br"));
                // Reset counter
                charCount = 0;
              }

            });
          } else {
            paragraph.appendChild(document.createTextNode(node.textContent));
            charCount += node.textContent.length;
            // Keep short nodes as is
            // adjustedContent.push(node.cloneNode(true));
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // Keep element nodes as is
          paragraph.appendChild(node.cloneNode(true));
          charCount += node.innerText.length;
          //          adjustedContent.push(node.cloneNode(true));
        }
      });

      // Push last paragraph into adjsuted content if not empty
      if (paragraph.childNodes.length > 0) {
        adjustedContent.push(paragraph);
      }
      // Clear the original element and append the new content

      // If the element is <p>, replace it with a <div> containing the split paragraphs
      if (element.tagName === "P") {
        const wrapper = document.createElement("div");
        adjustedContent.forEach(p => wrapper.appendChild(p));
        element.replaceWith(wrapper); // Replace the <p> element with the wrapper
      } else {

        element.innerHTML = "";
        adjustedContent.forEach(node => element.appendChild(node));

        // element.innerHTML = ""; // Clear the original content
        // adjustedContent.forEach(p => element.appendChild(p));
      }
    }

  }

}

// TODO: maket this language-specific to avoid breaking up dates etc.