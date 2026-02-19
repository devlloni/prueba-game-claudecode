/**
 * Level Data - defines the layout of all 3 levels
 * Each level specifies platforms, blocks, enemies, decorations, etc.
 *
 * Coordinate system: x/y from top-left, y increases downward.
 * Level height: 480px (15 tiles of 32px)
 * GROUND_Y = 416 (floor starts here, 2 ground tiles high = 64px)
 */

const TILE = 32;
const GY = 416; // ground top y
const LH = 480; // level height

const LEVELS = [
  /* ============================================================
     LEVEL 1 - GRASSLANDS (day, easy)
     Theme: Blue sky, green hills, slime enemies
     ============================================================ */
  {
    index: 0,
    name: 'Grasslands',
    theme: 'sky',
    bgKey: 'bg_sky',
    groundTile: 'tile_ground',
    width: 6400,
    gravity: 800,
    music: null,

    // Ground spans full width (2 tiles thick)
    ground: [{ x: 0, y: GY, w: 6400 }],

    // Gaps in ground (danger pits)
    gaps: [
      { x: 1120, w: 128 },
      { x: 2240, w: 96 },
      { x: 3520, w: 160 },
      { x: 4800, w: 128 },
      { x: 5600, w: 96 },
    ],

    // Floating platforms
    platforms: [
      { x: 256,  y: GY-128, w: 4 },   // 4 tiles wide
      { x: 512,  y: GY-192, w: 3 },
      { x: 768,  y: GY-128, w: 2 },
      { x: 1280, y: GY-96,  w: 3 },
      { x: 1600, y: GY-160, w: 4 },
      { x: 2000, y: GY-128, w: 2 },
      { x: 2400, y: GY-192, w: 3 },
      { x: 2720, y: GY-160, w: 2 },
      { x: 3200, y: GY-128, w: 4 },
      { x: 3680, y: GY-192, w: 3 },
      { x: 4000, y: GY-128, w: 2 },
      { x: 4320, y: GY-160, w: 3 },
      { x: 5000, y: GY-128, w: 4 },
      { x: 5300, y: GY-192, w: 3 },
    ],

    // Brick blocks (breakable)
    bricks: [
      { x: 352,  y: GY-128 },
      { x: 384,  y: GY-128 },
      { x: 416,  y: GY-128 },
      { x: 704,  y: GY-160 },
      { x: 736,  y: GY-160 },
      { x: 1024, y: GY-128 },
      { x: 1056, y: GY-128 },
      { x: 1824, y: GY-160 },
      { x: 1856, y: GY-160 },
      { x: 1888, y: GY-160 },
      { x: 2560, y: GY-128 },
      { x: 2592, y: GY-128 },
      { x: 3072, y: GY-160 },
      { x: 3104, y: GY-160 },
      { x: 4160, y: GY-128 },
      { x: 4192, y: GY-128 },
      { x: 4864, y: GY-160 },
      { x: 4896, y: GY-160 },
    ],

    // Question blocks (give items when hit)
    questions: [
      { x: 320,  y: GY-128, item: 'coin' },
      { x: 480,  y: GY-192, item: 'mushroom' },
      { x: 672,  y: GY-224, item: 'coin' },
      { x: 1040, y: GY-128, item: 'star' },
      { x: 1568, y: GY-256, item: 'mushroom' },
      { x: 1840, y: GY-160, item: 'coin' },
      { x: 2528, y: GY-160, item: 'coin' },
      { x: 2784, y: GY-288, item: 'mushroom' },
      { x: 3200, y: GY-192, item: 'coin' },
      { x: 3648, y: GY-256, item: 'star' },
      { x: 4128, y: GY-160, item: 'coin' },
      { x: 4512, y: GY-224, item: 'mushroom' },
      { x: 5088, y: GY-224, item: 'coin' },
    ],

    // Pipes (decorative + warp)
    pipes: [
      { x: 600,  h: 2 },
      { x: 900,  h: 3 },
      { x: 1700, h: 2 },
      { x: 2900, h: 3 },
      { x: 4000+1600, h: 2 },
    ],

    // Coins scattered in air
    coins: [
      // Row of coins after pipe
      ...Array.from({length:5}, (_,i) => ({ x: 896 + i*32, y: GY-64 })),
      ...Array.from({length:4}, (_,i) => ({ x: 1920 + i*32, y: GY-96 })),
      ...Array.from({length:6}, (_,i) => ({ x: 2944 + i*32, y: GY-64 })),
      ...Array.from({length:5}, (_,i) => ({ x: 4032 + i*32, y: GY-96 })),
      ...Array.from({length:4}, (_,i) => ({ x: 5120 + i*32, y: GY-64 })),
    ],

    // Enemies
    enemies: [
      { type: 'gloop', x: 400,  y: GY-32, dir: -1 },
      { type: 'gloop', x: 600,  y: GY-32, dir: -1 },
      { type: 'gloop', x: 800,  y: GY-32, dir:  1 },
      { type: 'gloop', x: 1000, y: GY-32, dir: -1 },
      { type: 'gloop', x: 1300, y: GY-32, dir:  1 },
      { type: 'gloop', x: 1500, y: GY-32, dir: -1 },
      { type: 'gloop', x: 1900, y: GY-32, dir:  1 },
      { type: 'gloop', x: 2100, y: GY-32, dir: -1 },
      { type: 'gloop', x: 2500, y: GY-32, dir:  1 },
      { type: 'gloop', x: 2700, y: GY-32, dir: -1 },
      { type: 'gloop', x: 3100, y: GY-32, dir:  1 },
      { type: 'gloop', x: 3300, y: GY-32, dir: -1 },
      { type: 'gloop', x: 3700, y: GY-32, dir:  1 },
      { type: 'gloop', x: 4100, y: GY-32, dir: -1 },
      { type: 'gloop', x: 4500, y: GY-32, dir:  1 },
      { type: 'gloop', x: 5000, y: GY-32, dir: -1 },
      { type: 'gloop', x: 5200, y: GY-32, dir:  1 },
      { type: 'gloop', x: 5400, y: GY-32, dir: -1 },
    ],

    // Decorations
    decorations: [
      { type: 'cloud', x: 200,  y: 60 },
      { type: 'cloud', x: 600,  y: 40 },
      { type: 'cloud', x: 900,  y: 80 },
      { type: 'cloud', x: 1400, y: 50 },
      { type: 'cloud', x: 1900, y: 70 },
      { type: 'cloud', x: 2400, y: 40 },
      { type: 'cloud', x: 3000, y: 60 },
      { type: 'cloud', x: 3600, y: 80 },
      { type: 'cloud', x: 4200, y: 50 },
      { type: 'cloud', x: 4800, y: 40 },
      { type: 'cloud', x: 5400, y: 70 },
      { type: 'hill',  x: 100,  y: GY-32 },
      { type: 'hill',  x: 700,  y: GY-32 },
      { type: 'hill',  x: 1600, y: GY-32 },
      { type: 'hill',  x: 3200, y: GY-32 },
      { type: 'hill',  x: 4800, y: GY-32 },
      { type: 'bush',  x: 300,  y: GY-16 },
      { type: 'bush',  x: 1100, y: GY-16 },
      { type: 'bush',  x: 2200, y: GY-16 },
      { type: 'bush',  x: 3800, y: GY-16 },
      { type: 'bush',  x: 5100, y: GY-16 },
    ],

    playerStart: { x: 96, y: GY-64 },
    flagX: 6100,
    castleX: 6200,
  },

  /* ============================================================
     LEVEL 2 - UNDERGROUND CAVES (cave, medium)
     Theme: Dark cave, rocks, crab enemies
     ============================================================ */
  {
    index: 1,
    name: 'Underground Caves',
    theme: 'cave',
    bgKey: 'bg_cave',
    groundTile: 'tile_ground_cave',
    width: 7200,
    gravity: 900,
    music: null,

    ground: [{ x: 0, y: GY, w: 7200 }],

    gaps: [
      { x: 960,  w: 96  },
      { x: 2080, w: 128 },
      { x: 3200, w: 96  },
      { x: 4480, w: 160 },
      { x: 5760, w: 128 },
      { x: 6560, w: 96  },
    ],

    platforms: [
      { x: 320,  y: GY-128, w: 3 },
      { x: 640,  y: GY-192, w: 4 },
      { x: 1120, y: GY-96,  w: 3 },
      { x: 1440, y: GY-160, w: 5 },
      { x: 2240, y: GY-128, w: 3 },
      { x: 2560, y: GY-224, w: 4 },
      { x: 3360, y: GY-128, w: 3 },
      { x: 3680, y: GY-192, w: 5 },
      { x: 4000, y: GY-256, w: 2 },
      { x: 4640, y: GY-128, w: 4 },
      { x: 4960, y: GY-192, w: 3 },
      { x: 5280, y: GY-160, w: 4 },
      { x: 5920, y: GY-128, w: 3 },
      { x: 6240, y: GY-192, w: 4 },
    ],

    bricks: [
      { x: 448,  y: GY-128 }, { x: 480,  y: GY-128 },
      { x: 800,  y: GY-160 }, { x: 832,  y: GY-160 }, { x: 864, y: GY-160 },
      { x: 1248, y: GY-128 }, { x: 1280, y: GY-128 },
      { x: 1632, y: GY-192 }, { x: 1664, y: GY-192 },
      { x: 2368, y: GY-128 }, { x: 2400, y: GY-128 },
      { x: 2720, y: GY-224 }, { x: 2752, y: GY-224 }, { x: 2784, y: GY-224 },
      { x: 3456, y: GY-128 }, { x: 3488, y: GY-128 },
      { x: 3808, y: GY-192 }, { x: 3840, y: GY-192 },
      { x: 4736, y: GY-128 }, { x: 4768, y: GY-128 },
      { x: 5056, y: GY-192 }, { x: 5088, y: GY-192 }, { x: 5120, y: GY-192 },
      { x: 6016, y: GY-128 }, { x: 6048, y: GY-128 },
      { x: 6336, y: GY-192 }, { x: 6368, y: GY-192 },
    ],

    questions: [
      { x: 416,  y: GY-128, item: 'coin' },
      { x: 672,  y: GY-256, item: 'mushroom' },
      { x: 1152, y: GY-128, item: 'star' },
      { x: 1536, y: GY-192, item: 'coin' },
      { x: 2336, y: GY-160, item: 'coin' },
      { x: 2656, y: GY-288, item: 'mushroom' },
      { x: 3424, y: GY-128, item: 'coin' },
      { x: 3776, y: GY-256, item: 'star' },
      { x: 4704, y: GY-160, item: 'coin' },
      { x: 5024, y: GY-224, item: 'mushroom' },
      { x: 5984, y: GY-160, item: 'coin' },
      { x: 6304, y: GY-256, item: 'coin' },
    ],

    pipes: [
      { x: 550,  h: 2 },
      { x: 1050, h: 3 },
      { x: 2300, h: 2 },
      { x: 3700, h: 3 },
      { x: 5500, h: 2 },
    ],

    coins: [
      ...Array.from({length:5}, (_,i) => ({ x: 1056 + i*32, y: GY-96 })),
      ...Array.from({length:4}, (_,i) => ({ x: 2176 + i*32, y: GY-64 })),
      ...Array.from({length:6}, (_,i) => ({ x: 3264 + i*32, y: GY-96 })),
      ...Array.from({length:5}, (_,i) => ({ x: 4608 + i*32, y: GY-64 })),
      ...Array.from({length:4}, (_,i) => ({ x: 5792 + i*32, y: GY-96 })),
    ],

    enemies: [
      { type: 'shellie', x: 500,  y: GY-32, dir: -1 },
      { type: 'gloop',   x: 700,  y: GY-32, dir:  1 },
      { type: 'shellie', x: 900,  y: GY-32, dir: -1 },
      { type: 'shellie', x: 1200, y: GY-32, dir:  1 },
      { type: 'gloop',   x: 1500, y: GY-32, dir: -1 },
      { type: 'shellie', x: 1800, y: GY-32, dir:  1 },
      { type: 'shellie', x: 2200, y: GY-32, dir: -1 },
      { type: 'gloop',   x: 2400, y: GY-32, dir:  1 },
      { type: 'shellie', x: 2700, y: GY-32, dir: -1 },
      { type: 'shellie', x: 3000, y: GY-32, dir:  1 },
      { type: 'gloop',   x: 3400, y: GY-32, dir: -1 },
      { type: 'shellie', x: 3700, y: GY-32, dir:  1 },
      { type: 'shellie', x: 4000, y: GY-32, dir: -1 },
      { type: 'gloop',   x: 4300, y: GY-32, dir:  1 },
      { type: 'shellie', x: 4700, y: GY-32, dir: -1 },
      { type: 'shellie', x: 5000, y: GY-32, dir:  1 },
      { type: 'gloop',   x: 5300, y: GY-32, dir: -1 },
      { type: 'shellie', x: 5600, y: GY-32, dir:  1 },
      { type: 'shellie', x: 6000, y: GY-32, dir: -1 },
      { type: 'gloop',   x: 6300, y: GY-32, dir:  1 },
      { type: 'shellie', x: 6600, y: GY-32, dir: -1 },
    ],

    decorations: [
      { type: 'cave_rock', x: 200,  y: GY-16 },
      { type: 'cave_rock', x: 800,  y: GY-16 },
      { type: 'cave_rock', x: 1600, y: GY-16 },
      { type: 'cave_rock', x: 2800, y: GY-16 },
      { type: 'cave_rock', x: 4200, y: GY-16 },
      { type: 'cave_rock', x: 5600, y: GY-16 },
    ],

    playerStart: { x: 96, y: GY-64 },
    flagX: 6900,
    castleX: 7000,
  },

  /* ============================================================
     LEVEL 3 - SKY KINGDOM (sky, hard)
     Theme: Purple sky, clouds as platforms, bat enemies
     ============================================================ */
  {
    index: 2,
    name: 'Sky Kingdom',
    theme: 'skyworld',
    bgKey: 'bg_skyworld',
    groundTile: 'tile_ground_sky',
    width: 8000,
    gravity: 750,
    music: null,

    ground: [{ x: 0, y: GY, w: 8000 }],

    gaps: [
      { x: 800,  w: 160 },
      { x: 1760, w: 192 },
      { x: 2880, w: 160 },
      { x: 4000, w: 224 },
      { x: 5120, w: 192 },
      { x: 6240, w: 160 },
      { x: 7200, w: 128 },
    ],

    platforms: [
      { x: 320,  y: GY-160, w: 3 },
      { x: 640,  y: GY-256, w: 4 },
      { x: 1024, y: GY-128, w: 3 },
      { x: 1280, y: GY-224, w: 4 },
      { x: 2000, y: GY-192, w: 3 },
      { x: 2320, y: GY-288, w: 4 },
      { x: 3120, y: GY-160, w: 3 },
      { x: 3440, y: GY-256, w: 5 },
      { x: 3840, y: GY-320, w: 3 },
      { x: 4320, y: GY-160, w: 4 },
      { x: 4640, y: GY-256, w: 3 },
      { x: 5440, y: GY-192, w: 4 },
      { x: 5760, y: GY-288, w: 3 },
      { x: 6560, y: GY-160, w: 4 },
      { x: 6880, y: GY-256, w: 3 },
    ],

    bricks: [
      { x: 448,  y: GY-160 }, { x: 480, y: GY-160 },
      { x: 800,  y: GY-192 }, { x: 832, y: GY-192 }, { x: 864, y: GY-192 },
      { x: 1152, y: GY-160 }, { x: 1184, y: GY-160 },
      { x: 2112, y: GY-224 }, { x: 2144, y: GY-224 },
      { x: 2432, y: GY-288 }, { x: 2464, y: GY-288 }, { x: 2496, y: GY-288 },
      { x: 3232, y: GY-192 }, { x: 3264, y: GY-192 },
      { x: 3552, y: GY-288 }, { x: 3584, y: GY-288 },
      { x: 4448, y: GY-192 }, { x: 4480, y: GY-192 },
      { x: 5568, y: GY-224 }, { x: 5600, y: GY-224 }, { x: 5632, y: GY-224 },
      { x: 6672, y: GY-192 }, { x: 6704, y: GY-192 },
      { x: 6992, y: GY-288 }, { x: 7024, y: GY-288 },
    ],

    questions: [
      { x: 416,  y: GY-192, item: 'coin' },
      { x: 672,  y: GY-320, item: 'mushroom' },
      { x: 1120, y: GY-160, item: 'star' },
      { x: 1344, y: GY-288, item: 'coin' },
      { x: 2080, y: GY-256, item: 'coin' },
      { x: 2400, y: GY-352, item: 'mushroom' },
      { x: 3200, y: GY-192, item: 'coin' },
      { x: 3520, y: GY-320, item: 'star' },
      { x: 3904, y: GY-384, item: 'coin' },
      { x: 4416, y: GY-224, item: 'mushroom' },
      { x: 4704, y: GY-320, item: 'coin' },
      { x: 5536, y: GY-256, item: 'coin' },
      { x: 5824, y: GY-352, item: 'star' },
      { x: 6640, y: GY-224, item: 'coin' },
      { x: 6960, y: GY-320, item: 'mushroom' },
    ],

    pipes: [
      { x: 500,  h: 2 },
      { x: 1200, h: 3 },
      { x: 2600, h: 2 },
      { x: 4200, h: 3 },
      { x: 5800, h: 2 },
      { x: 7000, h: 2 },
    ],

    coins: [
      ...Array.from({length:6}, (_,i) => ({ x: 960 + i*32, y: GY-96 })),
      ...Array.from({length:5}, (_,i) => ({ x: 2016 + i*32, y: GY-96 })),
      ...Array.from({length:7}, (_,i) => ({ x: 3072 + i*32, y: GY-96 })),
      ...Array.from({length:6}, (_,i) => ({ x: 4256 + i*32, y: GY-96 })),
      ...Array.from({length:5}, (_,i) => ({ x: 5376 + i*32, y: GY-96 })),
      ...Array.from({length:6}, (_,i) => ({ x: 6464 + i*32, y: GY-96 })),
    ],

    enemies: [
      { type: 'batling', x: 500,  y: GY-200, dir: -1 },
      { type: 'batling', x: 700,  y: GY-180, dir:  1 },
      { type: 'gloop',   x: 900,  y: GY-32,  dir: -1 },
      { type: 'batling', x: 1100, y: GY-200, dir:  1 },
      { type: 'shellie', x: 1300, y: GY-32,  dir: -1 },
      { type: 'batling', x: 1600, y: GY-220, dir:  1 },
      { type: 'batling', x: 2000, y: GY-180, dir: -1 },
      { type: 'gloop',   x: 2200, y: GY-32,  dir:  1 },
      { type: 'batling', x: 2500, y: GY-200, dir: -1 },
      { type: 'shellie', x: 2700, y: GY-32,  dir:  1 },
      { type: 'batling', x: 3100, y: GY-180, dir: -1 },
      { type: 'batling', x: 3300, y: GY-220, dir:  1 },
      { type: 'gloop',   x: 3600, y: GY-32,  dir: -1 },
      { type: 'batling', x: 3900, y: GY-200, dir:  1 },
      { type: 'batling', x: 4100, y: GY-180, dir: -1 },
      { type: 'shellie', x: 4400, y: GY-32,  dir:  1 },
      { type: 'batling', x: 4700, y: GY-220, dir: -1 },
      { type: 'batling', x: 5000, y: GY-200, dir:  1 },
      { type: 'gloop',   x: 5200, y: GY-32,  dir: -1 },
      { type: 'batling', x: 5500, y: GY-180, dir:  1 },
      { type: 'batling', x: 5800, y: GY-220, dir: -1 },
      { type: 'shellie', x: 6100, y: GY-32,  dir:  1 },
      { type: 'batling', x: 6400, y: GY-200, dir: -1 },
      { type: 'batling', x: 6700, y: GY-180, dir:  1 },
      { type: 'gloop',   x: 7000, y: GY-32,  dir: -1 },
      { type: 'batling', x: 7300, y: GY-220, dir:  1 },
      { type: 'batling', x: 7600, y: GY-200, dir: -1 },
    ],

    decorations: [
      { type: 'cloud', x: 200,  y: 100 },
      { type: 'cloud', x: 700,  y: 60  },
      { type: 'cloud', x: 1200, y: 120 },
      { type: 'cloud', x: 2000, y: 80  },
      { type: 'cloud', x: 2800, y: 50  },
      { type: 'cloud', x: 3600, y: 110 },
      { type: 'cloud', x: 4400, y: 70  },
      { type: 'cloud', x: 5200, y: 90  },
      { type: 'cloud', x: 6000, y: 60  },
      { type: 'cloud', x: 6800, y: 100 },
      { type: 'cloud', x: 7400, y: 50  },
    ],

    playerStart: { x: 96, y: GY-64 },
    flagX: 7700,
    castleX: 7800,
  },
];
