
/*This script is used to change the cursor to a wait cursor when the ruler tool is selected. 
Later on we will change the wait symbol to a ruler.*/
function ruler(element, data) {
    if (rulerClicked){
        element.addEventListener('mouseover', function() {
            document.body.style.cursor = "wait";
        });
    } else {
        element.addEventListener('mouseover', function() {
            document.body.style.cursor = "default";
        });
    }
}


