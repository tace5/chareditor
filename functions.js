/* Code Functions */
function update_code(){
	var charname = document.getElementById("charname").value;
	var code_header = "byte " + charname + "[] = {"
	var code_body = "";
	var code_footer = "};"
	
	for (var row=0; row<8; row++){
		code_body += "    B";
		for (var col=0; col<5; col++) {
			var pixelID = "pixel-" + row + "x" + col;
			var pixel_state = document.getElementById(pixelID).className
			
			if (pixel_state == "pixel_off") code_body += "0";
			else code_body += "1";
		}
		code_body += ",\r\n";
	}
	
	code_body = code_body.substring(0, code_body.length - 3)
	var full_code = code_header + "\r\n" + code_body + "\r\n" + code_footer;
	document.getElementById("code").value = full_code;
}

/* Pixel editor functions */	
function toggle_pixel(pixelID){
	var pixel = document.getElementById(pixelID);
	if (pixel.className == "pixel_off") pixel.className = "pixel_on";
	else pixel.className = "pixel_off";
	update_code();
	preview();
}

function clear_pixels(){
	for (var row=0; row<8; row++){
		for (var col=0; col<5; col++) {
			var pixelID = "pixel-" + row + "x" + col;
			var pixel = document.getElementById(pixelID);
			pixel.className = "pixel_off";
		}
	}
	update_code();
	preview();
}

function invert_pixels(){
	for (var row=0; row<8; row++){
		for (var col=0; col<5; col++) {
			var pixelID = "pixel-" + row + "x" + col;
			toggle_pixel(pixelID);
		}
	}
	update_code();
	preview();
}

function checkEnter(event) {
	if (event.keyCode == 13) return false;
}

/* Preview Functions */
var sel_lcd_id = "lcd-0x0";

function preview(){
	for (var row=0; row<8; row++){
		for (var col=0; col<5; col++) {
			var pixelID = "pixel-" + row + "x" + col;
			var lcdpixelID = sel_lcd_id + "-" + row + "x" + col;
			var lcdpixel = document.getElementById(lcdpixelID);
			var pixel_state = document.getElementById(pixelID).className;
			
			if (pixel_state == "pixel_off") lcdpixel.className = null;
			else lcdpixel.className = "lcd_pixel_on";
		}
	}
}

function select_lcd(lcdID){
	unselect_all();	
	var lcdpixel = document.getElementById(lcdID);
	lcdpixel.className = "lcd_pixel_selected";
	sel_lcd_id = lcdID;
	load_lcd_to_editor(lcdID);
	update_code();
}

function unselect_all(){
	for (var row=0; row<2; row++){
		for (var col=0; col<16; col++) {
			var lcdID = "lcd-" + row + "x" + col;
			var lcdpixel = document.getElementById(lcdID);
			lcdpixel.className = "lcd_pixel";
		}
	}
}

function load_lcd_to_editor(lcdID){
	for (var row=0; row<8; row++){
		for (var col=0; col<5; col++) {
			var lcdpixelID = lcdID + "-" + row + "x" + col;
			var lcdpixel = document.getElementById(lcdpixelID);
			var lcdpixel_state = lcdpixel.className;
			
			var pixelID = "pixel-" + row + "x" + col;
			var pixel = document.getElementById(pixelID);
			
			if (lcdpixel_state == "lcd_pixel_on") pixel.className = "pixel_on";
			else pixel.className = "pixel_off";
		}
	}
}