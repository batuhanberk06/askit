const LAYER_NAMES = {
  badge: "Rozet",
  headline: "Başlık",
  body: "Açıklama",
  mock: "Sayfa / mockup",
  menu: "Sağ tık menüsü",
  "pill-0": "Etiket 1",
  "pill-1": "Etiket 2",
  "pill-2": "Etiket 3",
  "pill-3": "Etiket 4",
  "chip-0": "Etiket 1",
  "chip-1": "Etiket 2",
  "stat-0": "Kart 1",
  "stat-1": "Kart 2",
  "stat-2": "Kart 3",
  "card-0": "Kart 1",
  "card-1": "Kart 2",
  "card-2": "Kart 3",
  title2: "AskIt satırı",
};

function L(id, x, y, extra = {}) {
  return { id, x, y, scale: 1, opacity: 1, visible: true, z: 3, ...extra };
}

function defaultLayers(id) {
  const layers = [
    L("headline", 4.2, 20, { z: 4 }),
    L("body", 4.2, 52, { z: 4 }),
  ];
  if (id !== "select" && id !== "shot") {
    layers.unshift(L("badge", 4.2, 11, { z: 4 }));
  }
  if (id !== "shot") {
    layers.push(L("mock", 54, 9, { z: 5 }));
  }
  if (id === "hero") {
    layers.push(L("pill-0", 4.2, 76), L("pill-1", 18, 76), L("pill-2", 32.5, 76), L("pill-3", 4.2, 86));
  }
  if (id === "capture") {
    layers.push(
      L("chip-0", 4.2, 80, { kind: "chip", text: "Alt + Shift + S  capture" }),
      L("chip-1", 22, 80, { kind: "chip", text: "Right-click  AskIt" })
    );
  }
  if (id === "select") {
    layers.find((x) => x.id === "mock").x = 48;
    layers.find((x) => x.id === "mock").y = 10;
    layers.find((x) => x.id === "headline").y = 18;
    layers.find((x) => x.id === "body").y = 48;
    layers.push(
      L("title2", 4.2, 7, { kind: "text", text: "AskIt.", z: 4, scale: 1.05 }),
      L("chip-0", 4.2, 78, { kind: "chip", text: "ChatGPT // Gemini // Claude // Perplexity" }),
      L("menu", 62, 46, { z: 12 }),
      L("cursor-1", 74, 58, { kind: "cursor", cursor: "black", scale: 1.15, z: 14 })
    );
  }
  if (id === "shot") {
    layers.find((x) => x.id === "headline").y = 18;
    layers.find((x) => x.id === "body").y = 48;
    layers.push(
      L("title2", 4.2, 7, { kind: "text", text: "AskIt.", z: 4, scale: 1.05 }),
      L("chip-0", 4.2, 78, { kind: "chip", text: "ChatGPT // Gemini // Claude // Perplexity" })
    );
  }
  if (id === "privacy") {
    layers.push(L("stat-0", 4.2, 76), L("stat-1", 16, 76), L("stat-2", 28, 76));
  }
  if (id === "ais") {
    layers.push(L("card-0", 4.2, 76), L("card-1", 16, 76), L("card-2", 28, 76));
  }
  return layers;
}

const TEMPLATES = {
  hero: {
    label: "Hero",
    badge: "NO ACCOUNT · NO SERVER",
    headline: "See something.\nAsk *anything.*",
    body: "A no-nonsense Chromium helper. Select text, capture the tab, or send the page URL to ChatGPT, Gemini, Claude or Perplexity — you click Send.",
    bg1: "#f3efe6",
    bg2: "#f9d0ea",
    accent: "#7c3aed",
    pills: ["Right-click text", "Alt+Shift+S", "4 AIs", "You send it"],
  },
  capture: {
    label: "Ekran görüntüsü",
    badge: "• NEW • v0.5.0",
    headline: "Select.\nCapture.\n*Ask anything.*",
    body: "Grab the visible tab with one shortcut. A short request opens in the AI you already use — no extra account, no extra editor.",
    bg1: "#ff8e7a",
    bg2: "#d81bab",
    accent: "#14161c",
    shortcuts: ["Alt + Shift + S  capture", "Right-click  AskIt"],
    floatBadge: "CAPTURED",
    pipBadge: "TAB · SHOT",
  },
  privacy: {
    label: "Gizlilik",
    badge: "100% LOCAL · ZERO TELEMETRY",
    headline: "Nothing is *sent to us.*",
    body: "No backend, no database, no analytics, no API keys. Captured content stays in your browser until you send it yourself to the AI’s web app.",
    bg1: "#0d1f18",
    bg2: "#163028",
    accent: "#86efac",
    stats: [
      { n: "0", l: "TRACKERS" },
      { n: "0", l: "SERVERS" },
      { n: "0", l: "ACCOUNTS" },
    ],
  },
  ais: {
    label: "AI seçimi",
    badge: "// CHATGPT · GEMINI · CLAUDE · PERPLEXITY",
    headline: "One capture.\n*Any AI.*",
    body: "Choose the model you already pay for, pick a task, continue. The tab opens ready — you send the message yourself.",
    bg1: "#0b0b14",
    bg2: "#16132a",
    accent: "#c4b5fd",
    cards: [
      { n: "4", l: "AIS" },
      { n: "6", l: "TASKS" },
      { n: "1", l: "SHORTCUT" },
    ],
  },
  select: {
    label: "Metin seçimi",
    badge: "",
    headline: "Select it.\nRight-click.",
    body: "Select any text on a page. Right-click it, choose AskIt, and send it to the AI you want.",
    bg1: "#e8eef6",
    bg2: "#c7d2fe",
    accent: "#2563eb",
    pageTitle: "How attention actually works",
    pageBody:
      "Attention is limited, and distractions can make it harder to stay focused. Switching between tasks too often can slow you down and make it harder to remember information. Doing one thing at a time can help you understand and remember what you read.",
    selected: "Switching between tasks too often can slow you down and make it harder to remember information.",
    pageUrl: "nature.com/articles/attention",
    pageImage: "",
    selX: 18,
    selY: 38,
    selW: 54,
    selH: 8,
  },
  shot: {
    label: "Screenshot",
    badge: "",
    headline: "Select it.\nRight-click.",
    body: "Select any text on a page. Right-click it, choose AskIt, and send it to the AI you want.",
    bg1: "#e8eef6",
    bg2: "#c7d2fe",
    accent: "#2563eb",
  },
};

