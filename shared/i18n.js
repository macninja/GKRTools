import { PAGES } from "./strings.js";

const STORAGE_KEY = "gkr-lang";
const DEFAULT_LANG = "da";

let page = "hub";
let lang = DEFAULT_LANG;
const listeners = new Set();

export function getLang() {
  return lang;
}

export function t(key, vars = {}) {
  const table = PAGES[page] || {};
  let text = table[lang]?.[key] ?? table[DEFAULT_LANG]?.[key] ?? key;
  for (const [name, value] of Object.entries(vars)) {
    text = text.replaceAll(`{${name}}`, value);
  }
  return text;
}

function apply() {
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.dataset.i18nAria));
  });

  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    el.setAttribute("title", t(el.dataset.i18nTitle));
  });

  const titleEl = document.querySelector("title[data-i18n]");
  if (titleEl) document.title = t(titleEl.dataset.i18n);

  const metaDesc = document.querySelector('meta[name="description"][data-i18n]');
  if (metaDesc) metaDesc.setAttribute("content", t(metaDesc.dataset.i18n));

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  listeners.forEach((fn) => fn(lang));
}

function setLang(next) {
  if (next !== "da" && next !== "en") return;
  lang = next;
  localStorage.setItem(STORAGE_KEY, lang);
  apply();
}

function mountLangSwitcher() {
  if (document.getElementById("lang-switcher")) return;

  const nav = document.createElement("nav");
  nav.id = "lang-switcher";
  nav.className = "lang-switcher";
  nav.setAttribute("aria-label", "Language");
  nav.innerHTML = `
    <button type="button" class="lang-btn" data-lang="da" aria-label="Dansk">🇩🇰</button>
    <button type="button" class="lang-btn" data-lang="en" aria-label="English">🇬🇧</button>
  `;

  nav.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-lang]");
    if (btn) setLang(btn.dataset.lang);
  });

  document.body.appendChild(nav);
}

export function onLangChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function initI18n(pageId) {
  page = pageId;
  lang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  mountLangSwitcher();
  apply();
}
