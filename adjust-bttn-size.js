function changeButtonSize() {
  // Get the selected size from the dropdown
  const size = document.getElementById("button-size").value;
  
  // Get all buttons on the page
  const buttons = document.querySelectorAll("button");

  // Remove any existing size classes
  buttons.forEach(button => {
      button.classList.remove("button-medium", "button-large");
      
      // Apply the selected size class
      if (size === "medium") {
          button.classList.add("button-medium");
      } else if (size === "large") {
          button.classList.add("button-large");
      }
  });
}