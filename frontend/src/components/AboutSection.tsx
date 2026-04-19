import React, { useContext, useMemo } from "react";
import { I18nContext, type Locale } from "../i18n";

type AboutDict = {
  h2: string;
  lead: string;

  block1Label: string;
  block1Caption: string;
  b1li1: string;
  b1li2: string;
  b1li3: string;
  pill1: string;
  pill2: string;
  pill3: string;

  block2Title: string;
  b2li1: string;
  b2li2: string;
  b2li3: string;
  pillSoft1: string;
  pillSoft2: string;
  pillSoft3: string;

  block3Title: string;
  block3Desc: string;
  footerCaption: string;
};

const ABOUT_COPY: Record<Locale, AboutDict> = {
  es: {
    h2: "Acerca de Nuestro Centro Global",
    lead:
      "Un punto de coordinación para trámites documentarios, con validación de datos y seguimiento por código.",

    block1Label: "GDX Global Desk",
    block1Caption: "Coordinación central para solicitudes documentarias.",
    b1li1: "Un solo canal para coordinar requisitos y avances.",
    b1li2: "Proceso por etapas con estado claro.",
    b1li3: "Cierre y coordinación final por WhatsApp.",
    pill1: "Seguimiento",
    pill2: "Etapas claras",
    pill3: "Coordinación",

    block2Title: "Qué obtienes",
    b2li1: "Código de seguimiento para ver tu avance.",
    b2li2: "Checklist de requisitos según el servicio.",
    b2li3: "Prioridad Media o Alta con tiempos estimados.",
    pillSoft1: "Recepción",
    pillSoft2: "Validación",
    pillSoft3: "Resultado",

    block3Title: "Recursos",
    block3Desc: "Formatos y checklist para preparar tu solicitud rápidamente.",
    footerCaption: "Si tienes dudas, abre el chat y entra a “FAQ”.",
  },

  en: {
    h2: "About Our Global Center",
    lead:
      "A single coordination hub for document requests, with data validation and code-based tracking.",

    block1Label: "GDX Global Desk",
    block1Caption: "Central coordination for document requests.",
    b1li1: "One channel to coordinate requirements and updates.",
    b1li2: "Stage-by-stage flow with clear status.",
    b1li3: "Final closure and coordination via WhatsApp.",
    pill1: "Tracking",
    pill2: "Clear stages",
    pill3: "Coordination",

    block2Title: "What you get",
    b2li1: "A tracking code to view progress.",
    b2li2: "A requirements checklist based on the service.",
    b2li3: "Standard or High Priority with estimated timelines.",
    pillSoft1: "Intake",
    pillSoft2: "Validation",
    pillSoft3: "Result",

    block3Title: "Resources",
    block3Desc: "Templates and checklists to prepare your request quickly.",
    footerCaption: "If you have questions, open the chat and go to “FAQ”.",
  },

  fr: {
    h2: "À propos de notre centre global",
    lead:
      "Un point de coordination unique pour les démarches documentaires, avec validation des données et suivi par code.",

    block1Label: "GDX Global Desk",
    block1Caption: "Coordination centrale des demandes documentaires.",
    b1li1: "Un seul canal pour coordonner exigences et mises à jour.",
    b1li2: "Parcours par étapes avec statut clair.",
    b1li3: "Clôture et coordination finale via WhatsApp.",
    pill1: "Suivi",
    pill2: "Étapes claires",
    pill3: "Coordination",

    block2Title: "Ce que vous obtenez",
    b2li1: "Un code de suivi pour voir l’avancement.",
    b2li2: "Une checklist d’exigences selon le service.",
    b2li3: "Priorité standard ou élevée avec délais estimés.",
    pillSoft1: "Réception",
    pillSoft2: "Validation",
    pillSoft3: "Résultat",

    block3Title: "Ressources",
    block3Desc: "Modèles et checklists pour préparer votre demande rapidement.",
    footerCaption: "En cas de doute, ouvrez le chat et allez dans « FAQ ».",
  },

  pt: {
    h2: "Sobre o nosso Centro Global",
    lead:
      "Um ponto único de coordenação para solicitações documentais, com validação de dados e acompanhamento por código.",

    block1Label: "GDX Global Desk",
    block1Caption: "Coordenação central para solicitações documentais.",
    b1li1: "Um canal para coordenar requisitos e atualizações.",
    b1li2: "Fluxo por etapas com status claro.",
    b1li3: "Fechamento e coordenação final via WhatsApp.",
    pill1: "Acompanhamento",
    pill2: "Etapas claras",
    pill3: "Coordenação",

    block2Title: "O que você recebe",
    b2li1: "Código de acompanhamento para ver o progresso.",
    b2li2: "Checklist de requisitos conforme o serviço.",
    b2li3: "Prioridade Média ou Alta com prazos estimados.",
    pillSoft1: "Recepção",
    pillSoft2: "Validação",
    pillSoft3: "Resultado",

    block3Title: "Recursos",
    block3Desc: "Modelos e checklists para preparar sua solicitação rapidamente.",
    footerCaption: "Se tiver dúvidas, abra o chat e vá em “FAQ”.",
  },

  de: {
    h2: "Über unser Global Center",
    lead:
      "Eine zentrale Anlaufstelle für Dokumentanträge – mit Datenvalidierung und Tracking per Code.",

    block1Label: "GDX Global Desk",
    block1Caption: "Zentrale Koordination für Dokumentanträge.",
    b1li1: "Ein Kanal zur Koordination von Anforderungen und Updates.",
    b1li2: "Ablauf in Phasen mit klarem Status.",
    b1li3: "Abschluss und finale Koordination über WhatsApp.",
    pill1: "Tracking",
    pill2: "Klare Phasen",
    pill3: "Koordination",

    block2Title: "Was du erhältst",
    b2li1: "Einen Tracking-Code zur Fortschrittsanzeige.",
    b2li2: "Eine Checkliste je nach Service.",
    b2li3: "Mittlere oder hohe Priorität mit geschätzten Zeiten.",
    pillSoft1: "Eingang",
    pillSoft2: "Validierung",
    pillSoft3: "Ergebnis",

    block3Title: "Ressourcen",
    block3Desc: "Vorlagen und Checklisten, um deine Anfrage schnell vorzubereiten.",
    footerCaption: "Bei Fragen: Chat öffnen und „FAQ“ auswählen.",
  },

  it: {
    h2: "Chi siamo: Centro Globale",
    lead:
      "Un unico punto di coordinamento per pratiche documentali, con validazione dei dati e tracciamento tramite codice.",

    block1Label: "GDX Global Desk",
    block1Caption: "Coordinamento centrale per richieste documentali.",
    b1li1: "Un canale unico per requisiti e aggiornamenti.",
    b1li2: "Flusso a fasi con stato chiaro.",
    b1li3: "Chiusura e coordinamento finale via WhatsApp.",
    pill1: "Tracciamento",
    pill2: "Fasi chiare",
    pill3: "Coordinamento",

    block2Title: "Cosa ottieni",
    b2li1: "Un codice per vedere l’avanzamento.",
    b2li2: "Checklist requisiti in base al servizio.",
    b2li3: "Priorità Media o Alta con tempi stimati.",
    pillSoft1: "Ricezione",
    pillSoft2: "Validazione",
    pillSoft3: "Risultato",

    block3Title: "Risorse",
    block3Desc: "Modelli e checklist per preparare la richiesta rapidamente.",
    footerCaption: "Se hai dubbi, apri la chat e vai su “FAQ”.",
  },

  ar: {
    h2: "حول مركزنا العالمي",
    lead:
      "نقطة تنسيق واحدة للطلبات الوثائقية مع التحقق من البيانات والتتبع عبر رمز.",

    block1Label: "مكتب GDX العالمي",
    block1Caption: "تنسيق مركزي للطلبات الوثائقية.",
    b1li1: "قناة واحدة لتنسيق المتطلبات والتحديثات.",
    b1li2: "مسار على مراحل مع حالة واضحة.",
    b1li3: "إغلاق وتنسيق نهائي عبر واتساب.",
    pill1: "تتبّع",
    pill2: "مراحل واضحة",
    pill3: "تنسيق",

    block2Title: "ماذا تحصل عليه",
    b2li1: "رمز تتبّع لمشاهدة التقدم.",
    b2li2: "قائمة متطلبات حسب الخدمة.",
    b2li3: "أولوية متوسطة أو عالية مع أوقات تقديرية.",
    pillSoft1: "استلام",
    pillSoft2: "تحقق",
    pillSoft3: "نتيجة",

    block3Title: "الموارد",
    block3Desc: "نماذج وقوائم لتجهيز طلبك بسرعة.",
    footerCaption: "إذا لديك أسئلة، افتح الدردشة واذهب إلى “FAQ”.",
  },

  ru: {
    h2: "О нашем глобальном центре",
    lead:
      "Единый центр координации для документальных заявок: проверка данных и отслеживание по коду.",

    block1Label: "GDX Global Desk",
    block1Caption: "Центральная координация документальных заявок.",
    b1li1: "Один канал для требований и обновлений.",
    b1li2: "Поэтапный процесс с понятным статусом.",
    b1li3: "Закрытие и финальная координация через WhatsApp.",
    pill1: "Трекинг",
    pill2: "Понятные этапы",
    pill3: "Координация",

    block2Title: "Что вы получаете",
    b2li1: "Код отслеживания прогресса.",
    b2li2: "Чек-лист требований по услуге.",
    b2li3: "Средний или высокий приоритет со сроками.",
    pillSoft1: "Приём",
    pillSoft2: "Проверка",
    pillSoft3: "Результат",

    block3Title: "Ресурсы",
    block3Desc: "Шаблоны и чек-листы для быстрого оформления заявки.",
    footerCaption: "Если есть вопросы — откройте чат и выберите “FAQ”.",
  },
};