for (const id of Object.keys(TEMPLATES)) {
  TEMPLATES[id].layers = defaultLayers(id);
}

const drafts = {
  hero: structuredClone(TEMPLATES.hero),
  capture: structuredClone(TEMPLATES.capture),
  privacy: structuredClone(TEMPLATES.privacy),
  ais: structuredClone(TEMPLATES.ais),
  select: structuredClone(TEMPLATES.select),
  shot: structuredClone(TEMPLATES.shot),
};

const state = {
  id: "hero",
  width: 1400,
  height: 560,
  data: drafts.hero,
  selected: null,
};

const STORE_KEY = "askit-ads-studio";

function persist() {
  try {
    localStorage.setItem(
      STORE_KEY,
      JSON.stringify({
        v: 1,
        id: state.id,
        width: state.width,
        height: state.height,
        drafts,
      })
    );
  } catch {
    /* quota */
  }
}

let persistTimer = 0;
function persistSoon() {
  clearTimeout(persistTimer);
  persistTimer = setTimeout(persist, 250);
}

function restore() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
    if (!saved || !saved.drafts) return;
    for (const id of Object.keys(TEMPLATES)) {
      if (saved.drafts[id]) drafts[id] = saved.drafts[id];
    }
    if (saved.id && drafts[saved.id]) state.id = saved.id;
    if (saved.width && saved.height) {
      state.width = saved.width;
      state.height = saved.height;
    }
    state.data = drafts[state.id];
  } catch {
    /* ignore */
  }
}

const stage = document.getElementById("stage");
const frame = document.getElementById("preview-frame");
const wrap = document.getElementById("preview-wrap");
const tabs = document.getElementById("tabs");
const guideX = document.getElementById("guide-x");
const guideY = document.getElementById("guide-y");

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function rich(text) {
  return esc(text)
    .replace(/\n/g, "<br>")
    .replace(/\*(.+?)\*/g, '<em class="accent">$1</em>');
}

function splitShortcut(raw) {
  const parts = String(raw || "").trim().split(/\s{2,}/);
  if (parts.length > 1) {
    return `<b>${esc(parts[0])}</b><em>${esc(parts.slice(1).join(" "))}</em>`;
  }
  return esc(raw || "");
}

function clip(s, n = 32) {
  const t = String(s || "").replace(/\s+/g, " ").trim();
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
}

function highlightBody(full, selected) {
  const text = String(full || "");
  const sel = String(selected || "").trim();
  if (!sel) return `<p>${esc(text).replace(/\n/g, "<br>")}</p>`;
  const i = text.toLowerCase().indexOf(sel.toLowerCase());
  if (i < 0) {
    return `<p>${esc(text).replace(/\n/g, "<br>")}</p><p><span class="sel-text">${esc(sel)}</span></p>`;
  }
  const before = esc(text.slice(0, i)).replace(/\n/g, "<br>");
  const hit = esc(text.slice(i, i + sel.length));
  const after = esc(text.slice(i + sel.length)).replace(/\n/g, "<br>");
  return `<p>${before}<span class="sel-text">${hit}</span>${after}</p>`;
}

function syncHighlightBoxes() {
  const page = document.getElementById("page");
  if (!page) return;
  page.querySelectorAll("[data-hl-box]").forEach((n) => n.remove());
  if (state.id !== "select" || state.data.pageImage) return;
  const hits = page.querySelectorAll(".sel-text");
  if (!hits.length) return;
  const pageRect = page.getBoundingClientRect();
  const localScale = pageRect.width / Math.max(1, page.offsetWidth);
  for (const hit of hits) {
    for (const r of hit.getClientRects()) {
      if (r.width < 0.5 || r.height < 0.5) continue;
      const box = document.createElement("i");
      box.setAttribute("data-hl-box", "1");
      box.style.left = `${(r.left - pageRect.left) / localScale}px`;
      box.style.top = `${(r.top - pageRect.top) / localScale}px`;
      box.style.width = `${r.width / localScale}px`;
      box.style.height = `${r.height / localScale}px`;
      page.append(box);
    }
  }
}

