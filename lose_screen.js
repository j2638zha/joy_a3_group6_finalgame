//lose_screen.js file

function drawLossScreen() {
  image(lossBg, 0, 0, width, height);

  fill(245, 155, 66);
  stroke(10, 15, 54);
  strokeWeight(8);
  textFont(gameFont);
  textAlign(CENTER);
  textSize(36);

  let anyHover = false;
  anyHover = drawButton("Try Again", width/2, height*0.45, 320, 64, lossBtnPressed) || anyHover;
  anyHover =   drawButton("Level Picker", width/2, height*0.90, 320, 56, levelPickerBtnPressed) || anyHover;
  cursor(anyHover ? HAND : ARROW);
}