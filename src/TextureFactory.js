/**
 * TextureFactory - Generates all game textures procedurally
 * No external image assets required.
 */
class TextureFactory {
  constructor(scene) {
    this.scene = scene;
  }

  // Helper: create a canvas texture
  makeTexture(key, w, h, drawFn) {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    drawFn(ctx, w, h);
    this.scene.textures.addCanvas(key, canvas);
  }

  // Helper: pixel art from 2D char array
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
    const P = {
      // small Hoppy
      B: '#2277DD', D: '#0044AA', W: '#FFFFFF', K: '#111133',
      S: '#88CCFF', Y: '#FFDD22', G: '#555577', ' ': null,
      R: '#FF4444', O: '#FFAA22', T: '#DDDDFF'
    };

    // SMALL IDLE
    const smallIdle = [
      '  DBBBD  ',
      ' DBSSSBD ',
      ' DBWKWBD ',
      ' DBBBBBD ',
      '  DYYYD  ',
      ' DBBBBBD ',
      ' DB  BBD ',
      ' DGGGGD  ',
      '  GG  G  ',
    ];

    // SMALL WALK 1
    const smallWalk1 = [
      '  DBBBD  ',
      ' DBSSSBD ',
      ' DBWKWBD ',
      ' DBBBBBD ',
      '  DYYYD  ',
      ' DBBBBBD ',
      '  DB BB  ',
      '  GG GG  ',
      '  G      ',
    ];

    // SMALL WALK 2
    const smallWalk2 = [
      '  DBBBD  ',
      ' DBSSSBD ',
      ' DBWKWBD ',
      ' DBBBBBD ',
      '  DYYYD  ',
      ' DBBBBBD ',
      '  DB BB  ',
      '  GG GG  ',
      '      G  ',
    ];

    // SMALL JUMP
    const smallJump = [
      '  DBBBD  ',
      ' DBSSSBD ',
      ' DBWKWBD ',
      ' DBBBBBD ',
      '  DYYYD  ',
      ' DBBBBBD ',
      ' DG  GBD ',
      ' GG  GG  ',
      '         ',
    ];

    // BIG IDLE (16 rows)
    const bigIdle = [
      '   DBBBD   ',
      '  DBBBBBBD ',
      ' DBSSSSSBD ',
      ' DBWKKWBBD ',
      ' DBBBBBBBD ',
      '  DYYYYYD  ',
      ' DBBBBBBBD ',
      ' DBBBBBBBD ',
      ' DBBBBBBBD ',
      '  DYYYYYD  ',
      ' DBBBBBBBD ',
      ' DB     BD ',
      ' DGGGGGGD  ',
      '  GGG GGG  ',
      '  GGG GGG  ',
      '           ',
    ];

    // BIG WALK 1
    const bigWalk1 = [
      '   DBBBD   ',
      '  DBBBBBBD ',
      ' DBSSSSSBD ',
      ' DBWKKWBBD ',
      ' DBBBBBBBD ',
      '  DYYYYYD  ',
      ' DBBBBBBBD ',
      ' DBBBBBBBD ',
      ' DBBBBBBBD ',
      '  DYYYYYD  ',
      ' DBBBBBBBD ',
      '  DB   BD  ',
      '  GGG GGG  ',
      '  GGG GGG  ',
      '  GGG      ',
      '           ',
    ];

    // BIG WALK 2
    const bigWalk2 = [
      '   DBBBD   ',
      '  DBBBBBBD ',
      ' DBSSSSSBD ',
      ' DBWKKWBBD ',
      ' DBBBBBBBD ',
      '  DYYYYYD  ',
      ' DBBBBBBBD ',
      ' DBBBBBBBD ',
      ' DBBBBBBBD ',
      '  DYYYYYD  ',
      ' DBBBBBBBD ',
      '  DB   BD  ',
      '  GGG GGG  ',
      '  GGG GGG  ',
      '      GGG  ',
      '           ',
    ];