function layers() {
  return state.data.layers;
}

function getLayer(id) {
  return layers().find((item) => item.id === id);
}

function activeLayerIds() {
  return layers()
    .map((item) => item.id)
    .filter((id) => {
      const el = stage.querySelector(`[data-layer="${id}"]`);
      return el && getComputedStyle(el).display !== "none" || el?.classList.contains("layer-off");
    });
}

function visibleInTheme(id) {
  const el = stage.querySelector(`[data-layer="${id}"]`);
  if (!el) return false;
  if (el.classList.contains("layer-off")) return true;
  return getComputedStyle(el).display !== "none";
}

const CURSOR_SVG =
  '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 3.2 6 24.2 12.1 18.6 16.8 29 20.6 27.4 16 17 24.8 16.8Z"/></svg>';

function nextUid() {
  state.data.uid = (state.data.uid || 20) + 1;
  return state.data.uid;
}

function layerKind(layer) {
  if (layer.kind) return layer.kind;
  if (layer.id.startsWith("chip-")) return "chip";
  if (layer.id.startsWith("text-") || layer.id === "title2") return "text";
  if (layer.id.startsWith("cursor-")) return "cursor";
  if (layer.id.startsWith("image-")) return "image";
  return "";
}

function layerLabel(layer) {
  if (LAYER_NAMES[layer.id]) return LAYER_NAMES[layer.id];
  const kind = layerKind(layer);
  if (kind === "cursor") return layer.cursor === "white" ? "İmleç (beyaz)" : "İmleç (siyah)";
  if (kind === "image") return "Görsel";
  if (kind === "chip") return layer.text || "Etiket";
  if (kind === "text") return String(layer.text || "Yazı").replace(/\*/g, "").slice(0, 22) || "Yazı";
  return layer.id;
}

function ensureLayerEl(layer) {
  let el = stage.querySelector(`[data-layer="${layer.id}"]`);
  if (el) {
    el.dataset.kind = layerKind(layer);
    return el;
  }
  el = document.createElement("div");
  el.className = "layer";
  el.dataset.layer = layer.id;
  el.dataset.kind = layerKind(layer);
  const kind = layerKind(layer);
  if (kind === "chip") el.innerHTML = '<span class="chip-item"></span>';
  else if (kind === "cursor") el.innerHTML = `<div class="cursor-gfx ${layer.cursor || "black"}">${CURSOR_SVG}</div>`;
  else if (kind === "image") el.innerHTML = '<img class="free-img" alt="" />';
  else el.innerHTML = '<h1 class="free-text"></h1>';
  document.getElementById("dyn-layers").append(el);
  return el;
}

function paintLayerContent(layer) {
  const el = ensureLayerEl(layer);
  const kind = layerKind(layer);
  if (kind === "chip") {
    const item = el.querySelector(".chip-item");
    if (item) item.textContent = layer.text || "";
  }
  if (kind === "text") {
    const item = el.querySelector("h1");
    if (item) item.innerHTML = rich(layer.text || "");
  }
  if (kind === "cursor") {
    const gfx = el.querySelector(".cursor-gfx");
    if (gfx) gfx.className = `cursor-gfx ${layer.cursor === "white" ? "white" : "black"}`;
  }
  if (kind === "image") {
    const img = el.querySelector(".free-img");
    if (img && layer.src) img.src = layer.src;
  }
}

function applyLayers() {
  const ids = new Set(layers().map((item) => item.id));
  stage.querySelectorAll(".layer[data-layer]").forEach((el) => {
    if (!ids.has(el.dataset.layer)) {
      el.classList.add("layer-off");
      el.classList.remove("selected");
    }
  });
  for (const layer of layers()) {
    const el = ensureLayerEl(layer);
    el.classList.toggle("layer-off", !layer.visible);
    el.classList.toggle("selected", state.selected === layer.id);
    el.style.left = `${layer.x}%`;
    el.style.top = `${layer.y}%`;
    el.style.transform = `scale(${layer.scale})`;
    el.style.opacity = String(layer.opacity);
    el.style.zIndex = String(layer.z);
    paintLayerContent(layer);
    let handle = el.querySelector(":scope > .handle");
    if (state.selected === layer.id) {
      if (!handle) {
        handle = document.createElement("i");
        handle.className = "handle se";
        el.append(handle);
      }
    } else if (handle) {
      handle.remove();
    }
  }
}

function renderLayerList() {
  const box = document.getElementById("layer-list");
  box.replaceChildren();
  for (const layer of layers()) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `${state.selected === layer.id ? "on" : ""} ${layer.visible ? "" : "off"}`.trim();
    btn.innerHTML = `<span>${esc(layerLabel(layer))}</span><span class="eye">${layer.visible ? "👁" : "–"}</span>`;
    btn.addEventListener("click", (e) => {
      if (e.target.classList.contains("eye")) {
        layer.visible = !layer.visible;
        applyLayers();
        renderLayerList();
        syncInspector();
        return;
      }
      selectLayer(layer.id);
    });
    box.append(btn);
  }
  renderChipFields();
}

