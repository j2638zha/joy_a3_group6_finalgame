//sketch.js file
// Screen manager
let gameState = "start"; 
let startBg;
let winBg;
let lossBg;
let bgImg;
let level1Bg;
let level2Bg;
let level3Bg;
let transitionPage;
let levelPickerBg;

let transitionStartTime = 0;
const TRANSITION_DURATION = 3000; 

// Buttons states:
let startBtnPressed = false;
let winBtnPressed = false;
let lossBtnPressed = false;
let levelPickerBtnPressed = false;

// Background stuff
const VIEW_W  = 1200;
const VIEW_H  = 780;
let WORLD_W;
let WORLD_H;
let WORLD_W_SCALED;
let WORLD_H_SCALED;
let bgScale;
let WORLD_TOP_LIMIT;
let finishY;
const CAM_SMOOTHING = 0.08;
let camX = 0;
let camY = 0;
let camZoom = 2; //change back to 2

// Diagonal wall bounds
const WALL_MARGIN = 10;
const walls = [];

// ---------------- GOAT SYSTEM ----------------
let goatSprite;
let goatFrames = [];
let goatX = 0;
let goatY = 0;
let goatFrameIndex = 0;
let goatActive = false;
let goatStartTime = 0;
let goatInitialized = false;
let goatDirection = "left";
let goatHasKilledOnce = false;   // has the tutorial kill already happened?
let goatTriggered = false;       // generic “run across screen” trigger
let goatTriggerTime = 0;         // when we started the countdown
let goatSpeed = 6;               // movement speed
let goatNextSpawnDelay = 3000;  // first retry goat comes after 3s





const SPRITES = {
  up: {
    img: null,
    frameWidth: 520,
    frameHeight: 715,
    numFrames: 6,
    animSpeed: 7,
    scale: 0.3,
    offsetX: 0,
    offsetY: 0,

    cropLeft:  [65, 25, 0, 0, 0, 0],
    cropRight: [0, 0, 20, 60, 90, 120],
    cropTop:   [0, 0, 0, 0, 0, 60],
    cropBottom:[180, 180, 180, 180, 180, 180]
  },

  start_penguin: {
    img: null,
    frameWidth: 155,
    frameHeight: 152,
    numFrames: 4,
    animSpeed: 40,
    scale: 3,

    cropLeft:  [0, 10, 20, 20],
    cropRight: [25, 20, 10, 5],
    cropTop:   [0, 0, 0, 0],
    cropBottom:[0, 0, 0, 0]
  },

  left: {
    img: null,
    frameWidth: 374,
    frameHeight: 275,
    numFrames: 6,
    animSpeed: 9,
    scale: 0.37,
    offsetX: -2,
    offsetY: 0,

    cropLeft:  [25, 35, 45, 55, 65, 75],
    cropRight: [0, 0, 0, 0, 0, 0],
    cropTop:   [0, 0, 0, 0, 0, 0],
    cropBottom:[0, 0, 0, 0, 0, 0]
  },

  right: {
    img: null,
    frameWidth: 374,
    frameHeight: 273,
    numFrames: 6,
    animSpeed: 7,
    scale: 0.37,
    offsetX: -2,
    offsetY: 0,

    cropLeft:  [0, 8, 8, 8, 30, 30],
    cropRight: [0, 0, 0, 0, 0, 0],
    cropTop:   [0, 0, 0, 0, 0, 0],
    cropBottom:[0, 0, 0, 0, 0, 0],
  },

  down: {
    img: null,
    frameWidth: 380,
    frameHeight: 241,
    numFrames: 6,
    animSpeed: 7,
    scale: 0.4,
    offsetX: 0,
    offsetY: 0,
    flashlightLength: 190,

    cropLeft:  [130, 85, 25, 0, 0, 0],
    cropRight: [0, 0, 0, 25, 65, 85],
    cropTop:   [0, 0, 0, 0, 0, 0],
    cropBottom:[0, 0, 0, 0, 0, 0]
  },

  wd: {
    img: null,
    frameWidth: 259,
    frameHeight: 181,
    numFrames: 4,
    animSpeed: 12,
    scale: 0.55,
    offsetX: 0,
    offsetY: 0,

    cropLeft:   [0, 0, 20, 30],
    cropRight:  [0, 0, 0, 0],
    cropTop:    [0, 0, 0, 0],
    cropBottom: [0, 0, 0, 0]
  },

  aw: {
    img: null,
    frameWidth: 259,
    frameHeight: 181,
    numFrames: 4,
    animSpeed: 12,
    scale: 0.55,
    offsetX: 0,
    offsetY: 0,

    cropLeft:   [0, 0, 20, 50],
    cropRight:  [0, 0, 0, 0],
    cropTop:    [0, 0, 0, 0],
    cropBottom: [0, 0, 0, 0]
  },

  sd: {
    img: null,
    frameWidth: 257,
    frameHeight: 180,
    numFrames: 4,
    animSpeed: 12,
    scale: 0.57,
    offsetX: 0,
    offsetY: 0,

    cropLeft:   [0, 0, 40, 90],
    cropRight:  [0, 0, 0, 0],
    cropTop:    [0, 0, 0, 0],
    cropBottom: [0, 0, 0, 0]
  },

  as: {
    img: null,
    frameWidth: 257,
    frameHeight: 180,
    numFrames: 4,
    animSpeed: 12,
    scale: 0.57,
    offsetX: 0,
    offsetY: 0,

    cropLeft:   [0, 0, 40, 90],
    cropRight:  [0, 0, 0, 0],
    cropTop:    [0, 0, 0, 0],
    cropBottom: [0, 0, 0, 0]
  },

  stomp: {
    img: null,
    frameWidth: 140,
    frameHeight: 210,
    numFrames: 6,
    animSpeed: 10,
    scale: 1,

    cropLeft:   [0,0,0,0,0,0],
    cropRight:  [0,0,0,0,0,0],
    cropTop:    [0,0,0,0,0,0],
    cropBottom: [0,0,0,0,0,0]
  },

  goat: {
  img: null,
  frameWidth: 248,   // 247–248 is correct
  frameHeight: 248,  // 247–248 is correct
  numFrames: 5,      // 5 columns
  animSpeed: 20,
  scale: 0.3,

  cropLeft:   [10, 15, 20, 15, 10],
  cropRight:  [10, 15, 20, 15, 10],
  cropTop:    [0, 0, 0, 0, 0],
  cropBottom: [0, 0, 0, 0, 0]

}


};



let player = {
  x: 0,
  y: 0,
  w: 90,
  h: 90,
  speed: 3,
  currentFrame: 0,
  frameTimer: 0,
  direction: "up",
  isMoving: false,
};

// World-space Y where the penguin should spawn. This matches the
// bottom movement clamp in handleInput (WORLD_H_SCALED - player.h / 2),
// computed from the idle "up" sprite (frame 0), which is what player.h
// becomes while the penguin stands still during the tutorial. Spawning
// here means the first keypress after the tutorial moves the penguin
// smoothly instead of snapping it up the screen.
function playerSpawnY() {
  const cfg = SPRITES.up;
  const idleH =
    (cfg.frameHeight - cfg.cropTop[0] - cfg.cropBottom[0]) * cfg.scale;
  return WORLD_H_SCALED - idleH / 2;
}

