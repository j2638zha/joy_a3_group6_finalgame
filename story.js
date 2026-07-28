let storyPanels = [];
let storyAudio;
let storyAudioButWhy;
let startButtonSound;

let storyEntering = true; // running the initial fade-to-black
let storyFadeToBlack = 0; // 0..255 black overlay on entry
let storyPage = 0; // which page we're on (0,1,2)
let storyPanelAlphas = []; // per-panel fade alpha (0..255), indexed by panel
let storyRevealTimer = 0; // frames until the 2nd panel on a page fades in
let storyAutoTimer = 0;
let storySkipped = false;
let storyZoom = 1;
let storyLastPage = -1;

const STORY_ZOOM_START = 1.0; // starting scale (already "kind of big" via the rect)
const STORY_ZOOM_MAX = 1.12; // how far it grows
const STORY_ZOOM_SPEED = 0.0006; // per-frame growth
const STORY_PANEL_COUNT = 5;
const STORY_BLACK_SPEED = 15;
const STORY_FADE_SPEED = 12;
const STORY_AUTO_DELAY = 180; // frames to hold a full page before auto-turning (~3s)
const STORY_SECOND_PANEL_DELAY = 60; // frames before the 2nd panel of a page appears (~1s)
const STORY_PANEL_CUES = [0, 5, 14, 24, 36];
const STORY_PANEL5_FADE = 3; // slower fade for the final panel

// Which panels appear on each page.
const STORY_PAGES = [
  [0, 1], // page 0 → panels 1 & 2
  [2, 3], // page 1 → panels 3 & 4
  [4], // page 2 → panel 5 alone
];

function preloadStoryAssets() {
  for (let i = 0; i < STORY_PANEL_COUNT; i++) {
    storyPanels[i] = loadImage("assets/images/story_panel_" + (i + 1) + ".png");
  }
  storyAudio = loadSound("assets/sounds/StoryAudio.mp3");
  storyAudioButWhy = loadSound("assets/sounds/Story_Audio_But_Why.mp3");
  startButtonSound = loadSound("assets/sounds/start_button_sound.mp3");
}

function beginStory() {
  if (startButtonSound && startButtonSound.isLoaded()) startButtonSound.play();
  if (introMusic && introMusic.isPlaying()) introMusic.stop();
  gameState = "story";
  storyEntering = true;
  storyFadeToBlack = 0;
  storyPage = 0;
  storyPanelAlphas = new Array(STORY_PANEL_COUNT).fill(0);
  storySkipped = false; // ← add
}

function pageOfPanel(panelIdx) {
  for (let pg = 0; pg < STORY_PAGES.length; pg++) {
    if (STORY_PAGES[pg].includes(panelIdx)) return pg;
  }
  return 0;
}

function isLastPage() {
  return storyPage >= STORY_PAGES.length - 1;
}

// Every panel on the current page has fully faded in.
function pageFullyShown() {
  return STORY_PAGES[storyPage].every((p) => storyPanelAlphas[p] >= 255);
}

function leaveStory() {
  if (storyAudio && storyAudio.isPlaying()) storyAudio.stop();
  if (storyAudioButWhy && storyAudioButWhy.isPlaying()) storyAudioButWhy.stop();
  gameState = "level_picker";
}

// Skip → jump straight to the last page (still needs a Continue to leave).
function skipStory() {
  if (storyEntering) return;

  if (storyAudio && storyAudio.isPlaying()) storyAudio.stop();
  storyPage = STORY_PAGES.length - 1;

  // show earlier panels instantly, but let panel 5 fade in fresh
  for (let i = 0; i < STORY_PANEL_COUNT - 1; i++) storyPanelAlphas[i] = 255;
  storyPanelAlphas[STORY_PANEL_COUNT - 1] = 0;

  storySkipped = true; // ← flag so the reveal logic knows we're in skip mode

  if (storyAudioButWhy && storyAudioButWhy.isLoaded()) storyAudioButWhy.play();
}

// Continue → if the page is still fading in, snap it full; else next page / leave.
function advanceStory() {
  if (storyEntering) return;

  // If the current page hasn't finished fading, snap it full AND move on
  // in the same press (don't force a second click).
  if (isLastPage()) {
    // last page → finish and leave
    for (const p of STORY_PAGES[storyPage]) storyPanelAlphas[p] = 255;
    leaveStory();
    return;
  }

  // Not last page: go to the next page and show its panels immediately,
  // so there's no black gap waiting for the audio cue.
  storyPage++;
  for (const p of STORY_PAGES[storyPage]) storyPanelAlphas[p] = 255;

  if (cardSwitchSound && cardSwitchSound.isLoaded()) {
    cardSwitchSound.play();
  }
}

