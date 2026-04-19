import React, { useContext, useMemo } from "react";
import { I18nContext, type Locale } from "../i18n";

type HeroDict = {
  title: string;
  lead: string;
  bullets: [string, string, string];
  cta: string;

  badge: string;
  cardTitle: string;
  cardDesc: string;
  mini1: string;
  mini2: string;
  foot: string;
};

const HERO_COPY: Record<Locale, HeroDict> = {
  es: {
    title: "Tramitación Documentaria Internacional con Seguimiento",
    lead:
      'Gestiona tu solicitud en minutos: eliges el servicio, completas tus datos y recibes un <strong>código</strong> para ver el avance del proceso.',
    bullets: [
      "Flujo guiado: recepción → validación → documentación → resultado.",
      "Prioridad clara (Media o Alta) con tiempos estimados.",
      "Coordinación final por WhatsApp con el resumen de tu solicitud.",
    ],
    cta: "Iniciar mi solicitud",
    badge: "Resumen rápido",
    cardTitle: "Cómo se atiende tu solicitud",
    cardDesc:
      "El sistema te guía paso a paso y te muestra un estado visible por etapas con tu código de seguimiento.",
    mini1: "Servicios desde <strong>USD 380</strong>.",
    mini2: "Prioridad Alta incrementa el total en <strong>+30%</strong>.",
    foot:
      "Los requisitos exactos dependen del servicio seleccionado y se confirman durante el flujo del asistente.",
  },

  en: {
    title: "International Document Processing with Tracking",
    lead:
      'Submit your request in minutes: choose a service, complete your details, and receive a <strong>code</strong> to track progress.',
    bullets: [
      "Guided flow: intake → validation → documentation → final result.",
      "Clear priority (Standard or High) with estimated timelines.",
      "Final coordination via WhatsApp with your request summary.",
    ],
    cta: "Start my request",
    badge: "Quick summary",
    cardTitle: "How your request is handled",
    cardDesc:
      "The system guides you step-by-step and shows a stage-by-stage status using your tracking code.",
    mini1: "Services from <strong>USD 380</strong>.",
    mini2: "High Priority increases the total by <strong>+30%</strong>.",
    foot:
      "Exact requirements depend on the selected service and are confirmed during the assistant flow.",
  },

  fr: {
    title: "Gestion Documentaire Internationale avec Suivi",
    lead:
      "Traitez votre demande en quelques minutes : choisissez le service, complétez vos informations et recevez un <strong>code</strong> pour suivre l’avancement.",
    bullets: [
      "Parcours guidé : réception → validation → documentation → résultat.",
      "Priorité claire (Moyenne ou Haute) avec délais estimés.",
      "Coordination finale via WhatsApp avec le résumé de votre demande.",
    ],
    cta: "Démarrer ma demande",
    badge: "Résumé rapide",
    cardTitle: "Comment votre demande est traitée",
    cardDesc:
      "Le système vous guide étape par étape et affiche un statut par phase grâce à votre code de suivi.",
    mini1: "Services dès <strong>USD 380</strong>.",
    mini2: "La priorité haute augmente le total de <strong>+30%</strong>.",
    foot:
      "Les exigences exactes dépendent du service choisi et sont confirmées pendant le parcours.",
  },

  pt: {
    title: "Tramitação Documental Internacional com Acompanhamento",
    lead:
      "Envie sua solicitação em minutos: escolha o serviço, preencha seus dados e receba um <strong>código</strong> para acompanhar o andamento.",
    bullets: [
      "Fluxo guiado: recepção → validação → documentação → resultado.",
      "Prioridade clara (Média ou Alta) com prazos estimados.",
      "Coordenação final via WhatsApp com o resumo da solicitação.",
    ],
    cta: "Iniciar minha solicitação",
    badge: "Resumo rápido",
    cardTitle: "Como sua solicitação é atendida",
    cardDesc:
      "O sistema orienta passo a passo e mostra um status por etapas com seu código de acompanhamento.",
    mini1: "Serviços a partir de <strong>USD 380</strong>.",
    mini2: "Prioridade Alta aumenta o total em <strong>+30%</strong>.",
    foot:
      "Os requisitos exatos dependem do serviço escolhido e são confirmados durante o fluxo do assistente.",
  },

  de: {
    title: "Internationale Dokumentenabwicklung mit Status-Tracking",
    lead:
      "Erstelle deine Anfrage in Minuten: Service wählen, Daten ausfüllen und einen <strong>Code</strong> erhalten, um den Fortschritt zu verfolgen.",
    bullets: [
      "Geführter Ablauf: Eingang → Validierung → Dokumentation → Ergebnis.",
      "Klare Priorität (Mittel oder Hoch) mit geschätzten Zeiten.",
      "Abschlusskoordination per WhatsApp mit deiner Zusammenfassung.",
    ],
    cta: "Anfrage starten",
    badge: "Kurzüberblick",
    cardTitle: "So wird deine Anfrage bearbeitet",
    cardDesc:
      "Das System führt dich Schritt für Schritt und zeigt den Status nach Phasen über deinen Tracking-Code.",
    mini1: "Services ab <strong>USD 380</strong>.",
    mini2: "Hohe Priorität erhöht den Gesamtbetrag um <strong>+30%</strong>.",
    foot:
      "Die genauen Anforderungen hängen vom gewählten Service ab und werden im Assistentenprozess bestätigt.",
  },

  it: {
    title: "Gestione Documentale Internazionale con Tracciamento",
    lead:
      "Invia la tua richiesta in pochi minuti: scegli il servizio, inserisci i dati e ricevi un <strong>codice</strong> per seguire l’avanzamento.",
    bullets: [
      "Flusso guidato: ricezione → validazione → documentazione → risultato.",
      "Priorità chiara (Media o Alta) con tempi stimati.",
      "Coordinamento finale via WhatsApp con il riepilogo della richiesta.",
    ],
    cta: "Avvia la mia richiesta",
    badge: "Riepilogo rapido",
    cardTitle: "Come viene gestita la tua richiesta",
    cardDesc:
      "Il sistema ti guida passo dopo passo e mostra lo stato per fasi usando il tuo codice di tracciamento.",
    mini1: "Servizi da <strong>USD 380</strong>.",
    mini2: "Priorità Alta aumenta il totale del <strong>+30%</strong>.",
    foot:
      "I requisiti esatti dipendono dal servizio scelto e vengono confermati durante il flusso dell’assistente.",
  },

  ar: {
    title: "معالجة وثائق دولية مع تتبّع الحالة",
    lead:
      "قدّم طلبك خلال دقائق: اختر الخدمة، أكمل بياناتك، وستحصل على <strong>رمز</strong> لمتابعة التقدّم.",
    bullets: [
      "مسار موجّه: الاستلام → التحقق → المستندات → النتيجة.",
      "أولوية واضحة (متوسطة أو عالية) مع أوقات تقديرية.",
      "تنسيق نهائي عبر واتساب مع ملخص طلبك.",
    ],
    cta: "ابدأ طلبي",
    badge: "ملخص سريع",
    cardTitle: "كيف تتم معالجة طلبك",
    cardDesc:
      "يرشدك النظام خطوة بخطوة ويعرض حالة واضحة حسب المراحل باستخدام رمز التتبع.",
    mini1: "الخدمات تبدأ من <strong>USD 380</strong>.",
    mini2: "الأولوية العالية تزيد الإجمالي بنسبة <strong>+30%</strong>.",
    foot:
      "تختلف المتطلبات حسب الخدمة المختارة ويتم تأكيدها أثناء مسار المساعد.",
  },

  ru: {
    title: "Международное оформление документов с отслеживанием",
    lead:
      "Оформите заявку за минуты: выберите услугу, заполните данные и получите <strong>код</strong> для отслеживания прогресса.",
    bullets: [
      "Пошаговый процесс: приём → проверка → документы → результат.",
      "Понятный приоритет (Средний или Высокий) с оценкой сроков.",
      "Финальная координация через WhatsApp с вашим резюме заявки.",
    ],
    cta: "Начать заявку",
    badge: "Кратко",
    cardTitle: "Как обрабатывается ваша заявка",
    cardDesc:
      "Система ведёт шаг за шагом и показывает статус по этапам с помощью кода отслеживания.",
    mini1: "Услуги от <strong>USD 380</strong>.",
    mini2: "Высокий приоритет увеличивает итог на <strong>+30%</strong>.",
    foot:
      "Точные требования зависят от выбранной услуги и подтверждаются в ходе работы ассистента.",
  },
};

