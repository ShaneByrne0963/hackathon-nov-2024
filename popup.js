// All keys used in the local storage
// Format: { key: string, default: string }
const storageKeys = [
  { key: "buttonSize", default: "default" },
];

/**
 * Submits data from the popup tab to the main page
 */
function sendData() {
  let data = {};
  // Get the data saved from the user's preferences to be sent to the page
  for (let item of storageKeys) {
    const storageData = localStorage.getItem(item.key);
    if (storageData) {
      data[item.key] = storageData;
    }
    else {
      localStorage.setItem(item.key, item.default);
      data[item.key] = item.default;
    }
  }
  // Send the data to the page
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: JSON.stringify(data) });
  });
}
/**
 * Updates the preference in the local storage if the element has a data-key and value attribute, then sends the data to the page.
 * Make sure the key you specify in the element is also present in the storageKeys array above
 * @param {Event} event The event that triggered the function
 */
function updatePreference(event) {
  const target = event.target;
  const key = target.getAttribute('data-key');
  const value = target.value;
  if (key && value) {
    localStorage.setItem(key, value);
  }
  sendData();
}

/**
 * Sets the size of the body to either the width of the screen minus padding, or maxWidth
 * @param {Number} maxWidth the maximum width of the popup in pixels
 * @param {Number} padding the amount of pixels between the popup and the edge of the screen
 */
function updateBodySize(maxWidth, padding) {
  document.querySelector('body').style.width = `${Math.min(screen.width - (padding * 2), maxWidth)}px`;
}

window.addEventListener('DOMContentLoaded', () => {
  // Add your event listeners here
  document.querySelector('#button-size').addEventListener('change', updatePreference);

  // Update the size of the body
  updateBodySize(500, 16); 
})