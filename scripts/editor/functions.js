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

/* Functions for saving and loading app state */
function loadSavedData() {
  /**
    * Loads data stored in the browser memory
  */
  var elements = document.querySelectorAll('[data-saveable]');

  for (var i = 0; i < elements.length; i++) {
    var element = elements.item(i);

    if (localStorage.getItem(element.id)) {
      switch (element.tagName) {
        case "TEXTAREA":
        case "INPUT":
          if (element.type === "checkbox") {
            element.checked = (localStorage.getItem(element.id) === "true");
            break;
          }
          element.value = localStorage.getItem(element.id);
          break;
        default:
          element.innerHTML = localStorage.getItem(element.id);
          break;
      }
    }
  }
}

function saveProgress() {
  /**
    * Saves the current app state to browser memory
  */
  var elements = document.querySelectorAll('[data-saveable]');

  for (var i = 0; i < elements.length; i++) {
    var element = elements.item(i);

    switch (element.tagName) {
      case "TEXTAREA":
      case "INPUT":
        if (element.type === "checkbox") {
          localStorage.setItem(element.id, element.checked);
          break;
        }
        localStorage.setItem(element.id, element.value);
        break;
      default:
        localStorage.setItem(element.id, element.innerHTML);
        break;
    }
  }

  addStatusMsg("Saved!");
}

function addStatusMsg(msg) {
  /**
    * Function to display status messages in the top left corner
    * @param {string} message to be displayed inside box
  */
  $("#status-msg-box").append('<div class="status-msg">' + msg + '</div>');

  var statusMsgs = $(".status-msg").filter(function () {
    return $(this).css('opacity') === "1";
  });
  statusMsgs.first().fadeOut(1000, function () {
    statusMsgs.first().remove();
  });
}

function onBodyLoad() {
  /**
    * Handler for when page has loaded
  */
  updateCode();
  loadSavedData();
}

/* CODE Functions */
function updateCode (){
  /**
    * Updates the code according to editor
  */
  var charname = document.getElementById("pixel-editor__charname").value;
  var code_header = "byte " + charname + "[] = {";
  var code_body;
  if (isCheckboxChecked("hex-data-type")) code_body = getHexCode();
  else code_body = getBinaryCode();
  var code_footer = "};";

  if (isCheckboxChecked("include-define")){
    code_header = addDefineCode(charname) + "\r\n" + code_header;
  }
  
  if (isCheckboxChecked("single-line-code")){
    full_code = code_header + code_body + code_footer
  }
  else {
    full_code = code_header + "\r\n" + code_body + "\r\n" + code_footer
  }


  document.getElementById("code-box__code").value = full_code;
  
  if (isCheckboxChecked("autocopy")) copyToClipboard();
}

function getBinaryCode () {
  /**
    * Returns binary code according to pixels state
    * @returns {string} code in binary
  */
  var code_body = "";
  for (var row = 0; row < 8; row++) {

    if (isCheckboxChecked("single-line-code") ) code_body += "B";
    else code_body += "    B";

    for (var col = 0; col < 5; col++) {
      var pixelID = "pixel-" + row + "x" + col;
      var pixel_state = document.getElementById(pixelID).className;
			
      if (pixel_state === "pixel-off") code_body += "0";
      else code_body += "1";
    }
    if (isCheckboxChecked("single-line-code")) code_body += ", ";
    else code_body += ",\r\n";
  }

  if (isCheckboxChecked("single-line-code")) code_body = code_body.substring(0, code_body.length - 2);
  else code_body = code_body.substring(0, code_body.length - 3);
  
  return code_body
}

function getHexCode () {
  /**
    * Returns hexadecimal code according to pixels state
    * @returns {string} code in hexadecimal
  */
  var code_body = "";
  for (var row = 0; row < 8; row++) {

    if (isCheckboxChecked("single-line-code") ) code_body += "x";
    else code_body += "    0x";

    var thisLineBinary = "";
    for (var col = 0; col < 5; col++) {
      var pixelID = "pixel-" + row + "x" + col;
      var pixel_state = document.getElementById(pixelID).className;
			
      if (pixel_state === "pixel-off") thisLineBinary += "0";
      else thisLineBinary += "1";
    }
    var thisLineHex = parseInt(thisLineBinary, 2).toString(16);
    thisLineHex = thisLineHex.toUpperCase();
    if (thisLineHex.length < 2) thisLineHex = "0" + thisLineHex;

    if (isCheckboxChecked("single-line-code") )code_body += thisLineHex + ", ";
    else code_body += thisLineHex + ",\r\n";
  }

  if (isCheckboxChecked("single-line-code")) code_body = code_body.substring(0, code_body.length - 2);
  else code_body = code_body.substring(0, code_body.length - 3);
  
  return code_body
}

function addDefineCode(charName){
  /**
    * Returns a #define text according to the name
    * @param {string} charName
    * @returns {string} #define text for the given character name
   */
  var defineCode = "#define " + charName.toUpperCase() + "_CHAR 0";
  return defineCode;
}

/* PIXEL EDITOR functions */
function togglePixel (pixel) {
  /**
    * Toggles state of specified pixel
  */
  if (pixel.className === "pixel-off") pixel.className = "pixel-on";
  else pixel.className = "pixel-off";
  updateCode();
  toggleLCDPixel(pixel);
}

function clearPixels () {
  /**
    * Sets off all pixels' state of selected LCD
  */
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
  /**
    * Inverts all pixels' state of selected LCD
  */
  for (var row = 0; row < 8; row++) {
    for (var col = 0; col < 5; col++) {
      var pixelID = "pixel-" + row + "x" + col;
      togglePixel(document.getElementById(pixelID));
    }
  }
  updateCode();
}

