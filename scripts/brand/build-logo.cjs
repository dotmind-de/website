// Regenerates public/brand/*.svg. Needs: npm i -D geist opentype.js@1, then: node scripts/brand/build-logo.cjs public/brand
// Geist is licensed under the SIL Open Font License; outlining it into a logotype is permitted.
// Builds the dotMind logotype as outlined SVG paths (Geist, SIL OFL) with an ember tittle.
const ot = require("opentype.js");
const fs = require("fs");
const path = require("path");

const SANS = ot.loadSync("node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf");
const MONO = ot.loadSync("node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.ttf");
const OUT = process.argv[2] || "out";
fs.mkdirSync(OUT, { recursive: true });

const C = {
  dark: { bg: "#0A0A0B", fg: "#EDEBE6", dot: "#F2A05B", muted: "#9A9893" },
  light: { bg: "#F6F4EF", fg: "#0A0A0B", dot: "#C8641E", muted: "#5E5C57" },
};

const r = (n) => Math.round(n * 100) / 100;

// Lay out a string glyph by glyph: kerning + tracking (in em).
function layout(font, text, size, tracking, x0 = 0, baseline = 0) {
  const scale = size / font.unitsPerEm;
  const glyphs = font.stringToGlyphs(text);
  let x = x0;
  const parts = [];
  glyphs.forEach((g, i) => {
    parts.push({ g, x });
    let adv = g.advanceWidth * scale;
    if (i < glyphs.length - 1) adv += font.getKerningValue(g, glyphs[i + 1]) * scale;
    x += adv + tracking * size;
  });
  const d = parts.map(({ g, x }) => g.getPath(x, baseline, size).toPathData(2)).join("");
  const last = parts[parts.length - 1];
  const right = last.x + last.g.getBoundingBox().x2 * scale;
  return { d, parts, width: right - x0, right, scale };
}

// Wordmark: "dotMınd" with dotless i, tittle replaced by an ember circle.
function wordmark(size = 100, x0 = 0, baseline = 0) {
  const tracking = -0.035;
  const L = layout(SANS, "dotMınd", size, tracking, x0, baseline);
  const iPart = L.parts[4];
  const bb = iPart.g.getBoundingBox();
  const s = L.scale;
  const stemCx = iPart.x + ((bb.x1 + bb.x2) / 2) * s;
  const stemW = (bb.x2 - bb.x1) * s;
  const rad = stemW * 0.62;                  // dot is a little wider than the stem
  const stemTop = baseline - bb.y2 * s;      // y grows downwards
  const cy = stemTop - stemW * 0.55 - rad;   // gap above the stem
  const ink = SANS.getPath("dotMınd", 0, 0, size); // for bbox only
  return {
    d: L.d,
    dot: { cx: r(stemCx), cy: r(cy), r: r(rad) },
    width: L.width,
    right: L.right,
    capTop: baseline - SANS.tables.os2.sCapHeight * s,
    dotTop: cy - rad,
    left: x0 + SANS.charToGlyph("d").getBoundingBox().x1 * s,
  };
}

function endorsement(size, x0, baseline, letterSpacing = 0.12) {
  const L = layout(MONO, "BY REZA ALAMI", size, letterSpacing, x0, baseline);
  return L;
}

