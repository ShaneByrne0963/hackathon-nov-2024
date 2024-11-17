function disableAutoplay(element, data) {
  //const mediaElements = document.querySelectorAll("audio, video");
  if (element.tagName === 'VIDEO') { // && !element.getAttribute('accessorease-video-eventlistener')) {
    console.log('trying to add event listnener');
  // Only set once!!
    const clickHandler = function (event) {
      console.log('Video clicked:', event.target);
      element.setAttribute('accessorease-ignore', true);
      element.removeEventListener('click', clickHandler);
      console.log('event listener removed:', element.attributes);

    };
  
    element.addEventListener('click', clickHandler);
    element.setAttribute('accessorease-video-eventlistener', true);
    console.log('event listener set:', element.attributes);

  }
  
  // mediaElements.forEach(element => {
    if (!element.getAttribute('accessorease-ignore')) {
      // Check iframes! allow autoplay?
  
      if (typeof element.pause === "function") {
        console.log('Trying to pause');
  
        element.pause();
      }
      element.autoplay = false;
      element.removeAttribute("autoplay");
  
      console.log(element.attributes);
  
      //element.setAttribute('accessorease-autoplay-disabled', true);
    }
    // });

  //console.log('Trying to disable ' + element.tagName);
  if (element.tagName === 'IFRAME') {
    try {
      const iframeDocument = element.contentDocument || element.contentWindow.document;
      const videos = iframeDocument.querySelectorAll("video");
      videos.forEach((video) => video.pause());
    } catch (error) {
      console.error("Cannot access iframe content:", error);
    }
  
    return;
  }

  
}

// Add event listener to process user clicks on videos
// If clicked, set accessorease-ignore to true


















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
            if (typeof node.pause === "function") {
              node.pause();
            }
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