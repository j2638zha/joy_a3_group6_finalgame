//sketch.js file
// Screen manager
let gameState = "start";
// DEBUG PANEL
let debugMode = false;
let startBg;
let winBg;
let lossBg;
let bgImg;
let level1Bg;
let level2Bg;
let level3Bg;
let transitionPage;
let levelPickerBg;

// AUDIO
let introMusic;
let gameMusic;
let levelPickerMusic;
let fishCollect;
let goatSound;
let timerSound;
let buttonClickSound;
let button1Sound;     // Used by level circles and How to Play X button
let button2Sound;     // Used by How to Play, Try Again, and loss Level Picker
let lockButtonSound;
let fishCallFar = []; // "searching" clips — [0] = "come find me", [1] = "I'm here"
let fishCallNear; // plays when penguin is close
let winSound;
let loseSound;
let walkSound;
let stompSound;
let stompAura;
let audioUnlocked = false;
let musicGateOpen = false; // false = "click anywhere to begin" w is showing
let lastScreenSound = ""; // which of win/loss we've already played the sound for

let transitionStartTime = 0;
const TRANSITION_DURATION = 3000;

// Buttons states:
let startBtnPressed = false;
let winBtnPressed = false;
let lossBtnPressed = false;
let levelPickerBtnPressed = false;
let howToPlayButtonImg;

// Pause/settings menu
let settingsButtonImg;
let isGamePaused = false;
let pauseStartedAt = 0;
let resumeBtnPressed = false;
let restartBtnPressed = false;
let homeBtnPressed = false;

// Background stuff
const VIEW_W = 1200;
const VIEW_H = 780;

// Settings button position and size
const SETTINGS_BTN = {
  x: VIEW_W - 130,
  y: 20,
  w: 130,
  h: 90,
};

// Pause menu buttons
const PAUSE_RESUME_BTN = {
  x: VIEW_W / 2,
  y: 360,
  w: 340,
  h: 70,
};

const PAUSE_RESTART_BTN = {
  x: VIEW_W / 2,
  y: 455,
  w: 340,
  h: 70,
};

const PAUSE_HOME_BTN = {
  x: VIEW_W / 2,
  y: 550,
  w: 340,
  h: 70,
};

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
let holes = [];

// ---------------- GOAT SYSTEM ----------------
// Goat state variables and ALL goat functions now live in level_3.js,
// since the goat only ever appears in Level 3. This file still touches
// a few of those globals (goatX/goatY in loadLevel(), goatInitialized/
// goatDirection/goatTriggered/etc in draw()/handleInput()/resetGame()),
// which is fine since they're plain globals — just know their
// declarations and the goat rendering/update logic live over there now.

// ---------------- HOLE FALL / CLIMB SYSTEM ----------------
// States: "none" (normal play) -> "falling" -> "shaking" -> "climbing" -> "none"
let holeState = "none";
let activeHole = null; // the hole object the player is currently inside

let holeFallFrame = 0;
let holeFallFrameTimer = 0;

let holeClimbFrame = 0;
let holeEnterFrame = 0;

let holeShakeStartTime = 0;
const HOLE_SHAKE_DURATION = 1500; // 3 seconds of screen shake
let holeShakeOffsetX = 0;
let holeShakeOffsetY = 0;
const HOLE_SHAKE_MAGNITUDE = 8; // pixels of shake, tweak for intensity

const HOLE_IMMUNITY_MS = 5000; // can't fall into the same hole again for 5s after climbing out
const HOLE_TIME_PENALTY = 20; // seconds docked from the timer on falling in
const HOLE_TIMER_FLASH_FRAMES = 240; // 4 seconds @ 60fps red/white flash on the timer

// ---- SIZE TUNING ----
// Hole VISUAL size is controlled by the scale passed into drawHoles() below
// (currently 0.85, see draw()). Hole COLLISION (fall-in) size is controlled
// separately here as a fraction of that visual size, so you can make the
// hole look one size but have a tighter/looser trigger radius.
const HOLE_VISUAL_SCALE = 0.5;
const HOLE_HITBOX_SCALE = 0.47;

// Fall/climb penguin animation size is controlled INDEPENDENTLY of the hole,
// via SPRITES.fall.scale and SPRITES.climb.scale below. If the falling/
// climbing penguin looks too big or small next to the hole, adjust those
// two `scale` values — don't touch the HOLE_* constants above for that.

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

    cropLeft: [65, 25, 0, 0, 0, 0],
    cropRight: [0, 0, 20, 60, 90, 120],
    cropTop: [0, 0, 0, 0, 0, 60],
    cropBottom: [180, 180, 180, 180, 180, 180],
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

    cropLeft: [25, 35, 45, 55, 65, 75],
    cropRight: [0, 0, 0, 0, 0, 0],
    cropTop: [0, 0, 0, 0, 0, 0],
    cropBottom: [0, 0, 0, 0, 0, 0],
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

    cropLeft: [0, 8, 8, 8, 30, 30],
    cropRight: [0, 0, 0, 0, 0, 0],
    cropTop: [0, 0, 0, 0, 0, 0],
    cropBottom: [0, 0, 0, 0, 0, 0],
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
    flashlightLength: 160,

    cropLeft: [130, 85, 25, 0, 0, 0],
    cropRight: [0, 0, 0, 25, 65, 85],
    cropTop: [0, 0, 0, 0, 0, 0],
    cropBottom: [0, 0, 0, 0, 0, 0],
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

    cropLeft: [0, 0, 20, 30],
    cropRight: [0, 0, 0, 0],
    cropTop: [0, 0, 0, 0],
    cropBottom: [0, 0, 0, 0],
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

    cropLeft: [0, 0, 20, 50],
    cropRight: [0, 0, 0, 0],
    cropTop: [0, 0, 0, 0],
    cropBottom: [0, 0, 0, 0],
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

    cropLeft: [0, 0, 40, 90],
    cropRight: [0, 0, 0, 0],
    cropTop: [0, 0, 0, 0],
    cropBottom: [0, 0, 0, 0],
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

    cropLeft: [0, 0, 40, 90],
    cropRight: [0, 0, 0, 0],
    cropTop: [0, 0, 0, 0],
    cropBottom: [0, 0, 0, 0],
  },

  stomp: {
    img: null,
    frameWidth: 140,
    frameHeight: 210,
    numFrames: 6,
    animSpeed: 10,
    scale: 1,

    cropLeft: [0, 0, 0, 0, 0, 0],
    cropRight: [0, 0, 0, 0, 0, 0],
    cropTop: [0, 0, 0, 0, 0, 0],
    cropBottom: [0, 0, 0, 0, 0, 0],
  },

  goat: {
    img: null,
    frameWidth: 248, // 247–248 is correct
    frameHeight: 248, // 247–248 is correct
    numFrames: 5, // 5 columns
    animSpeed: 8,
    scale: 0.4,

    cropLeft: [10, 15, 20, 15, 10],
    cropRight: [10, 15, 20, 15, 10],
    cropTop: [0, 0, 0, 0, 0],
    cropBottom: [0, 0, 0, 0, 0],
  },

  // ---- HOLE FALL / CLIMB ANIMATIONS (from the standalone climb/fall file) ----
  climb: {
    img: null,
    frameWidth: 679,
    frameHeight: 468,
    numFrames: 6,
    animSpeed: 12,
    scale: 0.4,
    offsetX: 4.8,
    offsetY: -42,
    cropLeft: [0, 9, 20, 30, 40, 50],
    cropRight: [0, 0, 0, 0, 0, 0],
    cropTop: [0, 0, 0, 32, 0, 0],
    cropBottom: [0, 0, 0, 0, 0, 0],
  },

  fall: {
    img: null,
    frameWidth: 679,
    frameHeight: 419,
    numFrames: 6,
    animSpeed: 3,
    scale: 0.4,
    offsetX: 4.8,
    offsetY: -33,
    cropLeft: [0, 10, 20, 30, 40, 50],
    cropRight: [0, 0, 0, 0, 0, 0],
    cropTop: [0, 0, 0, 32, 0, 0],
    cropBottom: [0, 0, 0, 0, 0, 0],
  },

  enterButton: {
    img: null,
    frameWidth: 361,
    frameHeight: 188,
    numFrames: 6,
    animSpeed: 4,
    scale: 0.4,
    offsetX: 4,
    offsetY: -150,

    cropLeft: [0, 8, 13, 23, 26, 32],
    cropRight: [0, 0, 0, 0, 0, 0],
    cropTop: [0, 0, 0, 0, 0, 0],
    cropBottom: [0, 0, 0, 0, 0, 0],
  },

  lockBreak: {
    img: null,
    frameWidth: 372,
    frameHeight: 600,
    numFrames: 6,
    scale: 0.6,
    currentFrame: 0,

    cropLeft: [20, 0, 0, 0, 0, 0],
    cropRight: [0, 0, 20, 40, 40, 60],
    cropTop: [0, 0, 15, 0, 0, 0],
    cropBottom: [0, 0, 0, 0, 0, 0],
  },
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

// TIMER
let totalTime = 10;
const LEVEL_TIMES = {
  1: 209,
  2: 180,
  3: 150,
};
let startTime;
let timerStarted = false;
let gameEnded = false;
let finalTime = null;
let flashTimer = 0;
let fastestTimes = {
  level1: null,
  level2: null,
  level3: null,
};
let fastestTimesIsNew = {
  level1: false,
  level2: false,
  level3: false,
};

let deathCause = "time"; // "goat" | "hole" | "time"
let goatDeathVideo, creviceDeathVideo, timeDeathVideo;
let lossVideoStarted = false;
let lossVideoFinished = false;

// Central place to trigger a loss with a cause attached
function triggerLoss(cause) {
  if (gameEnded) return;

  deathCause = cause;
  gameEnded = true;

  // Stop every part of the stomp immediately before the loss video.
  cancelStompAudio();

  player.isMoving = false;

  if (walkSound && walkSound.isPlaying()) {
    walkSound.stop();
  }
}

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

// Plays the shared button-click sound. Called from any button/key press
// across the game (level picker, win/loss screens, restart, etc.).
function playButtonClickSound() {
  if (buttonClickSound && buttonClickSound.isLoaded()) {
    buttonClickSound.setVolume(0.5);
    buttonClickSound.play();
  }
}

function playButton1Sound() {
  if (button1Sound && button1Sound.isLoaded()) {
    if (button1Sound.isPlaying()) {
      button1Sound.stop();
    }

    button1Sound.setVolume(0.5);
    button1Sound.play();
  }
}

function playButton2Sound() {
  if (button2Sound && button2Sound.isLoaded()) {
    if (button2Sound.isPlaying()) {
      button2Sound.stop();
    }

    button2Sound.setVolume(0.5);
    button2Sound.play();
  }
}

function playLockButtonSound() {
  if (lockButtonSound && lockButtonSound.isLoaded()) {
    if (lockButtonSound.isPlaying()) {
      lockButtonSound.stop();
    }

    lockButtonSound.setVolume(0.5);
    lockButtonSound.play();
  }
}

