import React, { useContext, useMemo } from "react";
import { I18nContext, type Locale } from "../i18n";

type TestimonialsDict = {
  h2: string;
  lead: string;
  cards: Array<{ quote: string; meta: string }>;
};

const TESTIMONIALS_COPY: Record<Locale, TestimonialsDict> = {
  es: {
    h2: "Experiencias de Usuarios",
    lead: "Comentarios reales sobre coordinación, tiempos y seguimiento por etapas.",
    cards: [
      {
        quote: "“El seguimiento por código me ayudó a entender en qué etapa estaba.”",
        meta: "— Visa · Coordinación y estatus",
      },
      {
        quote: "“El flujo fue claro: validación, documentación y resultado.”",
        meta: "— Pasaporte · Proceso por etapas",
      },
      {
        quote: "“Me dieron el resumen final y coordiné por WhatsApp sin confusiones.”",
        meta: "— Residencia · Confirmación final",
      },
    ],
  },

  en: {
    h2: "User Experiences",
    lead: "Real feedback about coordination, timelines, and step-by-step tracking.",
    cards: [
      {
        quote: "“Tracking by code helped me understand which stage I was in.”",
        meta: "— Visa · Coordination & status",
      },
      {
        quote: "“The flow was clear: validation, documentation, and final result.”",
        meta: "— Passport · Step-by-step process",
      },
      {
        quote: "“I received the final summary and coordinated via WhatsApp with no confusion.”",
        meta: "— Residency · Final confirmation",
      },
    ],
  },

  fr: {
    h2: "Expériences Utilisateurs",
    lead: "Retours réels sur la coordination, les délais et le suivi par étapes.",
    cards: [
      {
        quote: "« Le suivi par code m’a aidé à comprendre à quelle étape j’étais. »",
        meta: "— Visa · Coordination & statut",
      },
      {
        quote: "« Le parcours était clair : validation, documents et résultat. »",
        meta: "— Passeport · Processus par étapes",
      },
      {
        quote: "« J’ai reçu le résumé final et j’ai coordonné via WhatsApp sans confusion. »",
        meta: "— Résidence · Confirmation finale",
      },
    ],
  },

  pt: {
    h2: "Experiências de Usuários",
    lead: "Comentários reais sobre coordenação, prazos e acompanhamento por etapas.",
    cards: [
      {
        quote: "“O acompanhamento por código me ajudou a entender em que etapa eu estava.”",
        meta: "— Visto · Coordenação e status",
      },
      {
        quote: "“O fluxo foi claro: validação, documentação e resultado.”",
        meta: "— Passaporte · Processo por etapas",
      },
      {
        quote: "“Recebi o resumo final e coordenei pelo WhatsApp sem confusão.”",
        meta: "— Residência · Confirmação final",
      },
    ],
  },

  de: {
    h2: "Nutzererfahrungen",
    lead: "Echte Rückmeldungen zu Koordination, Zeiten und Tracking nach Phasen.",
    cards: [
      {
        quote: "„Das Tracking per Code hat mir gezeigt, in welcher Phase ich bin.“",
        meta: "— Visum · Koordination & Status",
      },
      {
        quote: "„Der Ablauf war klar: Validierung, Dokumente und Ergebnis.“",
        meta: "— Reisepass · Prozess in Phasen",
      },
      {
        quote: "„Ich bekam die finale Zusammenfassung und koordinierte per WhatsApp ohne Verwirrung.“",
        meta: "— Aufenthalt · Finale Bestätigung",
      },
    ],
  },

  it: {
    h2: "Esperienze degli Utenti",
    lead: "Commenti reali su coordinamento, tempi e tracciamento per fasi.",
    cards: [
      {
        quote: "“Il tracciamento tramite codice mi ha aiutato a capire in quale fase ero.”",
        meta: "— Visto · Coordinamento e stato",
      },
      {
        quote: "“Il flusso era chiaro: validazione, documenti e risultato.”",
        meta: "— Passaporto · Processo a fasi",
      },
      {
        quote: "“Ho ricevuto il riepilogo finale e ho coordinato via WhatsApp senza confusione.”",
        meta: "— Residenza · Conferma finale",
      },
    ],
  },

  ar: {
    h2: "تجارب المستخدمين",
    lead: "تعليقات حقيقية حول التنسيق، المدة الزمنية، والتتبع حسب المراحل.",
    cards: [
      {
        quote: "“ساعدني التتبع عبر الرمز على فهم المرحلة التي وصلت إليها.”",
        meta: "— تأشيرة · تنسيق وحالة",
      },
      {
        quote: "“كان المسار واضحًا: التحقق، المستندات، ثم النتيجة.”",
        meta: "— جواز سفر · عملية على مراحل",
      },
      {
        quote: "“استلمت الملخص النهائي ونسّقت عبر واتساب بدون أي لبس.”",
        meta: "— إقامة · تأكيد نهائي",
      },
    ],
  },

  ru: {
    h2: "Отзывы пользователей",
    lead: "Реальные комментарии о координации, сроках и поэтапном отслеживании.",
    cards: [
      {
        quote: "«Отслеживание по коду помогло понять, на каком я этапе.»",
        meta: "— Виза · Координация и статус",
      },
      {
        quote: "«Процесс был понятным: проверка, документы и результат.»",
        meta: "— Паспорт · Поэтапный процесс",
      },
      {
        quote: "«Мне дали итоговое резюме и я без путаницы согласовал(а) всё через WhatsApp.»",
        meta: "— Резиденция · Финальное подтверждение",
      },
    ],
  },
};

export const TestimonialsSection: React.FC = () => {
  const { locale, isRTL } = useContext(I18nContext);
  const copy = useMemo(() => TESTIMONIALS_COPY[locale] || TESTIMONIALS_COPY.es, [locale]);

  return (
    <section id="casos" className="section" style={{ direction: isRTL ? "rtl" : "ltr" }}>
      <h2>{copy.h2}</h2>
      <p className="muted">{copy.lead}</p>

      <div className="testimonials">
        {copy.cards.map((c) => (
          <div className="t-card" key={c.meta}>
            <p>{c.quote}</p>
            <span>{c.meta}</span>
          </div>
        ))}
      </div>
    </section>
  );
};