/**
 * MobileControls - Virtual D-pad and jump button for touchscreen devices.
 * Creates an overlay DOM element with touch handlers.
 */
class MobileControls {
  constructor() {
    this.left  = false;
    this.right = false;
    this.jump  = false;
    this._el   = null;
    this._touches = {};
    this._btnEls  = {};
  }

  isMobile() {
    return /Android|iPhone|iPad|iPod|Touch/i.test(navigator.userAgent) ||
      ('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0);
  }

  create() {
    if (this._el) return;

    const el = document.createElement('div');
    el.id = 'mobile-controls';
    el.style.cssText = `
      position: fixed; bottom: 0; left: 0; right: 0;
      height: 140px; z-index: 1000;
      display: flex; justify-content: space-between;
      align-items: flex-end; padding: 16px 20px;
      pointer-events: none;
      user-select: none; -webkit-user-select: none;
    `;

    // Left D-pad group
    const dpad = document.createElement('div');
    dpad.style.cssText = `
      display: flex; gap: 4px; align-items: center;
      pointer-events: all;
    `;

    const leftBtn  = this._makeBtn('◀', 'left');
    const rightBtn = this._makeBtn('▶', 'right');
    dpad.appendChild(leftBtn);
    dpad.appendChild(rightBtn);

    // Right jump button
    const jumpBtn = this._makeBtn('▲', 'jump', true);

    el.appendChild(dpad);
    el.appendChild(jumpBtn);
    document.body.appendChild(el);
    this._el = el;

    // Prevent default touch behavior on game canvas
    document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
  }

  _makeBtn(label, action, large = false) {
    const size = large ? '72px' : '60px';
    const btn = document.createElement('div');
    btn.textContent = label;
    btn.style.cssText = `
      width: ${size}; height: ${size};
      background: rgba(255,255,255,0.22);
      border: 2.5px solid rgba(255,255,255,0.55);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: ${large ? '28px' : '22px'};
      color: rgba(255,255,255,0.9);
      font-weight: bold;
      cursor: pointer;
      touch-action: none;
      text-shadow: 0 0 6px rgba(0,0,0,0.5);
      box-shadow: 0 4px 12px rgba(0,0,0,0.3), inset 0 1px rgba(255,255,255,0.4);
      transition: background 0.1s;
      -webkit-tap-highlight-color: transparent;
    `;

    btn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this[action] = true;
      btn.style.background = 'rgba(255,255,255,0.42)';
    }, { passive: false });

    btn.addEventListener('touchend', (e) => {
      e.preventDefault();
      this[action] = false;
      btn.style.background = 'rgba(255,255,255,0.22)';
    }, { passive: false });

    btn.addEventListener('touchcancel', (e) => {
      e.preventDefault();
      this[action] = false;
      btn.style.background = 'rgba(255,255,255,0.22)';
    }, { passive: false });

    this._btnEls[action] = btn;
    return btn;
  }

  show() {
    if (this._el) this._el.style.display = 'flex';
  }

  hide() {
    if (this._el) this._el.style.display = 'none';
  }

  destroy() {
    if (this._el) {
      this._el.remove();
      this._el = null;
    }
    this.left = this.right = this.jump = false;
  }

  reset() {
    this.left = this.right = this.jump = false;
  }
}
