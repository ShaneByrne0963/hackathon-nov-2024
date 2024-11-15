// Optional: Toggle focus style if you'd like users to switch styles
function enableLongUnderlineFocusStyle() {
    document.querySelectorAll('.focus-item').forEach(item => {
      item.classList.add('long-underline');
    });
  }
  
  function disableLongUnderlineFocusStyle() {
    document.querySelectorAll('.focus-item').forEach(item => {
      item.classList.remove('long-underline');
    });
  }
  