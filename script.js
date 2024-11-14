// Add your functions to be ran on each element here
/**
 * func: The function to be called
 * targets: The query selector to apply the function to
 * condition: Only runs if the localStorage value "key" is equal to "equals"
 */
const functions = [
  {
    func: updateColorContrast,
    targets: '*',
    condition: {
      key: 'colorContrast',
      equals: true
    }
  },
  {
    func: removeBackgroundImage,
    targets: "body, header, div, section, article"
  },
  {
    func: replacementColor,
    targets: "body, header, div, section, article",
    condition: {
        key: 'removeBg',
        equals: true
    }
  },
  {
    func: ruler,
    targets: "body"
  }
];

function updatePage(preferences) {
  functions.map(data => {
    // If there is a condition with the function, only run the function if the condition is met
    if (!("condition" in data) || preferences[data.condition.key] === data.condition.equals) {
      [...document.querySelectorAll(data.targets)].map(element => {
        data.func(element, preferences);
      });
    }
  });
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  const resultData = JSON.parse(message.action);
  updatePage(resultData);
});