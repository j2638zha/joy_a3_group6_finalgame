// win_story.js — post-win comic strip + credits, narrated.
// Reveal timing is driven by the narration track (same idea as story.js),
// with a real-time fallback so it still works if the audio fails to load.

let winStoryPanels = [];
let winStoryAudio;

let winStoryPage = 0;
let winStoryPanelAlphas = [];
let winStoryEntering = true;
let winStoryFadeToBlack = 0;
let winStorySkipped = false;
let winStoryZoom = 1;
let winStoryLastPage = -1;
let winStoryClockStart = 0; // millis() when the reveal began (fallback clock)
let winStoryExiting = false; // running the slow end-of-movie fade to black
let winStoryFadeOut = 0; // 0..255 black overlay on the way out
let winStoryBlackHold = 0; // frames to sit on full black before leaving

const WIN_STORY_PANEL_COUNT = 4;

// ------------------------------------------------------------
// ⏱  TIMING — edit these to match the narration
// ------------------------------------------------------------
// Seconds into win_screen_story_audio.mp3 at which each panel starts
// fading in. Panel 4 is the credits card and holds for the rest of the
// track (which runs ~2:19 total).
//   panel 1 → 0:02   panel 2 → 0:10   panel 3 → 0:16   panel 4 → 0:24
const WIN_STORY_PANEL_CUES = [2, 10, 16, 24];

// Fade speed = alpha added per frame (60fps). Lower = slower + smoother.
const WIN_STORY_FADE_SPEED = 1.8; // ≈2.4s per panel
const WIN_STORY_CREDITS_FADE = 1.0; // ≈4.3s for the credits card
const WIN_STORY_BLACK_SPEED = 6; // entry fade-to-black

// End-of-movie fade out. Alpha added per frame, so 0.75 ≈ 5.7s.
const WIN_STORY_EXIT_FADE_SPEED = 0.75;
const WIN_STORY_BLACK_HOLD_FRAMES = 60; // ~1s of pure black before the title

// Length of win_screen_story_audio.mp3, used only if the file never loads
// and the fallback clock has to decide when the credits are over.
const WIN_STORY_TRACK_LENGTH = 139;

const WIN_STORY_NARRATION_VOLUME = 7;

// Corner rounding on the panels (px, clamped so it can't exceed half a side).
const WIN_STORY_CORNER_RADIUS = 26;

// Slow "Ken Burns" drift. Kept small so panels never overflow their slot.
const WIN_STORY_ZOOM_START = 1.0;
const WIN_STORY_ZOOM_MAX = 1.05;
const WIN_STORY_ZOOM_SPEED = 0.00025;

// Page layout: panels 1&2 together, panel 3 alone, panel 4 (credits) alone.
// One panel per screen.
const WIN_STORY_PAGES = [
  [0], // 0:02–0:09
  [1], // 0:10–0:15
  [2], // 0:16–0:23
  [3], // 0:24 onward
];

function preloadWinStoryAssets() {
  for (let i = 0; i < WIN_STORY_PANEL_COUNT; i++) {
    winStoryPanels[i] = loadImage(
      "assets/images/win_screen_story_panel_" + (i + 1) + ".png",
    );
  }
  winStoryAudio = loadSound("assets/sounds/win_screen_story_audio.mp3");
}