// Builds the world (background, walls, spikes, fish) for whichever
// level number is passed in. Call this before resetGame() whenever
// the player enters a level.
function loadLevel(levelNum) {
  let img, topOffset;
  if (levelNum === 1) {
    img = level1Bg;
    topOffset = LEVEL1_TOP_OFFSET;
  } else if (levelNum === 2) {
    img = level2Bg;
    topOffset = LEVEL2_TOP_OFFSET;
  } else if (levelNum === 3) {
    img = level3Bg;
    topOffset = LEVEL3_TOP_OFFSET;
  }
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

  // Timer
  totalTime = LEVEL_TIMES[levelNum];

  // Fish
  let fishStart;
  if (levelNum === 1) {
    fishStart = getLevel1FishStart(WORLD_W_SCALED, WORLD_H_SCALED);
    fishSpawns = LEVEL1_FISH_SPAWNS;
  } else if (levelNum === 2) {
    fishStart = getLevel2FishStart(WORLD_W_SCALED, WORLD_H_SCALED);
    fishSpawns = LEVEL2_FISH_SPAWNS;
  } else if (levelNum === 3) {
    fishStart = getLevel3FishStart(WORLD_W_SCALED, WORLD_H_SCALED);
    fishSpawns = LEVEL3_FISH_SPAWNS;
  }
  fish.x = fishStart.x;
  fish.y = fishStart.y;
  fish.collected = false;

  // Walls (clear old level's walls first, then rebuild)
  walls.length = 0;
  if (levelNum === 1)
    walls.push(...buildLevel1Walls(WORLD_W_SCALED, WORLD_H_SCALED));
  else if (levelNum === 2)
    walls.push(...buildLevel2Walls(WORLD_W_SCALED, WORLD_H_SCALED));
  else if (levelNum === 3)
    walls.push(...buildLevel3Walls(WORLD_W_SCALED, WORLD_H_SCALED));

  // Spikes
  if (levelNum === 1) spikes = LEVEL1_SPIKES.map((s) => ({ ...s }));
  else if (levelNum === 2) spikes = LEVEL2_SPIKES.map((s) => ({ ...s }));
  else if (levelNum === 3) spikes = LEVEL3_SPIKES.map((s) => ({ ...s }));

  // Crevices
  if (levelNum === 1) holes = [];
  else if (levelNum === 2) holes = LEVEL2_HOLES.map((h) => ({ ...h }));
  else if (levelNum === 3) holes = LEVEL3_HOLES.map((h) => ({ ...h }));

  // Reset the hole sequence whenever a level (re)loads
  holeState = "none";
  activeHole = null;

  // Spawn player, then figure out which side of each wall is "legal"
  player.x = WORLD_W_SCALED / 2;
  player.y = playerSpawnY();

  for (let w of walls) {
    w.side = Math.sign(pointSide(player.x, player.y, w.x1, w.y1, w.x2, w.y2));
  }
}

// ============================================================
// DEBUG: STOP SOUNDS BEFORE CHANGING SCREENS
// ============================================================
function stopDebugSounds() {
  if (walkSound && walkSound.isPlaying()) {
    walkSound.stop();
  }

  if (stompSound && stompSound.isPlaying()) {
    stompSound.stop();
  }

  if (stompAura && stompAura.isPlaying()) {
    stompAura.stop();
  }

  if (timerSound && timerSound.isPlaying()) {
    timerSound.stop();
  }

  if (fishCallNear && fishCallNear.isPlaying()) {
    fishCallNear.stop();
  }

  for (let clip of fishCallFar) {
    if (clip && clip.isPlaying()) {
      clip.stop();
    }
  }

  if (gameMusic && gameMusic.isPlaying()) {
    gameMusic.stop();
  }

  if (goatSound && goatSound.isPlaying()) {
    goatSound.stop();
  }
}

function stopLossVideos() {
  for (const v of [goatDeathVideo, creviceDeathVideo, timeDeathVideo]) {
    if (v && !v.elt.paused) v.stop();
  }
  lossVideoStarted = false;
  lossVideoFinished = false;
}

// ============================================================
// DEBUG: JUMP DIRECTLY TO A LEVEL
// ============================================================
function debugGoToLevel(levelNum) {
  stopDebugSounds();
  stopLossVideos();

  // Close the pause menu.
  isGamePaused = false;
  pauseStartedAt = 0;

  // This must happen before loadLevel() and resetGame().
  currentLevel = levelNum;

  // Load all level-specific content.
  loadLevel(currentLevel);

  // Reset the player, timer, fish, holes, tutorials and goat state.
  resetGame();

  // Clear tutorial-card states from the other levels.
  level2CardActive = false;
  level2CardStep = 0;

  level3CardActive = false;
  level3CardStep = 0;
  stopSignTimer = 0;

  // Reset the Level 3 goat completely.
  goatActive = false;
  goatInitialized = false;
  goatTriggered = false;
  goatTriggerTime = 0;
  goatFrameIndex = 0;
  goatFrameTimer = 0;
  goatX = 0;
  goatY = 0;

  gameEnded = false;
  finalTime = null;
  player.isMoving = false;

  // Start the correct tutorial sequence.
  if (currentLevel === 1) {
    resetTutorial();

    tutorialActive = true;
    enterInstructionActive = true;
    tutorialIndex = 0;
    tutorialDelay = 0;

    // Level 1 timer begins after the direction card is dismissed.
    timerStarted = false;
    startTime = 0;

    gameState = "tutorial";
  } else if (currentLevel === 2) {
    timerStarted = false;
    startTime = 0;

    startLevel2Intro();
  } else if (currentLevel === 3) {
    timerStarted = false;
    startTime = 0;

    startLevel3Intro();
  }

  cursor(ARROW);
}

const PENGUIN_HITBOX = {
  w: 30,
  h: 40,
  offsetX: -15,
  offsetY: -35, // because the sprite is now anchored at the feet
};

let DEBUG_PENGUIN_HITBOX = false;
let DEBUG_SHOW_COORDS = false;
let DEBUG_HOLE_HITBOXES = false;
let DEBUG_GOAT_HITBOX = false;

let clearRadius = 100; // circle width
let holeOffsetX = -3;
let holeOffsetY = -50;
let flashlight = {
  baseWidth: 200, // width of flashlight near penguin
  endWidth: 330, // max width
  length: 190,
  opacity: 180, // white glow strength
  glowOpacity: 255, // outer white ring
};

//STOMPING ANIMATION
let stompAnimating = false;
let stompFrame = 0;
let stompFrameTimer = 0;
const STOMP_FRAME_DURATIONS = [10, 10, 10, 10, 70, 10];
const STOMP_NUM_FRAMES = 6;
let waveActive = false;
let waveRadius = 200;
let waveMaxRadius = 630;
let waveGrowth = 25;
let waveDelay = 0;
let waveDelayActive = false;
let blueBuffer;
let ringMaskBuffer;
let blizzardBuffer; // reused every frame in drawBlizzardOverlay() — see setup()
let ringOffsetX = 0;
let ringOffsetY = -50;
let stompOffsetX = -5;
let stompOffsetY = 0;
let blockFishSounds = false;
let allowStompEndCallback = false;

function cancelStompAudio() {
  // Disable the callback BEFORE stopping stompSound.
  // This prevents stompSound.stop() from triggering the fish response.
  allowStompEndCallback = false;
  blockFishSounds = false;

  // Cancel the stomp animation.
  stompAnimating = false;
  stompFrame = 0;
  stompFrameTimer = 0;

  // Cancel any pending or active shockwave.
  waveActive = false;
  waveRadius = 0;
  waveDelay = 0;
  waveDelayActive = false;

  // Stop the main stomping sound.
  if (stompSound && stompSound.isPlaying()) {
    stompSound.stop();
  }

  // Stop the shockwave/aura sound.
  if (stompAura && stompAura.isPlaying()) {
    stompAura.stop();
  }

  // Stop the fish response that normally plays after stomping.
  const stompFishCall = fishCallFar[1];

  if (stompFishCall && stompFishCall.isPlaying()) {
    stompFishCall.stop();
  }
}

// ROCKY SPIKES — generic hitbox/image config. Per-level spike
// PLACEMENT (the x/y/variant list) lives in level_1.js etc, and
// gets loaded into `spikes` when that level starts.
const SPIKE_DRAW_W = 60;
const SPIKE_DRAW_H = 60;
const SPIKE_HITBOXES = [
  { w: 30, h: 40, offsetX: 14, offsetY: 15 }, // small spike
  { w: 45, h: 40, offsetX: 8, offsetY: 15 }, // mid spike
  { w: 48, h: 40, offsetX: 7, offsetY: 17 }, // tall spike
  { w: 45, h: 40, offsetX: 5, offsetY: 15 }, // double spike
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
  collected: false,
};
let fishIconOutline; // when NOT collected
let fishIconFilled; // when collected
let needFishMessageActive = false;
let needFishMessageTimer = 0;
let needFishMessageDuration = 180; // 3 seconds at 60fps
let foundFishMessageActive = false;
let foundFishMessageTimer = 0;
let foundFishMessageDuration = 240;

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
let bestStars = {
  //highest score tracker
  level1: 0,
  level2: 0,
  level3: 0,
};

function preload() {
  gameFont = loadFont("assets/fonts/jersey10.ttf");
  SPRITES.up.img = loadImage("assets/images/w_key_penguin.png");
  SPRITES.left.img = loadImage("assets/images/a_key_penguin.png");
  SPRITES.right.img = loadImage("assets/images/d_key_penguin.png");
  SPRITES.down.img = loadImage("assets/images/s_key_penguin.png");
  SPRITES.stomp.img = loadImage("assets/images/penguin_stomp.png");
  SPRITES.wd.img = loadImage("assets/images/wd_key_penguin.png");
  SPRITES.aw.img = loadImage("assets/images/aw_key_penguin.png");
  SPRITES.sd.img = loadImage("assets/images/sd_key_penguin.png");
  SPRITES.as.img = loadImage("assets/images/as_key_penguin.png");
  SPRITES.lockBreak.img = loadImage("assets/images/lock_break.png");
  preloadStoryAssets();
  preloadWinStoryAssets();
  startBg = loadImage("assets/images/title_screen.png");
  winBg = loadImage("assets/images/win_screen.png");
  lossBg = loadImage("assets/images/loss_screen.png");
  transitionPage = loadImage("assets/images/transition_page.png");
  howToPlayButtonImg = loadImage("assets/images/how_to_play_button.png");
  settingsButtonImg = loadImage("assets/images/settings_button.png");
  // SOUNDS
  introMusic = loadSound("assets/sounds/introscreen.mp3");
  levelPickerMusic = loadSound("assets/sounds/levelpicker_background.mp3");
  gameMusic = loadSound("assets/sounds/game_background_music.mp3");
  fishCollect = loadSound("assets/sounds/fish_collect_sound.mp3");
  goatSound = loadSound("assets/sounds/goat_sound.mp3");
  timerSound = loadSound("assets/sounds/timer_sound.mp3");
  buttonClickSound = loadSound("assets/sounds/button_click_sound.mp3");
  button1Sound = loadSound("assets/sounds/button_1.mp3");
  button2Sound = loadSound("assets/sounds/button_2.mp3");
  lockButtonSound = loadSound("assets/sounds/lock_button.mp3");
  fishCallFar[0] = loadSound("assets/sounds/shelby_comefindme.mp3");
  fishCallFar[1] = loadSound("assets/sounds/shelby_imhere.mp3");
  fishCallNear = loadSound("assets/sounds/shelby_imnearyou.mp3");
  winSound = loadSound("assets/sounds/win_screen_sound.mp3");
  loseSound = loadSound("assets/sounds/lose_screen_sound.mp3");
  walkSound = loadSound("assets/sounds/penguin_walking_sound.mp3");
  stompSound = loadSound("assets/sounds/penguin_stomping_sound.mp3");
  stompAura = loadSound("assets/sounds/stomping_aura.mp3");

  // Tutorial card assets (tutorial_cards.js)
  preloadTutorialAssets();
  preloadLevelPickerAssets();
  preloadLevel2Assets();
  preloadLevel3Assets();

  // Fishy stuff
  fishImg = loadImage("assets/images/test_fish.png");
  fishSheet = loadImage("assets/images/fish.png");
  fishIconOutline = loadImage("assets/images/fish_outline.png");
  fishIconFilled = loadImage("assets/images/fish_item.png");

  // Star score
  starOutlineImg = loadImage("assets/images/star_outline.png");
  starFilledImg = loadImage("assets/images/golden_star.png");

  spikeImages[0] = loadImage("assets/images/spike_small.png");
  spikeImages[1] = loadImage("assets/images/spike_mid.png");
  spikeImages[2] = loadImage("assets/images/spike_tall.png");
  spikeImages[3] = loadImage("assets/images/spike_double.png");

  level1Bg = loadImage("assets/images/tutorial_background.png");
  level2Bg = loadImage("assets/images/level2_background.png");
  level3Bg = loadImage("assets/images/level3_background.png");

  SPRITES.goat.img = loadImage("assets/images/goat_spritesheet.png");

  // Hole fall/climb animation sheets + enter button (from the standalone file)
  SPRITES.climb.img = loadImage("assets/images/penguin_climb.png");
  SPRITES.fall.img = loadImage("assets/images/penguin_falling.png");
  SPRITES.enterButton.img = loadImage("assets/images/enter_button_sprite.png");
  // NOTE: `hole` (the crevice image used in drawHoles()) is assumed to
  // already be loaded elsewhere in your project (e.g. preloadLevel2Assets()).
  // Not reloading it here to avoid double-loading it.
}