// Builds the world (background, walls, spikes, fish) for whichever
// level number is passed in. Call this before resetGame() whenever
// the player enters a level.
function loadLevel(levelNum) {
  let img, topOffset;
  if (levelNum === 1) { img = level1Bg; topOffset = LEVEL1_TOP_OFFSET; }
  else if (levelNum === 2) { img = level2Bg; topOffset = LEVEL2_TOP_OFFSET; }
  else if (levelNum === 3) { img = level3Bg; topOffset = LEVEL3_TOP_OFFSET; }
  if (levelNum === 3) {
    goatX = WORLD_W_SCALED / 2 - 200;
    goatY = WORLD_H_SCALED / 2 + 200;
}


  bgImg = img;
  WORLD_W = img.width;
  WORLD_H = img.height;
  bgScale = Math.max(VIEW_W / WORLD_W, VIEW_H / WORLD_H);
  WORLD_W_SCALED = WORLD_W * bgScale;
  WORLD_H_SCALED = WORLD_H * bgScale;
  WORLD_TOP_LIMIT = WORLD_H_SCALED / 2 - topOffset;
  if (levelNum === 1) finishY = LEVEL1_FINISH_Y;
  else if (levelNum === 2) finishY = LEVEL2_FINISH_Y;
  else if (levelNum === 3) finishY = LEVEL3_FINISH_Y;

  // Fish
  let fishStart;
  if (levelNum === 1) { fishStart = getLevel1FishStart(WORLD_W_SCALED, WORLD_H_SCALED); fishSpawns = LEVEL1_FISH_SPAWNS; }
  else if (levelNum === 2) { fishStart = getLevel2FishStart(WORLD_W_SCALED, WORLD_H_SCALED); fishSpawns = LEVEL2_FISH_SPAWNS; }
  else if (levelNum === 3) { fishStart = getLevel3FishStart(WORLD_W_SCALED, WORLD_H_SCALED); fishSpawns = LEVEL3_FISH_SPAWNS; }
  fish.x = fishStart.x;
  fish.y = fishStart.y;
  fish.collected = false;

  // Walls (clear old level's walls first, then rebuild)
  walls.length = 0;
  if (levelNum === 1) walls.push(...buildLevel1Walls(WORLD_W_SCALED, WORLD_H_SCALED));
  else if (levelNum === 2) walls.push(...buildLevel2Walls(WORLD_W_SCALED, WORLD_H_SCALED));
  else if (levelNum === 3) walls.push(...buildLevel3Walls(WORLD_W_SCALED, WORLD_H_SCALED));

  // Spikes
  if (levelNum === 1) spikes = LEVEL1_SPIKES.map(s => ({ ...s }));
  else if (levelNum === 2) spikes = LEVEL2_SPIKES.map(s => ({ ...s }));
  else if (levelNum === 3) spikes = LEVEL3_SPIKES.map(s => ({ ...s }));

  // Spawn player, then figure out which side of each wall is "legal"
  player.x = WORLD_W_SCALED / 2;
  player.y = playerSpawnY();

  for (let w of walls) {
    w.side = Math.sign(pointSide(player.x, player.y, w.x1, w.y1, w.x2, w.y2));
  }
}

const PENGUIN_HITBOX = {
  w: 30,
  h: 40,
  offsetX: -15,
  offsetY: -35   // because the sprite is now anchored at the feet
};

let DEBUG_PENGUIN_HITBOX = false; // remove after debugging
let DEBUG_SHOW_COORDS = true; // shows player x,y on screen - use this to find coordinates for your new levels. Set to false when done building.

let clearRadius = 100; // circle width
let holeOffsetX = -3;
let holeOffsetY = -50;
let flashlight = {
  baseWidth: 200, // width of flashlight near penguin
  endWidth: 330, // max width
  length: 220,
  opacity: 180,     // white glow strength
  glowOpacity: 255, // outer white ring
};

// TIMER
let totalTime = 180;
let startTime;
let timerStarted = false;
let gameEnded = false;  
let finalTime = null;
let flashTimer = 0;
let fastestTimes = {
    level1: null,
    level2: null,
    level3: null
};
let fastestTimesIsNew = {
    level1: false,
    level2: false,
    level3: false
};

//STOMPING ANIMATION
let stompAnimating = false;
let stompFrame = 0;
let stompFrameTimer = 0;
const STOMP_FRAME_DURATIONS = [10, 10, 10, 10, 70, 10];
const STOMP_NUM_FRAMES = 6;
let waveActive = false;
let waveRadius = 100;
let waveMaxRadius = 730; 
let waveGrowth = 25;
let waveDelay = 0;
let waveDelayActive = false;
let blueBuffer;
let ringMaskBuffer;
let ringOffsetX = 0;
let ringOffsetY = -50;
let stompOffsetX = -5;
let stompOffsetY = 0;

// ROCKY SPIKES — generic hitbox/image config. Per-level spike
// PLACEMENT (the x/y/variant list) lives in level_1.js etc, and
// gets loaded into `spikes` when that level starts.
const SPIKE_DRAW_W = 60;
const SPIKE_DRAW_H = 60;
const SPIKE_HITBOXES = [
  { w: 30, h: 40, offsetX: 14, offsetY: 15 },  // small spike
  { w: 45, h: 40, offsetX: 8, offsetY: 15 },  // mid spike
  { w: 48, h: 40, offsetX: 7, offsetY: 17 },  // tall spike
  { w: 45, h: 40, offsetX: 5, offsetY: 15 }   // double spike
];
let spikeImages = [];
let spikes = [];
let DEBUG_SPIKE_HITBOXES = false; //remove after testing

// Gameplay popup cards (fish messages)
let popUpCard;
let foundPopupCard;

// Fish item
let fishImg;
let fish = {
  x: 0,
  y: 0,
  w: 35,
  h: 25,
  collected: false
};
let fishIconOutline;   // when NOT collected
let fishIconFilled;    // when collected
let needFishMessageActive = false;
let needFishMessageTimer = 0;
let needFishMessageDuration = 180; // 3 seconds at 60fps
let foundFishMessageActive = false;
let foundFishMessageTimer = 0;
let foundFishMessageDuration = 240

// Per-level fish spawn points. Set to LEVEL1_FISH_SPAWNS /
// LEVEL2_FISH_SPAWNS / etc when a level is loaded — see
// randomizeFishPosition().
let fishSpawns = [];

// Animated fish
let fishSheet;
let fishFrameWidth = 120;
let fishFrameHeight = 120;
let fishTotalFrames = 8;
let currentFishFrame = 0;
let fishAnimationSpeed = 10;

// Stars score
let starOutlineImg;
let starFilledImg;
let starsEarned = 0; 
let bestStars = { //highest score tracker
  level1: 0,
  level2: 0,
  level3: 0
};