function beginWinStory() {
  // Stop any gameplay / win-screen sounds.
  if (gameMusic && gameMusic.isPlaying()) gameMusic.stop();
  if (stompSound && stompSound.isPlaying()) stompSound.stop();
  if (stompAura && stompAura.isPlaying()) stompAura.stop();
  if (walkSound && walkSound.isPlaying()) walkSound.stop();
  if (winSound && winSound.isPlaying()) winSound.stop();
  if (typeof cancelStompAudio === "function") cancelStompAudio();
  if (goatSound && goatSound.isPlaying()) goatSound.stop();
  if (timerSound && timerSound.isPlaying()) timerSound.stop();
  if (fishCallNear && fishCallNear.isPlaying()) fishCallNear.stop();
  for (const clip of fishCallFar || []) {
    if (clip && clip.isPlaying()) clip.stop();
  }

  timerStarted = false;
  isGamePaused = false;

  gameState = "win_story";
  cursor(ARROW);

  winStoryPage = 0;
  winStoryPanelAlphas = new Array(WIN_STORY_PANEL_COUNT).fill(0);
  winStoryEntering = true;
  winStoryFadeToBlack = 0;
  winStorySkipped = false;
  winStoryZoom = WIN_STORY_ZOOM_START;
  winStoryLastPage = -1;
  winStoryClockStart = millis();
  winStoryExiting = false;
  winStoryFadeOut = 0;
  winStoryBlackHold = WIN_STORY_BLACK_HOLD_FRAMES;
}

function isWinStoryLastPage() {
  return winStoryPage >= WIN_STORY_PAGES.length - 1;
}

function winStoryPageFullyShown() {
  return WIN_STORY_PAGES[winStoryPage].every(
    (p) => winStoryPanelAlphas[p] >= 255,
  );
}

function winStoryPageOfPanel(panelIdx) {
  for (let pg = 0; pg < WIN_STORY_PAGES.length; pg++) {
    if (WIN_STORY_PAGES[pg].includes(panelIdx)) return pg;
  }
  return 0;
}

// Narration time if it's playing, otherwise a plain wall clock.
function winStoryTime() {
  if (winStoryAudio && winStoryAudio.isLoaded() && winStoryAudio.isPlaying()) {
    return winStoryAudio.currentTime();
  }
  return (millis() - winStoryClockStart) / 1000;
}

function stopWinStoryAudio() {
  if (winStoryAudio && winStoryAudio.isPlaying()) winStoryAudio.stop();
}

// True once the credits track has run out (or the fallback clock has).
function winStoryNarrationFinished() {
  if (winStoryAudio && winStoryAudio.isLoaded()) {
    const dur = winStoryAudio.duration();
    if (dur && dur > 0) return winStoryTime() >= dur - 0.2;
  }
  return winStoryTime() >= WIN_STORY_TRACK_LENGTH;
}

// Begin the slow fade to black. The audio is ramped down over the same
// window so the picture and the sound go out together.
function startWinStoryExit() {
  if (winStoryExiting) return;

  winStoryExiting = true;
  winStoryFadeOut = 0;
  winStoryBlackHold = WIN_STORY_BLACK_HOLD_FRAMES;

  if (winStoryAudio && winStoryAudio.isPlaying()) {
    const rampSeconds = 255 / WIN_STORY_EXIT_FADE_SPEED / 60;
    winStoryAudio.setVolume(0, rampSeconds);
  }
}

function leaveWinStory() {
  stopWinStoryAudio();
  gameState = "start";
  musicGateOpen = false; // reset the title-screen music gate
  cursor(ARROW);
}

// Skip → jump straight to the credits card. The narration isn't stopped,
// it's fast-forwarded to the credits cue so the music keeps playing under
// the card instead of cutting to silence.
function skipWinStory() {
  if (winStoryEntering) return;

  const creditsCue = WIN_STORY_PANEL_CUES[WIN_STORY_PANEL_COUNT - 1];

  if (winStoryAudio && winStoryAudio.isLoaded()) {
    if (winStoryAudio.isPlaying()) {
      winStoryAudio.jump(creditsCue);
    } else {
      winStoryAudio.setVolume(WIN_STORY_NARRATION_VOLUME);
      winStoryAudio.play();
      winStoryAudio.jump(creditsCue);
    }
  }

  // Keep the fallback clock in sync in case the audio never loaded.
  winStoryClockStart = millis() - creditsCue * 1000;

  winStoryPage = WIN_STORY_PAGES.length - 1;
  for (let i = 0; i < WIN_STORY_PANEL_COUNT - 1; i++) {
    winStoryPanelAlphas[i] = 255;
  }
  winStoryPanelAlphas[WIN_STORY_PANEL_COUNT - 1] = 0;
  winStorySkipped = true;
}