    // BIG JUMP
    const bigJump = [
      '   DBBBD   ',
      '  DBBBBBBD ',
      ' DBSSSSSBD ',
      ' DBWKKWBBD ',
      ' DBBBBBBBD ',
      '  DYYYYYD  ',
      ' DBBBBBBBD ',
      ' DBBBBBBBD ',
      ' DBBBBBBBD ',
      '  DYYYYYD  ',
      ' DBBBBBBBD ',
      ' DGG   GGD ',
      ' GGG   GGG ',
      '           ',
      '           ',
      '           ',
    ];

    // DEAD (spinning star)
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

    // Star (invincibility) flash - golden
    const starP = { ...P, B: '#FFD700', D: '#CC8800', S: '#FFF176', Y: '#FF8800', G: '#CC6600' };

    const scale = 2;
    const sw = 9 * scale, sh = 9 * scale;
    const bw = 11 * scale, bh = 16 * scale;

    [
      ['player_idle',    sw, sh,  (c) => this.pixelArt(c, smallIdle,  P, scale)],
      ['player_walk1',   sw, sh,  (c) => this.pixelArt(c, smallWalk1, P, scale)],
      ['player_walk2',   sw, sh,  (c) => this.pixelArt(c, smallWalk2, P, scale)],
      ['player_jump',    sw, sh,  (c) => this.pixelArt(c, smallJump,  P, scale)],
      ['player_dead',    sw, sh,  (c) => this.pixelArt(c, dead,       P, scale)],
      ['player_star_idle',  sw, sh, (c) => this.pixelArt(c, smallIdle,  starP, scale)],
      ['player_big_idle',  bw, bh, (c) => this.pixelArt(c, bigIdle,  P, scale)],
      ['player_big_walk1', bw, bh, (c) => this.pixelArt(c, bigWalk1, P, scale)],
      ['player_big_walk2', bw, bh, (c) => this.pixelArt(c, bigWalk2, P, scale)],
      ['player_big_jump',  bw, bh, (c) => this.pixelArt(c, bigJump,  P, scale)],
      ['player_big_star',  bw, bh, (c) => this.pixelArt(c, bigIdle,  starP, scale)],
    ].forEach(([key, w, h, fn]) => {
      this.makeTexture(key, w, h, fn);
    });
  }

  /* ====================== ENEMIES ====================== */
  createEnemyTextures() {
    // GLOOP (slime) - green blob
    const GP = { G: '#44BB44', D: '#226622', W: '#FFFFFF', K: '#111111', L: '#66DD66', ' ': null, F: '#FF4444' };
    const gloopWalk1 = [
      ' DDDDD  ',
      'DGLLLGD ',
      'DGWKWGD ',
      'DGLLLGD ',
      'DGGGGGD ',
      ' DDDDD  ',
      ' GG GG  ',
      ' DD DD  ',
    ];
    const gloopWalk2 = [
      '  DDDDD ',
      ' DGLLLGD',
      ' DGWKWGD',
      ' DGLLLGD',
      ' DGGGGGD',
      '  DDDDD ',
      '  GG GG ',
      '  DD DD ',
    ];
    const gloopFlat = [
      '        ',
      'DDDDDDDD',
      'DGLLLGDD',
      'DGWKWGDD',
      'DDDDDDDD',
      '        ',
      '        ',
      '        ',
    ];

    // SHELLIE (crab) - red crab
    const SP = { R: '#DD2222', D: '#881111', W: '#FFFFFF', K: '#111111', O: '#FF6633', C: '#CC4400', ' ': null, P: '#FFAAAA' };
    const shellieWalk1 = [
      'D     D  ',
      'DRRRRRRD ',
      'DRWKWRRD ',
      'DRRRRRRD ',
      'DRRORRRD ',
      'DRRRRRRD ',
      'D D D D  ',
      ' D   D   ',
    ];
    const shellieWalk2 = [
      ' D     D ',
      ' DRRRRRRD',
      ' DRWKWRRD',
      ' DRRRRRRD',
      ' DRRORRRD',
      ' DRRRRRRD',
      '  D D D D',
      '   D   D ',
    ];
    const shellieShell = [
      '  DDDD   ',
      ' DRRRRD  ',
      'DRRPPPRD ',
      'DRRPPPRD ',
      'DRRPPPRD ',
      ' DRRRRD  ',
      '  DDDD   ',
      '         ',
    ];

    // BATLING (bat) - purple bat
    const BP = { V: '#7744CC', D: '#441188', W: '#FFFFFF', K: '#111111', L: '#9966EE', P: '#DD99FF', ' ': null };
    const batWalk1 = [
      'D    D   ',
      'DLVVVLD  ',
      'DLWKWLD  ',
      'DLVVVLD  ',
      'PPPPPPPP ',
      'PPPPPPPP ',
      ' PPPPPP  ',
      '         ',
    ];
    const batWalk2 = [
      '  D    D ',
      '  DLVVVLD',
      '  DLWKWLD',
      '  DLVVVLD',
      ' PPPPPPPP',
      ' PPPPPPPP',
      '  PPPPPP ',
      '         ',
    ];

    const s = 2;
    [
      ['gloop_walk1',    8*s, 8*s,  (c) => this.pixelArt(c, gloopWalk1,   GP, s)],
      ['gloop_walk2',    8*s, 8*s,  (c) => this.pixelArt(c, gloopWalk2,   GP, s)],
      ['gloop_flat',     8*s, 8*s,  (c) => this.pixelArt(c, gloopFlat,    GP, s)],
      ['shellie_walk1',  9*s, 8*s,  (c) => this.pixelArt(c, shellieWalk1, SP, s)],
      ['shellie_walk2',  9*s, 8*s,  (c) => this.pixelArt(c, shellieWalk2, SP, s)],
      ['shellie_shell',  9*s, 8*s,  (c) => this.pixelArt(c, shellieShell, SP, s)],
      ['batling_walk1',  9*s, 8*s,  (c) => this.pixelArt(c, batWalk1,     BP, s)],
      ['batling_walk2',  9*s, 8*s,  (c) => this.pixelArt(c, batWalk2,     BP, s)],
    ].forEach(([key, w, h, fn]) => {
      this.makeTexture(key, w, h, fn);
    });
  }

  /* ====================== TILES ====================== */
  createTileTextures() {
    const T = 32;

    // GROUND TILE (grassland)
    this.makeTexture('tile_ground', T, T, (ctx) => {
      ctx.fillStyle = '#5D4037';
      ctx.fillRect(0, 0, T, T);
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(0, 0, T, 8);
      // brick lines
      ctx.fillStyle = '#4A3429';
      ctx.fillRect(0, 8, T, 2);
      ctx.fillRect(0, 18, T, 2);
      ctx.fillRect(T/2, 10, 2, 8);
      ctx.fillRect(0, 20, 2, 8);
      ctx.fillRect(T-2, 20, 2, 8);
      // grass detail
      ctx.fillStyle = '#66BB6A';
      ctx.fillRect(4, 2, 3, 5);
      ctx.fillRect(12, 1, 2, 6);
      ctx.fillRect(20, 3, 3, 4);
    });

    // GROUND TILE (cave)
    this.makeTexture('tile_ground_cave', T, T, (ctx) => {
      ctx.fillStyle = '#37474F';
      ctx.fillRect(0, 0, T, T);
      ctx.fillStyle = '#3A3A3A';
      ctx.fillRect(0, 8, T, 2);
      ctx.fillRect(0, 18, T, 2);
      ctx.fillRect(T/2, 10, 2, 8);
      ctx.fillRect(0, 20, 2, 8);
      ctx.fillStyle = '#546E7A';
      ctx.fillRect(3, 11, 4, 6);
      ctx.fillRect(18, 21, 4, 6);
    });

    // GROUND TILE (sky)
    this.makeTexture('tile_ground_sky', T, T, (ctx) => {
      ctx.fillStyle = '#F8BBD0';
      ctx.fillRect(0, 0, T, T);
      ctx.fillStyle = '#F48FB1';
      ctx.fillRect(0, 8, T, 2);
      ctx.fillRect(0, 18, T, 2);
      ctx.fillRect(T/2, 10, 2, 8);
      ctx.fillRect(0, 20, 2, 8);
      ctx.fillStyle = '#FCE4EC';
      ctx.fillRect(4, 2, T-8, 5);
      ctx.fillRect(4, 12, T/2-4, 5);
      ctx.fillRect(T/2+2, 22, T/2-6, 5);
    });

    // BRICK TILE
    this.makeTexture('tile_brick', T, T, (ctx) => {
      ctx.fillStyle = '#A0522D';
      ctx.fillRect(0, 0, T, T);
      ctx.fillStyle = '#CD853F';
      ctx.fillRect(2, 2, T-4, T/2-3);
      ctx.fillRect(T/2+2, T/2+1, T/2-3, T/2-3);
      ctx.fillRect(2, T/2+1, T/2-3, T/2-3);
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(0, T/2-1, T, 2);
      ctx.fillRect(T/2-1, 0, 2, T/2-1);
      ctx.fillRect(0, T/2+1, T/2-1, 2);
      ctx.fillRect(T/2+1, T/2+1, T-T/2-2, 2);
    });

    // QUESTION BLOCK
    this.makeTexture('tile_question', T, T, (ctx) => {
      ctx.fillStyle = '#FFA726';
      ctx.fillRect(0, 0, T, T);
      ctx.fillStyle = '#FF8F00';
      ctx.fillRect(0, 0, T, 3);
      ctx.fillRect(0, T-3, T, 3);
      ctx.fillRect(0, 0, 3, T);
      ctx.fillRect(T-3, 0, 3, T);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 18px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', T/2, T/2+1);
    });

    // EMPTY BLOCK (used question block)
    this.makeTexture('tile_empty', T, T, (ctx) => {
      ctx.fillStyle = '#FF8F00';
      ctx.fillRect(0, 0, T, T);
      ctx.fillStyle = '#E65100';
      ctx.fillRect(0, 0, T, 3);
      ctx.fillRect(0, T-3, T, 3);
      ctx.fillRect(0, 0, 3, T);
      ctx.fillRect(T-3, 0, 3, T);
      ctx.fillStyle = '#BF360C';
      ctx.fillRect(4, 4, T-8, T-8);
    });

    // PLATFORM TILE
    this.makeTexture('tile_platform', T, 16, (ctx) => {
      ctx.fillStyle = '#78909C';
      ctx.fillRect(0, 0, T, 16);
      ctx.fillStyle = '#90A4AE';
      ctx.fillRect(0, 0, T, 6);
      ctx.fillStyle = '#546E7A';
      ctx.fillRect(0, 6, T, 2);
    });

    // PIPE TOP
    this.makeTexture('pipe_top', 40, 32, (ctx) => {
      ctx.fillStyle = '#1B5E20';
      ctx.fillRect(0, 0, 40, 32);
      ctx.fillStyle = '#2E7D32';
      ctx.fillRect(2, 2, 36, 28);
      ctx.fillStyle = '#388E3C';
      ctx.fillRect(4, 4, 14, 24);
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(5, 5, 6, 20);
    });

    // PIPE BODY
    this.makeTexture('pipe_body', 32, 32, (ctx) => {
      ctx.fillStyle = '#1B5E20';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#2E7D32';
      ctx.fillRect(2, 0, 28, 32);
      ctx.fillStyle = '#388E3C';
      ctx.fillRect(4, 0, 12, 32);
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(5, 0, 5, 32);
    });

    // COIN BLOCK particle
    this.makeTexture('tile_coin_particle', 16, 16, (ctx) => {
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(8, 8, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFF176';
      ctx.beginPath();
      ctx.arc(6, 6, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // COIN (collectible)
    this.makeTexture('coin', 16, 16, (ctx) => {
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(8, 8, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FF8F00';
      ctx.beginPath();
      ctx.arc(8, 8, 7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#FFF176';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('$', 8, 9);
    });

    // FINISH FLAG
    this.makeTexture('flag_pole', 8, 320, (ctx) => {
      ctx.fillStyle = '#888888';
      ctx.fillRect(3, 0, 2, 320);
      ctx.fillStyle = '#AAAAAA';
      ctx.fillRect(3, 0, 1, 320);
    });
    this.makeTexture('flag', 32, 24, (ctx) => {
      ctx.fillStyle = '#FF3333';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(32, 12);
      ctx.lineTo(0, 24);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#FFFF33';
      ctx.beginPath();
      ctx.moveTo(4, 6);
      ctx.lineTo(16, 12);
      ctx.lineTo(4, 18);
      ctx.closePath();
      ctx.fill();
    });

    // CASTLE / FINISH
    this.makeTexture('castle', 96, 96, (ctx) => {
      ctx.fillStyle = '#757575';
      ctx.fillRect(0, 32, 96, 64);
      // Battlements
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(i * 32, 16, 20, 32);
      }
      ctx.fillStyle = '#616161';
      // Gate
      ctx.fillStyle = '#212121';
      ctx.fillRect(32, 56, 32, 40);
      // Windows
      ctx.fillStyle = '#212121';
      ctx.fillRect(12, 44, 14, 14);
      ctx.fillRect(70, 44, 14, 14);
      // brick lines
      ctx.fillStyle = '#616161';
      for (let y = 32; y < 96; y += 12) {
        ctx.fillRect(0, y, 96, 1);
      }
    });
  }

  /* ====================== POWER-UPS ====================== */
  createPowerUpTextures() {
    // MUSHROOM (grow)
    this.makeTexture('powerup_mushroom', 28, 28, (ctx) => {
      // Cap
      ctx.fillStyle = '#E53935';
      ctx.beginPath();
      ctx.arc(14, 12, 12, Math.PI, 0);
      ctx.fill();
      // Spots
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.arc(9, 8, 3, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(19, 8, 3, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(14, 5, 2.5, 0, Math.PI*2); ctx.fill();
      // Stem
      ctx.fillStyle = '#FFF8E1';
      ctx.fillRect(6, 12, 16, 12);
      // Eyes
      ctx.fillStyle = '#111111';
      ctx.beginPath(); ctx.arc(10, 18, 2, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(18, 18, 2, 0, Math.PI*2); ctx.fill();
    });

    // STAR (invincibility)
    this.makeTexture('powerup_star', 28, 28, (ctx) => {
      ctx.fillStyle = '#FFD600';
      const cx = 14, cy = 14, r1 = 13, r2 = 6, n = 5;
      ctx.beginPath();
      for (let i = 0; i < n * 2; i++) {
        const angle = (i * Math.PI) / n - Math.PI / 2;
        const r = i % 2 === 0 ? r1 : r2;
        if (i === 0) ctx.moveTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
        else ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
      }
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#FFF176';
      ctx.beginPath(); ctx.arc(10, 10, 3, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#111111';
      ctx.beginPath(); ctx.arc(12, 16, 2, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(18, 16, 2, 0, Math.PI*2); ctx.fill();
    });

    // FIRE FLOWER
    this.makeTexture('powerup_flower', 28, 28, (ctx) => {
      // stem
      ctx.fillStyle = '#2E7D32';
      ctx.fillRect(12, 16, 4, 12);
      // petals
      const petalColors = ['#E53935', '#FF7043', '#FFCA28', '#66BB6A'];
      const angles = [0, Math.PI/2, Math.PI, 3*Math.PI/2];
      angles.forEach((a, i) => {
        ctx.fillStyle = petalColors[i];
        ctx.beginPath();
        ctx.arc(14 + Math.cos(a)*7, 14 + Math.sin(a)*7, 5, 0, Math.PI*2);
        ctx.fill();
      });
      // center
      ctx.fillStyle = '#FFF9C4';
      ctx.beginPath(); ctx.arc(14, 14, 5, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#F57F17';
      ctx.beginPath(); ctx.arc(14, 14, 3, 0, Math.PI*2); ctx.fill();
    });
  }

  /* ====================== UI ====================== */
  createUITextures() {
    // Heart (life indicator)
    this.makeTexture('ui_heart', 20, 20, (ctx) => {
      ctx.fillStyle = '#E53935';
      ctx.beginPath();
      ctx.moveTo(10, 16);
      ctx.bezierCurveTo(10, 16, 2, 10, 2, 6);
      ctx.arc(5, 5, 3.5, Math.PI, 0);
      ctx.arc(13, 5, 3.5, Math.PI, 0);
      ctx.bezierCurveTo(18, 10, 10, 16, 10, 16);
      ctx.fill();
      ctx.fillStyle = '#FF8A80';
      ctx.beginPath(); ctx.arc(7, 6, 2, 0, Math.PI*2); ctx.fill();
    });

    // Coin icon (HUD)
    this.makeTexture('ui_coin', 16, 16, (ctx) => {
      ctx.fillStyle = '#FFD700';
      ctx.beginPath(); ctx.arc(8, 8, 7, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#FF8F00';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('$', 8, 9);
    });

    // Btn backgrounds
    this.makeTexture('btn_normal', 200, 48, (ctx) => {
      ctx.fillStyle = '#1565C0';
      ctx.roundRect ? ctx.roundRect(0, 0, 200, 48, 8) : ctx.fillRect(0, 0, 200, 48);
      ctx.fill ? ctx.fill() : null;
      ctx.fillStyle = '#1976D2';
      ctx.fillRect(0, 0, 200, 48);
      ctx.fillStyle = '#42A5F5';
      ctx.fillRect(0, 0, 200, 4);
      ctx.fillStyle = '#0D47A1';
      ctx.fillRect(0, 44, 200, 4);
    });

    // Mobile button texture
    this.makeTexture('mb_btn', 60, 60, (ctx) => {
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.beginPath(); ctx.arc(30, 30, 28, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(30, 30, 28, 0, Math.PI*2); ctx.stroke();
    });
  }

  /* ====================== BACKGROUNDS ====================== */
  createBackgroundTextures() {
    // Sky layer (clouds)
    this.makeTexture('bg_sky', 800, 480, (ctx) => {
      const grad = ctx.createLinearGradient(0, 0, 0, 480);
      grad.addColorStop(0, '#4FC3F7');
      grad.addColorStop(1, '#B3E5FC');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 480);
    });

    // Cave layer
    this.makeTexture('bg_cave', 800, 480, (ctx) => {
      const grad = ctx.createLinearGradient(0, 0, 0, 480);
      grad.addColorStop(0, '#212121');
      grad.addColorStop(1, '#37474F');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 480);
      // stalactites
      ctx.fillStyle = '#455A64';
      for (let i = 0; i < 15; i++) {
        const x = (i * 55) + 10;
        const h = 30 + (i % 3) * 20;
        ctx.beginPath();
        ctx.moveTo(x, 0); ctx.lineTo(x+12, h); ctx.lineTo(x+24, 0);
        ctx.fill();
      }
    });

    // Skyworld layer
    this.makeTexture('bg_skyworld', 800, 480, (ctx) => {
      const grad = ctx.createLinearGradient(0, 0, 0, 480);
      grad.addColorStop(0, '#1A237E');
      grad.addColorStop(0.5, '#7E57C2');
      grad.addColorStop(1, '#CE93D8');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 480);
      // stars
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      const stars = [[50,40],[150,80],[300,30],[450,70],[600,20],[720,90],
                     [80,150],[250,130],[500,160],[670,140],[750,50]];
      stars.forEach(([x,y]) => {
        ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI*2); ctx.fill();
      });
    });

    // Cloud sprite
    this.makeTexture('cloud', 96, 48, (ctx) => {
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.beginPath(); ctx.arc(24, 32, 22, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(48, 24, 28, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(72, 32, 20, 0, Math.PI*2); ctx.fill();
      ctx.fillRect(4, 32, 88, 16);
    });

    // Mountain/hill decoration
    this.makeTexture('hill', 96, 64, (ctx) => {
      ctx.fillStyle = '#388E3C';
      ctx.beginPath();
      ctx.moveTo(0, 64); ctx.quadraticCurveTo(48, 0, 96, 64);
      ctx.fill();
      ctx.fillStyle = '#4CAF50';
      ctx.beginPath();
      ctx.moveTo(10, 64); ctx.quadraticCurveTo(48, 8, 86, 64);
      ctx.fill();
    });

    // Bush decoration
    this.makeTexture('bush', 64, 32, (ctx) => {
      ctx.fillStyle = '#2E7D32';
      ctx.beginPath(); ctx.arc(16, 24, 14, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(32, 20, 16, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(48, 24, 14, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#388E3C';
      ctx.beginPath(); ctx.arc(32, 20, 10, 0, Math.PI*2); ctx.fill();
    });

    // Cave rock
    this.makeTexture('cave_rock', 48, 32, (ctx) => {
      ctx.fillStyle = '#546E7A';
      ctx.beginPath(); ctx.arc(24, 28, 22, Math.PI, 0); ctx.fill();
      ctx.fillRect(2, 28, 44, 4);
      ctx.fillStyle = '#607D8B';
      ctx.beginPath(); ctx.arc(18, 24, 8, Math.PI, 0); ctx.fill();
    });
  }

  /* ====================== EFFECTS ====================== */
  createEffectTextures() {
    // Particle / dust
    this.makeTexture('particle_dust', 8, 8, (ctx) => {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.arc(4, 4, 3, 0, Math.PI*2); ctx.fill();
    });

    // Coin sparkle
    this.makeTexture('particle_coin', 12, 12, (ctx) => {
      ctx.fillStyle = '#FFD700';
      ctx.beginPath(); ctx.arc(6, 6, 5, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.arc(4, 4, 2, 0, Math.PI*2); ctx.fill();
    });

    // Star particle
    this.makeTexture('particle_star', 12, 12, (ctx) => {
      ctx.fillStyle = '#FFFF00';
      const cx=6, cy=6, r1=5, r2=2, n=5;
      ctx.beginPath();
      for (let i=0; i<n*2; i++) {
        const a = (i*Math.PI)/n - Math.PI/2;
        const r = i%2===0 ? r1 : r2;
        if (i===0) ctx.moveTo(cx+r*Math.cos(a), cy+r*Math.sin(a));
        else ctx.lineTo(cx+r*Math.cos(a), cy+r*Math.sin(a));
      }
      ctx.closePath(); ctx.fill();
    });

    // Brick fragment
    this.makeTexture('brick_frag', 8, 8, (ctx) => {
      ctx.fillStyle = '#A0522D';
      ctx.fillRect(0, 0, 8, 8);
      ctx.fillStyle = '#CD853F';
      ctx.fillRect(1, 1, 5, 5);
    });

    // Score popup bg
    this.makeTexture('score_popup', 48, 24, (ctx) => {
      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.clearRect(0,0,48,24);
    });
  }
}
