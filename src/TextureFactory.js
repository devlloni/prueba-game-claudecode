/**
 * TextureFactory – generates all game textures procedurally.
 * No external image assets required.
 */
class TextureFactory {
  constructor(scene) { this.scene = scene; }

  makeTexture(key, w, h, drawFn) {
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    drawFn(ctx, w, h);
    this.scene.textures.addCanvas(key, canvas);
  }

  pixelArt(ctx, pixels, palette, scale = 2) {
    pixels.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        const color = palette[ch];
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      });
    });
  }

  createAll() {
    this.createPlayerTextures();
    this.createEnemyTextures();
    this.createTileTextures();
    this.createPowerUpTextures();
    this.createUITextures();
    this.createBackgroundTextures();
    this.createEffectTextures();
  }

  /* ====================== PLAYER ====================== */
  createPlayerTextures() {
    // Improved palette – richer blues, sharper contrast
    const P = {
      B: '#1565C0', // main royal blue
      D: '#0A2E6E', // dark outline
      L: '#42A5F5', // light-blue highlight
      V: '#90CAF9', // visor pale blue
      W: '#FFFFFF', // white
      K: '#030A14', // near-black pupil
      Y: '#FFD600', // gold / amber
      G: '#455A64', // dark steel (legs)
      S: '#78909C', // lighter steel
      R: '#EF5350', // red accent
      ' ': null,
    };

    // ── small idle (9 × 9) ──────────────────────────────────────────────────
    const smallIdle = [
      '  DBBBD  ',
      ' DBVVVBD ',
      ' DBWKWBD ',
      ' DBVVVBD ',
      '  DYYYD  ',
      ' DLBBBLD ',
      ' DLY YLD ',
      ' DGSSGD  ',
      '  GS SG  ',
    ];
    // ── small walk 1 ────────────────────────────────────────────────────────
    const smallWalk1 = [
      '  DBBBD  ',
      ' DBVVVBD ',
      ' DBWKWBD ',
      ' DBVVVBD ',
      '  DYYYD  ',
      ' DLBBBLD ',
      ' DLY YLD ',
      '  DGSGD  ',
      '  GS  G  ',
    ];
    // ── small walk 2 ────────────────────────────────────────────────────────
    const smallWalk2 = [
      '  DBBBD  ',
      ' DBVVVBD ',
      ' DBWKWBD ',
      ' DBVVVBD ',
      '  DYYYD  ',
      ' DLBBBLD ',
      ' DLY YLD ',
      '  DGSGD  ',
      '  G  GS  ',
    ];
    // ── small jump ──────────────────────────────────────────────────────────
    const smallJump = [
      '  DBBBD  ',
      ' DBVVVBD ',
      ' DBWKWBD ',
      ' DBVVVBD ',
      '  DYYYD  ',
      ' DLBBBLD ',
      ' DGY YGD ',
      ' GS   SG ',
      '         ',
    ];
    // ── big idle (11 × 16) ──────────────────────────────────────────────────
    const bigIdle = [
      '   DBBBD   ',
      '  DBBBBBBD ',
      ' DBVVVVVBD ',
      ' DBWKKWBBD ',
      ' DBVVVVVBD ',
      '  DYYYYYD  ',
      ' DLBBBBBLD ',
      ' DLBBBBBLD ',
      ' DLBBBBBLD ',
      '  DYYYYYD  ',
      ' DLBBBBBLD ',
      ' DLY   YLD ',
      ' DGSSSSGD  ',
      '  GSSSSSG  ',
      '  GS   SG  ',
      '           ',
    ];
    // ── big walk 1 ──────────────────────────────────────────────────────────
    const bigWalk1 = [
      '   DBBBD   ',
      '  DBBBBBBD ',
      ' DBVVVVVBD ',
      ' DBWKKWBBD ',
      ' DBVVVVVBD ',
      '  DYYYYYD  ',
      ' DLBBBBBLD ',
      ' DLBBBBBLD ',
      ' DLBBBBBLD ',
      '  DYYYYYD  ',
      ' DLBBBBBLD ',
      '  DGY YGD  ',
      '  GSSSSSG  ',
      '  GS   SG  ',
      '  GS       ',
      '           ',
    ];
    // ── big walk 2 ──────────────────────────────────────────────────────────
    const bigWalk2 = [
      '   DBBBD   ',
      '  DBBBBBBD ',
      ' DBVVVVVBD ',
      ' DBWKKWBBD ',
      ' DBVVVVVBD ',
      '  DYYYYYD  ',
      ' DLBBBBBLD ',
      ' DLBBBBBLD ',
      ' DLBBBBBLD ',
      '  DYYYYYD  ',
      ' DLBBBBBLD ',
      '  DGY YGD  ',
      '  GSSSSSG  ',
      '  GS   SG  ',
      '       GS  ',
      '           ',
    ];
    // ── big jump ────────────────────────────────────────────────────────────
    const bigJump = [
      '   DBBBD   ',
      '  DBBBBBBD ',
      ' DBVVVVVBD ',
      ' DBWKKWBBD ',
      ' DBVVVVVBD ',
      '  DYYYYYD  ',
      ' DLBBBBBLD ',
      ' DLBBBBBLD ',
      ' DLBBBBBLD ',
      '  DYYYYYD  ',
      ' DLBBBBBLD ',
      ' DGG   GGD ',
      ' GSS   SSG ',
      '           ',
      '           ',
      '           ',
    ];
    // ── dead ────────────────────────────────────────────────────────────────
    const dead = [
      '  DBBBD  ',
      ' DBWKWBD ',
      ' DBBBBBD ',
      ' DBBBBBD ',
      '  DRRRD  ',
      '  DRRRD  ',
      ' DBBBBBD ',
      '  DGGGGD ',
      '  GG  GG ',
    ];

    // Star (invincibility) – golden override
    const starP = {
      ...P, B: '#FFD700', D: '#B8860B', V: '#FFF9C4',
      L: '#FFE57F', Y: '#FF6D00', G: '#CC7000', S: '#E65100'
    };

    const scale = 2;
    const sw = 9 * scale, sh = 9 * scale;
    const bw = 11 * scale, bh = 16 * scale;

    [
      ['player_idle',      sw, sh,  (c) => this.pixelArt(c, smallIdle,  P, scale)],
      ['player_walk1',     sw, sh,  (c) => this.pixelArt(c, smallWalk1, P, scale)],
      ['player_walk2',     sw, sh,  (c) => this.pixelArt(c, smallWalk2, P, scale)],
      ['player_jump',      sw, sh,  (c) => this.pixelArt(c, smallJump,  P, scale)],
      ['player_dead',      sw, sh,  (c) => this.pixelArt(c, dead,       P, scale)],
      ['player_star_idle', sw, sh,  (c) => this.pixelArt(c, smallIdle,  starP, scale)],
      ['player_big_idle',  bw, bh,  (c) => this.pixelArt(c, bigIdle,   P, scale)],
      ['player_big_walk1', bw, bh,  (c) => this.pixelArt(c, bigWalk1,  P, scale)],
      ['player_big_walk2', bw, bh,  (c) => this.pixelArt(c, bigWalk2,  P, scale)],
      ['player_big_jump',  bw, bh,  (c) => this.pixelArt(c, bigJump,   P, scale)],
      ['player_big_star',  bw, bh,  (c) => this.pixelArt(c, bigIdle,   starP, scale)],
    ].forEach(([key, w, h, fn]) => this.makeTexture(key, w, h, fn));
  }

  /* ====================== ENEMIES ====================== */
  createEnemyTextures() {
    // GLOOP – slime, green with sheen
    const GP = {
      G: '#43A047', D: '#1B5E20', W: '#FFFFFF', K: '#0A1A0A',
      L: '#76C442', H: '#A5D6A7', F: '#EF5350', ' ': null
    };
    const gloopWalk1 = [
      '  DDDDD  ',
      ' DGLLLGD ',
      ' DGWHWGD ',
      ' DGLLLGD ',
      ' DGGGGGD ',
      '  DDDDD  ',
      ' DG   GD ',
      ' DD   DD ',
    ];
    const gloopWalk2 = [
      '  DDDDD  ',
      ' DGLLLGD ',
      ' DGWHWGD ',
      ' DGLLLGD ',
      ' DGGGGGD ',
      '  DDDDD  ',
      ' DG   GD ',
      '  DD  DD ',
    ];
    const gloopFlat = [
      '         ',
      'DDDDDDDDD',
      'DGLHHLGDD',
      'DGWHWGDDD',
      'DDDDDDDDD',
      '         ',
      '         ',
      '         ',
    ];

    // SHELLIE – crab with shell, red
    const SP = {
      R: '#D32F2F', D: '#7F0000', W: '#FFFFFF', K: '#0A0000',
      O: '#FF6D00', C: '#BF360C', P: '#FFCDD2', ' ': null
    };
    const shellieWalk1 = [
      'D     D  ',
      'DRRRRRD  ',
      'DRWKWRD  ',
      'DRRRRRD  ',
      'DRORORD  ',
      'DRRRRRD  ',
      'D D D D  ',
      ' D   D   ',
    ];
    const shellieWalk2 = [
      '  D     D',
      '  DRRRRRD',
      '  DRWKWRD',
      '  DRRRRRD',
      '  DRORORD',
      '  DRRRRRD',
      '  D D D D',
      '   D   D ',
    ];
    const shellieShell = [
      '  DDDD   ',
      ' DRRRRD  ',
      'DRRPPRD  ',
      'DRPWPRD  ',
      'DRRPPRD  ',
      ' DRRRRD  ',
      '  DDDD   ',
      '         ',
    ];

    // BATLING – bat, purple
    const BP = {
      V: '#7B1FA2', D: '#4A148C', W: '#FFFFFF', K: '#0D0014',
      L: '#CE93D8', P: '#E1BEE7', H: '#F3E5F5', ' ': null
    };
    const batWalk1 = [
      'D     D  ',
      'DLVVVLD  ',
      'DLWKVLD  ',
      'DLVVVLD  ',
      'PPPPPPPP ',
      'LPPPPPPL ',
      ' HPPPH   ',
      '         ',
    ];
    const batWalk2 = [
      '   D     ',
      '   DLVVVL',
      '   DLWKVL',
      '   DLVVVL',
      ' PPPPPPPP',
      ' LPPPPPPLL',
      '  HPPPPH ',
      '         ',
    ];

    const s = 2;
    [
      ['gloop_walk1',   8*s, 8*s, (c) => this.pixelArt(c, gloopWalk1,   GP, s)],
      ['gloop_walk2',   8*s, 8*s, (c) => this.pixelArt(c, gloopWalk2,   GP, s)],
      ['gloop_flat',    8*s, 8*s, (c) => this.pixelArt(c, gloopFlat,    GP, s)],
      ['shellie_walk1', 9*s, 8*s, (c) => this.pixelArt(c, shellieWalk1, SP, s)],
      ['shellie_walk2', 9*s, 8*s, (c) => this.pixelArt(c, shellieWalk2, SP, s)],
      ['shellie_shell', 9*s, 8*s, (c) => this.pixelArt(c, shellieShell, SP, s)],
      ['batling_walk1', 9*s, 8*s, (c) => this.pixelArt(c, batWalk1,     BP, s)],
      ['batling_walk2', 9*s, 8*s, (c) => this.pixelArt(c, batWalk2,     BP, s)],
    ].forEach(([key, w, h, fn]) => this.makeTexture(key, w, h, fn));
  }

  /* ====================== TILES ====================== */
  createTileTextures() {
    const T = 32;

    // ── GROUND (grassland) – detailed grass + layered dirt ─────────────────
    this.makeTexture('tile_ground', T, T, (ctx) => {
      // Dirt base
      ctx.fillStyle = '#6D4C41';
      ctx.fillRect(0, 0, T, T);
      // Dirt mid-layer
      ctx.fillStyle = '#795548';
      ctx.fillRect(0, 10, T, T - 10);
      // Pebble/rock patches
      ctx.fillStyle = '#5D4037';
      ctx.fillRect(4, 14, 5, 4);
      ctx.fillRect(18, 20, 4, 3);
      ctx.fillRect(24, 13, 3, 4);
      ctx.fillRect(9, 24, 6, 3);
      // Light pebble highlight
      ctx.fillStyle = '#8D6E63';
      ctx.fillRect(5, 15, 2, 2);
      ctx.fillRect(19, 21, 2, 2);
      // Grass layer – dark edge
      ctx.fillStyle = '#2E7D32';
      ctx.fillRect(0, 7, T, 4);
      // Grass main
      ctx.fillStyle = '#43A047';
      ctx.fillRect(0, 0, T, 8);
      // Grass highlight stripe
      ctx.fillStyle = '#66BB6A';
      ctx.fillRect(0, 0, T, 4);
      // Top shimmer
      ctx.fillStyle = '#A5D6A7';
      ctx.fillRect(0, 0, T, 1);
      // Grass blades (individual bright strokes)
      ctx.fillStyle = '#81C784';
      [1, 5, 10, 15, 20, 26].forEach(x => {
        ctx.fillRect(x, 1, 2, 5);
      });
      // Horizontal mortar line
      ctx.fillStyle = '#4E342E';
      ctx.fillRect(0, 9, T, 1);
      ctx.fillRect(0, 20, T, 1);
      // Vertical mortar
      ctx.fillRect(T / 2, 10, 1, 10);
      ctx.fillRect(4, 21, 1, T - 21);
      ctx.fillRect(T - 4, 21, 1, T - 21);
    });

    // ── GROUND (cave) ────────────────────────────────────────────────────────
    this.makeTexture('tile_ground_cave', T, T, (ctx) => {
      ctx.fillStyle = '#263238';
      ctx.fillRect(0, 0, T, T);
      ctx.fillStyle = '#37474F';
      ctx.fillRect(0, 0, T, T);
      // Rock highlights
      ctx.fillStyle = '#455A64';
      ctx.fillRect(2, 4, 8, 5);
      ctx.fillRect(18, 10, 6, 4);
      ctx.fillRect(8, 20, 10, 5);
      ctx.fillStyle = '#546E7A';
      ctx.fillRect(3, 5, 3, 2);
      ctx.fillRect(19, 11, 3, 2);
      // mortar lines
      ctx.fillStyle = '#212121';
      ctx.fillRect(0, 10, T, 1);
      ctx.fillRect(0, 21, T, 1);
      ctx.fillRect(T/2, 11, 1, 10);
      ctx.fillRect(5, 22, 1, T - 22);
      ctx.fillRect(T-5, 22, 1, T - 22);
      // Top edge highlight
      ctx.fillStyle = '#607D8B';
      ctx.fillRect(0, 0, T, 2);
    });

    // ── GROUND (sky / clouds world) ──────────────────────────────────────────
    this.makeTexture('tile_ground_sky', T, T, (ctx) => {
      ctx.fillStyle = '#CE93D8';
      ctx.fillRect(0, 0, T, T);
      ctx.fillStyle = '#E1BEE7';
      ctx.fillRect(0, 0, T, 8);
      // Shimmer
      ctx.fillStyle = '#F3E5F5';
      ctx.fillRect(0, 0, T, 3);
      ctx.fillStyle = '#BA68C8';
      ctx.fillRect(0, 8, T, 2);
      ctx.fillRect(0, 20, T, 1);
      ctx.fillRect(T/2, 10, 1, 10);
      // Stars/gems inside
      ctx.fillStyle = '#FFFFFF';
      [[4,14],[16,18],[24,12],[10,25]].forEach(([x,y]) => {
        ctx.fillRect(x, y, 2, 2);
      });
    });

    // ── BRICK ────────────────────────────────────────────────────────────────
    this.makeTexture('tile_brick', T, T, (ctx) => {
      // Base
      ctx.fillStyle = '#B71C1C';
      ctx.fillRect(0, 0, T, T);
      // Brick faces (lighter)
      ctx.fillStyle = '#D32F2F';
      // Top row bricks
      ctx.fillRect(1, 1, T/2-2, T/2-2);
      ctx.fillRect(T/2+1, 1, T/2-2, T/2-2);
      // Bottom row (offset half-brick)
      ctx.fillRect(1, T/2+1, T/4-2, T/2-2);
      ctx.fillRect(T/4+1, T/2+1, T/2-2, T/2-2);
      ctx.fillRect(T*3/4+1, T/2+1, T/4-2, T/2-2);
      // Highlight top-left of each brick
      ctx.fillStyle = '#EF5350';
      ctx.fillRect(2, 2, T/2-4, 3);
      ctx.fillRect(T/2+2, 2, T/2-4, 3);
      ctx.fillRect(2, T/2+2, T/4-4, 3);
      ctx.fillRect(T/4+2, T/2+2, T/2-4, 3);
      ctx.fillRect(T*3/4+2, T/2+2, T/4-4, 3);
      // Mortar (dark)
      ctx.fillStyle = '#7F0000';
      ctx.fillRect(0, T/2-1, T, 3);
      ctx.fillRect(T/2-1, 0, 3, T/2-1);
      ctx.fillRect(T/4-1, T/2+2, 3, T/2-2);
      ctx.fillRect(T*3/4-1, T/2+2, 3, T/2-2);
    });

    // ── QUESTION BLOCK ───────────────────────────────────────────────────────
    this.makeTexture('tile_question', T, T, (ctx) => {
      // Base gold
      ctx.fillStyle = '#F57F17';
      ctx.fillRect(0, 0, T, T);
      // Inner panel
      ctx.fillStyle = '#FF8F00';
      ctx.fillRect(3, 3, T-6, T-6);
      // Shiny top-left bevel
      ctx.fillStyle = '#FFCA28';
      ctx.fillRect(3, 3, T-6, 4);
      ctx.fillRect(3, 3, 4, T-6);
      // Dark bottom-right bevel
      ctx.fillStyle = '#E65100';
      ctx.fillRect(3, T-7, T-6, 4);
      ctx.fillRect(T-7, 3, 4, T-6);
      // Outer border
      ctx.fillStyle = '#BF360C';
      ctx.fillRect(0, 0, T, 3);
      ctx.fillRect(0, T-3, T, 3);
      ctx.fillRect(0, 0, 3, T);
      ctx.fillRect(T-3, 0, 3, T);
      // "?" mark
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 19px "Arial Black", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', T/2, T/2 + 1);
      // Soft glow at top
      ctx.fillStyle = 'rgba(255,255,200,0.25)';
      ctx.fillRect(4, 4, T-8, 6);
    });

    // ── EMPTY BLOCK ──────────────────────────────────────────────────────────
    this.makeTexture('tile_empty', T, T, (ctx) => {
      ctx.fillStyle = '#E65100';
      ctx.fillRect(0, 0, T, T);
      ctx.fillStyle = '#BF360C';
      ctx.fillRect(3, 3, T-6, T-6);
      ctx.fillStyle = '#D84315';
      ctx.fillRect(3, 3, T-6, 4);
      ctx.fillRect(3, 3, 4, T-6);
      ctx.fillStyle = '#4E1A00';
      ctx.fillRect(4, T-7, T-8, 3);
      ctx.fillRect(T-7, 4, 3, T-11);
      ctx.fillStyle = '#BF360C';
      ctx.fillRect(0, 0, T, 3); ctx.fillRect(0, T-3, T, 3);
      ctx.fillRect(0, 0, 3, T); ctx.fillRect(T-3, 0, 3, T);
    });

    // ── PLATFORM ─────────────────────────────────────────────────────────────
    this.makeTexture('tile_platform', T, 16, (ctx) => {
      ctx.fillStyle = '#546E7A';
      ctx.fillRect(0, 0, T, 16);
      // Top surface highlight
      ctx.fillStyle = '#B0BEC5';
      ctx.fillRect(0, 0, T, 5);
      ctx.fillStyle = '#CFD8DC';
      ctx.fillRect(0, 0, T, 2);
      // Edge groove
      ctx.fillStyle = '#37474F';
      ctx.fillRect(0, 5, T, 2);
      // Side rivet dots
      ctx.fillStyle = '#90A4AE';
      [4, T/2, T-6].forEach(x => ctx.fillRect(x, 8, 3, 4));
    });

    // ── PIPE TOP ─────────────────────────────────────────────────────────────
    this.makeTexture('pipe_top', 40, 32, (ctx) => {
      ctx.fillStyle = '#1B5E20';
      ctx.fillRect(0, 0, 40, 32);
      ctx.fillStyle = '#2E7D32';
      ctx.fillRect(2, 2, 36, 28);
      // Highlights
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(4, 3, 10, 26);
      ctx.fillStyle = '#66BB6A';
      ctx.fillRect(5, 3, 4, 26);
      // Rim line
      ctx.fillStyle = '#33691E';
      ctx.fillRect(0, 6, 40, 2);
      ctx.fillRect(0, 22, 40, 2);
    });

    // ── PIPE BODY ────────────────────────────────────────────────────────────
    this.makeTexture('pipe_body', 32, 32, (ctx) => {
      ctx.fillStyle = '#1B5E20';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#2E7D32';
      ctx.fillRect(2, 0, 28, 32);
      ctx.fillStyle = '#388E3C';
      ctx.fillRect(4, 0, 12, 32);
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(5, 0, 5, 32);
      ctx.fillStyle = '#A5D6A7';
      ctx.fillRect(6, 0, 2, 32);
    });

    // ── COIN (collectible) ────────────────────────────────────────────────────
    this.makeTexture('coin', 16, 16, (ctx) => {
      // Outer ring
      ctx.fillStyle = '#F9A825';
      ctx.beginPath(); ctx.arc(8, 8, 7, 0, Math.PI * 2); ctx.fill();
      // Inner face
      ctx.fillStyle = '#FFD740';
      ctx.beginPath(); ctx.arc(8, 8, 5.5, 0, Math.PI * 2); ctx.fill();
      // Shine
      ctx.fillStyle = '#FFFF8D';
      ctx.beginPath(); ctx.arc(6, 5, 2, 0, Math.PI * 2); ctx.fill();
      // Symbol
      ctx.fillStyle = '#E65100';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('$', 8, 9);
    });

    // ── FLAG POLE ─────────────────────────────────────────────────────────────
    this.makeTexture('flag_pole', 8, 320, (ctx) => {
      // Shaded pole
      ctx.fillStyle = '#9E9E9E';
      ctx.fillRect(3, 0, 2, 320);
      ctx.fillStyle = '#BDBDBD';
      ctx.fillRect(3, 0, 1, 320);
      // Ball on top
      ctx.fillStyle = '#FFD700';
      ctx.beginPath(); ctx.arc(4, 6, 5, 0, Math.PI * 2); ctx.fill();
    });

    // ── FLAG ─────────────────────────────────────────────────────────────────
    this.makeTexture('flag', 32, 24, (ctx) => {
      ctx.fillStyle = '#D32F2F';
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(32,12); ctx.lineTo(0,24); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#FF5252';
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(32,12); ctx.lineTo(0,8); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#FFFF33';
      ctx.beginPath(); ctx.moveTo(4,6); ctx.lineTo(16,12); ctx.lineTo(4,18); ctx.closePath(); ctx.fill();
    });

    // ── CASTLE ────────────────────────────────────────────────────────────────
    this.makeTexture('castle', 96, 96, (ctx) => {
      // Base
      ctx.fillStyle = '#757575';
      ctx.fillRect(0, 32, 96, 64);
      // Battlements
      [[0,16,20,32],[32,16,20,32],[64,16,20,32]].forEach(([x,y,w,h]) => {
        ctx.fillStyle = '#757575';
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = '#9E9E9E';
        ctx.fillRect(x, y, w, 4);
      });
      ctx.fillStyle = '#9E9E9E';
      ctx.fillRect(0, 32, 96, 4);
      // Gate
      ctx.fillStyle = '#212121';
      ctx.fillRect(32, 56, 32, 40);
      // Gate arch top
      ctx.beginPath(); ctx.arc(48, 56, 16, Math.PI, 0); ctx.fill();
      // Windows
      ctx.fillStyle = '#212121';
      ctx.fillRect(10, 42, 14, 14);
      ctx.fillRect(72, 42, 14, 14);
      // Window light
      ctx.fillStyle = '#FFF176';
      ctx.fillRect(12, 44, 10, 10);
      ctx.fillRect(74, 44, 10, 10);
      // Stone seams
      ctx.fillStyle = '#616161';
      for (let y = 36; y < 96; y += 10) ctx.fillRect(0, y, 96, 1);
      for (let x = 12; x < 96; x += 16) ctx.fillRect(x, 36, 1, 60);
    });
  }

  /* ====================== POWER-UPS ====================== */
  createPowerUpTextures() {
    // MUSHROOM
    this.makeTexture('powerup_mushroom', 28, 28, (ctx) => {
      // Stem
      ctx.fillStyle = '#FFF8E1';
      ctx.fillRect(6, 14, 16, 12);
      ctx.fillStyle = '#F5F5F5';
      ctx.fillRect(7, 15, 6, 10);
      // Cap
      ctx.fillStyle = '#C62828';
      ctx.beginPath(); ctx.arc(14, 13, 12, Math.PI, 0); ctx.fill();
      // Cap sheen
      ctx.fillStyle = '#EF5350';
      ctx.beginPath(); ctx.arc(10, 9, 5, Math.PI, 0); ctx.fill();
      // Spots
      ctx.fillStyle = '#FFFFFF';
      [[8,7,3.5],[18,7,3.5],[14,4,2.5]].forEach(([x,y,r]) => {
        ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
      });
      // Eyes
      ctx.fillStyle = '#111';
      [[10,20],[18,20]].forEach(([x,y]) => {
        ctx.beginPath(); ctx.arc(x,y,2,0,Math.PI*2); ctx.fill();
      });
      // Stem groove
      ctx.fillStyle = '#E0E0E0';
      ctx.fillRect(14, 15, 2, 10);
    });

    // STAR (invincibility)
    this.makeTexture('powerup_star', 28, 28, (ctx) => {
      // Outer star
      ctx.fillStyle = '#F9A825';
      this._drawStar(ctx, 14, 14, 5, 13, 5.5);
      // Inner glow
      ctx.fillStyle = '#FFD740';
      this._drawStar(ctx, 14, 14, 5, 10, 4);
      // Shine
      ctx.fillStyle = '#FFFF8D';
      ctx.beginPath(); ctx.arc(10, 9, 3, 0, Math.PI*2); ctx.fill();
      // Eyes
      ctx.fillStyle = '#111';
      [[11,16],[17,16]].forEach(([x,y]) => {
        ctx.beginPath(); ctx.arc(x,y,2,0,Math.PI*2); ctx.fill();
      });
      ctx.fillStyle = '#E65100';
      ctx.beginPath(); ctx.arc(14,19,2,0,Math.PI); ctx.stroke();
    });

    // FIRE FLOWER
    this.makeTexture('powerup_flower', 28, 28, (ctx) => {
      ctx.strokeStyle = '#2E7D32'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(14,28); ctx.lineTo(14,15); ctx.stroke();
      const colors = ['#E53935','#FF7043','#FFCA28','#66BB6A'];
      [[14,8],[8,14],[14,20],[20,14]].forEach(([x,y],i) => {
        ctx.fillStyle = colors[i];
        ctx.beginPath(); ctx.arc(x,y,5,0,Math.PI*2); ctx.fill();
      });
      ctx.fillStyle = '#FFF9C4';
      ctx.beginPath(); ctx.arc(14,14,5,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = '#FF8F00';
      ctx.beginPath(); ctx.arc(14,14,3,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = '#111';
      [[12,14],[16,14]].forEach(([x,y]) => {
        ctx.beginPath(); ctx.arc(x,y,1.2,0,Math.PI*2); ctx.fill();
      });
    });
  }

  _drawStar(ctx, cx, cy, n, r1, r2) {
    ctx.beginPath();
    for (let i = 0; i < n * 2; i++) {
      const a = (i * Math.PI) / n - Math.PI / 2;
      const r = i % 2 === 0 ? r1 : r2;
      if (i === 0) ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
      else ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
    }
    ctx.closePath(); ctx.fill();
  }

  /* ====================== UI ====================== */
  createUITextures() {
    // Heart
    this.makeTexture('ui_heart', 20, 20, (ctx) => {
      ctx.fillStyle = '#E53935';
      ctx.beginPath();
      ctx.moveTo(10,16);
      ctx.bezierCurveTo(10,16,2,10,2,6);
      ctx.arc(5.5,5,3.5,Math.PI,0);
      ctx.arc(13.5,5,3.5,Math.PI,0);
      ctx.bezierCurveTo(18,10,10,16,10,16);
      ctx.fill();
      // Shine
      ctx.fillStyle = '#FF8A80';
      ctx.beginPath(); ctx.arc(7,6,2.5,0,Math.PI*2); ctx.fill();
    });

    // Coin icon (HUD)
    this.makeTexture('ui_coin', 16, 16, (ctx) => {
      ctx.fillStyle = '#F9A825';
      ctx.beginPath(); ctx.arc(8,8,7,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = '#FFD740';
      ctx.beginPath(); ctx.arc(8,8,5,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = '#FFFF8D';
      ctx.beginPath(); ctx.arc(6,5,2,0,Math.PI*2); ctx.fill();
    });

    // Button background
    this.makeTexture('btn_normal', 200, 48, (ctx) => {
      ctx.fillStyle = '#1565C0';
      ctx.fillRect(0, 0, 200, 48);
      ctx.fillStyle = '#1976D2';
      ctx.fillRect(2, 2, 196, 44);
      ctx.fillStyle = '#42A5F5';
      ctx.fillRect(2, 2, 196, 5);
      ctx.fillStyle = '#0D47A1';
      ctx.fillRect(2, 41, 196, 5);
    });
  }

  /* ====================== BACKGROUNDS ====================== */
  createBackgroundTextures() {
    // SKY
    this.makeTexture('bg_sky', 800, 480, (ctx) => {
      const g = ctx.createLinearGradient(0, 0, 0, 480);
      g.addColorStop(0,   '#29B6F6');
      g.addColorStop(0.6, '#81D4FA');
      g.addColorStop(1,   '#B3E5FC');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 800, 480);
      // Sun
      ctx.fillStyle = 'rgba(255,250,180,0.85)';
      ctx.beginPath(); ctx.arc(720, 60, 36, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = 'rgba(255,245,100,0.40)';
      ctx.beginPath(); ctx.arc(720, 60, 52, 0, Math.PI*2); ctx.fill();
    });

    // CAVE
    this.makeTexture('bg_cave', 800, 480, (ctx) => {
      const g = ctx.createLinearGradient(0, 0, 0, 480);
      g.addColorStop(0, '#1A1A2E'); g.addColorStop(1, '#263238');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 800, 480);
      // Stalactites
      ctx.fillStyle = '#37474F';
      for (let i = 0; i < 14; i++) {
        const x = i * 58 + 8;
        const h = 28 + (i % 3) * 18;
        ctx.beginPath();
        ctx.moveTo(x, 0); ctx.lineTo(x + 8, h); ctx.lineTo(x + 18, 0);
        ctx.fill();
        ctx.fillStyle = '#455A64';
        ctx.fillRect(x + 3, 0, 4, h - 8);
        ctx.fillStyle = '#37474F';
      }
      // Glowing lava spots at bottom
      const lava = ctx.createLinearGradient(0, 420, 0, 480);
      lava.addColorStop(0, 'rgba(180,0,0,0)');
      lava.addColorStop(1, 'rgba(255,80,0,0.25)');
      ctx.fillStyle = lava; ctx.fillRect(0, 420, 800, 60);
    });

    // SKY WORLD
    this.makeTexture('bg_skyworld', 800, 480, (ctx) => {
      const g = ctx.createLinearGradient(0, 0, 0, 480);
      g.addColorStop(0,   '#1A237E');
      g.addColorStop(0.4, '#6A1B9A');
      g.addColorStop(0.8, '#AD1457');
      g.addColorStop(1,   '#C2185B');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 800, 480);
      // Stars
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      [[50,30],[120,80],[300,25],[450,65],[600,15],[720,85],
       [75,140],[240,120],[500,150],[660,130],[750,45],
       [180,55],[380,100],[530,40],[680,90]].forEach(([x,y]) => {
        ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI*2); ctx.fill();
      });
      // Large planet/moon
      ctx.fillStyle = 'rgba(180,140,255,0.30)';
      ctx.beginPath(); ctx.arc(100, 100, 50, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = 'rgba(220,180,255,0.20)';
      ctx.beginPath(); ctx.arc(100, 100, 70, 0, Math.PI*2); ctx.fill();
    });

    // CLOUD
    this.makeTexture('cloud', 96, 48, (ctx) => {
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      [[24,32,20],[48,22,26],[72,30,18]].forEach(([x,y,r]) => {
        ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
      });
      ctx.fillRect(4, 32, 88, 16);
      // Shading
      ctx.fillStyle = 'rgba(200,220,255,0.5)';
      ctx.fillRect(4, 40, 88, 8);
    });

    // HILL
    this.makeTexture('hill', 96, 64, (ctx) => {
      ctx.fillStyle = '#2E7D32';
      ctx.beginPath(); ctx.moveTo(0,64); ctx.quadraticCurveTo(48,0,96,64); ctx.fill();
      ctx.fillStyle = '#43A047';
      ctx.beginPath(); ctx.moveTo(8,64); ctx.quadraticCurveTo(48,6,88,64); ctx.fill();
      ctx.fillStyle = '#66BB6A';
      ctx.beginPath(); ctx.moveTo(20,64); ctx.quadraticCurveTo(48,14,76,64); ctx.fill();
    });

    // BUSH
    this.makeTexture('bush', 64, 32, (ctx) => {
      ctx.fillStyle = '#1B5E20';
      [[14,24,13],[32,18,16],[50,24,13]].forEach(([x,y,r]) => {
        ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
      });
      ctx.fillStyle = '#2E7D32';
      [[14,22,8],[32,16,11],[50,22,8]].forEach(([x,y,r]) => {
        ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
      });
      ctx.fillStyle = '#43A047';
      [[14,20,4],[32,14,6],[50,20,4]].forEach(([x,y,r]) => {
        ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
      });
    });

    // CAVE ROCK
    this.makeTexture('cave_rock', 48, 32, (ctx) => {
      ctx.fillStyle = '#455A64';
      ctx.beginPath(); ctx.arc(24,28,22,Math.PI,0); ctx.fill();
      ctx.fillRect(2, 28, 44, 4);
      ctx.fillStyle = '#607D8B';
      ctx.beginPath(); ctx.arc(18,24,8,Math.PI,0); ctx.fill();
      ctx.fillStyle = '#78909C';
      ctx.fillRect(16, 19, 4, 4);
    });
  }

  /* ====================== EFFECTS ====================== */
  createEffectTextures() {
    this.makeTexture('particle_dust', 8, 8, (ctx) => {
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.beginPath(); ctx.arc(4,4,3,0,Math.PI*2); ctx.fill();
    });

    this.makeTexture('particle_coin', 12, 12, (ctx) => {
      ctx.fillStyle = '#FFD740';
      ctx.beginPath(); ctx.arc(6,6,5,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = '#FFFF8D';
      ctx.beginPath(); ctx.arc(4,4,2,0,Math.PI*2); ctx.fill();
    });

    this.makeTexture('particle_star', 12, 12, (ctx) => {
      ctx.fillStyle = '#FFD600';
      this._drawStar(ctx, 6, 6, 5, 5, 2);
      ctx.fillStyle = '#FFFF8D';
      ctx.beginPath(); ctx.arc(5,4,1.5,0,Math.PI*2); ctx.fill();
    });

    this.makeTexture('brick_frag', 8, 8, (ctx) => {
      ctx.fillStyle = '#B71C1C';
      ctx.fillRect(0, 0, 8, 8);
      ctx.fillStyle = '#EF5350';
      ctx.fillRect(1, 1, 4, 4);
      ctx.fillStyle = '#7F0000';
      ctx.fillRect(4, 4, 4, 4);
    });

    this.makeTexture('score_popup', 48, 24, (ctx) => {
      ctx.clearRect(0, 0, 48, 24);
    });
  }
}
