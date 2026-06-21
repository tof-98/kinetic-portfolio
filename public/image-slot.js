// <image-slot> custom element — user-fillable image placeholder
// Simplified production version: drop/click to fill, localStorage persistence
(() => {
  const MAX_DIM = 1200;
  const ACCEPT = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

  // In-memory store (no server sidecar in production)
  let slots = {};
  const subs = new Set();
  let loaded = false;

  function load() {
    try {
      const raw = localStorage.getItem('__image_slots__');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') slots = parsed;
      }
    } catch {}
    loaded = true;
    subs.forEach(fn => fn());
  }

  function save() {
    try { localStorage.setItem('__image_slots__', JSON.stringify(slots)); } catch {}
  }

  const clampS = s => Math.max(1, Math.min(5, s));

  function getSlot(id) {
    const v = slots[id];
    if (!v) return null;
    return typeof v === 'string' ? { u: v, s: 1, x: 0, y: 0 } : v;
  }

  function setSlot(id, val) {
    if (!id) return;
    if (val) slots[id] = val;
    else delete slots[id];
    subs.forEach(fn => fn());
    if (loaded) save();
  }

  async function toDataUrl(file, targetW) {
    const bitmap = await createImageBitmap(file);
    try {
      const cap = Math.min(MAX_DIM, Math.max(1, Math.round(targetW * 2)) || MAX_DIM);
      const scale = Math.min(1, cap / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
      return canvas.toDataURL('image/webp', 0.85);
    } finally {
      bitmap.close && bitmap.close();
    }
  }

  const stylesheet =
    ':host{display:inline-block;position:relative;vertical-align:top;' +
    '  font:13px/1.3 system-ui,-apple-system,sans-serif;color:rgba(255,255,255,.45);width:240px;height:160px}' +
    '.frame{position:absolute;inset:0;overflow:hidden;background:rgba(255,255,255,.04)}' +
    '.frame img{position:absolute;max-width:none;transform:translate(-50%,-50%);' +
    '  -webkit-user-drag:none;user-select:none;touch-action:none}' +
    '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' +
    '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' +
    '  cursor:pointer;user-select:none;border:1px dashed rgba(255,255,255,.15)}' +
    '.empty svg{opacity:.3}' +
    '.empty .cap{max-width:90%;font-weight:500;letter-spacing:.01em;font-size:12px}' +
    '.empty .sub{font-size:10px;color:rgba(255,255,255,.3)}' +
    ':host([data-over]) .frame{outline:2px solid #eab600;outline-offset:-2px;background:rgba(234,182,0,.08)}' +
    ':host([data-filled]) .empty{display:none}' +
    '.ctl{position:absolute;top:100%;left:50%;transform:translateX(-50%);padding-top:6px;' +
    '  display:flex;gap:6px;opacity:0;pointer-events:none;transition:opacity .12s;z-index:2;white-space:nowrap}' +
    ':host([data-filled]:hover) .ctl{opacity:1;pointer-events:auto}' +
    '.ctl button{appearance:none;border:0;border-radius:4px;padding:4px 9px;cursor:pointer;' +
    '  background:rgba(0,0,0,.7);color:#fff;font:11px/1 system-ui;backdrop-filter:blur(6px)}' +
    '.ctl button:hover{background:rgba(0,0,0,.9)}';

  const icon =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>' +
    '<path d="m21 15-5-5L5 21"/></svg>';

  class ImageSlot extends HTMLElement {
    static get observedAttributes() {
      return ['shape', 'radius', 'mask', 'fit', 'position', 'placeholder', 'src', 'id'];
    }

    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML =
        '<style>' + stylesheet + '</style>' +
        '<div class="frame">' +
        '  <img alt="" draggable="false" style="display:none">' +
        '  <div class="empty">' + icon +
        '    <div class="cap"></div>' +
        '    <div class="sub">click or drop image</div>' +
        '  </div>' +
        '</div>' +
        '<div class="ctl">' +
        '  <button data-act="replace">Replace</button>' +
        '  <button data-act="clear">Remove</button>' +
        '</div>' +
        '<input type="file" accept="' + ACCEPT.join(',') + '" hidden>';

      this._frame = root.querySelector('.frame');
      this._img = root.querySelector('img');
      this._empty = root.querySelector('.empty');
      this._cap = root.querySelector('.cap');
      this._input = root.querySelector('input');
      this._depth = 0;
      this._subFn = () => this._render();

      this._empty.addEventListener('click', () => this._input.click());
      root.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (act === 'replace') this._input.click();
        if (act === 'clear') { setSlot(this.id, null); this._render(); }
      });
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._ingest(f);
        this._input.value = '';
      });
    }

    connectedCallback() {
      this.addEventListener('dragenter', this);
      this.addEventListener('dragover', this);
      this.addEventListener('dragleave', this);
      this.addEventListener('drop', this);
      subs.add(this._subFn);
      if (!loaded) load();
      this._render();
    }

    disconnectedCallback() {
      subs.delete(this._subFn);
      this.removeEventListener('dragenter', this);
      this.removeEventListener('dragover', this);
      this.removeEventListener('dragleave', this);
      this.removeEventListener('drop', this);
    }

    attributeChangedCallback() { if (this.shadowRoot) this._render(); }

    handleEvent(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        e.preventDefault(); e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        if (--this._depth <= 0) { this._depth = 0; this.removeAttribute('data-over'); }
      } else if (e.type === 'drop') {
        e.preventDefault(); e.stopPropagation();
        this._depth = 0; this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }

    async _ingest(file) {
      if (!file || !ACCEPT.includes(file.type)) return;
      const w = this.clientWidth || this.offsetWidth || MAX_DIM;
      try {
        const url = await toDataUrl(file, w);
        setSlot(this.id || '', { u: url, s: 1, x: 0, y: 0 });
        if (!this.id) { this._render(); }
      } catch {}
    }

    _render() {
      const mask = this.getAttribute('mask');
      const shape = (this.getAttribute('shape') || 'rounded').toLowerCase();
      let radius = '';
      if (shape === 'circle') radius = '50%';
      else if (shape === 'pill') radius = '9999px';
      else if (shape === 'rounded') { const n = parseFloat(this.getAttribute('radius')); radius = (Number.isFinite(n) ? n : 12) + 'px'; }
      this._frame.style.borderRadius = mask ? '' : radius;
      this._frame.style.clipPath = mask || '';

      const stored = this.id ? getSlot(this.id) : null;
      const srcAttr = this.getAttribute('src') || '';
      const url = (stored && stored.u) || srcAttr;

      this._cap.textContent = this.getAttribute('placeholder') || 'Drop an image';

      if (url) {
        if (this._img.getAttribute('src') !== url) this._img.src = url;
        this._img.style.display = 'block';
        this._img.style.width = '100%'; this._img.style.height = '100%';
        this._img.style.left = '50%'; this._img.style.top = '50%';
        this._img.style.objectFit = this.getAttribute('fit') || 'cover';
        this._empty.style.display = 'none';
        this.setAttribute('data-filled', '');
      } else {
        this._img.style.display = 'none';
        this._img.removeAttribute('src');
        this._empty.style.display = 'flex';
        this.removeAttribute('data-filled');
      }
    }
  }

  if (!customElements.get('image-slot')) {
    customElements.define('image-slot', ImageSlot);
  }

  // Load persisted state
  load();
})();
