// Add your functions to be ran on each element here
const functions = [updateColor];

function updatePage() {
  [...document.querySelectorAll('*')].map(item => {
    functions.map(func => {
      func(item);
    });
  });
}

updatePage();