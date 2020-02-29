/********************* 

Example code for defining a custom character for the 
Adafruit RGB Character LCD Shield.

This code displays the custom character on the shield.

**********************/

// Includes the Adafruit RGB library code:
#include <Wire.h>
#include <Adafruit_RGBLCDShield.h>
#include <utility/Adafruit_MCP23017.h>

// Define the global variable Adafruit LCD object:
Adafruit_RGBLCDShield lcd = Adafruit_RGBLCDShield();

// Define your custom character:
byte smilyFace[] = {
    B00000,
    B01010,
    B01010,
    B00000,
    B10001,
    B01110,
    B00000,
    B00000
};

byte sadFace[] = {
    B00000,
    B01010,
    B01010,
    B00000,
    B01110,
    B10001,
    B00000,
    B00000
};

void setup(){
  // Set up the LCD's number of columns and rows:
  lcd.begin(16, 2);

   // Creates new character smilyFace as 0
   // (Note: alternative you can use a macro [eg #define SMILYCHAR 0] for legibility)
  lcd.createChar(0, smilyFace);
  lcd.createChar(1, sadFace);
  
  // Sets the cursor to column 2, row 0 (zero-based)
  lcd.setCursor(2, 0);

  // Prints the character, refering to it as 0, because it was declared
  // as 0 before.
  // (Note: we use .write to print characters and .print to print strings)
  lcd.write(0);
  lcd.write(1)
}

void loop(){
}
