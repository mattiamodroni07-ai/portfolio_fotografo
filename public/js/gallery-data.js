/* =========================================================
   Salvatore Lacalaprice · Full Frame — DATI DELLA GALLERY
   ---------------------------------------------------------
   Qui decidi COSA appare nel portfolio, senza toccare il resto
   del sito. La struttura è a due livelli:

        CATEGORIA  →  EVENTI  →  FOTO

   COME AGGIUNGERE UN EVENTO
   1. Metti le foto vere in  public/images/portfolio/<categoria>/<evento>/
   2. Copia un blocco  { nome, info, foto:[...] }  dentro "eventi"
      e cambia nome, info e l'elenco dei percorsi delle foto.
   Nei percorsi NON si scrive "public/": si parte da "images/...".

   ⚠️ Le immagini qui sotto sono SEGNAPOSTO (gli SVG grigi):
      sostituiscile con le foto reali. Puoi usare .jpg / .webp.
   ========================================================= */
window.GALLERY = [
  {
    nome: "Matrimoni",
    cover: "images/gallery/01.svg",
    eventi: [
      {
        nome: "Giulia & Marco",
        info: "Villa Reale — Giugno 2024",
        foto: [
          "images/gallery/01.svg",
          "images/gallery/02.svg",
          "images/gallery/03.svg",
          "images/gallery/04.svg"
        ]
      },
      {
        nome: "Sara & Luca",
        info: "Lago di Como — Settembre 2023",
        foto: [
          "images/gallery/05.svg",
          "images/gallery/06.svg",
          "images/gallery/07.svg"
        ]
      }
    ]
  },
  {
    nome: "Prime Comunioni",
    cover: "images/gallery/08.svg",
    eventi: [
      {
        nome: "Comunione di Sofia",
        info: "Parrocchia San Giovanni — Maggio 2024",
        foto: ["images/gallery/08.svg", "images/gallery/09.svg"]
      }
    ]
  },
  {
    nome: "Anniversari",
    cover: "images/gallery/10.svg",
    eventi: [
      {
        nome: "50° di Anna & Piero",
        info: "Ristorante Il Glicine — Aprile 2024",
        foto: ["images/gallery/10.svg", "images/gallery/11.svg"]
      }
    ]
  },
  {
    nome: "Compleanni",
    cover: "images/gallery/12.svg",
    eventi: [
      {
        nome: "18° di Martina",
        info: "Villa dei Cedri — Luglio 2024",
        foto: ["images/gallery/12.svg", "images/gallery/01.svg"]
      }
    ]
  },
  {
    nome: "Eventi Aziendali",
    cover: "images/gallery/03.svg",
    eventi: [
      {
        nome: "Gala aziendale",
        info: "Palazzo dei Congressi — Novembre 2023",
        foto: ["images/gallery/03.svg", "images/gallery/04.svg", "images/gallery/05.svg"]
      }
    ]
  }
];
