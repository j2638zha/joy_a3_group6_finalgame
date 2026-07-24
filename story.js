// story.js — intro comic-strip: all 5 panels in a grid, fading in one by one.

let storyPanels = [];
let storyAudio;

let storyEntering = true; // running the initial fade-to-black
let storyFadeToBlack = 0; // 0..255 black overlay on entry
let storyVisibleCount = 0; // how many panels have started fading in
let storyPanelAlphas = []; // per-panel fade alpha (0..255)
let storyRevealTimer = 0; // frames until the next panel starts fading in

const STORY_PANEL_COUNT = 5;
const STORY_BLACK_SPEED = 8; // entry fade-to-black speed
const STORY_FADE_SPEED = 8; // per-panel fade-in speed
const STORY_REVEAL_GAP = 240; // 4s at 60fps, between panels 2–5

function preloadStoryAssets() {
  for (let i = 0; i < STORY_PANEL_COUNT; i++) {
    storyPanels[i] = loadImage("assets/images/story_panel_" + (i + 1) + ".png");
  }
  storyAudio = loadSound("assets/sounds/StoryAudio.mp3");
}

function beginStory() {
  if (introMusic && introMusic.isPlaying()) introMusic.stop();
  gameState = "story";
  storyEntering = true;
  storyFadeToBlack = 0;
  storyVisibleCount = 0;
  storyRevealTimer = 15; // first panel appears quickly (~0.25s)
  storyPanelAlphas = new Array(STORY_PANEL_COUNT).fill(0);
}

// Whether every panel has fully faded in — Continue/Skip only matter after that.
function storyAllShown() {
  return (
    storyVisibleCount >= STORY_PANEL_COUNT &&
    storyPanelAlphas[STORY_PANEL_COUNT - 1] >= 255
  );
}

// Leave for the level picker.
function leaveStory() {
  if (storyAudio && storyAudio.isPlaying()) storyAudio.stop();
  gameState = "level_picker";
}

// Skip → reveal everything instantly (still needs a Continue press to leave).
function skipStory() {
  if (storyEntering) return;
  storyVisibleCount = STORY_PANEL_COUNT;
  for (let i = 0; i < STORY_PANEL_COUNT; i++) storyPanelAlphas[i] = 255;
}

// Continue → only leaves once all panels are shown.
function advanceStory() {
  if (storyEntering) return;
  if (storyAllShown()) {
    leaveStory();
  } else {
    // If they hit continue early, treat it like skip (fill the strip in).
    skipStory();
  }
}

const STORY_CONTINUE_BTN = { x: 0, y: 0, w: 260, h: 60 };
const STORY_SKIP_BTN = { x: 0, y: 0, w: 160, h: 50 };

// Compute the grid rect for panel index i (0..4): 3 on top, 2 on bottom.
function storyPanelRect(i) {
  const cols = 3;
  const pad = 16; // gap between panels
  const bottomReserve = 80; // room for the Continue/Skip buttons
  const aspect = 1.83; // panel width / height

  // Available drawing area (above the button strip).
  const areaW = width - pad * 2;
  const areaH = height - bottomReserve - pad * 2;

  // Two rows. Size a cell so BOTH rows + gap fit vertically,
  // AND three columns + gaps fit horizontally — take the smaller.
  const cellWByWidth = (areaW - pad * (cols - 1)) / cols;
  const cellHByHeight = (areaH - pad) / 2; // 2 rows, 1 gap
  const cellWByHeight = cellHByHeight * aspect;

  const cellW = min(cellWByWidth, cellWByHeight);
  const cellH = cellW / aspect;

  // Total grid size, so we can center it in the area.
  const gridH = cellH * 2 + pad;
  const topRowW = cellW * 3 + pad * 2;
  const originY = pad + (areaH - gridH) / 2;

  let col, rowY, rowStartX;
  if (i < 3) {
    col = i;
    rowY = originY;
    rowStartX = (width - topRowW) / 2;
  } else {
    col = i - 3;
    rowY = originY + cellH + pad;
    const bottomRowW = cellW * 2 + pad;
    rowStartX = (width - bottomRowW) / 2;
  }
  const x = rowStartX + col * (cellW + pad);
  return { x, y: rowY, w: cellW, h: cellH };
}

function drawStoryScreen() {
  background(0);

  // --- ENTRY FADE-TO-BLACK, then start narration + reveals ---
  if (storyEntering) {
    storyFadeToBlack += STORY_BLACK_SPEED;
    if (storyFadeToBlack >= 255) {
      storyEntering = false;
      if (storyAudio && storyAudio.isLoaded() && !storyAudio.isPlaying()) {
        storyAudio.play();
      }
    }
    return; // screen already black
  }

  // --- REVEAL TIMER: start the next panel fading in every STORY_REVEAL_GAP frames ---
  if (storyVisibleCount < STORY_PANEL_COUNT) {
    storyRevealTimer--;
    if (storyRevealTimer <= 0) {
      storyVisibleCount++;
      storyRevealTimer = STORY_REVEAL_GAP;
    }
  }

  // --- DRAW EACH VISIBLE PANEL, fading in ---
  for (let i = 0; i < storyVisibleCount; i++) {
    if (storyPanelAlphas[i] < 255) {
      storyPanelAlphas[i] = min(255, storyPanelAlphas[i] + STORY_FADE_SPEED);
    }
    const img = storyPanels[i];
    if (!img) continue;
    const r = storyPanelRect(i);
    push();
    tint(255, storyPanelAlphas[i]);
    image(img, r.x, r.y, r.w, r.h);
    pop();
  }

  // --- BUTTONS ---
  const allShown = storyAllShown();

  STORY_CONTINUE_BTN.x = width - 150;
  STORY_CONTINUE_BTN.y = height - 45;
  // Continue only lights up meaningfully once everything's shown, but it's
  // always clickable (early press fills the strip in via advanceStory()).
  drawButton(
    "Continue",
    STORY_CONTINUE_BTN.x,
    STORY_CONTINUE_BTN.y,
    STORY_CONTINUE_BTN.w,
    STORY_CONTINUE_BTN.h,
    false,
  );

  if (!allShown) {
    STORY_SKIP_BTN.x = 120;
    STORY_SKIP_BTN.y = height - 42;
    drawButton(
      "Skip",
      STORY_SKIP_BTN.x,
      STORY_SKIP_BTN.y,
      STORY_SKIP_BTN.w,
      STORY_SKIP_BTN.h,
      false,
    );
  }
}

function handleStoryClick() {
  if (hitButton(STORY_CONTINUE_BTN)) {
    advanceStory();
    return true;
  }
  if (!storyAllShown() && hitButton(STORY_SKIP_BTN)) {
    skipStory();
    return true;
  }
  return false;
}

function hitButton(b) {
  return (
    mouseX > b.x - b.w / 2 &&
    mouseX < b.x + b.w / 2 &&
    mouseY > b.y - b.h / 2 &&
    mouseY < b.y + b.h / 2
  );
}
