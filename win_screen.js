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

// ============================================================
// FINAL WIN STORY — PLAYS AFTER COMPLETING LEVEL 3
// ============================================================

let winStoryPanels = [];
let winStoryPreviousFrame = null;

let winStoryEntering = false;
let winStoryFadeToBlack = 0;

let winStoryPanel = 0;
let winStoryPanelAlpha = 0;
let winStoryAutoTimer = 0;

let winStoryZoom = 1;
let winStoryLastPanel = -1;

const WIN_STORY_PANEL_COUNT = 4;

// Same values used by the opening story.
const WIN_STORY_BLACK_SPEED = 15;
const WIN_STORY_FADE_SPEED = 12;
const WIN_STORY_AUTO_DELAY = 180;

const WIN_STORY_ZOOM_START = 1.0;
const WIN_STORY_ZOOM_MAX = 1.12;
const WIN_STORY_ZOOM_SPEED = 0.0006;

const WIN_STORY_SKIP_BTN = {
  x: 0,
  y: 0,
  w: 160,
  h: 50,
};

const WIN_STORY_END_BTN = {
  x: 0,
  y: 0,
  w: 260,
  h: 50,
};

// ------------------------------------------------------------
// PRELOAD
// ------------------------------------------------------------

function preloadWinStoryAssets() {
  for (let i = 0; i < WIN_STORY_PANEL_COUNT; i++) {
    winStoryPanels[i] = loadImage(
      "assets/images/win_screen_story_panel_" + (i + 1) + ".png",
    );
  }
}

// ------------------------------------------------------------
// START / STOP
// ------------------------------------------------------------

function beginWinStory() {
  // Capture the gameplay screen so it can fade smoothly to black.
  winStoryPreviousFrame = get();

  gameState = "win_story";

  winStoryEntering = true;
  winStoryFadeToBlack = 0;

  winStoryPanel = 0;
  winStoryPanelAlpha = 0;
  winStoryAutoTimer = 0;

  winStoryZoom = WIN_STORY_ZOOM_START;
  winStoryLastPanel = -1;

  timerStarted = false;
  player.isMoving = false;

  // Stop gameplay audio.
  if (typeof cancelStompAudio === "function") {
    cancelStompAudio();
  }

  if (walkSound && walkSound.isPlaying()) {
    walkSound.stop();
  }

  if (goatSound && goatSound.isPlaying()) {
    goatSound.stop();
  }

  if (fishCallNear && fishCallNear.isPlaying()) {
    fishCallNear.stop();
  }

  for (const clip of fishCallFar) {
    if (clip && clip.isPlaying()) {
      clip.stop();
    }
  }

  cursor(ARROW);
}

function leaveWinStory() {
  winStoryPreviousFrame = null;
  gameState = "level_picker";
  cursor(ARROW);
}

// ------------------------------------------------------------
// PANEL CONTROL
// ------------------------------------------------------------

function goToWinStoryPanel(panelNumber) {
  winStoryPanel = constrain(panelNumber, 0, WIN_STORY_PANEL_COUNT - 1);

  winStoryPanelAlpha = 0;
  winStoryAutoTimer = 0;
  winStoryZoom = WIN_STORY_ZOOM_START;
  winStoryLastPanel = -1;

  if (cardSwitchSound && cardSwitchSound.isLoaded()) {
    cardSwitchSound.play();
  }
}

function skipWinStory() {
  if (winStoryEntering) return;

  // Jump to the credits, but let them fade in normally.
  goToWinStoryPanel(WIN_STORY_PANEL_COUNT - 1);
}

function advanceWinStory() {
  if (winStoryEntering) return;

  // First press during a fade finishes the current fade.
  if (winStoryPanelAlpha < 255) {
    winStoryPanelAlpha = 255;
    return;
  }

  // Leaving the credits returns to the Level Picker.
  if (winStoryPanel >= WIN_STORY_PANEL_COUNT - 1) {
    leaveWinStory();
    return;
  }

  goToWinStoryPanel(winStoryPanel + 1);
}

// ------------------------------------------------------------
// PANEL SIZE
// Same centered single-panel layout as the beginning story.
// ------------------------------------------------------------

function winStoryPanelRect(img) {
  const pad = 24;
  const topMargin = 40;
  const bottomMargin = 110;

  const areaW = width - pad * 2;
  const areaH = height - topMargin - bottomMargin;

  const aspect = img && img.height > 0 ? img.width / img.height : 1.75;

  let panelW = min(areaW, areaH * aspect);
  let panelH = panelW / aspect;

  const panelX = (width - panelW) / 2;
  const panelY = topMargin + (areaH - panelH) / 2;

  return {
    x: panelX,
    y: panelY,
    w: panelW,
    h: panelH,
  };
}

