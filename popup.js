const extAPI = typeof browser !== "undefined" ? browser : chrome;
/**
 * Submits data from the popup tab to the main page
 */
function sendData(preference=null) {
  // Get the data saved from the user's preferences to be sent to the page
  let data = {};
  document.querySelectorAll('*[data-key]').forEach(element => {
    const key = element.getAttribute('data-key');
    const elType = element.getAttribute('type');
    let value = null;
    if (elType === 'checkbox') {
      value = element.checked;
    }
    else if (elType === 'radio') {
      if (element.checked) {
        value = element.value;
      }
    }
    else {
      value = element.value;
    }
    if (value !== null) {
      data[key] = value;
    }
  });
  let messageData = {
    action: 'update'
  }
  if (preference) {
    messageData.preference = preference;
  }
  extAPI.storage.local.set({ accessorEasePreferences: data }, () => {
    // Send a message to the page
    extAPI.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      extAPI.tabs.sendMessage(tabs[0].id, messageData);
    });
  })
}

/**
 * Sets the size of the body to either the width of the screen minus padding, or maxWidth
 * @param {Number} maxWidth the maximum width of the popup in pixels
 * @param {Number} padding the amount of pixels between the popup and the edge of the screen
 */
function updateBodySize(maxWidth, padding) {
  document.querySelector("body").style.width = `${Math.min(
    screen.width - padding * 2,
    maxWidth
  )}px`;
}

/**
 * Disabled a target input element, 
 * @param {HTMLElement} item The item that can disable an element
 */
function checkDisabled(item) {
  if (item.hasAttribute('data-enables')) {
    document.querySelector(item.getAttribute('data-enables')).disabled = !item.checked;
  }
  if (item.hasAttribute('data-disables')) {
    document.querySelector(item.getAttribute('data-disables')).disabled = item.checked;
  }
}

/**
 * Enables/Disables inputs if the extension switch is turned on or not
 */
function updateExtensionController() {
  if (document.querySelector('#enable-extension').checked) {
    document.querySelectorAll('input:not(#enable-extension), select').forEach(element => element.disabled = false);
    // Enabling/Disabling inputs that depend on checkboxes being checked
    document.querySelectorAll('[data-enables]').forEach((item) => {
      document.querySelector(item.getAttribute('data-enables')).disabled = !item.checked;
    });
    document.querySelectorAll('[data-disables]').forEach((item) => {
      document.querySelector(item.getAttribute('data-disables')).disabled = item.checked;
    });
  }
  else {
    document.querySelectorAll('input:not(#enable-extension), select').forEach(element => element.disabled = true);
  }
}

// Send the preferences to the page when requested
extAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.update) {
    sendData();
  }
});

window.addEventListener('DOMContentLoaded', () => {
  // Retrieve the preferences from the local storage
  extAPI.storage.local.get('accessorEasePreferences', (result) => {
    const keyElements = document.querySelectorAll('[data-key]');
    const data = result.accessorEasePreferences || [...keyElements].reduce((dataObj, element) => {
      const key = element.getAttribute('data-key');
      let value;
      let elType = element.getAttribute('type');
      if (elType === 'checkbox') {
        value = element.checked;
      }
      else if (elType === 'radio') {
        if (element.checked) {
          value = element.value;
        }
      }
      else {
        value = element.value; 
      }
      dataObj[key] = value;
      return dataObj;
    }, {});

    // Add sendData triggers to each element that has the 'data-key' attribute
    keyElements.forEach((item) => {
  
      // Set the input value if it exists in the localStorage
      const key = item.getAttribute('data-key');
      const elType = item.getAttribute('type');
      const inputValue = data[key];
      if (typeof inputValue === "boolean") {
        item.checked = inputValue;
      }
      else if (elType === 'radio') {
        item.checked = (item.value === inputValue);
      }
      else {
        item.value = inputValue;
      }
  
      if (item.tagName === 'BUTTON' || elType === 'radio') {
        item.addEventListener('click', () => {
          checkDisabled(item);
          sendData(key);
        });
      }
      else if (elType === 'range') {
        item.addEventListener('input', () => {
          sendData(key);
        });
      }
      else {
        item.addEventListener('change', () => {
          checkDisabled(item);
          sendData(key);
        });
      }
    });

    // Allowing inputs to update an element's inner text with it's value, if specified
    document.querySelectorAll('[data-updates]').forEach(element => {
      element.addEventListener('input', () => document.querySelector(element.getAttribute('data-updates')).innerText = element.value);
    });

    // Enable/Disable all elements depending on the state of the extension control
    document.querySelector('#enable-extension').addEventListener('change', updateExtensionController);
    updateExtensionController();
  });

  // Update the size of the body
  updateBodySize(500, 16);
});