function setup() {
  createCanvas(VIEW_W, VIEW_H);
  pixelDensity(1);
  imageMode(CORNER);
  startTime = millis();
  blueBuffer = createGraphics(VIEW_W, VIEW_H);
  ringMaskBuffer = createGraphics(VIEW_W, VIEW_H);
  // Created ONCE and reused every frame in drawBlizzardOverlay(). The old
  // code called createGraphics() inside draw() every frame, which allocated
  // a brand-new offscreen canvas 60x/sec and never freed the old ones —
  // that's what was causing the game to slow down more and more the longer
  // you played.
  blizzardBuffer = createGraphics(VIEW_W, VIEW_H);
  loadLevel(1);
  unlockAudio();

  goatDeathVideo = createVideo(["assets/videos/goat_death.mp4"]);
  goatDeathVideo.hide();
  goatDeathVideo.volume(0); // set >0 if you want the clip's own audio
  creviceDeathVideo = createVideo(["assets/videos/crevice_death.mp4"]);
  creviceDeathVideo.hide();
  creviceDeathVideo.volume(0);
  timeDeathVideo = createVideo(["assets/videos/time_death.mp4"]);
  timeDeathVideo.hide();
  timeDeathVideo.volume(0);

  // Catch the very first interaction of any kind, anywhere on the page
  for (const evt of ["pointerdown", "keydown", "touchstart"]) {
    window.addEventListener(evt, unlockAudio, { once: false });
  }
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
    rect(s.x + hb.offsetX, s.y + hb.offsetY, hb.w, hb.h);
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
  rect(screenX, screenY, hw * scale, hh * scale);
  pop();
}

function drawHoleHitboxes() {
  if (!DEBUG_HOLE_HITBOXES) return;
  if (!hole) return;

  const scale = camZoom * bgScale;

  const hw = hole.width * HOLE_VISUAL_SCALE * HOLE_HITBOX_SCALE;
  const hh = hole.height * HOLE_VISUAL_SCALE * HOLE_HITBOX_SCALE;

  push();
  noFill();
  stroke(255, 0, 255); // magenta = collision hitbox
  strokeWeight(3 / scale);

  for (const h of holes) {
    const hx = h.x - hw / 2;
    const hy = h.y - hh / 2;

    const sx = (hx - camX) * scale;
    const sy = (hy - camY) * scale;

    rect(sx, sy, hw * scale, hh * scale);
  }

  pop();
}

function drawGoatHitbox() {
  if (!DEBUG_GOAT_HITBOX) return;

  const cfg = SPRITES.goat;
  const scale = cfg.scale * camZoom * bgScale;

  const w = (cfg.frameWidth - cfg.cropLeft[0] - cfg.cropRight[0]) * scale;
  const h = (cfg.frameHeight - cfg.cropTop[0] - cfg.cropBottom[0]) * scale;

  // Convert world → screen (same as penguin)
  const sx = (goatX - camX) * camZoom * bgScale - w / 2;
  const sy = (goatY - camY) * camZoom * bgScale - h / 2;

  push();
  noFill();
  stroke(255, 0, 255); // magenta
  strokeWeight(3);
  rect(sx, sy, w, h);
  pop();
}

function drawButton(label, x, y, w, h, pressedFlag) {
  let offsetY = pressedFlag ? 4 : 0;
  let hover =
    mouseX > x - w / 2 &&
    mouseX < x + w / 2 &&
    mouseY > y - h / 2 + offsetY &&
    mouseY < y + h / 2 + offsetY;
  let pulse = sin(frameCount * 0.07) * (hover ? 0 : 3);

  // shadow
  noStroke();
  fill(10, 20, 60, 130);
  rect(floor(x - w / 2 + 5), floor(y - h / 2 + 5 + offsetY), w, h, 8);

  // body
  fill(hover ? 60 : 42, hover ? 90 : 68, hover ? 175 : 150, 230);
  stroke(130, 170, 230, 200);
  strokeWeight(3);
  rect(
    floor(x - w / 2 + pulse / 2),
    floor(y - h / 2 + offsetY + pulse / 2),
    w - pulse,
    h - pulse,
    8,
  );
  noStroke();

  // shine
  fill(255, 255, 255, 50);
  rect(
    floor(x - w / 2 + pulse / 2 + 4),
    floor(y - h / 2 + offsetY + pulse / 2 + 4),
    w - pulse - 8,
    10,
    4,
  );

  // label
  textFont(gameFont);
  textSize(48);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);

  for (let [ox, oy] of [
    [-2, -2],
    [2, -2],
    [-2, 2],
    [2, 2],
  ]) {
    fill(10, 20, 70, 200);
    text(label, floor(x + ox), floor(y + offsetY + oy - 5));
  }

  fill(210, 230, 255);
  text(label, floor(x), floor(y + offsetY - 5));
  return hover;
}

// ============================================================
// SETTINGS BUTTON AND PAUSE MENU
// ============================================================

function isSettingsButtonHovered() {
  return (
    mouseX >= SETTINGS_BTN.x &&
    mouseX <= SETTINGS_BTN.x + SETTINGS_BTN.w &&
    mouseY >= SETTINGS_BTN.y &&
    mouseY <= SETTINGS_BTN.y + SETTINGS_BTN.h
  );
}

function drawSettingsButton() {
  if (!settingsButtonImg) return;

  const hovered = isSettingsButtonHovered();

  if (hovered) {
    cursor(HAND);
  }

  push();

  imageMode(CORNER);

  // Slightly enlarge the icon while hovering.
  const hoverScale = hovered ? 1.08 : 1;

  const drawW = SETTINGS_BTN.w * hoverScale;
  const drawH = SETTINGS_BTN.h * hoverScale;

  const drawX = SETTINGS_BTN.x - (drawW - SETTINGS_BTN.w) / 2;

  const drawY = SETTINGS_BTN.y - (drawH - SETTINGS_BTN.h) / 2;

  image(settingsButtonImg, drawX, drawY, drawW, drawH);

  pop();
}

function openPauseMenu() {
  if (isGamePaused) return;

  isGamePaused = true;
  pauseStartedAt = millis();

  player.isMoving = false;

  // Stop movement and action sounds while paused.
  if (walkSound && walkSound.isPlaying()) {
    walkSound.stop();
  }

  if (stompSound && stompSound.isPlaying()) {
    stompSound.stop();
  }

  if (stompAura && stompAura.isPlaying()) {
    stompAura.stop();
  }

  cursor(ARROW);
}

function closePauseMenu() {
  if (!isGamePaused) return;

  // Add the time spent paused to startTime so the timer does not
  // count the paused duration.
  if (timerStarted) {
    const pausedDuration = millis() - pauseStartedAt;
    startTime += pausedDuration;
  }

  isGamePaused = false;
  pauseStartedAt = 0;

  resumeBtnPressed = false;
  restartBtnPressed = false;
  homeBtnPressed = false;

  cursor(ARROW);
}

function pointInsidePauseButton(button) {
  return (
    mouseX >= button.x - button.w / 2 &&
    mouseX <= button.x + button.w / 2 &&
    mouseY >= button.y - button.h / 2 &&
    mouseY <= button.y + button.h / 2
  );
}

function drawPauseMenu() {
  push();

  // Darken the game but keep the level visible underneath.
  noStroke();
  fill(0, 0, 20, 165);
  rect(0, 0, width, height);

  // Optional central pause panel.
  const panelW = 500;
  const panelH = 520;
  const panelX = width / 2 - panelW / 2;
  const panelY = 150;

  fill(15, 30, 80, 235);
  stroke(130, 180, 245);
  strokeWeight(4);
  rect(panelX, panelY, panelW, panelH, 20);

  // Light highlight inside the panel.
  noStroke();
  fill(255, 255, 255, 25);
  rect(panelX + 8, panelY + 8, panelW - 16, 25, 14);

  // PAUSED heading.
  textFont(gameFont);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  textSize(80);

  // Heading shadow.
  fill(5, 15, 55);
  text("PAUSED", width / 2 + 4, 245 + 4);

  // Heading text.
  fill(225, 240, 255);
  text("PAUSED", width / 2, 245);

  // Reuse your existing game buttons.
  const resumeHovered = drawButton(
    "Resume",
    PAUSE_RESUME_BTN.x,
    PAUSE_RESUME_BTN.y,
    PAUSE_RESUME_BTN.w,
    PAUSE_RESUME_BTN.h,
    resumeBtnPressed,
  );

  const restartHovered = drawButton(
    "Restart",
    PAUSE_RESTART_BTN.x,
    PAUSE_RESTART_BTN.y,
    PAUSE_RESTART_BTN.w,
    PAUSE_RESTART_BTN.h,
    restartBtnPressed,
  );

  const homeHovered = drawButton(
    "Level Picker",
    PAUSE_HOME_BTN.x,
    PAUSE_HOME_BTN.y,
    PAUSE_HOME_BTN.w,
    PAUSE_HOME_BTN.h,
    homeBtnPressed,
  );

  if (resumeHovered || restartHovered || homeHovered) {
    cursor(HAND);
  }

  pop();
}

function restartCurrentLevel() {
  // Close the menu without adding the paused duration because the
  // timer is about to restart completely.
  isGamePaused = false;
  pauseStartedAt = 0;
  stopLossVideos();

  resumeBtnPressed = false;
  restartBtnPressed = false;
  homeBtnPressed = false;

  // Rebuild the currently selected level.
  loadLevel(currentLevel);

  // Reset only the current attempt.
  resetGame();

  // Skip the tutorial/introduction cards when restarting from pause.
  tutorialActive = false;
  postTutorialTimerActive = false;
  tutorialIndex = 999;

  level2CardActive = false;
  level3CardActive = false;

  // Begin a fresh timer for this attempt.
  startTime = millis();
  timerStarted = true;
  gameEnded = false;
  finalTime = null;

  gameState = "playing";
  cursor(ARROW);
}

