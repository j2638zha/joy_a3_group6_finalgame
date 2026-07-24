

/*for catherine: Holes for level 3:
  { x: 552, y: 1122},
  { x: 966, y: 1157},
  { x: 889, y: 702},
  { x: 632, y: 869},
  { x: 282, y: 947},
  { x: 329, y: 569},
  { x: 633, y: 459}, */

const LEVEL3_FISH_SPAWNS = [
  { x: 85, y: 1502},
  { x: 1124, y: 1517},
  { x: 735, y: 1032},
];

function getLevel3FishStart(WORLD_W_SCALED, WORLD_H_SCALED) {
  return {
    x: WORLD_W_SCALED / 2,
    y: WORLD_H_SCALED / 2 + 700
  };
}

function buildLevel3Walls(WORLD_W_SCALED, WORLD_H_SCALED) {
  return [ 
    {
      x1: 74,
      y1: 1497,
      x2: 242,
      y2: 772
    },
    {
      x1: 242,
      y1: 772,
      x2: 356,
      y2: 522
    },
    {
      x1: 356,
      y1: 522,
      x2: 468,
      y2: 379
    },
    {
      //across line
      x1: 510,
      y1: 300,
      x2: 700,
      y2: 300
    },
    {
      x1: 750,
      y1: 358,
      x2: 851,
      y2: 476
    },
    {
      x1: 927,
      y1: 603,
      x2: 1079,
      y2: 1047
     },
    {
     x1: 1079,
     y1: 1047,
     x2: 1125,
     y2: 1212
    }
  ];
}

