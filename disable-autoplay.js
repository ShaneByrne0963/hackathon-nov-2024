function disableAutoplay(element) {
  console.log('disable Autoplay running');
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

  if (!element.getAttribute('accessorease-ignore')) {
    // Check iframes! allow autoplay?

    if (typeof element.pause === "function") {
      console.log('Trying to pause');

      element.pause();
    }
    element.autoplay = false;
    element.removeAttribute("autoplay");

    console.log(element.attributes);

  }

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
