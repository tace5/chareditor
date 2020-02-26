/**
 * Contains all JavaScript functions.
 *
 * @file   This files defines all functions.
 * @author Alejandro Santiago (@alestiago)
 * @since  23.02.2020
 */

/* global selectedLCD */

/* CODE Functions */
function updateCode (){
  /* Updates the code according to editor */
	var charname = document.getElementById("pixel-editor__charname").value;
	var code_header = "byte " + charname + "[] = {";
	var code_body = "";
	var code_footer = "};";
	
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
  
  if (isCheckboxChecked("includeDefine")){
    code_header = addDefineCode(charname) + "\r\n" + code_header;
  }
  
	var full_code = code_header + "\r\n" +
                  code_body + "\r\n" +
                  code_footer;
    document.getElementById("code-box__code").value = full_code;
	
  if (isCheckboxChecked("autocopy")) copyToClipboard();
}

function addDefineCode(charname){
  /* Returns a #define text according to the name */
  var defineCode = "#define " + charname.toUpperCase() + "_CHAR 0";
  return defineCode;
}

/* PIXEL EDITOR functions */
function togglePixel (pixelID) {
  /* Toggles state of specified pixel */
	var pixel = document.getElementById(pixelID);
	if (pixel.className === "pixel-off") pixel.className = "pixel-on";
	else pixel.className = "pixel-off";
  updateCode();
  toggleLCDPixel(pixelID);
}

function clear_pixels () {
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
			togglePixel(pixelID);
		}
	}
	updateCode();
}

function mirrorPixels () {
  /* Mirrors vertically all pixels' state */
  for (var row = 0; row < 8; row++) {
    for (var col = 0; col < 2; col++) {
      var leftpixelID = "pixel-" + row + "x" + col;
      var leftpixel = document.getElementById(leftpixelID);
      var leftpixelState = leftpixel.className;
      
      var rightpixelID = "pixel-" + row + "x" + (4 - col);
      var rightpixel = document.getElementById(rightpixelID);
      var rightpixelState = rightpixel.className;
      
      // Swap
      leftpixel.className = rightpixelState;
      rightpixel.className = leftpixelState;
    }
  }
  updateCode();
  updateLCD();
}

function checkEnter (event) {
  /* Check if enter key is pressed, if so avoids action */
	if (event.keyCode == 13) return false;
}

/* PREVIEW Functions */
var selectedLCD = "lcd-0x0";

function updateLCD () {
  /* Updates all editor pixels states to selected LCD */
	for (var row = 0; row < 8; row++) {
		for (var col = 0; col < 5; col++) {
			var pixelID = "pixel-" + row + "x" + col;
			var lcdpixelID = selectedLCD + "-" + row + "x" + col;
			var lcdpixel = document.getElementById(lcdpixelID);
			var pixelState = document.getElementById(pixelID).className;
			
			if (pixelState === "pixel-off") lcdpixel.className = null;
			else lcdpixel.className = "lcd-pixel__on";
		}
	}
}

function toggleLCDPixel (pixelID) {
  /* Toggles state of specified LCD pixel */
	var LCDpixelID = selectedLCD + pixelID.substr(-4);
	var LCDpixel = document.getElementById(LCDpixelID);
	
	if (LCDpixel.className === "lcd-pixel__on") LCDpixel.className = null;
	else LCDpixel.className = "lcd-pixel__on";
}

function selectLCD (lcdID) {
  /* Selects specified LCD and updates Editor and Code */
	unselectLCD(selectedLCD); // Unselect previous	LCD
  
	var lcdpixel = document.getElementById(lcdID);
	lcdpixel.className = "lcd-pixel__selected";
	selectedLCD = lcdID;
	loadLCDtoEditor(lcdID);
	updateCode();
}

function unselectLCD (lcdID) {
  /* Removes selection of the specified LCD */
  var lcd = document.getElementById(lcdID);
  lcd.className = "lcd-pixel";
}

function loadLCDtoEditor (lcdID) {
  /* Loads specified LCD pixel to editor */
	for (var row = 0; row < 8; row++) {
		for (var col = 0; col < 5; col++) {
			var lcdpixelID = lcdID + "-" + row + "x" + col;
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
  var myCheckbox = document.getElementById(checkboxID);
  var checkedValue = myCheckbox.checked;
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

/* IMAGES functions */
function iconHovered(iconID){
  /* Changes image when hovered */
  var icon = document.getElementById(iconID);
  var hoveredImage = "images/" + iconID + "-hovered.png";
  icon.src = hoveredImage;
}

function iconUnHovered(iconID){
  /* Changes image when stoped hovered */
  var icon = document.getElementById(iconID);
  var unHoveredImage = "images/" + iconID + ".png";
  icon.src = unHoveredImage;
}