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
    targets: "body, header, footer, div, section, article, aside",
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
const defaultValues = {

};
const extAPI = typeof browser !== "undefined" ? browser : chrome;

function updatePage() {
  // Disable DOM change detection while the process is running
  observer.disconnect();
  extAPI.storage.local.get('accessorEasePreferences', (result) => {
    const preferences = result.accessorEasePreferences || defaultValues;
    functions.map((data) => {
      updateStatus = 'updating';
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
    // Allow for automatic changes again after 3 seconds
    setTimeout(() => observer.observe(document.body, config), 3000);
  });
}

// Listening for data from the popup
extAPI.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'update') {
    updatePage();
  }
});

// Create a MutationObserver instance
const observer = new MutationObserver((mutationsList, obs) => updatePage());

// Configuration options
const config = {
  childList: true,
  subtree: true,
  attributes: true
};

// Start observing the document body
observer.observe(document.body, config);
// Disconnect the observer before page unload
window.addEventListener('beforeunload', () => {
  observer.disconnect();
});