function preload() {
  gameFont = loadFont("assets/fonts/jersey10.ttf");
  SPRITES.up.img = loadImage("assets/images/w_key_penguin.png");
  SPRITES.start_penguin.img = loadImage("assets/images/penguin_front.png");
  SPRITES.left.img = loadImage("assets/images/a_key_penguin.png");
  SPRITES.right.img = loadImage("assets/images/d_key_penguin.png");
  SPRITES.down.img = loadImage("assets/images/s_key_penguin.png");
  SPRITES.stomp.img = loadImage("assets/images/penguin_stomp.png");
  SPRITES.wd.img = loadImage("assets/images/wd_key_penguin.png");
  SPRITES.aw.img = loadImage("assets/images/aw_key_penguin.png");
  SPRITES.sd.img = loadImage("assets/images/sd_key_penguin.png");
  SPRITES.as.img = loadImage("assets/images/as_key_penguin.png");
  startBg = loadImage("assets/images/title_screen.png");
  winBg   = loadImage("assets/images/win_screen.png");
  lossBg  = loadImage("assets/images/loss_screen.png");
  transitionPage = loadImage("assets/images/transition_page.png");

  // Tutorial card assets (tutorial_cards.js)
  preloadTutorialAssets();
  preloadLevelPickerAssets();

  // Fishy stuff
  fishImg = loadImage("assets/images/test_fish.png");
  fishSheet = loadImage("assets/images/fish.png");
  fishIconOutline = loadImage("assets/images/fish_outline.png"); 
  fishIconFilled  = loadImage("assets/images/fish_item.png");

  // Star score
  starOutlineImg = loadImage("assets/images/star_outline.png");
  starFilledImg  = loadImage("assets/images/golden_star.png");

  spikeImages[0] = loadImage("assets/images/spike_small.png");
  spikeImages[1] = loadImage("assets/images/spike_mid.png");
  spikeImages[2] = loadImage("assets/images/spike_tall.png");
  spikeImages[3] = loadImage("assets/images/spike_double.png");

  level1Bg = loadImage("assets/images/tutorial_background.png");
  level2Bg = loadImage("assets/images/level2_background.png");
  level3Bg = loadImage("assets/images/level3_background.png");

 SPRITES.goat.img = loadImage("assets/images/goat_spritesheet.png");

}

function setup() {
  createCanvas(VIEW_W, VIEW_H);
  pixelDensity(1);
  imageMode(CORNER);
  startTime = millis();
  blueBuffer  = createGraphics(VIEW_W, VIEW_H);
  ringMaskBuffer = createGraphics(VIEW_W, VIEW_H);
  loadLevel(1);
}

let DEBUG_SHOW_WALLS = false; // shows wall lines in red — set to false when done

function drawWalls() {
  if (!DEBUG_SHOW_WALLS) return;
  push();
  stroke(255, 0, 255); // bright magenta so it stands out against the background
  strokeWeight(6 / (camZoom * bgScale));
  for (let w of walls) {
    line(w.x1, w.y1, w.x2, w.y2);
  }
  pop();
}

function drawSpikes() {
  for (let s of spikes) {
    let img = spikeImages[s.variant];
    image(img, s.x, s.y, SPIKE_DRAW_W, SPIKE_DRAW_H);
  }
}

function drawSpikeHitboxes() {
  if (!DEBUG_SPIKE_HITBOXES) return;

  push();
  noFill();

  for (let s of spikes) {
    let hb = SPIKE_HITBOXES[s.variant];
    if (!hb) continue;

    // BLUE = full spike sprite bounds
    stroke(0, 140, 255);
    strokeWeight(3 / (camZoom * bgScale));
    rect(s.x, s.y, SPIKE_DRAW_W, SPIKE_DRAW_H);

    // RED = actual collision hitbox
    stroke(255, 0, 0);
    strokeWeight(3 / (camZoom * bgScale));
    rect(
      s.x + hb.offsetX,
      s.y + hb.offsetY,
      hb.w,
      hb.h
    );
  }
  pop();
}

function drawPenguinHitbox() {
  if (!DEBUG_PENGUIN_HITBOX) return;

  let hw = PENGUIN_HITBOX.w;
  let hh = PENGUIN_HITBOX.h;
  let ox = PENGUIN_HITBOX.offsetX;
  let oy = PENGUIN_HITBOX.offsetY;

  let scale = camZoom * bgScale;

  let screenX = (player.x + ox - camX) * scale;
  let screenY = (player.y + oy - camY) * scale;

  push();
  noFill();
  stroke(0, 255, 0);
  strokeWeight(3);
  rect(
    screenX,
    screenY,
    hw * scale,
    hh * scale
  );
  pop();
}

function drawButton(label, x, y, w, h, pressedFlag) {
  let offsetY = pressedFlag ? 4 : 0;
  let hover = mouseX > x - w/2 && mouseX < x + w/2 &&
              mouseY > y - h/2 + offsetY && mouseY < y + h/2 + offsetY;
  let pulse = sin(frameCount * 0.07) * (hover ? 0 : 3);

  // shadow
  noStroke();
  fill(10, 20, 60, 130);
  rect(floor(x-w/2+5), floor(y-h/2+5+offsetY), w, h, 8);

  // body
  fill(hover ? 60 : 42, hover ? 90 : 68, hover ? 175 : 150, 230);
  stroke(130, 170, 230, 200);
  strokeWeight(3);
  rect(floor(x-w/2+pulse/2), floor(y-h/2+offsetY+pulse/2), w-pulse, h-pulse, 8);
  noStroke();

  // shine
  fill(255, 255, 255, 50);
  rect(floor(x-w/2+pulse/2+4), floor(y-h/2+offsetY+pulse/2+4), w-pulse-8, 10, 4);

  // label
  textFont(gameFont);
  textSize(48);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);

  for (let [ox,oy] of [[-2,-2],[2,-2],[-2,2],[2,2]]) {
    fill(10, 20, 70, 200);
    text(label, floor(x+ox), floor(y+offsetY+oy-5));
  }

  fill(210, 230, 255);
  text(label, floor(x), floor(y+offsetY-5));
  return hover;
}

function drawFish() {
  if (fish.collected) return;

  // Animate fish
  if (frameCount % fishAnimationSpeed === 0) {
    currentFishFrame =
      (currentFishFrame + 1) % fishTotalFrames;
  }

  let sx = currentFishFrame * fishFrameWidth;
  let sy = 0;

  image(
    fishSheet,
    fish.x,
    fish.y,
    fish.w,
    fish.h + 10,
    sx,
    sy,
    fishFrameWidth,
    fishFrameHeight
  );
}

function drawFishIconUI() {
  let x = 40;   // screen position
  let y = 40;
  let iconW = 80;   // width
  let iconH = 50;   // height

  if (fish.collected) {
    image(fishIconFilled, x, y, iconW, iconH);
  } else {
    image(fishIconOutline, x, y, iconW, iconH);
  }
}

function randomizeFishPosition() {
  let spot = random(fishSpawns);   // p5.js random() picks a random element
  fish.x = spot.x;
  fish.y = spot.y;
}

const START_BTN = { x: 430, y: 675, w: 330, h: 60 };

function drawStartScreen() {
  imageMode(CORNER);
  image(startBg, 0, 0, width, height);

  let hover = mouseX > START_BTN.x && mouseX < START_BTN.x + START_BTN.w &&
              mouseY > START_BTN.y && mouseY < START_BTN.y + START_BTN.h;

  if (hover) {
    cursor(HAND);
    noStroke();
    fill(255, 255, 255, 40);
    rect(START_BTN.x, START_BTN.y, START_BTN.w, START_BTN.h, 8);
  } else {
    cursor(ARROW);
  }
}