function renderChipFields() {
  const box = document.getElementById("chip-fields");
  if (!box) return;
  const chips = layers().filter((item) => layerKind(item) === "chip");
  box.replaceChildren();
  if (!chips.length) return;
  const title = document.createElement("p");
  title.className = "extra-title";
  title.textContent = "Etiketler";
  box.append(title);
  for (const layer of chips) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = layer.text || "";
    input.addEventListener("input", () => {
      layer.text = input.value;
      paintLayerContent(layer);
    });
    box.append(input);
  }
}

function syncInspector() {
  const layer = getLayer(state.selected);
  const empty = !layer;
  const kind = empty ? "" : layerKind(layer);
  document.getElementById("inspector").classList.toggle("is-empty", empty);
  document.getElementById("layer-name").textContent = empty ? "yok" : layerLabel(layer);
  document.getElementById("layer-visible").checked = empty ? false : layer.visible;
  document.getElementById("layer-scale").value = empty ? 100 : Math.round(layer.scale * 100);
  document.getElementById("layer-scale-val").textContent = `${empty ? 100 : Math.round(layer.scale * 100)}%`;
  document.getElementById("layer-opacity").value = empty ? 100 : Math.round(layer.opacity * 100);
  document.getElementById("layer-opacity-val").textContent = `${empty ? 100 : Math.round(layer.opacity * 100)}%`;
  document.getElementById("insp-text-wrap").classList.toggle("hidden", !["chip", "text"].includes(kind));
  document.getElementById("insp-cursor-wrap").classList.toggle("hidden", kind !== "cursor");
  if (kind === "chip" || kind === "text") {
    document.getElementById("layer-text").value = layer.text || "";
  }
  document.getElementById("cursor-black").classList.toggle("on", !empty && layer.cursor !== "white");
  document.getElementById("cursor-white").classList.toggle("on", !empty && layer.cursor === "white");
}

function selectLayer(id) {
  state.selected = id;
  applyLayers();
  renderLayerList();
  syncInspector();
}

function paint() {
  const d = state.data;
  stage.dataset.theme = state.id;
  stage.style.width = `${state.width}px`;
  stage.style.height = `${state.height}px`;
  stage.style.setProperty("--u", String(state.width / 1400));
  stage.style.setProperty("--bg1", d.bg1);
  stage.style.setProperty("--bg2", d.bg2);
  stage.style.setProperty("--accent", d.accent);

  document.getElementById("out-badge").textContent = d.badge;
  document.getElementById("out-headline").innerHTML = rich(d.headline);
  document.getElementById("out-body").textContent = d.body;
  const title2 = getLayer("title2");
  if (title2) document.getElementById("out-title2").innerHTML = rich(title2.text || "");

  (d.pills || []).forEach((text, i) => {
    const el = stage.querySelector(`[data-layer="pill-${i}"] .pill-item`);
    if (el) el.textContent = text;
  });
  (d.stats || []).forEach((s, i) => {
    const el = stage.querySelector(`[data-layer="stat-${i}"] .stat-item`);
    if (!el) return;
    el.querySelector("b").textContent = s.n;
    el.querySelector("small").textContent = s.l;
  });
  (d.cards || []).forEach((s, i) => {
    const el = stage.querySelector(`[data-layer="card-${i}"] .feat-item`);
    if (!el) return;
    el.querySelector("b").textContent = s.n;
    el.querySelector("small").textContent = s.l;
  });

  document.getElementById("out-float-text").textContent = d.floatBadge || "CAPTURED";
  document.getElementById("out-pip").textContent = d.pipBadge || "TAB · SHOT";

  const mockSelect = document.getElementById("mock-select");
  const shot = document.getElementById("page-shot");
  const article = document.getElementById("page-article");
  const box = document.getElementById("sel-box");
  const snippet = String(d.selected || "").replace(/\s+/g, " ").trim();
  document.getElementById("out-url").textContent = d.pageUrl || "example.com/article";
  document.getElementById("ctx-google").textContent = snippet
    ? `Search Google for “${snippet}”`
    : "Search Google for “…”";
  document.getElementById("ctx-askit").textContent = snippet
    ? `AskIt: “${snippet}”`
    : "AskIt: “…”";
  mockSelect.classList.toggle("has-shot", Boolean(d.pageImage));
  if (d.pageImage) {
    shot.src = d.pageImage;
    box.style.left = `${d.selX ?? 18}%`;
    box.style.top = `${d.selY ?? 38}%`;
    box.style.width = `${d.selW ?? 54}%`;
    box.style.height = `${d.selH ?? 8}%`;
  } else {
    shot.removeAttribute("src");
    const title = d.pageTitle ? `<h3>${esc(d.pageTitle)}</h3>` : "";
    article.innerHTML = title + highlightBody(d.pageBody, d.selected);
  }

  applyLayers();
  renderLayerList();
  syncInspector();
  fit();
  syncHighlightBoxes();
  persistSoon();
}

function fit() {
  const pad = 56;
  const scale = Math.min(
    (wrap.clientWidth - pad) / state.width,
    (wrap.clientHeight - pad) / state.height,
    1
  );
  frame.style.width = `${state.width * scale}px`;
  frame.style.height = `${state.height * scale}px`;
  stage.style.transform = `scale(${scale})`;
  stage.style.transformOrigin = "top left";
}

