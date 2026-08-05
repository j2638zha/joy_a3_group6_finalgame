// win_story.js — post-win comic strip, same transition style as the intro story.

let winStoryPanels = [];
let winStoryPage = 0;
let winStoryPanelAlphas = [];
let winStoryEntering = true;
let winStoryFadeToBlack = 0;
let winStorySkipped = false;
let winStoryZoom = 1;
let winStoryLastPage = -1;
let winStoryRevealTimer = 0;

const WIN_STORY_PANEL_COUNT = 4;
const WIN_STORY_BLACK_SPEED = 8;
const WIN_STORY_FADE_SPEED = 12;
const WIN_STORY_PANEL4_FADE = 4; // credits fades in slower
const WIN_STORY_SECOND_DELAY = 60; // frames before the 2nd panel on a page fades in
const WIN_STORY_AUTO_DELAY = 240; // frames to hold a full page before auto-turning (~4s)
const WIN_STORY_ZOOM_START = 1.0;
const WIN_STORY_ZOOM_MAX = 1.12;
const WIN_STORY_ZOOM_SPEED = 0.0006;

let winStoryAutoTimer = 0;

// Page layout: panels 1&2 together, panel 3 alone, panel 4 (credits) alone.
const WIN_STORY_PAGES = [
  [0, 1], // page 0 → panels 1 & 2
  [2], // page 1 → panel 3 alone
  [3], // page 2 → panel 4 (credits) alone
];

function preloadWinStoryAssets() {
  for (let i = 0; i < WIN_STORY_PANEL_COUNT; i++) {
    winStoryPanels[i] = loadImage(
      "assets/images/win_screen_story_panel_" + (i + 1) + ".png",
    );
  }
}

function beginWinStory() {
  // Stop any gameplay sounds.
  if (gameMusic && gameMusic.isPlaying()) gameMusic.stop();
  if (stompSound && stompSound.isPlaying()) stompSound.stop();
  if (stompAura && stompAura.isPlaying()) stompAura.stop();
  if (walkSound && walkSound.isPlaying()) walkSound.stop();
  if (winSound && winSound.isPlaying()) winSound.stop();

  gameState = "win_story";
  winStoryPage = 0;
  winStoryPanelAlphas = new Array(WIN_STORY_PANEL_COUNT).fill(0);
  winStoryEntering = true;
  winStoryFadeToBlack = 0;
  winStorySkipped = false;
  winStoryZoom = WIN_STORY_ZOOM_START;
  winStoryLastPage = -1;
  winStoryRevealTimer = WIN_STORY_SECOND_DELAY;
  winStoryAutoTimer = WIN_STORY_AUTO_DELAY;
}

function isWinStoryLastPage() {
  return winStoryPage >= WIN_STORY_PAGES.length - 1;
}

function winStoryPageFullyShown() {
  return WIN_STORY_PAGES[winStoryPage].every(
    (p) => winStoryPanelAlphas[p] >= 255,
  );
}

function leaveWinStory() {
  gameState = "start";
  musicGateOpen = false; // reset the title-screen music gate
}

function skipWinStory() {
  if (winStoryEntering) return;
  // Jump to the credits page, show everything except credits instantly.
  winStoryPage = WIN_STORY_PAGES.length - 1;
  for (let i = 0; i < WIN_STORY_PANEL_COUNT - 1; i++)
    winStoryPanelAlphas[i] = 255;
  winStoryPanelAlphas[WIN_STORY_PANEL_COUNT - 1] = 0;
  winStorySkipped = true;
}

function advanceWinStory() {
  if (winStoryEntering) return;

  if (isWinStoryLastPage()) {
    for (const p of WIN_STORY_PAGES[winStoryPage]) winStoryPanelAlphas[p] = 255;
    leaveWinStory();
    return;
  }

  winStoryPage++;
  for (const p of WIN_STORY_PAGES[winStoryPage]) winStoryPanelAlphas[p] = 255;
  winStoryRevealTimer = WIN_STORY_SECOND_DELAY;
  winStoryAutoTimer = WIN_STORY_AUTO_DELAY;
}

const WIN_STORY_CONTINUE_BTN = { x: 0, y: 0, w: 260, h: 60 };
const WIN_STORY_SKIP_BTN = { x: 0, y: 0, w: 160, h: 50 };
const WIN_STORY_RESTART_BTN = { x: 0, y: 0, w: 320, h: 64 };

function winStoryPageRect(slot, count) {
  const pad = 24;
  const topMargin = 40;
  const bottomMargin = 110;
  const aspect = 1.83;

  const areaW = width - pad * 2;
  const areaH = height - topMargin - bottomMargin;

  if (count === 1) {
    let w = min(areaW, areaH * aspect);
    let h = w / aspect;
    const x = (width - w) / 2;
    const y = topMargin + (areaH - h) / 2;
    return { x, y, w, h };
  }

  // two panels stacked vertically
  const cellH = (areaH - pad) / 2;
  let w = min(areaW, cellH * aspect);
  let h = w / aspect;
  const x = (width - w) / 2;
  const totalH = h * 2 + pad;
  const originY = topMargin + (areaH - totalH) / 2;
  const y = originY + slot * (h + pad);
  return { x, y, w, h };
}

