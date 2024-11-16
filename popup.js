/**
 * Gets a value from localStorage, or sets it if none exists
 * @param {String} key The key to get the value from localStorage
 * @returns {Any} The value retrieved from localStorage
 */
function retrieveData(key) {
  const storageData = localStorage.getItem(key);
  if (storageData) {
    // Changing 'true' and 'false' values from string to boolean
    switch (storageData) {
      case 'true':
        return true;
      case 'false':
        return false;
      default:
        return storageData;
    }
  }
  else {
    let item = document.querySelector(`*[data-key="${key}"]`);
    let value = null;
    if (!item) {
      throw new Error("Key not found!");
    }
    if (item.getAttribute('type') === 'checkbox') {
      value = item.checked;
    }
    else {
      value = item.value;
    }
    localStorage.setItem(key, value);
    return value;
  }
}

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
    if (value) {
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

// Send the preferences to the page when requested
extAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.update) {
    sendData();
  }
});

window.addEventListener('DOMContentLoaded', () => {
  // Retrieve the preferences from the local storage
  extAPI.storage.local.get('accessorEasePreferences', (result) => {
    const keyElements = document.querySelectorAll('*[data-key]');
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
          sendData(key);
        });
      }
      else {
        item.addEventListener('change', () => {
          sendData(key);
        });
      }
    });
  });

  // Update the size of the body
  updateBodySize(500, 16);
});
