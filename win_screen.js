//win_screen.js file

function drawWinScreen() {
  image(winBg, 0, 0, width, height);

  // --- DRAW STARS ---
  let startX = width / 2 - 140; // leftmost star
  let y = height / 2 + 10; // vertical position
  let starW = 110;
  let starH = 110;
  const drawOrder = [0, 2, 1];

  for (let i = 0; i < 3; i++) {
    let sx = startX + i * 80;
    let yOffset = i === 1 ? -10 : 0;
    if (i < starsEarned) {
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

  let fastestText =
    fastestTimes[key] === null
      ? "--:--"
      : floor(fastestTimes[key] / 60) + ":" + nf(fastestTimes[key] % 60, 2);
  text(fastestLabel + fastestText, width / 2, height / 2 - 10);

  let anyHover = false;

  // After Level 3, this button opens the ending story.
  // Levels 1 and 2 still return to the Level Picker.
  const winButtonText = currentLevel === 3 ? "Continue" : "Level Picker";

  anyHover =
    drawButton(
      winButtonText,
      width / 2,
      height * 0.9,
      320,
      56,
      levelPickerBtnPressed,
    ) || anyHover;

  cursor(anyHover ? HAND : ARROW);
}

// NOTE: the ending story now lives entirely in win_story.js.
// The old copy that used to sit here was removed because it declared the
// same globals (winStoryPanels, WIN_STORY_PANEL_COUNT, ...) as win_story.js,
// which is a hard SyntaxError when both files are loaded.
