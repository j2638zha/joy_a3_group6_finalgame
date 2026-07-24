// level_2.js file

/*for catherine: Holes for level 2
  { x: 622, y: 923},
  { x: 851, y: 1090},
  { x: 232, y: 891},
  { x: 373, y: 724},
  { x: 820, y: 698},*/

// Possible fish spawn spots for Level 2 (picked randomly each attempt).
// Walk the penguin to a spot, read "Player: x, y" in the corner of the
// screen, then add {x, y} here.
const LEVEL2_FISH_SPAWNS = [
    { x: 942, y: 859},
    { x: 601, y: 646},
    { x: 57, y: 1210},
];

// Where the fish first appears when Level 2 loads.
function getLevel2FishStart(WORLD_W_SCALED, WORLD_H_SCALED) {
  return {
    x: WORLD_W_SCALED / 2,
    y: WORLD_H_SCALED / 2 + 700
  };
}

// Level 2's diagonal boundary walls. Add/remove/adjust as needed —
// each wall is a straight line from (x1,y1) to (x2,y2).
function buildLevel2Walls(WORLD_W_SCALED, WORLD_H_SCALED) {
    return [
    {
        x1: 65,
        y1: 1102,
        x2: 341,
        y2: 628
    },
    {
        x1:341,
        y1: 628,
        x2: 428,
        y2: 551
    },
    {
        x1: 755,
        y1: 551,
        x2: 857,
        y2: 635
    },
    {
        x1: 857,
        y1: 635,
        x2: 981,
        y2: 836
    },
    {
        x1: 1130,
        y1: 1342,
        x2: 1091,
        y2: 1114
    },
    {
        x1: 440,
        y1: 530,
        x2: 665,
        y2: 530
    }
    ];
 /*
    return [
    {
      x1: 5,
      y1: 1500,
      x2: WORLD_W_SCALED / 2 + 250,
      y2: WORLD_H_SCALED / 2 - 1500
    },
    {
      x1: WORLD_W_SCALED / 2 + 650,
      y1: WORLD_H_SCALED / 2 + 1200,
      x2: WORLD_W_SCALED / 2 - 200,
      y2: WORLD_H_SCALED / 2 - 1500
    }
  ];
  */
}

// Spike placements for Level 2. variant: 0 = small, 1 = mid,
// 2 = tall, 3 = double.
const LEVEL2_SPIKES = [
  { x: 494, y: 1381, variant: 0 },
  { x: 619, y: 572, variant: 1 },
  { x: 565, y: 602, variant: 1 },
  { x: 517, y: 614, variant: 1 },
  { x: 519, y: 662, variant: 2 },
  { x: 551, y: 690, variant: 2 },
  { x: 588, y: 710, variant: 2 },
  { x: 633, y: 724, variant: 3 },
  { x: 683, y: 728, variant: 3 },
  { x: 729, y: 730, variant: 3 },
  { x: 738, y: 606, variant: 0 },
  { x: 466, y: 700, variant: 0 },
  { x: 503, y: 716, variant: 0 },
  { x: 340, y: 624, variant: 2 },
  { x: 533, y: 991, variant: 3 },
  { x: 525, y: 841, variant: 0 },
  { x: 711, y: 875, variant: 0 },
  { x: 240, y: 1053, variant: 1 },
  { x: 276, y: 1088, variant: 1 },
  { x: 303, y: 1126, variant: 1 },
  { x: 31, y: 1294, variant: 1 },
  { x: 70, y: 1300, variant: 1 },
  { x: 106, y: 1300, variant: 1 },
  { x: 142, y: 1300, variant: 1 },
  { x: 180, y: 1290, variant: 1 },
  { x: 232, y: 1278, variant: 1 },
  { x: 1049, y: 1144, variant: 1 },
  { x: 1016, y: 1162, variant: 1 },
  { x: 991, y: 1188, variant: 1 },
  { x: 949, y: 1208, variant: 1 },
  { x: 894, y: 1226, variant: 3 },
  { x: 850, y: 1238, variant: 3 },
  { x: 805, y: 1252, variant: 3 },
  { x: 911, y: 795, variant: 2 },
  { x: 876, y: 839, variant: 2 },
  { x: 851, y: 871, variant: 2 },
  { x: 817, y: 923, variant: 2 },
  { x: 794, y: 959, variant: 2 },
  { x: 768, y: 995, variant: 2 },
  { x: 739, y: 1037, variant: 2 },
  { x: 720, y: 1082, variant: 1 },
  { x: 698, y: 1128, variant: 1 },
  { x: 656, y: 1134, variant: 1 },
  { x: 604, y: 1146, variant: 1 },
  { x: 454, y: 1156, variant: 3 },
  { x: 357, y: 1252, variant: 3 },
  { x: 704, y: 1360, variant: 3 },
  { x: 922, y: 991, variant: 1 },
  { x: 254, y: 746, variant: 1 },
  { x: 285, y: 789, variant: 1 },
  { x: 320, y: 827, variant: 1 },
  { x: 350, y: 871, variant: 1 },
  { x: 375, y: 923, variant: 1 },
  { x: 409, y: 965, variant: 1 },
  { x: 447, y: 1001, variant: 1 },
  { x: 489, y: 1015, variant: 1 },
];

// How far above center the top boundary/camera limit sits for this
// level. Start at 550 (same as Level 1) and adjust up/down if the
// camera cuts off the top of the background too soon or too late.
const LEVEL2_TOP_OFFSET = 550;

// World Y coordinate of the finish line for Level 2.
const LEVEL2_FINISH_Y = 593; // <- replace with your recorded value