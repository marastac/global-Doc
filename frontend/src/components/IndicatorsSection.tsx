import React, { useContext, useMemo } from "react";
import { I18nContext, type Locale } from "../i18n";

type IndicatorsDict = {
  title: string;

  i1Title: string;
  i1Body: string;

  i2Title: string;
  i2Body: string;

  i3Title: string;
  i3Body: string;

  i4Title: string;
  i4Body: string;

  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
  ctaNote: string;
};

const INDICATORS_COPY: Record<Locale, IndicatorsDict> = {
  es: {
    title: "Ventajas del Servicio",

    i1Title: "Proceso por etapas",
    i1Body:
      "Ves el avance con un flujo claro: recepción → validación → documentación → resultado.",

    i2Title: "Seguimiento por código",
    i2Body:
      "Con tu código puedes revisar el estado y entender qué falta en cada etapa.",

    i3Title: "Prioridad y tiempos",
    i3Body:
      "Prioridad Media o Alta con tiempos estimados. Alta incrementa el total en +30%.",

    i4Title: "Coordinación final",
    i4Body:
      "Al finalizar, recibes un resumen y coordinas por WhatsApp sin confusiones.",

    ctaTitle: "Aquí puedes iniciar tu solicitud (Demo)",
    ctaBody:
      'Haz clic en <strong>“Asesor IA”</strong> y completa el proceso en una sola conversación.',
    ctaButton: "Asesor IA",
    ctaNote: "*Presiona el botón e inicia tu solicitud",
  },

  en: {
    title: "Service Advantages",

    i1Title: "Stage-based process",
    i1Body:
      "Track progress with a clear flow: intake → validation → documentation → final result.",

    i2Title: "Tracking code",
    i2Body:
      "With your code you can check the status and understand what’s missing at each stage.",

    i3Title: "Priority & timelines",
    i3Body:
      "Standard or High Priority with estimated timelines. High increases the total by +30%.",

    i4Title: "Final coordination",
    i4Body:
      "At the end, you receive a summary and coordinate via WhatsApp without confusion.",

    ctaTitle: "Start your request here (Demo)",
    ctaBody:
      'Click <strong>“AI Advisor”</strong> and complete the process in a single conversation.',
    ctaButton: "AI Advisor",
    ctaNote: "*Press the button and start your application",
  },

  fr: {
    title: "Avantages du service",

    i1Title: "Processus par étapes",
    i1Body:
      "Suivez l’avancement via un flux clair : réception → validation → documentation → résultat.",

    i2Title: "Code de suivi",
    i2Body:
      "Avec votre code, vous pouvez vérifier l’état et comprendre ce qui manque à chaque étape.",

    i3Title: "Priorité & délais",
    i3Body:
      "Priorité moyenne ou haute avec des délais estimés. La priorité haute augmente le total de +30%.",

    i4Title: "Coordination finale",
    i4Body:
      "À la fin, vous recevez un résumé et coordonnez via WhatsApp sans confusion.",

    ctaTitle: "Démarrer votre demande ici (Démo)",
    ctaBody:
      'Cliquez sur <strong>« Conseiller IA »</strong> et complétez le processus en une seule conversation.',
    ctaButton: "Conseiller IA",
    ctaNote: "*Appuyez sur le bouton et commencez votre demande",
  },

  pt: {
    title: "Vantagens do serviço",

    i1Title: "Processo por etapas",
    i1Body:
      "Acompanhe o avanço com um fluxo claro: recepção → validação → documentação → resultado.",

    i2Title: "Código de acompanhamento",
    i2Body:
      "Com seu código você pode ver o status e entender o que falta em cada etapa.",

    i3Title: "Prioridade e prazos",
    i3Body:
      "Prioridade média ou alta com prazos estimados. A alta aumenta o total em +30%.",

    i4Title: "Coordenação final",
    i4Body:
      "Ao final, você recebe um resumo e coordena via WhatsApp sem confusão.",

    ctaTitle: "Inicie sua solicitação aqui (Demo)",
    ctaBody:
      'Clique em <strong>“Assistente IA”</strong> e conclua o processo em uma única conversa.',
    ctaButton: "Assistente IA",
    ctaNote: "*Pressione o botão e inicie sua solicitação",
  },

  de: {
    title: "Vorteile des Services",

    i1Title: "Ablauf in Phasen",
    i1Body:
      "Du siehst den Fortschritt in einem klaren Ablauf: Eingang → Validierung → Dokumentation → Ergebnis.",

    i2Title: "Tracking-Code",
    i2Body:
      "Mit deinem Code kannst du den Status prüfen und sehen, was pro Phase fehlt.",

    i3Title: "Priorität & Zeiten",
    i3Body:
      "Mittlere oder hohe Priorität mit geschätzten Zeiten. Hoch erhöht den Gesamtbetrag um +30%.",

    i4Title: "Abschlusskoordination",
    i4Body:
      "Zum Schluss erhältst du eine Zusammenfassung und koordinierst per WhatsApp ohne Verwirrung.",

    ctaTitle: "Hier Anfrage starten (Demo)",
    ctaBody:
      'Klicke auf <strong>„KI-Berater“</strong> und schließe den Prozess in einem Gespräch ab.',
    ctaButton: "KI-Berater",
    ctaNote: "*Drücken Sie den Knopf und starten Sie Ihre Anfrage",
  },

  it: {
    title: "Vantaggi del servizio",

    i1Title: "Processo a fasi",
    i1Body:
      "Segui l’avanzamento con un flusso chiaro: ricezione → validazione → documentazione → risultato.",

    i2Title: "Codice di tracciamento",
    i2Body:
      "Con il tuo codice puoi controllare lo stato e capire cosa manca in ogni fase.",

    i3Title: "Priorità e tempi",
    i3Body:
      "Priorità media o alta con tempi stimati. L’alta aumenta il totale del +30%.",

    i4Title: "Coordinamento finale",
    i4Body:
      "Alla fine ricevi un riepilogo e coordini via WhatsApp senza confusione.",

    ctaTitle: "Avvia la tua richiesta qui (Demo)",
    ctaBody:
      'Clicca su <strong>“Consulente IA”</strong> e completa il processo in un’unica conversazione.',
    ctaButton: "Consulente IA",
    ctaNote: "*Premi il pulsante e inizia la tua richiesta",
  },

  ar: {
    title: "مزايا الخدمة",

    i1Title: "عملية على مراحل",
    i1Body:
      "تابع التقدم عبر مسار واضح: الاستلام → التحقق → المستندات → النتيجة.",

    i2Title: "رمز تتبّع",
    i2Body:
      "باستخدام رمزك يمكنك معرفة الحالة وفهم ما ينقص في كل مرحلة.",

    i3Title: "الأولوية والوقت",
    i3Body:
      "أولوية متوسطة أو عالية مع أوقات تقديرية. العالية تزيد الإجمالي بنسبة +30%.",

    i4Title: "تنسيق نهائي",
    i4Body:
      "في النهاية تحصل على ملخص وتنسّق عبر واتساب بدون أي لبس.",

    ctaTitle: "ابدأ طلبك هنا (عرض تجريبي)",
    ctaBody:
      'انقر <strong>“مستشار ذكي”</strong> وأكمل العملية في محادثة واحدة.',
    ctaButton: "مستشار ذكي",
    ctaNote: "*اضغط على الزر وابدأ طلبك",
  },

  ru: {
    title: "Преимущества сервиса",

    i1Title: "Процесс по этапам",
    i1Body:
      "Отслеживайте прогресс по понятному сценарию: приём → проверка → документы → результат.",

    i2Title: "Код отслеживания",
    i2Body:
      "По вашему коду вы можете проверять статус и понимать, что осталось на каждом этапе.",

    i3Title: "Приоритет и сроки",
    i3Body:
      "Средний или высокий приоритет со сроками. Высокий увеличивает итог на +30%.",

    i4Title: "Финальная координация",
    i4Body:
      "В конце вы получаете резюме и согласовываете через WhatsApp без путаницы.",

    ctaTitle: "Начните заявку здесь (Демо)",
    ctaBody:
      'Нажмите <strong>«ИИ-консультант»</strong> и завершите процесс в одном разговоре.',
    ctaButton: "ИИ-консультант",
    ctaNote: "*Нажмите кнопку и начните подачу заявки",
  },
};

