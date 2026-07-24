//win_screen.js file

function drawWinScreen() {
  image(winBg, 0, 0, width, height);

  // --- DRAW STARS ---
  let startX = width/2 - 140;   // leftmost star
  let y = height/2 + 10;       // vertical position
  let starW = 110;
  let starH = 110;
  const drawOrder = [0, 2, 1];

  for (let i = 0; i < 3; i++) {
    let starIndex = drawOrder[i];
    let sx = startX + i * 80;
    let yOffset = (i === 1) ? -10 : 0;
    if (starIndex < starsEarned) {
      image(starFilledImg, sx, y + yOffset, starW, starH);
    } else {
      image(starOutlineImg, sx, y + yOffset, starW, starH);
    }
  }


  textFont(gameFont);
  textAlign(CENTER);
  stroke(10, 15, 54);
  strokeWeight(6);

  let minutes = floor(finalTime / 60);
  let seconds = finalTime % 60;
  let timeText = minutes + ":" + nf(seconds, 2);

  fill(255);
  textSize(36);
  text("Current Time: " + timeText, width / 2, height / 2 - 40);

  let key = "level" + currentLevel;
  let fastestLabel = fastestTimesIsNew[key]
    ? "NEW fastest time: "
    : "Fastest time: ";

  let fastestText = fastestTimes[key] === null
    ? "--:--"
    : floor(fastestTimes[key] / 60) + ":" + nf(fastestTimes[key] % 60, 2);
  text(fastestLabel + fastestText, width / 2, height / 2 - 10);

  let anyHover = false;
  anyHover = drawButton("Level Picker", width/2, height*0.90, 320, 56, levelPickerBtnPressed) || anyHover;
  cursor(anyHover ? HAND : ARROW);
}