const LEVEL3_SPIKES = [
   { x: 469, y: 362, variant: 0 },
  { x: 495, y: 366, variant: 0 },
  { x: 517, y: 366, variant: 0 },
  { x: 544, y: 366, variant: 0 },
  { x: 570, y: 366, variant: 0 },
  { x: 596, y: 366, variant: 0 },
  { x: 627, y: 364, variant: 0 },
  { x: 780, y: 431, variant: 0 },
  { x: 751, y: 461, variant: 0 },
  { x: 722, y: 493, variant: 0 },
  { x: 695, y: 517, variant: 0 },
  { x: 666, y: 545, variant: 0 },
  { x: 479, y: 511, variant: 0 },
  { x: 456, y: 527, variant: 0 },
  { x: 434, y: 543, variant: 0 },
  { x: 411, y: 555, variant: 0 },
  { x: 249, y: 736, variant: 0 },
  { x: 274, y: 754, variant: 0 },
  { x: 305, y: 784, variant: 0 },
  { x: 333, y: 811, variant: 0 },
  { x: 365, y: 839, variant: 0 },
  { x: 389, y: 859, variant: 0 },
  { x: 414, y: 885, variant: 0 },
  { x: 417, y: 917, variant: 0 },
  { x: 412, y: 957, variant: 0 },
  { x: 400, y: 992, variant: 0 },
  { x: 391, y: 1018, variant: 0 },
  { x: 157, y: 1211, variant: 0 },
  { x: 184, y: 1193, variant: 1 },
  { x: 211, y: 1185, variant: 1 },
  { x: 244, y: 1183, variant: 1 },
  { x: 274, y: 1173, variant: 1 },
  { x: 309, y: 1169, variant: 1 },
  { x: 344, y: 1171, variant: 1 },
  { x: 395, y: 1338, variant: 2 },
  { x: 365, y: 1342, variant: 2 },
  { x: 330, y: 1356, variant: 2 },
  { x: 296, y: 1378, variant: 2 },
  { x: 269, y: 1404, variant: 2 },
  { x: 243, y: 1436, variant: 2 },
  { x: 218, y: 1472, variant: 2 },
  { x: 196, y: 1502, variant: 2 },
  { x: 179, y: 1531, variant: 2 },
  { x: 410, y: 1376, variant: 2 },
  { x: 422, y: 1408, variant: 2 },
  { x: 430, y: 1440, variant: 2 },
  { x: 437, y: 1474, variant: 2 },
  { x: 450, y: 1523, variant: 2 },
  { x: 941, y: 1275, variant: 2 },
  { x: 903, y: 1283, variant: 2 },
  { x: 868, y: 1301, variant: 2 },
  { x: 838, y: 1327, variant: 2 },
  { x: 827, y: 1346, variant: 2 },
  { x: 810, y: 1376, variant: 2 },
  { x: 802, y: 1414, variant: 2 },
  { x: 794, y: 1448, variant: 2 },
  { x: 777, y: 1494, variant: 2 },
  { x: 762, y: 1525, variant: 2 },
  { x: 964, y: 1311, variant: 2 },
  { x: 975, y: 1350, variant: 2 },
  { x: 982, y: 1390, variant: 2 },
  { x: 990, y: 1430, variant: 2 },
  { x: 995, y: 1472, variant: 2 },
  { x: 1001, y: 1512, variant: 2 },
  { x: 1014, y: 1040, variant: 3 },
  { x: 911, y: 1010, variant: 3 },
  { x: 876, y: 1014, variant: 3 },
  { x: 834, y: 1024, variant: 3 },
  { x: 805, y: 1062, variant: 3 },
  { x: 770, y: 1092, variant: 3 },
  { x: 508, y: 1179, variant: 0 },
  { x: 519, y: 1209, variant: 0 },
  { x: 526, y: 1237, variant: 0 },
  { x: 693, y: 1155, variant: 0 },
  { x: 679, y: 1181, variant: 0 },
  { x: 663, y: 1219, variant: 0 },
  { x: 530, y: 670, variant: 0 },
  { x: 508, y: 702, variant: 0 },
  { x: 488, y: 734, variant: 0 },
  { x: 473, y: 768, variant: 0 },
  { x: 452, y: 807, variant: 0 },
  { x: 438, y: 849, variant: 0 },
  { x: 550, y: 694, variant: 0 },
  { x: 565, y: 724, variant: 0 },
  { x: 575, y: 756, variant: 0 },
  { x: 583, y: 791, variant: 0 },
  { x: 582, y: 823, variant: 0 },
  { x: 580, y: 853, variant: 0 },
  { x: 567, y: 891, variant: 0 },
  { x: 556, y: 927, variant: 0 },
  { x: 542, y: 974, variant: 0 },
  { x: 527, y: 1012, variant: 0 },
  { x: 508, y: 1052, variant: 0 },
  { x: 490, y: 1088, variant: 0 },
  { x: 481, y: 1128, variant: 0 },
  { x: 625, y: 986, variant: 0 },
  { x: 596, y: 986, variant: 0 },
  { x: 560, y: 1000, variant: 0 },
  { x: 644, y: 1002, variant: 0 },
  { x: 667, y: 1028, variant: 0 },
  { x: 693, y: 1060, variant: 0 },
  { x: 711, y: 1098, variant: 0 },
  { x: 737, y: 1124, variant: 0 },
  { x: 767, y: 702, variant: 2 },
  { x: 785, y: 740, variant: 2 },
  { x: 799, y: 776, variant: 2 },
  { x: 812, y: 811, variant: 2 },
  { x: 831, y: 849, variant: 2 },
  { x: 849, y: 891, variant: 2 },
  { x: 867, y: 933, variant: 2 },
  { x: 880, y: 970, variant: 2 },
  { x: 868, y: 555, variant: 0 },
  { x: 833, y: 583, variant: 0 },
  { x: 695, y: 837, variant: 0 },
  { x: 707, y: 867, variant: 0 },
  { x: 728, y: 905, variant: 0 },
  { x: 570, y: 485, variant: 0 },
  { x: 571, y: 523, variant: 0 },
  { x: 393, y: 688, variant: 0 },
  { x: 642, y: 1400, variant: 0 },
  { x: 780, y: 1223, variant: 0 },
  { x: 164, y: 1346, variant: 0 },
  { x: 1083, y: 1352, variant: 0 },
];

const LEVEL3_TOP_OFFSET = 550;

// World Y coordinate of the finish line for Level 3.
const LEVEL3_FINISH_Y = 391; // <- replace once you have Level 3's background