function fillForm() {
  const d = state.data;
  document.getElementById("badge").value = d.badge;
  document.getElementById("badge-field").classList.toggle("hidden", !getLayer("badge"));
  document.getElementById("headline").value = d.headline;
  const title2 = getLayer("title2");
  document.getElementById("title2-field").classList.toggle("hidden", !title2);
  if (title2) document.getElementById("title2").value = title2.text || "";
  document.getElementById("body").value = d.body;
  document.getElementById("bg1").value = d.bg1;
  document.getElementById("bg2").value = d.bg2;
  document.getElementById("accent").value = d.accent;
  document.getElementById("size").value = `${state.width}x${state.height}`;

  document.querySelectorAll("[data-pill]").forEach((el) => {
    el.value = (d.pills || [])[Number(el.dataset.pill)] || "";
  });
  document.getElementById("float-badge").value = d.floatBadge || "";
  document.getElementById("pip-badge").value = d.pipBadge || "";
  document.querySelectorAll("[data-stat-n]").forEach((el) => {
    el.value = (d.stats || [])[Number(el.dataset.statN)]?.n || "";
  });
  document.querySelectorAll("[data-stat-l]").forEach((el) => {
    el.value = (d.stats || [])[Number(el.dataset.statL)]?.l || "";
  });
  document.querySelectorAll("[data-card-n]").forEach((el) => {
    el.value = (d.cards || [])[Number(el.dataset.cardN)]?.n || "";
  });
  document.querySelectorAll("[data-card-l]").forEach((el) => {
    el.value = (d.cards || [])[Number(el.dataset.cardL)]?.l || "";
  });
  document.getElementById("page-title").value = d.pageTitle || "";
  document.getElementById("page-body").value = d.pageBody || "";
  document.getElementById("selected-text").value = d.selected || "";

  document.getElementById("fields-hero").classList.toggle("hidden", state.id !== "hero");
  document.getElementById("fields-capture").classList.toggle("hidden", state.id !== "capture");
  document.getElementById("fields-privacy").classList.toggle("hidden", state.id !== "privacy");
  document.getElementById("fields-ais").classList.toggle("hidden", state.id !== "ais");
  document.getElementById("fields-select").classList.toggle("hidden", state.id !== "select");

  [...tabs.children].forEach((b) => b.classList.toggle("on", b.dataset.id === state.id));
}

function readForm() {
  const d = state.data;
  d.badge = document.getElementById("badge").value;
  d.headline = document.getElementById("headline").value;
  const title2 = getLayer("title2");
  if (title2) title2.text = document.getElementById("title2").value;
  d.body = document.getElementById("body").value;
  d.bg1 = document.getElementById("bg1").value;
  d.bg2 = document.getElementById("bg2").value;
  d.accent = document.getElementById("accent").value;
  if (d.pills) {
    document.querySelectorAll("[data-pill]").forEach((el) => {
      d.pills[Number(el.dataset.pill)] = el.value;
    });
  }
  d.floatBadge = document.getElementById("float-badge").value;
  d.pipBadge = document.getElementById("pip-badge").value;
  if (d.stats) {
    d.stats.forEach((s, i) => {
      s.n = document.querySelector(`[data-stat-n="${i}"]`).value;
      s.l = document.querySelector(`[data-stat-l="${i}"]`).value;
    });
  }
  if (d.cards) {
    d.cards.forEach((s, i) => {
      s.n = document.querySelector(`[data-card-n="${i}"]`).value;
      s.l = document.querySelector(`[data-card-l="${i}"]`).value;
    });
  }
  d.pageTitle = document.getElementById("page-title").value;
  d.pageBody = document.getElementById("page-body").value;
  d.selected = document.getElementById("selected-text").value;
  paint();
}

function setTemplate(id) {
  state.id = id;
  state.data = drafts[id];
  if (!state.data.layers) state.data.layers = defaultLayers(id);
  state.selected = null;
  fillForm();
  paint();
}

for (const [id, t] of Object.entries(TEMPLATES)) {
  const b = document.createElement("button");
  b.type = "button";
  b.dataset.id = id;
  b.textContent = t.label;
  b.addEventListener("click", () => setTemplate(id));
  tabs.append(b);
}

document.getElementById("size").addEventListener("change", (e) => {
  const [w, h] = e.target.value.split("x").map(Number);
  state.width = w;
  state.height = h;
  paint();
});

document.getElementById("reset").addEventListener("click", () => {
  drafts[state.id] = structuredClone(TEMPLATES[state.id]);
  state.data = drafts[state.id];
  state.selected = null;
  fillForm();
  paint();
});

document.querySelector(".panel").addEventListener("input", (e) => {
  if (e.target.closest("#inspector") || e.target.closest("#chip-fields")) return;
  readForm();
});

document.getElementById("layer-visible").addEventListener("change", () => {
  const layer = getLayer(state.selected);
  if (!layer) return;
  layer.visible = document.getElementById("layer-visible").checked;
  applyLayers();
  renderLayerList();
});

document.getElementById("layer-scale").addEventListener("input", () => {
  const layer = getLayer(state.selected);
  if (!layer) return;
  layer.scale = Number(document.getElementById("layer-scale").value) / 100;
  document.getElementById("layer-scale-val").textContent = `${Math.round(layer.scale * 100)}%`;
  applyLayers();
});