export const Hero: React.FC = () => {
  const { locale } = useContext(I18nContext);

  const copy = useMemo(() => HERO_COPY[locale] || HERO_COPY.es, [locale]);

  const handleStartClick = () => {
    const ev = new CustomEvent("open-chatbot");
    window.dispatchEvent(ev);
  };

  return (
    <section className="hero">
      <div className="hero-text">
        <h1>{copy.title}</h1>

        <p dangerouslySetInnerHTML={{ __html: copy.lead }} />

        <ul className="hero-bullets">
          {copy.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>

        <button type="button" className="btn-primary" onClick={handleStartClick}>
          {copy.cta}
        </button>
      </div>

      <div className="hero-panel">
        <div
          className="hero-card"
          style={{
            maxWidth: "360px",
            marginLeft: "auto",
            borderRadius: 20,
            padding: "18px 18px 16px",
            background:
              "radial-gradient(circle at top, rgba(56,189,248,0.16), rgba(15,23,42,0.98))",
            boxShadow: "0 22px 48px rgba(15,23,42,0.95)",
            border: "1px solid rgba(148,163,184,0.7)",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "3px 10px",
              borderRadius: 999,
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              background: "rgba(8,47,73,0.95)",
              color: "#bae6fd",
              marginBottom: 8,
            }}
          >
            {copy.badge}
          </span>

          <h3 style={{ marginBottom: 6, fontSize: "1rem" }}>{copy.cardTitle}</h3>

          <p style={{ fontSize: "0.86rem", color: "#9ca3af", marginBottom: 8 }}>
            {copy.cardDesc}
          </p>

          <ul className="hero-mini-list" style={{ marginBottom: 6 }}>
            <li dangerouslySetInnerHTML={{ __html: copy.mini1 }} />
            <li dangerouslySetInnerHTML={{ __html: copy.mini2 }} />
          </ul>

          <p className="tiny">{copy.foot}</p>
        </div>
      </div>
    </section>
  );
};