function returnToHomeFromPause() {
  isGamePaused = false;
  pauseStartedAt = 0;

  resumeBtnPressed = false;
  restartBtnPressed = false;
  homeBtnPressed = false;

  player.isMoving = false;

  // Stop temporary gameplay sounds.
  stopDebugSounds();
  stopLossVideos();

  timerStarted = false;
  gameEnded = false;
  finalTime = null;

  tutorialActive = false;
  postTutorialTimerActive = false;
  level2CardActive = false;
  level3CardActive = false;

  // Keep the player's stars, fastest times, and unlocked levels.
  // Do not call resetGame() here.
  gameState = "level_picker";
  musicGateOpen = true;

  cursor(ARROW);
}

function drawFish() {
  if (fish.collected) return;

  // Animate fish
  if (frameCount % fishAnimationSpeed === 0) {
    currentFishFrame = (currentFishFrame + 1) % fishTotalFrames;
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
    fishFrameHeight,
  );
}

function drawFishIconUI() {
  let x = 40; // screen position
  let y = 40;
  let iconW = 80; // width
  let iconH = 50; // height

  const promptText = fish.collected
    ? "Take me to the exit!"
    : "Don't forget me!";

  // --- Measure text so the panel fits it ---
  push();
  textFont(gameFont);
  textStyle(BOLD);
  textSize(28);
  const textW = textWidth(promptText);
  pop();

  // --- Panel dimensions (wraps icon + text) ---
  const panelPadX = 16;
  const panelPadY = 8;
  const iconTextGap = 12;
  const panelX = x - panelPadX;
  const panelY = y - panelPadY;
  const panelW = iconW + iconTextGap + textW + panelPadX * 2;
  const panelH = iconH + panelPadY * 2;

  push();
  rectMode(CORNER);

  // light gray fill
  noStroke();
  fill(230, 230, 235, 235);
  rect(panelX, panelY, panelW, panelH, panelH / 2);

  // dashed border
  noFill();
  stroke(90, 110, 160);
  strokeWeight(2);
  drawingContext.setLineDash([6, 5]);
  rect(panelX, panelY, panelW, panelH, panelH / 2);
  drawingContext.setLineDash([]);
  pop();

  // --- Fish icon ---
  if (fish.collected) {
    image(fishIconFilled, x, y, iconW, iconH);
  } else {
    image(fishIconOutline, x, y, iconW, iconH);
  }

  // --- Reminder text beside the fish icon ---
  push();
  textFont(gameFont);
  textStyle(BOLD);
  textSize(28);
  textAlign(LEFT, CENTER);

  const textX = x + iconW + iconTextGap;
  const textY = y + iconH / 2 - 3;

  fill(50, 90, 200); // blue, matching the reference
  noStroke();
  text(promptText, textX, textY);
  pop();
}

function drawFishCompass() {
  if (fish.collected) return;
  if (!waveActive) return; // only show while the wave/ring is active

  const scale = camZoom * bgScale;

  // --- Ring center (same as the X-ray ring's cx/cy) ---
  const cx = (player.x - camX) * scale + ringOffsetX;
  const cy = (player.y - camY) * scale + ringOffsetY;

  // --- WORLD direction vector toward the fish ---
  const dx = fish.x - player.x;
  const dy = fish.y - player.y;
  const angle = atan2(dy, dx);
  const radius = max(0, waveRadius - 70);

  const iconX = cx + cos(angle) * radius;
  const iconY = cy + sin(angle) * radius;

  let fade = map(waveRadius, waveMaxRadius * 0.7, waveMaxRadius, 255, 0);

  fade = constrain(fade, 0, 255);
  push();
  imageMode(CENTER);
  drawingContext.shadowBlur = 18;
  drawingContext.shadowColor = "rgba(52, 201, 235, 0.8)";
  tint(255, fade);
  image(fishImg, iconX, iconY, 75, 53);
  drawingContext.shadowBlur = 0;
  pop();
}

function randomizeFishPosition() {
  let spot = random(fishSpawns); // p5.js random() picks a random element
  fish.x = spot.x;
  fish.y = spot.y;
}

function drawHoles(scale = 1) {
  const baseW = hole.width;
  const baseH = hole.height;

  const drawW = baseW * scale;
  const drawH = baseH * scale;

  for (const h of holes) {
    image(hole, h.x - drawW / 2, h.y - drawH / 2, drawW, drawH);
  }
}

const START_BTN = { x: 430, y: 675, w: 330, h: 60 };