export const AboutSection: React.FC = () => {
  const { locale } = useContext(I18nContext);
  const copy = useMemo(() => ABOUT_COPY[locale] || ABOUT_COPY.es, [locale]);

  return (
    <section id="about" className="section">
      <h2>{copy.h2}</h2>
      <p className="muted">{copy.lead}</p>

      <div className="about-layout">
        {/* Bloque 1 */}
        <div className="about-block">
          <div className="about-logo-row">
            <div className="about-logo-badge">GDX</div>
            <div>
              <p className="about-label">{copy.block1Label}</p>
              <p className="about-caption">{copy.block1Caption}</p>
            </div>
          </div>

          <ul>
            <li>{copy.b1li1}</li>
            <li>{copy.b1li2}</li>
            <li>{copy.b1li3}</li>
          </ul>

          <div className="about-pill-row">
            <span className="about-pill">{copy.pill1}</span>
            <span className="about-pill">{copy.pill2}</span>
            <span className="about-pill">{copy.pill3}</span>
          </div>
        </div>

        {/* Bloque 2 */}
        <div className="about-block">
          <h3>{copy.block2Title}</h3>
          <ul>
            <li>{copy.b2li1}</li>
            <li>{copy.b2li2}</li>
            <li>{copy.b2li3}</li>
          </ul>

          <div className="about-pill-row">
            <span className="about-pill soft">{copy.pillSoft1}</span>
            <span className="about-pill soft">{copy.pillSoft2}</span>
            <span className="about-pill soft">{copy.pillSoft3}</span>
          </div>
        </div>

        {/* Bloque 3 */}
        <div className="about-block">
          <h3>{copy.block3Title}</h3>
          <p>{copy.block3Desc}</p>

          {/* ✅ Se removieron botones “Descargar brochure” y “Ver checklist” */}

          <p className="about-caption">{copy.footerCaption}</p>
        </div>
      </div>
    </section>
  );
};