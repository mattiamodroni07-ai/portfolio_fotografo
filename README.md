# Salvatore Lacalaprice · Full Frame — Portfolio

Sito portfolio per **Salvatore Lacalaprice**, fotografo di matrimoni ed eventi.
**Full Frame** è il nome dello studio: sul sito compare in modo secondario
(occhiello hero, sezione "Chi sono", contatti, footer/copyright e meta SEO),
mentre **Salvatore Lacalaprice** resta l'identità in primo piano.
Dominio previsto: **salvatorelacalaprice.com**.
Tema **dark cinematografico** con animazioni scroll-driven (parallax, gallery
orizzontale, reveal, cursore personalizzato).

Sito **statico** (HTML + CSS + JavaScript), zero build. I file pubblici sono
nella cartella **`public/`**; il deploy su Cloudflare è già configurato in
`wrangler.jsonc`.

---

## 🚀 Come pubblicarlo su Cloudflare

Il repo contiene `wrangler.jsonc`, che dice a Cloudflare di pubblicare come
sito statico il contenuto di `public/`.

### Metodo A — dalla dashboard (consigliato, deploy automatico ad ogni push)

1. **Cloudflare Dashboard → Workers & Pages → Create → Import a repository**.
2. Autorizza GitHub e seleziona **`mattiamodroni07-ai/portfolio_fotografo`**.
3. Nella schermata *Set up your application*:
   - **Build command:** *(lascia VUOTO)*
   - **Deploy command:** `npx wrangler deploy`
4. **Deploy**. Dopo ~1 minuto il sito è online su un indirizzo `*.workers.dev`.

Da lì in poi, ogni `git push` sul branch di produzione aggiorna il sito.

### Metodo B — dal tuo computer (una tantum)

```bash
npx wrangler deploy      # legge wrangler.jsonc e pubblica public/
```
(la prima volta ti chiede di fare login su Cloudflare)

Per un dominio personalizzato: nel progetto → **Settings → Domains & Routes →
Add**.

---

## 🖼️ Come sostituire le foto (placeholder → foto vere)

Le immagini attuali sono **segnaposto SVG** eleganti, generati automaticamente.
Per mettere le foto vere di Salvatore basta **sostituire i file** in
`public/images/` mantenendo gli **stessi nomi**, oppure aggiornare i percorsi in
`public/index.html`.

| File | Dove appare | Consigli |
|------|-------------|----------|
| `public/images/hero.svg` | Sfondo grande in alto | Foto orizzontale d'impatto (min. 1920px) |
| `public/images/about.svg` | Sezione "Chi sono" | Ritratto verticale del fotografo |
| `public/images/cta.svg` | Sezione "Contatti" | Foto orizzontale evocativa |
| `public/images/gallery/01.svg … 12.svg` | Foto di esempio della gallery | I tuoi scatti migliori |

**Puoi usare file `.jpg`/`.webp`** al posto degli `.svg`: rinominali (es.
`hero.jpg`) e aggiorna il `src` corrispondente in `public/index.html`. Consiglio:
esporta in **WebP** o **JPEG** con lato lungo ~2000px e peso < 400KB per foto.

## 🗂️ La gallery per categorie (Matrimoni, Comunioni, Anniversari, Compleanni, Aziendali)

Il portfolio è organizzato a **due livelli**:

```
CATEGORIA  →  EVENTI  →  FOTO
```

Tutto il contenuto della gallery si gestisce da **un solo file**:
**`public/js/gallery-data.js`** (non serve toccare l'HTML). Dentro trovi 5
categorie; per ognuna un elenco di **eventi**, e per ogni evento **nome, info e
l'elenco delle foto**.

**Per aggiungere un evento** (es. un nuovo matrimonio):
1. Crea una cartella con le foto, es. `public/images/portfolio/matrimoni/giulia-marco/`
2. In `gallery-data.js`, dentro la categoria giusta, copia un blocco e compilalo:
   ```js
   {
     nome: "Giulia & Marco",
     info: "Villa Reale — Giugno 2024",
     foto: [
       "images/portfolio/matrimoni/giulia-marco/01.jpg",
       "images/portfolio/matrimoni/giulia-marco/02.jpg"
     ]
   }
   ```
   ⚠️ Nei percorsi **non** si scrive `public/`: si parte da `images/…`.

La `cover:` di ogni categoria è l'immagine mostrata sulla card. Le foto di
esempio ora puntano ai segnaposto `images/gallery/…`: sostituiscile con quelle
vere.

### Logo
`public/assets/logo.svg` è un logo segnaposto (monogramma "SL"). Sostituiscilo
con il logo/foto profilo di Salvatore mantenendo il nome `logo.svg`, oppure
aggiorna il riferimento in `public/index.html`. Lo stesso vale per
`public/assets/favicon.svg`.

I placeholder si possono rigenerare con:

```bash
node scripts/generate-placeholders.mjs
```

---

## ✍️ Come cambiare i testi e i contatti

Tutti i testi sono in `public/index.html`, in italiano. Cerca e sostituisci in
particolare:

- **Email:** `info@salvatorelacalaprice.it` (compare in più punti + nel form)
- **Telefono:** `+39 000 000 0000`
- **Social:** i link `Instagram` / `Facebook` hanno `href="#"` — inserisci gli URL reali
- **P.IVA Full Frame:** nel footer c'è il segnaposto `P.IVA 00000000000` — sostituiscilo con la partita IVA reale
- **Nome studio:** "Full Frame" compare nell'occhiello hero, in *Chi sono*, nei *Contatti* e nel copyright (`Full Frame di Salvatore Lacalaprice`)
- Testi di *Chi sono*, *Servizi*, *Statistiche* (numeri in `data-count`) e *Contatti*

### Il form contatti
Il form usa un `mailto:` (apre il programma di posta) — funziona senza backend.
Se in futuro vuoi ricevere i messaggi via web, puoi collegarlo a un servizio
come **Formspree**, **Web3Forms** o una **Cloudflare Function**.

---

## 🗂️ Struttura del progetto

```
.
├── public/                    # ← i file pubblici del sito (serviti online)
│   ├── index.html             # Pagina unica
│   ├── css/style.css          # Stili (tema dark cinematografico)
│   ├── js/main.js             # Animazioni & interazioni (progressive enhancement)
│   ├── js/lib/                # GSAP, ScrollTrigger, Lenis, SplitType (in locale)
│   ├── images/                # Foto (placeholder SVG da sostituire)
│   │   ├── hero.svg  about.svg  cta.svg
│   │   └── gallery/01.svg … 12.svg
│   ├── assets/                # logo.svg, favicon.svg
│   ├── _headers               # Header/cache per Cloudflare
│   └── robots.txt
├── scripts/generate-placeholders.mjs
└── wrangler.jsonc             # Config di deploy Cloudflare (serve public/)
```

## 🛠️ Anteprima in locale

Apri `public/index.html` nel browser, oppure avvia un piccolo server dalla
cartella `public/`:

```bash
python3 -m http.server 8000 -d public
# poi visita http://localhost:8000
```

## 🧩 Note tecniche

- Animazioni con **GSAP + ScrollTrigger**, smooth scroll con **Lenis**, testo
  con **SplitType** — le librerie sono **incluse in locale** (`public/js/lib/`),
  quindi nessuna dipendenza da CDN. Se qualcosa non si carica, il sito resta
  comunque leggibile e navigabile.
- Rispetta `prefers-reduced-motion`: chi ha ridotto le animazioni vede una
  versione statica.
- Responsive (desktop / tablet / mobile). Su mobile la gallery si scorre con lo swipe.