function startLevelPickerTransition() {
  transitionStartTime = millis();
  gameState = "transition";
  cursor(ARROW);
}

function drawSnowyLoadingBar(progress, x, y, w, h) {
  push();
  rectMode(CORNER);

  // Outer icy frame
  noStroke();
  fill(18, 35, 70, 220);
  rect(x, y, w, h, 18);

  // Empty bar background
  fill(210, 230, 255, 55);
  rect(x + 8, y + 8, w - 16, h - 16, 12);

  // Filled section
  const innerW = (w - 16) * progress;

  fill(120, 190, 255, 220);
  rect(x + 8, y + 8, innerW, h - 16, 12);

  // Ice highlight
  fill(255, 255, 255, 70);
  rect(x + 8, y + 8, innerW, (h - 16) * 0.35, 12);

  // Snow along the top
  fill(245, 250, 255);
  for (let i = 0; i < 7; i++) {
    const snowX = x + 18 + i * ((w - 36) / 6);
    circle(snowX, y + 6, 16);
  }

  // Moving snowflake
  let markerX = x + 8 + innerW;
  markerX = constrain(markerX, x + 18, x + w - 18);

  textAlign(CENTER, CENTER);
  textSize(24);
  fill(255);
  text("❄", markerX, y + h / 2);

  pop();
}

function drawTransitionScreen() {
  imageMode(CORNER);

  // Background image
  image(transitionPage, 0, 0, width, height);

  // Progress from 0 to 1
  let elapsed = millis() - transitionStartTime;
  let progress = constrain(elapsed / TRANSITION_DURATION, 0, 1);

  // Bar position
  let barW = 420;
  let barH = 36;
  let barX = width / 2 - barW / 2;
  let barY = height / 2 + 80;

  drawSnowyLoadingBar(progress, barX, barY, barW, barH);

  // Optional percent text
  push();
  textFont(gameFont);
  textAlign(CENTER, CENTER);
  textSize(26);
  fill(235, 245, 255);
  text(floor(progress * 100) + "%", width / 2, barY + 70);
  pop();

  // When full, go to level picker
  if (progress >= 1) {
    gameState = "level_picker";
  }
}

function draw() {
  // START SCREEN
  if (gameState === "start") {
    drawStartScreen();
    return;
  }

  // WIN SCREEN
  if (gameState === "win") {
    drawWinScreen();
    return;
  }

  // LOSS SCREEN
  if (gameState === "loss") {
    drawLossScreen();
    return;
  }

  // WIN → LEVEL PICKER TRANSITION
if (gameState === "transition") {
  drawTransitionScreen();
  return;
}

  // LEVEL PICKER
  if (gameState === "level_picker") {
    drawLevelPickerScreen();
    return;
  }


  // -------------------------
  // GAMEPLAY
  // -------------------------
  if (gameEnded) {
    gameState = "loss";
    return;
  }

  if (!timerStarted) {
    timerStarted = true;
    startTime = millis();
}


  handleInput();
  animateSprite();
  updateCamera();
  updateStompAnimation();
  checkFishCollision(); 

  // ---------------- GOAT INIT (only for Level 3) ----------------
if (currentLevel === 3 && !goatInitialized) {
    goatInitialized = true;
    goatStartTime = millis();
    goatDirection = random(["left", "right"]);
  
}



  // --- BLOCK TOP EXIT IF FISH NOT COLLECTED ---
  if (!fish.collected) {
    if (player.y < WORLD_TOP_LIMIT + 40) {
      // stop movement
      player.y = WORLD_TOP_LIMIT + 40;

      // trigger popup message
      needFishMessageActive = true;
      needFishMessageTimer = needFishMessageDuration;
    }
  }

// -------------------------
// WIN CONDITION (correct)
// -------------------------
if (player.y < finishY && fish.collected) {
      let elapsed = floor((millis() - startTime) / 1000);
      finalTime = elapsed;

      // --- STAR SCORING ---
      starsEarned = 0;
      if (fish.collected) starsEarned++;
      let timeLeft = totalTime - finalTime;
      if (timeLeft >= 30) starsEarned++;
      if (timeLeft >= 60) starsEarned++;

      // highest score
      let starKey = "level" + currentLevel;
      if (starsEarned > bestStars[starKey]) {
        bestStars[starKey] = starsEarned;
      }

      // --- UPDATE FASTEST TIME ---
      let key = "level" + currentLevel;
      if (fastestTimes[key] === null || finalTime < fastestTimes[key]) {
          fastestTimes[key] = finalTime;
          fastestTimesIsNew[key] = true;
      } else {
          fastestTimesIsNew[key] = false;
      }

      tutorialActive = false;
      postTutorialTimerActive = false;

      gameState = "win";
      return;
  }

  // WAVE DELAY + WAVE UPDATE
  if (waveDelayActive) {
    waveDelay--;
    if (waveDelay <= 0) {
      waveDelayActive = false;
      startWaveForFrame(4);
    }
  }

  if (waveActive) {
    updateWave();
  }

  // DRAW WORLD
  // DRAW WORLD
  push();
  scale(camZoom * bgScale);
  translate(-camX, -camY);
  drawBackground();
  drawSpikes();
  drawFish();
  drawSpikeHitboxes();
  drawWalls();
  pop();

  // ---------------- GOAT UPDATE ----------------
if (currentLevel === 3) {
    updateLevel3Goat();
}


  // DRAW CHARACTER
  drawCharacterOnScreen();
  drawPenguinHitbox();

  // Capture world frame for X-ray ring
  baseWorldFrame = get();

  // BLIZZARD OVERLAY
  drawBlizzardOverlay();

  // X-RAY RING
  if (waveActive) {
    ringMaskBuffer.clear();
    ringMaskBuffer.noStroke();

    const cx = (player.x - camX) * camZoom * bgScale + ringOffsetX;
    const cy = (player.y - camY) * camZoom * bgScale + ringOffsetY;

    const outerRadius = waveRadius;
    const innerRadius = waveRadius - 80;

    ringMaskBuffer.fill(255);
    ringMaskBuffer.circle(cx, cy, outerRadius * 2);

    if (innerRadius > 0) {
      ringMaskBuffer.erase();
      ringMaskBuffer.circle(cx, cy, innerRadius * 2);
      ringMaskBuffer.noErase();
    }

    blueBuffer.clear();
    blueBuffer.image(baseWorldFrame, 0, 0);

    let maskedBlue = blueBuffer.get();
    maskedBlue.mask(ringMaskBuffer);

    let fade = map(waveRadius, waveMaxRadius * 0.7, waveMaxRadius, 255, 0);
    fade = constrain(fade, 0, 255);

    tint(0, 120, 255, fade);
    image(maskedBlue, 0, 0);
    noTint();
  }

  // TIMER
  drawTimer();

  // draw fish ui
  drawFishIconUI();

  // DEBUG: on-screen coordinates — walk the penguin around and read
  // these numbers off to build your walls/spikes/fish spots for new levels
  if (DEBUG_SHOW_COORDS) {
    push();
    fill(255);
    stroke(0);
    strokeWeight(3);
    textSize(20);
    textAlign(LEFT, TOP);
    text("Player: " + floor(player.x) + ", " + floor(player.y), 20, 120);
    pop();
  }

  // TUTORIAL POST-DELAY (tutorial_cards.js)
  updatePostTutorialTimer();

  // TUTORIAL OVERLAY (tutorial_cards.js)
  if (tutorialActive) {
      drawTutorialOverlay();
  }

  // --- NEED FISH POPUP MESSAGE ---
 if (needFishMessageActive) {
  needFishMessageTimer--;

  push();
  imageMode(CENTER);

  const cardW = min(730, width - 160);
  const cardH =
    cardW * (popUpCard.height / popUpCard.width);

  const cardY = 180; // moves the popup closer to the timer

  image(
    popUpCard,
    width / 2,
    cardY,
    cardW,
    cardH
  );

  pop();

  if (needFishMessageTimer <= 0) {
    needFishMessageActive = false;
  }
}

if (foundFishMessageActive) {
  foundFishMessageTimer--;

  push();
  imageMode(CENTER);

  if (
    foundPopupCard &&
    foundPopupCard.width > 0 &&
    foundPopupCard.height > 0
  ) {
    const cardW = min(750, width - 180);
    const cardH =
      cardW * (foundPopupCard.height / foundPopupCard.width);

    const cardY = 180;

    image(
      foundPopupCard,
      width / 2,
      cardY,
      cardW,
      cardH
    );
  }

  pop();

  if (foundFishMessageTimer <= 0) {
    foundFishMessageActive = false;
  }
}
}

