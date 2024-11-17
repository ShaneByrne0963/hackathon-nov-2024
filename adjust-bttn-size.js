/* This script adjusts the size of all buttons on the page based on user preferences */
function changeButtonSize(element, data) {
  // Retrieve the button size preference from the `data` object
  const selectedSize = data.buttonSize || "default";

  // Apply the new size class based on the preference
  if (selectedSize === "medium") {
    const styles = {
      "font-size": "16px",
      "padding": "10px 15px"
    }
    updateStyles(element, styles, "button-size");
  } else if (selectedSize === "large") {
    const styles = {
      "font-size": "20px",
      "padding": "15px 20px"
    }
    updateStyles(element, styles, "button-size");
  } else {
    resetStyles(element, ["font-size", "padding"], "button-size");
  }

}
  