// ENTER only does something on the credits card: it starts the fade out.
function advanceWinStory() {
  if (winStoryEntering) return;
  if (!isWinStoryLastPage()) return;
  startWinStoryExit();
}

const WIN_STORY_SKIP_BTN = { x: 0, y: 0, w: 160, h: 50 };
const WIN_STORY_RESTART_BTN = { x: 0, y: 0, w: 320, h: 64 };

// The box a panel is allowed to occupy. The image is then letterboxed
// inside it using its own aspect ratio, so nothing ever gets squashed.
function winStorySlotBox(slot, count) {
  const pad = 36; // gap between the two stacked panels
  const topMargin = 110; // breathing room above the top panel
  const bottomMargin = 130; // room for the buttons

  const areaW = width - pad * 2;
  const areaH = height - topMargin - bottomMargin;

  if (count === 1) {
    return { x: pad, y: topMargin, w: areaW, h: areaH };
  }

  const cellH = (areaH - pad) / 2;
  return {
    x: pad,
    y: topMargin + slot * (cellH + pad),
    w: areaW,
    h: cellH,
  };
}

// Fit `img` inside `box` at its native aspect ratio (contain, never stretch).
function winStoryFitRect(img, box) {
  const aspect = img && img.height > 0 ? img.width / img.height : 1.83;

  let w = box.w;
  let h = w / aspect;

  if (h > box.h) {
    h = box.h;
    w = h * aspect;
  }

  return {
    x: box.x + (box.w - w) / 2,
    y: box.y + (box.h - h) / 2,
    w,
    h,
  };
}

