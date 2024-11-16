function disableAutoplay(element, data) {
  //const mediaElements = document.querySelectorAll("audio, video");
  console.log('Trying to disable ' + element);
  // mediaElements.forEach(element => {
    element.autoplay = false; // Programmatically disable autoplay
    element.removeAttribute("autoplay"); // Remove autoplay attribute if it exists
    element.pause(); // Pause any playing media
  // });
}

// Set up observer to detect
// Just do it once
function disableAutoplayOnLoad(element, data) {
  if (data.disableAutoplay) {
    alert("trying to disable autoplay...");

    disableAutoplay();

    // Set up a MutationObserver to handle dynamically added media elements
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE && (node.tagName === "AUDIO" || node.tagName === "VIDEO")) {
            node.autoplay = false;
            node.removeAttribute("autoplay");
            node.pause();
            console.log("Autoplay disabled for dynamically added element:", node);
          }
        });
      });

    });
    observer.observe(document.body, { childList: true, subtree: true });

  }
  else {
    //  observer.disconnect
  }

}

// Initial call
// disableAutoplayOnLoad();