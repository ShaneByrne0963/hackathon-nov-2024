// Variable to track focus mode state
let isFocusModeOn = false;

function setFocusMode(data) {
  const focusModeButton = document.getElementById("focusModeButton");

  const focusMode = data.focusMode;

  isFocusModeOn = !isFocusModeOn;

  if (isFocusModeOn) {
    focusModeButton.textContent = "Deactivate Focus Mode";
    console.log("Focus Mode is now ON");
  } else {
    focusModeButton.textContent = "Activate Focus Mode";
    console.log("Focus Mode is now OFF");
  }
}

// focusModeButton.addEventListener("click", setFocusMode);

document.addEventListener("DOMContentLoaded", setFocusMode);
