//level_picker.js file

let infoOpen = false;
const INFO_CLOSED_X = -1100; // off screen left
const INFO_OPEN_X = 100; // where box stops
const INFO_SPEED = 50;
const CLOSE_BTN_SIZE = 60;
const CLOSE_BTN_OFFSET_X = 70;
const CLOSE_BTN_OFFSET_Y = 100;
let infoBoxX = INFO_CLOSED_X;

// Level picker assets
let currentLevel = 1;
let lock_icon;
let check_icon;
let info_box;
let xButtonImg;
let level1Complete = false;
let level2Complete = false;
let level3Complete = false;

let levelShake = [0, 0, 0];
const PANEL_CLOSED_X = 1600;
const PANEL_OPEN_X = 700;
const PANEL_SPEED = 0.35;
let levelPanels = [
  {
    title: "Rocky Range",
    starScore: "--",
    recordTime: "...",
    x: PANEL_CLOSED_X,
    targetX: PANEL_CLOSED_X,
  },
  {
    title: "Frozen Fissures",
    starScore: "--",
    recordTime: "...",
    x: PANEL_CLOSED_X,
    targetX: PANEL_CLOSED_X,
  },
  {
    title: "Ram Ridge",
    starScore: "--",
    recordTime: "...",
    x: PANEL_CLOSED_X,
    targetX: PANEL_CLOSED_X,
  },
];

// How to Play button position and size
const HOW_TO_PLAY_X = 25;
const HOW_TO_PLAY_Y = 25;
const HOW_TO_PLAY_W = 280;
const HOW_TO_PLAY_H = 70;

let activePanelIndex = -1;
let nextPanelIndex = -1;
let isClosingPanel = false;
let playBtnPressed = [false, false, false];

// ============================================================
// LOCK BREAK ANIMATION
// ============================================================

// Circle positions, hoisted out of drawLevelPickerScreen so the
// animation knows where each lock starts from.
const LEVEL_CIRCLES = [
  { x: 570, y: 155 },
  { x: 565, y: 395 },
  { x: 531, y: 622 },
];

// Mirrors how the static lock is drawn in drawLevelCircle():
// image(lock_icon, cx - 40 - 25, cy - 40, 180, 140)
const LOCK_DRAW_W = 180;
const LOCK_DRAW_H = 140;
const LOCK_OFFSET_X = -65;
const LOCK_OFFSET_Y = -40;

const LOCK_BREAK_TARGET_SCALE = 3.0; // final size of the flying lock
const LOCK_BREAK_TRAVEL_FRAMES = 45; // ~0.75s to reach centre
const LOCK_BREAK_PAUSE_FRAMES = 15; // beat at full size before it cracks
const LOCK_BREAK_ANIM_SPEED = 3; // frames held per sprite frame
const LOCK_BREAK_HOLD_FRAMES = 3; // how long the final frame lingers
const LOCK_BREAK_DISPLAY_SCALE = 1.0; // ← tune so the break sheet matches the flying lock
const LOCK_BREAK_DIM_ALPHA = 150; // set to 0 to remove the background dim

let pendingUnlockIndex = -1;
let unlockSound;
let lockBreakState = "idle"; // "idle" | "moving" | "breaking"
let lockBreakIndex = -1;
let lockBreakT = 0;
let lockBreakFrame = 0;
let lockBreakFrameTimer = 0;
let lockBreakHoldTimer = 0;
let unlockAnimPlayed = [true, false, false]; // level 1 has no lock

// Called from the win block in sketch.js. justBeatenLevel is 1-based, so
// it doubles as the 0-based index of the level it unlocks.
function queueLockBreak(justBeatenLevel) {
  const nextIndex = justBeatenLevel;
  if (nextIndex > 2) return; // beat level 3, nothing left to unlock
  if (unlockAnimPlayed[nextIndex]) return; // already unlocked before
  if (bestStars["level" + justBeatenLevel] < 1) return; // no star, no unlock
  pendingUnlockIndex = nextIndex;
}