function keyPressed() {
  // START SCREEN → ENTER → LEVEL PICKER
  if (gameState === "start" && keyCode === ENTER) {
      gameState = "level_picker";
      return;
  }

  // TUTORIAL INPUT (tutorial_cards.js)
  if (handleTutorialKeyPressed()) return;

  // WIN SCREEN → ENTER → START
  if (gameState === "win" && keyCode === ENTER) {
    gameState = "start";
    return;
  }

  // LOSS SCREEN → R → RESTART
  if (gameState === "loss" && key === "r") {
    resetGame();
    gameState = "playing";
    cursor(ARROW)
    return;
  }

  // LOSS SCREEN → ENTER → START
  if (gameState === "loss" && keyCode === ENTER) {
    gameState = "start";
    return;
  }
}

function resetGame() {
  gameEnded = false;
  startTime = 0;
  timerStarted = false;
  finalTime = null;

  totalTime = 180;   // reset timer
  flashTimer = 0;

  // reset tutorial state (tutorial_cards.js)
  resetTutorial();

  // Same spawn Y as the movement clamp — no jump on first step
  player.x = WORLD_W_SCALED / 2;
  player.y = playerSpawnY();

  stompAnimating = false;
  stompFrame = 0;
  waveActive = false;
  waveRadius = 0;

  fish.collected = false;
  randomizeFishPosition();

  // GOAT RESET LOGIC
  goatActive = false;
  goatInitialized = false;
  goatTriggered = false;
  goatTriggerTime = 0;

  // If they’ve already been killed once by the goat,
  // we arm the “later random border” behaviour for level 3.
  if (currentLevel === 3 && goatHasKilledOnce) {
    goatTriggered = true;
    goatTriggerTime = millis();   // start delay for second run
  }
  if (currentLevel === 3 && goatHasKilledOnce) {
  goatTriggered = true;
  goatTriggerTime = millis();
  goatNextSpawnDelay = 1000; // first goat after retry
}

}

function signedDistToWall(px, py, w) {
  const len = Math.hypot(w.x2 - w.x1, w.y2 - w.y1);
  return pointSide(px, py, w.x1, w.y1, w.x2, w.y2) / len;
}

// true if (px, py) is on the legal side of EVERY wall, with margin
function isLegalPosition(px, py) {
  for (let w of walls) {
    if (signedDistToWall(px, py, w) * w.side < WALL_MARGIN) {
      return false;
    }
  }
  return true;
}

function pointSide(px, py, x1, y1, x2, y2) {
  return (x2 - x1) * (py - y1) - (y2 - y1) * (px - x1);
}

function drawBackground() {
  image(bgImg, 0, 0, WORLD_W_SCALED, WORLD_H_SCALED);
}

function updateCamera() {
  if (!WORLD_W_SCALED || !WORLD_H_SCALED) return;

  // visible window in world units
  let visibleW = VIEW_W / (camZoom * bgScale);
  let visibleH = VIEW_H / (camZoom * bgScale);

  // center camera on player
  let targetX = player.x - visibleW / 2;
  let targetY = player.y - visibleH * 0.7;

  // clamp camera to scaled world
  targetX = constrain(targetX, 0, (WORLD_W_SCALED - visibleW) - 30);
  targetY = constrain(targetY, WORLD_TOP_LIMIT, WORLD_H_SCALED - visibleH);

  camX = lerp(camX, targetX, CAM_SMOOTHING);
  camY = lerp(camY, targetY, CAM_SMOOTHING);
}

function drawTimer() {
  let elapsed = 0;
  if (timerStarted) {
      elapsed = floor((millis() - startTime) / 1000);
  }
  let timeLeft = totalTime - elapsed;

  if (timeLeft <= 0) {
    timeLeft = 0;
    gameEnded = true;
  }

  let minutes = floor(timeLeft / 60);
  let seconds = timeLeft % 60;

  let timerText = minutes + ":" + nf(seconds, 2);

  // body
  let w = 200;
  let h = 70;
  let x = VIEW_W/2;
  let y = 70;

  // body
  fill(42, 68, 150, 230);
  stroke(130, 170, 230, 200);
  strokeWeight(3);
  rect(floor(x-w/2), floor(y-h/2), w, h, 8);
  noStroke();

  // shine
  fill(255, 255, 255, 50);
  rect(floor(x-w/2+4), floor(y-h/2+4), w-8, 10, 4);

  // FLASH LOGIC
  if (flashTimer > 0) {
    flashTimer--;

    // alternate red/white every 10 frames
    if (floor(flashTimer / 10) % 2 === 0) {
      fill(255, 0, 0);   // red
    } else {
      fill(255);         // white
    }
  } else {
    // normal timer color
    if (timeLeft <= 10) {
      fill(255, 0, 0);
    } else {
      fill(255);  // your normal color
    }
  }

  // label
  textFont(gameFont);
  textSize(72);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text(timerText, width / 2, 60);
}

