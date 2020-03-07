/*
{{ Chareditor.com }}
Copyright (C) {{ 2020 }}  {{ alestiago }}

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>. 
*/


/**
 * Contains all JavaScript functions.
 *
 * @file   This files defines all functions.
 * @author Alejandro Santiago (@alestiago)
 * @license GPL-3.0
 */
 
/* global selectedLCD */
var selectedLCD = document.getElementById("lcd-0x0");

/* Functions for saving and loading app state */
function loadSavedData() {
  /* Loads data stored in the browser memory */
  var elements = document.querySelectorAll('[data-saveable]');

  for (var i = 0; i < elements.length; i++) {
    var element = elements.item(i);

    if (localStorage.getItem(element.id)) {
      if (element.tagName === "INPUT" && element.type === "checkbox") {
        element.checked = (localStorage.getItem(element.id) === "true");
      } else if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        element.value = localStorage.getItem(element.id)
      } else if (element.hasChildNodes()) {
        element.innerHTML = localStorage.getItem(element.id);
      }
    }
  }

  if (localStorage.getItem("selectedLCD"))
    selectLCD(document.getElementById(localStorage.getItem("selectedLCD")))
}

function saveProgress() {
  /* Saves the current app state to browser memory */
  var elements = document.querySelectorAll('[data-saveable]');

  for (var i = 0; i < elements.length; i++) {
    var element = elements.item(i);

    if (element.tagName === "INPUT" && element.type === "checkbox") {
      localStorage.setItem(element.id, element.checked);
    } else if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
      localStorage.setItem(element.id, element.value);
    } else if (element.hasChildNodes()) {
      localStorage.setItem(element.id, element.innerHTML);
    }
  }

  localStorage.setItem("selectedLCD", selectedLCD.id);

  addStatusMsg("Saved!");
}

function addStatusMsg(msg) {
  /* Function to display status messages in the top left corner */
  $("#status-msg-box").append('<div class="status-msg">' + msg + '</div>');

  var statusMsgs = $(".status-msg").filter(function () {
    return $(this).css('opacity') === "1";
  });
  statusMsgs.first().fadeOut(1000, function () {
    statusMsgs.first().remove();
  });
}

function onBodyLoad() {
  /* Handler for when page has loaded */
  updateCode();
  loadSavedData();
}

/* CODE Functions */
function updateCode (){
  /* Updates the code according to editor */
  var charname = document.getElementById("pixel-editor__charname").value;
  var code_header = "byte " + charname + "[] = {";
  var code_body;
  if (isCheckboxChecked("hex-data-type")) code_body = getHexCode();
  else code_body = getBinaryCode();
  var code_footer = "};";

  if (isCheckboxChecked("include-define")){
    code_header = addDefineCode(charname) + "\r\n" + code_header;
  }
  
  var full_code = code_header + "\r\n" +
                  code_body + "\r\n" +
                  code_footer;
  document.getElementById("code-box__code").value = full_code;
  
  if (isCheckboxChecked("autocopy")) copyToClipboard();
}

function getBinaryCode () {
  /* Returns binary code according to pixels state */
  var code_body = "";
  for (var row = 0; row < 8; row++) {
    code_body += "    B";
    for (var col = 0; col < 5; col++) {
      var pixelID = "pixel-" + row + "x" + col;
      var pixel_state = document.getElementById(pixelID).className;
			
      if (pixel_state === "pixel-off") code_body += "0";
      else code_body += "1";
    }
    code_body += ",\r\n";
  }
  code_body = code_body.substring(0, code_body.length - 3);
  
  return code_body
}

function getHexCode () {
  /* Returns hexadecimal code according to pixels state */
  var code_body = "";
  for (var row = 0; row < 8; row++) {
    code_body += "    0x";
    var thisLineBinary = "";
    for (var col = 0; col < 5; col++) {
      var pixelID = "pixel-" + row + "x" + col;
      var pixel_state = document.getElementById(pixelID).className;
			
      if (pixel_state === "pixel-off") thisLineBinary += "0";
      else thisLineBinary += "1";
    }
    var thisLineHex = parseInt(thisLineBinary, 2).toString(16);
    thisLineHex = thisLineHex.toUpperCase();
    if (thisLineHex.length < 2) thisLineHex = "0" + thisLineHex;  //Todo: modify this
    
    code_body += thisLineHex + ",\r\n";
  }
  code_body = code_body.substring(0, code_body.length - 3);
  
  return code_body
}