// Sound effect for the lock popping open after a level is beaten.
function playUnlockSound() {
  if (!unlockSound || !unlockSound.isLoaded()) return;
  if (typeof audioUnlocked !== "undefined" && !audioUnlocked) return;
  if (unlockSound.isPlaying()) unlockSound.stop();
  unlockSound.setVolume(0.8);
  unlockSound.play();
}

function startLockBreak(index) {
  lockBreakIndex = index;
  lockBreakState = "moving";
  lockBreakT = 0;
  lockBreakFrame = 0;
  lockBreakFrameTimer = 0;
  lockBreakHoldTimer = 0;
  unlockAnimPlayed[index] = true;
}

function finishLockBreak() {
  lockBreakState = "idle";
  lockBreakIndex = -1;
  lockBreakT = 0;
  lockBreakFrame = 0;
  lockBreakFrameTimer = 0;
  lockBreakHoldTimer = 0;
}

function updateLevelCompletionFlags() {
  level1Complete = bestStars.level1 >= 1;
  level2Complete = bestStars.level2 >= 1;
  level3Complete = bestStars.level3 >= 1;
}

// A level counts as locked while its own lock is mid-animation, so the
// circle keeps its lock until the break finishes.
function isLevelUnlocked(index) {
  if (index === 0) return true;
  if (lockBreakState !== "idle" && lockBreakIndex === index) return false;
  return index === 1 ? level1Complete : level2Complete;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function drawLockBreakAnimation() {
  if (lockBreakState === "idle") return;

  const cfg = SPRITES.lockBreak;
  const targetX = width / 2;
  const targetY = height / 2;

  const circle = LEVEL_CIRCLES[lockBreakIndex];
  const startX = circle.x + LOCK_OFFSET_X + LOCK_DRAW_W / 2;
  const startY = circle.y + LOCK_OFFSET_Y + LOCK_DRAW_H / 2;

  // Dim the map so the lock reads clearly.
  if (LOCK_BREAK_DIM_ALPHA > 0) {
    push();
    noStroke();
    const dim =
      lockBreakState === "moving"
        ? LOCK_BREAK_DIM_ALPHA * min(1, lockBreakT * 2)
        : LOCK_BREAK_DIM_ALPHA;
    fill(5, 12, 40, dim);
    rect(0, 0, width, height);
    pop();
  }

  cursor(ARROW);

  // ---- PHASE 1: fly to centre + scale up ----
  if (lockBreakState === "moving") {
    const t = easeOutCubic(lockBreakT);
    const x = lerp(startX, targetX, t);
    const y = lerp(startY, targetY, t);
    const s = lerp(1, LOCK_BREAK_TARGET_SCALE, t);
    const w = LOCK_DRAW_W * s;
    const h = LOCK_DRAW_H * s;

    image(lock_icon, x - w / 2, y - h / 2, w, h);

    if (lockBreakT < 1) {
      lockBreakT = min(1, lockBreakT + 1 / LOCK_BREAK_TRAVEL_FRAMES);
    } else if (++lockBreakHoldTimer >= LOCK_BREAK_PAUSE_FRAMES) {
      lockBreakState = "breaking";
      lockBreakFrame = 0;
      lockBreakFrameTimer = 0;
      lockBreakHoldTimer = 0;
      playUnlockSound(); // synced to the moment the lock cracks
    }
    return;
  }

  // ---- PHASE 2: break ----
  const f = lockBreakFrame;
  const S = cfg.scale * LOCK_BREAK_DISPLAY_SCALE;

  const cropL = cfg.cropLeft[f] || 0;
  const cropR = cfg.cropRight[f] || 0;
  const cropT = cfg.cropTop[f] || 0;
  const cropB = cfg.cropBottom[f] || 0;

  const sx = f * cfg.frameWidth + cropL;
  const sy = cropT;
  const sw = cfg.frameWidth - cropL - cropR;
  const sh = cfg.frameHeight - cropT - cropB;

  // Anchor on the UNCROPPED frame box so per-frame crops don't make it jitter.
  const fullW = cfg.frameWidth * S;
  const fullH = cfg.frameHeight * S;
  const left = targetX - fullW / 2 + cropL * S;
  const top = targetY - fullH / 2 + cropT * S;

  image(cfg.img, left, top, sw * S, sh * S, sx, sy, sw, sh);

  lockBreakFrameTimer++;

  if (lockBreakFrame < cfg.numFrames - 1) {
    if (lockBreakFrameTimer >= LOCK_BREAK_ANIM_SPEED) {
      lockBreakFrameTimer = 0;
      lockBreakFrame++;
    }
  } else if (
    lockBreakFrameTimer >=
    LOCK_BREAK_ANIM_SPEED + LOCK_BREAK_HOLD_FRAMES
  ) {
    finishLockBreak(); // last frame and lock both disappear; circle is now unlocked
  }
}

function preloadLevelPickerAssets() {
  levelPickerBg = loadImage("assets/images/level_picker.JPG");
  lock_icon = loadImage("assets/images/lock_icon.png");
  check_icon = loadImage("assets/images/check_icon.png");
  info_box = loadImage("assets/images/level_info_box.png");
  popUpCard = loadImage("assets/images/pop_up_card.png");
  foundPopupCard = loadImage("assets/images/Foundpopup_card.png");
  wideBoxImg = loadImage("assets/images/bigger_box.png");
  xButtonImg = loadImage("assets/images/x_button.png");
  // ← rename this to whatever your lock break sprite sheet is actually called
  SPRITES.lockBreak.img = loadImage("assets/images/lock_break.png");
  unlockSound = loadSound("assets/sounds/unlock_sound.mp3");
}

function drawLevelPickerScreen() {
  cursor(ARROW);
  image(levelPickerBg, 0, 0, width, height);

  updateLevelCompletionFlags();

  // Fire a queued unlock the moment the player lands on this screen
  if (pendingUnlockIndex !== -1 && lockBreakState === "idle") {
    startLockBreak(pendingUnlockIndex);
    pendingUnlockIndex = -1;
  }

  textFont(gameFont);
  textAlign(CENTER);
  fill(255);
  stroke(10, 15, 54);
  strokeWeight(8);
  textSize(80);
  text("Select a Level", width / 2 - 20, 70);

  let radius = 73 / 2;

  for (let i = 0; i < 3; i++) {
    drawLevelCircle(
      LEVEL_CIRCLES[i].x,
      LEVEL_CIRCLES[i].y,
      radius,
      isLevelUnlocked(i),
      i,
    );
  }

  for (let i = 0; i < levelPanels.length; i++) {
    let key = "level" + (i + 1); // level1, level2, level3
    levelPanels[i].recordTime = formatTime(fastestTimes[key]);
  }

  for (let i = 0; i < levelPanels.length; i++) {
    // decide target based on state
    if (isClosingPanel && i === activePanelIndex) {
      levelPanels[i].targetX = PANEL_CLOSED_X; // force current to close
    } else if (i === activePanelIndex) {
      levelPanels[i].targetX = PANEL_OPEN_X; // open active
    } else {
      levelPanels[i].targetX = PANEL_CLOSED_X; // others closed
    }
    let dx = levelPanels[i].targetX - levelPanels[i].x;
    let step = 50; // adjust to taste

    if (Math.abs(dx) < step) {
      levelPanels[i].x = levelPanels[i].targetX;
    } else {
      levelPanels[i].x += Math.sign(dx) * step;
    }
    drawInfoPanel(i);
  }

  // after movement, check if closing finished
  if (isClosingPanel && activePanelIndex !== -1) {
    let panel = levelPanels[activePanelIndex];
    if (Math.abs(panel.x - PANEL_CLOSED_X) < 1) {
      // fully closed → switch to next panel
      activePanelIndex = nextPanelIndex;
      nextPanelIndex = -1;
      isClosingPanel = false;
    }
  }

  drawObjectiveInfoButton();
  drawObjectiveInfoBox();

  // Draw last so the unlock sequence sits above everything else.
  drawLockBreakAnimation();
}

function drawLevelCircle(cx, cy, radius, unlocked, index) {
  let d = dist(mouseX, mouseY, cx, cy);
  let hovered = d < radius;

  let shakeOffset = 0;
  if (!unlocked && levelShake[index] > 0) {
    shakeOffset = sin(frameCount * 0.5) * 5;
    levelShake[index]--;
  }

  noStroke();
  noFill();
  circle(cx + shakeOffset, cy, radius * 2);

  if (hovered && unlocked) {
    cursor(HAND);
  }

  // Hide the static lock while this one is flying to the centre / breaking.
  if (!unlocked && !(lockBreakState !== "idle" && lockBreakIndex === index)) {
    noStroke();
    image(lock_icon, cx - 40 + shakeOffset - 25, cy - 40, 180, 140);
  }

  // --- CHECKMARK FOR COMPLETED LEVELS ---
  let levelKey = "level" + (index + 1);
  if (bestStars[levelKey] >= 1) {
    // Draw checkmark slightly to the right of the circle
    let checkX = cx + radius - 42;
    let checkY = cy - radius + 25;
    image(check_icon, checkX, checkY, 70, 70);
  }
}

function drawInfoPanel(index) {
  let panel = levelPanels[index];
  let x = panel.x;
  let y = 175;
  const PANEL_W = 500;
  const PANEL_H = 500;

  image(info_box, x, y, PANEL_W, PANEL_H);

  let centerX = x + PANEL_W / 2;
  fill(255);
  noStroke();
  textFont(gameFont);
  textAlign(CENTER, CENTER);

  textSize(60);
  text(panel.title, centerX, y + 80);

  textSize(46);
  text("Level " + (index + 1), centerX, y + 130);

  // --- DRAW STARS ---
  let startX = x + 108; // horizontal starting point
  let starY = y + 160; // vertical base position
  let starW = 120;
  let starH = 120;
  const drawOrder = [0, 2, 1];

  for (let i = 0; i < 3; i++) {
    let sx = startX + i * 82;
    let yOffset = i === 1 ? -10 : 0; // middle star visually higher

    if (i < bestStars["level" + (index + 1)]) {
      image(starFilledImg, sx, starY + yOffset, starW, starH);
    } else {
      image(starOutlineImg, sx, starY + yOffset, starW, starH);
    }
  }

  // --- DRAW FASTEST TIME ---
  let key = "level" + (index + 1);
  let fastest = fastestTimes[key];
  let fastestText =
    fastest === null
      ? "--:--"
      : floor(fastest / 60) + ":" + nf(fastest % 60, 2);

  // store into panel so your existing text() calls work
  panel.recordTime = fastestText;
  textSize(38);
  text("Fastest Descent:", centerX, y + 280);
  textSize(68);
  text(panel.recordTime, centerX, y + 320);

  let btnX = x + PANEL_W / 2;
  let btnY = y + PANEL_H - 100;

  // Determine if the player has played this level before
  let levelKey = "level" + (index + 1);
  let hasPlayed = fastestTimes[levelKey] !== null || bestStars[levelKey] > 0;

  // Button label
  let btnLabel = hasPlayed ? "PLAY AGAIN" : "PLAY";

  // Draw button
  let hovered = drawButton(
    btnLabel,
    btnX,
    btnY,
    220,
    60,
    playBtnPressed[index],
  );

  // store hover if you need it later
  levelPanels[index].playHover = hovered;

  // 🔹 make cursor a pointer when ENTER is hovered
  if (hovered) {
    cursor(HAND);
  }
}

function handleLevelPickerClick() {
  // Ignore every click while the unlock sequence is playing.
  if (lockBreakState !== "idle") return;

  // -----------------------
  // Close Instructions Box
  // -----------------------
  if (infoOpen) {
    let boxW = 1000;
    let boxH = 700;
    let boxX = infoBoxX;
    let boxY = height / 2 - boxH / 2;

    let closeX = boxX + boxW - CLOSE_BTN_SIZE - CLOSE_BTN_OFFSET_X;
    let closeY = boxY + CLOSE_BTN_OFFSET_Y;

    if (
      mouseX >= closeX &&
      mouseX <= closeX + CLOSE_BTN_SIZE &&
      mouseY >= closeY &&
      mouseY <= closeY + CLOSE_BTN_SIZE
    ) {
      playButtonClickSound();
      infoOpen = false;
      return;
    }
  }

  if (
    mouseX >= HOW_TO_PLAY_X &&
    mouseX <= HOW_TO_PLAY_X + HOW_TO_PLAY_W &&
    mouseY >= HOW_TO_PLAY_Y &&
    mouseY <= HOW_TO_PLAY_Y + HOW_TO_PLAY_H
  ) {
    playButtonClickSound();
    infoOpen = !infoOpen;
    return;
  }

  // NOTE: these click targets are your original values, which sit a few
  // pixels below LEVEL_CIRCLES. Left alone so hit areas don't change.
  let cx = [570, 565, 531];
  let cy = [158, 405, 640];
  let radius = 73 / 2;

  for (let i = 0; i < 3; i++) {
    let unlocked = isLevelUnlocked(i);

    let d = dist(mouseX, mouseY, cx[i], cy[i]);
    if (d < radius) {
      if (!unlocked) {
        playButtonClickSound();
        levelShake[i] = 10;
        activePanelIndex = -1;
        isClosingPanel = false;
        nextPanelIndex = -1;
        return;
      }

      playButtonClickSound();

      if (activePanelIndex === i) {
        activePanelIndex = -1;
        isClosingPanel = false;
        nextPanelIndex = -1;
        return;
      }

      if (activePanelIndex !== -1 && activePanelIndex !== i) {
        isClosingPanel = true;
        nextPanelIndex = i;
        return;
      }

      activePanelIndex = i;
      isClosingPanel = false;
      nextPanelIndex = -1;
      return;
    }
  }

  // --- CHECK PLAY BUTTON CLICK ---
  if (activePanelIndex !== -1) {
    let panel = levelPanels[activePanelIndex];

    let x = panel.x;
    let y = 175;
    const PANEL_W = 500;
    const PANEL_H = 500;

    let btnX = x + PANEL_W / 2 - 110; // center minus half width
    let btnY = y + PANEL_H - 130;
    let btnW = 220;
    let btnH = 60;

    if (
      mouseX > btnX &&
      mouseX < btnX + btnW &&
      mouseY > btnY &&
      mouseY < btnY + btnH
    ) {
      playButtonClickSound();
      startLevel(activePanelIndex);
      return;
    }
  }
}

function startLevel(i) {
  if (i === 0) {
    startLevel1(); // Level 1 uses tutorial
    return;
  }

  currentLevel = i + 1; // 2 for Level 2, 3 for Level 3
  loadLevel(currentLevel); // build that level's background/walls/spikes/fish
  resetGame();

  if (currentLevel === 2) {
    startLevel2Intro(); // show avalanche + crevices cards before Level 2 begins
    return;
  }

  if (currentLevel === 3) {
    startLevel3Intro(); // show avalanche card before Level 3 begins
    return;
  }

  gameState = "playing";
  cursor(ARROW);
}

function startLevel1() {
  currentLevel = 1;
  loadLevel(1);
  resetGame(); // resets timer, penguin, stomp, etc.
  gameState = "tutorial";
  tutorialActive = true;
  tutorialAlpha = 0;
  tutorialIndex = 0;
  tutorialDelay = tutorialSteps[0].delay;
}

// For fastest times
function formatTime(t) {
  if (t === null) return "--:--";
  let minutes = floor(t / 60);
  let seconds = t % 60;
  return minutes + ":" + nf(seconds, 2);
}

function drawObjectiveInfoButton() {
  if (!howToPlayButtonImg) return;

  let hovered =
    mouseX >= HOW_TO_PLAY_X &&
    mouseX <= HOW_TO_PLAY_X + HOW_TO_PLAY_W &&
    mouseY >= HOW_TO_PLAY_Y &&
    mouseY <= HOW_TO_PLAY_Y + HOW_TO_PLAY_H;

  if (hovered) {
    cursor(HAND);
  }

  /*
    Source locations inside how_to_play_button.png:

    Default button:
    x = 180, y = 90, width = 1180, height = 280

    Hover button:
    x = 180, y = 420, width = 1180, height = 290
  */

  if (hovered) {
    // Draw hover state from the bottom portion of the sprite sheet
    image(
      howToPlayButtonImg,
      HOW_TO_PLAY_X,
      HOW_TO_PLAY_Y,
      HOW_TO_PLAY_W,
      HOW_TO_PLAY_H,
      180,
      420,
      1180,
      290,
    );
  } else {
    // Draw default state from the top portion of the sprite sheet
    image(
      howToPlayButtonImg,
      HOW_TO_PLAY_X,
      HOW_TO_PLAY_Y,
      HOW_TO_PLAY_W,
      HOW_TO_PLAY_H,
      180,
      90,
      1180,
      280,
    );
  }
}

function drawObjectiveInfoBox() {
  let targetX = infoOpen ? INFO_OPEN_X : INFO_CLOSED_X;

  let dx = targetX - infoBoxX;

  if (Math.abs(dx) < INFO_SPEED) {
    infoBoxX = targetX;
  } else {
    infoBoxX += Math.sign(dx) * INFO_SPEED;
  }

  // don't draw if fully closed
  if (infoBoxX <= INFO_CLOSED_X + 5 && !infoOpen) return;

  let boxW = 1000;
  let boxH = 700;
  let boxX = infoBoxX;
  let boxY = height / 2 - boxH / 2;

  let centerX = boxX + boxW / 2;
  let rowCenter = centerX;

  image(wideBoxImg, boxX, boxY, boxW, boxH);

  // -----------------------
  // Close Button
  // -----------------------
  let closeX = boxX + boxW - CLOSE_BTN_SIZE - CLOSE_BTN_OFFSET_X;

  let closeY = boxY + CLOSE_BTN_OFFSET_Y;

  image(xButtonImg, closeX, closeY, CLOSE_BTN_SIZE, CLOSE_BTN_SIZE);

  if (
    mouseX >= closeX &&
    mouseX <= closeX + CLOSE_BTN_SIZE &&
    mouseY >= closeY &&
    mouseY <= closeY + CLOSE_BTN_SIZE
  ) {
    cursor(HAND);
  }

  fill(255);
  noStroke();
  textFont(gameFont);
  textAlign(CENTER, CENTER);

  textSize(67);
  text("Instructions", centerX, boxY + 150);

  textSize(30);
  text(
    "On your way down the mountain, you must find Miss Shelby \nwithin the time limit to get to the next level.",
    centerX,
    boxY + 230,
  );

  image(fishImg, centerX - 40, boxY + 280, 70, 40);

  textSize(30);
  text(
    "Find Miss Shelby as fast as possible to collect 3 stars.\nYou need to collect stars to unlock levels.",
    centerX,
    boxY + 370,
  );

  // 1 star row
  let row1Y = boxY + 430;
  image(starFilledImg, rowCenter - 160, row1Y - 20, 65, 65);
  text("=", rowCenter, row1Y + 5);
  image(fishImg, rowCenter + 60, row1Y - 17, 70, 40);

  // 2 star row
  let row2Y = boxY + 520;
  image(starFilledImg, rowCenter - 190, row2Y - 50, 65, 65);
  image(starFilledImg, rowCenter - 130, row2Y - 50, 65, 65);
  text("=", rowCenter, row2Y - 20);
  image(fishImg, rowCenter + 60, row2Y - 40, 70, 40);
  text("+ 00:30 remaining", rowCenter + 228, row2Y - 20);

  // 3 star row
  let row3Y = boxY + 610;
  image(starFilledImg, rowCenter - 220, row3Y - 80, 65, 65);
  image(starFilledImg, rowCenter - 160, row3Y - 80, 65, 65);
  image(starFilledImg, rowCenter - 100, row3Y - 80, 65, 65);
  text("=", rowCenter, row3Y - 50);
  image(fishImg, rowCenter + 60, row3Y - 70, 70, 40);
  text("+ 1:00 remaining", rowCenter + 220, row3Y - 50);
}
