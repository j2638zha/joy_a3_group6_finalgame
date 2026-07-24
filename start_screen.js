//start_screen.js file

function drawStartScreen() {
  imageMode(CORNER);
  image(startBg, 0, 0, width, height);

  image(titleImg, width/2 - 450, height/2 - 350, 900, 300);

  drawButton("Start", width/2, 400, 320, 64, startBtnPressed);

  animateUpTest();
  drawUpAnimation(420, 470);
}

