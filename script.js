// Add your functions to be ran on each element here
/**
 * func: The function to be called
 * preference: The preference key in the local storage that affects the function
 * targets: The query selector to apply the function to
 */
const functions = [
  {
    func: disableAutoplay,
    targets: "audio, video",
  },
  {
    func: removeBackgroundImage,
    preference: "removeBg",
    targets: "body, header, footer, div, section, article, aside, nav",
  },
  {
    func: applyPalette,
    preference: "colorPalette",
    targets: "body, header, footer, nav",
  },
  {
    func: splitParagraphs,
    preference: "breakParagraph",
    targets: "p, div",
  },
  {
    func: ruler,
    preference: "ruler",
    targets: "body",
  },
  {
    func: hoverStyles,
    preference: "hoverHighlight",
    targets: "body",
  },
  {
    func: setLineSpacing,
    preference: "lineSpacing",
    targets: `p, span, div`,
  },
  {
    func: setFontFamily,
    preference: "fontFamily",
    targets: "body",
  },
  {
    func: setFontSize,
    preference: "isMinFontSize, fontSize",
    targets: "body *",
  },
  {
    func: setFontColor,
    preference: "fontColor",
    targets: "body",
  },
  {
    func: changeButtonSize,
    preference: "buttonSize",
    targets: "button",
  },
  {
    func: updateColorContrast,
    preference: "colorContrast",
    targets: "body *",
  },
  {
    func: setFocusMode,
    preference: "focusMode",
    targets: "img, aside, footer",
  },
];
// Like functions, but aren't run on page load/update. Can only be called by returning in a function
const resultFunctions = [
  {
    func: forceColorContrast,
    preference: "colorContrast",
    targets: "*",
  },
  {
    func: clearColorContrast,
    preference: "colorContrast",
    targets: "*",
  },
];

const defaultValues = {
  colorContrast: false,
  removeBg: false,
  colorPalette: "norm",
  breakParagraph: false,
  buttonSize: "default",
  fontFamily: "Default",
  isMinFontSize: false,
  focusMode: false,
  lineSpacing: "1",
  fontSize: "20",
  ruler: false,
  hoverHighlight: false,
  fontColor: "Default",
  eventListeners: [],
};
const extAPI = typeof browser !== "undefined" ? browser : chrome;

function updatePage(preference = null) {
  // Disable DOM change detection while the process is running
  observer.disconnect();
  extAPI.storage.local.get("accessorEasePreferences", (result) => {
    let preferences = defaultValues;
    if (
      result.accessorEasePreferences &&
      result.accessorEasePreferences.runExtension
    ) {
      preferences = result.accessorEasePreferences;
    }
    let runFunctions;

    if (preference && preference !== "runExtension") {
      runFunctions = [...functions].filter(
        (item) => item.preference && item.preference.includes(preference)
      );
    } else {
      runFunctions = [...functions];
    }
    pageUpdateStep(runFunctions, preferences);
  });
}


/**
 * Steps through each function to e run
 * @param {[Object]} fncs The list of functions from the functions variable to be run
 * @param {Object} preferences The user preferences
 */
function pageUpdateStep(fncs, preferences) {
  let runFunctions = [...fncs];
  let data = runFunctions[0];
  document.querySelectorAll(data.targets).forEach((element) => {
    const functionResult = data.func(element, preferences);
    // Check if any other functions need to be ran after the function has been run
    if (functionResult) {
      let resultArray = [functionResult];
      // Check if the output is an array
      if (typeof functionResult === 'object' && functionResult.map) {
        resultArray = functionResult;
      }
      resultArray.map(res => {
        let hasFunction = false;
        for (let i = 0; i < runFunctions.length; i++) {
          let fnc = runFunctions[i];
          if (fnc.func === res) {
            // Move the function to the back of the queue if it already exists
            const foundFunction = runFunctions.splice(i, 1)[0];
            runFunctions.push(foundFunction);
            hasFunction = true;
            break;
          }
        }
        if (!hasFunction) {
          let foundFunction = false;
          for (let fnc of functions) {
            if (fnc.func === res) {
              runFunctions.push(fnc);
              foundFunction = true;
              break;
            }
          }
          if (!foundFunction) {
            for (let fnc of resultFunctions) {
              if (fnc.func === res) {
                runFunctions.push(fnc);
                break;
              }
            }
          }
        }
      });
    }
  });
  runFunctions.splice(0, 1);
  if (runFunctions.length > 0) {
    setTimeout(() => pageUpdateStep(runFunctions, preferences));
  }
  else {
    // Allow for automatic changes again after 1 second
    setTimeout(() => observer.observe(document.body, config), 1000);
  }
}


// Listening for data from the popup
extAPI.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "update") {
    updatePage(message.preference || null);
  }
});

// Create a MutationObserver instance
const observer = new MutationObserver((mutationsList, obs) => {
  // Only update the page under specific conditions
  let canUpdate = false;

  for (let mutation of mutationsList) {
    // Always update the page if elements are added/deleted
    if (mutation.type === "childList") {
      canUpdate = true;
      break;
    }
    // If an attribute change is detected, only update the page if the element has updated its style element or its class list
    else if (
      mutation.type === "attributes" &&
      (mutation.attributeName === "style" || mutation.attributeName === "class")
    ) {
      // Do not update the page if the affected element is the ruler
      const mutatedElement = mutation.target;
      if (
        mutatedElement.id !== "accessorease-ruler" &&
        mutatedElement.id !== "accessorease-horizontal-line"
      ) {
        canUpdate = true;
        break;
      }
    }
  }
  if (canUpdate) {
    updatePage();
  }
});

// Configuration options
const config = {
  childList: true,
  subtree: true,
  attributes: true,
  characterData: false,
};

// Start observing the document body
observer.observe(document.body, config);

// Disconnect the observer before page unload
window.addEventListener("beforeunload", () => {
  observer.disconnect();
});
