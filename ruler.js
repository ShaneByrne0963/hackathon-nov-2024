
/*This script is used to change the cursor to a wait cursor when the ruler tool is selected. 
Later on we will change the wait symbol to a ruler.*/
function ruler(element, data) {
        let checkbox = data.ruler
        if (checkbox) {
                element.style.cursor = "wait"
        } else {
                element.style.cursor = "default"
        }
}


