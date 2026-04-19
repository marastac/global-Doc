import { createContext } from "react";

export type Locale = "es" | "en" | "fr" | "pt" | "de" | "it" | "ar" | "ru";

export const LS_LOCALE_KEY = "docsim.locale.v1";
export const LS_LOCALE_PROMPT_KEY = "docsim.locale_prompt.dismissed.v1";

// ✅ Evento global para sincronizar Header <-> App y cualquier componente
export const LOCALE_EVENT = "docsim:locale";

export const detectLocale = (): Locale => {
  const lang = (navigator.language || "").toLowerCase();
  if (lang.startsWith("fr")) return "fr";
  if (lang.startsWith("en")) return "en";
  if (lang.startsWith("pt")) return "pt";
  if (lang.startsWith("de")) return "de";
  if (lang.startsWith("it")) return "it";
  if (lang.startsWith("ar")) return "ar";
  if (lang.startsWith("ru")) return "ru";
  return "es";
};

export const readSavedLocale = (): Locale | null => {
  try {
    const raw = localStorage.getItem(LS_LOCALE_KEY);
    if (
      raw === "es" ||
      raw === "en" ||
      raw === "fr" ||
      raw === "pt" ||
      raw === "de" ||
      raw === "it" ||
      raw === "ar" ||
      raw === "ru"
    )
      return raw;
    return null;
  } catch {
    return null;
  }
};

export const saveLocale = (loc: Locale) => {
  try {
    localStorage.setItem(LS_LOCALE_KEY, loc);
  } catch {
    // ignore
  }
};

export const markLocalePromptDismissed = () => {
  try {
    localStorage.setItem(LS_LOCALE_PROMPT_KEY, "1");
  } catch {
    // ignore
  }
};

export const wasLocalePromptDismissed = () => {
  try {
    return localStorage.getItem(LS_LOCALE_PROMPT_KEY) === "1";
  } catch {
    return false;
  }
};

export const localeLabel = (loc: Locale) => {
  switch (loc) {
    case "es":
      return "Español";
    case "en":
      return "English";
    case "fr":
      return "Français";
    case "pt":
      return "Português";
    case "de":
      return "Deutsch";
    case "it":
      return "Italiano";
    case "ar":
      return "العربية";
    case "ru":
      return "Русский";
    default:
      return loc;
  }
};

type Dict = Record<string, string>;
export type DictByLocale = Record<Locale, Dict>;

/**
 * Diccionario base.
 * - Si una key no existe en el idioma, cae a ES.
 * - Si no existe ni en ES, devuelve la key (no rompe UI).
 */
export const DICT: DictByLocale = {
  es: {
    "nav.services": "Servicios",
    "nav.flow": "Flujo",
    "nav.cases": "Casos",
    "nav.indicators": "Indicadores",
    "brand.tagline": 'Gestión Documentaria "Premium"',
    "lang.label": "Idioma",
    "prompt.title": "Idioma detectado",
    "prompt.body": "Detectamos tu navegador en otro idioma. ¿Quieres ver el sitio en",
    "prompt.yes": "Sí, cambiar",
    "prompt.no": "Ahora no",
  },
  en: {
    "nav.services": "Services",
    "nav.flow": "Process",
    "nav.cases": "Cases",
    "nav.indicators": "Indicators",
    "brand.tagline": "Premium Document Processing",
    "lang.label": "Language",
    "prompt.title": "Language detected",
    "prompt.body":
      "We detected another language in your browser. Would you like to view the site in",
    "prompt.yes": "Yes, switch",
    "prompt.no": "Not now",
  },
  fr: {
    "nav.services": "Services",
    "nav.flow": "Processus",
    "nav.cases": "Cas",
    "nav.indicators": "Indicateurs",
    "brand.tagline": "Gestion documentaire « Premium »",
    "lang.label": "Langue",
    "prompt.title": "Langue détectée",
    "prompt.body":
      "Votre navigateur est dans une autre langue. Voulez-vous afficher le site en",
    "prompt.yes": "Oui, changer",
    "prompt.no": "Pas maintenant",
  },
  pt: {
    "nav.services": "Serviços",
    "nav.flow": "Fluxo",
    "nav.cases": "Casos",
    "nav.indicators": "Indicadores",
    "brand.tagline": "Gestão documental “Premium”",
    "lang.label": "Idioma",
    "prompt.title": "Idioma detectado",
    "prompt.body":
      "Detectamos outro idioma no seu navegador. Deseja ver o site em",
    "prompt.yes": "Sim, mudar",
    "prompt.no": "Agora não",
  },
  de: {
    "nav.services": "Leistungen",
    "nav.flow": "Ablauf",
    "nav.cases": "Fälle",
    "nav.indicators": "Indikatoren",
    "brand.tagline": "Premium-Dokumentenservice",
    "lang.label": "Sprache",
    "prompt.title": "Sprache erkannt",
    "prompt.body":
      "Wir haben eine andere Sprache in Ihrem Browser erkannt. Möchten Sie die Seite auf",
    "prompt.yes": "Ja, wechseln",
    "prompt.no": "Nicht jetzt",
  },
  it: {
    "nav.services": "Servizi",
    "nav.flow": "Processo",
    "nav.cases": "Casi",
    "nav.indicators": "Indicatori",
    "brand.tagline": "Gestione documentale “Premium”",
    "lang.label": "Lingua",
    "prompt.title": "Lingua rilevata",
    "prompt.body":
      "Abbiamo rilevato un'altra lingua nel tuo browser. Vuoi visualizzare il sito in",
    "prompt.yes": "Sì, cambia",
    "prompt.no": "Non ora",
  },
  ar: {
    "nav.services": "الخدمات",
    "nav.flow": "العملية",
    "nav.cases": "الحالات",
    "nav.indicators": "المؤشرات",
    "brand.tagline": "إدارة وثائق «مميزة»",
    "lang.label": "اللغة",
    "prompt.title": "تم اكتشاف اللغة",
    "prompt.body":
      "اكتشفنا لغة مختلفة في متصفحك. هل تريد عرض الموقع باللغة",
    "prompt.yes": "نعم، تغيير",
    "prompt.no": "ليس الآن",
  },
  ru: {
    "nav.services": "Услуги",
    "nav.flow": "Процесс",
    "nav.cases": "Кейсы",
    "nav.indicators": "Индикаторы",
    "brand.tagline": "Премиальная обработка документов",
    "lang.label": "Язык",
    "prompt.title": "Язык обнаружен",
    "prompt.body":
      "Мы обнаружили другой язык в вашем браузере. Хотите открыть сайт на",
    "prompt.yes": "Да, переключить",
    "prompt.no": "Не сейчас",
  },
};

export type I18nContextValue = {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  t: (key: string) => string;
  isRTL: boolean;
};

export const I18nContext = createContext<I18nContextValue>({
  locale: "es",
  setLocale: () => undefined,
  t: (k) => k,
  isRTL: false,
});