document.getElementById("layer-opacity").addEventListener("input", () => {
  const layer = getLayer(state.selected);
  if (!layer) return;
  layer.opacity = Number(document.getElementById("layer-opacity").value) / 100;
  document.getElementById("layer-opacity-val").textContent = `${Math.round(layer.opacity * 100)}%`;
  applyLayers();
});

document.getElementById("layer-hide").addEventListener("click", () => {
  const layer = getLayer(state.selected);
  if (!layer) return;
  layer.visible = false;
  applyLayers();
  renderLayerList();
  syncInspector();
});

document.getElementById("layer-text").addEventListener("input", () => {
  const layer = getLayer(state.selected);
  if (!layer) return;
  layer.text = document.getElementById("layer-text").value;
  paintLayerContent(layer);
  const t2 = document.getElementById("title2");
  if (layer.id === "title2" && t2) t2.value = layer.text;
});

document.getElementById("cursor-black").addEventListener("click", () => {
  const layer = getLayer(state.selected);
  if (!layer || layerKind(layer) !== "cursor") return;
  layer.cursor = "black";
  paintLayerContent(layer);
  syncInspector();
  renderLayerList();
});

document.getElementById("cursor-white").addEventListener("click", () => {
  const layer = getLayer(state.selected);
  if (!layer || layerKind(layer) !== "cursor") return;
  layer.cursor = "white";
  paintLayerContent(layer);
  syncInspector();
  renderLayerList();
});

function addChip() {
  const n = layers().filter((item) => layerKind(item) === "chip").length;
  const layer = L(`chip-${nextUid()}`, 4 + (n % 3) * 15, 80 + Math.floor(n / 3) * 9, {
    kind: "chip",
    text: "Yeni etiket",
    z: 6,
  });
  layers().push(layer);
  paint();
  selectLayer(layer.id);
}

function addText() {
  const n = layers().filter((item) => layerKind(item) === "text").length;
  const layer = L(`text-${nextUid()}`, 4.2, 28 + n * 10, {
    kind: "text",
    text: "Yeni yazı",
    z: 6,
  });
  layers().push(layer);
  paint();
  selectLayer(layer.id);
}

function addCursor() {
  const layer = L(`cursor-${nextUid()}`, 62, 48, {
    kind: "cursor",
    cursor: "black",
    scale: 1.15,
    z: 14,
  });
  layers().push(layer);
  paint();
  selectLayer(layer.id);
}

document.getElementById("add-chip").addEventListener("click", addChip);
document.getElementById("add-text").addEventListener("click", addText);
document.getElementById("add-cursor").addEventListener("click", addCursor);

function addImageLayer(src) {
  const layer = L(`image-${nextUid()}`, 38, 22, {
    kind: "image",
    src,
    scale: 1,
    z: 8,
  });
  layers().push(layer);
  paint();
  selectLayer(layer.id);
}

document.getElementById("add-image").addEventListener("click", () => {
  document.getElementById("layer-image").click();
});

document.getElementById("layer-image").addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  e.target.value = "";
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => addImageLayer(String(reader.result || ""));
  reader.readAsDataURL(file);
});

document.getElementById("layer-front").addEventListener("click", () => {
  const layer = getLayer(state.selected);
  if (!layer) return;
  layer.z = Math.min(40, (layer.z || 3) + 1);
  applyLayers();
});

document.getElementById("layer-back").addEventListener("click", () => {
  const layer = getLayer(state.selected);
  if (!layer) return;
  layer.z = Math.max(1, (layer.z || 3) - 1);
  applyLayers();
});

document.getElementById("page-image").addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    drafts.select.pageImage = String(reader.result || "");
    if (state.id === "select") {
      state.data.pageImage = drafts.select.pageImage;
      paint();
    }
  };
  reader.readAsDataURL(file);
});

document.getElementById("clear-image").addEventListener("click", () => {
  drafts.select.pageImage = "";
  document.getElementById("page-image").value = "";
  if (state.id === "select") {
    state.data.pageImage = "";
    paint();
  }
});

function stagePoint(event) {
  const r = stage.getBoundingClientRect();
  return {
    x: ((event.clientX - r.left) / r.width) * 100,
    y: ((event.clientY - r.top) / r.height) * 100,
  };
}

const SNAP = 0.75;

function layerBox(layer) {
  const el = stage.querySelector(`[data-layer="${layer.id}"]`);
  if (!el || el.classList.contains("layer-off")) return null;
  const w = (el.offsetWidth * (layer.scale || 1) / Math.max(1, stage.clientWidth)) * 100;
  const h = (el.offsetHeight * (layer.scale || 1) / Math.max(1, stage.clientHeight)) * 100;
  return {
    left: layer.x,
    top: layer.y,
    right: layer.x + w,
    bottom: layer.y + h,
    cx: layer.x + w / 2,
    cy: layer.y + h / 2,
  };
}

function nearestEdge(value, candidates) {
  let best = null;
  let dist = SNAP;
  for (const item of candidates) {
    const d = Math.abs(value - item);
    if (d < dist) {
      dist = d;
      best = item;
    }
  }
  return best;
}

