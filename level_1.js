//level_1.js file

// Possible fish spawn spots for Level 1 (one is picked at random
// each time randomizeFishPosition() runs).
const LEVEL1_FISH_SPAWNS = [
  { x: 798, y: 1345},
  { x: 385, y: 1115},
];

// Where the fish first appears when the level loads, expressed
// as an offset from the center of the scaled world. Call
// getLevel1FishStart(WORLD_W_SCALED, WORLD_H_SCALED) once those
// are known to get the actual world-space coordinates.
function getLevel1FishStart(WORLD_W_SCALED, WORLD_H_SCALED) {
  return {
    x: WORLD_W_SCALED / 2 - 230,
    y: WORLD_H_SCALED / 2 + 740
  };
}

// Level 1's two diagonal boundary walls, expressed as offsets
// from the center of the scaled world. Call
// buildLevel1Walls(WORLD_W_SCALED, WORLD_H_SCALED) once those are
// known to get the actual world-space wall segments. The engine
// (sketch.js) is responsible for pushing these into `walls` and
// computing each wall's `side`.
function buildLevel1Walls(WORLD_W_SCALED, WORLD_H_SCALED) {
  return [
    // WALL 1 — centered diagonal
    {
      x1: WORLD_W_SCALED / 2 - 670,
      y1: WORLD_H_SCALED / 2 + 1200,
      x2: WORLD_W_SCALED / 2 + 290,
      y2: WORLD_H_SCALED / 2 - 1600
    },
    // WALL 2 — another diagonal, different angle
    {
      x1: WORLD_W_SCALED / 2 + 700,
      y1: WORLD_H_SCALED / 2 + 1200,
      x2: WORLD_W_SCALED / 2 - 250,
      y2: WORLD_H_SCALED / 2 - 1600
    }
  ];
}

// Rocky spike placements for Level 1. `variant` indexes into the
// generic SPIKE_HITBOXES / spikeImages arrays defined in sketch.js.
const LEVEL1_SPIKES = [
 { x: 678, y: 596, variant: 0 },
  { x: 511, y: 569, variant: 0 },
  { x: 640, y: 585, variant: 0 },
  { x: 541, y: 571, variant: 0 },
  { x: 562, y: 719, variant: 0 },
  { x: 550, y: 755, variant: 0 },
  { x: 516, y: 765, variant: 0 },
  { x: 480, y: 776, variant: 0 },
  { x: 465, y: 820, variant: 0 },
  { x: 465, y: 861, variant: 0 },
  { x: 466, y: 913, variant: 0 },
  { x: 490, y: 954, variant: 0 },
  { x: 519, y: 970, variant: 0 },
  { x: 546, y: 973, variant: 0 },
  { x: 577, y: 973, variant: 0 },
  { x: 607, y: 992, variant: 0 },
  { x: 616, y: 1042, variant: 0 },
  { x: 617, y: 1083, variant: 0 },
  { x: 612, y: 1124, variant: 2 },
  { x: 585, y: 1162, variant: 2 },
  { x: 563, y: 1195, variant: 2 },
  { x: 552, y: 1236, variant: 2 },
  { x: 347, y: 990, variant: 1 },
  { x: 372, y: 1025, variant: 1 },
  { x: 397, y: 1061, variant: 1 },
  { x: 425, y: 1099, variant: 1 },
  { x: 461, y: 1137, variant: 1 },
  { x: 279, y: 1255, variant: 2 },
  { x: 309, y: 1285, variant: 2 },
  { x: 339, y: 1323, variant: 2 },
  { x: 375, y: 1348, variant: 2 },
  { x: 407, y: 1386, variant: 2 },
  { x: 439, y: 1422, variant: 2 },
  { x: 474, y: 1463, variant: 2 },
  { x: 500, y: 1514, variant: 2 },
  { x: 586, y: 1268, variant: 0 },
  { x: 616, y: 1268, variant: 0 },
  { x: 645, y: 1268, variant: 0 },
  { x: 674, y: 1266, variant: 0 },
  { x: 704, y: 1258, variant: 0 },
  { x: 726, y: 1309, variant: 0 },
  { x: 740, y: 1361, variant: 0 },
  { x: 745, y: 1405, variant: 0 },
  { x: 745, y: 1446, variant: 2 },
  { x: 747, y: 1493, variant: 2 },
  { x: 748, y: 1542, variant: 2 },
  { x: 748, y: 1599, variant: 3 },
  { x: 753, y: 1637, variant: 3 },
  { x: 724, y: 1665, variant: 0 },
  { x: 690, y: 1700, variant: 0 },
  { x: 790, y: 1260, variant: 0 },
  { x: 760, y: 1288, variant: 0 },
  { x: 814, y: 1266, variant: 0 },
  { x: 840, y: 1301, variant: 0 },
  { x: 857, y: 1345, variant: 0 },
  { x: 867, y: 1391, variant: 0 },
  { x: 815, y: 949, variant: 0 },
  { x: 784, y: 979, variant: 0 },
  { x: 754, y: 1014, variant: 0 },
  { x: 723, y: 1053, variant: 0 },
  { x: 722, y: 722, variant: 0 },
  { x: 690, y: 757, variant: 0 },
  { x: 659, y: 785, variant: 0 },
  { x: 623, y: 831, variant: 0 },
  { x: 488, y: 1703, variant: 1 },
  { x: 447, y: 1706, variant: 1 },
  { x: 401, y: 1711, variant: 1 },
  { x: 359, y: 1714, variant: 1 },
  { x: 311, y: 1711, variant: 1 },
  { x: 266, y: 1709, variant: 1 },
  { x: 287, y: 1506, variant: 0 },
  { x: 936, y: 1758, variant: 0 },
  { x: 182, y: 1843, variant: 0 },
  { x: 827, y: 1094, variant: 0 },
  { x: 763, y: 1837, variant: 0 },
  { x: 786, y: 1864, variant: 0 },
  { x: 817, y: 1884, variant: 0 },
  { x: 533, y: 1875, variant: 3 },
  { x: 501, y: 1897, variant: 3 },
  { x: 463, y: 1922, variant: 3 },
  { x: 310, y: 1905, variant: 2 },
  { x: 287, y: 1925, variant: 2 },
  { x: 259, y: 1946, variant: 2 },
  { x: 1030, y: 1886, variant: 2 },
  { x: 996, y: 1911, variant: 2 },
  { x: 624, y: 1501, variant: 1 },
  { x: 612, y: 1534, variant: 1 },
  { x: 597, y: 1575, variant: 1 },
  { x: 582, y: 1618, variant: 1 },
  { x: 567, y: 1657, variant: 1 },
  { x: 536, y: 1689, variant: 1 },
  { x: 870, y: 1430, variant: 0 },
  { x: 874, y: 1473, variant: 0 },
  { x: 877, y: 1523, variant: 0 },
];

// How far above center the top boundary/camera limit sits.
// 550 is what Level 1 already used.
const LEVEL1_TOP_OFFSET = 550;

// World Y coordinate of the finish line for Level 1.
const LEVEL1_FINISH_Y = 556; // <- replace with your recorded value

