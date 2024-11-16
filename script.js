// Add your functions to be ran on each element here
/**
 * func: The function to be called
 * preference: The preference key in the local storage that affects the function
 * targets: The query selector to apply the function to
 */
const functions = [
  {
    func: updateColorContrast,
    preference: "colorContrast",
    targets: "*",
  },
  {
    func: removeBackgroundImage,
    preference: "removeBg",
    targets: "body, header, footer, div, section, article, aside, nav",
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
    preference: "hoverHighlight, hoverMagnifyingGlass",
    targets: "body",
  },
  {
    func: setLineSpacing,
    preference: "lineSpacing",
    targets: "*",
  },
  {
    func: setFontFamily,
    preference: "fontFamily",
    targets: "body",
  },
  {
    func: setFontSize,
    preference: "fontSize",
    targets: "body",
  },
  {
    func: disableAutoplay,
    targets: "audio, video",
  }
];
const defaultValues = {};
const extAPI = typeof browser !== "undefined" ? browser : chrome;

function updatePage(preference = null) {
  // Disable DOM change detection while the process is running
  observer.disconnect();
  extAPI.storage.local.get("accessorEasePreferences", (result) => {
    const preferences = result.accessorEasePreferences || defaultValues;
    let runFunctions;

    if (preference) {
      runFunctions = functions.filter(item => (item.preference && item.preference.includes(preference)));
    }
    else {
      runFunctions = functions;
    }
    runFunctions.map((data) => {
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
    // Allow for automatic changes again after 1 second
    setTimeout(() => observer.observe(document.body, config), 1000);
  });
}

// Listening for data from the popup
extAPI.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "update") {
    console.log(message.preference);
    updatePage(message.preference || null);
  }
});

// Create a MutationObserver instance
const observer = new MutationObserver((mutationsList, obs) => {
  // Only update the page under specific conditions
  let canUpdate = false;
  for (let mutation of mutationsList) {

    ////////////

    mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE && (node.tagName === "AUDIO" || node.tagName === "VIDEO")) {
        node.autoplay = false;
        node.removeAttribute("autoplay");
        node.pause();
        console.log("Autoplay disabled for ", node);
      }
    });

    //////////////

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
