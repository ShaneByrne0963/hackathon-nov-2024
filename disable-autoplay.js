function disableAutoplay(element, data) {
  // console.log('disable-autoplay running ... ');


  if (element.tagName === 'VIDEO' && !data.eventListeners.includes(element)) { // && !element.getAttribute('accessorease-video-eventlistener')) {
    console.log('trying to add event listnener');
    // Only set once!!
    const clickHandler = function (event) {
      const siblings = Array.from(element.parentNode.parentNode.children);
      console.log('Video clicked:', event.target);
      element.setAttribute('accessorease-ignore', true);
      element.removeEventListener('click', clickHandler);
      siblings.forEach(sibling => sibling.removeEventListener('click', clickHandler));
      element.parentElement.removeEventListener('click', clickHandler);

      console.log('event listener removed:', element.attributes);

    };

    const siblings = Array.from(element.parentNode.parentNode.children);

    element.addEventListener('click', clickHandler);
    data.eventListeners.push([]);
    element.parentElement.addEventListener('click', clickHandler);
    siblings.forEach(sibling => sibling.addEventListener('click', clickHandler));
    element.setAttribute('accessorease-video-eventlistener', true);
    console.log('event listener set:', element.attributes);

  }

  if (!element.getAttribute('accessorease-ignore')) {
    element.autoplay = false;
    element.removeAttribute("autoplay");

    if (typeof element.pause === "function" && !element.paused) {
      console.log('Trying to pause');

      element.pause();
    }

  }

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
