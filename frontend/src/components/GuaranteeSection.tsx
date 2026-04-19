import React, { useContext, useMemo } from "react";
import { I18nContext, type Locale } from "../i18n";

type GuaranteeDict = {
  title: string;
  lead: string;

  c1Title: string;
  c1Desc: string;
  c1Items: [string, string, string];

  c2Title: string;
  c2Desc: string;
  c2Items: [string, string, string];

  c3Title: string;
  c3Desc: string;
  c3Items: [string, string, string];
};

const GUARANTEE_COPY: Record<Locale, GuaranteeDict> = {
  es: {
    title: "Garantías & Certificaciones",
    lead:
      "Controles internos aplicados a cada solicitud para mantener un proceso ordenado, verificable por etapas y fácil de seguir.",

    c1Title: "Control de Expediente",
    c1Desc: "Tu solicitud se gestiona con un registro único y pasos definidos.",
    c1Items: [
      "Validación de datos antes de avanzar.",
      "Checklist por servicio (requisitos claros).",
      "Historial y trazabilidad del flujo.",
    ],

    c2Title: "Prioridad y Tiempos",
    c2Desc: "La atención se organiza por prioridad con tiempos estimados.",
    c2Items: [
      "Prioridad Media: flujo estándar.",
      "Prioridad Alta: atención preferente (+30%).",
      "Actualizaciones visibles por etapa.",
    ],

    c3Title: "Verificación y Seguimiento",
    c3Desc: "Consulta el avance con tu código y coordina el cierre por WhatsApp.",
    c3Items: [
      "Código único por solicitud.",
      "Panel de seguimiento por etapas.",
      "Resumen final para coordinación.",
    ],
  },

  en: {
    title: "Guarantees & Certifications",
    lead:
      "Internal controls applied to each request to keep the process organized, stage-verifiable, and easy to follow.",

    c1Title: "Case File Control",
    c1Desc: "Your request is managed with a unique record and defined steps.",
    c1Items: [
      "Data validation before moving forward.",
      "Service-based checklist (clear requirements).",
      "Process history and traceability.",
    ],

    c2Title: "Priority & Timelines",
    c2Desc: "Service is organized by priority with estimated timelines.",
    c2Items: [
      "Standard Priority: regular flow.",
      "High Priority: expedited handling (+30%).",
      "Stage-by-stage visible updates.",
    ],

    c3Title: "Verification & Tracking",
    c3Desc: "Check progress with your code and coordinate the final step via WhatsApp.",
    c3Items: [
      "Unique code per request.",
      "Stage-based tracking panel.",
      "Final summary for coordination.",
    ],
  },

  fr: {
    title: "Garanties & Certifications",
    lead:
      "Contrôles internes appliqués à chaque demande pour un processus ordonné, vérifiable par étapes et facile à suivre.",

    c1Title: "Contrôle du dossier",
    c1Desc: "Votre demande est gérée avec un enregistrement unique et des étapes définies.",
    c1Items: [
      "Validation des données avant de continuer.",
      "Checklist par service (exigences claires).",
      "Historique et traçabilité du flux.",
    ],

    c2Title: "Priorité & Délais",
    c2Desc: "Le traitement est organisé par priorité avec des délais estimés.",
    c2Items: [
      "Priorité moyenne : flux standard.",
      "Priorité élevée : traitement prioritaire (+30%).",
      "Mises à jour visibles par étape.",
    ],

    c3Title: "Vérification & Suivi",
    c3Desc: "Consultez l’avancement avec votre code et coordonnez la clôture via WhatsApp.",
    c3Items: [
      "Code unique par demande.",
      "Panneau de suivi par étapes.",
      "Résumé final pour la coordination.",
    ],
  },

  pt: {
    title: "Garantias & Certificações",
    lead:
      "Controles internos aplicados a cada solicitação para manter um processo organizado, verificável por etapas e fácil de acompanhar.",

    c1Title: "Controle do Dossiê",
    c1Desc: "Sua solicitação é gerenciada com um registro único e etapas definidas.",
    c1Items: [
      "Validação de dados antes de avançar.",
      "Checklist por serviço (requisitos claros).",
      "Histórico e rastreabilidade do fluxo.",
    ],

    c2Title: "Prioridade & Prazos",
    c2Desc: "O atendimento é organizado por prioridade com prazos estimados.",
    c2Items: [
      "Prioridade média: fluxo padrão.",
      "Prioridade alta: atendimento preferencial (+30%).",
      "Atualizações visíveis por etapa.",
    ],

    c3Title: "Verificação & Acompanhamento",
    c3Desc: "Acompanhe com seu código e coordene o fechamento via WhatsApp.",
    c3Items: [
      "Código único por solicitação.",
      "Painel de acompanhamento por etapas.",
      "Resumo final para coordenação.",
    ],
  },

  de: {
    title: "Garantien & Zertifizierungen",
    lead:
      "Interne Kontrollen für jede Anfrage – organisiert, phasenweise prüfbar und leicht nachvollziehbar.",

    c1Title: "Aktenkontrolle",
    c1Desc: "Deine Anfrage wird mit einer eindeutigen Registrierung und klaren Schritten geführt.",
    c1Items: [
      "Datenvalidierung vor dem nächsten Schritt.",
      "Checkliste je Service (klare Anforderungen).",
      "Historie und Nachverfolgbarkeit des Ablaufs.",
    ],

    c2Title: "Priorität & Zeiten",
    c2Desc: "Die Bearbeitung erfolgt nach Priorität mit geschätzten Zeiten.",
    c2Items: [
      "Mittlere Priorität: Standardablauf.",
      "Hohe Priorität: bevorzugte Bearbeitung (+30%).",
      "Sichtbare Updates je Phase.",
    ],

    c3Title: "Prüfung & Tracking",
    c3Desc: "Fortschritt per Code prüfen und Abschluss per WhatsApp koordinieren.",
    c3Items: [
      "Eindeutiger Code pro Anfrage.",
      "Tracking-Panel nach Phasen.",
      "Abschlussübersicht zur Koordination.",
    ],
  },

  it: {
    title: "Garanzie & Certificazioni",
    lead:
      "Controlli interni applicati a ogni richiesta per un processo ordinato, verificabile per fasi e facile da seguire.",

    c1Title: "Controllo pratica",
    c1Desc: "La tua richiesta viene gestita con un registro unico e passaggi definiti.",
    c1Items: [
      "Validazione dei dati prima di procedere.",
      "Checklist per servizio (requisiti chiari).",
      "Storico e tracciabilità del flusso.",
    ],

    c2Title: "Priorità & Tempistiche",
    c2Desc: "Il servizio è organizzato per priorità con tempi stimati.",
    c2Items: [
      "Priorità media: flusso standard.",
      "Priorità alta: gestione preferenziale (+30%).",
      "Aggiornamenti visibili per fase.",
    ],

    c3Title: "Verifica & Tracciamento",
    c3Desc: "Controlla l’avanzamento con il tuo codice e coordina la chiusura via WhatsApp.",
    c3Items: [
      "Codice unico per richiesta.",
      "Pannello di tracking per fasi.",
      "Riepilogo finale per coordinamento.",
    ],
  },

  ar: {
    title: "الضمانات والشهادات",
    lead:
      "ضوابط داخلية تُطبَّق على كل طلب لضمان سيرٍ منظّم، قابل للتحقق حسب المراحل، وسهل المتابعة.",

    c1Title: "ضبط الملف",
    c1Desc: "يتم إدارة طلبك بسجلّ فريد وخطوات محددة.",
    c1Items: [
      "التحقق من البيانات قبل الانتقال للمرحلة التالية.",
      "قائمة متطلبات حسب الخدمة (متطلبات واضحة).",
      "سجل وتتبع لمسار العملية.",
    ],

    c2Title: "الأولوية والوقت",
    c2Desc: "يتم تنظيم الخدمة حسب الأولوية مع أوقات تقديرية.",
    c2Items: [
      "أولوية متوسطة: مسار قياسي.",
      "أولوية عالية: معالجة أسرع (+30%).",
      "تحديثات مرئية لكل مرحلة.",
    ],

    c3Title: "التحقق والتتبع",
    c3Desc: "تابع التقدم باستخدام رمزك ونسّق الإغلاق عبر واتساب.",
    c3Items: [
      "رمز فريد لكل طلب.",
      "لوحة تتبع حسب المراحل.",
      "ملخص نهائي للتنسيق.",
    ],
  },

  ru: {
    title: "Гарантии и сертификация",
    lead:
      "Внутренние проверки для каждой заявки — организованный процесс, проверяемый по этапам и понятный в отслеживании.",

    c1Title: "Контроль досье",
    c1Desc: "Ваша заявка ведётся с уникальной регистрацией и чёткими шагами.",
    c1Items: [
      "Проверка данных перед переходом дальше.",
      "Чек-лист по услуге (понятные требования).",
      "История и трассируемость процесса.",
    ],

    c2Title: "Приоритет и сроки",
    c2Desc: "Обработка организована по приоритету с оценкой сроков.",
    c2Items: [
      "Средний приоритет: стандартный процесс.",
      "Высокий приоритет: ускоренная обработка (+30%).",
      "Обновления статуса по этапам.",
    ],

    c3Title: "Проверка и отслеживание",
    c3Desc: "Смотрите прогресс по коду и согласуйте финал через WhatsApp.",
    c3Items: [
      "Уникальный код на заявку.",
      "Панель отслеживания по этапам.",
      "Финальное резюме для координации.",
    ],
  },
};

export const GuaranteeSection: React.FC = () => {
  const { locale, isRTL } = useContext(I18nContext);

  const copy = useMemo(() => GUARANTEE_COPY[locale] || GUARANTEE_COPY.es, [locale]);

  return (
    <section id="garantias" className="section" style={{ direction: isRTL ? "rtl" : "ltr" }}>
      <h2>{copy.title}</h2>
      <p className="muted">{copy.lead}</p>

      <div className="cards-grid">
        <div className="card">
          <h3>{copy.c1Title}</h3>
          <p>{copy.c1Desc}</p>
          <ul>
            {copy.c1Items.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3>{copy.c2Title}</h3>
          <p>{copy.c2Desc}</p>
          <ul>
            {copy.c2Items.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3>{copy.c3Title}</h3>
          <p>{copy.c3Desc}</p>
          <ul>
            {copy.c3Items.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};