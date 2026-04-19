import React, { useContext, useMemo } from "react";
import { I18nContext, type Locale } from "../i18n";

type FooterDict = {
  col1Title: string;
  col1Desc: string;

  col2Title: string;
  regions: [string, string, string, string, string];

  col3Title: string;
  links: {
    services: string;
    flow: string;
    team: string;
    evidence: string;
    indicators: string;
  };

  col4Title: string;
  contactEmail: string;
  contactPhone: string;
  hours: string;

  bottom: string; // sin año (lo concatenamos)
};

const FOOTER_COPY: Record<Locale, FooterDict> = {
  es: {
    col1Title: "Centro Global Documentario",
    col1Desc:
      "Coordinación documentaria con validación por etapas y seguimiento por código.",

    col2Title: "Regiones",
    regions: [
      "🇺🇸 Estados Unidos",
      "🇨🇦 Canadá",
      "🇪🇺 Unión Europea",
      "🇬🇧 Reino Unido",
      "🇦🇺 Australia",
    ],

    col3Title: "Enlaces",
    links: {
      services: "Servicios",
      flow: "Proceso",
      team: "Equipo",
      evidence: "Evidencias",
      indicators: "Indicadores",
    },

    col4Title: "Contacto",
    contactEmail: "support@centro-global.com",
    contactPhone: "+51 904284928",
    hours: "Horario: 24/7",

    bottom: "Centro Global Documentario · Unidad Internacional",
  },

  en: {
    col1Title: "Global Document Center",
    col1Desc:
      "Document coordination with stage-based validation and code tracking.",

    col2Title: "Regions",
    regions: [
      "🇺🇸 United States",
      "🇨🇦 Canada",
      "🇪🇺 European Union",
      "🇬🇧 United Kingdom",
      "🇦🇺 Australia",
    ],

    col3Title: "Links",
    links: {
      services: "Services",
      flow: "Process",
      team: "Team",
      evidence: "Evidence",
      indicators: "Indicators",
    },

    col4Title: "Contact",
    contactEmail: "support@centro-global.com",
    contactPhone: "+51 904284928",
    hours: "Hours: 24/7",

    bottom: "Global Document Center · International Unit",
  },

  fr: {
    col1Title: "Centre Global de Documents",
    col1Desc:
      "Coordination documentaire avec validation par étapes et suivi par code.",

    col2Title: "Régions",
    regions: [
      "🇺🇸 États-Unis",
      "🇨🇦 Canada",
      "🇪🇺 Union européenne",
      "🇬🇧 Royaume-Uni",
      "🇦🇺 Australie",
    ],

    col3Title: "Liens",
    links: {
      services: "Services",
      flow: "Processus",
      team: "Équipe",
      evidence: "Preuves",
      indicators: "Indicateurs",
    },

    col4Title: "Contact",
    contactEmail: "support@centro-global.com",
    contactPhone: "+51 904284928",
    hours: "Horaires : 24/7",

    bottom: "Centre Global de Documents · Unité Internationale",
  },

  pt: {
    col1Title: "Centro Global de Documentos",
    col1Desc:
      "Coordenação documental com validação por etapas e acompanhamento por código.",

    col2Title: "Regiões",
    regions: [
      "🇺🇸 Estados Unidos",
      "🇨🇦 Canadá",
      "🇪🇺 União Europeia",
      "🇬🇧 Reino Unido",
      "🇦🇺 Austrália",
    ],

    col3Title: "Links",
    links: {
      services: "Serviços",
      flow: "Fluxo",
      team: "Equipe",
      evidence: "Evidências",
      indicators: "Indicadores",
    },

    col4Title: "Contato",
    contactEmail: "support@centro-global.com",
    contactPhone: "+51 904284928",
    hours: "Horário: 24/7",

    bottom: "Centro Global de Documentos · Unidade Internacional",
  },

  de: {
    col1Title: "Globales Dokumentenzentrum",
    col1Desc:
      "Dokumentenkoordination mit phasenbasierter Validierung und Code-Tracking.",

    col2Title: "Regionen",
    regions: [
      "🇺🇸 USA",
      "🇨🇦 Kanada",
      "🇪🇺 Europäische Union",
      "🇬🇧 Vereinigtes Königreich",
      "🇦🇺 Australien",
    ],

    col3Title: "Links",
    links: {
      services: "Leistungen",
      flow: "Ablauf",
      team: "Team",
      evidence: "Nachweise",
      indicators: "Indikatoren",
    },

    col4Title: "Kontakt",
    contactEmail: "support@centro-global.com",
    contactPhone: "+51 904284928",
    hours: "Zeiten: 24/7",

    bottom: "Globales Dokumentenzentrum · Internationale Einheit",
  },

  it: {
    col1Title: "Centro Documenti Globale",
    col1Desc:
      "Coordinamento documentale con validazione per fasi e tracciamento tramite codice.",

    col2Title: "Regioni",
    regions: [
      "🇺🇸 Stati Uniti",
      "🇨🇦 Canada",
      "🇪🇺 Unione Europea",
      "🇬🇧 Regno Unito",
      "🇦🇺 Australia",
    ],

    col3Title: "Link",
    links: {
      services: "Servizi",
      flow: "Processo",
      team: "Team",
      evidence: "Evidenze",
      indicators: "Indicatori",
    },

    col4Title: "Contatto",
    contactEmail: "support@centro-global.com",
    contactPhone: "+51 904284928",
    hours: "Orari: 24/7",

    bottom: "Centro Documenti Globale · Unità Internazionale",
  },

  ar: {
    col1Title: "مركز الوثائق العالمي",
    col1Desc:
      "تنسيق الوثائق مع تحقق حسب المراحل وتتبع عبر رمز.",

    col2Title: "المناطق",
    regions: [
      "🇺🇸 الولايات المتحدة",
      "🇨🇦 كندا",
      "🇪🇺 الاتحاد الأوروبي",
      "🇬🇧 المملكة المتحدة",
      "🇦🇺 أستراليا",
    ],

    col3Title: "روابط",
    links: {
      services: "الخدمات",
      flow: "العملية",
      team: "الفريق",
      evidence: "الأدلة",
      indicators: "المؤشرات",
    },

    col4Title: "التواصل",
    contactEmail: "support@centro-global.com",
    contactPhone: "+51 904284928",
    hours: "الوقت: 24/7",

    bottom: "مركز الوثائق العالمي · وحدة دولية",
  },

  ru: {
    col1Title: "Глобальный центр документов",
    col1Desc:
      "Координация документов с проверкой по этапам и отслеживанием по коду.",

    col2Title: "Регионы",
    regions: [
      "🇺🇸 США",
      "🇨🇦 Канада",
      "🇪🇺 Евросоюз",
      "🇬🇧 Великобритания",
      "🇦🇺 Австралия",
    ],

    col3Title: "Ссылки",
    links: {
      services: "Услуги",
      flow: "Процесс",
      team: "Команда",
      evidence: "Доказательства",
      indicators: "Индикаторы",
    },

    col4Title: "Контакты",
    contactEmail: "support@centro-global.com",
    contactPhone: "+51 904284928",
    hours: "Время: 24/7",

    bottom: "Глобальный центр документов · Международный отдел",
  },
};

