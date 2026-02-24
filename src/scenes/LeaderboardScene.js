/**
 * LeaderboardScene – Muestra el top 10 de puntajes guardados.
 *
 * Parámetros de entrada (data):
 *   from      {string}  - Escena a la que volver (default: 'MenuScene')
 *   newEntry  {object}  - { name, score, rank } para resaltar la entrada recién agregada
 */
class LeaderboardScene extends Phaser.Scene {
  constructor() { super({ key: 'LeaderboardScene' }); }

  create(data) {
    const { width, height } = this.scale;
    const returnScene = (data && data.from) || 'MenuScene';

    // ── Fondo ────────────────────────────────────────────────────────────────
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0a0a2e, 0x0a0a2e, 0x0d2255, 0x0d2255, 1);
    bg.fillRect(0, 0, width, height);

    // Estrellas decorativas
    for (let i = 0; i < 40; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height * 0.5),
        Math.random() < 0.3 ? 2 : 1,
        0xffffff,
        Math.random() * 0.5 + 0.3
      );
      this.tweens.add({
        targets: star, alpha: 0.1,
        duration: Phaser.Math.Between(800, 2000),
        yoyo: true, repeat: -1,
        delay: Phaser.Math.Between(0, 1000)
      });
    }

    // ── Panel central ────────────────────────────────────────────────────────
    const pw = Math.min(580, width - 40);
    const ph = 350;
    const px = width / 2 - pw / 2;
    const py = height / 2 - ph / 2 - 20;

    const panel = this.add.graphics();
    panel.fillStyle(0x07122e, 1);
    panel.fillRoundedRect(px, py, pw, ph, 16);
    panel.fillStyle(0x132266, 1);
    panel.fillRect(px, py, pw, 48);
    panel.lineStyle(2, 0x2244aa, 1);
    panel.strokeRoundedRect(px, py, pw, ph, 16);

    // ── Título ───────────────────────────────────────────────────────────────
    this.add.image(width / 2 - pw / 2 + 28, py + 24, 'particle_star').setScale(1.5);
    this.add.image(width / 2 + pw / 2 - 28, py + 24, 'particle_star').setScale(1.5);
    this.add.text(width / 2, py + 24, 'HIGH SCORES', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '13px', color: '#FFD700',
      stroke: '#884400', strokeThickness: 3
    }).setOrigin(0.5);

    // ── Entradas ─────────────────────────────────────────────────────────────
    const entries = Leaderboard.get();
    const rowH    = 28;
    const startY  = py + 64;
    const colRank  = px + 16;
    const colName  = px + 56;
    const colScore = px + pw - 175;
    const colCoins = px + pw - 70;

    if (entries.length === 0) {
      // Estado vacío
      this.add.text(width / 2, py + ph / 2, 'SIN RECORDS AUN...\n¡VE A JUGAR!', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '10px', color: '#666688', align: 'center'
      }).setOrigin(0.5);
    } else {
      // Cabecera de columnas
      const hStyle = { fontFamily: '"Press Start 2P", monospace', fontSize: '7px', color: '#556688' };
      this.add.text(colRank,  startY - 18, '#',     hStyle);
      this.add.text(colName,  startY - 18, 'NOMBRE', hStyle);
      this.add.text(colScore, startY - 18, 'SCORE',  hStyle);
      this.add.text(colCoins, startY - 18, 'COINS',  hStyle);

      // Línea separadora
      const sep = this.add.graphics();
      sep.lineStyle(1, 0x223366, 1);
      sep.lineBetween(px + 8, startY - 6, px + pw - 8, startY - 6);

      const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

      entries.forEach((e, i) => {
        const y  = startY + i * rowH;
        const isNew = data?.newEntry &&
                      e.name  === data.newEntry.name &&
                      e.score === data.newEntry.score &&
                      i       === data.newEntry.rank;

        // Resaltado para el jugador recién guardado
        if (isNew) {
          const hl = this.add.graphics();
          hl.fillStyle(0xFFD700, 0.10);
          hl.fillRoundedRect(px + 4, y - 5, pw - 8, rowH - 2, 4);
          hl.lineStyle(1, 0xFFD700, 0.3);
          hl.strokeRoundedRect(px + 4, y - 5, pw - 8, rowH - 2, 4);
        }

        const rankColor = i < 3 ? medalColors[i] : '#778899';
        const nameColor = isNew ? '#88FF88' : '#CCDDFF';

        this.add.text(colRank,  y, `${i + 1}.`,
          { fontFamily: '"Press Start 2P", monospace', fontSize: '8px', color: rankColor });
        this.add.text(colName,  y, e.name.substring(0, 10).padEnd(10),
          { fontFamily: '"Press Start 2P", monospace', fontSize: '8px', color: nameColor });
        this.add.text(colScore, y, String(e.score).padStart(7, '0'),
          { fontFamily: '"Press Start 2P", monospace', fontSize: '8px', color: '#FFD700' });
        this.add.text(colCoins, y, String(e.coins).padStart(3, '0'),
          { fontFamily: '"Press Start 2P", monospace', fontSize: '8px', color: '#88DDFF' });
      });
    }

    // ── Botones ───────────────────────────────────────────────────────────────
    const btnY = py + ph + 28;
    const hasClear = entries.length > 0;

    this._makeBtn(width / 2 - (hasClear ? 80 : 0), btnY, '← VOLVER', () => {
      this.scene.stop('LeaderboardScene');
      this.scene.start(returnScene);
    });

    if (hasClear) {
      this._makeBtn(width / 2 + 80, btnY, 'BORRAR', () => {
        Leaderboard.clear();
        this.scene.restart(data);
      });
    }

    this.input.keyboard.once('keydown-ESC', () => {
      this.scene.stop('LeaderboardScene');
      this.scene.start(returnScene);
    });
  }

  _makeBtn(x, y, label, cb) {
    const bw = 140, bh = 36;
    const bg = this.add.graphics();
    bg.fillStyle(0x1256a0, 1);
    bg.fillRoundedRect(x - bw / 2, y - bh / 2, bw, bh, 8);

    this.add.text(x, y, label, {
      fontFamily: '"Press Start 2P", monospace', fontSize: '9px', color: '#FFFFFF'
    }).setOrigin(0.5);

    this.add.zone(x, y, bw, bh)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', cb)
      .on('pointerover', () => { bg.clear(); bg.fillStyle(0x1976D2); bg.fillRoundedRect(x - bw / 2, y - bh / 2, bw, bh, 8); })
      .on('pointerout',  () => { bg.clear(); bg.fillStyle(0x1256a0); bg.fillRoundedRect(x - bw / 2, y - bh / 2, bw, bh, 8); });
  }
}
