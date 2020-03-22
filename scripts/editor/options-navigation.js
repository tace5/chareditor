/* This file is part of chareditor.com
 * Refer to index.html for full license. */


/******************************
 Toggling Navigation Bar Menus
*******************************/
function showThisOption (optionIcon) {
  /**
   * Sets the icon to active and shows the corresponding option menu
   * @param {Object} optionIcon
   */
  deactivatePreviousOptionIcon();
  activateOptionIcon(optionIcon);
  
  hidePreviousOptionMenu();
  showOptionMenu(optionIcon);
}

function deactivatePreviousOptionIcon () {
  /** Removes the active class name from the previous icon */
  var previousIcon = document.getElementsByClassName("active")[0];
  previousIcon.className = null;
  optionIconUnHovered(previousIcon);
}

function activateOptionIcon (optionIcon) {
  /**
   * Sets the active class name for this icon
   * @param {Object} optionIcon
   */
  optionIconHovered(optionIcon);
  optionIcon.className = "active";
}

function hidePreviousOptionMenu () {
  /** Hides and removes the shown class name of the previous option menu */
  var previousMenu = document.getElementsByClassName("shown")[0];
  previousMenu.hidden = true;
  previousMenu.className = null;
}

function showOptionMenu (optionIcon) {
  /**
   * Shows and sets the shown class name to option menu of the icon
   * @param {Object} optionIcon
   */
  var thisOptionName = (optionIcon.id).split("-")[0];
  var showOption = "options-bar__options__" + thisOptionName;
  showOption = document.getElementById(showOption);
  showOption.hidden = false;
  showOption.className = "shown";
}


/******************************
 Image Handling of Option Icons
*******************************/
function optionIconHovered(optionIcon){
  /**
   * Changes image when hovered
   * @param {Object} optionIcon
   */
  if (optionIcon.className != "active") {
    var hoveredImage = "images/editor-icons/" + optionIcon.id + "__hovered.png";
    optionIcon.src = hoveredImage
  }
}

function optionIconUnHovered(optionIcon){
  /**
   * Changes image when stopped hovered
   * @param {Object} optionIcon
   */
  if (optionIcon.className != "active") {
    var unHoveredImage = "images/editor-icons/" + optionIcon.id + ".png";
    optionIcon.src = unHoveredImage;
  }
}