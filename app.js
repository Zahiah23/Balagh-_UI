/* Balagh UI: Main Menu, Login, Submit Report. Plain JavaScript, no build step. */
(function () {
  'use strict';
  var I = window.I18N, app = document.getElementById('app');
  function ld() { try { return JSON.parse(localStorage.getItem('bg') || '{}'); } catch (e) { return {}; } }
  function sv(o) { try { localStorage.setItem('bg', JSON.stringify(Object.assign(ld(), o))); } catch (e) {} }
  var d0 = ld();
  var G = { lang: d0.lang || 'ar', z: d0.z || 0, inn: !!d0.inn };   // Arabic is the default
  function t(k) { return I[G.lang][k]; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var ZOOM = [1, 1.15, 1.3];

  /* ---------- icons ---------- */
  function ic(n, p) { return '<svg width="' + n + '" height="' + n + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + p + '"/></svg>'; }
  var PHONE = 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z';
  var LIST = 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01';
  var USER = 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z';
  var FILE = 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z M14 3v5h5 M12 12v6 M9 15h6';
  var SHIELD = 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', CROSS = 'M9 3h6v6h6v6h-6v6H9v-6H3V9h6z';
  var FLAME = 'M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z', ROAD = 'M7 3L4 21M17 3l3 18M12 4v3M12 11v3M12 18v3';
  var BACK = 'M15 5l-7 7 7 7', CHECK = 'M5 12l5 5L20 7';
  var PINP = 'M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z';
  function logo(n) { return '<svg width="' + n + '" height="' + n + '" viewBox="0 0 44 44" role="img" aria-label="Balagh"><rect width="44" height="44" rx="12" fill="#1B5E3A"/><path d="M22 9c-5.5 0-9.5 4-9.5 9.3C12.5 25 22 35 22 35s9.5-10 9.5-16.7C31.5 13 27.5 9 22 9z" fill="#fff"/><rect x="20.5" y="14" width="3" height="8" rx="1.5" fill="#1B5E3A"/><circle cx="22" cy="25.5" r="1.8" fill="#1B5E3A"/></svg>'; }

  /* ---------- per-screen state ---------- */
  var cur = '', M, L, R, geoAsked = false;
  function resetScreen(r) {
    if (r === 'main') M = { msg: '', svc: '', calling: false };
    if (r === 'login') L = { reg: false, step: 'phone', phone: '', otp: '', err: '', consent: false };
    if (r === 'submit') R = { step: 1, cat: '', auth: 'm', desc: '', photos: [], px: 50, py: 60, adj: false, off: false, errC: false, errD: false, ref: '', draft: false, drafted: false, gate: false, lat: 24.47, lon: 39.608, acc: 15, real: false };
  }

  /* ---------- shared pieces ---------- */
  function hdr(withLogo) {
    return '<div class="row hdr">' + (withLogo ? logo(40) : '') + '<div class="brand">' + t('name') + '</div>' +
      '<button class="lg" data-act="z" aria-label="' + t('sizeL') + '">' + ['A', 'A+', 'A++'][G.z] + '</button>' +
      '<button class="lg" data-act="lang">' + t('lang') + '</button></div>';
  }

  /* ---------- 1. Main Menu ---------- */
  function viewMain() {
    var i = G.inn;
    function em(k, p) { return '<button class="btn r em" data-act="svc" data-k="' + k + '">' + ic(26, p) + t(k) + '</button>'; }
    var sheet = '';
    if (M.svc) {
      sheet = '<div class="ov"><div class="sheet" role="dialog" aria-label="' + t(M.svc) + '"><div class="sT">' + t('confT') + ' ' + t(M.svc) + '</div><div class="sN">' + (M.calling ? t('dial') : t('confN')) + '</div>' +
        (M.calling ? '<button class="btn r" data-act="closeC">' + t('close') + '</button>' :
          '<button class="btn r" data-act="doCall">' + ic(26, PHONE) + t('call') + ' ' + t(M.svc) + '</button><button class="btn w" data-act="closeC">' + t('cancel') + '</button>') + '</div></div>';
    }
    return '<div class="s">' + hdr(true) + '<div class="sc"><div class="pad" style="zoom:' + ZOOM[G.z] + '">' +
      '<div><h1>' + t(i ? 'helloIn' : 'helloOut') + '</h1><p class="sub">' + t('sub') + '</p></div>' +
      '<div class="card emg"><div class="emgT">' + t('emg') + '</div><div class="emgS">' + t('emgSub') + '</div><div class="g2">' + em('pol', SHIELD) + em('amb', CROSS) + em('cd', FLAME) + em('rs', ROAD) + '</div></div>' +
      '<div class="g2 gap12"><a class="btn g tile" href="#/submit">' + ic(32, FILE) + t('submit') + '</a>' +
      (i ? '<button class="btn l tile" data-act="msgM">' + ic(32, LIST) + t('mine') + '</button>' : '<a class="btn l tile" href="#/login">' + ic(32, LIST) + t('mine') + '</a>') + '</div>' +
      (i ? '<div class="row g10"><button class="btn w" data-act="msgP">' + ic(26, USER) + t('profile') + '</button><button class="btn w" data-act="logout">' + t('logout') + '</button></div>'
         : '<a class="btn w" href="#/login">' + ic(26, USER) + t('login') + '</a>') +
      (M.msg ? '<div role="status" class="msg">' + esc(M.msg) + '</div>' : '') +
      '<button class="lk small" data-act="demo">' + t(i ? 'demoOut' : 'demoIn') + '</button></div></div>' + sheet + '</div>';
  }

  /* ---------- 2. Login ---------- */
  function viewLogin() {
    var r = L.reg, body = '';
    if (L.step === 'phone') {
      body = '<label for="ph" class="lbl">' + t('phone') + '</label>' +
        '<div class="row ltr" style="gap:8px"><span style="font-weight:700;font-size:17px;padding:0 4px">+966</span><input id="ph" class="field" inputmode="numeric" autocomplete="tel" placeholder="5X XXX XXXX" value="' + esc(L.phone) + '" data-in="phone"></div>' +
        (L.err === 'p' ? '<div class="err" role="alert" data-e="p">' + t('ePhone') + '</div>' : '') +
        (r ? '<label class="row chk"><input type="checkbox" data-ch="consent"' + (L.consent ? ' checked' : '') + '><span>' + t('consent') + '</span></label>' + (L.err === 'c' ? '<div class="err" role="alert">' + t('eCons') + '</div>' : '') : '') +
        '<button class="btn g" data-act="send">' + t('send') + '</button>';
    } else if (L.step === 'otp') {
      body = '<label for="otp" class="lbl">' + t('otp') + '</label><input id="otp" class="field otp ltr" inputmode="numeric" maxlength="6" value="' + esc(L.otp) + '" data-in="otp">' +
        (L.err === 'o' ? '<div class="err" role="alert" data-e="o">' + t('eOtp') + '</div>' : '') +
        '<button class="btn g" data-act="verify">' + t(r ? 'verifyReg' : 'verifyLogin') + '</button><button class="btn w" data-act="back">' + t('change') + '</button>';
    } else {
      body = '<div class="center okc">' + ic(48, CHECK) + t(r ? 'doneReg' : 'doneLogin') + '</div><a class="btn g" href="#/main">' + t('cont') + '</a><button class="btn w" data-act="logout2">' + t('logout') + '</button>';
    }
    return '<div class="s">' + hdr(false) + '<div class="sc"><div class="pad" style="zoom:' + ZOOM[G.z] + ';padding:0 20px 12px;gap:10px">' +
      '<div class="center">' + logo(60) + '<h1 style="margin-top:6px;font-size:25px">' + t(r ? 'tReg' : 'tLogin') + '</h1><p class="sub" style="margin:0">' + t('subL') + '</p></div>' +
      '<div class="card col">' + body + '</div>' +
      (L.step !== 'done' ? '<button class="lk" data-act="mode">' + t(r ? 'swReg' : 'swLogin') + '</button><div class="hint">' + t('hint') + '</div>' : '') +
      '<a class="btn r" href="#/main">' + ic(26, PHONE) + t('emgL') + '</a></div></div></div>';
  }

  /* ---------- 3. Submit Report ---------- */
  var KEYS = ['road', 'clean', 'health', 'other'], MAP = { road: 'm', clean: 'm', health: 'h', other: 'o' };
  function coord() { return (R.lat + (60 - R.py) * 0.00005).toFixed(5) + '° N, ' + (R.lon + (R.px - 50) * 0.00005).toFixed(5) + '° E'; }
  function authName(k) { return t({ m: 'aM', h: 'aH', o: 'aO' }[k]); }
  function viewSubmit() {
    var st = R.step, n = R.photos.length, h = '';
    h += '<div class="s"><div class="bar"><div class="row" style="gap:6px"><a href="#/main" class="back" aria-label="' + t('menu') + '">' + ic(28, BACK) + '</a><h1>' + t('title') + '</h1>' +
      '<button class="lg" data-act="z" aria-label="' + t('sizeL') + '">' + ['A', 'A+', 'A++'][G.z] + '</button><button class="lg" data-act="lang">' + t('lang') + '</button></div>' +
      (st !== 3 ? '<div class="prog"><i class="on"></i><i class="' + (st > 1 ? 'on' : '') + '"></i></div>' : '') + '</div>';
    h += '<div class="sc"><div class="pad" style="zoom:' + ZOOM[G.z] + ';padding:14px;gap:12px">';
    h += '<div class="row" style="gap:8px;flex-wrap:wrap"><button class="lg" style="font-size:14px" aria-pressed="' + R.off + '" data-act="off">' + t('off') + ': ' + t(R.off ? 'on' : 'offv') + '</button>' + (R.drafted ? '<span class="draftOk" style="font-size:14px;font-weight:700;color:#14472B">' + t('draftOk') + '</span>' : '') + '</div>';
    if (st === 1) {
      h += '<div class="card"><div class="lbl" style="margin-bottom:10px">' + t('cat') + '</div><div class="cats">' +
        KEYS.map(function (k, i) { return '<button class="cat" aria-pressed="' + (R.cat === k) + '" data-act="cat" data-k="' + k + '">' + t('cats')[i] + '</button>'; }).join('') + '</div>' +
        (R.errC ? '<div class="err" role="alert" style="margin-top:8px">' + t('eCat') + '</div>' : '') + '</div>';
      h += '<div class="card cardcol" style="gap:8px"><label for="au" class="lbl">' + t('auth') + '</label><select id="au" class="field" data-ch="auth">' +
        ['m', 'h', 'o'].map(function (k) { return '<option value="' + k + '"' + (R.auth === k ? ' selected' : '') + '>' + authName(k) + '</option>'; }).join('') + '</select><div class="note">' + t('sug') + '<br>' + t('sim') + '</div></div>';
      h += '<div class="card cardcol" style="gap:8px"><label for="ds" class="lbl">' + t('desc') + '</label><textarea id="ds" class="field" placeholder="' + esc(t('ph')) + '" data-in="desc">' + esc(R.desc) + '</textarea>' + (R.errD ? '<div class="err" role="alert">' + t('eDesc') + '</div>' : '') + '</div>';
      h += '<div class="card cardcol"><div class="row" style="justify-content:space-between"><span class="lbl">' + t('photos') + '</span><span style="font-weight:700;color:#455A64">' + n + ' / 5</span></div><div class="tiles">' +
        R.photos.map(function (u, i) { return '<button class="ph" aria-label="' + t('rm') + ' ' + (i + 1) + '" data-act="rmph" data-i="' + i + '"><img src="' + u + '" alt=""><span>×</span></button>'; }).join('') + '</div>' +
        '<div class="row g10"><label class="btn w fbtn">' + t('take') + '<input type="file" accept="image/*" capture="environment" style="display:none" data-file="1"></label><label class="btn w fbtn">' + t('up') + '<input type="file" accept="image/*" multiple style="display:none" data-file="1"></label></div><div class="hint" style="text-align:start">' + t('photoN') + '</div></div>';
      h += '<div class="card cardcol"><div class="lbl">' + t('loc') + '</div><div class="map" data-act="map" role="img" aria-label="' + t('map') + '"><svg class="bg" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 40L100 18M30 0L45 60M70 0L62 60" stroke="#fff" stroke-width="5" fill="none"/><path d="M0 12L55 30L100 48" stroke="#B7D3C0" stroke-width="2" fill="none"/></svg><div class="pin" style="left:' + R.px + '%;top:' + R.py + '%">' + ic(40, PINP) + '</div></div>' +
        '<div style="font-size:14px;line-height:1.5"><b>' + t(R.real ? 'gps' : 'gpsS') + '</b><br><span class="ltr" style="display:inline-block">' + coord() + '</span><br><span style="color:#455A64">' + t('acc') + ': ' + R.acc + ' m' + (R.acc > 20 ? '. ' + t('accW') : '') + '</span></div>' +
        '<button class="btn w small-btn" style="min-height:52px" aria-pressed="' + R.adj + '" data-act="adj">' + t(R.adj ? 'adjOn' : 'adj') + '</button></div>';
    } else if (st === 2) {
      h += '<div class="card rev"><div class="lbl" style="font-size:19px">' + t('review') + '</div>' +
        '<div><b>' + t('cat') + '</b><br>' + t('cats')[KEYS.indexOf(R.cat)] + '</div><div><b>' + t('auth') + '</b><br>' + authName(R.auth) + '<br><span class="note">' + t('sim') + '</span></div><div><b>' + t('desc') + '</b><br>' + esc(R.desc) + '</div>' +
        '<div><b>' + t('photos') + '</b> (' + n + ' / 5)<div class="thumbs">' + R.photos.map(function (u) { return '<img src="' + u + '" alt="">'; }).join('') + '</div></div><div><b>' + t('loc') + '</b><br><span class="ltr" style="display:inline-block">' + coord() + '</span></div></div>' +
        (R.gate ? '<div class="card gate col"><div class="err" role="alert">' + t('gate') + '</div><a class="btn w" href="#/login">' + t('loginL') + '</a><button class="btn w" data-act="demoSign">' + t('demoSign') + '</button></div>' : '');
    } else {
      h += '<div class="card center" style="padding:28px 18px;gap:12px"><div style="color:#1B5E3A">' + ic(64, CHECK) + '</div><div class="lbl" style="font-size:22px">' + t(R.draft ? 'dT' : 'okT') + '</div>' +
        (!R.draft ? '<div class="note">' + t('refl') + '</div><div class="refbox ltr">' + esc(R.ref) + '</div>' : '') + '<div class="note">' + t(R.draft ? 'dN' : 'okN') + '</div></div>';
    }
    h += '</div></div><div class="footbar">';
    if (st === 1) h += '<button class="btn g" data-act="next">' + t('next') + '</button><button class="btn w small-btn" data-act="draft">' + t('saveD') + '</button>';
    else if (st === 2) h += '<button class="btn g" data-act="submit">' + t('submitB') + '</button><button class="btn w" data-act="edit">' + t('back') + '</button>';
    else h += '<a class="btn g" href="#/main">' + t('menu') + '</a><button class="btn w" data-act="again">' + t('another') + '</button>';
    return h + '</div></div>';
  }

  /* ---------- render + routing ---------- */
  function mkRef() { return 'BLG-2026-' + Math.floor(100000 + Math.random() * 900000); }
  function render() {
    var de = document.documentElement; de.lang = G.lang; de.dir = G.lang === 'ar' ? 'rtl' : 'ltr';
    document.title = t('name') + ' | ' + (cur === 'login' ? t('tLogin') : cur === 'submit' ? t('title') : t('menu'));
    app.innerHTML = cur === 'login' ? viewLogin() : cur === 'submit' ? viewSubmit() : viewMain();
  }
  function route() {
    var r = (location.hash || '#/main').replace('#/', '');
    if (['main', 'login', 'submit'].indexOf(r) < 0) r = 'main';
    if (r !== cur) { cur = r; resetScreen(r); if (r === 'submit') askGeo(); }
    render();
  }
  function askGeo() {
    if (geoAsked || !navigator.geolocation) return; geoAsked = true;
    navigator.geolocation.getCurrentPosition(function (p) { if (cur === 'submit') { R.lat = p.coords.latitude; R.lon = p.coords.longitude; R.acc = Math.round(p.coords.accuracy); R.real = true; render(); } }, function () {}, { timeout: 6000 });
  }

  /* ---------- events ---------- */
  var A = {
    z: function () { G.z = (G.z + 1) % 3; sv({ z: G.z }); },
    lang: function () { G.lang = G.lang === 'ar' ? 'en' : 'ar'; sv({ lang: G.lang }); },
    svc: function (b) { M.svc = b.dataset.k; M.calling = false; },
    doCall: function () { M.calling = true; },
    closeC: function () { M.svc = ''; M.calling = false; },
    msgM: function () { M.msg = t('msgM'); }, msgP: function () { M.msg = t('msgP'); },
    demo: function () { G.inn = !G.inn; sv({ inn: G.inn }); M.msg = ''; },
    logout: function () { G.inn = false; sv({ inn: false }); M.msg = ''; },
    mode: function () { L.reg = !L.reg; L.step = 'phone'; L.otp = ''; L.err = ''; },
    send: function () {
      var p = L.phone.replace(/\D/g, '').replace(/^(966|0)/, '');
      if (!/^5\d{8}$/.test(p)) L.err = 'p'; else if (L.reg && !L.consent) L.err = 'c'; else { L.step = 'otp'; L.err = ''; }
    },
    verify: function () { if (L.otp.trim() === '123456') { G.inn = true; sv({ inn: true }); L.step = 'done'; L.err = ''; } else L.err = 'o'; },
    back: function () { L.step = 'phone'; L.otp = ''; L.err = ''; },
    logout2: function () { G.inn = false; sv({ inn: false }); L.step = 'phone'; L.phone = ''; L.otp = ''; },
    off: function () { R.off = !R.off; if (!R.off && R.step === 3 && R.draft) { R.draft = false; R.ref = mkRef(); } },
    cat: function (b) { R.cat = b.dataset.k; R.auth = MAP[R.cat]; R.errC = false; },
    rmph: function (b) { R.photos.splice(+b.dataset.i, 1); },
    adj: function () { R.adj = !R.adj; },
    draft: function () { R.drafted = true; },
    next: function () { var c = !R.cat, d = !R.desc.trim(); if (c || d) { R.errC = c; R.errD = d; } else { R.step = 2; R.adj = false; } },
    edit: function () { R.step = 1; R.gate = false; },
    demoSign: function () { G.inn = true; sv({ inn: true }); R.gate = false; },
    submit: function () { if (G.inn) { R.step = 3; R.gate = false; R.draft = R.off; R.ref = R.off ? '' : mkRef(); } else R.gate = true; },
    again: function () { var g = { lat: R.lat, lon: R.lon, acc: R.acc, real: R.real }; resetScreen('submit'); Object.assign(R, g); }
  };
  app.addEventListener('click', function (e) {
    var map = e.target.closest('[data-act="map"]');
    if (map) {
      if (!R.adj) return;
      var r = map.getBoundingClientRect();
      R.px = Math.round(Math.min(95, Math.max(5, (e.clientX - r.left) / r.width * 100)));
      R.py = Math.round(Math.min(95, Math.max(15, (e.clientY - r.top) / r.height * 100)));
      return render();
    }
    var b = e.target.closest('[data-act]');
    if (!b || !A[b.dataset.act]) return;
    A[b.dataset.act](b); render();
  });
  app.addEventListener('input', function (e) {
    var k = e.target.dataset.in; if (!k) return;
    var v = e.target.value;
    if (k === 'phone') { L.phone = v; L.err = ''; } else if (k === 'otp') { L.otp = v; L.err = ''; } else if (k === 'desc') { R.desc = v; R.errD = false; R.drafted = false; }
    var x = app.querySelector('.err[data-e="' + k + '"]'); if (x) x.remove();
    if (k === 'desc') { var o = app.querySelector('.draftOk'); if (o) o.remove(); }
  });
  app.addEventListener('change', function (e) {
    var el = e.target;
    if (el.dataset.ch === 'consent') { L.consent = el.checked; L.err = ''; render(); }
    else if (el.dataset.ch === 'auth') { R.auth = el.value; }
    else if (el.dataset.file) {
      var f = Array.prototype.slice.call(el.files || [], 0, 5 - R.photos.length);
      R.photos = R.photos.concat(f.map(function (x) { return URL.createObjectURL(x); })); el.value = ''; render();
    }
  });
  window.addEventListener('hashchange', route);
  route();
})();
