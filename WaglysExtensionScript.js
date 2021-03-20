const audio = new Audio('http://soundbible.com/mp3/service-bell_daniel_simion.mp3');
let oldNamesOnHelpList = [];

rowCount = 0;

// Just makes the button pretty without needing a CSS-file
let styleName = document.createElement('style');
styleName.innerHTML = '.nameButton {\n' +
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
    '.nameButton:hover {\n' +
    '\tbackground:linear-gradient(to bottom, #1e62d0 5%, #3d94f6 100%);\n' +
    '\tbackground-color:#1e62d0;\n' +
    '}\n' +
    '.nameButton:active {\n' +
    '\tposition:relative;\n' +
    '\ttop:1px;\n';
document.getElementsByTagName('head')[0].appendChild(styleName);

let styleZoom = document.createElement('style');
styleZoom.innerHTML = '.zoomButton {\n' +
    '\tbox-shadow:inset 0px 1px 0px 0px #bbdaf7;\n' +
    '\tbackground:linear-gradient(to bottom, #79bbff 5%, #378de5 100%);\n' +
    '\tbackground-color:#79bbff;\n' +
    '\tborder-radius:6px;\n' +
    '\tborder:1px solid #84bbf3;\n' +
    '\tdisplay:inline-block;\n' +
    '\tcursor:pointer;\n' +
    '\tcolor:#ffffff;\n' +
    '\tfont-family:Arial;\n' +
    '\tfont-size:15px;\n' +
    '\tfont-weight:bold;\n' +
    '\tpadding:6px 24px;\n' +
    '\ttext-decoration:none;\n' +
    '\ttext-shadow:0px 1px 0px #528ecc;\n' +
    '}\n' +
    '.zoomButton:hover {\n' +
    '\tbackground:linear-gradient(to bottom, #378de5 5%, #79bbff 100%);\n' +
    '\tbackground-color:#378de5;\n' +
    '}\n' +
    '.zoomButton:active {\n' +
    '\tposition:relative;\n' +
    '\ttop:1px;\n' +
    '}';
document.getElementsByTagName('head')[0].appendChild(styleZoom);

//Find the help-list element to add an observer later
let targetElement = document.getElementById("manageHelpListForm");
const config = {attributes: false, childList: true, subtree: true};

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
function onWaglysUpdate() {
    observer.disconnect();
    console.log("DISCONNECT OBSERVER")

    let newNamesOnHelpList = [];

    //NOTE: getElementsByClassName will return an array with items
    let helpRequestList = document.getElementsByClassName("ui-li ui-li-static ui-btn-up-a");
    for (const child of helpRequestList) {
        let helpRequestItem = child.getElementsByClassName("ui-widget-content")[0];
        let zoomText = child.getElementsByClassName("ui-btn-text")[0].innerHTML;
        helpRequestItem.parentNode.insertBefore(generateButton(zoomText), helpRequestItem);
        newNamesOnHelpList.push(zoomText);
    }

    //Play audio if a the list of new names has any new names that the old one does not.
    if (newDifferentFromOld(oldNamesOnHelpList, newNamesOnHelpList)) {
        audio.play();
        console.log("AUDIO SHOULD PLAY");
    }
    oldNamesOnHelpList = newNamesOnHelpList;

    observer.observe(targetElement, config);
    console.log("CONNECT OBSERVER")
}

// Generates a div with a styled button containing the
function generateButton(buttonInformation) {
    let divElement = document.createElement("div");

    let namebtn = document.createElement("BUTTON");
    namebtn.innerHTML = "Copy: " + buttonInformation;
    namebtn.setAttribute("type", "button");
    namebtn.addEventListener("click", () => setClipboard(buttonInformation));
    namebtn.className = 'nameButton';

    let zoombtn = document.createElement("BUTTON");
    zoombtn.innerHTML = "Zoom: " + buttonInformation;
    zoombtn.setAttribute("type", "button");
    zoombtn.addEventListener("click", () => connectToZoom(buttonInformation));
    zoombtn.className = 'zoomButton';

    divElement.appendChild(namebtn);
    divElement.appendChild(zoombtn);
    divElement.setAttribute("align", "center");
    return divElement;
}

//Button function to attempt to parse name and join a Zoom call
function connectToZoom(text) {
    let id, pass;
    //Parse attemp #1: Only zoom id, no password
    if (text.replace(/ /g, "").length < 12) {
        id = text.replace(/ /g, "");
        pass = "";
    }
    // Parse attempt #2: Zoom id & password separated by '-'
    else if (text.contains("-")){
        text = text.replace(/ /g, ""); //Removes all white-spaces
        let index = text.indexOf("-");
        id = text.substring(0, index);
        pass = text.substring(index + 1, text.length);
    }

    let newTab = window.open(`https://zoom.us/j/${id}?pwd=${pass}`);
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

// Checks if the list of new names has added any new names which aren't included in the old one.
// I.e. checks if the list of names has been updated
function newDifferentFromOld(oldNames, newNames) {
    if (newNames.length > oldNames.length) return true;
    for (let elem of newNames) {
        if (!oldNames.includes(elem)) {
            return true;
        }
    }
    return false;
}