export const Footer: React.FC = () => {
  const { locale, isRTL } = useContext(I18nContext);
  const copy = useMemo(() => FOOTER_COPY[locale] || FOOTER_COPY.es, [locale]);
  const year = new Date().getFullYear();

  return (
    <footer className="footer" style={{ direction: isRTL ? "rtl" : "ltr" }}>
      <div className="footer-content">
        <div className="footer-col">
          <h4>{copy.col1Title}</h4>
          <p className="muted">{copy.col1Desc}</p>
        </div>

        <div className="footer-col">
          <h4>{copy.col2Title}</h4>
          <ul>
            {copy.regions.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>{copy.col3Title}</h4>
          <ul>
            <li>
              <a href="#servicios">{copy.links.services}</a>
            </li>
            <li>
              <a href="#flujo">{copy.links.flow}</a>
            </li>
            <li>
              <a href="#equipo">{copy.links.team}</a>
            </li>
            <li>
              <a href="#evidencia">{copy.links.evidence}</a>
            </li>
            <li>
              <a href="#indicadores">{copy.links.indicators}</a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>{copy.col4Title}</h4>
          <p className="muted">{copy.contactEmail}</p>
          <p className="muted">{copy.contactPhone}</p>
          <p className="muted">{copy.hours}</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>©️ {year} {copy.bottom}</p>
      </div>
    </footer>
  );
};