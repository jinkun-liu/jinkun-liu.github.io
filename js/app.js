/*
 * JinKun Liu — portfolio app.
 * Hash-routed single page app that works straight from the file system (no server needed).
 * Routes mirror the folder tree defined in data.js; MANIFEST/TREE are generated from the assets.
 */
(function () {
  'use strict';

  const { MANIFEST: M, TREE, SITE } = window;
  const A = 'assets/';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = matchMedia('(hover: hover)').matches;
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many || one + 's'}`;
  const fmtNum = (n, d = 0) => n.toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: d });
  const fmtDur = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const fmtSize = (b) => (b >= 1e9 ? `${fmtNum(b / 1e9, 2)} GB` : b >= 1e6 ? `${fmtNum(b / 1e6, 1)} MB` : b >= 1e3 ? `${fmtNum(b / 1e3, 0)} KB` : `${b} bytes`);
  const fmtDate = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  /* ------------------------------------------------------------------ icons */
  const svg = (d, w = 1.5) => `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const ICON = {
    folder: svg('<path d="M2.5 5.5A1.5 1.5 0 0 1 4 4h3.6l1.8 2H16a1.5 1.5 0 0 1 1.5 1.5v7A1.5 1.5 0 0 1 16 16H4a1.5 1.5 0 0 1-1.5-1.5z"/>'),
    image: svg('<rect x="2.5" y="3.5" width="15" height="13" rx="2"/><circle cx="7" cy="8" r="1.4"/><path d="m3 15 4.5-4.5 3 3 2.5-2.5 4 4"/>'),
    doc: svg('<path d="M5 2.5h6.5l3.5 3.5v11a.5.5 0 0 1-.5.5h-9.5a.5.5 0 0 1-.5-.5v-14a.5.5 0 0 1 .5-.5z"/><path d="M11.5 2.5V6H15M7 10h6M7 13h6"/>'),
    video: svg('<rect x="2.5" y="4.5" width="11" height="11" rx="2"/><path d="m13.5 8.5 4-2.5v8l-4-2.5"/>'),
    link: svg('<path d="M8.5 11.5a3 3 0 0 0 4.2 0l2.6-2.6a3 3 0 0 0-4.2-4.2l-.9.9"/><path d="M11.5 8.5a3 3 0 0 0-4.2 0l-2.6 2.6a3 3 0 0 0 4.2 4.2l.9-.9"/>'),
    word: svg('<path d="M5 2.5h6.5l3.5 3.5v11a.5.5 0 0 1-.5.5h-9.5a.5.5 0 0 1-.5-.5v-14a.5.5 0 0 1 .5-.5z"/><path d="m7 9 1 5 2-4 2 4 1-5"/>'),
    arrow: svg('<path d="M4 10h12M11 5l5 5-5 5"/>', 1.8),
    left: svg('<path d="m12.5 4-6 6 6 6"/>', 1.8),
    right: svg('<path d="m7.5 4 6 6-6 6"/>', 1.8),
    chev: svg('<path d="m7.5 4 6 6-6 6"/>', 2),
    play: '<svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4.2v11.6a.7.7 0 0 0 1.05.6l9.6-5.8a.7.7 0 0 0 0-1.2l-9.6-5.8A.7.7 0 0 0 6 4.2z" fill="currentColor"/></svg>',
    search: svg('<circle cx="8.5" cy="8.5" r="6"/><path d="m13 13 5 5"/>', 1.6),
    expand: svg('<path d="M12 3h5v5M8 17H3v-5M17 3l-6 6M3 17l6-6"/>', 1.6),
    page: svg('<rect x="3.5" y="2.5" width="13" height="15" rx="2"/><path d="M7 7h6M7 10h6M7 13h4"/>'),
    game: svg('<path d="M6 7h8a4 4 0 0 1 4 4v1.5a2.5 2.5 0 0 1-4.4 1.6L12.5 13h-5l-1.1 1.1A2.5 2.5 0 0 1 2 12.5V11a4 4 0 0 1 4-4z"/><path d="M6.5 9.5v2M5.5 10.5h2M13 10h.01M14.5 11.5h.01"/>', 1.4),
    info: svg('<circle cx="10" cy="10" r="7.5"/><path d="M10 9v5M10 6.5h.01"/>', 1.6),
    download: svg('<path d="M10 3v10M5.5 8.5 10 13l4.5-4.5M4 16.5h12"/>', 1.7),
    mail: svg('<rect x="2.5" y="4.5" width="15" height="11" rx="2"/><path d="m3 5.5 7 5.5 7-5.5"/>', 1.5),
    house: '<svg viewBox="0 0 120 100" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><path d="M14 52 60 16l46 36"/><path d="M24 44v42h72V44"/><path d="M50 86V62h20v24"/><rect x="32" y="54" width="12" height="12"/><rect x="76" y="54" width="12" height="12"/><path d="M80 30V18h10v20"/></svg>',
  };
  // Home-tile artwork for the physics paper: a planet crossing its star, and the dip it leaves in the light curve
  const TRANSIT_ART = `<svg viewBox="0 0 1000 430" role="img" aria-label="A planet transiting a star, with the resulting dip in brightness">
    <defs><radialGradient id="ta-star" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffffff"/><stop offset="0.72" stop-color="#e8e8ed"/><stop offset="1" stop-color="#86868b"/></radialGradient>
      <radialGradient id="ta-glow" cx="50%" cy="50%" r="50%"><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.18"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient></defs>
    <circle cx="500" cy="170" r="200" fill="url(#ta-glow)"/>
    <circle cx="500" cy="170" r="120" fill="url(#ta-star)"/>
    <circle cy="170" r="18" fill="#000" stroke="#6e6e73" stroke-width="1.5"><animate attributeName="cx" values="180;820" dur="8s" repeatCount="indefinite"/></circle>
    <line x1="120" y1="370" x2="880" y2="370" stroke="#2c2c2e" stroke-width="1"/>
    <path d="M120 370 H362 L398 398 H602 L638 370 H880" fill="none" stroke="#f5f5f7" stroke-width="2.5" stroke-linejoin="round"/>
    <circle r="6" fill="#f5f5f7" stroke="#000" stroke-width="2"><animateMotion dur="8s" repeatCount="indefinite" path="M180 370 H362 L398 398 H602 L638 370 H820"/></circle>
    <text x="120" y="420" fill="#6e6e73" font-size="15" font-family="Inter, Helvetica, Arial, sans-serif">brightness over time</text>
  </svg>`;
  const kindIcon = (k) => ({ image: ICON.image, doc: ICON.doc, pdf: ICON.doc, video: ICON.video, link: ICON.link, word: ICON.word })[k] || ICON.page;

  /* ------------------------------------------------------------------ assets */
  const imgInfo = (key) => {
    const d = M.images[key];
    return d ? { key, src: `${A}${key}.jpg`, thumb: `${A}${key}.thumb.jpg`, w: d[0], h: d[1] } : null;
  };
  const docPages = (key) =>
    (M.docs[key] || []).map((d, i) => {
      const n = String(i + 1).padStart(2, '0');
      return { src: `${A}${key}/p${n}.jpg`, thumb: `${A}${key}/p${n}.thumb.jpg`, w: d[0], h: d[1], n: i + 1 };
    });
  const vidInfo = (key) => {
    const d = M.videos[key] || [16, 9, 0, 0];
    return { key, src: `${A}${key}.mp4`, poster: `${A}${key}.poster.jpg`, w: d[0], h: d[1], dur: d[2], mb: d[3] };
  };
  const thumbFor = (key) => {
    if (!key) return '';
    if (M.images[key]) return `${A}${key}.thumb.jpg`;
    if (M.videos[key]) return `${A}${key}.poster.jpg`;
    if (/\/p\d\d$/.test(key)) return `${A}${key}.thumb.jpg`;
    if (M.docs[key]) return `${A}${key}/p01.thumb.jpg`;
    return '';
  };
  const fullFor = (key) => {
    if (M.images[key]) return `${A}${key}.jpg`;
    if (M.videos[key]) return `${A}${key}.poster.jpg`;
    if (/\/p\d\d$/.test(key)) return `${A}${key}.jpg`;
    return thumbFor(key);
  };

  /* ------------------------------------------------------------------ original files (TREE) */
  const safeDir = (s) => s.replace(/[^A-Za-z0-9_-]+/g, '_');
  const safeBase = (s) => s.replace(/\.[^.]*$/, '').replace(/[’']/g, '').replace(/[^A-Za-z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
  const IMG_EXT = ['heic', 'tif', 'tiff', 'dng', 'jpg', 'jpeg', 'png'];
  const FILES = [];
  const BYKEY = new Map();
  const FOLDERS = new Map();
  const LINKS = {};

  (function collectLinks(node) {
    (node.links || []).forEach((l) => (LINKS[l.file] = l.url));
    (node.blocks || []).forEach((b) => {
      if (b.url && b.file) LINKS[b.file] = b.url;
      (b.items || []).forEach((it) => {
        if (it && it.itch) LINKS[it.file] = it.itch;
        if (it && it.uid) LINKS[it.file] = `https://sketchfab.com/models/${it.uid}`;
      });
    });
    (node.children || []).forEach(collectLinks);
  })(SITE.tree);

  (function walk(entries, segs, parent) {
    entries.forEach((e) => {
      e.parent = parent;
      if (e.children) {
        e.segs = [...segs, e.name];
        e.path = e.segs.join('/');
        e.isDir = true;
        FOLDERS.set(e.path, e);
        walk(e.children, e.segs, e);
      } else {
        const ext = e.name.split('.').pop().toLowerCase();
        const key = [...segs.map(safeDir), safeBase(e.name)].join('/');
        let kind = 'other';
        if (IMG_EXT.includes(ext)) kind = 'image';
        else if (ext === 'pdf') kind = M.docs[key] ? 'doc' : 'pdf';
        else if (ext === 'mp4' || ext === 'mov') kind = 'video';
        else if (ext === 'url') kind = 'link';
        else if (ext === 'docx') kind = 'word';
        Object.assign(e, { ext, key, kind, dir: segs.join('/'), segs, path: [...segs, e.name].join('/') });
        FILES.push(e);
        BYKEY.set(key, e);
      }
    });
  })(TREE, [], null);

  const filesUnder = (path) => FILES.filter((f) => !path || f.dir === path || f.dir.startsWith(path + '/'));
  const kindLabel = (f) =>
    ({ heic: 'HEIC image', tif: 'TIFF image', tiff: 'TIFF image', dng: 'DNG raw image', jpg: 'JPEG image', jpeg: 'JPEG image', png: 'PNG image', pdf: 'PDF document', mp4: 'MPEG-4 movie', mov: 'QuickTime movie', url: 'Internet shortcut', docx: 'Word document' })[f.ext] || f.ext.toUpperCase();
  const fileName = (key) => (BYKEY.get(key) || {}).name || '';
  const pretty = (s) => s.replace(/_/g, ' ').replace('Potfolio', 'Portfolio');

  /* ------------------------------------------------------------------ site nodes */
  const NODES = [];
  const BYROUTE = new Map();
  (function index(node, parent, route) {
    node.parent = parent;
    node.route = route;
    NODES.push(node);
    BYROUTE.set(route, node);
    (node.children || []).forEach((c) => index(c, node, route ? `${route}/${c.slug}` : c.slug));
  })(SITE.tree, null, '');
  const HOME = SITE.tree;
  const TOP = HOME.children;
  const href = (n) => `#/${n.route}`;
  const ancestors = (n) => {
    const out = [];
    for (let p = n.parent; p; p = p.parent) out.unshift(p);
    return out;
  };
  const themeOf = (n) => {
    for (let p = n; p; p = p.parent) if (p.theme) return p.theme;
    return 'light';
  };
  const nodeForFile = (f) =>
    NODES.find((n) => n.fileNode === f.name && n.folder === f.dir) ||
    nodeForFolder(f.dir);
  const nodeForFolder = (path) => {
    let p = path;
    while (p) {
      const n = NODES.find((x) => x.folder === p && !x.fileNode);
      if (n) return n;
      p = p.split('/').slice(0, -1).join('/');
    }
    return null;
  };
  const nodeFiles = (n) => (n.fileNode ? FILES.filter((f) => f.dir === n.folder && f.name === n.fileNode) : filesUnder(n.folder));
  const countTags = (n) => {
    const files = nodeFiles(n);
    const by = {};
    files.forEach((f) => {
      const k = f.kind === 'pdf' ? 'doc' : f.kind === 'word' ? 'doc' : f.kind;
      by[k] = (by[k] || 0) + 1;
    });
    const parts = [];
    const sub = n.folder && !n.fileNode ? FOLDERS.get(n.folder) : null;
    const nDirs = sub ? sub.children.filter((c) => c.isDir).length : 0;
    if (nDirs) parts.push([nDirs, nDirs === 1 ? 'folder' : 'folders']);
    if (by.image) parts.push([by.image, by.image === 1 ? 'image' : 'images']);
    if (by.doc) parts.push([by.doc, by.doc === 1 ? 'document' : 'documents']);
    if (by.video) parts.push([by.video, by.video === 1 ? 'video' : 'videos']);
    if (by.link) parts.push([by.link, by.link === 1 ? 'link' : 'links']);
    return { files: files.length, parts };
  };

  /* ------------------------------------------------------------------ steam stats */
  const STEAM = SITE.steam.map((g, i) => ({ ...g, rank: i + 1 }));
  const TOTAL_HOURS = STEAM.reduce((s, g) => s + g.hours, 0);
  const TOTAL_ACH = STEAM.reduce((s, g) => s + g.got, 0);
  const PERFECT = STEAM.filter((g) => g.total && g.got === g.total);
  const GENRES = (() => {
    const m = new Map();
    STEAM.forEach((g) => {
      const e = m.get(g.genre) || { genre: g.genre, hours: 0, games: [] };
      e.hours += g.hours;
      e.games.push(g);
      m.set(g.genre, e);
    });
    return [...m.values()].sort((a, b) => b.hours - a.hours);
  })();
  const SHOTS = FILES.filter((f) => f.dir === 'Video_Game_Experience' && f.kind === 'image');

  /* ------------------------------------------------------------------ registries (reset per page) */
  let GROUPS = {};
  let CLEANUP = [];
  let SCROLLERS = [];
  let gid = 0;
  const group = (items) => {
    const id = `g${++gid}`;
    GROUPS[id] = items;
    return id;
  };

  /* ================================================================== small builders */
  const riseHTML = (text, start = 0) =>
    text
      .split(' ')
      .map((w, i) => `<span class="w"><span style="--i:${i + start}">${esc(w)}</span></span>`)
      .join(' ');

  const img = (src, alt = '', cls = '', lazy = true) =>
    `<img src="${esc(src)}" alt="${esc(alt)}"${cls ? ` class="${cls}"` : ''}${lazy ? ' loading="lazy"' : ''} decoding="async">`;

  const head = (title, desc, extra = '') => {
    if (!title && !desc) return '';
    const inner = `${title ? `<h2 class="h2 reveal">${esc(title)}</h2>` : ''}${desc ? `<p class="lede reveal" style="--d:80ms">${esc(desc)}</p>` : ''}`;
    return extra
      ? `<div class="section__head section__head--row"><div style="display:grid;gap:14px">${inner}</div>${extra}</div>`
      : `<div class="section__head">${inner}</div>`;
  };

  const railCtrl = () => `<div class="rail-ctrl"><button class="rail-btn" data-rail="-1" aria-label="Scroll left">${ICON.left}</button><button class="rail-btn" data-rail="1" aria-label="Scroll right">${ICON.right}</button></div>`;

  const crumbs = (n) => {
    const parts = ancestors(n).map((a) => `<a href="${href(a)}">${esc(a === HOME ? 'Home' : a.short || a.title)}</a><span class="sep">/</span>`);
    const folder = n.folder ? `<span class="folder" title="Original folder">${esc(n.fileNode ? `${n.folder}/${n.fileNode}` : n.folder)}</span>` : '';
    return `<nav class="crumbs reveal" aria-label="Breadcrumb">${parts.join('')}<span>${esc(n.short || n.title)}</span>${folder}</nav>`;
  };

  const tags = (n) => {
    const c = countTags(n);
    return c.parts.map(([v, l]) => `<span class="tag"><b>${v}</b> ${l}</span>`).join('');
  };

  const nodeCover = (n) => {
    if (n.poster) return `${A}${n.poster}.poster.jpg`;
    if (n.coverIsVideo) return `${A}${n.cover}.poster.jpg`;
    return thumbFor(n.cover);
  };

  const card = (n, i) => {
    const c = countTags(n);
    const label = n.fileNode ? n.fileNode : (n.folder || '').split('/').pop();
    const count = n.fileNode ? `Video · ${fmtDur(vidInfo(n.blocks[0].video).dur)}` : c.parts.map(([v, l]) => `${v} ${l}`).join(' · ');
    return `<a class="card reveal${n.fileNode ? ' card--file' : ''}" href="${href(n)}" style="--d:${(i % 3) * 90}ms">
      <div class="card__media">${img(nodeCover(n), n.title)}</div>
      <div class="card__body">
        <div class="card__kicker">${n.fileNode ? ICON.video : ICON.folder}<span class="mono">${esc(label)}</span></div>
        <h3 class="card__title">${esc(n.project || n.title)}</h3>
        <p class="card__text">${esc(n.project ? `${n.title} · ${n.tagline}` : n.tagline)}</p>
        <div class="card__foot"><span class="card__count">${esc(count)}</span><span class="card__arrow">${ICON.arrow}</span></div>
      </div></a>`;
  };

  /* ================================================================== blocks */
  const BLOCKS = {
    gallery(b) {
      let items;
      if (b.filters) {
        items = [];
        b.filters.forEach((f) => b.groups[f.id].forEach((name) => items.push({ img: b.prefix + name, series: f.id })));
      } else {
        items = b.items.map((it) => (typeof it === 'string' ? { img: it } : it));
      }
      const lbItems = items.map((it) => {
        const info = imgInfo(it.img);
        const file = fileName(it.img);
        return { ...info, title: it.title || file, file, series: it.series };
      });
      const g = group(lbItems);
      const chips = b.filters
        ? `<div class="chips reveal" role="toolbar" aria-label="Filter by series" data-chips="${g}">
            <button class="chip is-on" data-filter="*">All <small>${items.length}</small></button>
            ${b.filters.map((f) => `<button class="chip" data-filter="${f.id}" data-desc="${esc(f.desc)}">${esc(f.label)} <small>${b.groups[f.id].length}</small></button>`).join('')}
          </div><p class="chip-desc" id="${g}-desc">Showing all ${items.length} photographs.</p>`
        : '';
      const cells = lbItems
        .map(
          (it, i) => `<button class="jg__item" data-lb="${g}" data-i="${i}" ${it.series ? `data-series="${it.series}"` : ''} style="--ar:${(it.w / it.h).toFixed(4)}" aria-label="Open ${esc(it.title)}">
            <i></i>${img(it.thumb, it.title, '', true).replace('<img', '<img data-fade')}
            <span class="jg__cap">${esc(it.title)}${it.title !== it.file ? `<span>${esc(it.file)}</span>` : ''}</span></button>`
        )
        .join('');
      return `<section class="section"><div class="wrap">${head(b.title, b.desc)}${chips}
        <div class="jg${b.items && b.items[0] && b.items[0].title ? ' jg--titled' : ''}" style="--row:${b.height || 300}px" data-grid="${g}">${cells}</div></div></section>`;
    },

    docs(b) {
      const rows = b.items
        .map((d) => {
          const pages = docPages(d.doc);
          const g = group(pages.map((p) => ({ ...p, title: `${d.title} — page ${p.n} of ${pages.length}`, file: d.file })));
          return `<article class="doc reveal">
            <div class="doc__head"><div><h3 class="doc__title">${esc(d.title)}</h3><p class="doc__desc">${esc(d.desc || '')}</p></div>
              <div class="doc__meta"><span class="tag">${ICON.doc.replace('<svg', '<svg width="14" height="14"')} ${plural(pages.length, 'page')}</span><button class="btn btn--sm btn--ghost" data-lb="${g}" data-i="0">${ICON.expand} View</button></div></div>
            <div class="rail-wrap"><div class="rail">
              ${pages.map((p, i) => `<button class="page-thumb" data-lb="${g}" data-i="${i}" aria-label="Open page ${p.n}">${img(p.thumb, `${d.title} page ${p.n}`)}<span class="page-thumb__n">${p.n}</span></button>`).join('')}
            </div>${pages.length > 3 ? railCtrl() : ''}</div>
            <p class="mono muted mt-s">${esc(d.file || '')}</p>
          </article>`;
        })
        .join('');
      return `<section class="section"><div class="wrap">${head(b.title, b.desc)}${rows}</div></section>`;
    },

    posters(b) {
      const items = b.items.map((d) => {
        const p = docPages(d.doc)[0];
        return { ...p, title: d.title, file: d.file, desc: d.desc };
      });
      const g = group(items);
      return `<section class="section"><div class="wrap">${head(b.title, b.desc)}<div class="posters">
        ${items.map((p, i) => `<button class="poster reveal" style="--d:${i * 80}ms" data-lb="${g}" data-i="${i}"><div class="poster__img">${img(p.thumb, p.title)}</div><div><div class="poster__title">${esc(p.title)}</div><div class="poster__desc">${esc(p.desc)}</div></div></button>`).join('')}
      </div></div></section>`;
    },

    flipbook(b) {
      const pages = docPages(b.doc);
      const g = group(pages.map((p) => ({ ...p, title: `${fileName(b.doc)} — page ${p.n} of ${pages.length}`, file: (BYKEY.get(b.doc) || {}).path || '' })));
      return `<section class="section"><div class="wrap">${head(b.title, b.desc)}
        <div class="flip reveal" data-flip="${esc(b.doc)}" data-g="${g}" tabindex="0" aria-label="${esc(b.title)} — use arrow keys to turn pages">
          <div class="flip__stage"><div class="flip__book">
            <div class="flip__half flip__half--l is-empty"><img alt=""></div>
            <div class="flip__half flip__half--r"><img alt=""></div>
            <div class="flip__shadow"></div>
          </div></div>
          <div class="flip__bar">
            <button class="rail-btn" data-flip-go="-1" aria-label="Previous page">${ICON.left}</button>
            <input class="range" type="range" min="0" max="1" value="0" aria-label="Page">
            <button class="rail-btn" data-flip-go="1" aria-label="Next page">${ICON.right}</button>
            <span class="flip__label"></span>
          </div>
          <div class="center mt-s"><button class="more" data-flip-full>View full screen</button></div>
        </div></div></section>`;
    },

    videos(b) {
      const items = b.items.map((v) => ({ ...vidInfo(v.video), ...v }));
      return `<section class="section"><div class="wrap">${head(b.title, b.desc)}<div class="vgrid">${items.map((v, i) => vcard(v, i)).join('')}</div></div></section>`;
    },

    games(b) {
      const engines = ['Unity', 'Unreal Engine', 'Web'];
      const items = b.items.map((v) => (v.video ? { ...vidInfo(v.video), ...v } : v));
      const chips = `<div class="chips reveal" data-engine-chips><button class="chip is-on" data-engine="*">All <small>${items.length}</small></button>${engines
        .map((e) => `<button class="chip" data-engine="${e}">${e} <small>${items.filter((i) => i.engine === e).length}</small></button>`)
        .join('')}</div>`;
      return `<section class="section"><div class="wrap">${chips}<div class="vgrid vgrid--3 mt-m">${items.map((v, i) => (v.itch ? itchCard(v, i) : vcard(v, i))).join('')}</div></div></section>`;
    },

    film(b) {
      const v = vidInfo(b.video);
      return `<section class="section"><div class="wrap--wide">
        <div class="film reveal reveal--scale" data-film>
          <video preload="none" playsinline controls poster="${esc(v.poster)}" data-src="${esc(v.src)}"></video>
          <div class="film__poster" role="button" tabindex="0" aria-label="Play Velvet Dream">
            ${img(v.poster, 'Velvet Dream', '', false)}
            <div class="film__overlay"><span class="eyebrow" style="color:#d2d2d7">Short film · ${fmtDur(v.dur)}</span><span class="film__title">Velvet Dream</span><span class="bigplay">${ICON.play}</span></div>
          </div>
        </div></div>
        <div class="wrap links-row mt-m"><span class="mono muted">${esc(b.file)} · ${v.w}×${v.h} web version (${fmtNum(v.mb, 0)} MB)</span></div>
      </section>`;
    },

    phones(b) {
      return `<section class="section section--alt"><div class="wrap">${head(b.title, b.desc)}<div class="phones">
        ${b.items.map((p, i) => { const v = vidInfo(p.video); return `<figure class="phone reveal" style="--d:${i * 90}ms"><div class="phone__frame"><video muted loop playsinline preload="none" data-auto="${esc(v.src)}" poster="${esc(v.poster)}" aria-label="${esc(p.title)}"></video></div><figcaption class="phone__title">${esc(p.title)}</figcaption><span class="phone__file">${esc(p.file)}</span></figure>`; }).join('')}
      </div></div></section>`;
    },

    wide(b) {
      const items = b.items.map((k) => ({ ...imgInfo(k), title: fileName(k), file: fileName(k) }));
      const g = group(items);
      return `<section class="section"><div class="wrap">${head(b.title, b.desc)}<div class="wides">
        ${items.map((it, i) => `<button class="wide reveal" data-lb="${g}" data-i="${i}" aria-label="Open ${esc(it.title)}">${img(it.src, it.title)}</button>`).join('')}
      </div></div></section>`;
    },

    pdf(b) {
      return `<section class="section"><div class="wrap">${head(b.title, b.desc)}
        <div class="pdfbox reveal"><iframe src="${esc(b.src)}#view=FitH" loading="lazy" title="${esc(b.title)}"></iframe>
        <div class="pdfbox__bar"><span class="mono muted">${esc(b.file)}</span><a class="more more--ext" href="${esc(b.src)}" target="_blank" rel="noopener">Open in a new tab</a></div></div>
      </div></section>`;
    },

    scrollshots(b) {
      const items = b.items.map((s) => ({ ...imgInfo(s.img), title: s.title, file: s.file }));
      const g = group(items);
      return `<section class="section section--alt"><div class="wrap">${head(b.title, b.desc)}<div class="shots">
        ${items.map((s, i) => `<figure class="browser reveal" style="--d:${i * 100}ms">
          <div class="browser__bar"><i></i><i></i><i></i><span>partly — ${esc(s.title)}</span></div>
          <div class="browser__view" data-shot>${img(s.src, s.title)}</div>
          <figcaption class="browser__meta"><b>${esc(s.title)}</b><button class="more" data-lb="${g}" data-i="${i}">Full page</button></figcaption></figure>`).join('')}
      </div></div></section>`;
    },

    models(b) {
      return `<section class="section"><div class="wrap"><div class="models">
        ${b.items.map((m, i) => `<article class="model reveal" style="--d:${i * 90}ms">
          <div class="model__view" data-model="${esc(m.uid)}" data-title="${esc(m.title)}">
            <div class="cube" style="--s:120px;width:120px">${'<i></i>'.repeat(6)}</div>
            <button class="btn btn--sm model__load" data-load-model>${ICON.game} Load 3D viewer</button>
          </div>
          <div class="model__body"><span class="eyebrow">${esc(m.desc)}</span><h3 class="model__title">${esc(m.title)}</h3>
            <a class="more more--ext" href="https://sketchfab.com/models/${esc(m.uid)}" target="_blank" rel="noopener">View on Sketchfab</a>
            <span class="mono muted" style="margin-top:6px">${esc(m.file)}</span></div>
        </article>`).join('')}
      </div><p class="small muted mt-m">The interactive viewer is loaded from Sketchfab only when you ask for it.</p></div></section>`;
    },

    paper(b) {
      const authors = b.authors.map((a, i) => (i === b.me ? `<b>${esc(a)}</b>` : esc(a))).join('<span class="sep">, </span>');
      const ext = (href, label, cls = 'btn') => `<a class="${cls}" href="${esc(href)}" target="_blank" rel="noopener">${label}</a>`;
      const cites = Object.entries(b.cite);
      return `
      <section class="section section--tight" style="padding-top:0"><div class="wrap">
        <div class="paper-bar reveal">
          <p class="paper-bar__authors">${authors}</p>
          <div class="links-row">${ext(b.url, 'Read on IOPscience ↗')}${ext(b.pdf, `${ICON.download} PDF`, 'btn btn--ghost')}<button class="btn btn--ghost" data-copy="cite-APA">Copy citation</button></div>
        </div>
        <dl class="facts reveal mt-l">${b.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}
          <div><dt>DOI</dt><dd>${ext(`https://doi.org/${b.doi}`, esc(b.doi), 'more more--ext')}</dd></div></dl>
        <div class="stats stats--line mt-l">${b.stats.map(([v, l], i) => `<div class="stat reveal" style="--d:${i * 80}ms"><span class="stat__value">${esc(v)}</span><span class="stat__label">${esc(l)}</span></div>`).join('')}</div>
      </div></section>

      <section class="section section--alt"><div class="wrap">
        ${head('Why red dwarfs?', 'A transiting planet blocks a fraction (r ⁄ R)² of its star’s light. Shrink the star and the same planet casts a much deeper shadow — and the habitable zone moves closer in, so transits repeat more often. That is why the smallest, most common stars are good places to look for Earth-size worlds.')}
        <div class="transit reveal" data-transit>
          <canvas aria-label="Animated transit: a planet crossing its star and the resulting dip in brightness"></canvas>
          <div class="transit__ctl">
            <div class="chips" role="radiogroup" aria-label="Star">
              <button class="chip is-on" data-star="dwarf" role="radio" aria-checked="true">Red dwarf · 0.36 R☉</button>
              <button class="chip" data-star="sun" role="radio" aria-checked="false">Sun-like · 1 R☉</button>
            </div>
            <label class="transit__slider"><span>Planet size <b data-out="rp">1.0 R⊕</b></span><input class="range" type="range" min="0.5" max="11" step="0.1" value="1" aria-label="Planet radius in Earth radii"></label>
            <div class="transit__read">
              <div><span class="transit__big" data-out="depth"></span><span class="small muted">transit depth on this star</span></div>
              <div><span class="transit__big" data-out="other"></span><span class="small muted" data-out="otherLabel"></span></div>
              <div><span class="transit__big">${fmtNum(1 / (0.36 * 0.36), 1)}×</span><span class="small muted">deeper on the red dwarf, for any planet size</span></div>
            </div>
            <div class="transit__legend small muted"><span><i class="key key--solid"></i>Selected star</span><span><i class="key key--dash"></i>The other star, same planet</span></div>
          </div>
        </div>
        <p class="small muted mt-s">Drawn to scale with a uniform-disk model. 0.36 R☉ is the radius the paper estimates for each red dwarf in GJ 257.</p>
      </div></section>

      <section class="section"><div class="wrap">
        ${head('Method', 'How the search worked, in four steps.')}
        <ol class="steps">${b.steps.map(([t, d], i) => `<li class="step reveal" style="--d:${i * 80}ms"><span class="step__n">0${i + 1}</span><h3 class="step__t">${esc(t)}</h3><p class="muted">${esc(d)}</p></li>`).join('')}</ol>
        <div class="formulas mt-l">${b.formulas.map(([f, d], i) => `<div class="formula reveal" style="--d:${i * 80}ms"><span class="formula__f">${esc(f)}</span><span class="small muted">${esc(d)}</span></div>`).join('')}</div>
      </div></section>

      <section class="section section--alt"><div class="wrap">
        ${head('Findings', 'Two systems stood out.')}
        <div class="findings">${b.findings.map((f, i) => `<article class="finding reveal" style="--d:${i * 100}ms">
          <span class="eyebrow">Candidate 0${i + 1}</span>
          <h3 class="finding__name">${esc(f.name)}<small>${esc(f.alias)}</small></h3>
          <p class="muted">${esc(f.text)}</p>
          <dl class="finding__data">${f.data.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></article>`).join('')}</div>
      </div></section>

      <section class="section"><div class="wrap">
        ${head('Set aside', 'Eight other flagged stars, and why each was dropped.')}
        <div class="ruled">${b.setAside.map(([why, stars], i) => `<div class="ruled__row reveal" style="--d:${i * 80}ms"><h4>${esc(why)}</h4><div class="pills">${stars.map((s) => `<span class="pill">${esc(s)}</span>`).join('')}</div></div>`).join('')}</div>
        <p class="lede mt-l reveal">${esc(b.next)}</p>
      </div></section>

      <section class="section section--alt"><div class="wrap">
        ${head('Cite this paper')}
        <div class="cite reveal">
          <div class="chips" data-cite-tabs>${cites.map(([k], i) => `<button class="chip${i === 0 ? ' is-on' : ''}" data-cite="${esc(k)}">${esc(k)}</button>`).join('')}</div>
          ${cites.map(([k, v], i) => `<pre class="cite__text" id="cite-${esc(k)}"${i ? ' hidden' : ''}>${esc(v)}</pre>`).join('')}
          <div class="links-row"><button class="btn btn--sm" data-copy="current">Copy</button>${ext(b.url, 'View on IOPscience', 'more more--ext')}</div>
        </div>
        <p class="small muted mt-m">Open access under the Creative Commons Attribution 3.0 licence. Published under licence by IOP Publishing Ltd.</p>
        <p class="mono muted mt-s">${esc(b.file)}</p>
      </div></section>`;
    },

    experience: () => experienceHTML(),
    ucdavis: () => ucdavisHTML(),
    scad: () => scadHTML(),
  };

  function vcard(v, i) {
    return `<article class="vcard reveal" style="--d:${(i % 3) * 90}ms" data-video="${esc(v.key)}" data-title="${esc(v.title)}" data-file="${esc(v.file || '')}" ${v.engine ? `data-engine="${esc(v.engine)}"` : ''} tabindex="0" role="button" aria-label="Play ${esc(v.title)}">
      <div class="vcard__media">${img(v.poster, v.title)}${v.engine ? `<span class="vcard__badge">${esc(v.engine)}</span>` : ''}<span class="vcard__play">${ICON.play} ${fmtDur(v.dur)}</span><span class="vcard__progress"></span></div>
      <h3 class="vcard__title">${esc(v.title)}</h3>
      ${v.desc ? `<p class="vcard__desc">${esc(v.desc)}</p>` : ''}
      ${v.file ? `<span class="vcard__file">${esc(v.file)}</span>` : ''}
    </article>`;
  }

  function itchCard(v, i) {
    return `<article class="vcard reveal" style="--d:${(i % 3) * 90}ms" data-engine="Web">
      <a class="vcard__media itchcard__media" href="${esc(v.itch)}" target="_blank" rel="noopener" aria-label="Play ${esc(v.title)} on itch.io">
        <span class="itchcard__house">${ICON.house}</span><span class="vcard__badge">HTML5 · itch.io</span><span class="vcard__play">${ICON.play} Play in browser</span></a>
      <h3 class="vcard__title">${esc(v.title)}</h3>
      <p class="vcard__desc">${esc(v.desc)}</p>
      <div class="links-row"><a class="more more--ext" href="${esc(v.itch)}" target="_blank" rel="noopener">Open on itch.io</a><button class="more" data-itch="${esc(v.itchId)}">Show itch.io widget</button></div>
      <span class="vcard__file">${esc(v.file)}</span>
    </article>`;
  }

  /* ================================================================== pages */
  function renderNode(n) {
    const theme = themeOf(n);
    const kids = n.children || [];
    let html = `<div class="page">
      <section class="phead"><div class="wrap">${crumbs(n)}
        <h1 class="h1 phead__title${(n.project || '').length > 40 ? ' is-xl' : n.title.length > 22 && !n.project ? ' is-long' : ''} reveal" style="--d:60ms">${esc(n.project || n.title)}${n.project ? `<span class="phead__project">${esc(n.title)}</span>` : ''}</h1>
        ${n.intro ? `<p class="lede phead__lede reveal" style="--d:140ms">${esc(n.intro)}</p>` : ''}
        <div class="phead__meta reveal" style="--d:200ms">${tags(n)}</div>
      </div></section>`;

    if (n.facts) {
      html += `<section class="section section--tight" style="padding-top:0"><div class="wrap"><dl class="facts reveal">${n.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></div></section>`;
    }

    if (kids.length) {
      const folders = kids.filter((k) => !k.fileNode);
      const files = kids.filter((k) => k.fileNode);
      html += `<section class="section section--tight" style="padding-top:0"><div class="wrap">
        <div class="cards${folders.length >= 3 ? ' cards--3' : folders.length === 1 ? ' cards--one' : ''}">${folders.map(card).join('')}</div>
        ${files.length || (n.links || []).length ? `<h2 class="h3 mt-l reveal" style="margin-bottom:18px">Files in this folder</h2><div class="cards">${files.map(card).join('')}${linkCards(n.links)}</div>` : ''}
      </div></section>`;
    } else if (n.links) {
      html += `<section class="section section--tight"><div class="wrap"><div class="cards">${linkCards(n.links)}</div></div></section>`;
    }

    (n.blocks || []).forEach((b) => (html += BLOCKS[b.kind](b, n)));
    html += nextUp(n);
    html += '</div>';

    const nav = kids.length ? kids : n.parent && n.parent !== HOME ? n.parent.children : [];
    const lnavTitleNode = kids.length ? n : n.parent && n.parent !== HOME ? n.parent : n;
    return { html, theme, title: n.project ? `${n.project} — ${n.title}` : n.title, lnav: lnavHTML(lnavTitleNode, nav, n) };
  }

  function linkCards(links) {
    return (links || [])
      .map((l) => `<a class="filecard reveal" href="${esc(l.url)}" target="_blank" rel="noopener"><span class="filecard__icon">${ICON.link}</span><span><span class="filecard__name">${esc(l.title)}</span><span class="filecard__desc" style="display:block">${esc(l.desc)}</span><span class="mono muted" style="display:block;margin-top:6px">${esc(l.file)}</span></span><span class="more more--ext"></span></a>`)
      .join('');
  }

  function nextUp(n) {
    if (!n.parent || n.parent === HOME) {
      const i = TOP.indexOf(n);
      const next = TOP[(i + 1) % TOP.length];
      return nextSection(next, 'Next folder');
    }
    const sibs = n.parent.children;
    const i = sibs.indexOf(n);
    if (i < sibs.length - 1) return nextSection(sibs[i + 1], 'Next in ' + (n.parent.short || n.parent.title));
    return nextSection(n.parent, 'Back to ' + (n.parent.short || n.parent.title));
  }
  function nextSection(t, label) {
    return `<section class="section section--alt section--tight"><div class="wrap"><a class="filecard reveal" href="${href(t)}" style="background:var(--bg)">
      <span class="filecard__icon" style="background:var(--card)">${ICON.folder}</span>
      <span><span class="eyebrow">${esc(label)}</span><span class="filecard__name" style="display:block">${esc(t.project || t.title)}</span><span class="filecard__desc" style="display:block">${esc(t.tagline || '')}</span></span>
      <span class="card__arrow">${ICON.arrow}</span></a></div></section>`;
  }

  function lnavHTML(titleNode, nav, current) {
    if (!titleNode || titleNode === HOME) return '';
    return `<nav class="lnav" aria-label="Section"><div class="lnav__inner">
      <a class="lnav__title" href="${href(titleNode)}">${esc(titleNode.short || titleNode.title)}</a>
      <div class="lnav__links">${(nav || []).map((k) => `<a href="${href(k)}" class="${k === current ? 'is-active' : ''}">${esc(k.short || k.title)}</a>`).join('')}</div>
    </div></nav>`;
  }

  /* ------------------------------------------------------------------ home */
  function renderHome() {
    const p = SITE.person;
    const reel = vidInfo('Game_Portfolio/My_Game_Production/ChanllengeGame_UE');
    const tile = (o) => `<a class="tile ${o.dark ? 'theme-dark' : 'theme-light'}${o.full ? ' tile--full' : ''} reveal reveal--fade" href="${o.href}">
        <h3 class="tile__title">${esc(o.title)}</h3><p class="tile__sub">${esc(o.sub)}</p>
        <div class="links-row">${o.links.map((l) => `<span class="more">${esc(l)}</span>`).join('')}</div>
        <div class="tile__media${o.mod ? ' tile__media--' + o.mod : ''}">${o.svg || img(o.img, o.title)}</div></a>`;
    const r = (route) => `#/${route}`;
    const tiles = [
      { full: true, title: 'Art & Design Portfolio', sub: 'Design. Painting & Drawing. Photography.', links: ['Explore the folder'], href: r('art-design'), img: fullFor('Art_Design_Potfolio/Design/Graphic_Design/Book_Design/IMG_4961') },
      { dark: true, title: 'Game Portfolio', sub: 'Six games in Unity, Unreal Engine and HTML5.', links: ['Watch gameplay'], href: r('games/production'), img: `${A}Game_Portfolio/My_Game_Production/ChanllengeGame_UE.poster.jpg` },
      { title: 'MoonWave', sub: 'Where soul meets rhythm — a festival identity.', links: ['See the system'], href: r('art-design/design/graphic-design/music-festival-design'), img: thumbFor('Art_Design_Potfolio/Design/Graphic_Design/Music_Festival_Design/3-posters/p02'), mod: 'book' },
      { dark: true, title: 'Velvet Dream', sub: 'A short film.', links: ['Watch the film'], href: r('art-design/design/velvet-dream'), img: `${A}Art_Design_Potfolio/Design/Film_Velvet-Dream.poster.jpg` },
      { title: 'Settle', sub: 'Finding a home, designed more humanely.', links: ['View the case study'], href: r('art-design/design/ui-ux/app-uiux'), img: thumbFor('Art_Design_Potfolio/Design/UI_UX/App_UIUX/P2-Deliverable-6/p02') },
      { dark: true, title: 'Photobook 2', sub: 'Night photography, in two parts.', links: ['Turn the pages'], href: r('art-design/photography/photobook-2'), img: thumbFor('Art_Design_Potfolio/Photography/Photobook_2/IMG_4938') },
      { title: 'Infinity', sub: 'An editorial book, printed and bound.', links: ['Read the book'], href: r('art-design/design/graphic-design/book-design'), img: thumbFor('Art_Design_Potfolio/Design/Graphic_Design/Book_Design/IMG_4959'), mod: 'book' },
      { dark: true, title: 'Play History', sub: `${fmtNum(TOTAL_HOURS)} hours across ${STEAM.length} games.`, links: ['Explore the library'], href: r('play'), img: thumbFor('Video_Game_Experience/Screenshot-2026-11-02-162822') },
      { title: 'Visualize Air Pollution', sub: 'California’s air quality, in relief.', links: ['See the installation'], href: r('art-design/design/large-installation-design'), img: thumbFor('Art_Design_Potfolio/Design/Large_Installation_Design/IMG_4745') },
      { dark: true, title: 'Painting & Drawing', sub: 'Still life, landscape, portrait, collage.', links: ['View the work'], href: r('art-design/painting-drawing'), img: thumbFor('Art_Design_Potfolio/Painting_Drawing/Screenshot-2026-11-02-095448') },
      { title: 'On the Way', sub: 'Photobook 1 — reading rooms, stairwells and doorways.', links: ['Turn the pages'], href: r('art-design/photography/photobook-1'), img: thumbFor('Art_Design_Potfolio/Photography/Photobook_1/IMG_4899') },
      { full: true, dark: true, title: 'Published Physics Paper', sub: 'Exoplanets transiting red dwarfs within 50 light-years — Journal of Physics: Conference Series, 2022.', links: ['Read the research'], href: r('physics-paper'), mod: 'art', svg: TRANSIT_ART },
    ];
    const works = [
      ['Book Design', 'Infinity', 'art-design/design/graphic-design/book-design', 'Art_Design_Potfolio/Design/Graphic_Design/Book_Design/Project-3-Final-Book/p04'],
      ['Music Festival Design', 'MoonWave posters', 'art-design/design/graphic-design/music-festival-design', 'Art_Design_Potfolio/Design/Graphic_Design/Music_Festival_Design/3-posters/p01'],
      ['Graphic Design', 'The Game Awards 2024', 'art-design/design/graphic-design/other', 'Art_Design_Potfolio/Design/Graphic_Design/Other/Poster_1/p01'],
      ['Photography', 'Pinhole', 'art-design/photography', 'Art_Design_Potfolio/Photography/Pinhole-6'],
      ['Photobook 1', 'On the Way', 'art-design/photography/photobook-1', 'Art_Design_Potfolio/Photography/Photobook_1/Photobook2_v2/p07'],
      ['Game Production', '3D Ghost Game', 'games/production', 'Game_Portfolio/My_Game_Production/3D_Ghost_Game_Unity'],
      ['Graphic Design', 'Times New Roman', 'art-design/design/graphic-design/other', 'Art_Design_Potfolio/Design/Graphic_Design/Other/PROJ_2_JinKun_to-print/p01'],
      ['Painting & Drawing', 'Leather Jacket', 'art-design/painting-drawing', 'Art_Design_Potfolio/Painting_Drawing/Screenshot-2026-11-02-095525'],
      ['Photography', 'Cyanotype', 'art-design/photography', 'Art_Design_Potfolio/Photography/cyanotype-2'],
      ['Photobook 2', 'Varsity', 'art-design/photography/photobook-2', 'Art_Design_Potfolio/Photography/Photobook_2/Part-2/p02'],
    ];
    const u = SITE.education.ucdavis;
    const s = SITE.education.scad;
    const html = `<div class="page">
      <section class="hero theme-dark" data-hero>
        <div class="hero__grid"><canvas></canvas></div>
        <div class="hero__inner wrap">
          <p class="hero__eyebrow rise">${riseHTML('Portfolio — 2026')}</p>
          <h1 class="display hero__title rise">${riseHTML(p.name, 2)}</h1>
          <p class="hero__sub rise">${riseHTML('Game developer, designer,', 4)} <em>${riseHTML('and artist.', 7)}</em></p>
          <div class="hero__cta reveal" style="--d:900ms"><a class="btn" href="#/games">See the games</a><a class="btn btn--ghost" href="#/art-design">Art &amp; design</a></div>
        </div>
        <div class="hero__scroll" aria-hidden="true"></div>
      </section>

      <section class="zoom theme-dark" data-zoom aria-label="Showreel">
        <div class="zoom__sticky">
          <span class="zoom__label">Challenge Game · Unreal Engine</span>
          <div class="zoom__media">
            <video muted loop playsinline preload="none" poster="${esc(reel.poster)}" data-src="${esc(reel.src)}#t=6"></video>
            <div class="zoom__caption"><h2 class="h2">Built to be played.</h2><p>Six games across Unity, Unreal Engine and the web.</p><p style="margin-top:18px"><a class="btn" href="#/games/production" style="background:#fff;color:#000">Watch gameplay</a></p></div>
          </div>
        </div>
      </section>

      <section class="section theme-light"><div class="wrap--narrow"><p class="eyebrow reveal" style="margin-bottom:22px">About</p><p class="scrub" data-scrub>${p.statement.split(' ').map((w) => `<span class="sw">${esc(w)}</span>`).join(' ')}</p>
        <div class="links-row mt-m reveal"><a class="more" href="#/resume">Read the résumé</a><a class="more" href="#/archive">Browse every file</a></div></div></section>

      <section class="section section--tight theme-light" style="padding-top:0"><div class="wrap"><div class="stats stats--line">
        ${stat(6, '', 'games built in Unity, Unreal Engine and HTML5', 0)}
        ${stat(3.856, '', 'GPA at UC Davis, with four Dean’s List honors', 3)}
        ${stat(42, '$', 'thousand in SCAD scholarships for the MFA', 0, 'K')}
        ${stat(Math.round(TOTAL_HOURS), '', `hours played across ${STEAM.length} Steam games`, 0)}
      </div></div></section>

      <section class="theme-light" style="background:#f5f5f7"><div class="tiles">${tiles.map(tile).join('')}</div></section>

      <section class="section theme-light"><div class="wrap">
        ${head('Selected work', 'A few favorites from across the folders.', railCtrl())}
        <div class="rail" data-rail-target>${works.map(([k, t, route, key]) => `<a class="wcard" href="#/${route}"><div class="wcard__media">${img(thumbFor(key), t)}</div><span class="wcard__kicker">${esc(k)}</span><span class="wcard__title">${esc(t)}</span></a>`).join('')}</div>
      </div></section>

      <section class="section theme-dark"><div class="wrap"><div class="split">
        <div>${head('From Davis to Savannah.', 'A dual major in Art Studio and Design, a summer designing game systems in Beijing, and now an MFA in Game Development.')}</div>
        <div class="timeline">
          ${tl(u.dates, u.school, `${u.degree}, ${u.major.replace('Dual Major', 'dual major')} · GPA ${u.gpa} · Dean’s List ×${u.deansList.length}`, '#/uc-davis', 'Diploma & transcript')}
          ${tl('Jun 2024 – Aug 2024', 'SINCETIMES, Beijing', 'Game Planning Assistant — arena system design for “Battleship Empire.”', '#/resume', 'Résumé')}
          ${tl(s.dates, s.school, `${s.degree}, ${s.major} · $42,000 in scholarships`, '#/scad', 'Letters')}
        </div>
      </div></div></section>

      <section class="section theme-light center"><div class="wrap--narrow">
        <h2 class="display reveal" style="font-size:clamp(44px,7vw,88px)">Let’s make something.</h2>
        <p class="lede reveal mt-s" style="--d:80ms">Based in ${esc(p.location)}. Open to collaborations, internships and game projects.</p>
        <div class="hero__cta reveal mt-m" style="--d:160ms;justify-content:center;display:flex;gap:14px;flex-wrap:wrap"><a class="btn" href="mailto:${esc(p.email)}">${ICON.mail} Email me</a><a class="btn btn--ghost" href="${esc(SITE.resume.file)}" download>${ICON.download} Résumé (.docx)</a></div>
      </div></section>
    </div>`;
    return { html, theme: 'dark', title: `${p.name} — ${p.role.replace(/\.$/, '')}`, lnav: '' };
  }

  function stat(v, prefix, label, dec, suffix = '') {
    return `<div class="stat reveal"><span class="stat__value"><span data-count="${v}" data-dec="${dec}" data-prefix="${prefix}" data-suffix="${suffix}">${prefix}${fmtNum(v, dec)}${suffix}</span></span><span class="stat__label">${esc(label)}</span></div>`;
  }
  function tl(when, title, text, link, linkLabel) {
    return `<div class="tl reveal"><span class="tl__dot"></span><div><div class="tl__when">${esc(when)}</div><div class="tl__title">${esc(title)}</div><p class="tl__text">${esc(text)}</p><a class="more mt-s" href="${link}">${esc(linkLabel)}</a></div></div>`;
  }

  /* ------------------------------------------------------------------ play history */
  function experienceHTML() {
    const shotsG = group(SHOTS.map((f) => ({ ...imgInfo(f.key), title: `Steam library — screenshot ${SHOTS.indexOf(f) + 1} of ${SHOTS.length}`, file: f.name })));
    GROUPS.shots = GROUPS[shotsG];
    const maxG = GENRES[0].hours;
    return `
      <section class="section section--tight" style="padding-top:0"><div class="wrap">
        <div class="reveal"><span class="hero-figure"><span data-count="${Math.round(TOTAL_HOURS)}" data-dec="0">${fmtNum(TOTAL_HOURS)}</span><small>hours</small></span></div>
        <p class="lede mt-s reveal">played across ${STEAM.length} games — racing sims, shooters, open worlds and narrative games. Every one is a lesson in how games feel.</p>
        <div class="stats stats--line mt-l">
          <div class="stat reveal"><span class="stat__value">${fmtNum(STEAM[0].hours)}</span><span class="stat__label">hours in ${esc(STEAM[0].title)}, the most played</span></div>
          <div class="stat reveal" style="--d:80ms"><span class="stat__value"><span data-count="${TOTAL_ACH}" data-dec="0">${fmtNum(TOTAL_ACH)}</span></span><span class="stat__label">achievements unlocked</span></div>
          <div class="stat reveal" style="--d:160ms"><span class="stat__value">${PERFECT.length}</span><span class="stat__label">100% completions — ${PERFECT.map((g) => esc(g.title)).join(' and ')}</span></div>
          <div class="stat reveal" style="--d:240ms"><span class="stat__value">${fmtNum(GENRES.find((g) => g.genre === 'Racing').hours)}</span><span class="stat__label">hours of racing — Forza, F1 and Le Mans</span></div>
        </div>
      </div></section>

      <section class="section section--alt"><div class="wrap">
        ${head('Hours by genre', 'Genres assigned per title. Hover a bar for details.')}
        <div class="hbars reveal">${GENRES.map((g, i) => {
          const top = g.games[0];
          const tip = `<b>${esc(g.genre)}</b>${fmtNum(g.hours)} hours · ${plural(g.games.length, 'game')}<br>${Math.round((g.hours / TOTAL_HOURS) * 100)}% of all play · top: ${esc(top.title)}`;
          return `<div class="hbar" data-tip="${esc(tip)}" style="--i:${i}"><span class="hbar__label">${esc(g.genre)}</span><span class="hbar__track"><span class="hbar__fill" style="--v:${(g.hours / maxG).toFixed(4)}"></span><span class="hbar__value">${fmtNum(g.hours)} h · ${Math.round((g.hours / TOTAL_HOURS) * 100)}%</span></span></div>`;
        }).join('')}</div>
      </div></section>

      <section class="section" id="library"><div class="wrap">
        ${head('The library', 'Search, filter and sort all 66 games.')}
        <div class="libctl reveal">
          <label class="search">${ICON.search}<input type="search" id="lib-q" placeholder="Search games" autocomplete="off" aria-label="Search games"></label>
          <select class="select" id="lib-sort" aria-label="Sort">
            <option value="hours">Most played</option><option value="title">Name (A–Z)</option><option value="done">Completion</option><option value="last">Recently played</option>
          </select>
        </div>
        <div class="chips reveal" id="lib-genres"><button class="chip is-on" data-genre="*">All <small>${STEAM.length}</small></button>${GENRES.map((g) => `<button class="chip" data-genre="${esc(g.genre)}">${esc(g.genre)} <small>${g.games.length}</small></button>`).join('')}</div>
        <div class="lib__head lib__row" aria-hidden="true"><span>#</span><span>Game</span><span>Hours played</span><span>Achievements</span><span>Last played</span><span></span></div>
        <div class="lib" id="lib-rows" aria-live="polite"></div>
        <div class="lib__more"><button class="btn btn--ghost" id="lib-more">Show all ${STEAM.length}</button></div>
      </div></section>

      <section class="section section--alt"><div class="wrap">
        ${head('The source', 'The eleven Steam library screenshots in this folder, transcribed above.')}
        <div class="jg" style="--row:240px">${SHOTS.map((f, i) => { const info = imgInfo(f.key); return `<button class="jg__item" data-lb="${shotsG}" data-i="${i}" style="--ar:${(info.w / info.h).toFixed(4)}"><i></i><img data-fade src="${info.thumb}" alt="${esc(f.name)}" loading="lazy"><span class="jg__cap">${esc(f.name)}</span></button>`; }).join('')}</div>
      </div></section>`;
  }

  function initLibrary(root, query) {
    const rows = $('#lib-rows', root);
    if (!rows) return;
    const q = $('#lib-q', root);
    const sort = $('#lib-sort', root);
    const more = $('#lib-more', root);
    let genre = '*';
    let all = false;
    if (query.get('q')) q.value = query.get('q');
    const ring = (g) => {
      const c = 2 * Math.PI * 8;
      const pct = g.total ? g.got / g.total : 0;
      return `<svg class="ring" viewBox="0 0 22 22" aria-hidden="true"><circle class="bg" cx="11" cy="11" r="8"/><circle class="fg" cx="11" cy="11" r="8" stroke-dasharray="${(c * pct).toFixed(2)} ${c.toFixed(2)}"/></svg>`;
    };
    const draw = () => {
      const term = q.value.trim().toLowerCase();
      let list = STEAM.filter((g) => (genre === '*' || g.genre === genre) && (!term || g.title.toLowerCase().includes(term) || g.genre.toLowerCase().includes(term)));
      const by = sort.value;
      list = list.slice().sort((a, b) =>
        by === 'title' ? a.title.localeCompare(b.title) :
        by === 'done' ? (b.total ? b.got / b.total : -1) - (a.total ? a.got / a.total : -1) :
        by === 'last' ? b.last.localeCompare(a.last) : b.hours - a.hours);
      const max = Math.max(...list.map((g) => g.hours), 1);
      const shown = all || term ? list : list.slice(0, 20);
      rows.innerHTML = shown.length
        ? shown.map((g) => `<div class="lib__row">
            <span class="lib__rank">${g.rank}</span>
            <div class="lib__title">${esc(g.title)}<span>${esc(g.genre)}</span></div>
            <div class="lib__hours"><div class="lib__barwrap"><div class="lib__bar" style="--v:${(g.hours / max).toFixed(4)}"></div></div><span class="lib__h">${fmtNum(g.hours, g.hours % 1 ? 1 : 0)} h</span></div>
            <div class="lib__ach">${g.total ? `${ring(g)}${g.got}/${g.total}` : '<span class="muted">—</span>'}</div>
            <span class="lib__last">${fmtDate(g.last)}</span>
            <button class="lib__shot" data-lb="shots" data-i="${g.shot}" aria-label="See ${esc(g.title)} in the original screenshot" title="See it in the original screenshot">${ICON.image}</button>
          </div>`).join('')
        : `<p class="lib__empty">No games match “${esc(q.value)}”.</p>`;
      more.parentElement.style.display = !term && list.length > 20 ? '' : 'none';
      more.textContent = all ? 'Show top 20' : `Show all ${list.length}`;
    };
    q.addEventListener('input', draw);
    sort.addEventListener('change', draw);
    more.addEventListener('click', () => {
      all = !all;
      draw();
    });
    $('#lib-genres', root).addEventListener('click', (e) => {
      const c = e.target.closest('[data-genre]');
      if (!c) return;
      genre = c.dataset.genre;
      $$('#lib-genres .chip', root).forEach((x) => x.classList.toggle('is-on', x === c));
      draw();
    });
    draw();
    if (query.get('q')) setTimeout(() => $('#library').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }), 300);
  }

  /* ------------------------------------------------------------------ UC Davis */
  function ucdavisHTML() {
    const u = SITE.education.ucdavis;
    const dip = imgInfo(u.diploma);
    const dg = group([{ ...dip, title: 'UC Davis diploma — Bachelor of Arts', file: fileName(u.diploma) }]);
    const letters = u.deansList.map((d) => ({ ...docPages(d.doc)[0], title: `Dean’s Honors List — ${d.term}`, file: d.file }));
    const lg = group(letters);
    const tr = docPages(u.transcript.doc);
    const tg = group(tr.map((p) => ({ ...p, title: `Transcript — page ${p.n} of ${tr.length}`, file: u.transcript.file })));
    return `
      <section class="section section--alt"><div class="wrap">
        <div class="diploma reveal reveal--scale"><button class="diploma__card" data-tilt data-lb="${dg}" data-i="0" aria-label="Open the diploma">${img(dip.src, 'UC Davis diploma', '', false)}<span class="diploma__glare"></span></button></div>
        <p class="center small muted mt-m">${esc(fileName(u.diploma))} — move your pointer over the diploma.</p>
      </div></section>
      <section class="section section--tight"><div class="wrap"><div class="stats stats--line">
        ${stat(3.856, '', 'cumulative GPA out of 4.0', 3)}
        <div class="stat reveal" style="--d:80ms"><span class="stat__value">×${u.deansList.length}</span><span class="stat__label">Dean’s Honors List, College of Letters and Science</span></div>
        <div class="stat reveal" style="--d:160ms"><span class="stat__value">2</span><span class="stat__label">majors — Art Studio and Design</span></div>
        <div class="stat reveal" style="--d:240ms"><span class="stat__value">2026</span><span class="stat__label">graduated, Bachelor of Arts (Sep 2022 – Jun 2026)</span></div>
      </div></div></section>
      <section class="section"><div class="wrap">
        ${head('Dean’s Honors List', 'Four letters from the College of Letters and Science. Open any one.')}
        <div class="deans">${u.deansList.map((d, i) => `<button class="dean reveal" style="--d:${i * 80}ms" data-lb="${lg}" data-i="${i}"><span class="dean__n">0${i + 1}</span><span><span class="dean__term" style="display:block">${esc(d.term)}</span><span class="dean__date">Letter dated ${esc(d.date)}</span></span><span class="dean__open">${ICON.doc.replace('<svg', '<svg width="14" height="14"')} ${esc(d.file)}</span></button>`).join('')}</div>
      </div></section>
      <section class="section section--alt"><div class="wrap">
        ${head('Core courses', 'From the résumé.')}
        <div class="pills reveal">${u.courses.map((c) => `<span class="pill">${esc(c)}</span>`).join('')}</div>
      </div></section>
      <section class="section"><div class="wrap">
        ${head('Transcript', 'Office of the University Registrar — three pages.')}
        <div class="rail-wrap"><div class="rail">${tr.map((p, i) => `<button class="page-thumb" style="height:clamp(280px,40vw,460px)" data-lb="${tg}" data-i="${i}" aria-label="Open transcript page ${p.n}">${img(p.thumb, `Transcript page ${p.n}`)}<span class="page-thumb__n">${p.n}</span></button>`).join('')}</div></div>
        <p class="mono muted mt-s">${esc(u.transcript.file)}</p>
      </div></section>`;
  }

  /* ------------------------------------------------------------------ SCAD */
  function scadHTML() {
    const s = SITE.education.scad;
    const letters = s.letters.map((l) => ({ ...imgInfo(l.img), title: `${l.title} — ${l.date}`, file: l.file }));
    const lg = group(letters);
    const perYear = s.awards.reduce((a, w) => a + w.amount, 0);
    return `
      <section class="section section--tight" style="padding-top:0"><div class="wrap"><dl class="facts reveal">
        <div><dt>Program</dt><dd>${esc(s.degree)} — ${esc(s.major)}</dd></div>
        <div><dt>Dates</dt><dd>${esc(s.dates)}</dd></div>
        <div><dt>Campus</dt><dd>Savannah, Georgia</dd></div>
        <div><dt>Required intensive coursework</dt><dd>GAME 505 Game Art Methods</dd></div>
        <div><dt>English as a Second Language</dt><dd>Exempt</dd></div>
      </dl></div></section>
      <section class="section section--alt"><div class="wrap">
        <p class="eyebrow reveal">Scholarships</p>
        <div class="reveal mt-s"><span class="hero-figure">$<span data-count="${perYear * 2}" data-dec="0">${fmtNum(perYear * 2)}</span></span></div>
        <p class="lede reveal mt-s">over two years — ${'$' + fmtNum(perYear)} per academic year, or $7,000 per quarter.</p>
        <div class="awards mt-l">${s.awards.map((w, i) => `<button class="award reveal" style="--d:${i * 80}ms" data-lb="${lg}" data-i="${w.letter - 1}"><span class="award__amt">$${fmtNum(w.amount)}<small>/ year</small></span><span class="award__name">${esc(w.name)}</span><span class="award__note">${esc(w.note)}</span><span class="more small" style="margin-top:8px">Read the letter</span></button>`).join('')}</div>
      </div></section>
      <section class="section"><div class="wrap">
        ${head('Core courses', 'Game Design, Game Art Methods and Unreal Engine.')}
        <div class="pills reveal">${s.courses.map((c) => `<span class="pill">${esc(c)}</span>`).join('')}</div>
      </div></section>
      <section class="section section--alt"><div class="wrap">
        ${head('The letters', 'Five documents from the SCAD_Letter folder.')}
        <div class="letters">${s.letters.map((l, i) => `<button class="letter reveal" style="--d:${i * 70}ms" data-lb="${lg}" data-i="${i}"><div class="letter__paper">${img(thumbFor(l.img), l.title)}</div><span class="letter__date">${esc(l.date)}</span><span class="letter__title">${esc(l.title)}</span><span class="small muted" style="margin-top:-6px">${esc(l.desc)}</span></button>`).join('')}</div>
      </div></section>`;
  }

  /* ------------------------------------------------------------------ resume */
  function renderResume() {
    const R = SITE.resume;
    const p = SITE.person;
    const item = (it) => `<article class="ritem reveal">
      <div class="ritem__top"><h3 class="ritem__org">${esc(it.org)}</h3><span class="ritem__dates">${esc(it.dates)}</span></div>
      <div class="ritem__title">${esc(it.title)} <span>· ${esc(it.place)}${it.note ? ' · ' + esc(it.note) : ''}</span></div>
      ${it.lines ? `<ul>${it.lines.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>` : ''}
      ${it.groups ? it.groups.map((g, i) => `<details class="acc"${i === 0 ? ' open' : ''}><summary>${esc(g.head)}</summary><ul>${g.lines.map((l) => `<li>${esc(l)}</li>`).join('')}</ul></details>`).join('') : ''}
    </article>`;
    const resumeFile = FILES.find((f) => f.kind === 'word');
    const html = `<div class="page">
      <section class="phead"><div class="wrap">
        <nav class="crumbs reveal"><a href="#/">Home</a><span class="sep">/</span><span>Résumé</span><span class="folder">${esc(resumeFile ? resumeFile.name : 'JinKun_Liu_Resume.docx')}</span></nav>
        <h1 class="h1 reveal" style="--d:60ms">${esc(p.name)}</h1>
        <p class="lede phead__lede reveal" style="--d:140ms">${esc(p.role)} M.F.A. candidate in Game Development at SCAD; B.A. in Art Studio and Design from UC Davis.</p>
        <div class="links-row mt-m reveal" style="--d:200ms"><a class="btn" href="${esc(R.file)}" download>${ICON.download} Download .docx</a><a class="btn btn--ghost" href="mailto:${esc(p.email)}">${ICON.mail} ${esc(p.email)}</a></div>
      </div></section>
      <section class="section" style="padding-top:0"><div class="wrap"><div class="resume">
        <div class="rsec"><h2 class="rsec__label">Education</h2><div>${R.education.map(item).join('')}</div></div>
        <div class="rsec"><h2 class="rsec__label">Professional experience</h2><div>${R.experience.map(item).join('')}</div></div>
        <div class="rsec"><h2 class="rsec__label">Extracurricular</h2><div>${R.activities.map(item).join('')}</div></div>
        <div class="rsec"><h2 class="rsec__label">Languages &amp; skills</h2><div class="skills">${R.skills.map((s) => `<div class="reveal"><h4>${esc(s.head)}</h4><div class="pills">${s.items.map((i) => `<span class="pill">${esc(i)}</span>`).join('')}</div></div>`).join('')}</div></div>
        <div class="rsec"><h2 class="rsec__label">Interests</h2><div class="pills reveal">${p.interests.map((i) => `<span class="pill">${esc(i)}</span>`).join('')}</div></div>
      </div></div></section>
    </div>`;
    return { html, theme: 'light', title: `Résumé — ${p.name}`, lnav: '' };
  }

  /* ------------------------------------------------------------------ archive */
  function renderArchive() {
    const total = FILES.reduce((s, f) => s + f.size, 0);
    const html = `<div class="page">
      <section class="phead"><div class="wrap">
        <nav class="crumbs reveal"><a href="#/">Home</a><span class="sep">/</span><span>Archive</span><span class="folder">My_Website_Content</span></nav>
        <h1 class="h1 reveal" style="--d:60ms">Every file, right where it lives.</h1>
        <p class="lede phead__lede reveal" style="--d:140ms">The original folder, browsable like Finder. Select a folder to open it, select a file to preview it, then open it here or jump to its page. Arrow keys work too.</p>
        <div class="phead__meta reveal" style="--d:200ms"><span class="tag"><b>${FOLDERS.size}</b> folders</span><span class="tag"><b>${FILES.length}</b> files</span><span class="tag"><b>${fmtSize(total)}</b> of originals</span></div>
      </div></section>
      <section class="section" style="padding-top:0"><div class="wrap--wide"><div class="finder reveal" id="finder" tabindex="0" aria-label="Folder browser">
        <div class="finder__bar"><span class="dots"><i></i><i></i><i></i></span><span class="finder__nav"><button data-fnav="back" aria-label="Back">${ICON.left}</button><button data-fnav="fwd" aria-label="Forward">${ICON.right}</button></span><span class="finder__where" id="finder-where">My_Website_Content</span></div>
        <div class="finder__view" id="finder-view"></div>
        <div class="finder__path" id="finder-path"></div>
      </div></div></section>
    </div>`;
    return { html, theme: 'light', title: 'Archive — JinKun Liu', lnav: '' };
  }

  function initFinder(root, query) {
    const box = $('#finder', root);
    if (!box) return;
    const view = $('#finder-view', box);
    const pathEl = $('#finder-path', box);
    const where = $('#finder-where', box);
    let sel = [];
    const hist = [];
    let fut = [];
    let focusCol = 0;

    const start = query.get('p');
    if (start) {
      let entries = TREE;
      start.split('/').forEach((seg) => {
        const e = entries && entries.find((x) => x.name === seg);
        if (e) {
          sel.push(e);
          entries = e.children;
        }
      });
    }

    const childCount = (e) => (e.children ? e.children.length : 0);
    const row = (e, col) => {
      const on = sel[col] === e;
      const last = on && col === sel.length - 1;
      return `<button class="frow${last ? ' is-sel' : on ? ' is-path' : ''}" data-col="${col}" data-name="${esc(e.name)}" title="${esc(e.name)}">
        ${e.isDir ? ICON.folder : kindIcon(e.kind)}<span class="frow__name">${esc(e.name)}</span>
        ${e.isDir ? `<span class="frow__count">${childCount(e)} ${ICON.chev.replace('<svg', '<svg class="frow__chev"')}</span>` : ''}</button>`;
    };
    const preview = (e) => {
      if (!e) return `<div class="fprev fprev--empty"><div>${ICON.folder.replace('<svg', '<svg width="56" height="56" style="margin:0 auto 12px;display:block;opacity:.4"')}<p>Select a file to preview it.</p></div></div>`;
      if (e.isDir) {
        const n = nodeForFolder(e.path);
        const files = filesUnder(e.path);
        const size = files.reduce((s, f) => s + f.size, 0);
        return `<div class="fprev"><div class="fprev__media" style="cursor:default">${n && nodeCover(n) ? img(nodeCover(n), e.name) : ICON.folder}</div>
          <div class="fprev__name">${esc(e.name)}</div>
          <dl><dt>Kind</dt><dd>Folder</dd><dt>Contains</dt><dd>${plural(e.children.length, 'item')} · ${plural(files.length, 'file')} in total</dd><dt>Size</dt><dd>${fmtSize(size)}</dd></dl>
          ${n ? `<div class="fprev__actions"><a class="btn btn--sm" href="${href(n)}">Open its page</a></div>` : ''}</div>`;
      }
      const n = nodeForFile(e);
      let media = kindIcon(e.kind);
      let web = '';
      if (e.kind === 'image' && M.images[e.key]) {
        const d = M.images[e.key];
        media = img(`${A}${e.key}.thumb.jpg`, e.name, '', false);
        web = `JPEG · ${d[0]}×${d[1]}`;
      } else if (e.kind === 'doc') {
        media = img(`${A}${e.key}/p01.thumb.jpg`, e.name, '', false);
        web = `${plural(M.docs[e.key].length, 'page')} rendered as images`;
      } else if (e.kind === 'video') {
        const v = vidInfo(e.key);
        media = img(v.poster, e.name, '', false);
        web = `MP4 · ${v.w}×${v.h} · ${fmtDur(v.dur)} · ${fmtNum(v.mb, 1)} MB`;
      } else if (e.kind === 'link') {
        web = LINKS[e.name] || '';
      } else if (e.kind === 'pdf') {
        web = 'Shown in your browser’s PDF viewer';
      } else if (e.kind === 'word') {
        web = 'Download as .docx';
      }
      return `<div class="fprev"><div class="fprev__media" data-open-file="${esc(e.path)}">${media}</div>
        <div class="fprev__name">${esc(e.name)}</div>
        <dl><dt>Kind</dt><dd>${esc(kindLabel(e))}</dd><dt>Original</dt><dd>${fmtSize(e.size)}</dd>${web ? `<dt>On the web</dt><dd>${esc(web)}</dd>` : ''}<dt>Where</dt><dd>${esc(e.dir || 'My_Website_Content')}</dd></dl>
        <div class="fprev__actions"><button class="btn btn--sm" data-open-file="${esc(e.path)}">${e.kind === 'link' ? 'Open link ↗' : e.kind === 'word' ? 'Download' : 'Open'}</button>${n ? `<a class="btn btn--sm btn--ghost" href="${e.kind === 'word' ? '#/resume' : href(n)}">Go to its page</a>` : e.kind === 'word' ? '<a class="btn btn--sm btn--ghost" href="#/resume">Go to its page</a>' : ''}</div></div>`;
    };
    const draw = (scroll = true) => {
      const cols = [TREE];
      sel.forEach((e) => e.isDir && cols.push(e.children));
      const last = sel[sel.length - 1];
      view.innerHTML =
        cols.map((entries, c) => `<div class="fcol" data-c="${c}">${entries.map((e) => row(e, c)).join('')}</div>`).join('') + preview(last);
      const crumbsArr = ['My_Website_Content', ...sel.map((e) => e.name)];
      pathEl.innerHTML = crumbsArr.map((n, i) => `<button data-depth="${i}">${esc(n)}</button>`).join('<span>›</span>');
      where.textContent = last ? last.name : 'My_Website_Content';
      $('[data-fnav="back"]', box).disabled = !hist.length;
      $('[data-fnav="fwd"]', box).disabled = !fut.length;
      if (scroll) view.scrollLeft = view.scrollWidth;
      $$('.fcol', view).forEach((col) => {
        const r = $('.is-sel, .is-path', col);
        if (r && (r.offsetTop < col.scrollTop || r.offsetTop + r.offsetHeight > col.scrollTop + col.clientHeight)) col.scrollTop = r.offsetTop - col.clientHeight / 2;
      });
      const p = sel.map((e) => e.name).join('/');
      history.replaceState(null, '', p ? `#/archive?p=${encodeURIComponent(p)}` : '#/archive');
    };
    const choose = (col, e, record = true) => {
      if (record) {
        hist.push(sel.slice());
        fut = [];
      }
      sel = sel.slice(0, col).concat(e);
      focusCol = col;
      draw();
    };
    view.addEventListener('click', (ev) => {
      const r = ev.target.closest('.frow');
      if (r) {
        const col = +r.dataset.col;
        const entries = col === 0 ? TREE : sel[col - 1].children;
        const e = entries.find((x) => x.name === r.dataset.name);
        choose(col, e);
        box.focus({ preventScroll: true });
      }
      const o = ev.target.closest('[data-open-file]');
      if (o) {
        const f = FILES.find((x) => x.path === o.dataset.openFile);
        if (f) openFile(f, o.querySelector('img') || o);
      }
    });
    view.addEventListener('dblclick', (ev) => {
      const r = ev.target.closest('.frow');
      if (!r) return;
      const last = sel[sel.length - 1];
      if (last && !last.isDir) openFile(last, r);
    });
    pathEl.addEventListener('click', (ev) => {
      const b = ev.target.closest('[data-depth]');
      if (!b) return;
      hist.push(sel.slice());
      sel = sel.slice(0, +b.dataset.depth);
      draw();
    });
    $$('[data-fnav]', box).forEach((b) =>
      b.addEventListener('click', () => {
        if (b.dataset.fnav === 'back' && hist.length) {
          fut.push(sel.slice());
          sel = hist.pop();
        } else if (b.dataset.fnav === 'fwd' && fut.length) {
          hist.push(sel.slice());
          sel = fut.pop();
        }
        draw();
      })
    );
    box.addEventListener('keydown', (ev) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' '].includes(ev.key)) return;
      ev.preventDefault();
      const col = Math.min(focusCol, sel.length ? sel.length - 1 : 0);
      const entries = col === 0 ? TREE : sel[col - 1] && sel[col - 1].children;
      const cur = sel[col];
      if (!entries) return;
      const idx = cur ? entries.indexOf(cur) : -1;
      if (ev.key === 'ArrowDown') choose(col, entries[Math.min(entries.length - 1, idx + 1)]);
      else if (ev.key === 'ArrowUp') choose(col, entries[Math.max(0, idx - 1)]);
      else if (ev.key === 'ArrowRight' && cur && cur.isDir && cur.children.length) choose(col + 1, cur.children[0]);
      else if (ev.key === 'ArrowLeft' && col > 0) {
        sel = sel.slice(0, col);
        focusCol = col - 1;
        draw();
      } else if ((ev.key === 'Enter' || ev.key === ' ') && cur) {
        if (cur.isDir && cur.children.length) choose(col + 1, cur.children[0]);
        else if (!cur.isDir) openFile(cur, $('.fprev__media', view));
      }
      const selRow = $('.frow.is-sel', view);
      if (selRow) selRow.scrollIntoView({ block: 'nearest' });
    });
    focusCol = Math.max(0, sel.length - 1);
    draw(true);
  }

  /* ================================================================== open helpers */
  function openFile(f, origin) {
    if (f.kind === 'image') {
      const siblings = FILES.filter((x) => x.dir === f.dir && x.kind === 'image');
      const items = siblings.map((x) => ({ ...imgInfo(x.key), title: x.name, file: x.path }));
      openLightbox(items, siblings.indexOf(f), origin);
    } else if (f.kind === 'doc') {
      const pages = docPages(f.key);
      openLightbox(pages.map((p) => ({ ...p, title: `${f.name} — page ${p.n} of ${pages.length}`, file: f.path })), 0, origin);
    } else if (f.kind === 'video') {
      const v = vidInfo(f.key);
      openVideo(v.src, v.poster, f.name, f.path);
    } else if (f.kind === 'link' && LINKS[f.name]) {
      window.open(LINKS[f.name], '_blank', 'noopener');
    } else if (f.kind === 'pdf') {
      window.open(`${A}${f.key}.pdf`, '_blank', 'noopener');
    } else if (f.kind === 'word') {
      const a = document.createElement('a');
      a.href = SITE.resume.file;
      a.download = f.name;
      a.click();
    }
  }

  /* ================================================================== lightbox */
  const LB = { el: $('#lb'), img: $('#lb-img'), stage: $('#lb-stage'), items: [], i: 0, z: 1, tx: 0, ty: 0, origin: null, fit: null };
  function lbFit(it) {
    const r = LB.stage.getBoundingClientRect();
    const pad = innerWidth < 734 ? 12 : 56;
    const s = Math.min((r.width - pad * 2) / it.w, (r.height - 24) / it.h, 1.6);
    return { w: Math.round(it.w * s), h: Math.round(it.h * s) };
  }
  function lbApply(animate) {
    const t = `translate(-50%, -50%) translate(${LB.tx}px, ${LB.ty}px) scale(${LB.z})`;
    LB.img.style.transition = animate ? 'transform .45s cubic-bezier(.16,1,.3,1)' : 'none';
    LB.img.style.transform = t;
  }
  function lbShow(dir = 0) {
    const it = LB.items[LB.i];
    LB.fit = lbFit(it);
    LB.z = 1;
    LB.tx = LB.ty = 0;
    LB.el.classList.remove('is-zoomed');
    Object.assign(LB.img.style, { width: LB.fit.w + 'px', height: LB.fit.h + 'px' });
    LB.img.alt = it.title || '';
    LB.img.src = it.thumb || it.src;
    if (it.src && it.src !== it.thumb) {
      LB.el.classList.add('is-loading');
      const full = new Image();
      full.onload = () => {
        if (LB.items[LB.i] === it) {
          LB.img.src = it.src;
          LB.el.classList.remove('is-loading');
        }
      };
      full.onerror = () => LB.el.classList.remove('is-loading');
      full.src = it.src;
    }
    lbApply(false);
    if (dir && !reduceMotion) LB.img.animate([{ opacity: 0, translate: `${dir * 40}px 0` }, { opacity: 1, translate: '0 0' }], { duration: 380, easing: 'cubic-bezier(.16,1,.3,1)' });
    $('#lb-count').textContent = LB.items.length > 1 ? `${LB.i + 1} / ${LB.items.length}` : '';
    $('#lb-title').textContent = it.title || '';
    $('#lb-file').textContent = it.file || '';
    $('#lb-prev').hidden = $('#lb-next').hidden = LB.items.length < 2;
    $$('#lb-strip button').forEach((b, i) => b.classList.toggle('is-on', i === LB.i));
    const on = $('#lb-strip .is-on');
    if (on) on.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    // warm the neighbours
    [LB.i + 1, LB.i - 1].forEach((j) => {
      const n = LB.items[(j + LB.items.length) % LB.items.length];
      if (n && n.src) new Image().src = n.src;
    });
  }
  function openLightbox(items, i = 0, origin) {
    if (!items || !items.length) return;
    LB.items = items;
    LB.i = clamp(i, 0, items.length - 1);
    LB.origin = origin || null;
    $('#lb-strip').innerHTML =
      items.length > 1 && items.length <= 300
        ? items.map((it, j) => `<button data-j="${j}" aria-label="Go to ${j + 1}" style="width:${Math.round((52 * it.w) / it.h)}px"><img src="${esc(it.thumb || it.src)}" alt="" loading="lazy"></button>`).join('')
        : '';
    LB.el.classList.add('is-open');
    document.body.classList.add('is-locked');
    lbShow();
    const src = origin && origin.getBoundingClientRect ? (origin.querySelector && origin.querySelector('img')) || origin : null;
    if (src && !reduceMotion) {
      const a = src.getBoundingClientRect();
      const b = LB.img.getBoundingClientRect();
      if (a.width && b.width) {
        const s = a.width / b.width;
        const dx = a.left + a.width / 2 - (b.left + b.width / 2);
        const dy = a.top + a.height / 2 - (b.top + b.height / 2);
        LB.img.animate(
          [{ transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(${s})`, borderRadius: '12px' }, { transform: 'translate(-50%, -50%)', borderRadius: '4px' }],
          { duration: 560, easing: 'cubic-bezier(.16,1,.3,1)' }
        );
      }
    }
    $('#lb-close').focus({ preventScroll: true });
  }
  function closeLightbox() {
    if (!LB.el.classList.contains('is-open')) return;
    LB.el.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    if (LB.origin && LB.origin.focus) LB.origin.focus({ preventScroll: true });
  }
  const lbGo = (d) => {
    if (LB.items.length < 2) return;
    LB.i = (LB.i + d + LB.items.length) % LB.items.length;
    lbShow(d);
  };
  function lbZoom(e) {
    const it = LB.items[LB.i];
    if (LB.z > 1) {
      LB.z = 1;
      LB.tx = LB.ty = 0;
      LB.el.classList.remove('is-zoomed');
    } else {
      LB.z = Math.max(2, it.w / LB.fit.w);
      LB.z = Math.min(LB.z, 4);
      if (e && e.clientX != null) {
        const r = LB.img.getBoundingClientRect();
        LB.tx = (r.left + r.width / 2 - e.clientX) * (LB.z - 1);
        LB.ty = (r.top + r.height / 2 - e.clientY) * (LB.z - 1);
      }
      LB.el.classList.add('is-zoomed');
    }
    lbApply(true);
  }
  (function bindLightbox() {
    $('#lb-close').addEventListener('click', closeLightbox);
    $('#lb-prev').addEventListener('click', () => lbGo(-1));
    $('#lb-next').addEventListener('click', () => lbGo(1));
    $('#lb-zoom').addEventListener('click', () => lbZoom());
    $('#lb-strip').addEventListener('click', (e) => {
      const b = e.target.closest('[data-j]');
      if (!b) return;
      const j = +b.dataset.j;
      const d = j > LB.i ? 1 : -1;
      LB.i = j;
      lbShow(d);
    });
    let down = null;
    let moved = false;
    LB.stage.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.lb__nav')) return;
      down = { x: e.clientX, y: e.clientY, tx: LB.tx, ty: LB.ty, target: e.target };
      moved = false;
      LB.stage.setPointerCapture(e.pointerId);
    });
    LB.stage.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - down.x;
      const dy = e.clientY - down.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
      if (LB.z > 1) {
        LB.tx = down.tx + dx;
        LB.ty = down.ty + dy;
        lbApply(false);
      } else if (moved) {
        LB.img.style.transform = `translate(-50%, -50%) translate(${dx}px, ${Math.max(0, dy) * 0.6}px)`;
        LB.img.style.opacity = String(1 - Math.min(0.5, Math.max(0, dy) / 400));
      }
    });
    LB.stage.addEventListener('pointerup', (e) => {
      if (!down) return;
      const dx = e.clientX - down.x;
      const dy = e.clientY - down.y;
      const target = down.target;
      down = null;
      LB.img.style.opacity = '';
      if (LB.z > 1) {
        if (!moved) lbZoom(e);
        return;
      }
      if (!moved) {
        if (target === LB.img) lbZoom(e);
        else closeLightbox();
        return;
      }
      if (dy > 120 && Math.abs(dy) > Math.abs(dx)) return closeLightbox();
      if (dx < -60) return lbGo(1);
      if (dx > 60) return lbGo(-1);
      lbApply(true);
    });
    addEventListener('resize', () => LB.el.classList.contains('is-open') && lbShow());
  })();

  /* ================================================================== video modal */
  const VM = { el: $('#vm'), v: $('#vm-video') };
  function openVideo(src, poster, title, file) {
    VM.v.poster = poster || '';
    VM.v.src = src;
    $('#vm-title').textContent = title || '';
    $('#vm-file').textContent = file || '';
    VM.el.classList.add('is-open');
    document.body.classList.add('is-locked');
    VM.v.play().catch(() => {});
    $('#vm-close').focus({ preventScroll: true });
  }
  function closeVideo() {
    if (!VM.el.classList.contains('is-open')) return;
    VM.v.pause();
    VM.el.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    setTimeout(() => {
      VM.v.removeAttribute('src');
      VM.v.load();
    }, 350);
  }
  $('#vm-close').addEventListener('click', closeVideo);
  VM.el.addEventListener('click', (e) => e.target === VM.el && closeVideo());

  /* ================================================================== command palette */
  const PAL = { el: $('#pal'), input: $('#pal-input'), list: $('#pal-list'), idx: null, results: [], on: 0 };
  function palIndex() {
    if (PAL.idx) return PAL.idx;
    const out = [];
    NODES.filter((n) => n !== HOME).forEach((n) =>
      out.push({ type: 'Pages', name: n.project ? `${n.project} — ${n.title}` : n.title, sub: ancestors(n).filter((a) => a !== HOME).map((a) => a.short || a.title).join(' / ') || 'Home', icon: ICON.folder, hay: `${n.title} ${n.project || ''} ${n.tagline || ''} ${n.folder || ''}`, go: () => (location.hash = href(n)) })
    );
    out.push({ type: 'Pages', name: 'Résumé', sub: 'JinKun_Liu_Resume.docx', icon: ICON.word, hay: 'resume cv experience skills education', go: () => (location.hash = '#/resume') });
    out.push({ type: 'Pages', name: 'Archive', sub: 'Every original file', icon: ICON.folder, hay: 'archive finder files folders browse', go: () => (location.hash = '#/archive') });
    FILES.forEach((f) => out.push({ type: 'Files', name: f.name, sub: pretty(f.dir || 'My_Website_Content'), icon: kindIcon(f.kind), hay: `${f.name} ${f.dir} ${kindLabel(f)}`, go: (el) => openFile(f, el) }));
    STEAM.forEach((g) => out.push({ type: 'Games played', name: g.title, sub: `${fmtNum(g.hours, 1)} h · ${g.genre}`, icon: ICON.game, hay: `${g.title} ${g.genre}`, go: () => (location.hash = `#/play?q=${encodeURIComponent(g.title)}`) }));
    PAL.idx = out.map((o) => ({ ...o, low: `${o.name} ${o.sub} ${o.hay}`.toLowerCase(), lname: o.name.toLowerCase() }));
    return PAL.idx;
  }
  function palSearch() {
    const q = PAL.input.value.trim().toLowerCase();
    const idx = palIndex();
    let res;
    if (!q) res = idx.filter((o) => o.type === 'Pages').slice(0, 14);
    else {
      const toks = q.split(/\s+/);
      res = idx
        .filter((o) => toks.every((t) => o.low.includes(t)))
        .map((o) => ({ o, s: (o.lname.startsWith(q) ? 0 : o.lname.includes(q) ? 1 : 2) + (o.type === 'Pages' ? 0 : o.type === 'Files' ? 0.5 : 0.7) }))
        .sort((a, b) => a.s - b.s)
        .map((x) => x.o);
      const caps = { Pages: 8, Files: 12, 'Games played': 8 };
      const seen = {};
      res = res.filter((o) => (seen[o.type] = (seen[o.type] || 0) + 1) <= caps[o.type]);
      const order = ['Pages', 'Files', 'Games played'];
      res.sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));
    }
    PAL.results = res;
    PAL.on = 0;
    let last = '';
    PAL.list.innerHTML = res.length
      ? res.map((o, i) => {
          const g = o.type !== last ? `<div class="pal__group">${o.type}</div>` : '';
          last = o.type;
          return `${g}<button class="pal__item${i === 0 ? ' is-on' : ''}" data-k="${i}" role="option">${o.icon}<span class="pal__name">${esc(o.name)}</span><span class="pal__sub">${esc(o.sub)}</span></button>`;
        }).join('')
      : `<p class="pal__empty">No results for “${esc(PAL.input.value)}”.</p>`;
  }
  function palMark(i) {
    PAL.on = clamp(i, 0, PAL.results.length - 1);
    $$('.pal__item', PAL.list).forEach((b, j) => b.classList.toggle('is-on', j === PAL.on));
    const on = $('.pal__item.is-on', PAL.list);
    if (on) on.scrollIntoView({ block: 'nearest' });
  }
  function palPick(i) {
    const o = PAL.results[i];
    if (!o) return;
    closePalette();
    setTimeout(() => o.go(null), 60);
  }
  function openPalette() {
    PAL.el.classList.add('is-open');
    document.body.classList.add('is-locked');
    PAL.input.value = '';
    palSearch();
    setTimeout(() => PAL.input.focus(), 30);
  }
  function closePalette() {
    PAL.el.classList.remove('is-open');
    if (!LB.el.classList.contains('is-open') && !VM.el.classList.contains('is-open')) document.body.classList.remove('is-locked');
  }
  PAL.input.addEventListener('input', palSearch);
  PAL.input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); palMark(PAL.on + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); palMark(PAL.on - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); palPick(PAL.on); }
  });
  PAL.list.addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]');
    if (b) palPick(+b.dataset.k);
  });
  PAL.list.addEventListener('mousemove', (e) => {
    const b = e.target.closest('[data-k]');
    if (b && +b.dataset.k !== PAL.on) palMark(+b.dataset.k);
  });
  PAL.el.addEventListener('click', (e) => e.target === PAL.el && closePalette());
  $('#open-search').addEventListener('click', openPalette);

  /* ================================================================== global keys */
  addEventListener('keydown', (e) => {
    const typing = /input|textarea|select/i.test((e.target.tagName || '')) || e.target.isContentEditable;
    if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      PAL.el.classList.contains('is-open') ? closePalette() : openPalette();
      return;
    }
    if (e.key === 'Escape') {
      if (PAL.el.classList.contains('is-open')) return closePalette();
      if (LB.el.classList.contains('is-open')) return closeLightbox();
      if (VM.el.classList.contains('is-open')) return closeVideo();
      if (document.body.classList.contains('menu-open')) return toggleMenu(false);
    }
    if (LB.el.classList.contains('is-open')) {
      if (e.key === 'ArrowRight') lbGo(1);
      else if (e.key === 'ArrowLeft') lbGo(-1);
      else if (e.key === 'z' || e.key === '+' || e.key === '=') lbZoom();
      return;
    }
    if (!typing && e.key === '/' && !PAL.el.classList.contains('is-open')) {
      e.preventDefault();
      openPalette();
    }
  });

  /* ================================================================== navigation chrome */
  const NAV = [
    { node: BYROUTE.get('art-design'), label: 'Art & Design' },
    { node: BYROUTE.get('games'), label: 'Games' },
    { node: BYROUTE.get('play'), label: 'Play History' },
    { node: BYROUTE.get('uc-davis'), label: 'UC Davis' },
    { node: BYROUTE.get('scad'), label: 'SCAD' },
    { route: 'resume', label: 'Résumé' },
    { route: 'archive', label: 'Archive' },
    { node: BYROUTE.get('physics-paper'), label: 'Physics Paper' },
  ];
  function buildChrome() {
    $('#gnav-list').innerHTML = NAV.map((n, i) => `<li data-nav="${i}"><a class="gnav__link" href="#/${n.node ? n.node.route : n.route}" data-route="${n.node ? n.node.route : n.route}">${esc(n.label)}</a></li>`).join('');

    // Mobile menu mirrors the folders two levels deep
    $('#mmenu').innerHTML = `<ul>${[{ label: 'Home', route: '' }, ...NAV]
      .map((n, i) => {
        const route = n.node ? n.node.route : n.route;
        const subs = n.node && n.node.children ? n.node.children.flatMap((c) => [c, ...(c.children || [])]) : [];
        return `<li style="--i:${i}"><a class="mmenu__big" href="#/${route}">${esc(n.label)}</a>${subs.length ? `<div class="mmenu__sub">${subs.map((c) => `<a href="${href(c)}">${esc(c.project || c.short || c.title)}</a>`).join('')}</div>` : ''}</li>`;
      })
      .join('')}</ul>`;

    // Footer directory: the whole folder tree
    const col = (n) => `<div><h4><a href="${href(n)}" style="color:inherit;padding:0">${esc(n.short || n.title)}</a></h4>${(n.children || [])
      .map((c) => `<a href="${href(c)}">${esc(c.title)}</a>${(c.children || []).map((g) => `<a class="sub" href="${href(g)}">${esc(g.title)}</a>`).join('')}`)
      .join('')}</div>`;
    $('#footer').innerHTML = `<div class="wrap">
      <p class="footer__note">Every page on this site mirrors a folder in <span class="mono">My_Website_Content</span>: ${FOLDERS.size} folders and ${FILES.length} files, converted for the web. Use <span class="kbd">Ctrl</span> + <span class="kbd">K</span> to search anything.</p>
      <div class="footer__dir">${TOP.slice(0, -1).map(col).join('')}<div><h4>More</h4><a href="#/resume">Résumé</a><a href="#/archive">Archive</a><a href="${esc(SITE.resume.file)}" download>Download résumé</a><a href="mailto:${esc(SITE.person.email)}">Email</a></div>${TOP.slice(-1).map(col).join('')}</div>
      <div class="footer__bottom"><span>© 2026 ${esc(SITE.person.name)}. All rights reserved.</span><a href="mailto:${esc(SITE.person.email)}">${esc(SITE.person.email)}</a></div></div>`;
  }

  // Desktop flyouts
  const flyout = $('#flyout');
  const scrim = $('#scrim');
  let flyTimer = 0;
  function openFly(i) {
    const n = NAV[i] && NAV[i].node;
    if (!n || !n.children || innerWidth < 1024) return closeFly();
    const cols = [
      `<div class="flyout__col" style="--i:0"><div class="flyout__head">Explore ${esc(n.short || n.title)}</div><div class="flyout__big">${n.children.map((c) => `<a href="${href(c)}">${esc(c.title)}</a>`).join('')}</div></div>`,
      ...n.children
        .filter((c) => c.children)
        .map((c, j) => `<div class="flyout__col" style="--i:${j + 1}"><div class="flyout__head">${esc(c.title)}</div><div class="flyout__small">${c.children.flatMap((g) => [`<a href="${href(g)}">${esc(g.title)}${g.project ? ` <span>${esc(g.project)}</span>` : ''}</a>`, ...(g.children || []).map((k) => `<a href="${href(k)}" style="padding-left:12px">${esc(k.title)}${k.project ? ` <span>${esc(k.project)}</span>` : ''}</a>`)]).join('')}</div></div>`),
    ];
    $('#flyout-inner').innerHTML = cols.join('');
    flyout.classList.add('is-open');
    scrim.classList.add('is-on');
    flyout.setAttribute('aria-hidden', 'false');
  }
  function closeFly() {
    flyout.classList.remove('is-open');
    scrim.classList.remove('is-on');
    flyout.setAttribute('aria-hidden', 'true');
  }
  $('#gnav').addEventListener('mouseover', (e) => {
    const li = e.target.closest('[data-nav]');
    if (li) {
      clearTimeout(flyTimer);
      flyTimer = setTimeout(() => openFly(+li.dataset.nav), 110);
    } else if (e.target.closest('.gnav__logo, .gnav__tools')) {
      clearTimeout(flyTimer);
      flyTimer = setTimeout(closeFly, 120);
    }
  });
  $('#gnav').addEventListener('mouseleave', () => {
    clearTimeout(flyTimer);
    flyTimer = setTimeout(closeFly, 160);
  });
  scrim.addEventListener('mouseenter', () => {
    clearTimeout(flyTimer);
    closeFly();
  });
  flyout.addEventListener('click', (e) => e.target.closest('a') && closeFly());

  // Mobile menu
  function toggleMenu(force) {
    const on = force != null ? force : !document.body.classList.contains('menu-open');
    document.body.classList.toggle('menu-open', on);
    $('#open-menu').setAttribute('aria-expanded', String(on));
    document.body.classList.toggle('is-locked', on);
  }
  $('#open-menu').addEventListener('click', () => toggleMenu());
  $('#mmenu').addEventListener('click', (e) => e.target.closest('a') && toggleMenu(false));

  function markActive(route) {
    $$('.gnav__link').forEach((a) => {
      const r = a.dataset.route;
      a.classList.toggle('is-active', !!r && (route === r || route.startsWith(r + '/')));
    });
  }

  /* ================================================================== hydrate (per page) */
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        $$('[data-count]', en.target).forEach(countUp);
        if (en.target.matches('[data-count]')) countUp(en.target);
        io.unobserve(en.target);
      }),
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
  );

  function countUp(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const to = parseFloat(el.dataset.count);
    const dec = +el.dataset.dec || 0;
    const pre = el.dataset.prefix || '';
    const suf = el.dataset.suffix || '';
    if (reduceMotion) return;
    const t0 = performance.now();
    const dur = 1600;
    // guarantee the final value even if animation frames are throttled
    setTimeout(() => (el.textContent = pre + fmtNum(to, dec) + suf), dur + 250);
    const step = (t) => {
      const k = clamp((t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 4);
      el.textContent = pre + fmtNum(to * e, dec) + suf;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function hydrate(root, query) {
    $$('.reveal, .rise, .tl, .hbars, .stat, .tile', root).forEach((el) => io.observe(el));
    $$('img[data-fade]', root).forEach((im) => {
      if (im.complete) im.classList.add('is-loaded');
      else im.addEventListener('load', () => im.classList.add('is-loaded'), { once: true });
    });
    $$('.rail', root).forEach(initRail);
    $$('[data-flip]', root).forEach(initFlip);
    $$('[data-chips]', root).forEach(initChips);
    $$('[data-engine-chips]', root).forEach(initEngineChips);
    $$('.vcard[data-video]', root).forEach(initPreview);
    $$('[data-auto]', root).forEach(initAutoplay);
    $$('[data-shot]', root).forEach(initShot);
    $$('[data-film]', root).forEach(initFilm);
    $$('[data-tilt]', root).forEach(initTilt);
    $$('[data-hero]', root).forEach(initHero);
    $$('[data-zoom]', root).forEach(initZoom);
    $$('[data-scrub]', root).forEach(initScrub);
    $$('[data-transit]', root).forEach(initTransit);
    initLibrary(root, query);
    initFinder(root, query);
  }

  /* ---------- delegated clicks */
  document.addEventListener('click', (e) => {
    const lb = e.target.closest('[data-lb]');
    if (lb) {
      e.preventDefault();
      let items = GROUPS[lb.dataset.lb] || [];
      let i = +lb.dataset.i || 0;
      const grid = lb.closest('[data-grid]');
      if (grid) {
        // respect active filters: only browse what is visible
        const visible = $$('.jg__item:not(.is-hidden)', grid).map((x) => +x.dataset.i);
        items = visible.map((j) => GROUPS[lb.dataset.lb][j]);
        i = visible.indexOf(i);
      }
      openLightbox(items, i, lb);
      return;
    }
    const v = e.target.closest('.vcard[data-video]');
    if (v) {
      const info = vidInfo(v.dataset.video);
      openVideo(info.src, info.poster, v.dataset.title, v.dataset.file);
      return;
    }
    const itch = e.target.closest('[data-itch]');
    if (itch) {
      const card = itch.closest('.vcard');
      if (!$('.itchframe', card)) {
        card.querySelector('.links-row').insertAdjacentHTML('afterend', `<iframe class="itchframe" src="https://itch.io/embed/${esc(itch.dataset.itch)}?dark=true" title="Where You Live on itch.io"></iframe>`);
        itch.remove();
      }
      return;
    }
    const lm = e.target.closest('[data-load-model]');
    if (lm) {
      const view = lm.closest('[data-model]');
      view.innerHTML = `<iframe title="${esc(view.dataset.title)} — Sketchfab viewer" allow="autoplay; fullscreen; xr-spatial-tracking" allowfullscreen src="https://sketchfab.com/models/${esc(view.dataset.model)}/embed?autostart=1&ui_theme=dark&dnt=1"></iframe>`;
      return;
    }
    const tab = e.target.closest('[data-cite]');
    if (tab) {
      const box = tab.closest('.cite');
      $$('[data-cite]', box).forEach((c) => c.classList.toggle('is-on', c === tab));
      $$('.cite__text', box).forEach((p) => (p.hidden = p.id !== `cite-${tab.dataset.cite}`));
      return;
    }
    const cp = e.target.closest('[data-copy]');
    if (cp) {
      const src = cp.dataset.copy === 'current' ? $('.cite__text:not([hidden])', cp.closest('.cite')) : document.getElementById(cp.dataset.copy);
      if (src) copyText(src.textContent).then((ok) => {
        const label = cp.textContent;
        cp.textContent = ok ? 'Copied ✓' : 'Press Ctrl+C';
        setTimeout(() => (cp.textContent = label), 1600);
      });
      return;
    }
    const rb = e.target.closest('[data-rail]');
    if (rb) {
      const wrap = rb.closest('.rail-wrap, .section');
      const rail = wrap && $('.rail', wrap);
      if (rail) rail.scrollBy({ left: +rb.dataset.rail * rail.clientWidth * 0.8, behavior: 'smooth' });
    }
  });
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.vcard[data-video], .film__poster')) {
      e.preventDefault();
      e.target.click();
    }
  });

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // file:// and older browsers: fall back to a hidden textarea
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      ta.remove();
      return ok;
    }
  }

  /* ---------- transit simulator (physics paper) */
  function initTransit(el) {
    const canvas = $('canvas', el);
    const ctx = canvas.getContext('2d');
    const slider = $('input[type="range"]', el);
    const out = (k) => $(`[data-out="${k}"]`, el);
    const RADIUS = { dwarf: 0.36, sun: 1 };
    const EARTHS_PER_SUN = 109.1;
    let star = 'dwarf';
    let w = 0, h = 0, dpr = 1, raf = 0, visible = false;
    const t0 = performance.now();

    // area of overlap between the star disk (R) and planet disk (r) at center distance d
    const overlap = (R, r, d) => {
      if (d >= R + r) return 0;
      if (d <= R - r) return Math.PI * r * r;
      if (d <= r - R) return Math.PI * R * R;
      const a = r * r * Math.acos((d * d + r * r - R * R) / (2 * d * r));
      const b = R * R * Math.acos((d * d + R * R - r * r) / (2 * d * R));
      const c = 0.5 * Math.sqrt((-d + r + R) * (d + r - R) * (d - r + R) * (d + r + R));
      return a + b - c;
    };
    const depthOf = (key) => Math.min(1, (+slider.value / EARTHS_PER_SUN / RADIUS[key]) ** 2);
    const fmtDepth = (d) => (d < 0.001 ? `${fmtNum(d * 1e6, 0)} ppm` : `${fmtNum(d * 100, d < 0.01 ? 3 : 2)}%`);

    const readouts = () => {
      const other = star === 'dwarf' ? 'sun' : 'dwarf';
      out('rp').textContent = `${fmtNum(+slider.value, 1)} R⊕${+slider.value >= 10.5 ? ' (≈ Jupiter)' : Math.abs(+slider.value - 1) < 0.05 ? ' (Earth)' : ''}`;
      out('depth').textContent = fmtDepth(depthOf(star));
      out('other').textContent = fmtDepth(depthOf(other));
      out('otherLabel').textContent = `same planet, ${other === 'sun' ? 'Sun-like star' : 'red dwarf'}`;
    };

    const size = () => {
      dpr = Math.min(2, devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      draw(phase());
    };
    const phase = () => (reduceMotion ? 0.5 : ((performance.now() - t0) / 7000) % 1);

    function draw(p) {
      if (!w) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const sceneH = h * 0.56;
      const cx = w / 2, cy = sceneH * 0.52;
      const sunPx = Math.min(sceneH * 0.4, w * 0.17);
      const Rs = RADIUS[star] * sunPx;
      const rp = (+slider.value / EARTHS_PER_SUN) * sunPx;
      const span = w * 0.46;
      const px = cx - span + p * span * 2;

      // star (limb-darkened look; the light curve uses a uniform disk)
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Rs);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.75, '#e8e8ed');
      g.addColorStop(1, '#8e8e93');
      ctx.save();
      ctx.shadowColor = 'rgba(255,255,255,0.35)';
      ctx.shadowBlur = Rs * 0.5;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, Rs, 0, 6.2832);
      ctx.fill();
      ctx.restore();
      // planet
      ctx.beginPath();
      ctx.arc(px, cy, Math.max(rp, 1.6), 0, 6.2832);
      ctx.fillStyle = '#000';
      ctx.fill();
      ctx.strokeStyle = '#6e6e73';
      ctx.lineWidth = 1;
      ctx.stroke();

      // light curves for both stars, same planet and same orbital speed
      const left = 64, right = w - 20, top = sceneH + 26, bottom = h - 30;
      const curve = (key) => {
        const R = RADIUS[key] * sunPx;
        const pts = [];
        for (let i = 0; i <= 240; i++) {
          const x = -span + (i / 240) * span * 2;
          pts.push(1 - overlap(R, rp, Math.abs(x)) / (Math.PI * R * R));
        }
        return pts;
      };
      const sel = curve(star);
      const oth = curve(star === 'dwarf' ? 'sun' : 'dwarf');
      const dMax = Math.max(depthOf('dwarf'), depthOf('sun'), 1e-6);
      const y = (f) => top + ((1 - f) / (dMax * 1.2)) * (bottom - top) * 0.9 + 6;
      const x = (i) => left + (i / 240) * (right - left);

      // axis & labels (text in ink tokens, never series color)
      ctx.strokeStyle = '#2c2c2e';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(left, y(1));
      ctx.lineTo(right, y(1));
      ctx.moveTo(left, y(1 - dMax));
      ctx.lineTo(right, y(1 - dMax));
      ctx.stroke();
      ctx.fillStyle = '#a1a1a6';
      ctx.font = '11px Inter, Helvetica, Arial, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText('100%', left - 10, y(1));
      ctx.fillText(`−${fmtDepth(dMax).replace(' ppm', 'ppm')}`, left - 10, y(1 - dMax));
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText('brightness over time', left, h - 10);

      const line = (pts, upto, style, width, dash) => {
        ctx.save();
        ctx.setLineDash(dash || []);
        ctx.strokeStyle = style;
        ctx.lineWidth = width;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();
        pts.slice(0, upto + 1).forEach((f, i) => (i ? ctx.lineTo(x(i), y(f)) : ctx.moveTo(x(i), y(f))));
        ctx.stroke();
        ctx.restore();
      };
      const k = Math.round(p * 240);
      line(oth, 240, '#6e6e73', 1.5, [5, 5]);
      line(sel, 240, 'rgba(245,245,247,0.25)', 2);
      line(sel, k, '#f5f5f7', 2);
      // live marker with a surface ring
      ctx.beginPath();
      ctx.arc(x(k), y(sel[k]), 4.5, 0, 6.2832);
      ctx.fillStyle = '#f5f5f7';
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    const loop = () => {
      draw(phase());
      raf = visible && !reduceMotion ? requestAnimationFrame(loop) : 0;
    };
    const vis = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    vis.observe(el);
    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    CLEANUP.push(() => { vis.disconnect(); ro.disconnect(); cancelAnimationFrame(raf); raf = 0; visible = false; });

    el.addEventListener('click', (e) => {
      const c = e.target.closest('[data-star]');
      if (!c) return;
      star = c.dataset.star;
      $$('[data-star]', el).forEach((b) => {
        b.classList.toggle('is-on', b === c);
        b.setAttribute('aria-checked', String(b === c));
      });
      readouts();
      draw(phase());
    });
    slider.addEventListener('input', () => {
      readouts();
      draw(phase());
    });
    readouts();
    size();
  }

  /* ---------- rails */
  function initRail(rail) {
    const wrap = rail.closest('.rail-wrap') || rail.closest('.section');
    const btns = wrap ? $$('[data-rail]', wrap) : [];
    if (!btns.length) return;
    const upd = () => {
      btns[0].disabled = rail.scrollLeft < 8;
      btns[1].disabled = rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 8;
    };
    rail.addEventListener('scroll', upd, { passive: true });
    setTimeout(upd, 100);
    $$('img', rail).forEach((im) => im.addEventListener('load', upd, { once: true }));
  }

  /* ---------- filter chips (gallery) */
  function initChips(bar) {
    const g = bar.dataset.chips;
    const grid = $(`[data-grid="${g}"]`);
    const desc = $(`#${g}-desc`);
    bar.addEventListener('click', (e) => {
      const c = e.target.closest('[data-filter]');
      if (!c || c.classList.contains('is-on')) return;
      const f = c.dataset.filter;
      const apply = () => {
        $$('.chip', bar).forEach((x) => x.classList.toggle('is-on', x === c));
        $$('.jg__item', grid).forEach((it) => it.classList.toggle('is-hidden', f !== '*' && it.dataset.series !== f));
        const n = $$('.jg__item:not(.is-hidden)', grid).length;
        desc.textContent = f === '*' ? `Showing all ${n} photographs.` : `${c.dataset.desc} ${plural(n, 'photograph')}.`;
      };
      if (document.startViewTransition && !reduceMotion) {
        const items = $$('.jg__item', grid);
        items.forEach((it, i) => (it.style.viewTransitionName = `${g}-${i}`));
        const t = document.startViewTransition(apply);
        t.finished.finally(() => items.forEach((it) => (it.style.viewTransitionName = '')));
      } else apply();
    });
  }
  function initEngineChips(bar) {
    const grid = bar.parentElement.querySelector('.vgrid');
    bar.addEventListener('click', (e) => {
      const c = e.target.closest('[data-engine]');
      if (!c) return;
      const f = c.dataset.engine;
      const apply = () => {
        $$('.chip', bar).forEach((x) => x.classList.toggle('is-on', x === c));
        $$('.vcard', grid).forEach((v) => v.classList.toggle('is-hidden', f !== '*' && v.dataset.engine !== f));
      };
      if (document.startViewTransition && !reduceMotion) {
        const items = $$('.vcard', grid);
        items.forEach((it, i) => (it.style.viewTransitionName = `vc-${i}`));
        document.startViewTransition(apply).finished.finally(() => items.forEach((it) => (it.style.viewTransitionName = '')));
      } else apply();
    });
  }

  /* ---------- hover previews on video cards */
  function initPreview(card) {
    if (!canHover) return;
    const media = $('.vcard__media', card);
    const bar = $('.vcard__progress', card);
    let vid = null;
    let timer = 0;
    card.addEventListener('mouseenter', () => {
      timer = setTimeout(() => {
        if (!vid) {
          const info = vidInfo(card.dataset.video);
          vid = document.createElement('video');
          Object.assign(vid, { muted: true, loop: true, playsInline: true, preload: 'auto' });
          vid.src = info.src + `#t=${Math.round(info.dur * 0.2)}`;
          vid.addEventListener('timeupdate', () => (bar.style.width = `${(vid.currentTime / (vid.duration || 1)) * 100}%`));
          media.insertBefore(vid, media.children[1]);
        }
        vid.play().then(() => card.classList.add('is-previewing')).catch(() => {});
      }, 180);
    });
    card.addEventListener('mouseleave', () => {
      clearTimeout(timer);
      card.classList.remove('is-previewing');
      if (vid) vid.pause();
    });
    CLEANUP.push(() => vid && (vid.pause(), vid.removeAttribute('src'), vid.load()));
  }

  /* ---------- autoplay when visible (phones, showreel) */
  const vio = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        const v = en.target;
        if (en.isIntersecting) {
          if (!v.src) v.src = v.dataset.auto || v.dataset.src;
          v.play().catch(() => {});
        } else v.pause();
      }),
    { threshold: 0.35 }
  );
  function initAutoplay(v) {
    vio.observe(v);
    CLEANUP.push(() => vio.unobserve(v));
  }

  /* ---------- scroll shots */
  function initShot(view) {
    const im = $('img', view);
    const frame = view.closest('.browser');
    const set = () => {
      const shift = im.offsetHeight - view.clientHeight;
      if (shift <= 0) return;
      frame.style.setProperty('--shift', `-${shift}px`);
      frame.style.setProperty('--dur', `${clamp(shift / 220, 4, 14).toFixed(1)}s`);
    };
    if (im.complete) set();
    else im.addEventListener('load', set, { once: true });
    if (!canHover) {
      const o = new IntersectionObserver(([en]) => frame.classList.toggle('is-auto', en.isIntersecting), { threshold: 0.6 });
      o.observe(view);
      CLEANUP.push(() => o.disconnect());
    }
  }

  /* ---------- film */
  function initFilm(el) {
    const v = $('video', el);
    const poster = $('.film__poster', el);
    poster.addEventListener('click', () => {
      if (!v.src) v.src = v.dataset.src;
      el.classList.add('is-playing');
      v.play().catch(() => {});
    });
    el.addEventListener('keydown', (e) => {
      if (!el.classList.contains('is-playing')) return;
      if (e.key === 'f' || e.key === 'F') v.requestFullscreen && v.requestFullscreen();
    });
    CLEANUP.push(() => v.pause());
  }

  /* ---------- diploma tilt */
  function initTilt(card) {
    if (!canHover) return;
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--ry', `${(x - 0.5) * 10}deg`);
      card.style.setProperty('--rx', `${(0.5 - y) * 8}deg`);
      card.style.setProperty('--gx', `${x * 100}%`);
      card.style.setProperty('--gy', `${y * 100}%`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  }

  /* ---------- flipbook */
  function initFlip(el) {
    const pages = docPages(el.dataset.flip);
    const n = pages.length;
    if (!n) return;
    const book = $('.flip__book', el);
    const L = $('.flip__half--l', el);
    const R = $('.flip__half--r', el);
    const range = $('.range', el);
    const label = $('.flip__label', el);
    const pw = pages[0].w / pages[0].h;
    const mq = matchMedia('(max-width: 733px)');
    let single = mq.matches;
    let s = 0;
    let busy = false;

    const count = () => (single ? n : Math.floor(n / 2) + 1);
    const spread = (k) => (single ? [null, k] : k === 0 ? [null, 0] : [2 * k - 1, 2 * k < n ? 2 * k : null]);
    const setHalf = (half, i) => {
      const im = $('img', half);
      if (i == null) {
        half.classList.add('is-empty');
        im.removeAttribute('src');
      } else {
        half.classList.remove('is-empty');
        im.src = pages[i].src;
        im.alt = `Page ${i + 1}`;
      }
    };
    const layout = () => {
      el.classList.toggle('flip--single', single);
      const ar = single ? pw : 2 * pw;
      book.style.aspectRatio = String(ar);
      book.style.maxWidth = `calc(${ar} * min(74vh, 720px))`;
      book.style.marginInline = 'auto';
      range.max = String(count() - 1);
    };
    const paint = () => {
      const [a, b] = spread(s);
      setHalf(L, single ? null : a);
      setHalf(R, b);
      ui();
      // preload the next spread
      spread(Math.min(s + 1, count() - 1)).concat(spread(Math.max(0, s - 1))).forEach((i) => i != null && (new Image().src = pages[i].src));
    };
    const ui = () => {
      range.value = String(s);
      const [a, b] = spread(s);
      const nums = [a, b].filter((x) => x != null).map((x) => x + 1);
      label.textContent = `${nums.length > 1 ? `Pages ${nums[0]}–${nums[1]}` : `Page ${nums[0]}`} of ${n}`;
      $('[data-flip-go="-1"]', el).disabled = s === 0;
      $('[data-flip-go="1"]', el).disabled = s >= count() - 1;
    };
    const faceHTML = (i) => (i == null ? '' : `<img src="${esc(pages[i].src)}" alt="">`);
    const go = (dir) => {
      const t = s + dir;
      if (busy || t < 0 || t >= count()) return;
      if (single || reduceMotion) {
        s = t;
        paint();
        if (!reduceMotion) R.animate([{ opacity: 0, transform: `translateX(${dir * 24}px)` }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' });
        return;
      }
      busy = true;
      const [cl, cr] = spread(s);
      const [nl, nr] = spread(t);
      const leaf = document.createElement('div');
      leaf.className = `flip__leaf flip__leaf--${dir > 0 ? 'next' : 'prev'}`;
      const front = dir > 0 ? cr : cl;
      const back = dir > 0 ? nl : nr;
      leaf.innerHTML = `<div class="flip__face flip__face--front">${faceHTML(front)}</div><div class="flip__face flip__face--back">${faceHTML(back)}</div>`;
      if (dir > 0) setHalf(R, nr);
      else setHalf(L, nl);
      book.appendChild(leaf);
      const anim = leaf.animate(
        [{ transform: 'rotateY(0deg)' }, { transform: `rotateY(${dir > 0 ? -90 : 90}deg)`, offset: 0.5 }, { transform: `rotateY(${dir > 0 ? -180 : 180}deg)` }],
        { duration: 820, easing: 'cubic-bezier(.45,.05,.3,1)' }
      );
      // finish on animation end, or after a timeout if the animation is paused (e.g. background tab)
      const done = () => {
        if (pending !== done) return;
        pending = null;
        clearTimeout(timer);
        if (dir > 0) setHalf(L, nl);
        else setHalf(R, nr);
        leaf.remove();
        s = t;
        busy = false;
        ui();
        spread(Math.min(s + 1, count() - 1)).forEach((i) => i != null && (new Image().src = pages[i].src));
      };
      pending = done;
      const timer = setTimeout(done, 1200);
      anim.onfinish = done;
    };
    let pending = null;
    const jump = (k) => {
      if (pending) pending();
      s = clamp(k, 0, count() - 1);
      paint();
    };
    const pageIndex = () => {
      const [a, b] = spread(s);
      return b != null ? (a != null ? a : b) : a;
    };

    layout();
    paint();
    el.addEventListener('click', (e) => {
      const g = e.target.closest('[data-flip-go]');
      if (g) return go(+g.dataset.flipGo);
      if (e.target.closest('[data-flip-full]')) {
        return openLightbox(GROUPS[el.dataset.g], pageIndex() || 0, book);
      }
      if (e.target.closest('.flip__book')) {
        const r = book.getBoundingClientRect();
        go(e.clientX < r.left + r.width / 2 ? -1 : 1);
      }
    });
    range.addEventListener('input', () => jump(+range.value));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
    let sx = null;
    book.addEventListener('pointerdown', (e) => (sx = e.clientX));
    book.addEventListener('pointerup', (e) => {
      if (sx == null) return;
      const dx = e.clientX - sx;
      sx = null;
      if (Math.abs(dx) > 50) {
        e.stopPropagation();
        go(dx < 0 ? 1 : -1);
        el.dataset.swiped = '1';
      }
    });
    book.addEventListener('click', (e) => {
      if (el.dataset.swiped) {
        e.stopPropagation();
        delete el.dataset.swiped;
      }
    }, true);
    const onMq = () => {
      const p = pageIndex() || 0;
      single = mq.matches;
      s = single ? p : p === 0 ? 0 : Math.floor((p + 1) / 2);
      layout();
      paint();
    };
    mq.addEventListener('change', onMq);
    CLEANUP.push(() => mq.removeEventListener('change', onMq));
  }

  /* ---------- home: interactive dot field */
  function initHero(hero) {
    requestAnimationFrame(() => $$('.rise, .reveal', hero).forEach((el) => el.classList.add('in')));
    const canvas = $('canvas', hero);
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = 1, raf = 0;
    const m = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4 };
    const size = () => {
      dpr = Math.min(2, devicePixelRatio || 1);
      w = hero.clientWidth;
      h = hero.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      draw();
    };
    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const gap = w < 734 ? 22 : 28;
      const R2 = 2 * 150 * 150;
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          const dx = x - m.x, dy = y - m.y;
          const k = Math.exp(-(dx * dx + dy * dy) / R2);
          const r = 0.8 + k * 2.4;
          ctx.globalAlpha = 0.16 + k * 0.7;
          ctx.beginPath();
          ctx.arc(x + dx * k * -0.12, y + dy * k * -0.12, r, 0, 6.2832);
          ctx.fillStyle = '#fff';
          ctx.fill();
        }
      }
    };
    const tick = () => {
      m.x += (m.tx - m.x) * 0.14;
      m.y += (m.ty - m.y) * 0.14;
      draw();
      raf = Math.abs(m.tx - m.x) + Math.abs(m.ty - m.y) > 0.5 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e) => {
      const r = hero.getBoundingClientRect();
      m.tx = e.clientX - r.left;
      m.ty = e.clientY - r.top;
      if (m.x < -1e3) { m.x = m.tx; m.y = m.ty; }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const leave = () => {
      m.tx = m.ty = -1e4;
      m.x = m.y = -1e4;
      draw();
    };
    hero.addEventListener('pointermove', move);
    hero.addEventListener('pointerleave', leave);
    addEventListener('resize', size);
    size();
    // intro sweep from the center
    if (!reduceMotion) {
      m.x = m.tx = w / 2;
      m.y = h * 0.55;
      m.ty = h * 0.4;
      raf = requestAnimationFrame(tick);
    }
    CLEANUP.push(() => removeEventListener('resize', size));
  }

  /* ---------- home: scroll-zoom showreel & scrubbed statement */
  function initZoom(sec) {
    const media = $('.zoom__media', sec);
    const v = $('video', sec);
    vio.observe(v);
    CLEANUP.push(() => vio.unobserve(v));
    SCROLLERS.push(() => {
      const r = sec.getBoundingClientRect();
      const p = clamp(-r.top / (r.height - innerHeight));
      media.style.setProperty('--p', (1 - Math.pow(1 - p, 2)).toFixed(4));
    });
  }
  function initScrub(el) {
    const words = $$('.sw', el);
    SCROLLERS.push(() => {
      const r = el.getBoundingClientRect();
      const p = clamp((innerHeight * 0.8 - r.top) / (r.height + innerHeight * 0.3));
      const on = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < on));
    });
  }
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      SCROLLERS.forEach((f) => f());
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);

  /* ---------- tooltips */
  const tip = $('#tip');
  document.addEventListener('pointermove', (e) => {
    const t = e.target.closest && e.target.closest('[data-tip]');
    if (!t) return tip.classList.remove('is-on');
    tip.innerHTML = t.dataset.tip;
    tip.classList.add('is-on');
    const r = tip.getBoundingClientRect();
    tip.style.left = `${Math.min(e.clientX + 16, innerWidth - r.width - 12)}px`;
    tip.style.top = `${Math.min(e.clientY + 16, innerHeight - r.height - 12)}px`;
  });

  /* ================================================================== router */
  const app = $('#app');
  const lnavSlot = $('#lnav-slot');
  let first = true;
  function parseHash() {
    const raw = location.hash.replace(/^#\/?/, '');
    const [path, qs] = raw.split('?');
    return { route: decodeURIComponent(path || '').replace(/\/+$/, ''), query: new URLSearchParams(qs || '') };
  }
  function render404() {
    return {
      html: `<div class="page"><section class="phead"><div class="wrap center"><p class="eyebrow">404</p><h1 class="h1 mt-s">This folder doesn’t exist.</h1><p class="lede mt-s">Try the search, or browse the archive.</p><div class="links-row mt-m" style="justify-content:center"><a class="btn" href="#/">Home</a><a class="btn btn--ghost" href="#/archive">Archive</a></div></div></section></div>`,
      theme: 'light', title: 'Not found', lnav: '',
    };
  }
  function route() {
    const { route: r, query } = parseHash();
    GROUPS = {};
    gid = 0;
    let page;
    if (!r) page = renderHome();
    else if (r === 'resume') page = renderResume();
    else if (r === 'archive') page = renderArchive();
    else page = BYROUTE.get(r) ? renderNode(BYROUTE.get(r)) : render404();

    const swap = () => {
      CLEANUP.forEach((f) => { try { f(); } catch (err) { /* ignore */ } });
      CLEANUP = [];
      SCROLLERS = [];
      app.innerHTML = page.html;
      lnavSlot.innerHTML = page.lnav;
      document.body.dataset.theme = page.theme;
      document.title = page.title;
      $('meta[name="theme-color"]').content = page.theme === 'dark' ? '#000000' : '#ffffff';
      window.scrollTo(0, 0);
      markActive(r);
      closeFly();
      hydrate(app, query);
      onScroll();
    };
    if (!first && document.startViewTransition && !reduceMotion) document.startViewTransition(swap);
    else {
      swap();
      if (!first) {
        app.classList.remove('page-enter');
        void app.offsetWidth;
        app.classList.add('page-enter');
      }
    }
    first = false;
  }

  window.addEventListener('hashchange', () => {
    closeLightbox();
    closeVideo();
    if (document.body.classList.contains('menu-open')) toggleMenu(false);
    route();
  });

  buildChrome();
  route();
})();
