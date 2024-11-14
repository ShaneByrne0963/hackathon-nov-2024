// Add your functions to be ran on each element here
const functions = [
  { func: updateColorContrast, targets: "*" },
  { func: removeBackgroundImage, targets: "body, header, div, section, article" },
  { func: ruler, targets: "body" }
];

function updatePage(preferences) {
  console.log(preferences);
  functions.map(data => {
    [...document.querySelectorAll(data.targets)].map(element => {
      data.func(element, preferences);
    });
  });
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  const resultData = JSON.parse(message.action);
  updatePage(resultData);
});