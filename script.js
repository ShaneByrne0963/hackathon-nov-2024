// Add your functions to be ran on each element here
const functions = [
  { func: updateColor, query: "*",
    func: removeBackgroundImage, query: "body, header, div, section, article"
   }
];

function updatePage() {
  functions.map(data => {
    [...document.querySelectorAll(data.query)].map(element => {
      data.func(element);
    })
  });
  [...document.querySelectorAll('*')].map(item => {
    functions.map(func => {
      func(item);
    });
  });
}

updatePage();