function handleInput() {
  // Penguin is fully frozen while any tutorial card is on screen —
  // including the last (space dialogue) card. Movement is allowed
  // only when tutorialActive is false, i.e. normal play and the gap
  // between the flashlight card and the space card.
  if (tutorialActive) {
    player.isMoving = false;
    return;
  }

  if (stompAnimating) {
    player.isMoving = false;
    return;
  }

  let newX = player.x;
  let newY = player.y;

  // reset each frame
  player.isMoving = false;
  
  const W = keyIsDown(87);
  const A = keyIsDown(65);
  const S = keyIsDown(83);
  const D = keyIsDown(68);

    // --- FIRST GOAT TUTORIAL TRIGGER (LEVEL 3) ---
  if (currentLevel === 3 && W && !goatHasKilledOnce && !goatTriggered) {
    goatTriggered = true;
    goatTriggerTime = millis();   // start 3s countdown
  }

  // --- DIAGONALS FIRST ---
  if (W && D) {
    newX += player.speed;
    newY -= player.speed;
    player.direction = "wd";
    player.isMoving = true;
  }
  else if (A && W) {
    newX -= player.speed;
    newY -= player.speed;
    player.direction = "aw";
    player.isMoving = true;
  }
  else if (S && D) {
    newX += player.speed;
    newY += player.speed;
    player.direction = "sd";
    player.isMoving = true;
  }
  else if (A && S) {
    newX -= player.speed;
    newY += player.speed;
    player.direction = "as";
    player.isMoving = true;
  }

  // --- CARDINAL DIRECTIONS ---
  else if (W) {
    newY -= player.speed;
    player.direction = "up";
    player.isMoving = true;
  }
  else if (S) {
    newY += player.speed;
    player.direction = "down";
    player.isMoving = true;
  }
  else if (A) {
    newX -= player.speed;
    player.direction = "left";
    player.isMoving = true;
  }
  else if (D) {
    newX += player.speed;
    player.direction = "right";
    player.isMoving = true;
  }

  // --- STOMP ---
  if (keyIsDown(32) && !stompAnimating) {
    stompAnimating = true;
    stompFrame = 0;
    stompFrameTimer = 0;
    waveDelay = 0;
    waveDelayActive = false;
    totalTime = max(0, totalTime - 45);
    flashTimer = 150;
  }

  if (WORLD_W_SCALED && WORLD_H_SCALED) {
    newX = constrain(newX, player.w / 2, WORLD_W_SCALED - player.w / 2);
    newY = min(newY, WORLD_H_SCALED - player.h / 2);
  }

  // collision radius
  let r = player.w * 0.45;

  // three collision test points (world space)
  let topX    = newX;
  let topY    = newY - r;
  let leftX   = newX - r;
  let leftY   = newY;
  let rightX  = newX + r;
  let rightY  = newY;

  for (let w of walls) {
    function crossed(px, py) {
      let d0 = pointSide(player.x, player.y, w.x1, w.y1, w.x2, w.y2);
      let d1 = pointSide(px, py,        w.x1, w.y1, w.x2, w.y2);
      return d0 * d1 < 0;
    }

    if (crossed(topX, topY) ||
        crossed(leftX, leftY) ||
        crossed(rightX, rightY)) {

      let mx = newX - player.x;
      let my = newY - player.y;

      // compute wall normal
      let nx = w.y2 - w.y1;
      let ny = -(w.x2 - w.x1);

      // normalize
      let len = Math.hypot(nx, ny);
      nx /= len;
      ny /= len;

      // ⭐ ensure normal faces the player
      let side = pointSide(player.x, player.y, w.x1, w.y1, w.x2, w.y2);
      if (side < 0) {
        nx = -nx;
        ny = -ny;
      }

      // dot > 0 means movement is toward the wall
      let dot = mx * nx + my * ny;

      if (dot > 0) {
        mx -= dot * nx;
        my -= dot * ny;
      }

      newX = player.x + mx;
      newY = player.y + my;

      break;
    }
  }

  let dx = newX - player.x;
  let stepX = dx === 0 ? 0 : (dx > 0 ? 1 : -1);
  for (let i = 0; i < Math.abs(dx); i++) {
    let testX = player.x + stepX;
    if (!wouldCollideWithSpike(testX, player.y) &&
        isLegalPosition(testX, player.y)) {
      player.x = testX;
    } else {
      break;
    }
  }
  let dy = newY - player.y;
  let stepY = dy === 0 ? 0 : (dy > 0 ? 1 : -1);
  for (let i = 0; i < Math.abs(dy); i++) {
    let testY = player.y + stepY;
    if (!wouldCollideWithSpike(player.x, testY) &&
        isLegalPosition(player.x, testY)) {
      player.y = testY;
    } else {
      break;
    }
  }
}

function wouldCollideWithSpike(testX, testY) {
  let hw = PENGUIN_HITBOX.w;
  let hh = PENGUIN_HITBOX.h;
  let ox = PENGUIN_HITBOX.offsetX;
  let oy = PENGUIN_HITBOX.offsetY;
  let px = testX + ox;
  let py = testY + oy;
  for (let s of spikes) {
    let hb = SPIKE_HITBOXES[s.variant];
    if (!hb) continue;
    let hx = s.x + hb.offsetX;
    let hy = s.y + hb.offsetY;
    if (px + hw > hx && px < hx + hb.w && py + hh > hy && py < hy + hb.h) {
      return true;
    }
  }
  return false;
}

function checkFishCollision() {
  if (fish.collected) return;

  // Penguin hitbox in world coordinates
  let hb = PENGUIN_HITBOX;
  let px = player.x + hb.offsetX;
  let py = player.y + hb.offsetY;
  let pw = hb.w;
  let ph = hb.h;

  // Fish hitbox
  let fx = fish.x;
  let fy = fish.y;
  let fw = fish.w;
  let fh = fish.h;

  // AABB collision
  let overlap =
    px < fx + fw &&
    px + pw > fx &&
    py < fy + fh &&
    py + ph > fy;

  if (overlap) {
    fish.collected = true;

    // --- NEW POPUP TRIGGER ---
    foundFishMessageActive = true;
    foundFishMessageTimer = foundFishMessageDuration;
  }
}

function animateSprite() {
  let cfg = SPRITES[player.direction];

  if (player.isMoving) {
    player.frameTimer++;

    if (player.frameTimer >= cfg.animSpeed) {
      player.frameTimer = 0;
      player.currentFrame = (player.currentFrame + 1) % cfg.numFrames;
    }
  } else {
    player.currentFrame = 0;
    player.frameTimer = 0;
  }
}

function drawCharacterOnScreen() {
  if (stompAnimating) {
    let cfg = SPRITES.stomp;
    let f = stompFrame;
    let sx = f * cfg.frameWidth;
    let sy = 0;
    let sw = cfg.frameWidth;
    let sh = cfg.frameHeight;
    let dw = sw * cfg.scale;
    let dh = sh * cfg.scale;
    let screenX = (player.x - camX) * camZoom * bgScale - dw / 2 + stompOffsetX;
    let screenY = (player.y - camY) * camZoom * bgScale - dh + 10 + stompOffsetY;
    image(cfg.img, screenX, screenY, dw, dh, sx, sy, sw, sh);
    return;
  }

  let cfg = SPRITES[player.direction];
  let f   = player.currentFrame;

  // cropping
  let cropL = cfg.cropLeft[f]  || 0;
  let cropR = cfg.cropRight[f] || 0;
  let cropT = cfg.cropTop[f]   || 0;
  let cropB = cfg.cropBottom[f]|| 0;

  let sx = f * cfg.frameWidth + cropL;
  let sy = cropT;
  let sw = cfg.frameWidth  - cropL - cropR;
  let sh = cfg.frameHeight - cropT - cropB;

  // fixed-size penguin (never scales)
  let dw = sw * cfg.scale;
  let dh = sh * cfg.scale;
  player.w = dw;
  player.h = dh;
  player.offsetX = (cropL - cropR) * cfg.scale / 2;
  player.offsetY = (cropT - cropB) * cfg.scale / 2;

  // correct world → screen conversion
  let screenX = (player.x - camX) * camZoom * bgScale - dw / 2;
  let screenY = (player.y - camY) * camZoom * bgScale - dh + 10;

  image(cfg.img, screenX, screenY, dw, dh, sx, sy, sw, sh);
}

