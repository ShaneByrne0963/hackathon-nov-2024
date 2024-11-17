function setFocusMode(element, data) {
  const focusMode = data.focusMode;

  if (focusMode) {
    const styles = { display: "none" };

    updateStyles(element, styles, "focus-mode");
  } else {
    const styles = ["display"];
    resetStyles(element, styles, "focus-mode");
  }
}
