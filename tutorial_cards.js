// tutorial_cards.js file

// ---- Tutorial state ----
let tutorialActive = false;
let enterInstructionActive = true;
let tutorialAlpha = 0;
let tutorialIndex = 0;
let tutorialDelay = 0;
let postTutorialTimerActive = false;
let postTutorialTimer = 0;
let postTutorialDelayFrames = 360; // 6 seconds
let tutorialBtnPressed = false;

// ---- Tutorial assets ----
let avalancheCard;
let spaceDialogueCard;
let hurryCard;
let instructionDirectionCard;
let warningSound;
let warningSoundPlayed = false; // makes sure it only plays once per attempt
let cardSwitchSound;

// ---- Avalanche warning icon animation ----
let avalancheFrame = 0;
let avalancheFrameTimer = 0;

// ---- Tutorial steps (same order, all delays are 0) ----
let tutorialSteps = [0, 1, 2, 3];

// ============================================================
// HOOKS CALLED FROM sketch.js
// ============================================================

function preloadTutorialAssets() {
  hurryCard = loadImage("assets/images/hurry_card.png");
  instructionDirectionCard = loadImage("assets/images/instruction_directioncard.png");
  avalancheCard = loadImage("assets/images/avalanche_card.png");
  spaceDialogueCard = loadImage("assets/images/space_dialoguecard.png");
  warningSound = loadSound("assets/sounds/warning_sound.mp3");
  cardSwitchSound = loadSound("assets/sounds/card_switch_sound.mp3");
}

function playCardSwitchSound() {
  if (cardSwitchSound && cardSwitchSound.isLoaded()) {
    cardSwitchSound.play();
  }
}

function resetTutorial() {
  tutorialActive = false;

  // Show the initial "Press Enter or click" instruction again.
  enterInstructionActive = true;

  tutorialAlpha = 0;
  tutorialIndex = 0;
  tutorialDelay = 0;

  postTutorialTimerActive = false;
  postTutorialTimer = 0;

  tutorialBtnPressed = false;
  warningSoundPlayed = false;

  // Reset the warning animation too.
  avalancheFrame = 0;
  avalancheFrameTimer = 0;

  // Stop an old warning sound before restarting the tutorial.
  if (warningSound && warningSound.isPlaying()) {
    warningSound.stop();
  }
}

// Delayed "space" card that pops up after the tutorial ends
function updatePostTutorialTimer() {
  if (!postTutorialTimerActive) return;

  postTutorialTimer++;

    if (postTutorialTimer >= postTutorialDelayFrames) {
    postTutorialTimerActive = false;
    tutorialActive = true;
    gameState = "tutorial";
    tutorialIndex = 3;
    tutorialDelay = 0;
    playCardSwitchSound();
  }
}

// ============================================================
// INPUT HANDLING (returns true if the event was consumed)
// ============================================================

// Shared logic for advancing to the next tutorial card. Called by both
// ENTER key presses and mouse clicks so they behave identically.
function advanceTutorialCard() {
  // Ignore while another tutorial delay is active
  if (tutorialDelay > 0) return;

  // Advance to the next card
  tutorialIndex++;

  // Stop the avalanche warning the moment we leave card 0
  if (warningSound && warningSound.isPlaying()) {
    warningSound.stop();
  }

  // Direction card (index 2) was just dismissed:
  // start the game timer and return to gameplay
  if (tutorialIndex === 3) {
    if (!timerStarted) {
      startTime = millis();
      timerStarted = true;
    }

    tutorialActive = false;
    gameState = "playing";
    postTutorialTimerActive = true;
    postTutorialTimer = 0;
    cursor(ARROW);
    return;
  }

  if (tutorialIndex < tutorialSteps.length) {
    tutorialAlpha = 255;
    tutorialDelay = 0;
    playCardSwitchSound();
    return;
  }

  tutorialActive = false;
  gameState = "playing";
}

function handleTutorialKeyPressed() {
  if (gameState !== "tutorial" || keyCode !== ENTER) return false;

  // First Enter: remove instruction and reveal avalanche card
  if (enterInstructionActive) {
    enterInstructionActive = false;
    tutorialDelay = 0;
    return true;
  }

  advanceTutorialCard();
  return true;
}

function handleTutorialMousePressed() {
  if (gameState !== "tutorial") return false;

  // Clicking anywhere dismisses the initial "press enter" instruction,
  // same as pressing ENTER.
  if (enterInstructionActive) {
    enterInstructionActive = false;
    tutorialDelay = 0;
    return true;
  }

  // Clicking anywhere advances the current dialogue card, same as ENTER.
  if (tutorialActive) {
    advanceTutorialCard();
  }

  return true;
}

function handleTutorialMouseReleased() {
  if (gameState !== "tutorial") return false;
  return true;
}

