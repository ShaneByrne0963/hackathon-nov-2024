// All keys used in the local storage
// Format: { key: string, default: string }
const storageKeys = [];

/**
 * Submits data from the popup tab to the main page
 */
function sendData() {
  let data = {};
  // Get the data saved from the user's preferences to be sent to the page
  for (let item in storageKeys) {
    const storageData = localStorage.getItem(item.key);
    if (storageData) {
      data[item.key] = storageData;
    }
    else {
      localStorage.setItem(item.key, item.default);
    }
  }
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: JSON.stringify(data) });
  });
}

document.querySelector('#id_start_functions').addEventListener('click', sendData);