function mirrorVertPixels () {
  /**
    * Mirrors vertically all pixels' state
  */
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
  /**
    * Mirrors horizontally all pixels' state
  */
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
  /**
    * Copies current state of editor to the clipboard
  */
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
  /**
    * Paste current state of clipboard to editor
  */
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

function cutPixelEditor () {
  /**
    * Pastes and delete current pixel editor
  */

  copyToPixelClipboard();
  clearPixels();
}

function shiftUp () {
  /**
    * Shifts every pixel upwards
  */
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
  /**
    * Shift every pixel in editor downwards
  */
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
  /**
    * Shifts every pixel in editor leftwards
  */
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
  /**
    Shift every pixel in editor rightwards
  */
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

function getSelectedLCD () {
  /**
    * Returns the current selected LCD:
    * @returns {HTMLobject} selectedLCD
  */
  var selectedLCD = document.getElementsByClassName("lcd-pixel__selected")[0];
  return selectedLCD;

}

function updateLCD () {
  /**
    * Updates all editor pixels states to selected LCD
  */
  for (var row = 0; row < 8; row++) {
    for (var col = 0; col < 5; col++) {
      var pixelID = "pixel-" + row + "x" + col;
      var pixelState = document.getElementById(pixelID).className;
      var lcdpixelID = getSelectedLCD().id + "-" + row + "x" + col;
      var lcdpixel = document.getElementById(lcdpixelID);
 
      if (pixelState === "pixel-off") lcdpixel.className = null;
      else lcdpixel.className = "lcd-pixel__on";
    }
  }
}

function toggleLCDPixel (pixel) {
  /**
    * Toggles state of specified LCD pixel
    * @param {string} pixel
  */
  var LCDpixelID = getSelectedLCD().id + pixel.id.substr(-4);
  var LCDpixel = document.getElementById(LCDpixelID);
  
  if (LCDpixel.className === "lcd-pixel__on") LCDpixel.className = null;
  else LCDpixel.className = "lcd-pixel__on";
}

function selectLCD (lcdpixel) {
  /**
    * Selects specified LCD and updates Editor and Code
    * @param {Object} lcdpixel
  */
  unselectLCD(getSelectedLCD()); // Unselect previous	LCD
  lcdpixel.className = "lcd-pixel__selected";
  loadLCDtoEditor(lcdpixel);
  updateCode();
}

function unselectLCD (lcd) {
  /**
    * Removes selection of the specified LCD
    * @param {Object} lcd
  */
  lcd.className = "lcd-pixel";
}

function loadLCDtoEditor (lcd) {
  /**
    * Loads specified LCD pixel to editor
    * @param {Object} lcd
  */
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
  /**
    * Checks if the checkbox is checked or not
    * @returns {boolean} according to the checkbox checked property
  */
  var thisCheckbox = document.getElementById(checkboxID);
  var checkedValue = thisCheckbox.checked;
  return checkedValue;
}

function copyToClipboard () {
  /**
    * Copies content of code text area to clipboard
  */
  var copyText = document.getElementById("code-box__code");
  
  copyText.select();
  copyText.setSelectionRange(0, 99999);  // Select all text
  document.execCommand("copy");
  
  copyText.setSelectionRange(0, 0);  // Deselects all text
};


function getSelectedCharCoords () {
  /**
    * Function to get the co-ordinates of the selected character
    * @returns {Array<integer>} of coordinates
  */

  // Gets the currently selected character on the LCD screen
  var selChar = getSelectedLCD().id;
  var row = Number(selChar.substring(selChar.indexOf("-") + 1, selChar.indexOf("x")));
  var column = Number(selChar.substring(selChar.indexOf("x") + 1));
  
  return [row, column];
}



function shiftChar (shiftRowBy, shiftColumnBy) {
 /**
    * Shifts the selected character on the LCD screen by parameters provided.
    * @param {integer} shiftRowBy to shift the row index
    * @param {integer} shiftColumnBy to shift the column index
    * Negative integers are accepted and will decrease the index.
    * If a shift will result in out of bounds selection, the shift is aborted.
  */

  // retrieves
  var row = getSelectedCharCoords()[0];
  var column = getSelectedCharCoords()[1];

  try {
    var id = "lcd-" + (row + shiftRowBy) + "x" + (column + shiftColumnBy);
    var tableObj = document.getElementById(id);
    selectLCD(tableObj);
  } catch (error) {
    var id = "lcd-" + row + "x" + column;
    var tableObj = document.getElementById(id);
    selectLCD(tableObj);
  }
}


/* KEY LISTENERS */
document.addEventListener("keydown", function (event) {
  /* Event listener looking for key presses */ 

  if (!event.shiftKey) {    // ! Shift key is unused as it interferes with text selection
    
    if (event.altKey && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();  // Overrides default browser hotkeys

      switch (event.code) {
        // * All Ctrl+Shift key combinations go here

        // Shifting the selected character on the LCD screen
        case "ArrowUp":     shiftChar(-1, 0);
          break;
        case "ArrowDown":   shiftChar(1, 0);
          break;
        case "ArrowLeft":   shiftChar(0, -1);
          break;
        case "ArrowRight":  shiftChar(0, 1);
      }

    } else if (event.ctrlKey || event.metaKey) {
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
        case "x":
          cutPixelEditor();
          break;
        case "s":
          saveProgress();
          break;
      } 
    }
  }
});