function svg(w, h, body, title, pad = 3) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r(w + pad)} ${r(h)}" width="${r(w + pad)}" height="${r(h)}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>\n`;
}

const files = {};
for (const [mode, col] of Object.entries(C)) {
  // 1. Wordmark only
  {
    const size = 100;
    const pad = 3;
    const tmp = wordmark(size, 0, 0);
    const top = Math.min(tmp.dotTop, tmp.capTop);
    const base = -top + pad;
    const W = wordmark(size, -tmp.left + pad, base);
    const h = base + 0.012 * size + 12 * size / 1000; // d descends 12 units below baseline
    const body = `<path fill="${col.fg}" d="${W.d}"/><circle fill="${col.dot}" cx="${W.dot.cx}" cy="${W.dot.cy}" r="${W.dot.r}"/>`;
    files[`dotmind-wordmark-${mode}.svg`] = svg(W.right, h + pad, body, "dotMind");
  }
  // 2. Horizontal lockup: wordmark + endorsement on the baseline
  {
    const size = 100;
    const tmp = wordmark(size, 0, 0);
    const base = -Math.min(tmp.dotTop, tmp.capTop) + 3;
    const W = wordmark(size, -tmp.left, base);
    const eSize = size * 0.26;
    const gap = size * 0.32;
    const E = endorsement(eSize, W.right + gap, base);
    const total = E.right;
    const body = `<path fill="${col.fg}" d="${W.d}"/><circle fill="${col.dot}" cx="${W.dot.cx}" cy="${W.dot.cy}" r="${W.dot.r}"/><path fill="${col.muted}" d="${E.d}"/>`;
    files[`dotmind-lockup-horizontal-${mode}.svg`] = svg(total, base + 2, body, "dotMind by Reza Alami");
  }
  // 3. Stacked lockup: endorsement under the wordmark, left-aligned to the d
  {
    const size = 100;
    const tmp = wordmark(size, 0, 0);
    const base = -Math.min(tmp.dotTop, tmp.capTop) + 3;
    const W = wordmark(size, -tmp.left, base);
    const eSize = size * 0.19;
    const eBase = base + size * 0.36;
    const E = endorsement(eSize, 2, eBase);
    const total = Math.max(W.right, E.right);
    const body = `<path fill="${col.fg}" d="${W.d}"/><circle fill="${col.dot}" cx="${W.dot.cx}" cy="${W.dot.cy}" r="${W.dot.r}"/><path fill="${col.muted}" d="${E.d}"/>`;
    files[`dotmind-lockup-stacked-${mode}.svg`] = svg(total, eBase + 2, body, "dotMind by Reza Alami");
  }
}

// 4. Mark: "d" + ember dot (reads as "d." = dot), on an ink tile. Used for favicon / app icon / avatar.
{
  const S = 512;
  const size = 360;
  const g = SANS.charToGlyph("d");
  const bb = g.getBoundingBox();
  const s = size / SANS.unitsPerEm;
  const dot = size * 0.135;
  const glyphW = (bb.x2 - bb.x1) * s;
  const gap = size * 0.06;
  const groupW = glyphW + gap + dot * 2;
  const x = (S - groupW) / 2 - bb.x1 * s;
  const baseline = S / 2 + (bb.y2 * s) / 2;
  const d = g.getPath(x, baseline, size).toPathData(2);
  const cx = x + bb.x2 * s + gap + dot;
  const cy = baseline - dot;
  for (const [mode, col] of Object.entries(C)) {
    const tile = mode === "dark" ? C.dark : C.light;
    files[`dotmind-mark-${mode}.svg`] = svg(S, S,
      `<rect width="${S}" height="${S}" rx="${S * 0.22}" fill="${tile.bg}"/><path fill="${tile.fg}" d="${d}"/><circle fill="${tile.dot}" cx="${r(cx)}" cy="${r(cy)}" r="${r(dot)}"/>`,
      "dotMind", 0);
  }
  // Favicon: same mark, dark tile, no rounding beyond what the browser applies
  files["icon.svg"] = files["dotmind-mark-dark.svg"];
}

// Single-colour versions (print, embossing, fax, one-colour merch): dot takes the text colour.
for (const mode of ["dark", "light"]) {
  files[`dotmind-wordmark-mono-${mode}.svg`] = files[`dotmind-wordmark-${mode}.svg`].replace(`fill="${C[mode].dot}"`, `fill="${C[mode].fg}"`);
}

for (const [name, content] of Object.entries(files)) fs.writeFileSync(path.join(OUT, name), content);
console.log(Object.keys(files).join("\n"));
