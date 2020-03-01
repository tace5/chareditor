/* This file is part of chareditor.com
 * Refer to index.html for full license. */
 
function showThisOption (astr) {
  hideAllOptions();
  var thisOption = getFirstToken(astr);
  var showOption = "options-bar__options__" + thisOption;
  var myOption = document.getElementById(showOption);
  myOption.hidden = false;
}

function hideAllOptions () {
  /* Hides all options */
  var options = document.getElementsByClassName("options-bar__options");
  for (var i = 0; i < options.length; i++) options[i].hidden = true;
}

function getFirstToken (myString) {
  var tokens = myString.split("-");
  var firstToken = tokens[0]
  return firstToken;
}