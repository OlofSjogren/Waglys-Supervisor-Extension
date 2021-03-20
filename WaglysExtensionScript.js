const audio = new Audio('http://soundbible.com/mp3/service-bell_daniel_simion.mp3');
rowCount = 0;

// Just makes the button pretty without needing a CSS-file
let style = document.createElement('style');
style.innerHTML = '.myButton {\n' +
    '\tbox-shadow:inset 0px 1px 0px 0px #97c4fe;\n' +
    '\tbackground:linear-gradient(to bottom, #3d94f6 5%, #1e62d0 100%);\n' +
    '\tbackground-color:#3d94f6;\n' +
    '\tborder-radius:6px;\n' +
    '\tborder:1px solid #337fed;\n' +
    '\tdisplay:inline-block;\n' +
    '\tcursor:pointer;\n' +
    '\tcolor:#ffffff;\n' +
    '\tfont-family:Arial;\n' +
    '\tfont-size:15px;\n' +
    '\tfont-weight:bold;\n' +
    '\tpadding:6px 24px;\n' +
    '\ttext-decoration:none;\n' +
    '\ttext-shadow:0px 1px 0px #1570cd;\n' +
    '}\n' +
    '.myButton:hover {\n' +
    '\tbackground:linear-gradient(to bottom, #1e62d0 5%, #3d94f6 100%);\n' +
    '\tbackground-color:#1e62d0;\n' +
    '}\n' +
    '.myButton:active {\n' +
    '\tposition:relative;\n' +
    '\ttop:1px;\n' +
    '}\n';
document.getElementsByTagName('head')[0].appendChild(style);

//Find the help-list element to add an observer later
let targetElement = document.getElementById("manageHelpListForm");
const config = { attributes: false, childList: true, subtree: true };

// Create an observer instance linked to the onWaglysUpdate function.
const observer = new MutationObserver(onWaglysUpdate);

// Start observing the help-list for mutations.
// A mutation will occur every time Waglys makes a GET request to the server to update the help-list.
// Waglys makes GET requests to the server in 10 second intervals.
observer.observe(targetElement, config);

//Force-update the first time page is loaded.
onWaglysUpdate()

// On each update Waglys re-renders the list, thus removing all the injected buttons.
// This function is called upon every time Waglys re-renders the list to inject buttons for every list-item.
function onWaglysUpdate(){
    console.log("DISCONNECTED OBSERVER");
    observer.disconnect();

    let helpRequestList = document.getElementsByClassName("ui-li ui-li-static ui-btn-up-a");
    for (const child of helpRequestList ) {
        let helpRequestItem = child.getElementsByClassName("ui-widget-content");
        let zoomText = child.getElementsByClassName("ui-btn-text");
        zoomText = zoomText[0].innerHTML;
        helpRequestItem[0].parentNode.insertBefore(generateButton(zoomText), helpRequestItem[0]);
        console.log("GENERATED BUTTON");
    }

    //Audio notification for newly appeared rows (ALL CREDIT TO ELIAS FOR THIS ONE)
    newRowCount = document.querySelectorAll('*[role^=row]').length;
    if(newRowCount > rowCount){
        audio.play();
    }
    rowCount = newRowCount;


    observer.observe(targetElement, config);
    console.log("RECONNECTED OBSERVER");
}

// Generates a div with a styled button containing the
function generateButton(buttonInformation){
    let divElement = document.createElement("div");
    let btn = document.createElement("BUTTON");
    btn.innerHTML = "Copy: " + buttonInformation;
    btn.setAttribute("type", "button");
    btn.addEventListener ("click", () => setClipboard(buttonInformation));
    btn.className = 'myButton';
    divElement.appendChild(btn);
    divElement.setAttribute("align", "center");
    return divElement;
}

// Function for writing text to the clipboard.
// Creates a temporary textarea with the text, focuses as well as selects it and then copies to clipboard.
// This method is used since any newer API requires https which does not seem to work on Waglys.
function setClipboard(text) {
    let copyTextarea = document.createElement("textarea");
    copyTextarea.value = text;
    document.body.appendChild(copyTextarea);
    copyTextarea.focus();
    copyTextarea.select();

    try {
        let successful = document.execCommand('copy');
        let msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    }

}