// ------------------------------------------------------------
// DRAW
// ------------------------------------------------------------

function drawWinStoryScreen() {
  background(0);

  // ----------------------------------------------------------
  // FADE FROM THE FINAL GAMEPLAY FRAME TO BLACK
  // ----------------------------------------------------------

  if (winStoryEntering) {
    if (winStoryPreviousFrame) {
      image(winStoryPreviousFrame, 0, 0, width, height);
    }

    push();
    resetMatrix();
    rectMode(CORNER);
    noStroke();
    fill(0, winStoryFadeToBlack);
    rect(0, 0, width, height);
    pop();

    winStoryFadeToBlack = min(255, winStoryFadeToBlack + WIN_STORY_BLACK_SPEED);

    if (winStoryFadeToBlack >= 255) {
      winStoryEntering = false;
      winStoryPreviousFrame = null;
    }

    cursor(ARROW);
    return;
  }

  // ----------------------------------------------------------
  // RESET ZOOM WHEN A NEW PANEL BEGINS
  // ----------------------------------------------------------

  if (winStoryPanel !== winStoryLastPanel) {
    winStoryZoom = WIN_STORY_ZOOM_START;
    winStoryLastPanel = winStoryPanel;
  }

  winStoryZoom = min(WIN_STORY_ZOOM_MAX, winStoryZoom + WIN_STORY_ZOOM_SPEED);

  // ----------------------------------------------------------
  // FADE IN CURRENT PANEL
  // ----------------------------------------------------------

  if (winStoryPanelAlpha < 255) {
    winStoryPanelAlpha = min(255, winStoryPanelAlpha + WIN_STORY_FADE_SPEED);
  } else if (winStoryPanel < WIN_STORY_PANEL_COUNT - 1) {
    // Hold the fully visible panel before moving forward.
    winStoryAutoTimer++;

    if (winStoryAutoTimer >= WIN_STORY_AUTO_DELAY) {
      goToWinStoryPanel(winStoryPanel + 1);
    }
  }

  // ----------------------------------------------------------
  // DRAW CURRENT PANEL
  // ----------------------------------------------------------

  const img = winStoryPanels[winStoryPanel];

  if (img) {
    const r = winStoryPanelRect(img);

    const zoomedW = r.w * winStoryZoom;
    const zoomedH = r.h * winStoryZoom;

    const zoomedX = r.x - (zoomedW - r.w) / 2;

    const zoomedY = r.y - (zoomedH - r.h) / 2;

    push();
    tint(255, winStoryPanelAlpha);
    image(img, zoomedX, zoomedY, zoomedW, zoomedH);
    noTint();
    pop();
  }

  // ----------------------------------------------------------
  // BUTTONS
  // ----------------------------------------------------------

  let buttonHovered = false;

  if (winStoryPanel < WIN_STORY_PANEL_COUNT - 1) {
    WIN_STORY_SKIP_BTN.x = 120;
    WIN_STORY_SKIP_BTN.y = height - 42;

    buttonHovered =
      drawButton(
        "Skip",
        WIN_STORY_SKIP_BTN.x,
        WIN_STORY_SKIP_BTN.y,
        WIN_STORY_SKIP_BTN.w,
        WIN_STORY_SKIP_BTN.h,
        false,
      ) || buttonHovered;
  } else if (winStoryPanelAlpha >= 255) {
    WIN_STORY_END_BTN.x = width - 160;
    WIN_STORY_END_BTN.y = height - 42;

    buttonHovered =
      drawButton(
        "Level Picker",
        WIN_STORY_END_BTN.x,
        WIN_STORY_END_BTN.y,
        WIN_STORY_END_BTN.w,
        WIN_STORY_END_BTN.h,
        false,
      ) || buttonHovered;
  }

  cursor(buttonHovered ? HAND : ARROW);
}

// ------------------------------------------------------------
// MOUSE INPUT
// ------------------------------------------------------------

function hitWinStoryButton(button) {
  return (
    mouseX > button.x - button.w / 2 &&
    mouseX < button.x + button.w / 2 &&
    mouseY > button.y - button.h / 2 &&
    mouseY < button.y + button.h / 2
  );
}

function handleWinStoryClick() {
  if (winStoryEntering) {
    return true;
  }

  if (
    winStoryPanel < WIN_STORY_PANEL_COUNT - 1 &&
    hitWinStoryButton(WIN_STORY_SKIP_BTN)
  ) {
    playButtonClickSound();
    skipWinStory();
    return true;
  }

  if (
    winStoryPanel === WIN_STORY_PANEL_COUNT - 1 &&
    winStoryPanelAlpha >= 255 &&
    hitWinStoryButton(WIN_STORY_END_BTN)
  ) {
    playButtonClickSound();
    leaveWinStory();
    return true;
  }

  return true;
}
