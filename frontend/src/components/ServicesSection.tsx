import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { I18nContext, type Locale } from "../i18n";

type ServiceCardCopy = {
  badge: string;
  title: string;
  subtitle: string;
  priceUsd: string; // solo texto (no formateamos por locale para no romper tu estilo)
  tag: string;
  bullets: [string, string, string, string];
  footnote: string;
};

type ServicesDict = {
  h2: string;
  leadHtml: string;
  ariaLeft: string;
  ariaRight: string;
  cards: {
    passport: ServiceCardCopy;
    green: ServiceCardCopy;
    visa: ServiceCardCopy;
    license: ServiceCardCopy;
  };
};

const SERVICES_COPY: Record<Locale, ServicesDict> = {
  es: {
    h2: "Portafolio de Servicios",
    leadHtml:
      'Elige el servicio que necesitas. Te guiamos por etapas y recibirás un <strong>código</strong> para ver el avance del proceso.',
    ariaLeft: "Desplazar servicios a la izquierda",
    ariaRight: "Desplazar servicios a la derecha",
    cards: {
      passport: {
        badge: "Alta complejidad",
        title: "Pasaportes & Nacionalidad",
        subtitle:
          "Gestión integral para casos de identidad y nacionalidad, con seguimiento por etapas.",
        priceUsd: "4,500",
        tag: "Identidad · Trámite integral",
        bullets: [
          "Checklist de requisitos por servicio.",
          "Validación de datos y consistencia del expediente.",
          "Seguimiento por etapas con código.",
          "Resultado y coordinación final.",
        ],
        footnote: "Ideal si necesitas control y trazabilidad de principio a fin.",
      },
      green: {
        badge: "Residencia",
        title: "Residencia / Green Card",
        subtitle:
          "Organización del expediente y planificación por fases, con estatus visible durante el proceso.",
        priceUsd: "1,400",
        tag: "Residencia · Largo plazo",
        bullets: [
          "Ruta por etapas (recepción → validación → documentación).",
          "Orden y revisión del expediente.",
          "Registro del progreso por código.",
          "Coordinación y cierre por WhatsApp.",
        ],
        footnote: "Recomendado para procesos que requieren orden y seguimiento.",
      },
      visa: {
        badge: "Prioritario",
        title: "Visa Americana Elite",
        subtitle:
          "Preparación del perfil y revisión de documentos, con soporte de coordinación y seguimiento.",
        priceUsd: "950",
        tag: "Asesoría · Seguimiento",
        bullets: [
          "Validación de datos y documentación base.",
          "Revisión de consistencia y checklist.",
          "Seguimiento por código.",
          "Resumen final para coordinar por WhatsApp.",
        ],
        footnote: "Enfoque: claridad, tiempos y control del avance.",
      },
      license: {
        badge: "Rápido",
        title: "Licencia Internacional Multipaís",
        subtitle:
          "Proceso simple con confirmación de datos y coordinación de entrega.",
        priceUsd: "380",
        tag: "Movilidad · Coordinación",
        bullets: [
          "Registro rápido y validación mínima.",
          "Checklist básico de requisitos.",
          "Seguimiento por código.",
          "Coordinación final por WhatsApp.",
        ],
        footnote: "Ideal como trámite sencillo con avance visible.",
      },
    },
  },

  en: {
    h2: "Service Portfolio",
    leadHtml:
      'Choose the service you need. We guide you step-by-step and you’ll receive a <strong>code</strong> to track progress.',
    ariaLeft: "Scroll services left",
    ariaRight: "Scroll services right",
    cards: {
      passport: {
        badge: "High complexity",
        title: "Passports & Nationality",
        subtitle:
          "End-to-end handling for identity and nationality cases, with stage-by-stage tracking.",
        priceUsd: "4,500",
        tag: "Identity · Full handling",
        bullets: [
          "Service-specific requirements checklist.",
          "Data validation and case consistency review.",
          "Stage tracking with a code.",
          "Final result and coordination.",
        ],
        footnote: "Ideal if you need control and traceability from start to finish.",
      },
      green: {
        badge: "Residency",
        title: "Residency / Green Card",
        subtitle:
          "Case organization and phased planning, with visible status during the process.",
        priceUsd: "1,400",
        tag: "Residency · Long-term",
        bullets: [
          "Step path (intake → validation → documentation).",
          "Case organization and review.",
          "Progress recorded by code.",
          "WhatsApp coordination and closure.",
        ],
        footnote: "Recommended for processes that require structure and follow-up.",
      },
      visa: {
        badge: "Priority",
        title: "US Visa Elite",
        subtitle:
          "Profile preparation and document review, with coordination support and tracking.",
        priceUsd: "950",
        tag: "Advisory · Tracking",
        bullets: [
          "Data validation and base documentation.",
          "Consistency review and checklist.",
          "Tracking by code.",
          "Final summary to coordinate via WhatsApp.",
        ],
        footnote: "Focus: clarity, timelines, and progress control.",
      },
      license: {
        badge: "Fast",
        title: "International Multi-country License",
        subtitle:
          "Simple process with data confirmation and delivery coordination.",
        priceUsd: "380",
        tag: "Mobility · Coordination",
        bullets: [
          "Quick registration and minimal validation.",
          "Basic requirements checklist.",
          "Tracking by code.",
          "Final coordination via WhatsApp.",
        ],
        footnote: "Ideal for a simple request with visible progress.",
      },
    },
  },

  fr: {
    h2: "Portefeuille de services",
    leadHtml:
      'Choisissez le service dont vous avez besoin. Nous vous guidons par étapes et vous recevrez un <strong>code</strong> pour suivre l’avancement.',
    ariaLeft: "Faire défiler les services vers la gauche",
    ariaRight: "Faire défiler les services vers la droite",
    cards: {
      passport: {
        badge: "Haute complexité",
        title: "Passeports & Nationalité",
        subtitle:
          "Gestion complète des cas d’identité et de nationalité, avec suivi par étapes.",
        priceUsd: "4,500",
        tag: "Identité · Gestion intégrale",
        bullets: [
          "Checklist d’exigences selon le service.",
          "Validation des données et cohérence du dossier.",
          "Suivi par étapes via un code.",
          "Résultat final et coordination.",
        ],
        footnote: "Idéal si vous avez besoin de contrôle et de traçabilité de bout en bout.",
      },
      green: {
        badge: "Résidence",
        title: "Résidence / Green Card",
        subtitle:
          "Organisation du dossier et planification par phases, avec statut visible.",
        priceUsd: "1,400",
        tag: "Résidence · Long terme",
        bullets: [
          "Parcours (réception → validation → documentation).",
          "Organisation et revue du dossier.",
          "Progression enregistrée par code.",
          "Coordination et clôture via WhatsApp.",
        ],
        footnote: "Recommandé pour les démarches nécessitant ordre et suivi.",
      },
      visa: {
        badge: "Prioritaire",
        title: "Visa USA Elite",
        subtitle:
          "Préparation du profil et revue des documents, avec support de coordination et suivi.",
        priceUsd: "950",
        tag: "Conseil · Suivi",
        bullets: [
          "Validation des données et documents de base.",
          "Vérification de cohérence et checklist.",
          "Suivi par code.",
          "Résumé final pour coordonner via WhatsApp.",
        ],
        footnote: "Objectif : clarté, délais et contrôle de l’avancement.",
      },
      license: {
        badge: "Rapide",
        title: "Permis international multi-pays",
        subtitle:
          "Processus simple avec confirmation des données et coordination de remise.",
        priceUsd: "380",
        tag: "Mobilité · Coordination",
        bullets: [
          "Enregistrement rapide et validation minimale.",
          "Checklist de base des exigences.",
          "Suivi par code.",
          "Coordination finale via WhatsApp.",
        ],
        footnote: "Idéal pour une démarche simple avec progression visible.",
      },
    },
  },

  pt: {
    h2: "Portfólio de Serviços",
    leadHtml:
      'Escolha o serviço que você precisa. Nós guiamos por etapas e você receberá um <strong>código</strong> para acompanhar o andamento.',
    ariaLeft: "Deslizar serviços para a esquerda",
    ariaRight: "Deslizar serviços para a direita",
    cards: {
      passport: {
        badge: "Alta complexidade",
        title: "Passaportes & Nacionalidade",
        subtitle:
          "Gestão completa para casos de identidade e nacionalidade, com acompanhamento por etapas.",
        priceUsd: "4,500",
        tag: "Identidade · Gestão integral",
        bullets: [
          "Checklist de requisitos por serviço.",
          "Validação de dados e consistência do processo.",
          "Acompanhamento por etapas com código.",
          "Resultado e coordenação final.",
        ],
        footnote: "Ideal se você precisa de controle e rastreabilidade do início ao fim.",
      },
      green: {
        badge: "Residência",
        title: "Residência / Green Card",
        subtitle:
          "Organização do dossiê e planejamento por fases, com status visível durante o processo.",
        priceUsd: "1,400",
        tag: "Residência · Longo prazo",
        bullets: [
          "Rota por etapas (recepção → validação → documentação).",
          "Organização e revisão do dossiê.",
          "Progresso registrado por código.",
          "Coordenação e fechamento via WhatsApp.",
        ],
        footnote: "Recomendado para processos que exigem organização e acompanhamento.",
      },
      visa: {
        badge: "Prioritário",
        title: "Visto EUA Elite",
        subtitle:
          "Preparação do perfil e revisão de documentos, com suporte de coordenação e acompanhamento.",
        priceUsd: "950",
        tag: "Assessoria · Acompanhamento",
        bullets: [
          "Validação de dados e documentação base.",
          "Revisão de consistência e checklist.",
          "Acompanhamento por código.",
          "Resumo final para coordenar via WhatsApp.",
        ],
        footnote: "Foco: clareza, prazos e controle do andamento.",
      },
      license: {
        badge: "Rápido",
        title: "Licença Internacional Multipaís",
        subtitle:
          "Processo simples com confirmação de dados e coordenação de entrega.",
        priceUsd: "380",
        tag: "Mobilidade · Coordenação",
        bullets: [
          "Registro rápido e validação mínima.",
          "Checklist básico de requisitos.",
          "Acompanhamento por código.",
          "Coordenação final via WhatsApp.",
        ],
        footnote: "Ideal como solicitação simples com progresso visível.",
      },
    },
  },

  de: {
    h2: "Service-Portfolio",
    leadHtml:
      'Wähle den Service, den du brauchst. Wir führen dich durch die Schritte und du erhältst einen <strong>Code</strong>, um den Fortschritt zu verfolgen.',
    ariaLeft: "Services nach links scrollen",
    ariaRight: "Services nach rechts scrollen",
    cards: {
      passport: {
        badge: "Hohe Komplexität",
        title: "Pässe & Staatsangehörigkeit",
        subtitle:
          "End-to-end Abwicklung für Identitäts- und Staatsangehörigkeitsfälle – mit Tracking nach Phasen.",
        priceUsd: "4,500",
        tag: "Identität · Komplettabwicklung",
        bullets: [
          "Checkliste je Service.",
          "Datenvalidierung und Konsistenzprüfung.",
          "Tracking per Code nach Phasen.",
          "Ergebnis und finale Koordination.",
        ],
        footnote: "Ideal, wenn du Kontrolle und Nachverfolgbarkeit von Anfang bis Ende brauchst.",
      },
      green: {
        badge: "Aufenthalt",
        title: "Aufenthalt / Green Card",
        subtitle:
          "Akte organisieren und in Phasen planen – mit sichtbarem Status.",
        priceUsd: "1,400",
        tag: "Aufenthalt · Langfristig",
        bullets: [
          "Ablauf (Eingang → Validierung → Dokumentation).",
          "Akte strukturieren und prüfen.",
          "Fortschritt per Code.",
          "WhatsApp-Koordination & Abschluss.",
        ],
        footnote: "Empfohlen für Prozesse, die Struktur und Follow-up erfordern.",
      },
      visa: {
        badge: "Priorität",
        title: "US Visa Elite",
        subtitle:
          "Profilvorbereitung und Dokumentenprüfung – mit Koordination und Tracking.",
        priceUsd: "950",
        tag: "Beratung · Tracking",
        bullets: [
          "Datenvalidierung & Basisdokumente.",
          "Konsistenzprüfung & Checkliste.",
          "Tracking per Code.",
          "Finale Zusammenfassung für WhatsApp-Koordination.",
        ],
        footnote: "Fokus: Klarheit, Zeiten und Fortschrittskontrolle.",
      },
      license: {
        badge: "Schnell",
        title: "Internationaler Multi-Länder-Führerschein",
        subtitle:
          "Einfacher Prozess mit Datenbestätigung und Lieferkoordination.",
        priceUsd: "380",
        tag: "Mobilität · Koordination",
        bullets: [
          "Schnelle Registrierung, minimale Validierung.",
          "Basis-Checkliste.",
          "Tracking per Code.",
          "Finale WhatsApp-Koordination.",
        ],
        footnote: "Ideal für einen einfachen Antrag mit sichtbarem Fortschritt.",
      },
    },
  },

  it: {
    h2: "Portafoglio Servizi",
    leadHtml:
      'Scegli il servizio che ti serve. Ti guidiamo per fasi e riceverai un <strong>codice</strong> per seguire l’avanzamento.',
    ariaLeft: "Scorri i servizi a sinistra",
    ariaRight: "Scorri i servizi a destra",
    cards: {
      passport: {
        badge: "Alta complessità",
        title: "Passaporti & Nazionalità",
        subtitle:
          "Gestione completa per casi di identità e nazionalità, con tracciamento per fasi.",
        priceUsd: "4,500",
        tag: "Identità · Gestione completa",
        bullets: [
          "Checklist requisiti per servizio.",
          "Validazione dati e coerenza della pratica.",
          "Tracciamento per fasi con codice.",
          "Risultato e coordinamento finale.",
        ],
        footnote: "Ideale se ti serve controllo e tracciabilità dall’inizio alla fine.",
      },
      green: {
        badge: "Residenza",
        title: "Residenza / Green Card",
        subtitle:
          "Organizzazione della pratica e pianificazione per fasi, con stato visibile.",
        priceUsd: "1,400",
        tag: "Residenza · Lungo termine",
        bullets: [
          "Percorso (ricezione → validazione → documentazione).",
          "Ordine e revisione della pratica.",
          "Progresso registrato con codice.",
          "Coordinamento e chiusura via WhatsApp.",
        ],
        footnote: "Consigliato per processi che richiedono ordine e monitoraggio.",
      },
      visa: {
        badge: "Prioritario",
        title: "Visto USA Elite",
        subtitle:
          "Preparazione profilo e revisione documenti, con supporto e tracciamento.",
        priceUsd: "950",
        tag: "Consulenza · Tracciamento",
        bullets: [
          "Validazione dati e documenti base.",
          "Revisione coerenza e checklist.",
          "Tracciamento con codice.",
          "Riepilogo finale per coordinare via WhatsApp.",
        ],
        footnote: "Focus: chiarezza, tempi e controllo dell’avanzamento.",
      },
      license: {
        badge: "Rapido",
        title: "Licenza Internazionale Multi-paese",
        subtitle:
          "Processo semplice con conferma dati e coordinamento consegna.",
        priceUsd: "380",
        tag: "Mobilità · Coordinamento",
        bullets: [
          "Registrazione rapida e validazione minima.",
          "Checklist base requisiti.",
          "Tracciamento con codice.",
          "Coordinamento finale via WhatsApp.",
        ],
        footnote: "Ideale come pratica semplice con avanzamento visibile.",
      },
    },
  },

  ar: {
    h2: "مجموعة الخدمات",
    leadHtml:
      'اختر الخدمة التي تحتاجها. نرشدك خطوة بخطوة وستحصل على <strong>رمز</strong> لمتابعة التقدم.',
    ariaLeft: "تمرير الخدمات إلى اليسار",
    ariaRight: "تمرير الخدمات إلى اليمين",
    cards: {
      passport: {
        badge: "تعقيد عالٍ",
        title: "جوازات السفر والجنسيّة",
        subtitle:
          "إدارة شاملة لحالات الهوية والجنسية مع تتبع على مراحل.",
        priceUsd: "4,500",
        tag: "هوية · معالجة كاملة",
        bullets: [
          "قائمة متطلبات حسب الخدمة.",
          "تحقق البيانات واتساق الملف.",
          "تتبع على مراحل عبر رمز.",
          "النتيجة والتنسيق النهائي.",
        ],
        footnote: "مثالي إذا كنت تحتاج تحكمًا وتتبعًا من البداية للنهاية.",
      },
      green: {
        badge: "إقامة",
        title: "الإقامة / البطاقة الخضراء",
        subtitle:
          "تنظيم الملف والتخطيط على مراحل مع حالة واضحة أثناء العملية.",
        priceUsd: "1,400",
        tag: "إقامة · طويل الأجل",
        bullets: [
          "مسار (استلام → تحقق → مستندات).",
          "ترتيب ومراجعة الملف.",
          "تسجيل التقدم عبر رمز.",
          "تنسيق وإغلاق عبر واتساب.",
        ],
        footnote: "موصى به للعمليات التي تتطلب تنظيمًا ومتابعة.",
      },
      visa: {
        badge: "أولوية",
        title: "تأشيرة أمريكا Elite",
        subtitle:
          "تحضير الملف ومراجعة المستندات مع دعم للتنسيق والتتبع.",
        priceUsd: "950",
        tag: "استشارة · تتبع",
        bullets: [
          "تحقق البيانات والمستندات الأساسية.",
          "مراجعة الاتساق والقائمة.",
          "تتبع عبر رمز.",
          "ملخص نهائي للتنسيق عبر واتساب.",
        ],
        footnote: "التركيز: الوضوح، الوقت، والتحكم بالتقدم.",
      },
      license: {
        badge: "سريع",
        title: "رخصة دولية متعددة الدول",
        subtitle:
          "عملية بسيطة مع تأكيد البيانات وتنسيق التسليم.",
        priceUsd: "380",
        tag: "تنقّل · تنسيق",
        bullets: [
          "تسجيل سريع وتحقق بسيط.",
          "قائمة متطلبات أساسية.",
          "تتبع عبر رمز.",
          "تنسيق نهائي عبر واتساب.",
        ],
        footnote: "مثالي كطلب بسيط مع تقدم واضح.",
      },
    },
  },

  ru: {
    h2: "Портфель услуг",
    leadHtml:
      'Выберите нужную услугу. Мы ведём по этапам, и вы получите <strong>код</strong> для отслеживания прогресса.',
    ariaLeft: "Прокрутить услуги влево",
    ariaRight: "Прокрутить услуги вправо",
    cards: {
      passport: {
        badge: "Высокая сложность",
        title: "Паспорта и гражданство",
        subtitle:
          "Полное сопровождение по вопросам личности и гражданства с поэтапным трекингом.",
        priceUsd: "4,500",
        tag: "Личность · Полное сопровождение",
        bullets: [
          "Чек-лист требований по услуге.",
          "Проверка данных и целостности кейса.",
          "Поэтапное отслеживание по коду.",
          "Финальный результат и координация.",
        ],
        footnote: "Идеально, если нужен контроль и прозрачность от начала до конца.",
      },
      green: {
        badge: "Резиденция",
        title: "Резиденция / Green Card",
        subtitle:
          "Организация кейса и планирование по фазам со статусом во время процесса.",
        priceUsd: "1,400",
        tag: "Резиденция · Долгосрочно",
        bullets: [
          "Маршрут (приём → проверка → документы).",
          "Организация и ревизия кейса.",
          "Прогресс по коду.",
          "Координация и закрытие через WhatsApp.",
        ],
        footnote: "Рекомендуется для процессов, где важны порядок и сопровождение.",
      },
      visa: {
        badge: "Приоритет",
        title: "US Visa Elite",
        subtitle:
          "Подготовка профиля и проверка документов с поддержкой и трекингом.",
        priceUsd: "950",
        tag: "Консультация · Трекинг",
        bullets: [
          "Проверка данных и базовых документов.",
          "Проверка согласованности и чек-лист.",
          "Отслеживание по коду.",
          "Итоговое резюме для WhatsApp-координации.",
        ],
        footnote: "Фокус: ясность, сроки и контроль продвижения.",
      },
      license: {
        badge: "Быстро",
        title: "Международные права (мульти-страны)",
        subtitle:
          "Простой процесс: подтверждение данных и координация выдачи.",
        priceUsd: "380",
        tag: "Мобильность · Координация",
        bullets: [
          "Быстрая регистрация и минимальная проверка.",
          "Базовый чек-лист требований.",
          "Отслеживание по коду.",
          "Финальная координация через WhatsApp.",
        ],
        footnote: "Идеально для простой заявки с видимым прогрессом.",
      },
    },
  },
};

