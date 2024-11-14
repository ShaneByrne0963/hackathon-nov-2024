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

document.querySelector('#button-size').addEventListener('change', updatePreference);