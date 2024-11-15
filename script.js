// Add your functions to be ran on each element here
/**
 * func: The function to be called
 * targets: The query selector to apply the function to
 * condition: Only runs if the localStorage value of "key" is equal to "equals"
 */
const functions = [
  {
    func: updateColorContrast,
    targets: "*"
  },
  {
    func: removeBackgroundImage,
    targets: "body, header, div, section, article",
  },
  {
    func: updateReplacementColor,
    targets: "body, header, div, section, article",
    condition: {
      key: "removeBg",
      equals: true,
    },
  },
  {
    func: splitParagraphs,
    targets: "p, div"
  },
  {
    func: ruler,
    targets: "body",
  },
  {
    func: hoverStyles,
    targets: "body",
  },
  {
    func: setLineSpacing,
    targets: "*"
  }
];

function updatePage(preferences) {
  functions.map((data) => {
    // If there is a condition with the function, only run the function if the condition is met
    if (
      !("condition" in data) ||
      preferences[data.condition.key] === data.condition.equals
    ) {
      [...document.querySelectorAll(data.targets)].map((element) => {
        data.func(element, preferences);
      });
    }
  });
}

const extAPI = typeof browser !== "undefined" ? browser : chrome;
extAPI.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  const resultData = JSON.parse(message.action);
  updatePage(resultData);
});
