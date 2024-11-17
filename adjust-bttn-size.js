/* This script adjusts the size of all buttons on the page based on user preferences */
function changeButtonSize(element, data) {
    // Retrieve the button size preference from the `data` object
    const selectedSize = data.buttonSize || "default";
    // Remove any existing size-related classes
    element.classList.remove("accessorease-button-medium", "accessorease-button-large");
  
    // Apply the new size class based on the preference
    if (selectedSize === "medium") {
      element.classList.add("accessorease-button-medium");
    } else if (selectedSize === "large") {
      element.classList.add("accessorease-button-large");
    }
  
  }
  
  // Add helper CSS classes to control button size
  function injectButtonSizeStyles() {
    const style = document.createElement("style");
    style.id = "button-size-styles";
    style.textContent = `
      .accessorease-button-medium {
        font-size: 16px;
        padding: 10px 15px;
      }
      .accessorease-button-large {
        font-size: 20px;
        padding: 15px 20px;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Ensure styles are injected when the script runs
  if (!document.getElementById("button-size-styles")) {
    injectButtonSizeStyles();
  }
  
  // Export the function to the global scope for usage in other scripts
  window.changeButtonSize = changeButtonSize;
  