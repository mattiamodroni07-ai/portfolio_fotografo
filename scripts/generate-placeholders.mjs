/**
 * Generatore di placeholder SVG eleganti per il portfolio.
 *
 * Perche' SVG: sono leggerissimi, non si rompono mai (nessuna dipendenza di rete),
 * e si intonano al tema "dark cinematografico". Servono solo come segnaposto:
 * sostituisci i file in /images con le foto vere di Salvatore mantenendo gli
 * stessi nomi file (oppure aggiorna i percorsi in index.html).
 *
 * Uso:  node scripts/generate-placeholders.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const IMG = join(ROOT, "images");
mkdirSync(join(IMG, "gallery"), { recursive: true });

const GOLD = "#c9a271";

// Coppie di toni scuri (caldi/freddi) per dare varieta' senza uscire dal mood dark.
const PALETTES = [
  ["#241a12", "#0a0705"], // brown / champagne
  ["#12191c", "#060a0b"], // teal notte
  ["#1f141b", "#0a060a"], // prugna
  ["#231a10", "#0b0805"], // bronzo
  ["#111621", "#05070c"], // blu notte
  ["#1c1614", "#090706"], // neutro caldo
];

function svg({ w, h, index, label, sub, seed }) {
  const [c1, c2] = PALETTES[(index - 1) % PALETTES.length];
  const angle = 25 + ((index * 37) % 60);
  const cx = 20 + ((index * 53) % 60);
  const cy = 15 + ((index * 29) % 55);
  const mono = "SL";
  const fs = Math.round(Math.min(w, h) * 0.42);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label} - placeholder">
  <defs>
    <linearGradient id="g${index}" x1="0" y1="0" x2="1" y2="1" gradientTransform="rotate(${angle} .5 .5)">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
    <radialGradient id="glow${index}" cx="${cx}%" cy="${cy}%" r="75%">
      <stop offset="0" stop-color="${GOLD}" stop-opacity="0.16"/>
      <stop offset="55%" stop-color="${GOLD}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vig${index}" cx="50%" cy="45%" r="75%">
      <stop offset="55%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.6"/>
    </radialGradient>
    <filter id="grain${index}">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${seed}" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.06"/></feComponentTransfer>
    </filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g${index})"/>
  <rect width="${w}" height="${h}" fill="url(#glow${index})"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central"
        font-family="'Playfair Display', Georgia, serif" font-weight="700"
        font-size="${fs}" fill="#ffffff" fill-opacity="0.05">${mono}</text>
  <rect width="${w}" height="${h}" filter="url(#grain${index})" opacity="0.5"/>
  <rect width="${w}" height="${h}" fill="url(#vig${index})"/>
  <rect x="18" y="18" width="${w - 36}" height="${h - 36}" fill="none"
        stroke="${GOLD}" stroke-opacity="0.22" stroke-width="1"/>
  <!-- viewfinder brackets -->
  <g stroke="${GOLD}" stroke-opacity="0.35" stroke-width="2" fill="none">
    <path d="M40 64 V40 H64"/>
    <path d="M${w - 40} 64 V40 H${w - 64}"/>
    <path d="M40 ${h - 64} V${h - 40} H64"/>
    <path d="M${w - 40} ${h - 64} V${h - 40} H${w - 64}"/>
  </g>
  <text x="42" y="${h - 54}" font-family="'Inter', Arial, sans-serif" font-size="${Math.round(w * 0.02)}"
        letter-spacing="4" fill="${GOLD}" fill-opacity="0.85">${label}</text>
  <text x="42" y="${h - 30}" font-family="'Inter', Arial, sans-serif" font-size="${Math.round(w * 0.013)}"
        letter-spacing="3" fill="#ffffff" fill-opacity="0.4">${sub}</text>
</svg>`;
}

function write(rel, content) {
  const p = join(IMG, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content, "utf-8");
  console.log("  +", rel);
}

// Immagini principali
write("hero.svg", svg({ w: 1920, h: 1080, index: 1, label: "SALVATORE LACALAPRICE", sub: "SOSTITUISCI CON LA TUA FOTO HERO", seed: 7 }));
write("about.svg", svg({ w: 900, h: 1120, index: 4, label: "IL FOTOGRAFO", sub: "SOSTITUISCI CON UN TUO RITRATTO", seed: 13 }));
write("cta.svg", svg({ w: 1920, h: 1000, index: 2, label: "LAVORIAMO INSIEME", sub: "SOSTITUISCI CON UNA TUA FOTO", seed: 21 }));

// Gallery: aspect ratio variati per un effetto masonry naturale
const gallery = [
  [900, 1200], [1200, 800], [1000, 1000], [900, 1250],
  [1200, 800], [1000, 1200], [1200, 900], [900, 1150],
  [1200, 800], [1000, 1000], [900, 1200], [1200, 820],
];
gallery.forEach(([w, h], i) => {
  const n = String(i + 1).padStart(2, "0");
  write(`gallery/${n}.svg`, svg({ w, h, index: i + 1, label: `N° ${n}`, sub: "SOSTITUISCI CON LA TUA FOTO", seed: (i + 1) * 11 }));
});

console.log("\nFatto. Placeholder generati in /images.");