export const IndicatorsSection: React.FC = () => {
  const { locale, isRTL } = useContext(I18nContext);
  const copy = useMemo(
    () => INDICATORS_COPY[locale] || INDICATORS_COPY.es,
    [locale]
  );

  const openChat = () => {
    const ev = new CustomEvent("open-chatbot");
    window.dispatchEvent(ev);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <section
      id="indicadores"
      className="section"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      <h2>{copy.title}</h2>

      <div className="faq-grid">
        <div>
          <h4>{copy.i1Title}</h4>
          <p>{copy.i1Body}</p>
        </div>

        <div>
          <h4>{copy.i2Title}</h4>
          <p>{copy.i2Body}</p>
        </div>

        <div>
          <h4>{copy.i3Title}</h4>
          <p>{copy.i3Body}</p>
        </div>

        <div>
          <h4>{copy.i4Title}</h4>
          <p>{copy.i4Body}</p>
        </div>

        {/* CTA */}
        <div className="assist-cta" aria-label="Iniciar en Asesor IA">
          <div className="assist-cta-top">
            <span className="assist-cta-icon" aria-hidden="true">
              💬
            </span>
            <div>
              <h4 className="assist-cta-title">{copy.ctaTitle}</h4>
              <p
                className="assist-cta-text"
                dangerouslySetInnerHTML={{ __html: copy.ctaBody }}
              />
            </div>
          </div>

          <div className="assist-cta-actions">
            <button type="button" className="assist-cta-btn" onClick={openChat}>
              {copy.ctaButton}
            </button>
            <span className="assist-cta-note">{copy.ctaNote}</span>
          </div>
        </div>
      </div>
    </section>
  );
};