function addDefineCode(charname){
  /* Returns a #define text according to the name */
  var defineCode = "#define " + charname.toUpperCase() + "_CHAR 0";
  return defineCode;
}

/* PIXEL EDITOR functions */
function togglePixel (pixel) {
  /* Toggles state of specified pixel */

  if (pixel.className === "pixel-off") pixel.className = "pixel-on";
  else pixel.className = "pixel-off";

  updateCode();
  toggleLCDPixel(pixel);
}

function clearPixels () {
  /* Sets off all pixels' state of selected LCD */
  for (var row = 0; row < 8; row++) {
    for (var col = 0; col < 5; col++) {
      var pixelID = "pixel-" + row + "x" + col;
      var pixel = document.getElementById(pixelID);
      pixel.className = "pixel-off";
    }
  }
  updateCode();
  updateLCD();
}

function invertPixels () {
  /* Inverts all pixels' state of selected LCD */
  for (var row = 0; row < 8; row++) {
    for (var col = 0; col < 5; col++) {
      var pixelID = "pixel-" + row + "x" + col;
      togglePixel(document.getElementById(pixelID));
    }
  }
  updateCode();
}

function mirrorVertPixels () {
  /* Mirrors vertically all pixels' state */
  for (var row = 0; row < 8; row++) {
    for (var col = 0; col < 2; col++) {
      var leftPixelID = "pixel-" + row + "x" + col;
      var leftPixel = document.getElementById(leftPixelID);
      var leftPixelState = leftPixel.className;
      
      var rightPixelID = "pixel-" + row + "x" + (4 - col);
      var rightPixel = document.getElementById(rightPixelID);
      var rightPixelState = rightPixel.className;
      
      // Swap
      leftPixel.className = rightPixelState;
      rightPixel.className = leftPixelState;
    }
  }
  updateCode();
  updateLCD();
}

function mirrorHoriPixels () {
  /* Mirrors horizontally all pixels' state */
  for (var col = 0; col < 5; col++) {
    for (var row = 0; row < 4; row++) {
      var upperPixelID = "pixel-" + row + "x" + col;
      var upperPixel = document.getElementById(upperPixelID);
      var upperPixelState = upperPixel.className;
      
      var lowerPixelID = "pixel-" + (7 - row) + "x" + col;
      var lowerPixel = document.getElementById(lowerPixelID);
      var lowerPixelState = lowerPixel.className;
      
      // Swap
      upperPixel.className = lowerPixelState;
      lowerPixel.className = upperPixelState;
    }
  }
  updateCode();
  updateLCD();
}

function copyToPixelClipboard () {
  /* Copies current state of editor to the clipboard */
  for (var row = 0; row < 8; row++) {
    for (var col = 0; col < 5; col++) {
      var pixelID = "pixel-" + row + "x" + col;
      var pixelState = document.getElementById(pixelID).className;
      var clipboardPixelID = "clipboard-" + row + "x" + col;
      var clipboardPixel = document.getElementById(clipboardPixelID);
      
      if (pixelState === "pixel-off") clipboardPixel.className = null;
      else clipboardPixel.className = "lcd-pixel__on"; 
    }
  }
  addStatusMsg("Copied!");
}

function pasteToPixelEditor () {
  /* Paste current state of clipboard to editor */
  for (var row = 0; row < 8; row++) {
    for (var col = 0; col < 5; col++) {
      var clipboardPixelID = "clipboard-" + row + "x" + col;
      var clipboardState = document.getElementById(clipboardPixelID).className;
      var pixelID = "pixel-" + row + "x" + col;
      var pixel = document.getElementById(pixelID);
      
      if (clipboardState === "lcd-pixel__on") pixel.className = "pixel-on";
      else pixel.className = "pixel-off"; 
    }
  }
  updateCode();
  updateLCD();
}