function updateStompAnimation() {
  if (!stompAnimating) return;

  stompFrameTimer++;

  if (stompFrameTimer >= STOMP_FRAME_DURATIONS[stompFrame]) {
    stompFrameTimer = 0;
    stompFrame++;

    if (stompFrame === 4) {
      waveDelay = 10;
      waveDelayActive = true;
    }

    if (stompFrame >= STOMP_NUM_FRAMES) {
      stompAnimating = false;
      stompFrame = 0;
    }
  }
}

function updateWave() {
  if (!waveActive) return;

  waveRadius += waveGrowth;

  if (waveRadius >= waveMaxRadius) {
    waveActive = false;
  }
}

function startWaveForFrame(frameIndex) {
  waveActive = true;
  waveRadius = 0;

  const duration = STOMP_FRAME_DURATIONS[frameIndex];
  waveGrowth = waveMaxRadius / duration;
}

function drawBlizzardOverlay() {
  let stormLayer = createGraphics(width, height);

  // Full white blizzard layer
  stormLayer.noStroke();
  stormLayer.fill(255, 255, 255, 200); // change opacity back to 253 after debugging
  stormLayer.rect(0, 0, width, height);

  // Convert penguin world → screen
  const px = (player.x - camX) * camZoom * bgScale + holeOffsetX;
  const py = (player.y - camY) * camZoom * bgScale + holeOffsetY;

  // --- 1. KEEP ORIGINAL CIRCLE CUT-OUT ---
  stormLayer.drawingContext.globalCompositeOperation = "destination-out";
  stormLayer.fill(255);
  stormLayer.ellipse(px, py, clearRadius * 2, clearRadius * 2);

  // --- 2. ADD FLASHLIGHT CONE CUT-OUT ON TOP ---
  // Determine angle
  let dir = player.direction;
  let angle = 0;

  if (dir === "right") angle = -HALF_PI;
  if (dir === "up") angle = PI;
  if (dir === "left") angle = HALF_PI;
  if (dir === "down") angle = 2 * PI;

  // Diagonals
  if (dir === "wd") angle = -3 * QUARTER_PI;
  if (dir === "aw") angle = 3 * QUARTER_PI;
  if (dir === "sd") angle = -QUARTER_PI; 
  if (dir === "as") angle = QUARTER_PI;

  // Direction-specific offsets
  let sprite = SPRITES[player.direction];
  let offX = sprite.offsetX * camZoom * bgScale;
  let offY = sprite.offsetY * camZoom * bgScale;

  // Direction-specific flashlight length
  let len = (sprite.flashlightLength ?? flashlight.length) * camZoom * bgScale;

  stormLayer.push();
  stormLayer.translate(px + offX, py + offY);
  stormLayer.rotate(angle);

  stormLayer.beginShape();
  stormLayer.vertex(-flashlight.baseWidth/2, 0);
  stormLayer.vertex(flashlight.baseWidth/2, 0);
  stormLayer.vertex(flashlight.endWidth/2, len);
  stormLayer.vertex(-flashlight.endWidth/2, len);
  stormLayer.endShape(CLOSE);

  stormLayer.pop();

  // Draw final blizzard layer
  image(stormLayer, 0, 0);
}

function mousePressed() {
    // --- TUTORIAL MOUSE INPUT (tutorial_cards.js) ---
    if (handleTutorialMousePressed()) return;

    // --- PLAY BUTTON PRESS (inside info panel) ---
    if (gameState === "level_picker" && activePanelIndex !== -1) {
      if (levelPanels[activePanelIndex].playHover) {
        playBtnPressed[activePanelIndex] = true;
      }
    }

    // --- LEVEL PICKER CLICK ---
    if (gameState === "level_picker") {
        handleLevelPickerClick();
        return;
    }

    /// --- START SCREEN BUTTON PRESS ---
if (gameState === "start") {
  if (mouseX > START_BTN.x && mouseX < START_BTN.x + START_BTN.w &&
      mouseY > START_BTN.y && mouseY < START_BTN.y + START_BTN.h) {
    startBtnPressed = true;
  }
  return;
}

    // --- WIN SCREEN BUTTON ---
    if (gameState === "win") {
        let bx = width/2;
        let by = height * 0.82;
        let bw = 320;
        let bh = 64;

        if (mouseX > bx-bw/2 && mouseX < bx+bw/2 &&
            mouseY > by-bh/2 && mouseY < by+bh/2) {
            winBtnPressed = true;
        }
    }

    // --- LOSS SCREEN BUTTON ---
    if (gameState === "loss") {
        let bx = width/2;
        let by = height * 0.45;
        let bw = 320;
        let bh = 64;

        if (mouseX > bx-bw/2 && mouseX < bx+bw/2 &&
            mouseY > by-bh/2 && mouseY < by+bh/2) {
            lossBtnPressed = true;
        }
    }

    // --- LEVEL PICKER BUTTON (win + loss screens) ---
    if (gameState === "win" || gameState === "loss") {
      let bx = width/2, by = height*0.90, bw = 320, bh = 56;

      if (mouseX > bx-bw/2 && mouseX < bx+bw/2 &&
          mouseY > by-bh/2 && mouseY < by+bh/2) {
        levelPickerBtnPressed = true;
      }
    }
}

function mouseReleased() {
  // --- TUTORIAL MOUSE INPUT (tutorial_cards.js) ---
  if (handleTutorialMouseReleased()) return;

  // --- START SCREEN BUTTON RELEASE ---
  if (gameState === "start") {
  let hover = mouseX > START_BTN.x && mouseX < START_BTN.x + START_BTN.w &&
              mouseY > START_BTN.y && mouseY < START_BTN.y + START_BTN.h;

  if (startBtnPressed && hover) {
    gameState = "level_picker";
  }

  startBtnPressed = false;
  return;
}

  // --- LEVEL PICKER PLAY BUTTON RELEASE ---
  if (gameState === "level_picker" && activePanelIndex !== -1) {
    let i = activePanelIndex;

    if (playBtnPressed[i] && levelPanels[i].playHover) {
      startLevel(i);
    }

    playBtnPressed[i] = false;
    return;
  }

  // --- WIN / LOSS BUTTON RELEASES ---
  if (gameState === "win" || gameState === "loss") {
    // Level Picker button (bottom)
    let lpBx = width/2, lpBy = height*0.90, lpBw = 320, lpBh = 56;
    let lpHover =
      mouseX > lpBx-lpBw/2 && mouseX < lpBx+lpBw/2 &&
      mouseY > lpBy-lpBh/2 && mouseY < lpBy+lpBh/2;

if (levelPickerBtnPressed && lpHover) {
  // Show loading transition after winning Level 1
  // or when leaving the Lost screen
  if (
    (gameState === "win" && currentLevel === 1) ||
    gameState === "loss"
  ) {
    startLevelPickerTransition();
  } else {
    gameState = "level_picker";
  }
}

    let lossBx = width/2, lossBy = height*0.45, lossBw = 320, lossBh = 64;
    let lossHover =
      mouseX > lossBx-lossBw/2 && mouseX < lossBx+lossBw/2 &&
      mouseY > lossBy-lossBh/2 && mouseY < lossBy+lossBh/2;

    if (lossBtnPressed && lossHover && gameState === "loss") {
      resetGame();

      startTime = millis();     // new starting point
      timerStarted = true;      // force timer to run
      gameEnded = false;        // prevent auto-loss
      finalTime = null;         // clear old result

      tutorialActive = false;
      postTutorialTimerActive = false;
      tutorialIndex = 999;      // mark tutorial as finished

      gameState = "playing";
      cursor(ARROW);
    }

    levelPickerBtnPressed = false;
    lossBtnPressed = false;
    winBtnPressed = false;
    return;
  }
}