function drawStartScreen() {
  imageMode(CORNER);
  image(startBg, 0, 0, width, height);

  // --- CLICK-TO-BEGIN GATE ---
  if (!musicGateOpen) {
    push();
    textAlign(LEFT, BOTTOM);
    textSize(15);
    fill(0);
    text("Press Y to open debug panel", 20, height - 18);
    pop();
    push();
    noStroke();
    fill(0, 0, 0, 89); // 35% of 255
    rect(0, 0, width, height);

    // gentle pulse so it reads as interactive
    const pulse = 200 + sin(frameCount * 0.06) * 55;

    textFont(gameFont);
    textAlign(CENTER, CENTER);
    textSize(56);
    textStyle(BOLD);

    fill(10, 20, 70, 200);
    text("click anywhere to begin", width / 2 + 3, height / 2 + 3);

    fill(230, 242, 255, pulse);
    text("click anywhere to begin", width / 2, height / 2);
    pop();

    cursor(HAND);
    return; // skip the Start-button hover entirely
  }

  // --- NORMAL START SCREEN (gate is open) ---
  let hover =
    mouseX > START_BTN.x &&
    mouseX < START_BTN.x + START_BTN.w &&
    mouseY > START_BTN.y &&
    mouseY < START_BTN.y + START_BTN.h;

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
function unlockAudio() {
  if (audioUnlocked) return;
  userStartAudio()
    .then(() => {
      audioUnlocked = true;
    })
    .catch(() => {
      /* no gesture yet — a later event will retry */
    });
}

// ------------------------------------------------------------
// FISH SOUND SYSTEM
// ------------------------------------------------------------
// fishCallFar[0] "come find me"  → played once during the 2nd tutorial card
//                                  (hook still pending — see note below)
// fishCallFar[1] "I'm here"      → played once after the stomp sound ends,
//                                  then fades out (playStompFishCall)
// fishCallNear   "I'm near you"  → loops every 10s while the penguin is
//                                  within FISH_NEAR_DIST of the fish,
//                                  stops the instant the fish is collected
const FISH_CALL_MAX_VOL = 0.95;
const FISH_NEAR_DIST = 250; // within this distance → "I'm near you"
const FISH_NEAR_LOOP_INTERVAL = 10000; // ms between "I'm near you" loops
const STOMP_FISHCALL_FADE_SEC = 1; // how long the post-stomp ping fades out

let lastNearCallTime = 0;
let comeFindMePlayed = false; // guards fishCallFar[0] so it only fires once per attempt

// Plays fishCallFar[0] ("come find me") once, the first time the penguin
// is standing on the 3rd tutorial card (tutorialIndex === 2, 0-indexed).
function updateTutorialComeFindMeSound() {
  if (!audioUnlocked || getAudioContext().state !== "running") return;
  if (!tutorialActive || tutorialIndex !== 1 || comeFindMePlayed) return;

  comeFindMePlayed = true;
  const clip = fishCallFar[0];
  if (clip && clip.isLoaded()) {
    clip.setVolume(FISH_CALL_MAX_VOL);
    clip.play();
  }
}

// Fired once the stomp sound finishes playing (see handleInput()).
function playStompFishCall() {
  // Never play this sound after a loss or after the stomp was cancelled.
  if (
    !allowStompEndCallback ||
    !blockFishSounds ||
    fish.collected ||
    gameEnded ||
    gameState === "loss"
  ) {
    allowStompEndCallback = false;
    return;
  }

  // This callback is only allowed to run once.
  allowStompEndCallback = false;

  const clip = fishCallFar[1];

  if (!clip || !clip.isLoaded()) {
    return;
  }

  clip.setVolume(FISH_CALL_MAX_VOL);
  clip.play();

  const fadeDelayMs = max(0, clip.duration() - STOMP_FISHCALL_FADE_SEC) * 1000;

  setTimeout(() => {
    // Do nothing if the player has lost since this timeout started.
    if (gameEnded || gameState === "loss") {
      if (clip.isPlaying()) {
        clip.stop();
      }

      return;
    }

    if (clip.isPlaying()) {
      clip.setVolume(0, STOMP_FISHCALL_FADE_SEC);
    }
  }, fadeDelayMs);
}

// TODO: hook up fishCallFar[0] ("come find me") to play once during the
// SECOND tutorial card. Not wired up yet — need the exact variable/value
// from tutorial_cards.js that means "card 2 is showing" (e.g. a specific
// tutorialIndex value) so this doesn't reference something undefined.
// Once you share that, the call goes here or in tutorial_cards.js:
//   if (fishCallFar[0] && fishCallFar[0].isLoaded()) fishCallFar[0].play();

// Loops "I'm near you" every FISH_NEAR_LOOP_INTERVAL ms while the penguin
// is within FISH_NEAR_DIST of the fish. Stops automatically once the fish
// is collected (checked here) and also stopped explicitly in
// checkFishCollision() so it can't linger mid-play.
function updateFishCall() {
  if (!audioUnlocked || getAudioContext().state !== "running") return;
  if (fish.collected) return;
  if (blockFishSounds) return; // don't overlap with the stomp's "I'm here" call

  const playing =
    gameState !== "start" &&
    gameState !== "story" &&
    gameState !== "win_story" &&
    gameState !== "win" &&
    gameState !== "loss" &&
    gameState !== "transition" &&
    gameState !== "level_picker";

  if (!playing) return;

  const d = dist(player.x, player.y, fish.x, fish.y);
  if (d >= FISH_NEAR_DIST) return; // only loops while inside the threshold

  if (millis() - lastNearCallTime < FISH_NEAR_LOOP_INTERVAL) return;
  lastNearCallTime = millis();

  if (fishCallNear && fishCallNear.isLoaded()) {
    fishCallNear.setVolume(FISH_CALL_MAX_VOL);
    fishCallNear.play();
  }
}

function updateScreenSounds() {
  if (!audioUnlocked || getAudioContext().state !== "running") return;

  if (gameState === "win" && lastScreenSound !== "win") {
    lastScreenSound = "win";

    cancelStompAudio();

    if (walkSound && walkSound.isPlaying()) {
      walkSound.stop();
    }

    if (goatSound && goatSound.isPlaying()) {
      goatSound.stop();
    }

    if (winSound && winSound.isLoaded()) {
      winSound.play();
    }
  } else if (gameState === "loss" && lastScreenSound !== "loss") {
    lastScreenSound = "loss";

    // Final cleanup when the loss screen begins.
    cancelStompAudio();

    if (walkSound && walkSound.isPlaying()) {
      walkSound.stop();
    }

    if (goatSound && goatSound.isPlaying()) {
      goatSound.stop();
    }

    if (loseSound && loseSound.isLoaded()) {
      loseSound.play();
    }
  } else if (gameState !== "win" && gameState !== "loss") {
    lastScreenSound = "";
  }
}

// ------------------------------------------------------------
// TIMER SOUND
// ------------------------------------------------------------
// Loops exactly while the countdown is actively running, and stops the
// instant it isn't: on win, loss, any menu screen, or while the timer
// itself is paused during the first few tutorial cards (tutorialIndex
// 0-3 — see the pause logic in drawTimer()).
function updateTimerSound() {
  if (isGamePaused) {
    if (timerSound && timerSound.isPlaying()) {
      timerSound.stop();
    }

    return;
  }

  if (!timerSound || !timerSound.isLoaded()) return;
  if (!audioUnlocked || getAudioContext().state !== "running") return;

  const timerPaused =
    (tutorialActive && tutorialIndex < 3) ||
    level2CardActive ||
    level3CardActive;
  const countdownRunning =
    timerStarted &&
    !gameEnded &&
    !timerPaused &&
    gameState !== "start" &&
    gameState !== "story" &&
    gameState !== "win_story" &&
    gameState !== "win" &&
    gameState !== "loss" &&
    gameState !== "transition" &&
    gameState !== "level_picker";

  if (countdownRunning) {
    if (!timerSound.isPlaying()) {
      timerSound.setVolume(0.5);
      timerSound.loop();
    }
  } else if (timerSound.isPlaying()) {
    timerSound.stop();
  }
}

function updateMusic() {
  if (!audioUnlocked) return;
  if (getAudioContext().state !== "running") return;

  const wantIntro = gameState === "start";
  const wantLevelPicker = gameState === "level_picker";
  const wantGame = ![
    "start",
    "story",
    "win_story",
    "win",
    "loss",
    "transition",
    "level_picker",
  ].includes(gameState);

  // --- INTRO TRACK ---
  if (introMusic && introMusic.isLoaded()) {
    if (wantIntro && !introMusic.isPlaying()) {
      introMusic.setVolume(0.5);
      introMusic.loop();
    } else if (!wantIntro && introMusic.isPlaying()) {
      introMusic.stop();
    }
  }

  // --- LEVEL PICKER TRACK ---
  if (levelPickerMusic && levelPickerMusic.isLoaded()) {
    if (wantLevelPicker && !levelPickerMusic.isPlaying()) {
      levelPickerMusic.setVolume(0.35);
      levelPickerMusic.loop();
    } else if (!wantLevelPicker && levelPickerMusic.isPlaying()) {
      levelPickerMusic.stop();
    }
  }

  // --- GAMEPLAY TRACK ---
  if (gameMusic && gameMusic.isLoaded()) {
    if (wantGame && !gameMusic.isPlaying()) {
      gameMusic.setVolume(0.35);
      gameMusic.loop();
    } else if (!wantGame && gameMusic.isPlaying()) {
      gameMusic.stop();
    }
  }
}

function draw() {
  // Update audio systems on every screen.
  updateMusic();
  updateScreenSounds();
  updateFishCall();
  updateTimerSound();

  // STORY SCREEN
  if (gameState === "story") {
    drawStoryScreen();

    if (debugMode) {
      drawDebugPanel();
    }

    return;
  }

  // ENDING STORY SCREEN (after Level 3)
  if (gameState === "win_story") {
    drawWinStoryScreen();

    if (debugMode) {
      drawDebugPanel();
    }

    return;
  }

  // FIRST / TITLE SCREEN
  if (gameState === "start") {
    drawStartScreen();

    if (debugMode) {
      drawDebugPanel();
    }

    return;
  }

  // WIN SCREEN
  if (gameState === "win") {
    drawWinScreen();

    if (debugMode) {
      drawDebugPanel();
    }

    return;
  }

  // LOSE SCREEN
  if (gameState === "loss") {
    drawLossScreen();

    if (debugMode) {
      drawDebugPanel();
    }

    return;
  }

  // TRANSITION SCREEN
  if (gameState === "transition") {
    drawTransitionScreen();

    if (debugMode) {
      drawDebugPanel();
    }

    return;
  }

  // LEVEL PICKER
  if (gameState === "level_picker") {
    drawLevelPickerScreen();

    if (debugMode) {
      drawDebugPanel();
    }

    return;
  }

  // -------------------------
  // GAMEPLAY
  // -------------------------
  if (gameEnded) {
    gameState = "loss";
    drawLossScreen();

    if (debugMode) {
      drawDebugPanel();
    }

    return;
  }

  if (!timerStarted) {
    timerStarted = true;
    startTime = millis();
  }

  // Only update gameplay when the pause menu is closed.
  if (!isGamePaused) {
    handleInput();
    updateWalkSound();
    animateSprite();
    updateCamera();
    updateStompAnimation();
    checkFishCollision();
    checkHoleCollision();
    updateTutorialComeFindMeSound();
  } else {
    player.isMoving = false;
  }

  // ---------------- GOAT INIT (only for Level 3) ----------------
  if (!isGamePaused && currentLevel === 3 && !goatInitialized) {
    goatInitialized = true;
    goatStartTime = millis();
    goatDirection = random(["left", "right"]);
  }

  // While the penguin is falling/shaking/climbing in a hole, skip the
  // top-exit fish gate and the win check — those only apply to normal play.
  if (!isGamePaused && holeState === "none") {
    // --- BLOCK TOP EXIT IF FISH NOT COLLECTED ---
    if (!fish.collected && player.y < finishY) {
      player.y = finishY;
      // trigger popup message
      needFishMessageActive = true;
      needFishMessageTimer = needFishMessageDuration;
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
      queueLockBreak(currentLevel);
      gameState = "win";
      return;
    }
  }

  // WAVE DELAY + WAVE UPDATE
  if (!isGamePaused) {
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
  }

  // DRAW WORLD
  push();
  scale(camZoom * bgScale);
  translate(-camX, -camY);
  if (holeState === "shaking") {
    // shake is expressed in screen pixels — divide by the current zoom/scale
    // so it reads as a consistent shake regardless of camera zoom
    translate(
      holeShakeOffsetX / (camZoom * bgScale),
      holeShakeOffsetY / (camZoom * bgScale),
    );
  }
  drawBackground();
  drawSpikes();
  drawHoles(HOLE_VISUAL_SCALE);
  drawFish();
  drawWalls();

  pop();

  if (currentLevel !== 1) {
    drawHoleHitboxes();
  }

  // ---------------- GOAT UPDATE ----------------
  if (currentLevel === 3) {
    if (!isGamePaused) {
      updateLevel3Goat();
    }

    drawGoatHitbox();
  }

  // ---------------- HOLE FALL / SHAKE / CLIMB SEQUENCE ----------------
  if (holeState === "falling") {
    if (!isGamePaused) {
      updateHoleFall();
    }

    drawHoleFallAnimation();
  } else if (holeState === "shaking") {
    if (!isGamePaused) {
      updateHoleShake();
    }

    // Penguin stays hidden during the shake.
  } else if (holeState === "climbing") {
    drawHoleClimbAnimation();
  } else {
    drawCharacterOnScreen();
    drawPenguinHitbox();
  }

  // Capture world frame for X-ray ring — only needed while the wave/X-ray
  // ring is actually active. get() does a full-canvas pixel readback, so
  // doing it unconditionally every frame (as before) was wasted work the
  // vast majority of the time.
  if (waveActive) {
    baseWorldFrame = get();
  }

  // BLIZZARD OVERLAY
  drawBlizzardOverlay();

  drawSpikeHitboxes();

  if (holeState === "climbing") {
    drawEnterButtonAtHole();
  }

  // X-RAY RING
  if (waveActive) {
    ringMaskBuffer.clear();
    ringMaskBuffer.noStroke();

    const cx = (player.x - camX) * camZoom * bgScale + ringOffsetX;
    const cy = (player.y - camY) * camZoom * bgScale + ringOffsetY;

    const outerRadius = waveRadius;
    const innerRadius = waveRadius - 140;

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

  // Settings button stays fixed to the screen.
  drawSettingsButton();

  // fish compass during stomping
  if (waveActive) {
    drawFishCompass();
  }

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

  if (level2CardActive) {
    drawLevel2CardOverlay();
  }

  if (level3CardActive) {
    drawLevel3CardOverlay();
  }

  // --- NEED FISH POPUP MESSAGE ---
  if (needFishMessageActive) {
    needFishMessageTimer--;
    push();
    imageMode(CENTER);
    const cardW = min(730, width - 160);
    const cardH = cardW * (popUpCard.height / popUpCard.width);
    const cardY = 180; // moves the popup closer to the timer
    image(popUpCard, width / 2, cardY, cardW, cardH);
    pop();
    if (needFishMessageTimer <= 0) {
      needFishMessageActive = false;
    }
  }

  if (foundFishMessageActive) {
    foundFishMessageTimer--;
    push();
    imageMode(CENTER);
    let foundCardBottomY = 180;
    if (
      foundPopupCard &&
      foundPopupCard.width > 0 &&
      foundPopupCard.height > 0
    ) {
      const cardW = min(750, width - 180);
      const cardH = cardW * (foundPopupCard.height / foundPopupCard.width);
      const cardY = 180;
      image(foundPopupCard, width / 2, cardY, cardW, cardH);
      foundCardBottomY = cardY + cardH / 2;
    }
    pop();

    // Clarifies where the "safety zone" actually is, since playtesters
    // couldn't tell after finding the fish. Drawn as text (not baked
    // into the card art) so it doesn't need a redesigned image.
    push();
    textFont(gameFont);
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    textSize(28);
    fill(210, 230, 255);
    stroke(10, 15, 54);
    strokeWeight(5);
    text(
      "Get to the top of the mountain — that's the safety zone!",
      width / 2,
      foundCardBottomY + 14,
    );
    pop();

    if (foundFishMessageTimer <= 0) {
      foundFishMessageActive = false;
    }
  }

  // Draw this LAST so it stays above the gameplay.
  if (debugMode) {
    drawDebugPanel();
  }

  // Draw this after all gameplay so it appears above everything.
  if (isGamePaused) {
    drawPauseMenu();
  }
}

function keyPressed() {
  // ==========================================================
  // DEBUG PANEL AND DEBUG SHORTCUTS
  // ==========================================================

  // D can always open or close the debug panel.
  if (key === "y" || key === "Y") {
    debugMode = !debugMode;
    return;
  }

  // The remaining shortcuts only work while debug mode is open.
  if (debugMode) {
    // S = first/title page
    if (key === "s" || key === "S") {
      stopDebugSounds();

      gameState = "start";
      musicGateOpen = true;
      gameEnded = false;
      cursor(ARROW);
      return;
    }

    // P = level picker
    if (key === "p" || key === "P") {
      stopDebugSounds();

      gameState = "level_picker";
      gameEnded = false;
      timerStarted = false;
      cursor(ARROW);
      return;
    }

    // 1 = Level 1
    if (key === "1") {
      stopDebugSounds();
      debugGoToLevel(1);
      return;
    }

    // 2 = Level 2
    if (key === "2") {
      stopDebugSounds();
      debugGoToLevel(2);
      return;
    }

    // 3 = Level 3
    if (key === "3") {
      stopDebugSounds();
      debugGoToLevel(3);
      return;
    }

    // W = win screen
    if (key === "w" || key === "W") {
      stopDebugSounds();

      gameEnded = false;
      timerStarted = false;
      gameState = "win";
      cursor(ARROW);
      return;
    }

    // L = lose screen
    // L = lose screen (time death)
    if (key === "l" || key === "L") {
      stopDebugSounds();
      stopLossVideos();
      triggerLoss("time");
      timerStarted = false;
      gameState = "loss";
      cursor(ARROW);
      return;
    }
  }

  // ESC opens and closes the pause menu during gameplay.
  if (gameState === "playing" && keyCode === ESCAPE) {
    playButton1Sound();

    if (isGamePaused) {
      closePauseMenu();
    } else {
      openPauseMenu();
    }

    return false;
  }

  // Block all other keyboard gameplay input while paused.
  if (gameState === "playing" && isGamePaused) {
    return false;
  }

  // STORY SCREEN → ENTER → next panel / leave
  if (gameState === "story" && keyCode === ENTER) {
    advanceStory();
    return;
  }

  // ENDING STORY SCREEN → ENTER → next page / leave
  if (gameState === "win_story" && keyCode === ENTER) {
    advanceWinStory();
    return;
  }

  // START SCREEN → ENTER → STORY
  if (gameState === "start" && keyCode === ENTER) {
    beginStory(); // was: gameState = "level_picker";

    return;
  }

  unlockAudio();
  if (gameState === "start" && !musicGateOpen) {
    musicGateOpen = true;
    return;
  }

  // --- HOLE CLIMB INPUT (ENTER-mash to climb out) ---
  if (holeState === "climbing" && keyCode === ENTER) {
    const maxFrame = SPRITES.climb.numFrames - 1;

    if (holeClimbFrame >= maxFrame) {
      // final press — climb complete, pop out of the hole
      exitHole();
      return;
    }

    const canSlip = holeClimbFrame === 1 || holeClimbFrame === 2;
    const setbackChance = 0.3; // tweak as desired

    if (Math.random() < setbackChance && canSlip) {
      // slip backward one frame (penguin + button, same as the original file)
      holeClimbFrame = holeClimbFrame - 1;
      holeEnterFrame = Math.max(0, holeEnterFrame - 1);
    } else {
      holeClimbFrame = holeClimbFrame + 1;
      holeEnterFrame = (holeEnterFrame + 1) % SPRITES.enterButton.numFrames;
    }
    return;
  }

  // START SCREEN → ENTER → LEVEL PICKER
  if (gameState === "start" && keyCode === ENTER) {
    gameState = "level_picker";
    return;
  }

  // TUTORIAL INPUT (tutorial_cards.js)
  if (handleTutorialKeyPressed()) return;

  // LEVEL 2 INTRO CARD INPUT (level_2.js)
  if (handleLevel2CardKeyPressed()) return;

  if (handleLevel3CardKeyPressed()) return;

  // TUTORIAL INPUT (tutorial_cards.js)
  if (handleTutorialKeyPressed()) return;

  // WIN SCREEN → ENTER → ending story (after Level 3) or Level Picker
  if (gameState === "win" && keyCode === ENTER) {
    playButtonClickSound();
    if (currentLevel === 3) {
      beginWinStory();
    } else {
      startLevelPickerTransition(); // was: gameState = "start";
    }
    return;
  }

  // LOSS SCREEN → R → RESTART
  if (gameState === "loss" && lossVideoFinished && key === "r") {
    playButtonClickSound();
    stopLossVideos();
    resetGame();
    gameState = "playing";
    cursor(ARROW);
    return;
  }

  // LOSS SCREEN → ENTER → START
  if (gameState === "loss" && lossVideoFinished && keyCode === ENTER) {
    playButtonClickSound();
    resetGame();
    startTime = millis();
    timerStarted = true;
    gameEnded = false;
    finalTime = null;
    tutorialActive = false;
    postTutorialTimerActive = false;
    tutorialIndex = 999;
    gameState = "playing";
    cursor(ARROW);
    return;
  }
}

function resetGame() {
  gameEnded = false;
  startTime = 0;
  timerStarted = false;
  finalTime = null;
  stopLossVideos();

  totalTime = LEVEL_TIMES[currentLevel]; // reset timer
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
  lastNearCallTime = 0;
  comeFindMePlayed = false;

  needFishMessageActive = false;
  needFishMessageTimer = 0;
  foundFishMessageActive = false;
  foundFishMessageTimer = 0;

  // HOLE SEQUENCE RESET
  holeState = "none";
  activeHole = null;
  holeFallFrame = 0;
  holeFallFrameTimer = 0;
  holeClimbFrame = 0;
  holeEnterFrame = 0;
  for (const h of holes) {
    h.immuneUntil = 0;
  }

  // GOAT RESET LOGIC
  goatActive = false;
  goatInitialized = false;
  goatTriggered = false;
  goatTriggerTime = 0;

  // If they’ve already been killed once by the goat,
  // we arm the “later random border” behaviour for level 3.
  if (currentLevel === 3 && goatHasKilledOnce) {
    goatTriggered = true;
    goatTriggerTime = millis(); // start delay for second run
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
  targetX = constrain(targetX, 0, WORLD_W_SCALED - visibleW - 30);
  targetY = constrain(targetY, WORLD_TOP_LIMIT, WORLD_H_SCALED - visibleH);

  camX = lerp(camX, targetX, CAM_SMOOTHING);
  camY = lerp(camY, targetY, CAM_SMOOTHING);
}

function drawTimer() {
  // Pause the countdown during the first 4 tutorial cards (tutorialIndex
  // 0-3). Shifting startTime forward by the elapsed frame time keeps
  // "elapsed" from advancing while paused, without needing a separate
  // paused-duration accumulator.
  if (
    timerStarted &&
    !isGamePaused &&
    ((tutorialActive && tutorialIndex < 3) ||
      level2CardActive ||
      level3CardActive)
  ) {
    startTime += deltaTime;
  }
  let elapsed = 0;

  if (timerStarted) {
    // While paused, calculate the timer using the exact moment
    // the pause menu was opened.
    const timerNow = isGamePaused ? pauseStartedAt : millis();
    elapsed = floor((timerNow - startTime) / 1000);
  }
  let timeLeft = totalTime - elapsed;
  if (timeLeft <= 0) {
    timeLeft = 0;
    if (!isGamePaused) {
      triggerLoss("time"); // was: gameEnded = true;
    }
  }

  let minutes = floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  let timerText = minutes + ":" + nf(seconds, 2);

  // body
  let w = 200;
  let h = 70;
  let x = VIEW_W / 2;
  let y = 70;

  // body
  fill(42, 68, 150, 230);
  stroke(130, 170, 230, 200);
  strokeWeight(3);
  rect(floor(x - w / 2), floor(y - h / 2), w, h, 8);
  noStroke();

  // shine
  fill(255, 255, 255, 50);
  rect(floor(x - w / 2 + 4), floor(y - h / 2 + 4), w - 8, 10, 4);

  // FLASH LOGIC
  if (flashTimer > 0) {
    if (!isGamePaused) {
      flashTimer--;
    }
    // alternate red/white every 10 frames
    if (floor(flashTimer / 10) % 2 === 0) {
      fill(255, 0, 0); // red
    } else {
      fill(255); // white
    }
  } else {
    // normal timer color
    if (timeLeft <= 10) {
      fill(255, 0, 0);
    } else {
      fill(255); // your normal color
    }
  }

  // label
  textFont(gameFont);
  textSize(72);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text(timerText, width / 2, 60);
}

function updateWalkSound() {
  if (!walkSound || !walkSound.isLoaded()) return;
  if (!audioUnlocked || getAudioContext().state !== "running") return;

  const movementHeld =
    keyIsDown(87) ||
    keyIsDown(65) ||
    keyIsDown(83) ||
    keyIsDown(68) ||
    keyIsDown(UP_ARROW) ||
    keyIsDown(DOWN_ARROW) ||
    keyIsDown(LEFT_ARROW) ||
    keyIsDown(RIGHT_ARROW);

  const onMenu =
    gameState === "start" ||
    gameState === "win" ||
    gameState === "loss" ||
    gameState === "transition" ||
    gameState === "level_picker" ||
    gameState === "story" ||
    gameState === "win_story";

  const walking =
    movementHeld &&
    !onMenu &&
    !stompAnimating &&
    holeState === "none" &&
    !gameEnded; // ← gameEnded guard added

  if (walking) {
    if (!walkSound.isPlaying()) {
      walkSound.setVolume(0.5);
      walkSound.loop();
    }
  } else if (walkSound.isPlaying()) {
    walkSound.stop();
  }
}

function handleInput() {
  // --- STOMP ---
  if (
    keyIsDown(32) &&
    !gameEnded &&
    gameState !== "loss" &&
    !stompAnimating &&
    holeState === "none" &&
    !tutorialActive &&
    !level2CardActive &&
    !level3CardActive
  ) {
    stompAnimating = true;
    stompFrame = 0;
    stompFrameTimer = 0;
    waveDelay = 0;
    waveDelayActive = false;

    totalTime = max(0, totalTime - 45);
    flashTimer = 150;

    // --- STOMP SOUND ---
    blockFishSounds = true;

    // Stop any fish-search audio already playing.
    if (fishCallNear && fishCallNear.isPlaying()) {
      fishCallNear.stop();
    }

    for (const clip of fishCallFar) {
      if (clip && clip.isPlaying()) {
        clip.stop();
      }
    }

    if (stompSound && stompSound.isLoaded()) {
      // Allow the callback only for this specific stomp.
      allowStompEndCallback = true;

      stompSound.onended(() => {
        // Stopping the sound during a loss may still call onended().
        // These checks prevent any post-stomp sound from playing.
        if (!allowStompEndCallback || gameEnded || gameState === "loss") {
          allowStompEndCallback = false;
          return;
        }

        playStompFishCall();
      });

      stompSound.play();
    } else {
      allowStompEndCallback = true;
      playStompFishCall();
    }
  }
  // Freeze the penguin while tutorial cards are open.
  if (tutorialActive) {
    player.isMoving = false;
    return;
  }

  if (level2CardActive) {
    player.isMoving = false;
    return;
  }

  if (level3CardActive) {
    player.isMoving = false;
    return;
  }

  // Disable movement and stomping throughout the entire hole sequence.
  // This includes:
  // "falling"
  // "shaking"
  // "climbing"
  if (holeState !== "none") {
    player.isMoving = false;
    return;
  }

  // Freeze normal movement while the stomp animation is playing.
  if (stompAnimating) {
    player.isMoving = false;
    return;
  }

  let newX = player.x;
  let newY = player.y;

  // Reset movement every frame.
  player.isMoving = false;

  const W = keyIsDown(87) || keyIsDown(UP_ARROW);
  const A = keyIsDown(65) || keyIsDown(LEFT_ARROW);
  const S = keyIsDown(83) || keyIsDown(DOWN_ARROW);
  const D = keyIsDown(68) || keyIsDown(RIGHT_ARROW);

  // --- FIRST GOAT TUTORIAL TRIGGER — LEVEL 3 ---
  if (currentLevel === 3 && W && !goatHasKilledOnce && !goatTriggered) {
    goatTriggered = true;
    goatTriggerTime = millis();
  }

  // --- DIAGONAL MOVEMENT ---
  if (W && D) {
    newX += player.speed;
    newY -= player.speed;

    player.direction = "wd";
    player.isMoving = true;
  } else if (A && W) {
    newX -= player.speed;
    newY -= player.speed;

    player.direction = "aw";
    player.isMoving = true;
  } else if (S && D) {
    newX += player.speed;
    newY += player.speed;

    player.direction = "sd";
    player.isMoving = true;
  } else if (A && S) {
    newX -= player.speed;
    newY += player.speed;

    player.direction = "as";
    player.isMoving = true;
  }

  // --- CARDINAL MOVEMENT ---
  else if (W) {
    newY -= player.speed;

    player.direction = "up";
    player.isMoving = true;
  } else if (S) {
    newY += player.speed;

    player.direction = "down";
    player.isMoving = true;
  } else if (A) {
    newX -= player.speed;

    player.direction = "left";
    player.isMoving = true;
  } else if (D) {
    newX += player.speed;

    player.direction = "right";
    player.isMoving = true;
  }

  // Keep the penguin inside the world.
  if (WORLD_W_SCALED && WORLD_H_SCALED) {
    newX = constrain(newX, player.w / 2, WORLD_W_SCALED - player.w / 2);

    newY = min(newY, WORLD_H_SCALED - player.h / 2);
  }

  // Collision radius.
  let r = player.w * 0.45;

  // Three collision test points in world space.
  let topX = newX;
  let topY = newY - r;

  let leftX = newX - r;
  let leftY = newY;

  let rightX = newX + r;
  let rightY = newY;

  // Check collisions with diagonal walls.
  for (let w of walls) {
    function crossed(px, py) {
      let d0 = pointSide(player.x, player.y, w.x1, w.y1, w.x2, w.y2);

      let d1 = pointSide(px, py, w.x1, w.y1, w.x2, w.y2);

      return d0 * d1 < 0;
    }

    if (
      crossed(topX, topY) ||
      crossed(leftX, leftY) ||
      crossed(rightX, rightY)
    ) {
      let mx = newX - player.x;
      let my = newY - player.y;

      // Compute the wall normal.
      let nx = w.y2 - w.y1;
      let ny = -(w.x2 - w.x1);

      // Normalize it.
      let len = Math.hypot(nx, ny);

      nx /= len;
      ny /= len;

      // Make sure the normal faces the player.
      let side = pointSide(player.x, player.y, w.x1, w.y1, w.x2, w.y2);

      if (side < 0) {
        nx = -nx;
        ny = -ny;
      }

      // dot > 0 means the player is moving toward the wall.
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

  // Move horizontally one pixel at a time so the penguin
  // does not move through walls or spikes.
  let dx = newX - player.x;
  let stepX = dx === 0 ? 0 : dx > 0 ? 1 : -1;

  for (let i = 0; i < Math.abs(dx); i++) {
    let testX = player.x + stepX;

    if (
      !wouldCollideWithSpike(testX, player.y) &&
      isLegalPosition(testX, player.y)
    ) {
      player.x = testX;
    } else {
      break;
    }
  }

  // Move vertically one pixel at a time.
  let dy = newY - player.y;
  let stepY = dy === 0 ? 0 : dy > 0 ? 1 : -1;

  for (let i = 0; i < Math.abs(dy); i++) {
    let testY = player.y + stepY;

    if (
      !wouldCollideWithSpike(player.x, testY) &&
      isLegalPosition(player.x, testY)
    ) {
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
  let overlap = px < fx + fw && px + pw > fx && py < fy + fh && py + ph > fy;

  if (overlap) {
    fish.collected = true;

    // --- COLLECT SOUND ---
    if (fishCollect && fishCollect.isLoaded()) {
      fishCollect.setVolume(0.9);
      fishCollect.play();
    }

    // --- STOP FISH CALL SOUNDS ---
    if (fishCallNear && fishCallNear.isPlaying()) fishCallNear.stop();
    for (const c of fishCallFar) {
      if (c && c.isPlaying()) c.stop();
    }

    // --- NEW POPUP TRIGGER ---
    foundFishMessageActive = true;
    foundFishMessageTimer = foundFishMessageDuration;
  }
}

// ------------------------------------------------------------
// HOLE FALL / SHAKE / CLIMB SYSTEM
// ------------------------------------------------------------

// Checks whether the penguin has walked into any hole. Only runs during
// normal play (holeState === "none"), and skips holes the penguin is
// still immune to after just having climbed out of them.
function checkHoleCollision() {
  if (holeState !== "none") return;
  if (!hole) return;

  // Penguin hitbox (world space)
  const px = player.x + PENGUIN_HITBOX.offsetX;
  const py = player.y + PENGUIN_HITBOX.offsetY;
  const pw = PENGUIN_HITBOX.w;
  const ph = PENGUIN_HITBOX.h;

  for (const h of holes) {
    if (h.immuneUntil && millis() < h.immuneUntil) continue;

    // Hole hitbox (world space) — using the SAME shrink factor
    const hw = hole.width * HOLE_VISUAL_SCALE * HOLE_HITBOX_SCALE;
    const hh = hole.height * HOLE_VISUAL_SCALE * HOLE_HITBOX_SCALE;
    const hx = h.x - hw / 2;
    const hy = h.y - hh / 2;

    if (DEBUG_HOLE_HITBOXES) {
      push();
      noFill();
      stroke(255, 0, 255); // magenta so it stands out
      strokeWeight(3);

      // convert world → screen
      const scale = camZoom * bgScale;
      const sx = (hx - camX) * scale;
      const sy = (hy - camY) * scale;

      rect(sx, sy, hw * scale, hh * scale);
      pop();
    }

    // AABB overlap
    const overlap =
      px < hx + hw && px + pw > hx && py < hy + hh && py + ph > hy;

    if (overlap) {
      enterHole(h);
      break;
    }
  }
}

// Kicks off the fall sequence: freezes the penguin over the hole,
// applies the time penalty + timer flash, and starts the fall animation.
function enterHole(h) {
  holeState = "falling";
  activeHole = h;

  // Cancel any stomp that began on the same frame
  // that the penguin touched the hole.
  stompAnimating = false;
  stompFrame = 0;
  stompFrameTimer = 0;

  // Cancel the stomp shockwave.
  waveActive = false;
  waveRadius = 200;
  waveDelay = 0;
  waveDelayActive = false;

  // Allow fish sounds to work normally again after the cancelled stomp.
  blockFishSounds = false;

  // Stop stomp sounds immediately.
  if (stompSound && stompSound.isPlaying()) {
    stompSound.stop();
  }

  if (stompAura && stompAura.isPlaying()) {
    stompAura.stop();
  }

  // Lock the penguin to the middle of the active hole.
  player.x = h.x;
  player.y = h.y;
  player.isMoving = false;

  // Reset the falling animation.
  holeFallFrame = 0;
  holeFallFrameTimer = 0;

  // Calculate the time currently displayed by the timer.
  let elapsed = 0;

  if (timerStarted) {
    elapsed = floor((millis() - startTime) / 1000);
  }

  const currentTimeLeft = totalTime - elapsed;

  const wouldGoNegative = currentTimeLeft - HOLE_TIME_PENALTY <= 0;

  // Apply the hole penalty.
  totalTime = max(0, totalTime - HOLE_TIME_PENALTY);

  flashTimer = HOLE_TIMER_FLASH_FRAMES;

  // Falling into the hole causes a loss if no time remains.
  if (wouldGoNegative) {
    triggerLoss("hole");
  }
}
// Advances the fall animation; once the last frame has played, moves on
// to the screen-shake stage.
function updateHoleFall() {
  const cfg = SPRITES.fall;
  holeFallFrameTimer++;

  if (holeFallFrameTimer >= cfg.animSpeed) {
    holeFallFrameTimer = 0;

    if (holeFallFrame < cfg.numFrames - 1) {
      holeFallFrame++;
    } else {
      holeState = "shaking";
      holeShakeStartTime = millis();
    }
  }
}

// Runs the 3-second screen shake, then hands off to the climb stage.
function updateHoleShake() {
  const elapsed = millis() - holeShakeStartTime;

  holeShakeOffsetX = random(-HOLE_SHAKE_MAGNITUDE, HOLE_SHAKE_MAGNITUDE);
  holeShakeOffsetY = random(-HOLE_SHAKE_MAGNITUDE, HOLE_SHAKE_MAGNITUDE);

  if (elapsed >= HOLE_SHAKE_DURATION) {
    holeShakeOffsetX = 0;
    holeShakeOffsetY = 0;
    holeState = "climbing";
    holeClimbFrame = 0;
    holeEnterFrame = 0;
  }
}

// Pops the penguin back out at the hole, in the idle "W" pose, and grants
// that hole a temporary immunity window so the player can walk away first.
function exitHole() {
  activeHole.immuneUntil = millis() + HOLE_IMMUNITY_MS;

  player.direction = "up";
  player.currentFrame = 1; // idle "W" position, frame index 1
  player.frameTimer = 0;
  player.isMoving = false;

  holeState = "none";
  activeHole = null;
}

function drawHoleFallAnimation() {
  const cfg = SPRITES.fall;
  const f = holeFallFrame;
  const cropL = cfg.cropLeft[f] || 0;
  const cropR = cfg.cropRight[f] || 0;
  const cropT = cfg.cropTop[f] || 0;
  const cropB = cfg.cropBottom[f] || 0;
  const sx = f * cfg.frameWidth + cropL;
  const sy = cropT;
  const sw = cfg.frameWidth - cropL - cropR;
  const sh = cfg.frameHeight - cropT - cropB;
  const dw = sw * cfg.scale;
  const dh = sh * cfg.scale;
  const offsetX = cfg.offsetX || 0;
  const offsetY = cfg.offsetY || 0;
  const screenX = (activeHole.x - camX) * camZoom * bgScale - dw / 2 + offsetX;
  const screenY = (activeHole.y - camY) * camZoom * bgScale - dh / 2 + offsetY;

  image(cfg.img, screenX, screenY, dw, dh, sx, sy, sw, sh);
}

function drawHoleClimbAnimation() {
  const cfg = SPRITES.climb;
  const f = holeClimbFrame;
  const cropL = cfg.cropLeft[f] || 0;
  const cropR = cfg.cropRight[f] || 0;
  const cropT = cfg.cropTop[f] || 0;
  const cropB = cfg.cropBottom[f] || 0;
  const sx = f * cfg.frameWidth + cropL;
  const sy = cropT;
  const sw = cfg.frameWidth - cropL - cropR;
  const sh = cfg.frameHeight - cropT - cropB;
  const dw = sw * cfg.scale;
  const dh = sh * cfg.scale;
  const offsetX = cfg.offsetX || 0;
  const offsetY = cfg.offsetY || 0;
  const screenX = (activeHole.x - camX) * camZoom * bgScale - dw / 2 + offsetX;
  const screenY = (activeHole.y - camY) * camZoom * bgScale - dh / 2 + offsetY;
  image(cfg.img, screenX, screenY, dw, dh, sx, sy, sw, sh);
}

function drawEnterButtonAtHole() {
  const cfg = SPRITES.enterButton;
  const f = holeEnterFrame;
  const cropL = cfg.cropLeft[f] || 0;
  const cropR = cfg.cropRight[f] || 0;
  const cropT = cfg.cropTop[f] || 0;
  const cropB = cfg.cropBottom[f] || 0;
  const sx = f * cfg.frameWidth + cropL;
  const sy = cropT;
  const sw = cfg.frameWidth - cropL - cropR;
  const sh = cfg.frameHeight - cropT - cropB;
  const dw = sw * cfg.scale;
  const dh = sh * cfg.scale;
  const offsetX = cfg.offsetX || 0;
  const offsetY = cfg.offsetY || 0;
  const screenX = (activeHole.x - camX) * camZoom * bgScale - dw / 2 + offsetX;
  const screenY = (activeHole.y - camY) * camZoom * bgScale - dh + offsetY;
  image(cfg.img, screenX, screenY, dw, dh, sx, sy, sw, sh);
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
    let screenY =
      (player.y - camY) * camZoom * bgScale - dh + 10 + stompOffsetY;
    image(cfg.img, screenX, screenY, dw, dh, sx, sy, sw, sh);
    return;
  }

  let cfg = SPRITES[player.direction];
  let f = player.currentFrame;

  // cropping
  let cropL = cfg.cropLeft[f] || 0;
  let cropR = cfg.cropRight[f] || 0;
  let cropT = cfg.cropTop[f] || 0;
  let cropB = cfg.cropBottom[f] || 0;

  let sx = f * cfg.frameWidth + cropL;
  let sy = cropT;
  let sw = cfg.frameWidth - cropL - cropR;
  let sh = cfg.frameHeight - cropT - cropB;

  // fixed-size penguin (never scales)
  let dw = sw * cfg.scale;
  let dh = sh * cfg.scale;
  player.w = dw;
  player.h = dh;
  player.offsetX = ((cropL - cropR) * cfg.scale) / 2;
  player.offsetY = ((cropT - cropB) * cfg.scale) / 2;

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
      blockFishSounds = false;
      stompFrame = 0; // reset only when the sequence is actually over
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
  // Do not start the wave or aura after the player loses.
  if (gameEnded || gameState === "loss") {
    waveActive = false;
    waveDelayActive = false;
    return;
  }

  waveActive = true;
  waveRadius = 0;

  if (stompAura && stompAura.isLoaded()) {
    stompAura.play();
  }

  const duration = STOMP_FRAME_DURATIONS[frameIndex];
  waveGrowth = waveMaxRadius / duration;
}

function drawBlizzardOverlay() {
  blizzardBuffer.clear();
  blizzardBuffer.drawingContext.globalCompositeOperation = "source-over";

  // Full white blizzard layer
  blizzardBuffer.noStroke();
  blizzardBuffer.fill(255, 255, 255, 253);
  blizzardBuffer.rect(0, 0, width, height);

  // Convert penguin world → screen
  const px = (player.x - camX) * camZoom * bgScale + holeOffsetX;
  const py = (player.y - camY) * camZoom * bgScale + holeOffsetY;

  const ctx = blizzardBuffer.drawingContext;
  ctx.globalCompositeOperation = "destination-out";

  // Soften the edges of everything we erase below.
  // Bump the px value up/down to control how soft the fade is.
  ctx.filter = "blur(40px)";

  // --- 1. CIRCLE CUT-OUT (same shape as before, just blurred) ---
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(px, py, clearRadius, 0, TWO_PI);
  ctx.fill();

  // --- 2. FLASHLIGHT CONE CUT-OUT (same shape as before, just blurred) ---
  let dir = player.direction;
  let angle = 0;

  if (dir === "right") angle = -HALF_PI;
  if (dir === "up") angle = PI;
  if (dir === "left") angle = HALF_PI;
  if (dir === "down") angle = 2 * PI;

  if (dir === "wd") angle = -3 * QUARTER_PI;
  if (dir === "aw") angle = 3 * QUARTER_PI;
  if (dir === "sd") angle = -QUARTER_PI;
  if (dir === "as") angle = QUARTER_PI;

  let sprite = SPRITES[player.direction];
  let offX = sprite.offsetX * camZoom * bgScale;
  let offY = sprite.offsetY * camZoom * bgScale;
  let len = (sprite.flashlightLength ?? flashlight.length) * camZoom * bgScale;

  ctx.save();
  ctx.translate(px + offX, py + offY);
  ctx.rotate(angle);

  ctx.beginPath();
  ctx.moveTo(-flashlight.baseWidth / 2, 0);
  ctx.lineTo(flashlight.baseWidth / 2, 0);
  ctx.lineTo(flashlight.endWidth / 2, len);
  ctx.lineTo(-flashlight.endWidth / 2, len);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  // Reset filter so it doesn't affect anything drawn after this.
  ctx.filter = "none";

  // Draw final blizzard layer
  image(blizzardBuffer, 0, 0);
}

// ============================================================
// DEBUG PANEL
// ============================================================
function drawDebugPanel() {
  push();
  resetMatrix();

  rectMode(CORNER);
  textAlign(LEFT, CENTER);
  textStyle(NORMAL);
  textFont(gameFont);

  const panelX = 20;
  const panelY = 20;
  const panelW = 365;
  const panelH = 250;

  // Panel background
  noStroke();
  fill(5, 15, 35, 230);
  rect(panelX, panelY, panelW, panelH, 12);

  // Border
  noFill();
  stroke(130, 170, 230);
  strokeWeight(3);
  rect(panelX, panelY, panelW, panelH, 12);

  // Title
  noStroke();
  fill(230, 242, 255);
  textSize(34);
  textStyle(BOLD);
  text("DEBUG MODE", panelX + 20, panelY + 30);

  // Shortcuts
  textStyle(NORMAL);
  textSize(22);

  const shortcuts = [
    "Y  — Close/Open debug panel",
    "S  — Title page",
    "P  — Level picker",
    "1  — Level 1",
    "2  — Level 2",
    "3  — Level 3",
    "W  — Win screen",
    "L  — Lose screen",
  ];

  for (let i = 0; i < shortcuts.length; i++) {
    text(shortcuts[i], panelX + 20, panelY + 70 + i * 21);
  }

  pop();
}

function mousePressed() {
  // Pause menu gets first priority.
  if (gameState === "playing" && isGamePaused) {
    if (pointInsidePauseButton(PAUSE_RESUME_BTN)) {
      resumeBtnPressed = true;
      return;
    }

    if (pointInsidePauseButton(PAUSE_RESTART_BTN)) {
      restartBtnPressed = true;
      return;
    }

    if (pointInsidePauseButton(PAUSE_HOME_BTN)) {
      homeBtnPressed = true;
      return;
    }

    // Block clicks from reaching the game underneath the overlay.
    return;
  }

  // Open the pause menu from the settings button.
  if (gameState === "playing" && !isGamePaused && isSettingsButtonHovered()) {
  playButton1Sound();
  openPauseMenu();
  return;
}

  if (gameState === "story") {
    handleStoryClick();
    return;
  }

  if (gameState === "win_story") {
    handleWinStoryClick();
    return;
  }

  unlockAudio();
  // First click on the title screen only opens the gate + starts the music.
  // It must NOT also press Start, or the player skips the title screen.
  if (gameState === "start" && !musicGateOpen) {
    musicGateOpen = true;
    return;
  }

  if (handleTutorialMousePressed()) return;

  if (handleLevel2CardMousePressed()) return;

  if (handleLevel3CardMousePressed()) return;

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
    if (
      mouseX > START_BTN.x &&
      mouseX < START_BTN.x + START_BTN.w &&
      mouseY > START_BTN.y &&
      mouseY < START_BTN.y + START_BTN.h
    ) {
      startBtnPressed = true;
    }
    return;
  }

  // --- WIN SCREEN BUTTON ---
  if (gameState === "win") {
    let bx = width / 2;
    let by = height * 0.82;
    let bw = 320;
    let bh = 64;

    if (
      mouseX > bx - bw / 2 &&
      mouseX < bx + bw / 2 &&
      mouseY > by - bh / 2 &&
      mouseY < by + bh / 2
    ) {
      winBtnPressed = true;
    }
  }

  // --- LOSS SCREEN BUTTON ---
  if (gameState === "loss" && lossVideoFinished) {
    let bx = width / 2 + 400;
    let by = height * 0.55;
    let bw = 320;
    let bh = 64;

    if (
      mouseX > bx - bw / 2 &&
      mouseX < bx + bw / 2 &&
      mouseY > by - bh / 2 &&
      mouseY < by + bh / 2
    ) {
      lossBtnPressed = true;
    }
  }

  // --- LEVEL PICKER BUTTON (win + loss screens) ---
  if (gameState === "win" || (gameState === "loss" && lossVideoFinished)) {
    let bx, by;
    if (gameState === "loss") {
      bx = width / 2 + 400;
      by = height * 0.65;
    } else {
      bx = width / 2;
      by = height * 0.9;
    }
    let bw = 320,
      bh = 56;

    if (
      mouseX > bx - bw / 2 &&
      mouseX < bx + bw / 2 &&
      mouseY > by - bh / 2 &&
      mouseY < by + bh / 2
    ) {
      levelPickerBtnPressed = true;
    }
  }
}

function mouseReleased() {
  // Pause-menu button releases.
  if (gameState === "playing" && isGamePaused) {
  if (resumeBtnPressed && pointInsidePauseButton(PAUSE_RESUME_BTN)) {
    playButton1Sound();
    closePauseMenu();
    return;
  }

  if (restartBtnPressed && pointInsidePauseButton(PAUSE_RESTART_BTN)) {
    playButton1Sound();
    restartCurrentLevel();
    return;
  }

  if (homeBtnPressed && pointInsidePauseButton(PAUSE_HOME_BTN)) {
    playButton1Sound();
    returnToHomeFromPause();
    return;
  }

  resumeBtnPressed = false;
  restartBtnPressed = false;
  homeBtnPressed = false;

  return;
}

  // --- TUTORIAL MOUSE INPUT (tutorial_cards.js) ---
  if (handleTutorialMouseReleased()) return;

  // --- START SCREEN BUTTON RELEASE ---
  if (gameState === "start") {
    if (!musicGateOpen) {
      // ← add this
      startBtnPressed = false;
      return;
    }

    let hover =
      mouseX > START_BTN.x &&
      mouseX < START_BTN.x + START_BTN.w &&
      mouseY > START_BTN.y &&
      mouseY < START_BTN.y + START_BTN.h;

    if (startBtnPressed && hover) {
      beginStory();
    }

    startBtnPressed = false;
    return;
  }

  // --- WIN / LOSS BUTTON RELEASES ---
if (gameState === "win" || (gameState === "loss" && lossVideoFinished)) {
  // ------------------------------------------------------------
  // LEVEL PICKER BUTTON
  // ------------------------------------------------------------
  let lpBx;
  let lpBy;

  if (gameState === "loss") {
    lpBx = width / 2 + 400;
    lpBy = height * 0.65;
  } else {
    lpBx = width / 2;
    lpBy = height * 0.9;
  }

  const lpBw = 320;
  const lpBh = 56;

  const lpHover =
    mouseX > lpBx - lpBw / 2 &&
    mouseX < lpBx + lpBw / 2 &&
    mouseY > lpBy - lpBh / 2 &&
    mouseY < lpBy + lpBh / 2;

  if (levelPickerBtnPressed && lpHover) {
    // Loss-screen Level Picker uses button_2.
    // Win-screen Level Picker keeps the original sound.
    if (gameState === "loss") {
      playButton2Sound();
    } else {
      playButtonClickSound();
    }

    if (gameState === "win" && currentLevel === 3) {
      levelPickerBtnPressed = false;
      lossBtnPressed = false;
      winBtnPressed = false;

      beginWinStory();
      return;
    }

    startLevelPickerTransition();

    levelPickerBtnPressed = false;
    lossBtnPressed = false;
    winBtnPressed = false;
    return;
  }

  // ------------------------------------------------------------
  // TRY AGAIN BUTTON
  // ------------------------------------------------------------
  const lossBx = width / 2 + 400;
  const lossBy = height * 0.55;
  const lossBw = 320;
  const lossBh = 64;

  const lossHover =
    mouseX > lossBx - lossBw / 2 &&
    mouseX < lossBx + lossBw / 2 &&
    mouseY > lossBy - lossBh / 2 &&
    mouseY < lossBy + lossBh / 2;

  if (gameState === "loss" && lossBtnPressed && lossHover) {
    playButton2Sound();

    // Stop and reset the death video before gameplay begins again.
    stopLossVideos();

    // Rebuild and reset the current level.
    loadLevel(currentLevel);
    resetGame();

    // Skip tutorials because this is Try Again.
    tutorialActive = false;
    postTutorialTimerActive = false;
    tutorialIndex = 999;

    level2CardActive = false;
    level3CardActive = false;

    // Start a completely fresh attempt.
    startTime = millis();
    timerStarted = true;
    gameEnded = false;
    finalTime = null;

    gameState = "playing";
    cursor(ARROW);

    levelPickerBtnPressed = false;
    lossBtnPressed = false;
    winBtnPressed = false;
    return;
  }

  // Reset pressed states when the mouse is released elsewhere.
  levelPickerBtnPressed = false;
  lossBtnPressed = false;
  winBtnPressed = false;
  return;
}
}