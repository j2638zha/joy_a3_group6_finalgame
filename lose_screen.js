//lose_screen.js file

function getLossVideoForCause(cause) {
  if (cause === "goat") return goatDeathVideo;
  if (cause === "hole") return creviceDeathVideo;
  return timeDeathVideo;
}

function drawLossScreen() {
  const vid = getLossVideoForCause(deathCause);

  if (vid) {
    if (!lossVideoStarted) {
      // Make absolutely sure no stomp audio remains before the video starts.
      cancelStompAudio();

      vid.stop();
      vid.play();
      lossVideoStarted = true;
      lossVideoFinished = false;

      vid.onended(() => {
        lossVideoFinished = true;
      });
    }

    image(vid, 0, 0, width, height);
  } else {
    image(lossBg, 0, 0, width, height);
    lossVideoFinished = true;
  }

  // Hold off on the UI until the video has actually finished.
  if (!lossVideoFinished) {
    cursor(ARROW);
    return;
  }

  // --- DEATH CAUSE TEXT ---
  push();
  textFont(gameFont);
  textAlign(RIGHT);
  textSize(42);
  textStyle(BOLD);
  fill(210, 230, 255);
  stroke(10, 15, 54);
  strokeWeight(6);
  if (deathCause === "goat") {
    text("You we're crushed by", width / 2 + 560, height * 0.34);
    text("an evil highspeed goat!", width / 2 + 560, height * 0.38);
    textSize(36);
    text("Check your surroundings!", width / 2 + 560, height * 0.44);
  } else if (deathCause === "hole") {
    text("You hit your head", width / 2 + 560, height * 0.34);
    text("during your huge fall!", width / 2 + 560, height * 0.38);
    textSize(36);
    text("Keep an eye out for the holes!", width / 2 + 560, height * 0.44);
  } else {
    // "time" and any fallback case
    text("You we're caught", width / 2 + 560, height * 0.34);
    text("in the avalanche!", width / 2 + 560, height * 0.38);
    textSize(36);
    text("Keep an eye on the time!", width / 2 + 560, height * 0.44);
  }
  pop();

  let anyHover = false;
  anyHover =
    drawButton(
      "Try Again",
      width / 2 + 400,
      height * 0.55,
      320,
      64,
      lossBtnPressed,
    ) || anyHover;
  anyHover =
    drawButton(
      "Level Picker",
      width / 2 + 400,
      height * 0.65,
      320,
      56,
      levelPickerBtnPressed,
    ) || anyHover;
  cursor(anyHover ? HAND : ARROW);
}