function shiftUp () {
  /* Shifts every pixel upwards */
  for (var row = 0; row < 7; row++) {
    for (var col = 0; col < 5; col++) {
      var pixelID = "pixel-" + row + "x" + col;
      var pixel = document.getElementById(pixelID);
      var pixelBelowID = "pixel-" + (row + 1) + "x" + col;
      var pixelBelowState = document.getElementById(pixelBelowID).className;
      pixel.className = pixelBelowState;
    }
  }
  
  // Clear last row
  for (var col = 0; col < 5; col++) {
    var pixelID = "pixel-7x" + col;
    var pixel = document.getElementById(pixelID);
    pixel.className = "pixel-off";
  }
  
  updateCode();
  updateLCD();
}

function shiftDown () {
  /* Shift every pixel downwards */
  for (var row = 7; row > 0; row--) {
    for (var col = 0; col < 5; col++) {
      var pixelID = "pixel-" + row + "x" + col;
      var pixel = document.getElementById(pixelID);
      var pixelAboveID = "pixel-" + (row - 1) + "x" + col;
      var pixelAboveState = document.getElementById(pixelAboveID).className;
      pixel.className = pixelAboveState;
    }
  }
  
  // Clear first row
  for (var col = 0; col < 5; col++) {
    var pixelID = "pixel-0x" + col;
    var pixel = document.getElementById(pixelID);
    pixel.className = "pixel-off";
  }
  
  updateCode();
  updateLCD();
}

function shiftLeft () {
  /* Shifts every pixel leftwards */
  for (var row = 0; row < 8; row++) {
    for (var col = 0; col < 4; col++) {
      var pixelID = "pixel-" + row + "x" + col;
      var pixel = document.getElementById(pixelID);
      var pixelToRightID = "pixel-" + row + "x" + (col + 1);
      var pixelToRightState = document.getElementById(pixelToRightID).className;
      pixel.className = pixelToRightState;
    }
  }
  
  // Clear rightest row
  for (var row = 0; row < 8; row++) {
    var pixelID = "pixel-" + row + "x4";
    var pixel = document.getElementById(pixelID);
    pixel.className = "pixel-off";
  }
  
  updateCode();
  updateLCD();
}

function shiftRight () {
  /* Shift every pixel rightwards */
  for (var row = 0; row < 8; row++) {
    for (var col = 4; col > 0; col--) {
      var pixelID = "pixel-" + row + "x" + col;
      var pixel = document.getElementById(pixelID);
      var pixelToLeftID = "pixel-" + row + "x" + (col - 1);
      var pixelToLeftState = document.getElementById(pixelToLeftID).className;
      pixel.className = pixelToLeftState;
    }
  }
  
  // Clear leftest row
  for (var row = 0; row < 8; row++) {
    var pixelID = "pixel-" + row + "x0";
    var pixel = document.getElementById(pixelID);
    pixel.className = "pixel-off";
  }
  
  updateCode();
  updateLCD();
}

/* PREVIEW Functions */
function updateLCD () {
  /* Updates all editor pixels states to selected LCD */
  for (var row = 0; row < 8; row++) {
    for (var col = 0; col < 5; col++) {
      var pixelID = "pixel-" + row + "x" + col;
      var pixelState = document.getElementById(pixelID).className;
      var lcdpixelID = selectedLCD.id + "-" + row + "x" + col;
      var lcdpixel = document.getElementById(lcdpixelID);
 
      if (pixelState === "pixel-off") lcdpixel.className = null;
      else lcdpixel.className = "lcd-pixel__on";
    }
  }
}

function toggleLCDPixel (pixel) {
  /* Toggles state of specified LCD pixel */
  var LCDpixelID = selectedLCD.id + pixel.id.substr(-4);
  var LCDpixel = document.getElementById(LCDpixelID);
  
  if (LCDpixel.className === "lcd-pixel__on") LCDpixel.className = null;
  else LCDpixel.className = "lcd-pixel__on";
}

function selectLCD (lcdpixel) {
  /* Selects specified LCD and updates Editor and Code */
  unselectLCD(selectedLCD); // Unselect previous	LCD

  lcdpixel.className = "lcd-pixel__selected";
  selectedLCD = lcdpixel;
  loadLCDtoEditor(lcdpixel);
  updateCode();
}

function unselectLCD (lcd) {
  /* Removes selection of the specified LCD */
  lcd.className = "lcd-pixel";
}

