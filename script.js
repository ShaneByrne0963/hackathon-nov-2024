// Add your functions to be ran on each element here
/**
 * func: The function to be called
 * targets: The query selector to apply the function to
 * condition: Only runs if the localStorage value of "key" is equal to "equals"
 */
const functions = [
  {
    func: updateColorContrast,
    targets: "*",
    condition: {
      key: "colorContrast",
      equals: true,
    },
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
    targets: "p, span",
  },
  {
    func: ruler,
    targets: "body",
  },
  {
    func: hoverStyles,
    targets: "*",
  },
];

function updatePage(preferences) {
  console.clear();
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
  if (message.type === "applyStyles") {
    const { fontFamily, fontSize } = message;

    // Add style to body
    const styleGlobal = document.createElement("style");
    styleGlobal.innerHTML = `
          * {
              font-family: ${fontFamily} !important;
              font-size: ${fontSize}px !important;
              line-height: 1.5 !important;
          }
      `;
    document.head.appendChild(styleGlobal);

    sendResponse({ status: "Styles Applied" });
  }
  const resultData = JSON.parse(message.action);
  updatePage(resultData);
});