const STORY_CONTINUE_BTN = { x: 0, y: 0, w: 260, h: 60 };
const STORY_SKIP_BTN = { x: 0, y: 0, w: 160, h: 50 };

// Rect for the Nth panel (0 or 1) on the current page.
// Two-panel pages: side by side. One-panel page: centered, larger.
function storyPageRect(slot, count) {
  const pad = 24; // gap between the two stacked panels
  const topMargin = 40; // space above the top panel
  const bottomMargin = 110; // space below the bottom panel (room for buttons)
  const aspect = 1.83;

  const areaW = width - pad * 2;
  const areaH = height - topMargin - bottomMargin;

  if (count === 1) {
    let w = min(areaW, areaH * aspect);
    let h = w / aspect;
    const x = (width - w) / 2;
    const y = topMargin + (areaH - h) / 2; // centered in the area
    return { x, y, w, h };
  }

  // two panels stacked vertically
  const cellH = (areaH - pad) / 2;
  let w = min(areaW, cellH * aspect);
  let h = w / aspect;
  const x = (width - w) / 2;
  const totalH = h * 2 + pad;
  const originY = topMargin + (areaH - totalH) / 2; // centered in the area
  const y = originY + slot * (h + pad);
  return { x, y, w, h };
}

function drawStoryScreen() {
  background(0);
  if (storyPage !== storyLastPage) {
    storyZoom = STORY_ZOOM_START;
    storyLastPage = storyPage;
  }
  storyZoom = min(STORY_ZOOM_MAX, storyZoom + STORY_ZOOM_SPEED);
  // --- ENTRY FADE-TO-BLACK, then start narration ---
  if (storyEntering) {
    storyFadeToBlack += STORY_BLACK_SPEED;
    if (storyFadeToBlack >= 255) {
      storyEntering = false;
      if (storyAudio && storyAudio.isLoaded() && !storyAudio.isPlaying()) {
        storyAudio.play();
      }
    }
    return;
  }

  // --- REVEAL ---
  if (storySkipped) {
    // Skip mode: audio is stopped, so just fade panel 5 in slowly.
    const last = STORY_PANEL_COUNT - 1;
    storyPanelAlphas[last] = min(
      255,
      storyPanelAlphas[last] + STORY_PANEL5_FADE,
    );
  } else {
    let t = 0;
    if (storyAudio && storyAudio.isLoaded()) t = storyAudio.currentTime();

    let newest = 0;
    for (let i = 0; i < STORY_PANEL_COUNT; i++) {
      if (t >= STORY_PANEL_CUES[i]) newest = i;
    }
    const targetPage = pageOfPanel(newest);
    if (targetPage > storyPage) storyPage = targetPage;

    for (const p of STORY_PAGES[storyPage]) {
      if (t >= STORY_PANEL_CUES[p]) {
        const step =
          p === STORY_PANEL_COUNT - 1 ? STORY_PANEL5_FADE : STORY_FADE_SPEED;
        storyPanelAlphas[p] = min(255, storyPanelAlphas[p] + step);
      }
    }
  }

  // --- DRAW THE PAGE'S PANELS ---
  const panels = STORY_PAGES[storyPage];
  for (let slot = 0; slot < panels.length; slot++) {
    const idx = panels[slot];
    const img = storyPanels[idx];
    if (!img) continue;
    const r = storyPageRect(slot, panels.length);

    const zw = r.w * storyZoom;
    const zh = r.h * storyZoom;
    const zx = r.x - (zw - r.w) / 2;
    const zy = r.y - (zh - r.h) / 2;

    push();
    tint(255, storyPanelAlphas[idx]);
    image(img, zx, zy, zw, zh);
    pop();
  }
  // --- BUTTONS ---
  STORY_CONTINUE_BTN.x = width - 150;
  STORY_CONTINUE_BTN.y = height - 45;
  drawButton(
    "Continue",
    STORY_CONTINUE_BTN.x,
    STORY_CONTINUE_BTN.y,
    STORY_CONTINUE_BTN.w,
    STORY_CONTINUE_BTN.h,
    false,
  );

  if (!isLastPage()) {
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
  if (!isLastPage() && hitButton(STORY_SKIP_BTN)) {
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