function loadLCDtoEditor (lcd) {
  /* Loads specified LCD pixel to editor */
  for (var row = 0; row < 8; row++) {
    for (var col = 0; col < 5; col++) {
      var lcdpixelID = lcd.id + "-" + row + "x" + col;
      var lcdpixel = document.getElementById(lcdpixelID);
      var lcdpixelState = lcdpixel.className;
      
      var pixelID = "pixel-" + row + "x" + col;
      var pixel = document.getElementById(pixelID);
      
      if (lcdpixelState === "lcd-pixel__on") pixel.className = "pixel-on";
      else pixel.className = "pixel-off";
    }
  }
}

/* OPTIONS functions */
function isCheckboxChecked (checkboxID) {
  /* Checks if the checkbox is checked or not, returns boolean accordingly */
  var thischeckbox = document.getElementById(checkboxID);
  var checkedValue = thischeckbox.checked;
  return checkedValue;
}

function copyToClipboard () {
  /* Copies content of code text area to clipboard */
  var copyText = document.getElementById("code-box__code");
  
  copyText.select();
  copyText.setSelectionRange(0, 99999);  // Select all text
  document.execCommand("copy");
  
  copyText.setSelectionRange(0, 0);  // Unselect all text
};

/* Wait for DOM to load before adding event listeners */
$(document).ready(addEventListeners);
function addEventListeners() {
  $(document).keydown(onKeyDown);
  $("[class^=lcd-pixel]").mousedown(e => selectLCD(e.currentTarget));
  $("body").mousedown(onMouseDown);
}

/* KEY LISTENERS */
function onKeyDown(event) {
  /* Event listener looking for key presses */

  if (event.ctrlKey || event.metaKey) {
    event.preventDefault();  // Overrides default browser hotkeys
    switch (event.key) {
        // * All Ctrl key combinations go here

        // Shifts every pixel when Ctrl and arrow keys are pressed
      case "ArrowUp":
        shiftUp();
        break;
      case "ArrowDown":
        shiftDown();
        break;
      case "ArrowLeft":
        shiftLeft();
        break;
      case "ArrowRight":
        shiftRight();
        break;

        // Other function hotkeys
      case "i":
        invertPixels();
        break;
      case "m":
        mirrorVertPixels();
        break;
      case "k":
        mirrorHoriPixels();
        break;
      case "c":
        copyToPixelClipboard();
        break;
      case "v":
        pasteToPixelEditor();
        break;
      case "s":
        saveProgress();
        break;
    }
  }
}

function onMouseDown(event) {
  if (event.target.className === "lcd-pixel") {
    selectLCD(event.target);
  }
  var clickX = event.pageX;
  var clickY = event.pageY;

  $(this).mouseup(() => removeSelection());
  $(this).mouseleave(() => removeSelection());

  $(this).append('<div id="pixel-selection"></div>')
  $(this).mousemove((e) => createSelection(e, clickX, clickY, event.ctrlKey || event.metaKey));
}

function createSelection(mouseDragEvent, clickX, clickY, deselect) {
  const dragX = mouseDragEvent.pageX;
  const dragY = mouseDragEvent.pageY;

  // This if statement is needed because the mouseleave event doesn't trigger when creating
  // a selection where the cursor is inside the selection.
  if (dragX < $(this)[0].offsetLeft || dragY < $(this)[0].offsetTop) {
    removeSelection();
  }

  const selectionX = dragX > clickX ? clickX : dragX;
  const selectionY = dragY > clickY ? clickY : dragY;

  const selectionW = dragX > clickX
      ? dragX - clickX
      : clickX - dragX;
  const selectionH = dragY > clickY
      ? dragY - clickY
      : clickY - dragY;

  $("#pixel-selection").css({
    "width": selectionW,
    "height": selectionH,
    "left": selectionX,
    "top": selectionY
  });

  $(deselect ? ".pixel-on" : ".pixel-off").each((idx, element) => {
    const leftOffset = $(element).offset().left;
    const topOffset = $(element).offset().top;
    const w = $(element).outerWidth();
    const h = $(element).outerHeight();

    const insideSelection = leftOffset > selectionX
        && (leftOffset + w) < (selectionX + selectionW)
        && topOffset > selectionY
        && (topOffset + h) < (selectionY + selectionH)
    if (insideSelection) {
      togglePixel(element);
    }
  });
}

function removeSelection() {
  $("#pixel-selection").remove();
  $("body").off("mousemove");
}