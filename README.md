# Salvatore Lacalaprice — Portfolio

Sito portfolio per **Salvatore Lacalaprice**, fotografo di matrimoni ed eventi.
Tema **dark cinematografico** con animazioni scroll-driven (parallax, gallery
orizzontale, reveal, cursore personalizzato).

Sito **statico** (HTML + CSS + JavaScript), zero build: si apre e si pubblica
così com'è. Pensato per **Cloudflare Pages**.

---

## 🚀 Come pubblicarlo su Cloudflare Pages

1. Vai su **Cloudflare Dashboard → Workers & Pages → Create → Pages**.
2. **Connect to Git** e seleziona questo repository.
3. Impostazioni di build:
   - **Framework preset:** `None`
   - **Build command:** *(lascia vuoto)*
   - **Build output directory:** `/`  (la root del progetto)
4. **Save and Deploy**. Fine: Cloudflare pubblica i file statici.

> In alternativa puoi trascinare la cartella del progetto in **Pages → Upload assets**
> per un deploy manuale senza Git.

Per un dominio personalizzato: **Pages → Custom domains → Set up a domain**.

---

## 🖼️ Come sostituire le foto (placeholder → foto vere)

Le immagini attuali sono **segnaposto SVG** eleganti, generati automaticamente.
Per mettere le foto vere di Salvatore basta **sostituire i file** in `images/`
mantenendo gli **stessi nomi**, oppure aggiornare i percorsi in `index.html`.

| File | Dove appare | Consigli |
|------|-------------|----------|
| `images/hero.svg` | Sfondo grande in alto | Foto orizzontale d'impatto (min. 1920px) |
| `images/about.svg` | Sezione "Chi sono" | Ritratto verticale del fotografo |
| `images/cta.svg` | Sezione "Contatti" | Foto orizzontale evocativa |
| `images/gallery/01.svg … 12.svg` | Gallery portfolio | I tuoi scatti migliori |

**Puoi usare file `.jpg`/`.webp`** al posto degli `.svg`: rinominali (es.
`hero.jpg`) e aggiorna il `src` corrispondente in `index.html`. Consiglio:
esporta in **WebP** o **JPEG** con lato lungo ~2000px e peso < 400KB per foto.

Per cambiare le **didascalie** della gallery (es. "Il sì", "Il primo ballo"),
modifica i `<figcaption>` dentro `index.html`.

### Logo
`assets/logo.svg` è un logo segnaposto (monogramma "SL"). Sostituiscilo con il
logo/foto profilo di Salvatore mantenendo il nome `logo.svg`, oppure aggiorna il
riferimento in `index.html`. Lo stesso vale per `assets/favicon.svg`.

I placeholder si possono rigenerare con:

```bash
node scripts/generate-placeholders.mjs
```

---

## ✍️ Come cambiare i testi e i contatti

Tutti i testi sono in `index.html`, in italiano. Cerca e sostituisci in
particolare:

- **Email:** `info@salvatorelacalaprice.it` (compare in più punti + nel form)
- **Telefono:** `+39 000 000 0000`
- **Social:** i link `Instagram` / `Facebook` hanno `href="#"` — inserisci gli URL reali
- Testi di *Chi sono*, *Servizi*, *Statistiche* (numeri in `data-count`) e *Contatti*

### Il form contatti
Il form usa un `mailto:` (apre il programma di posta) — funziona senza backend.
Se in futuro vuoi ricevere i messaggi via web, puoi collegarlo a un servizio
come **Formspree**, **Web3Forms** o una **Cloudflare Pages Function**.

---

## 🗂️ Struttura del progetto

```
.
├── index.html                 # Pagina unica
├── css/style.css              # Stili (tema dark cinematografico)
├── js/main.js                 # Animazioni & interazioni (progressive enhancement)
├── images/                    # Foto (placeholder SVG da sostituire)
│   ├── hero.svg  about.svg  cta.svg
│   └── gallery/01.svg … 12.svg
├── assets/                    # logo.svg, favicon.svg
├── scripts/generate-placeholders.mjs
├── _headers                   # Header/cache per Cloudflare Pages
└── robots.txt
```

## 🛠️ Anteprima in locale

Apri `index.html` nel browser, oppure avvia un piccolo server:

```bash
python3 -m http.server 8000
# poi visita http://localhost:8000
```

## 🧩 Note tecniche

- Animazioni con **GSAP + ScrollTrigger**, smooth scroll con **Lenis**, testo
  con **SplitType** (caricati da CDN). Se una libreria non si carica, il sito
  resta comunque leggibile e navigabile.
- Rispetta `prefers-reduced-motion`: chi ha ridotto le animazioni vede una
  versione statica.
- Responsive (desktop / tablet / mobile). Su mobile la gallery si scorre con lo swipe.