function hideGuides() {
  guideX.classList.remove("on");
  guideY.classList.remove("on");
  guideX.style.left = "50%";
  guideY.style.top = "50%";
}

function snapLayer(layer, event) {
  hideGuides();
  if (event.shiftKey) return;
  const me = layerBox(layer);
  if (!me) return;

  const lefts = [0];
  const rights = [100];
  const cxs = [50];
  const tops = [0];
  const bottoms = [100];
  const cys = [50];

  for (const other of layers()) {
    if (other.id === layer.id || !other.visible) continue;
    const box = layerBox(other);
    if (!box) continue;
    lefts.push(box.left);
    rights.push(box.right);
    cxs.push(box.cx);
    tops.push(box.top);
    bottoms.push(box.bottom);
    cys.push(box.cy);
  }

  const xHit =
    nearestEdge(me.left, lefts) ??
    nearestEdge(me.left, cxs) ??
    nearestEdge(me.right, rights) ??
    nearestEdge(me.cx, cxs);
  if (xHit != null) {
    if (Math.abs(me.left - xHit) <= SNAP) layer.x += xHit - me.left;
    else if (Math.abs(me.right - xHit) <= SNAP) layer.x += xHit - me.right;
    else layer.x += xHit - me.cx;
    guideX.style.left = `${xHit}%`;
    guideX.classList.add("on");
  }

  const yHit =
    nearestEdge(me.top, tops) ??
    nearestEdge(me.top, cys) ??
    nearestEdge(me.bottom, bottoms) ??
    nearestEdge(me.cy, cys);
  if (yHit != null) {
    if (Math.abs(me.top - yHit) <= SNAP) layer.y += yHit - me.top;
    else if (Math.abs(me.bottom - yHit) <= SNAP) layer.y += yHit - me.bottom;
    else layer.y += yHit - me.cy;
    guideY.style.top = `${yHit}%`;
    guideY.classList.add("on");
  }
}

function bakeCloneStyles(from, to) {
  if (!from || !to || from.nodeType !== 1 || to.nodeType !== 1) return;
  const cs = getComputedStyle(from);
  to.style.fontSize = cs.fontSize;
  to.style.fontFamily = cs.fontFamily;
  to.style.fontWeight = cs.fontWeight;
  to.style.fontStyle = cs.fontStyle;
  to.style.lineHeight = cs.lineHeight;
  to.style.letterSpacing = cs.letterSpacing;
  to.style.color = cs.color;
  const fill = cs.webkitTextFillColor;
  if (fill && fill !== "none") to.style.webkitTextFillColor = fill;
  else to.style.webkitTextFillColor = cs.color;
  to.style.opacity = cs.opacity;
  const clip = from.classList.contains("browser") ||
    from.classList.contains("page") ||
    from.classList.contains("omnibox") ||
    from.id === "stage" ||
    from.id === "page";
  if (clip) to.style.overflow = "visible";
  const a = [...from.children];
  const b = [...to.children];
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) bakeCloneStyles(a[i], b[i]);
}

function pctPoint(el, event) {
  const r = el.getBoundingClientRect();
  return {
    x: ((event.clientX - r.left) / r.width) * 100,
    y: ((event.clientY - r.top) / r.height) * 100,
  };
}

const mockSelect = document.getElementById("mock-select");
const pageEl = document.getElementById("page");
const articleEl = document.getElementById("page-article");
let dragSel = null;
let drag = null;

articleEl.addEventListener("mouseup", () => {
  if (state.id !== "select" || state.data.pageImage) return;
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed) return;
  if (!articleEl.contains(sel.anchorNode)) return;
  const text = sel.toString().replace(/\s+/g, " ").trim();
  if (!text) return;
  state.data.selected = text;
  document.getElementById("selected-text").value = text;
  paint();
});

mockSelect.addEventListener("contextmenu", (e) => {
  if (state.id !== "select") return;
  e.preventDefault();
  const p = stagePoint(e);
  const menu = getLayer("menu");
  if (menu) {
    menu.x = Math.min(82, Math.max(2, p.x));
    menu.y = Math.min(78, Math.max(4, p.y));
    menu.visible = true;
  }
  const sel = window.getSelection();
  const text =
    sel && !sel.isCollapsed && articleEl.contains(sel.anchorNode)
      ? sel.toString().replace(/\s+/g, " ").trim()
      : "";
  if (text) {
    state.data.selected = text;
    document.getElementById("selected-text").value = text;
  }
  paint();
});

pageEl.addEventListener("mousedown", (e) => {
  if (state.id !== "select" || !state.data.pageImage || e.button !== 0) return;
  e.stopPropagation();
  e.preventDefault();
  const p = pctPoint(pageEl, e);
  dragSel = { x: p.x, y: p.y };
  state.data.selX = p.x;
  state.data.selY = p.y;
  state.data.selW = 2;
  state.data.selH = 4;
  selectLayer("mock");
});

