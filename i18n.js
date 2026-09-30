/* ============ Traductions de l'interface ============
   Pour ajouter une langue : copier le bloc « en », le traduire, puis ajouter
   l'entrée correspondante dans LANG_NAMES. Toute clé absente retombe sur l'anglais.
   Les dates relatives et les nombres sont formatés par Intl, sans traduction. */
const LANG_NAMES = { fr: "Français", en: "English" };

const I18N = {
  fr: {
    title: "HN — Hacker News, en mieux",
    subtitle: "lecture moderne & élégante",
    searchPh: "Rechercher des articles…",
    searchLabel: "Rechercher",
    langLabel: "Langue",
    tabsLabel: "Sections",
    "tab.top": "À la une",
    "tab.new": "Nouveautés",
    "tab.best": "Meilleurs",
    "tab.ask": "Ask HN",
    "tab.show": "Show HN",
    "tab.jobs": "Emplois",
    rangeLabel: "Période",
    "range.all": "Toujours",
    "range.24h": "24 heures",
    "range.week": "Cette semaine",
    "range.month": "Ce mois-ci",
    sortLabel: "Tri",
    "sort.points": "Popularité",
    "sort.date": "Plus récent",
    loading: "Chargement…",
    loadMore: "Charger plus",
    footer: `Données : <a href="https://news.ycombinator.com" target="_blank" rel="noopener">news.ycombinator.com</a> via l'API publique HN Search (Algolia). Les liens « commentaires » ouvrent la discussion d'origine.`,
    untitled: "(sans titre)",
    points: n => `${n} ${n > 1 ? "pts" : "pt"}`,
    comments: n => `${n} ${n > 1 ? "commentaires" : "commentaire"}`,
    noResults: "Aucun résultat",
    noResultsHint: "Essayez d'autres mots-clés ou élargissez la période.",
    results: (n, f) => `${f} ${n > 1 ? "résultats" : "résultat"} · en direct`,
    offline: d => `hors ligne · instantané du ${d}`,
    offlineJobs: "Mode hors ligne",
    offlineJobsHint: "Les offres d'emploi nécessitent la connexion à l'API. Ouvrez ce fichier dans votre navigateur pour les données en direct.",
    back: "Retour à la liste",
    threadShort: "Discussion…",
    threadLoading: "Chargement de la discussion…",
    threadUnavailable: "Discussion indisponible",
    threadUnavailableHint: "Impossible de charger les commentaires (hors ligne ?).",
    openOnHN: "Ouvrir sur Hacker News →",
    viewOnHN: "voir sur HN ↗",
    deletedAuthor: "[supprimé]",
    deletedComment: "[commentaire supprimé]",
    toggle: "Replier / déplier",
    noComments: "Aucun commentaire",
    noCommentsHint: "Soyez le premier à réagir sur HN."
  },
  en: {
    title: "HN — Hacker News, beautified",
    subtitle: "modern & elegant reading",
    searchPh: "Search stories…",
    searchLabel: "Search",
    langLabel: "Language",
    tabsLabel: "Sections",
    "tab.top": "Top",
    "tab.new": "New",
    "tab.best": "Best",
    "tab.ask": "Ask HN",
    "tab.show": "Show HN",
    "tab.jobs": "Jobs",
    rangeLabel: "Period",
    "range.all": "All time",
    "range.24h": "24 hours",
    "range.week": "This week",
    "range.month": "This month",
    sortLabel: "Sort",
    "sort.points": "Popularity",
    "sort.date": "Most recent",
    loading: "Loading…",
    loadMore: "Load more",
    footer: `Data: <a href="https://news.ycombinator.com" target="_blank" rel="noopener">news.ycombinator.com</a> via the public HN Search API (Algolia). “Comments” links open the original discussion.`,
    untitled: "(untitled)",
    points: n => `${n} ${n === 1 ? "pt" : "pts"}`,
    comments: n => `${n} ${n === 1 ? "comment" : "comments"}`,
    noResults: "No results",
    noResultsHint: "Try other keywords or widen the period.",
    results: (n, f) => `${f} ${n === 1 ? "result" : "results"} · live`,
    offline: d => `offline · snapshot from ${d}`,
    offlineJobs: "Offline mode",
    offlineJobsHint: "Job listings require a connection to the API. Open this file in your browser for live data.",
    back: "Back to list",
    threadShort: "Discussion…",
    threadLoading: "Loading discussion…",
    threadUnavailable: "Discussion unavailable",
    threadUnavailableHint: "Could not load comments (offline?).",
    openOnHN: "Open on Hacker News →",
    viewOnHN: "view on HN ↗",
    deletedAuthor: "[deleted]",
    deletedComment: "[comment deleted]",
    toggle: "Collapse / expand",
    noComments: "No comments yet",
    noCommentsHint: "Be the first to chime in on HN."
  }
};

/* Priorité : ?lang= dans l'URL, puis choix mémorisé, puis langue du navigateur, sinon anglais */
function pickLang(){
  const ok = l => l && Object.prototype.hasOwnProperty.call(I18N, l);
  const fromUrl = new URLSearchParams(location.search).get("lang");
  if(ok(fromUrl)){ saveLang(fromUrl); return fromUrl; }
  let saved; try{ saved = localStorage.getItem("lang"); }catch{}
  if(ok(saved)) return saved;
  const fromNav = (navigator.languages || [navigator.language || ""])
    .map(l => l.slice(0,2).toLowerCase()).find(ok);
  return fromNav || "en";
}
function saveLang(l){ try{ localStorage.setItem("lang", l); }catch{} }

let lang = pickLang();

function t(key, ...args){
  const v = I18N[lang][key] ?? I18N.en[key] ?? key;
  return typeof v === "function" ? v(...args) : v;
}

/* Textes statiques : data-i18n (texte), data-i18n-html (HTML de confiance),
   data-i18n-attr="attribut:clé,attribut:clé" */
function applyStatic(){
  document.documentElement.lang = lang;
  document.title = t("title");
  document.querySelectorAll("[data-i18n]").forEach(el => el.textContent = t(el.dataset.i18n));
  document.querySelectorAll("[data-i18n-html]").forEach(el => el.innerHTML = t(el.dataset.i18nHtml));
  document.querySelectorAll("[data-i18n-attr]").forEach(el =>
    el.dataset.i18nAttr.split(",").forEach(pair => {
      const [attr, key] = pair.split(":");
      el.setAttribute(attr.trim(), t(key.trim()));
    })
  );
}