// Rounded-rect path built from arcTo so it works in every browser
// (ctx.roundRect is newer and not universally available).
function winStoryRoundedPath(ctx, x, y, w, h, r) {
  r = min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawWinStoryScreen() {
  background(0);

  // --- ENTRY FADE-TO-BLACK, then start the narration ---
  if (winStoryEntering) {
    winStoryFadeToBlack += WIN_STORY_BLACK_SPEED;
    if (winStoryFadeToBlack >= 255) {
      winStoryEntering = false;
      winStoryClockStart = millis();
      if (
        winStoryAudio &&
        winStoryAudio.isLoaded() &&
        !winStoryAudio.isPlaying()
      ) {
        winStoryAudio.setVolume(WIN_STORY_NARRATION_VOLUME);
        winStoryAudio.play();
      }
    }
    return;
  }

  // --- END OF THE CREDITS TRACK → roll the slow fade to black ---
  if (
    !winStoryExiting &&
    isWinStoryLastPage() &&
    winStoryPanelAlphas[WIN_STORY_PANEL_COUNT - 1] >= 255 &&
    winStoryNarrationFinished()
  ) {
    startWinStoryExit();
  }

  // --- REVEAL (frozen once the fade out begins) ---
  if (winStoryExiting) {
    // hold the current frame
  } else if (winStorySkipped) {
    // Skipped: the narration is already fast-forwarded to the credits cue,
    // so just fade the credits card in over it.
    const last = WIN_STORY_PANEL_COUNT - 1;
    winStoryPanelAlphas[last] = min(
      255,
      winStoryPanelAlphas[last] + WIN_STORY_CREDITS_FADE,
    );
  } else {
    const t = winStoryTime();

    // Newest panel whose cue has passed decides which page we're on.
    let newest = 0;
    for (let i = 0; i < WIN_STORY_PANEL_COUNT; i++) {
      if (t >= WIN_STORY_PANEL_CUES[i]) newest = i;
    }
    const targetPage = winStoryPageOfPanel(newest);
    if (targetPage > winStoryPage) winStoryPage = targetPage;

    // Fade in every panel on this page whose cue has passed.
    for (const p of WIN_STORY_PAGES[winStoryPage]) {
      if (t >= WIN_STORY_PANEL_CUES[p]) {
        const step =
          p === WIN_STORY_PANEL_COUNT - 1
            ? WIN_STORY_CREDITS_FADE
            : WIN_STORY_FADE_SPEED;
        winStoryPanelAlphas[p] = min(255, winStoryPanelAlphas[p] + step);
      }
    }
  }

  // --- ZOOM (resets on each new page) ---
  if (winStoryPage !== winStoryLastPage) {
    winStoryZoom = WIN_STORY_ZOOM_START;
    winStoryLastPage = winStoryPage;
  }
  winStoryZoom = min(WIN_STORY_ZOOM_MAX, winStoryZoom + WIN_STORY_ZOOM_SPEED);

  // --- DRAW PANELS ---
  const panels = WIN_STORY_PAGES[winStoryPage];
  for (let slot = 0; slot < panels.length; slot++) {
    const idx = panels[slot];
    const img = winStoryPanels[idx];
    if (!img) continue;

    const r = winStoryFitRect(img, winStorySlotBox(slot, panels.length));

    const zw = r.w * winStoryZoom;
    const zh = r.h * winStoryZoom;
    const zx = r.x - (zw - r.w) / 2;
    const zy = r.y - (zh - r.h) / 2;

    push();
    drawingContext.save();
    winStoryRoundedPath(
      drawingContext,
      zx,
      zy,
      zw,
      zh,
      WIN_STORY_CORNER_RADIUS,
    );
    drawingContext.clip();
    tint(255, winStoryPanelAlphas[idx]);
    image(img, zx, zy, zw, zh);
    noTint();
    drawingContext.restore();
    pop();
  }

  // --- BUTTONS: Skip while the story runs, Restart on the credits card ---
  let anyHover = false;

  if (winStoryExiting) {
    // No buttons once the picture starts going out.
  } else if (isWinStoryLastPage()) {
    WIN_STORY_RESTART_BTN.x = width / 2;
    WIN_STORY_RESTART_BTN.y = height - 45;
    anyHover =
      drawButton(
        "Restart Game",
        WIN_STORY_RESTART_BTN.x,
        WIN_STORY_RESTART_BTN.y,
        WIN_STORY_RESTART_BTN.w,
        WIN_STORY_RESTART_BTN.h,
        false,
      ) || anyHover;
  } else {
    WIN_STORY_SKIP_BTN.x = 120;
    WIN_STORY_SKIP_BTN.y = height - 42;
    anyHover =
      drawButton(
        "Skip",
        WIN_STORY_SKIP_BTN.x,
        WIN_STORY_SKIP_BTN.y,
        WIN_STORY_SKIP_BTN.w,
        WIN_STORY_SKIP_BTN.h,
        false,
      ) || anyHover;
  }

  cursor(anyHover ? HAND : ARROW);

  // --- SLOW FADE TO BLACK, then the title screen ---
  if (winStoryExiting) {
    winStoryFadeOut = min(255, winStoryFadeOut + WIN_STORY_EXIT_FADE_SPEED);

    push();
    resetMatrix();
    rectMode(CORNER);
    noStroke();
    fill(0, winStoryFadeOut);
    rect(0, 0, width, height);
    pop();

    if (winStoryFadeOut >= 255) {
      winStoryBlackHold--;
      if (winStoryBlackHold <= 0) leaveWinStory();
    }
  }
}

function winStoryHitButton(b) {
  return (
    mouseX > b.x - b.w / 2 &&
    mouseX < b.x + b.w / 2 &&
    mouseY > b.y - b.h / 2 &&
    mouseY < b.y + b.h / 2
  );
}

function handleWinStoryClick() {
  if (winStoryEntering) return true;
  if (winStoryExiting) return true; // ignore clicks once the fade starts

  if (isWinStoryLastPage()) {
    if (winStoryHitButton(WIN_STORY_RESTART_BTN)) {
      if (typeof playButtonClickSound === "function") playButtonClickSound();
      startWinStoryExit();
      return true;
    }
    return false;
  }

  if (winStoryHitButton(WIN_STORY_SKIP_BTN)) {
    if (typeof playButtonClickSound === "function") playButtonClickSound();
    skipWinStory();
    return true;
  }
  return false;
}
