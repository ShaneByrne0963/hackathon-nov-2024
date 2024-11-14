
/*This script is used to change the cursor to a wait cursor when the ruler tool is selected. 
Later on we will change the wait symbol to a ruler.*/
function ruler(rulerClicked) {
    if (rulerClicked){
        window.addEventListener('mouseover', function() {
            document.body.style.cursor = "wait";
        });
    } else {
        window.addEventListener('mouseover', function() {
            document.body.style.cursor = "default";
        });
    }
}
