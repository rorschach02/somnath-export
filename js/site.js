(function () {
  var VARS = [
    { id: "white-onion", name: "White onion", fill: ["#E6D9B6", "#D9C89C", "#EEE3C6"], moist: "max 6.0–6.5%", ash: "max 4.0–5.0%" },
    { id: "red-onion",   name: "Red onion",   fill: ["#A0496F", "#8A3A5E", "#B9698A"], moist: "max 6.0–6.5%", ash: "max 4.0–5.0%" },
    { id: "pink-onion",  name: "Pink onion",  fill: ["#DE9FB1", "#D08A9F", "#E8B5C3"], moist: "max 6.0–6.5%", ash: "max 4.0–5.0%" },
    { id: "garlic",      name: "Garlic",      fill: ["#DCC284", "#CDB06C", "#E6D09C"], moist: "max 6.5%",     ash: "max 4.5%" }
  ];
  var CUTS = [
    { id: "flakes",   name: "Flakes",   size: "10–25 mm",    pack: "14 kg", min: 10,  max: 25,  n: 9,    thin: 0.38 },
    { id: "chopped",  name: "Chopped",  size: "3–8 mm",      pack: "14 kg", min: 3,   max: 8,   n: 60,   thin: 0.7 },
    { id: "minced",   name: "Minced",   size: "1–4 mm",      pack: "20 kg", min: 1,   max: 4,   n: 260,  thin: 0.8 },
    { id: "granules", name: "Granules", size: "0.2–1 mm",    pack: "20 kg", min: 0.2, max: 1,   n: 1500, thin: 1 },
    { id: "powder",   name: "Powder",   size: "80–100 mesh", pack: "20 kg", min: 0.15,max: 0.18,n: 5000, thin: 1 }
  ];
  var PX_PER_MM = 8;
  var I = window.SITE_I18N || {};

  var menuBtn = document.getElementById("menuBtn"), nav = document.getElementById("mainNav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.textContent = open ? (menuBtn.getAttribute("data-close") || "Close") : (menuBtn.getAttribute("data-open") || "Menu");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && e.target.getAttribute("href") !== "#") { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); menuBtn.textContent = menuBtn.getAttribute("data-open") || "Menu"; }
    });
  }
  var tray = document.querySelector(".tray");
  if (tray) initTray();
  var form = document.getElementById("inquiry");
  if (form) initForm();

  function initTray() {
    var state = { v: 0, c: 2 };
    var locked = tray.getAttribute("data-variety");
    if (locked) VARS.forEach(function (v, i) { if (v.id === locked) state.v = i; });
    var canvas = document.getElementById("trayCanvas");
    var photo = document.getElementById("trayPhoto");
    var note = document.getElementById("trayNote");
    var ctx = canvas.getContext("2d");

    function rng(seed) {
      return function () {
        seed |= 0; seed = seed + 0x6D2B79F5 | 0;
        var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      };
    }

    function drawCanvas() {
      var v = VARS[state.v], c = CUTS[state.c];
      var w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      var dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      var r = rng(state.v * 31 + state.c * 7 + 5);
      var count = Math.round(c.n * (w / 480));
      for (var i = 0; i < count; i++) {
        var d = (c.min + r() * (c.max - c.min)) * PX_PER_MM;
        var x = r() * w, y = r() * (h - 34);
        ctx.fillStyle = v.fill[Math.floor(r() * v.fill.length)];
        if (d < 2.5) { ctx.fillRect(x, y, Math.max(1, d), Math.max(1, d)); continue; }
        var rot = r() * Math.PI, pts = 7 + Math.floor(r() * 3);
        ctx.beginPath();
        for (var k = 0; k < pts; k++) {
          var a = (k / pts) * Math.PI * 2;
          var rad = (d / 2) * (0.75 + r() * 0.35);
          var px = Math.cos(a) * rad, py = Math.sin(a) * rad * c.thin;
          var X = x + px * Math.cos(rot) - py * Math.sin(rot);
          var Y = y + px * Math.sin(rot) + py * Math.cos(rot);
          if (k) ctx.lineTo(X, Y); else ctx.moveTo(X, Y);
        }
        ctx.closePath(); ctx.fill();
      }
      var bx = 14, by = h - 14, bw = 10 * PX_PER_MM;
      ctx.fillStyle = "rgba(245,247,250,.92)"; ctx.fillRect(6, h - 32, bw + 70, 26);
      ctx.strokeStyle = "#0F1B2D"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(bx, by - 5); ctx.lineTo(bx, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by - 5); ctx.stroke();
      ctx.fillStyle = "#0F1B2D"; ctx.font = "500 12px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText("10 mm", bx + bw + 10, by);
    }

    function showDrawing() {
      photo.hidden = true; canvas.hidden = false;
      note.textContent = I.note || "Drawn to scale against the 10 mm bar. Illustration only; ask for a physical sample to approve colour and cut.";
      drawCanvas();
    }

    function update() {
      var v = VARS[state.v], c = CUTS[state.c];
      var cutName = (I.cuts && I.cuts[c.id]) || c.name;
      var size = I.mesh ? c.size.replace("mesh", I.mesh) : c.size;
      var tr = function (x) { return I.max ? x.replace("max", I.max) : x; };
      document.getElementById("rSize").textContent = size;
      document.getElementById("rPack").textContent = I.bag ? I.bag + " " + c.pack : c.pack + " bag";
      document.getElementById("rMoist").textContent = tr(v.moist);
      document.getElementById("rAsh").textContent = tr(v.ash);
      var label = I.name ? I.name + ", " + cutName + ", " + size : "Dehydrated " + v.name.toLowerCase() + " " + c.name.toLowerCase() + ", " + c.size;
      canvas.setAttribute("aria-label", I.name ? label : label + ", drawn to scale");
      // A real photo at img/<product>-<cut>.jpg replaces the drawing when the file exists.
      var probe = new Image(), want = state.v + ":" + state.c;
      probe.onload = function () {
        if (want !== state.v + ":" + state.c) return;
        photo.src = probe.src; photo.alt = label;
        photo.hidden = false; canvas.hidden = true;
        note.textContent = I.name ? "" : "Photo of our " + v.name.toLowerCase() + " " + c.name.toLowerCase() + ". Ask for a physical sample to approve colour and cut.";
      };
      probe.onerror = function () { if (want === state.v + ":" + state.c) showDrawing(); };
      showDrawing();
      probe.src = (tray.getAttribute("data-img") || "img/") + v.id + "-" + c.id + ".jpg";
    }

    function chips(hostId, items, key) {
      var host = document.getElementById(hostId);
      if (!host) return;
      items.forEach(function (it, i) {
        var b = document.createElement("button");
        b.type = "button"; b.textContent = (key === "c" && I.cuts && I.cuts[it.id]) || it.name;
        b.setAttribute("aria-pressed", String(state[key] === i));
        b.addEventListener("click", function () {
          state[key] = i;
          Array.prototype.forEach.call(host.children, function (ch, j) { ch.setAttribute("aria-pressed", String(j === i)); });
          update();
        });
        host.appendChild(b);
      });
    }
    chips("varChips", VARS, "v");
    chips("cutChips", CUTS, "c");
    update();
    window.addEventListener("resize", function () { if (!canvas.hidden) drawCanvas(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (!canvas.hidden) drawCanvas(); });
  }

  // Inquiry: no backend in this preview, so hand the message to WhatsApp.
  function initForm() {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var g = function (id) { return document.getElementById(id).value.trim(); };
      var need = ["f-name", "f-country", "f-email"].filter(function (id) { return !g(id); });
      if (need.length) { document.getElementById(need[0]).focus(); return; }
      var lines = [
        "Inquiry for Somnath Export",
        "Name: " + g("f-name"),
        g("f-company") ? "Company: " + g("f-company") : "",
        "Country: " + g("f-country"),
        "Email: " + g("f-email"),
        "Product: " + g("f-product") + " (" + g("f-cut") + ")",
        g("f-qty") ? "Quantity and port: " + g("f-qty") : "",
        g("f-msg") ? "Notes: " + g("f-msg") : ""
      ].filter(Boolean).join("\n");
      document.getElementById("resultText").textContent = lines;
      document.getElementById("waLink").href = "https://wa.me/919426424934?text=" + encodeURIComponent(lines);
      var box = document.getElementById("result");
      box.hidden = false; box.scrollIntoView({ block: "nearest" });
    });
    document.getElementById("copyBtn").addEventListener("click", function () {
      var btn = this, text = document.getElementById("resultText").textContent;
      try {
        navigator.clipboard.writeText(text).then(function () { btn.textContent = "Copied"; }, function () { btn.textContent = "Select the text to copy"; });
      } catch (err) { btn.textContent = "Select the text to copy"; }
    });
  }
})();