// ------------------------------------------------------------
// GOAT FUNCTIONS
// ------------------------------------------------------------
// ------------------------------------------------------------
// GOAT SYSTEM — CLEAN FINAL VERSION
// ------------------------------------------------------------

// Get a goat frame from the correct row (0 = left, 1 = right)
function getGoatFrame(index, row) {
    const cfg = SPRITES.goat;

    const fw = cfg.frameWidth;
    const fh = cfg.frameHeight;

    // ⭐ Correct column for 5-wide sheet
    const col = index % cfg.numFrames;   // numFrames = 5

    return cfg.img.get(
        col * fw + cfg.cropLeft[index],
        row * fh + cfg.cropTop[index],
        fw - cfg.cropLeft[index] - cfg.cropRight[index],
        fh - cfg.cropTop[index] - cfg.cropBottom[index]
    );
}

// Goat movement + animation
function updateGoat() {
    // Use correct frame count (4 frames per row)
    let cfg = (goatDirection === "left") ? SPRITES.goat_left : SPRITES.goat_right;
    if (frameCount % SPRITES.goat.animSpeed === 0) {
    goatFrameIndex = (goatFrameIndex + 1) % SPRITES.goat.numFrames;
}

    // Move goat
  const goatSpeed = 0.8;   // slow enough to see each frame clearly

if (goatDirection === "right") {
    goatX += goatSpeed;
} else {
    goatX -= goatSpeed;
}

}

// Draw goat inside world transform (fixes jitter)
function drawGoat() {
    const cfg = SPRITES.goat;

    // Row 0 = RIGHT, Row 1 = LEFT
    let row = (goatDirection === "right") ? 0 : 1;

    const frame = getGoatFrame(goatFrameIndex, row);

    push();
    scale(camZoom * bgScale);
    translate(-camX, -camY);

    image(
        frame,
        goatX,
        goatY,
        frame.width * cfg.scale,
        frame.height * cfg.scale
    );

    pop();
}



// Collision with penguin → loss screen
function checkGoatCollision() {
    const penguinHitbox = {
        x: player.x + PENGUIN_HITBOX.offsetX,
        y: player.y + PENGUIN_HITBOX.offsetY,
        w: PENGUIN_HITBOX.w,
        h: PENGUIN_HITBOX.h
    };

    const goatHitbox = {
        x: goatX,
        y: goatY,
        w: 120,   // adjust if needed
        h: 120
    };

    if (rectOverlap(penguinHitbox, goatHitbox)) {
        gameState = "loss";
    }
}

// Rectangle overlap helper
function rectOverlap(a, b) {
    return !(
        a.x + a.w < b.x ||
        a.x > b.x + b.w ||
        a.y + a.h < b.y ||
        a.y > b.y + b.h
    );
}

// Main Level 3 goat logic
function updateLevel3Goat() {
  if (!WORLD_W_SCALED || !WORLD_H_SCALED) return;

  // -------------------------
  // 1) SPAWN LOGIC
  // -------------------------

  // FIRST RUN: 1s after W press, always from right → left
  if (!goatHasKilledOnce && goatTriggered && !goatActive) {
    if (millis() - goatTriggerTime >= 500) {
      goatActive = true;
      goatDirection = "left";
      goatX = WORLD_W_SCALED + 200;
      goatY = player.y;

      // prevent repeat
      goatTriggered = false;
    }
  }

  // RETRY RUNS: goats spawn repeatedly every few seconds
  if (goatHasKilledOnce) {
    // If no goat active, spawn a new one after a random delay
    if (!goatActive && millis() - goatTriggerTime >= goatNextSpawnDelay) {

      goatActive = true;

      // Random side
      if (random() < 0.5) {
        goatDirection = "right";      // run right
        goatX = -200;                 // left side
      } else {
        goatDirection = "left";       // run left
        goatX = WORLD_W_SCALED + 200; // right side
      }

      // Random Y anywhere on mountain
      goatY = random(200, WORLD_H_SCALED - 200);

      // Set next spawn delay (2–5 seconds)
      goatNextSpawnDelay = random(800, 1800);
      goatTriggerTime = millis();
    }
  }

  if (!goatActive) return;

  // -------------------------
  // 2) MOVE GOAT
  // -------------------------
  if (goatDirection === "left") {
    goatX -= goatSpeed;
  } else {
    goatX += goatSpeed;
  }

  // -------------------------
  // 3) ANIMATE GOAT
  // -------------------------
  goatFrameIndex = (goatFrameIndex + 1) % SPRITES.goat.numFrames;

  // -------------------------
  // 4) DRAW GOAT (with flip)
  // -------------------------
  push();
  scale(camZoom * bgScale);
  translate(-camX, -camY);

  let cfg = SPRITES.goat;
  let frameW = cfg.frameWidth;
  let frameH = cfg.frameHeight;
  let sx = goatFrameIndex * frameW;

  if (goatDirection === "left") {
    push();
    translate(goatX + frameW * cfg.scale, goatY - frameH * cfg.scale);
    scale(-1, 1);
    image(cfg.img, 0, 0, frameW * cfg.scale, frameH * cfg.scale, sx, 0, frameW, frameH);
    pop();
  } else {
    image(cfg.img, goatX, goatY - frameH * cfg.scale,
          frameW * cfg.scale, frameH * cfg.scale,
          sx, 0, frameW, frameH);
  }

  pop();

  // -------------------------
  // 5) COLLISION WITH PENGUIN
  // -------------------------
  let goatHitX = goatX;
  let goatHitY = goatY - (frameH * cfg.scale);
  let goatHitW = frameW * cfg.scale;
  let goatHitH = frameH * cfg.scale;

  let penguinHitX = player.x + PENGUIN_HITBOX.offsetX;
  let penguinHitY = player.y + PENGUIN_HITBOX.offsetY;
  let penguinHitW = PENGUIN_HITBOX.w;
  let penguinHitH = PENGUIN_HITBOX.h;

  if (
    goatHitX < penguinHitX + penguinHitW &&
    goatHitX + goatHitW > penguinHitX &&
    goatHitY < penguinHitY + penguinHitH &&
    goatHitY + goatHitH > penguinHitY
  ) {
    gameEnded = true;
    gameState = "loss";

    goatHasKilledOnce = true;
    goatActive = false;
  }

  // -------------------------
  // 6) DESPAWN WHEN OFF-SCREEN
  // -------------------------
  if (goatDirection === "left" && goatX < -400) goatActive = false;
  if (goatDirection === "right" && goatX > WORLD_W_SCALED + 400) goatActive = false;
}