// ============================================================
// TUTORIAL DRAWING
// ============================================================

function drawEnterInstruction() {
  push();

  rectMode(CENTER);
  textFont(gameFont);
  textStyle(BOLD);
  textSize(28);

  const y = height / 2 + 20;

   const beforeText = "PRESS ";
  const keyText = "ENTER";
  const afterText = " OR CLICK THE MOUSE TO CONTINUE";

  const keyPadding = 14;
  const beforeW = textWidth(beforeText);
  const keyW = textWidth(keyText) + keyPadding * 2;
  const afterW = textWidth(afterText);
  const totalTextW = beforeW + keyW + afterW;

  const panelW = totalTextW + 50;
  const panelH = 70;

  // only one solid rectangle, no shadow
  noStroke();
  fill(145, 150, 158);
  rect(width / 2, y, panelW, panelH, 16);

  let currentX = width / 2 - totalTextW / 2;

  // PRESS
  textAlign(LEFT, CENTER);
  fill(255);
  text(beforeText, currentX, y - 1);
  currentX += beforeW;

  // ENTER key box
  rectMode(CORNER);
  fill(245);
  rect(currentX, y - 23, keyW, 46, 8);

  fill(100, 110, 125);
  textAlign(CENTER, CENTER);
  text(keyText, currentX + keyW / 2, y - 1);

  currentX += keyW;

  // TO CONTINUE
  fill(255);
  textAlign(LEFT, CENTER);
  text(afterText, currentX, y - 1);

  pop();
}

function drawDialogueCard(cardImage) {
  push();
  imageMode(CENTER);

  // Smaller dialogue-card size
  const cardW = min(620, width - 300);
  const cardH = cardW * (cardImage.height / cardImage.width);

  // Vertically centered
  const cardY = height / 2;

  image(
    cardImage,
    width / 2,
    cardY,
    cardW,
    cardH
  );

  pop();
}

function drawTutorialOverlay() {
  // Show this before the avalanche warning
  if (enterInstructionActive) {
    drawEnterInstruction();
    return;
  }

  // Count down delay
  if (tutorialDelay > 0) {
    tutorialDelay--;
    return;
  }

  // Avalanche warning dialogue
  if (tutorialIndex === 0) {
    if (!warningSoundPlayed) {
      warningSoundPlayed = true;
      if (warningSound && warningSound.isLoaded()) {
        warningSound.play();
      }
    }
    drawDialogueCard(avalancheCard);
    return;
  }

  // Hurry dialogue
  if (tutorialIndex === 1) {
    drawDialogueCard(hurryCard);
    return;
  }

  // Direction controls card
  if (tutorialIndex === 2) {
    push();
    imageMode(CENTER);

    const cardW = min(640, width - 280);
    const cardH =
      cardW *
      (instructionDirectionCard.height /
        instructionDirectionCard.width);

    image(
      instructionDirectionCard,
      width / 2,
      height / 2 + 20,
      cardW,
      cardH
    );

    pop();
    return;
  }

  // Space warning dialogue
  if (tutorialIndex === 3) {
    drawDialogueCard(spaceDialogueCard);
    return;
  }
}

function drawTutorialButton(label, x, y, w, h, pressedFlag) {
  let offsetY = pressedFlag ? 4 : 0;

  // HITBOX (correct)
  let hover = mouseX > x - w / 2 && mouseX < x + w / 2 &&
              mouseY > y - h / 2 + offsetY && mouseY < y + h / 2 + offsetY;

  // CLICK detection
  let clicked = hover && mouseIsPressed;

  // VISUAL pulse
  let pulse = sin(frameCount * 0.07) * (hover ? 0 : 3);

  // --- drawing code unchanged ---
  noStroke();
  fill(10, 20, 60, 130);
  rect(floor(x - w / 2 + 5), floor(y - h / 2 + 5 + offsetY), w, h, 8);

  fill(hover ? 60 : 42, hover ? 90 : 68, hover ? 175 : 150, 230);
  stroke(130, 170, 230, 200);
  strokeWeight(3);
  rect(floor(x - w / 2 + pulse / 2), floor(y - h / 2 + offsetY + pulse / 2), w - pulse, h - pulse, 8);
  noStroke();

  fill(255, 255, 255, 50);
  rect(floor(x - w / 2 + pulse / 2 + 4), floor(y - h / 2 + offsetY + pulse / 2 + 4), w - pulse - 8, 10, 4);

  textFont(gameFont);
  textSize(36);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);

  let textYOffset = -4;

  for (let [ox, oy] of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) {
    fill(10, 20, 70, 200);
    text(label, floor(x + ox), floor(y + offsetY + oy + textYOffset));
  }

  fill(210, 230, 255);
  text(label, floor(x), floor(y + offsetY + textYOffset));
  return { hover, clicked };
}