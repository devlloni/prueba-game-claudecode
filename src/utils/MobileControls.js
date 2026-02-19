/**
 * MobileControls - Virtual D-pad and jump button for touchscreen devices.
 * Renders a fixed DOM overlay with reliable multi-touch handling.
 */
class MobileControls {
  constructor() {
    this.left  = false;
    this.right = false;
    this.jump  = false;
    this._el   = null;
    this._btnEls = {};
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
      position: fixed;
      bottom: 0; left: 0; right: 0;
      height: 160px;
      z-index: 1000;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding: 12px 28px;
      padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
      pointer-events: none;
      user-select: none;
      -webkit-user-select: none;
      box-sizing: border-box;
    `;

    // Left D-pad group
    const dpad = document.createElement('div');
    dpad.style.cssText = `
      display: flex;
      gap: 8px;
      align-items: center;
      pointer-events: none;
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

    // Prevent page scroll / zoom while playing
    document.addEventListener('touchmove',  (e) => e.preventDefault(), { passive: false });
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) e.preventDefault();
    }, { passive: false });
  }

  _makeBtn(label, action, large = false) {
    const size = large ? '80px' : '68px';
    const btn = document.createElement('div');
    btn.textContent = label;
    btn.dataset.action = action;
    btn.style.cssText = `
      width: ${size};
      height: ${size};
      background: rgba(255, 255, 255, 0.18);
      border: 2.5px solid rgba(255, 255, 255, 0.50);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${large ? '30px' : '24px'};
      color: rgba(255, 255, 255, 0.95);
      font-weight: bold;
      cursor: pointer;
      touch-action: none;
      pointer-events: all;
      -webkit-tap-highlight-color: transparent;
      text-shadow: 0 1px 4px rgba(0,0,0,0.6);
      box-shadow:
        0 4px 16px rgba(0,0,0,0.35),
        inset 0 1px 0 rgba(255,255,255,0.35);
      transition: background 0.08s, transform 0.08s;
      will-change: transform;
      user-select: none;
      -webkit-user-select: none;
    `;

    const press = () => {
      this[action] = true;
      btn.style.background = 'rgba(255, 255, 255, 0.38)';
      btn.style.transform = 'scale(0.92)';
    };
    const release = () => {
      this[action] = false;
      btn.style.background = 'rgba(255, 255, 255, 0.18)';
      btn.style.transform = 'scale(1)';
    };

    btn.addEventListener('touchstart',  (e) => { e.preventDefault(); e.stopPropagation(); press();   }, { passive: false });
    btn.addEventListener('touchend',    (e) => { e.preventDefault(); e.stopPropagation(); release(); }, { passive: false });
    btn.addEventListener('touchcancel', (e) => { e.preventDefault(); e.stopPropagation(); release(); }, { passive: false });

    // Fallback for mouse (desktop testing)
    btn.addEventListener('mousedown',  (e) => { e.preventDefault(); press();   });
    btn.addEventListener('mouseup',    (e) => { e.preventDefault(); release(); });
    btn.addEventListener('mouseleave', (e) => { release(); });

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
    Object.values(this._btnEls).forEach(btn => {
      btn.style.background = 'rgba(255, 255, 255, 0.18)';
      btn.style.transform  = 'scale(1)';
    });
  }
}
