// Add your functions to be ran on each element here
const functions = [
  { func: updateColor, targets: "*" },
];

function updatePage(data) {
  functions.map(data => {
    [...document.querySelectorAll(data.targets)].map(element => {
      data.func(element);
    });
  });
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  const resultData = JSON.parse(message.action);
  console.log(resultData);
  updatePage(resultData);
});