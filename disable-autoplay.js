function disableAutoplay(element, data) {

  if (element.tagName === 'VIDEO'
    && !element.getAttribute('data-accessorease-video-eventlistener')
    && !element.getAttribute('data-accessorease-ignore')) {
    const parentSiblings = Array.from(element.parentNode.parentNode.children);
    const siblings = Array.from(element.parentNode.children);
    let listenerGroup = [];

    // This function is triggered when the user clicks on the video or an element
    // nearby, such as a play button
    const clickHandler = function (event) {
      let groupIndex = NaN;
      const group = data.eventListeners;

      // Check which group of event listeners this element belongs to
      for (let i = 0; i < data.eventListeners.length; i++) {
        if (group[i].includes(element)) {
          groupIndex = i;
          break;
        }
      }

      // Remove all event listeners from the elements in the group
      // and make sure the main video element from the group is
      // ignored in the future
      if (!isNaN(groupIndex)) {
        for (let el of group[groupIndex]) {
          el.removeEventListener('click', clickHandler);
        }
        element.setAttribute('data-accessorease-ignore', true);
        element.removeAttribute('data-accessorease-video-eventlistener');
        data.eventListeners.splice(groupIndex, 1);

      } else {
        console.log('No matching group found for the clicked target');
      }

    };

    // Set event listeners to a selection of surrounding elements to get buttons and div wrappers
    // Better solution: Check for bounding rectangles overlapping the video
    element.addEventListener('click', clickHandler);
    listenerGroup.push(element);

    if (element.parentNode) {
      element.parentNode.addEventListener('click', clickHandler);
      listenerGroup.push(element.parentNode);
    }

    if (siblings) {
      siblings.forEach(sibling => {
        sibling.addEventListener('click', clickHandler);
        listenerGroup.push(sibling);
      });
    }

    if (parentSiblings) {
      parentSiblings.forEach(pSibling => {
        pSibling.addEventListener('click', clickHandler);
        listenerGroup.push(pSibling);
      });
    }

    element.setAttribute('data-accessorease-video-eventlistener', true);
    // Save all listeners in data to remove them later
    data.eventListeners.push(listenerGroup);
  }

  // Try to pause all video elements the user hasn't interacted with yet
  // and remove the autoplay attribute
  if (!element.getAttribute('data-accessorease-ignore')) {
    element.autoplay = false;

    if (element.hasAttribute("autoplay")) {
      element.removeAttribute("autoplay");
    }

    if (typeof element.pause === "function" && !element.paused) {
      element.pause();
    }
  }
}
