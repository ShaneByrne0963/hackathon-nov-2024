function disableAutoplay(element, data) {

  if (element.tagName === 'VIDEO'
    && !element.getAttribute('accessorease-video-eventlistener')
    && !element.getAttribute('accessorease-ignore')) {
    console.log('Trying to add event listener to ', element.tagName);
    const parentSiblings = Array.from(element.parentNode.parentNode.children);
    const siblings = Array.from(element.parentNode.children);
    let listenerGroup = [];

    const clickHandler = function (event) {
      console.log('Video clicked:', event.target);
      console.log(data.eventListeners.length);
      let groupIndex = NaN;
      const group = data.eventListeners;

      for (let i = 0; i < data.eventListeners.length; i++) {
        if (group[i].includes(element)) {
          console.log('Found group with listeners in index: ', i);
          groupIndex = i;
          break;
        }
      }
      if (!isNaN(groupIndex)) {
        console.log(group[groupIndex]);
        for (let el of group[groupIndex]) {
          el.removeEventListener('click', clickHandler);
          console.log('Event listener removed:', el);
        }
        element.setAttribute('accessorease-ignore', true);
        element.removeAttribute('accessorease-video-eventlistener');
        data.eventListeners.splice(groupIndex, 1);

      } else {
        console.log('No matching group found for the clicked target');
      }

    };

    listenerGroup.push(element);
    listenerGroup.push(element.parentNode);
    element.addEventListener('click', clickHandler);
    element.parentNode.addEventListener('click', clickHandler);

    siblings.forEach(sibling => {
      sibling.addEventListener('click', clickHandler);
      listenerGroup.push(sibling);
    });

    parentSiblings.forEach(pSibling => {
      pSibling.addEventListener('click', clickHandler);
      listenerGroup.push(pSibling);
    });

    element.setAttribute('accessorease-video-eventlistener', true);
    console.log('Event listener set for group:', element.tagName);
    data.eventListeners.push(listenerGroup);
  }

  if (!element.getAttribute('accessorease-ignore')) {
    element.autoplay = false;

    if (element.hasAttribute("autoplay")) {
      element.removeAttribute("autoplay");
    }

    if (typeof element.pause === "function" && !element.paused) {
      element.pause();
    }
  }
}
