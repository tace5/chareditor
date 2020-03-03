/* This file is part of chareditor.com
 * Refer to index.html for full license. */
 
/******************************
  Handle hovering over icons
*******************************/
function iconHovered(icon, target){
  /* Changes image when hovered */
  if (target === undefined) target = icon;
  var hoveredImage = "images/editor-icons/" + icon.id + "__hovered.png";
  target.src = hoveredImage
}

function iconUnHovered(icon){
  /* Changes image when stoped hovered */
  var unHoveredImage = "images/editor-icons/" + icon.id + ".png";
  icon.src = unHoveredImage;
}