function drawWinStoryScreen() {
  background(0);

  // --- ENTRY FADE-TO-BLACK ---
  if (winStoryEntering) {
    winStoryFadeToBlack += WIN_STORY_BLACK_SPEED;
    if (winStoryFadeToBlack >= 255) {
      winStoryEntering = false;
    }
    return;
  }

  // --- FADE-IN LOGIC ---
  const panels = WIN_STORY_PAGES[winStoryPage];

  if (winStorySkipped && isWinStoryLastPage()) {
    // Skip mode: just fade the credits panel in slowly.
    const last = WIN_STORY_PANEL_COUNT - 1;
    winStoryPanelAlphas[last] = min(
      255,
      winStoryPanelAlphas[last] + WIN_STORY_PANEL4_FADE,
    );
  } else {
    // First panel fades in immediately.
    winStoryPanelAlphas[panels[0]] = min(
      255,
      winStoryPanelAlphas[panels[0]] + WIN_STORY_FADE_SPEED,
    );
    // Second panel (if any) waits for the reveal timer.
    if (panels.length > 1) {
      if (winStoryRevealTimer > 0) {
        winStoryRevealTimer--;
      } else {
        const step =
          panels[1] === WIN_STORY_PANEL_COUNT - 1
            ? WIN_STORY_PANEL4_FADE
            : WIN_STORY_FADE_SPEED;
        winStoryPanelAlphas[panels[1]] = min(
          255,
          winStoryPanelAlphas[panels[1]] + step,
        );
      }
    }
  }

  // --- AUTO-ADVANCE (not on credits page) ---
  if (winStoryPageFullyShown() && !isWinStoryLastPage()) {
    winStoryAutoTimer--;
    if (winStoryAutoTimer <= 0) {
      winStoryPage++;
      winStoryRevealTimer = WIN_STORY_SECOND_DELAY;
      winStoryAutoTimer = WIN_STORY_AUTO_DELAY;
    }
  }

  // --- ZOOM ---
  if (winStoryPage !== winStoryLastPage) {
    winStoryZoom = WIN_STORY_ZOOM_START;
    winStoryLastPage = winStoryPage;
  }
  winStoryZoom = min(WIN_STORY_ZOOM_MAX, winStoryZoom + WIN_STORY_ZOOM_SPEED);

  // --- DRAW PANELS ---
  for (let slot = 0; slot < panels.length; slot++) {
    const idx = panels[slot];
    const img = winStoryPanels[idx];
    if (!img) continue;
    const r = winStoryPageRect(slot, panels.length);

    const zw = r.w * winStoryZoom;
    const zh = r.h * winStoryZoom;
    const zx = r.x - (zw - r.w) / 2;
    const zy = r.y - (zh - r.h) / 2;

    push();
    tint(255, winStoryPanelAlphas[idx]);
    image(img, zx, zy, zw, zh);
    pop();
  }

  // --- BUTTONS ---
  if (isWinStoryLastPage() && winStoryPageFullyShown()) {
    // Credits page: show Restart Game button.
    WIN_STORY_RESTART_BTN.x = width / 2;
    WIN_STORY_RESTART_BTN.y = height - 45;
    drawButton(
      "Restart Game",
      WIN_STORY_RESTART_BTN.x,
      WIN_STORY_RESTART_BTN.y,
      WIN_STORY_RESTART_BTN.w,
      WIN_STORY_RESTART_BTN.h,
      false,
    );
  } else {
    // Non-credits pages: Continue + Skip.
    WIN_STORY_CONTINUE_BTN.x = width - 150;
    WIN_STORY_CONTINUE_BTN.y = height - 45;
    drawButton(
      "Continue",
      WIN_STORY_CONTINUE_BTN.x,
      WIN_STORY_CONTINUE_BTN.y,
      WIN_STORY_CONTINUE_BTN.w,
      WIN_STORY_CONTINUE_BTN.h,
      false,
    );

    WIN_STORY_SKIP_BTN.x = 120;
    WIN_STORY_SKIP_BTN.y = height - 42;
    drawButton(
      "Skip",
      WIN_STORY_SKIP_BTN.x,
      WIN_STORY_SKIP_BTN.y,
      WIN_STORY_SKIP_BTN.w,
      WIN_STORY_SKIP_BTN.h,
      false,
    );
  }
}

function handleWinStoryClick() {
  if (isWinStoryLastPage() && winStoryPageFullyShown()) {
    if (winStoryHitButton(WIN_STORY_RESTART_BTN)) {
      leaveWinStory();
      return true;
    }
    return false;
  }

  if (winStoryHitButton(WIN_STORY_CONTINUE_BTN)) {
    advanceWinStory();
    return true;
  }
  if (winStoryHitButton(WIN_STORY_SKIP_BTN)) {
    skipWinStory();
    return true;
  }
  return false;
}

function winStoryHitButton(b) {
  return (
    mouseX > b.x - b.w / 2 &&
    mouseX < b.x + b.w / 2 &&
    mouseY > b.y - b.h / 2 &&
    mouseY < b.y + b.h / 2
  );
}
