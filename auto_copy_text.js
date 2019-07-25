// ==UserScript==
// @name         Easy Copy Selected Text
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Automatically copies selected text to the clipboard.
// @author       Jacob Jauregui
// @match        *://*/*
// @grant        none
// ==/UserScript==

var divSnackbar = document.createElement("div");
divSnackbar.id = "snackbar";
var element = document.body;
element.appendChild(divSnackbar);

var oldSelectedText = "";
var snackbar = document.getElementById("snackbar");

// returns the text selected
function getSelectionText() {
    var text = "";
    var activeEl = document.activeElement;
    var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
    if (
      (activeElTagName == "textarea") || (activeElTagName == "input" &&
      /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
      (typeof activeEl.selectionStart == "number")
    ) {
        text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
        if (oldSelectedText == text) { console.log(oldSelectedText + " same as new: " + text);}
        else {oldSelectedText = text;}
    } else if (window.getSelection) {
        text = window.getSelection().toString();
        if (oldSelectedText == text && oldSelectedText != "") { text = "";}
        else {oldSelectedText = text;}
    }
    return text;
}

// Checks if mouse key is released then makes sure we have text selected
// so it will automatically be coppied to the clipboard.
document.onmouseup = function(e) {
    if  ((!e.ctrlKey) && (!e.altKey)) {
        var textSelected = "";
        textSelected = getSelectionText();
        if (textSelected != "") { // won't copy text if the control key or alt key is held
            document.execCommand('copy');
            snackTime("Coppied to clipboard");
        }
    }
};

function addStyles(str) {
    var node = document.createElement('style');
    node.innerHTML = str;
    document.body.appendChild(node);
}

function snackTime(str, target = "snackbar") {
    if (target == "snackbar") {
        snackbar.innerHTML = str;
        snackbar.className = "show";
        setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 3000);
    }
    if (target == "blocker") {
        blockerSnackbar.innerHTML = str;
        blockerSnackbar.className = "stay";
        setTimeout(function(){ snackbar.className = snackbar.className.replace("stay", ""); }, 3000);
    }
}

addStyles(
    '#snackbar {\
        visibility: hidden;\
        min-width: 250px;\
        margin-left: -125px;\
        background-color: #333;\
        color: #fff;\
        text-align: center;\
        border-radius: 2px;\
        padding: 16px;\
        position: fixed;\
        z-index: 9999;\
        left: 50%;\
        bottom: 50px;' +
    '}\
    #snackbar.show {\
        visibility: visible;\
        animation: fadein 0.5s, fadeout 0.5s 2.7s;'+
    '}\
    @keyframes fadein {\
        from {bottom: 0; opacity: 0;}\
        to {bottom: 50px; opacity: 1;}'+
    '}\
    @keyframes fadeout {\
        from {bottom: 50px; opacity: 1;}\
        to {bottom: 0; opacity: 0;}'+
    '}\
    #element-hider {\
        visibility: hidden;\
        display: block;\
        opacity: .9;\
        background-color: #00275f;\
        color: #fff;\
        text-align: center;\
        width 900px;\
        height: auto;\
        padding: 14px;\
        position: fixed;\
        z-index: 9999;\
        bottom: 50px;\
        right: 50px;\
        border-radius: 2px;\
        font-size: 16px;\
        font-family: monospace;'+
    '}\
    .stay {\
        width: 25px !important;\
        height: 25px !important;\
        display:block;\
        border-radius: 38px !important;\
        white-space: nowrap;\
        overflow: hidden;\
        opacity: .35 !important;\
        animation-name: moveDivsBlocked;\
        right: 50px !important;\
        animation-duration: 1.5s;\
        line-height: 30px;' +
    '}\
    #element-hider span:hover {\
        cursor: pointer;' +
    '}\
    .show-errors {\
        visibility: visible !important;\
        width: 225px;' +
    '}\
    .box {\
        width: 200px;\
        background: cornflowerblue;\
        padding: 20px 8px;\
        height: auto;\
        margin-bottom: 10px;' +
    '}\
    .red {\
        background-color: #fb7373 !important;' +
    '}\
    #number-blocked {\
        font-weight: bold;' +
    '}\
    div#element-hider:hover {\
        height: auto !important;\
        width: 225px !important;\
        animation: all .5 ease;\
        border-radius: 2px !important;\
        line-height: 24px;\
        opacity: .9 !important;' +
    '}\
    #element-hider span {\
        background-color: #244182;\
        display: block;\
        padding: 2px 0px;\
        margin-bottom: 10px;' +
    '}\
    @keyframes moveDivsBlocked {\
        0%   {opacity: .9; width: 225px; height: auto;border-radius: 2px;line-height: 24px;}\
        10%  {opacity: .9;}\
        30% {line-height:24px;}\
        100% {right:50px; opacity: .35; width: 25px; height: 25px; border-radius: 38px;line-height:30px;}' +
        '}\
');