stage.addEventListener("mousedown", (e) => {
  if (e.button !== 0) return;
  if (e.target.closest(".page-article, textarea, input")) return;
  const handle = e.target.closest(".handle");
  const layerEl = e.target.closest(".layer");
  if (handle && layerEl) {
    const layer = getLayer(layerEl.dataset.layer);
    drag = { type: "scale", id: layer.id, startX: e.clientX, startScale: layer.scale };
    e.preventDefault();
    return;
  }
  if (layerEl) {
    const layer = getLayer(layerEl.dataset.layer);
    if (!layer || !layer.visible) return;
    const p = stagePoint(e);
    drag = { type: "move", id: layer.id, dx: p.x - layer.x, dy: p.y - layer.y };
    selectLayer(layer.id);
    e.preventDefault();
    return;
  }
  selectLayer(null);
});

window.addEventListener("mousemove", (e) => {
  if (dragSel) {
    const p = pctPoint(pageEl, e);
    state.data.selX = Math.min(dragSel.x, p.x);
    state.data.selY = Math.min(dragSel.y, p.y);
    state.data.selW = Math.max(4, Math.abs(p.x - dragSel.x));
    state.data.selH = Math.max(4, Math.abs(p.y - dragSel.y));
    const box = document.getElementById("sel-box");
    box.style.left = `${state.data.selX}%`;
    box.style.top = `${state.data.selY}%`;
    box.style.width = `${state.data.selW}%`;
    box.style.height = `${state.data.selH}%`;
    return;
  }
  if (!drag) return;
  const layer = getLayer(drag.id);
  if (!layer) return;
  if (drag.type === "move") {
    const p = stagePoint(e);
    layer.x = Math.min(92, Math.max(-8, p.x - drag.dx));
    layer.y = Math.min(92, Math.max(-8, p.y - drag.dy));
    if (e.ctrlKey) {
      layer.x = Math.round(layer.x / 2) * 2;
      layer.y = Math.round(layer.y / 2) * 2;
    }
    snapLayer(layer, e);
    applyLayers();
  } else {
    const next = drag.startScale + (e.clientX - drag.startX) / 260;
    layer.scale = Math.min(2.2, Math.max(0.4, next));
    document.getElementById("layer-scale").value = String(Math.round(layer.scale * 100));
    document.getElementById("layer-scale-val").textContent = `${Math.round(layer.scale * 100)}%`;
    applyLayers();
  }
});

window.addEventListener("mouseup", () => {
  dragSel = null;
  drag = null;
  hideGuides();
  persist();
});

window.addEventListener("keydown", (e) => {
  if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;
  const layer = getLayer(state.selected);
  if (!layer) return;
  const step = e.shiftKey ? 2 : 0.5;
  let used = true;
  if (e.key === "ArrowLeft") layer.x -= step;
  else if (e.key === "ArrowRight") layer.x += step;
  else if (e.key === "ArrowUp") layer.y -= step;
  else if (e.key === "ArrowDown") layer.y += step;
  else if (e.key === "Delete" || e.key === "Backspace") layer.visible = false;
  else if (e.key === "]" ) layer.z = Math.min(40, layer.z + 1);
  else if (e.key === "[") layer.z = Math.max(1, layer.z - 1);
  else used = false;
  if (!used) return;
  e.preventDefault();
  applyLayers();
  renderLayerList();
  syncInspector();
});

document.getElementById("download").addEventListener("click", async () => {
  const btn = document.getElementById("download");
  btn.disabled = true;
  btn.textContent = "Hazırlanıyor…";
  const prevTransform = stage.style.transform;
  const prevFrameW = frame.style.width;
  const prevFrameH = frame.style.height;
  const prevWrapOverflow = wrap.style.overflow;
  const prevSelected = state.selected;
  state.selected = null;
  applyLayers();
  stage.classList.add("exporting");
  wrap.style.overflow = "visible";
  frame.style.width = `${state.width}px`;
  frame.style.height = `${state.height}px`;
  stage.style.transform = "none";
  stage.style.transformOrigin = "top left";
  syncHighlightBoxes();
  try {
    await document.fonts?.ready;
    const canvas = await html2canvas(stage, {
      scale: 1,
      backgroundColor: null,
      useCORS: true,
      allowTaint: true,
      letterRendering: false,
      logging: false,
      width: state.width,
      height: state.height,
      windowWidth: state.width,
      windowHeight: state.height,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      onclone(doc, clone) {
        const node = clone || doc.getElementById("stage");
        if (!node) return;
        node.style.transform = "none";
        node.style.width = `${state.width}px`;
        node.style.height = `${state.height}px`;
        node.style.setProperty("--u", getComputedStyle(stage).getPropertyValue("--u").trim() || "1");
        bakeCloneStyles(stage, node);
      },
    });
    const a = document.createElement("a");
    a.download = `askit-${state.id}-${state.width}x${state.height}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  } catch (err) {
    alert("PNG alınamadı. Sayfayı Chrome’da açıp tekrar dene.\n" + (err?.message || err));
  } finally {
    stage.classList.remove("exporting");
    stage.style.transform = prevTransform;
    frame.style.width = prevFrameW;
    frame.style.height = prevFrameH;
    wrap.style.overflow = prevWrapOverflow;
    state.selected = prevSelected;
    applyLayers();
    fit();
    btn.disabled = false;
    btn.textContent = "PNG indir";
  }
});

window.addEventListener("resize", () => {
  fit();
  syncHighlightBoxes();
});
window.addEventListener("beforeunload", persist);
restore();
fillForm();
paint();
