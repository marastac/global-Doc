import React, { useContext, useMemo } from "react";
import { I18nContext, type Locale } from "../i18n";

type StepsDict = {
  h2: string;
  lead: string;
  steps: Array<{
    title: string;
    desc: string;
  }>;
};

const STEPS_COPY: Record<Locale, StepsDict> = {
  es: {
    h2: "Proceso de Tramitación",
    lead:
      "Un flujo simple por etapas para que sepas qué pasa en cada momento y puedas ver el avance con tu código de seguimiento.",
    steps: [
      {
        title: "Recepción de solicitud",
        desc:
          "Registras tus datos y eliges el servicio. El sistema genera un código para seguimiento.",
      },
      {
        title: "Validación de datos",
        desc:
          "Se revisa que la información esté completa y coherente antes de pasar a documentación.",
      },
      {
        title: "Revisión documental",
        desc:
          "Se verifica el checklist del servicio y se confirman los requisitos para continuar el proceso.",
      },
      {
        title: "Resultado y coordinación",
        desc:
          "Se registra el resultado y se coordina por WhatsApp con el resumen de tu solicitud.",
      },
    ],
  },

  en: {
    h2: "Processing Workflow",
    lead:
      "A simple step-by-step flow so you know what happens at each moment and can track progress with your tracking code.",
    steps: [
      {
        title: "Request intake",
        desc:
          "You enter your details and choose a service. The system generates a tracking code.",
      },
      {
        title: "Data validation",
        desc:
          "We verify the information is complete and consistent before moving to documentation.",
      },
      {
        title: "Document review",
        desc:
          "We check the service checklist and confirm the required documents to continue.",
      },
      {
        title: "Result & coordination",
        desc:
          "We register the final result and coordinate via WhatsApp with your request summary.",
      },
    ],
  },

  fr: {
    h2: "Processus de traitement",
    lead:
      "Un parcours simple par étapes pour savoir ce qui se passe à chaque moment et suivre l’avancement grâce à votre code.",
    steps: [
      {
        title: "Réception de la demande",
        desc:
          "Vous saisissez vos informations et choisissez un service. Le système génère un code de suivi.",
      },
      {
        title: "Validation des données",
        desc:
          "Nous vérifions que les informations sont complètes et cohérentes avant la phase documentaire.",
      },
      {
        title: "Vérification documentaire",
        desc:
          "Nous contrôlons la checklist du service et confirmons les exigences pour continuer.",
      },
      {
        title: "Résultat & coordination",
        desc:
          "Nous enregistrons le résultat et coordonnons via WhatsApp avec le résumé de votre demande.",
      },
    ],
  },

  pt: {
    h2: "Fluxo de Tramitação",
    lead:
      "Um fluxo simples por etapas para você saber o que acontece em cada momento e acompanhar com seu código.",
    steps: [
      {
        title: "Recebimento da solicitação",
        desc:
          "Você informa seus dados e escolhe o serviço. O sistema gera um código de acompanhamento.",
      },
      {
        title: "Validação de dados",
        desc:
          "Verificamos se as informações estão completas e coerentes antes de passar à documentação.",
      },
      {
        title: "Revisão documental",
        desc:
          "Conferimos a checklist do serviço e confirmamos os requisitos para continuar.",
      },
      {
        title: "Resultado e coordenação",
        desc:
          "Registramos o resultado e coordenamos via WhatsApp com o resumo da sua solicitação.",
      },
    ],
  },

  de: {
    h2: "Ablauf der Bearbeitung",
    lead:
      "Ein einfacher Ablauf in Phasen, damit du jederzeit weißt, was passiert, und den Fortschritt mit deinem Code verfolgen kannst.",
    steps: [
      {
        title: "Anfrageeingang",
        desc:
          "Du gibst deine Daten ein und wählst den Service. Das System erstellt einen Tracking-Code.",
      },
      {
        title: "Datenvalidierung",
        desc:
          "Wir prüfen, ob die Angaben vollständig und konsistent sind, bevor es zur Dokumentation geht.",
      },
      {
        title: "Dokumentenprüfung",
        desc:
          "Wir prüfen die Checkliste des Services und bestätigen die Anforderungen für den nächsten Schritt.",
      },
      {
        title: "Ergebnis & Koordination",
        desc:
          "Wir erfassen das Ergebnis und koordinieren per WhatsApp mit deiner Zusammenfassung.",
      },
    ],
  },

  it: {
    h2: "Processo di gestione",
    lead:
      "Un flusso semplice per fasi per sapere cosa succede in ogni momento e seguire l’avanzamento con il tuo codice.",
    steps: [
      {
        title: "Ricezione richiesta",
        desc:
          "Inserisci i tuoi dati e scegli il servizio. Il sistema genera un codice di tracciamento.",
      },
      {
        title: "Validazione dati",
        desc:
          "Verifichiamo che le informazioni siano complete e coerenti prima della documentazione.",
      },
      {
        title: "Revisione documenti",
        desc:
          "Controlliamo la checklist del servizio e confermiamo i requisiti per proseguire.",
      },
      {
        title: "Risultato & coordinamento",
        desc:
          "Registriamo il risultato e coordiniamo via WhatsApp con il riepilogo della richiesta.",
      },
    ],
  },

  ar: {
    h2: "مسار المعالجة",
    lead:
      "مسار بسيط على مراحل لتعرف ما يحدث في كل خطوة ويمكنك متابعة التقدم باستخدام رمز التتبع.",
    steps: [
      {
        title: "استلام الطلب",
        desc:
          "تُدخل بياناتك وتختار الخدمة. يقوم النظام بإنشاء رمز تتبع.",
      },
      {
        title: "التحقق من البيانات",
        desc:
          "نراجع أن المعلومات كاملة ومتسقة قبل الانتقال إلى مرحلة المستندات.",
      },
      {
        title: "مراجعة المستندات",
        desc:
          "نراجع قائمة المتطلبات للخدمة ونؤكد الوثائق المطلوبة للمتابعة.",
      },
      {
        title: "النتيجة والتنسيق",
        desc:
          "نقوم بتسجيل النتيجة والتنسيق عبر واتساب مع ملخص طلبك.",
      },
    ],
  },

  ru: {
    h2: "Процесс оформления",
    lead:
      "Простой поэтапный процесс: вы всегда понимаете, что происходит, и можете отслеживать прогресс по коду.",
    steps: [
      {
        title: "Приём заявки",
        desc:
          "Вы вводите данные и выбираете услугу. Система создаёт код отслеживания.",
      },
      {
        title: "Проверка данных",
        desc:
          "Проверяем, что информация полная и согласованная, перед переходом к документам.",
      },
      {
        title: "Проверка документов",
        desc:
          "Сверяем чек-лист услуги и подтверждаем требования для продолжения.",
      },
      {
        title: "Результат и координация",
        desc:
          "Фиксируем итог и координируем через WhatsApp с резюме вашей заявки.",
      },
    ],
  },
};

export const StepsSection: React.FC = () => {
  const { locale, isRTL } = useContext(I18nContext);
  const copy = useMemo(() => STEPS_COPY[locale] || STEPS_COPY.es, [locale]);

  return (
    <section id="flujo" className="section alt" style={{ direction: isRTL ? "rtl" : "ltr" }}>
      <h2>{copy.h2}</h2>
      <p className="muted">{copy.lead}</p>

      <div className="steps">
        {copy.steps.map((s, idx) => (
          <div className="step" key={s.title}>
            <span className="step-number">{idx + 1}</span>
            <h4>{s.title}</h4>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};