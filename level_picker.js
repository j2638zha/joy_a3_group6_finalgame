//level_picker.js file

let infoOpen = false;
const INFO_CLOSED_X = -1100;  // off screen left
const INFO_OPEN_X = 100;      // where box stops
const INFO_SPEED = 50;
let infoBoxX = INFO_CLOSED_X;

// Level picker assets
let currentLevel = 1;
let lock_icon;
let check_icon;
let info_box;
let level1Complete = true;
let level2Complete = true;
let level3Complete = true;

let levelShake = [0, 0, 0];
const PANEL_CLOSED_X = 1600;
const PANEL_OPEN_X   = 700;
const PANEL_SPEED    = 0.35;
let levelPanels = [
  { title: "Rocky Range", starScore: "--", recordTime: "...", x: PANEL_CLOSED_X, targetX: PANEL_CLOSED_X },
  { title: "Frozen Fissures", starScore: "--", recordTime: "...", x: PANEL_CLOSED_X, targetX: PANEL_CLOSED_X },
  { title: "Ram Ridge", starScore: "--", recordTime: "...", x: PANEL_CLOSED_X, targetX: PANEL_CLOSED_X }
];

let activePanelIndex = -1;
let nextPanelIndex = -1;
let isClosingPanel = false;
let playBtnPressed = [false, false, false];

function preloadLevelPickerAssets() {
  levelPickerBg = loadImage("assets/images/level_picker.JPG");
  lock_icon = loadImage("assets/images/lock_icon.png");
  check_icon = loadImage("assets/images/check_icon.png");
  info_box = loadImage("assets/images/level_info_box.png");
  popUpCard = loadImage("assets/images/pop_up_card.png");
  foundPopupCard = loadImage("assets/images/Foundpopup_card.png");
  infoButtonImg = loadImage("assets/images/info_button.png");
  wideBoxImg = loadImage("assets/images/bigger_box.png");
}

function drawLevelPickerScreen() {
    cursor(ARROW);
    image(levelPickerBg, 0, 0, width, height);

    textFont(gameFont);
    textAlign(CENTER);
    fill(255);
    stroke(10, 15, 54);
    strokeWeight(8);
    textSize(80);
    text("Select a Level", width / 2 - 20, 70);

    let cx1 = 570, cy1 = 155;
    let cx2 = 565, cy2 = 395;
    let cx3 = 531, cy3 = 622;

    let diameter = 73;
    let radius = diameter / 2;

    drawLevelCircle(cx1, cy1, radius, true, 0);
    drawLevelCircle(cx2, cy2, radius, level1Complete, 1);
    drawLevelCircle(cx3, cy3, radius, level2Complete, 2);
    
    for (let i = 0; i < levelPanels.length; i++) {
        let key = "level" + (i + 1);   // level1, level2, level3
        levelPanels[i].recordTime = formatTime(fastestTimes[key]);
    }

    for (let i = 0; i < levelPanels.length; i++) {
        // decide target based on state
        if (isClosingPanel && i === activePanelIndex) {
            levelPanels[i].targetX = PANEL_CLOSED_X;   // force current to close
        } else if (i === activePanelIndex) {
            levelPanels[i].targetX = PANEL_OPEN_X;     // open active
        } else {
            levelPanels[i].targetX = PANEL_CLOSED_X;   // others closed
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

  if (!unlocked) {
    noStroke();
    image(lock_icon, cx - 40 + shakeOffset - 25, cy - 40, 180, 140);
  }

  // --- CHECKMARK FOR COMPLETED LEVELS ---
  let levelKey = "level" + (index + 1);
  if (bestStars[levelKey] >= 1)  {
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
    text("Level " + (index+1), centerX, y + 130);

    // --- DRAW STARS ---
    let startX = x + 108;     // horizontal starting point
    let starY  = y + 160;     // vertical base position
    let starW  = 120;
    let starH  = 120;     
    const drawOrder = [0, 2, 1];

    for (let i = 0; i < 3; i++) {
        let starIndex = drawOrder[i];   // remap logical star index

        let sx = startX + i * 82;
        let yOffset = (i === 1) ? -10 : 0; // middle star visually higher

        if (starIndex < bestStars["level" + (index + 1)]) {
            image(starFilledImg, sx, starY + yOffset, starW, starH);
        } else {
            image(starOutlineImg, sx, starY + yOffset, starW, starH);
        }
    }


    // --- DRAW FASTEST TIME ---
    let key = "level" + (index + 1);
    let fastest = fastestTimes[key];
    let fastestText = (fastest === null)
      ? "--:--"
      : floor(fastest / 60) + ":" + nf(fastest % 60, 2);

    // store into panel so your existing text() calls work
    panel.recordTime = fastestText;
    textSize(38);
    text("Fastest Descent:", centerX, y + 280);
    textSize(68);
    text(panel.recordTime, centerX, y + 320);

    let btnX = x + PANEL_W/2;
    let btnY = y + PANEL_H - 100;

    // get hover from ENTER button
    let hovered = drawButton("ENTER", btnX, btnY, 220, 60, playBtnPressed[index]);

    // store hover if you need it later
    levelPanels[index].playHover = hovered;

    // 🔹 make cursor a pointer when ENTER is hovered
    if (hovered) {
      cursor(HAND);
    }
}

function handleLevelPickerClick() {

let infoBtnX = 25;
let infoBtnY = 25;
let infoBtnSize = 70;

if (mouseX > infoBtnX && mouseX < infoBtnX + infoBtnSize &&
    mouseY > infoBtnY && mouseY < infoBtnY + infoBtnSize) {
  infoOpen = !infoOpen;
  return;
}

  let cx = [570, 565, 531];
  let cy = [158, 405, 640];
  let radius = 73 / 2;

  for (let i = 0; i < 3; i++) {
    let unlocked = (i === 0) ? true
                  : (i === 1) ? level1Complete
                  : level2Complete;

    let d = dist(mouseX, mouseY, cx[i], cy[i]);
    if (d < radius) {

      if (!unlocked) {
        levelShake[i] = 10;
        activePanelIndex = -1;
        isClosingPanel = false;
        nextPanelIndex = -1;
        return;
      }

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
}

function startLevel(i) {
  if (i === 0) {
    startLevel1();   // Level 1 uses tutorial
    return;
  }

  currentLevel = i + 1;      // 2 for Level 2, 3 for Level 3
  loadLevel(currentLevel);   // build that level's background/walls/spikes/fish
  resetGame();
  gameState = "playing";
  cursor(ARROW);
}

function startLevel1() {
loadLevel(1);
resetGame();          // resets timer, penguin, stomp, etc.
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
  let btnX = 25;
  let btnY = 25;
  let btnSize = 100;

  image(infoButtonImg, btnX, btnY, btnSize, btnSize);

  if (mouseX > btnX && mouseX < btnX + btnSize &&
      mouseY > btnY && mouseY < btnY + btnSize) {
    cursor(HAND);
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

  fill(255);
  noStroke();
  textFont(gameFont);
  textAlign(CENTER, CENTER);

  textSize(67);
  text("Instructions", centerX, boxY + 150);

  textSize(30);
  text(
    "On your way down the mountain, you must find fishy \nwithin the time limit to get to the next level.",
    centerX,
    boxY + 230
  );

  image(fishImg, centerX - 40, boxY + 280, 70, 40);

  textSize(30);
  text(
    "Find fishy as fast as possible to collect 3 stars.\nYou need to collect stars to unlock levels.",
    centerX,
    boxY + 370
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