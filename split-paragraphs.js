
function splitParagraphs(element, data) {
    if (element.innerText) {
        if (element.innerText.length > 100) {
            //alert(element.innerText);
            let text = element.innerHTML.split('.');
            // Make sure no tags are broken up
            // Join several sentences together
            
            element.innerHTML = `<p>${text.slice(0,3)}</p>`;

        }
    }

}