function disableAutoplay(element, data) {

  if (element.tagName === 'VIDEO' && !element.getAttribute('accessorease-video-eventlistener')) {
    console.log('Trying to add event listener to ', element.tagName);
    const parentSiblings = Array.from(element.parentNode.parentNode.children);
    const siblings = Array.from(element.parentNode.children);
    const boundClickHandler = clickHandler.bind(null, data, element);
    let listenerGroup = [];


    function clickHandler(data, element, event) {
      console.log('Video clicked:', event.target);
      console.log(data.eventListeners.length);
      let groupIndex = NaN;
      const group = data.eventListeners;

      for (let i = 0; i < data.eventListeners.length; i++) {
        console.log('looking for matches!!', i, group);

        if (group[i].includes(event.target)) {
          console.log('Clicked!!', i);
          groupIndex = i;
          break;
        }
      }
      if (!isNaN(groupIndex)) {
        console.log(group[groupIndex]);
        for (let el of group[groupIndex]) {
          el.removeEventListener('click', boundClickHandler);
          console.log('event listener removed:', el);
        }
        element.setAttribute('accessorease-ignore', true);
        data.eventListeners.splice(groupIndex, 1);
        console.log("Current data: ", data);
        console.log("Current data: ", data.eventListeners);

      } else {
        console.log('No matching group found for the clicked target');
      }

    };

    listenerGroup.push(element);
    listenerGroup.push(element.parentNode);
    element.addEventListener('click', boundClickHandler);
    element.parentNode.addEventListener('click', boundClickHandler);

    siblings.forEach(sibling => {
      sibling.addEventListener('click', boundClickHandler);
      listenerGroup.push(sibling);
    });

    parentSiblings.forEach(sibling => {
      sibling.addEventListener('click', boundClickHandler);
      listenerGroup.push(sibling);
    });

    element.setAttribute('accessorease-video-eventlistener', true);
    console.log('Event listener set for group:', element.tagName);
    data.eventListeners.push(listenerGroup);
  }

  if (!element.getAttribute('accessorease-ignore')) {
    element.autoplay = false;
    element.removeAttribute("autoplay");

    if (typeof element.pause === "function" && !element.paused) {
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
