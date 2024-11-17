// Listen for messages from the popup script
const extAPI = typeof browser !== "undefined" ? browser : chrome;
extAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "changeFontColor") {
    const selectedColor = message.fontColor;

    // Apply the selected font color to the entire page
    document.querySelectorAll("*").forEach((element) => {
      // Avoid overriding color for elements that should remain styled (e.g., images)
      if (element.nodeName !== "IMG" && element.nodeName !== "SVG") {
        element.style.color = selectedColor;
      }
    });

    // Respond back if needed (optional)
    sendResponse({ status: "success", appliedColor: selectedColor });
  }
});
