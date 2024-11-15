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
      case "true":
        return true;
      case "false":
        return false;
      default:
        return storageData;
    }
  } else {
    let item = document.querySelector(`*[data-key="${key}"]`);
    let value = null;
    if (!item) {
      throw new Error("Key not found!");
    }
    if (item.getAttribute("type") === "checkbox") {
      value = item.checked;
    } else {
      value = item.value;
    }
    localStorage.setItem(key, value);
    return value;
  }
}

/**
 * Submits data from the popup tab to the main page
 */
function sendData() {
  let data = {};

  // Get the data saved from the user's preferences to be sent to the page
  const keys = [...document.querySelectorAll("*[data-key]")].map((element) =>
    element.getAttribute("data-key")
  );
  for (let key of keys) {
    data[key] = retrieveData(key);
  }
  // Send the data to the page
  const extAPI = typeof browser !== "undefined" ? browser : chrome;
  extAPI.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    extAPI.tabs.sendMessage(tabs[0].id, { action: JSON.stringify(data) });
  });
}
/**
 * Updates the preference in the local storage if the element has a data-key and value attribute, then sends the data to the page
 * @param {Event} event The event that triggered the function
 */
function updatePreference(event) {
  const target = event.target;
  const key = target.getAttribute("data-key");
  const value = target.value;
  if (key) {
    if (target.getAttribute("type") === "checkbox") {
      localStorage.setItem(key, target.checked);
    } else if (value) {
      localStorage.setItem(key, value);
    }
  }
  sendData();
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

window.addEventListener("DOMContentLoaded", () => {
  // Add updatePreference triggers to each element that has the 'data-key' attribute
  [...document.querySelectorAll("*[data-key]")].map((item) => {
    // Set the input value if it exists in the localStorage
    const inputValue = retrieveData(item.getAttribute("data-key"));
    if (typeof inputValue === "boolean") {
      item.checked = inputValue;
    } else {
      item.value = inputValue;
    }

    item.addEventListener("change", updatePreference);
  });

  // Update the size of the body
  updateBodySize(500, 16);
});

// Google Storage to save font and size.
document.getElementById("btnApply").addEventListener("click", () => {
  const fontFamily = document.getElementById("selectFontFamily").value;
  const fontSize = document.getElementById("inputFontSize").value;

  // Save configurations in Google Storage
  chrome.storage.sync.set({ fontFamily, fontSize }, () => {
    alert("Configurations applied!");
    applyChanges();
  });
});

function applyChanges() {
  // Send configurations to content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.storage.sync.get(["fontFamily", "fontSize"], (settings) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "applyStyles",
        ...settings,
      });
    });
  });
}