export const ServicesSection: React.FC = () => {
  const { locale } = useContext(I18nContext);
  const copy = useMemo(() => SERVICES_COPY[locale] || SERVICES_COPY.es, [locale]);

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;

    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    const eps = 2;
    setCanLeft(el.scrollLeft > eps);
    setCanRight(el.scrollLeft < maxScrollLeft - eps);
  };

  const scrollByCard = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;

    const firstCard = el.querySelector<HTMLElement>(".price-card");
    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth || 340;
    const gap = 18;
    const amount = cardWidth + gap;

    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateArrows();

    const onScroll = () => updateArrows();
    const onResize = () => updateArrows();

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section id="servicios" className="section">
      <h2>{copy.h2}</h2>

      <p className="muted" dangerouslySetInnerHTML={{ __html: copy.leadHtml }} />

      <div style={{ position: "relative" }}>
        <button
          type="button"
          aria-label={copy.ariaLeft}
          onClick={() => scrollByCard("left")}
          disabled={!canLeft}
          style={{
            position: "absolute",
            left: 6,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 5,
            width: 44,
            height: 44,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(10,10,10,0.35)",
            color: "white",
            backdropFilter: "blur(8px)",
            cursor: canLeft ? "pointer" : "not-allowed",
            display: "grid",
            placeItems: "center",
            opacity: canLeft ? 1 : 0.4,
          }}
        >
          ‹
        </button>

        <button
          type="button"
          aria-label={copy.ariaRight}
          onClick={() => scrollByCard("right")}
          disabled={!canRight}
          style={{
            position: "absolute",
            right: 6,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 5,
            width: 44,
            height: 44,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(10,10,10,0.35)",
            color: "white",
            backdropFilter: "blur(8px)",
            cursor: canRight ? "pointer" : "not-allowed",
            display: "grid",
            placeItems: "center",
            opacity: canRight ? 1 : 0.4,
          }}
        >
          ›
        </button>

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 54,
            zIndex: 4,
            pointerEvents: "none",
            background:
              "linear-gradient(90deg, rgba(10,10,10,0.85), rgba(10,10,10,0))",
            borderRadius: 16,
          }}
        />

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 54,
            zIndex: 4,
            pointerEvents: "none",
            background:
              "linear-gradient(270deg, rgba(10,10,10,0.85), rgba(10,10,10,0))",
            borderRadius: 16,
          }}
        />

        <div
          ref={scrollerRef}
          className="pricing-grid"
          style={{
            display: "flex",
            flexWrap: "nowrap",
            gap: "18px",
            overflowX: "auto",
            paddingBottom: "10px",
            paddingLeft: "58px",
            paddingRight: "58px",
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* 1) Passport */}
          <article className="price-card" style={{ flex: "0 0 340px", scrollSnapAlign: "start", scrollSnapStop: "always" }}>
            <header className="price-header">
              <span className="pricing-badge">{copy.cards.passport.badge}</span>
              <h3>{copy.cards.passport.title}</h3>
              <p className="price-subtitle">{copy.cards.passport.subtitle}</p>
              <div className="price-amount">
                <span className="currency">USD</span>
                <span className="value">{copy.cards.passport.priceUsd}</span>
              </div>
              <div className="price-tag">{copy.cards.passport.tag}</div>
            </header>

            <ul className="price-body">
              {copy.cards.passport.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>

            <footer className="price-footnote">{copy.cards.passport.footnote}</footer>
          </article>

          {/* 2) Green */}
          <article className="price-card" style={{ flex: "0 0 340px", scrollSnapAlign: "start", scrollSnapStop: "always" }}>
            <header className="price-header">
              <span className="pricing-badge">{copy.cards.green.badge}</span>
              <h3>{copy.cards.green.title}</h3>
              <p className="price-subtitle">{copy.cards.green.subtitle}</p>
              <div className="price-amount">
                <span className="currency">USD</span>
                <span className="value">{copy.cards.green.priceUsd}</span>
              </div>
              <div className="price-tag secondary">{copy.cards.green.tag}</div>
            </header>

            <ul className="price-body">
              {copy.cards.green.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>

            <footer className="price-footnote">{copy.cards.green.footnote}</footer>
          </article>

          {/* 3) Visa */}
          <article className="price-card highlighted" style={{ flex: "0 0 340px", scrollSnapAlign: "start", scrollSnapStop: "always" }}>
            <header className="price-header">
              <span className="pricing-badge">{copy.cards.visa.badge}</span>
              <h3>{copy.cards.visa.title}</h3>
              <p className="price-subtitle">{copy.cards.visa.subtitle}</p>
              <div className="price-amount">
                <span className="currency">USD</span>
                <span className="value">{copy.cards.visa.priceUsd}</span>
              </div>
              <div className="price-tag">{copy.cards.visa.tag}</div>
            </header>

            <ul className="price-body">
              {copy.cards.visa.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>

            <footer className="price-footnote">{copy.cards.visa.footnote}</footer>
          </article>

          {/* 4) License */}
          <article className="price-card" style={{ flex: "0 0 340px", scrollSnapAlign: "start", scrollSnapStop: "always" }}>
            <header className="price-header">
              <span className="pricing-badge">{copy.cards.license.badge}</span>
              <h3>{copy.cards.license.title}</h3>
              <p className="price-subtitle">{copy.cards.license.subtitle}</p>
              <div className="price-amount">
                <span className="currency">USD</span>
                <span className="value">{copy.cards.license.priceUsd}</span>
              </div>
              <div className="price-tag tertiary">{copy.cards.license.tag}</div>
            </header>

            <ul className="price-body">
              {copy.cards.license.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>

            <footer className="price-footnote">{copy.cards.license.footnote}</footer>
          </article>
        </div>
      </div>
    </section>
  );
};