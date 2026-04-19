import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { I18nContext, type Locale } from "../i18n";

type RecordItem = {
  simId: string;
  service: string;
  timestamp: string;
  result: string; // "success" | "failed" | "pending"
};

type Stats = {
  total: number;
  byService: Record<string, number>;
  last10: RecordItem[];
};

const API = "http://localhost:3000/api/stats";

/**
 * Ajuste de “realismo”:
 * - Contador base (pantalla) inicia en 890
 * - Generación simulada con intervalos tipo: 1m / 5m / 15m / 1h / 5h (aleatorio)
 * - Mantiene: polling para capturar registros reales (last10) + tabla de últimos 10
 *
 * Nota: esto NO cambia tu backend; solo controla la velocidad y el baseline visual del panel.
 */
const DISPLAY_BASE_TOTAL = 890;
const DISPLAY_BASE_BY_SERVICE: Record<string, number> = {
  visa: 312,
  green_card: 244,
  pasaporte_eu: 168,
  passport_nationality: 104,
  licencia: 62,
};

/** Etiquetas consistentes con tu backend/server.js */
const serviceLabel = (s: string) => {
  switch (s) {
    case "visa":
      return "Visa Americana Elite";
    case "green_card":
      return "Residencia / Green Card";
    case "pasaporte_eu":
      return "Pasaporte Europeo Express";
    case "passport_nationality":
      return "Pasaportes & Nacionalidad";
    case "licencia":
      return "Licencia Internacional Multipaís";
    default:
      return s;
  }
};

const serviceKeys = [
  "visa",
  "green_card",
  "pasaporte_eu",
  "passport_nationality",
  "licencia",
] as const;

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pick = <T,>(arr: readonly T[]) => arr[randInt(0, arr.length - 1)];

const nowISO = () => new Date().toISOString();

const makeSimId = () => {
  // estilo SIM-XXXXXX consistente y “humano”
  const n = randInt(100000, 999999);
  return `SIM-${n}`;
};

const weightedResult = () => {
  // más realista: mayoría success, algunos pending, pocos failed
  const roll = Math.random();
  if (roll < 0.74) return "success";
  if (roll < 0.86) return "pending";
  return "failed";
};

const weightedPickDelayMs = () => {
  // Intervalos reales solicitados (con pesos + jitter)
  // 1m / 5m / 15m / 1h / 5h
  const roll = Math.random();

  // Pesos: más probable 1m–5m, a veces 15m, rara vez 1h, muy rara 5h
  let baseMs = 60_000;
  if (roll < 0.52) baseMs = 60_000; // 1 min
  else if (roll < 0.78) baseMs = 5 * 60_000; // 5 min
  else if (roll < 0.93) baseMs = 15 * 60_000; // 15 min
  else if (roll < 0.99) baseMs = 60 * 60_000; // 1 h
  else baseMs = 5 * 60 * 60_000; // 5 h

  // Jitter ±18% para que no sea “robot”
  const jitter = 1 + (Math.random() * 0.36 - 0.18);
  const ms = Math.max(45_000, Math.floor(baseMs * jitter));

  // Opcional (solo pruebas): time-scale por localStorage
  // Ejemplo: localStorage.setItem("docsim.stats.timeScale","0.1")
  let safeScale = 1;
  try {
    const raw = localStorage.getItem("docsim.stats.timeScale");
    if (raw) {
      const n = Number(raw);
      if (Number.isFinite(n) && n > 0) safeScale = n;
    }
  } catch {
    // ignore
  }

  return Math.floor(ms * safeScale);
};

type StatsDict = {
  title: string;
  lead: string;

  errorPrefix: string;
  loading: string;

  kpi1Label: string;
  kpi1Sub: string;

  kpi2Label: string;
  kpi2Empty: string;
  kpi2Sub: string;

  kpi3Label: string;
  kpi3Sub: string;

  last10Title: string;

  thId: string;
  thService: string;
  thDate: string;
  thStatus: string;

  sApproved: string;
  sReview: string;
  sObserved: string;

  footnote: string;
};

const STATS_COPY: Record<Locale, StatsDict> = {
  es: {
    title: "Panel de Actividad",
    lead: "Resumen de solicitudes registradas y últimos movimientos en la plataforma.",

    errorPrefix: "Error de conexión",
    loading: "Cargando métricas…",

    kpi1Label: "Solicitudes registradas",
    kpi1Sub: "Actividad total en el entorno",

    kpi2Label: "Servicio más solicitado",
    kpi2Empty: "Sin datos aún",
    kpi2Sub: "Basado en la actividad acumulada",

    kpi3Label: "Aprobación estimada",
    kpi3Sub: "Calculada sobre los últimos 10 registros",

    last10Title: "Últimas 10 solicitudes",

    thId: "ID",
    thService: "Servicio",
    thDate: "Fecha",
    thStatus: "Estado",

    sApproved: "Aprobado",
    sReview: "En revisión",
    sObserved: "Observado",

    footnote:
      "La tabla se actualiza en tiempo real y solo conserva las últimas 10 entradas.",
  },

  en: {
    title: "Activity Dashboard",
    lead: "Summary of registered requests and latest activity on the platform.",

    errorPrefix: "Connection error",
    loading: "Loading metrics…",

    kpi1Label: "Registered requests",
    kpi1Sub: "Total activity in this environment",

    kpi2Label: "Most requested service",
    kpi2Empty: "No data yet",
    kpi2Sub: "Based on accumulated activity",

    kpi3Label: "Estimated approval",
    kpi3Sub: "Calculated from the last 10 records",

    last10Title: "Last 10 requests",

    thId: "ID",
    thService: "Service",
    thDate: "Date",
    thStatus: "Status",

    sApproved: "Approved",
    sReview: "Under review",
    sObserved: "Flagged",

    footnote:
      "The table updates in real time and keeps only the last 10 entries.",
  },

  fr: {
    title: "Tableau d’activité",
    lead: "Résumé des demandes enregistrées et des derniers mouvements sur la plateforme.",

    errorPrefix: "Erreur de connexion",
    loading: "Chargement des métriques…",

    kpi1Label: "Demandes enregistrées",
    kpi1Sub: "Activité totale dans l’environnement",

    kpi2Label: "Service le plus demandé",
    kpi2Empty: "Pas encore de données",
    kpi2Sub: "Basé sur l’activité cumulée",

    kpi3Label: "Approbation estimée",
    kpi3Sub: "Calculée sur les 10 derniers enregistrements",

    last10Title: "Les 10 dernières demandes",

    thId: "ID",
    thService: "Service",
    thDate: "Date",
    thStatus: "Statut",

    sApproved: "Approuvé",
    sReview: "En cours",
    sObserved: "Observé",

    footnote:
      "Le tableau se met à jour en temps réel et ne conserve que les 10 dernières entrées.",
  },

  pt: {
    title: "Painel de atividade",
    lead: "Resumo das solicitações registradas e das últimas atividades na plataforma.",

    errorPrefix: "Erro de conexão",
    loading: "Carregando métricas…",

    kpi1Label: "Solicitações registradas",
    kpi1Sub: "Atividade total no ambiente",

    kpi2Label: "Serviço mais solicitado",
    kpi2Empty: "Sem dados ainda",
    kpi2Sub: "Com base na atividade acumulada",

    kpi3Label: "Aprovação estimada",
    kpi3Sub: "Calculada sobre os últimos 10 registros",

    last10Title: "Últimas 10 solicitações",

    thId: "ID",
    thService: "Serviço",
    thDate: "Data",
    thStatus: "Status",

    sApproved: "Aprovado",
    sReview: "Em análise",
    sObserved: "Observado",

    footnote:
      "A tabela atualiza em tempo real e mantém apenas as últimas 10 entradas.",
  },

  de: {
    title: "Aktivitätsübersicht",
    lead: "Übersicht über registrierte Anfragen und die neuesten Aktivitäten auf der Plattform.",

    errorPrefix: "Verbindungsfehler",
    loading: "Metriken werden geladen…",

    kpi1Label: "Registrierte Anfragen",
    kpi1Sub: "Gesamtaktivität in dieser Umgebung",

    kpi2Label: "Meistgefragter Service",
    kpi2Empty: "Noch keine Daten",
    kpi2Sub: "Basierend auf kumulierter Aktivität",

    kpi3Label: "Geschätzte Genehmigung",
    kpi3Sub: "Berechnet aus den letzten 10 Einträgen",

    last10Title: "Letzte 10 Anfragen",

    thId: "ID",
    thService: "Service",
    thDate: "Datum",
    thStatus: "Status",

    sApproved: "Genehmigt",
    sReview: "In Prüfung",
    sObserved: "Beanstandet",

    footnote:
      "Die Tabelle aktualisiert sich in Echtzeit und zeigt nur die letzten 10 Einträge.",
  },

  it: {
    title: "Pannello attività",
    lead: "Riepilogo delle richieste registrate e delle ultime attività sulla piattaforma.",

    errorPrefix: "Errore di connessione",
    loading: "Caricamento metriche…",

    kpi1Label: "Richieste registrate",
    kpi1Sub: "Attività totale nell’ambiente",

    kpi2Label: "Servizio più richiesto",
    kpi2Empty: "Nessun dato ancora",
    kpi2Sub: "Basato sull’attività accumulata",

    kpi3Label: "Approvazione stimata",
    kpi3Sub: "Calcolata sugli ultimi 10 record",

    last10Title: "Ultime 10 richieste",

    thId: "ID",
    thService: "Servizio",
    thDate: "Data",
    thStatus: "Stato",

    sApproved: "Approvato",
    sReview: "In revisione",
    sObserved: "Segnalato",

    footnote:
      "La tabella si aggiorna in tempo reale e conserva solo le ultime 10 voci.",
  },

  ar: {
    title: "لوحة النشاط",
    lead: "ملخص للطلبات المسجلة وآخر النشاطات على المنصة.",

    errorPrefix: "خطأ في الاتصال",
    loading: "جارٍ تحميل المؤشرات…",

    kpi1Label: "الطلبات المسجّلة",
    kpi1Sub: "إجمالي النشاط في هذا النظام",

    kpi2Label: "الخدمة الأكثر طلبًا",
    kpi2Empty: "لا توجد بيانات بعد",
    kpi2Sub: "بناءً على النشاط المتراكم",

    kpi3Label: "نسبة الموافقة التقديرية",
    kpi3Sub: "محسوبة من آخر 10 سجلات",

    last10Title: "آخر 10 طلبات",

    thId: "المعرّف",
    thService: "الخدمة",
    thDate: "التاريخ",
    thStatus: "الحالة",

    sApproved: "مقبول",
    sReview: "قيد المراجعة",
    sObserved: "ملاحظ",

    footnote:
      "يتم تحديث الجدول في الوقت الحقيقي ويحتفظ فقط بآخر 10 إدخالات.",
  },

  ru: {
    title: "Панель активности",
    lead: "Сводка зарегистрированных заявок и последних действий на платформе.",

    errorPrefix: "Ошибка подключения",
    loading: "Загрузка метрик…",

    kpi1Label: "Зарегистрированные заявки",
    kpi1Sub: "Общая активность в этой среде",

    kpi2Label: "Самая популярная услуга",
    kpi2Empty: "Пока нет данных",
    kpi2Sub: "На основе накопленной активности",

    kpi3Label: "Оценка одобрения",
    kpi3Sub: "Рассчитано по последним 10 записям",

    last10Title: "Последние 10 заявок",

    thId: "ID",
    thService: "Услуга",
    thDate: "Дата",
    thStatus: "Статус",

    sApproved: "Одобрено",
    sReview: "На проверке",
    sObserved: "Замечено",

    footnote:
      "Таблица обновляется в реальном времени и хранит только последние 10 записей.",
  },
};

export const StatsPanel = () => {
  const { locale, isRTL } = useContext(I18nContext);
  const copy = useMemo(() => STATS_COPY[locale] || STATS_COPY.es, [locale]);

  const [statsBase, setStatsBase] = useState<Stats | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Actividad render (últimas 10)
  const [activity, setActivity] = useState<RecordItem[]>([]);

  // KPIs vivos (simulación visual controlada)
  const [totalLive, setTotalLive] = useState<number>(0);
  const [byServiceLive, setByServiceLive] = useState<Record<string, number>>({});

  // Para evitar duplicados
  const seenIdsRef = useRef<Set<string>>(new Set());

  // Timers
  const fakeTimerRef = useRef<number | null>(null);
  const pollTimerRef = useRef<number | null>(null);

  const pushRecord = (rec: RecordItem) => {
    if (!rec?.simId) return;
    if (seenIdsRef.current.has(rec.simId)) return;

    seenIdsRef.current.add(rec.simId);

    // últimas 10 (más nuevo arriba)
    setActivity((prev) => [rec, ...prev].slice(0, 10));

    // KPIs vivos
    setTotalLive((t) => t + 1);
    setByServiceLive((map) => ({
      ...map,
      [rec.service]: (map[rec.service] || 0) + 1,
    }));
  };

  // 1) Cargar base desde API
  useEffect(() => {
    const ctrl = new AbortController();

    fetch(API, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((data: Stats) => {
        setStatsBase(data);
        setErr(null);

        // ✅ Baseline solicitado (no usa el total del backend para evitar “8 mil”)
        setTotalLive(DISPLAY_BASE_TOTAL);
        setByServiceLive(DISPLAY_BASE_BY_SERVICE);

        // Actividad base (API ya viene last10 en reverse() en tu backend)
        const initial = Array.isArray(data?.last10) ? data.last10 : [];
        initial.forEach((r) => {
          if (r?.simId) seenIdsRef.current.add(r.simId);
        });
        setActivity(initial.slice(0, 10));
      })
      .catch((e) => {
        if (e?.name === "AbortError") return;
        setErr(e?.message || "Error");
      });

    return () => ctrl.abort();
  }, []);

  // 2) Polling para capturar registros reales
  useEffect(() => {
    if (!statsBase) return;

    const poll = () => {
      fetch(API)
        .then((r) => r.json())
        .then((data: Stats) => {
          setErr(null);
          setStatsBase(data);

          const incoming = Array.isArray(data?.last10) ? data.last10 : [];

          const sorted = [...incoming].sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );

          for (const r of sorted) {
            if (r?.simId && !seenIdsRef.current.has(r.simId)) {
              pushRecord(r);
            }
          }
        })
        .catch((e) => setErr(e?.message || "Error"));
    };

    pollTimerRef.current = window.setInterval(poll, 6500);

    return () => {
      if (pollTimerRef.current) window.clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!statsBase]);

  // 3) Generador de solicitudes aleatorias (más realista)
  useEffect(() => {
    if (!statsBase) return;

    const scheduleNext = () => {
      const ms = weightedPickDelayMs();

      fakeTimerRef.current = window.setTimeout(() => {
        const rec: RecordItem = {
          simId: makeSimId(),
          service: pick(serviceKeys),
          timestamp: nowISO(),
          result: weightedResult(),
        };

        pushRecord(rec);
        scheduleNext();
      }, ms);
    };

    scheduleNext();

    return () => {
      if (fakeTimerRef.current) window.clearTimeout(fakeTimerRef.current);
      fakeTimerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!statsBase]);

  const topService = useMemo(() => {
    const entries = Object.entries(byServiceLive || {});
    if (!entries.length) return null;
    const [key] = entries.sort((a, b) => b[1] - a[1])[0];
    return serviceLabel(key);
  }, [byServiceLive]);

  const successRate = useMemo(() => {
    if (!activity.length) return null;
    const total = activity.length;
    const ok = activity.filter((r) => r.result === "success").length;
    return Math.round((ok * 100) / total);
  }, [activity]);

  const renderState = (result: string) => {
    if (result === "success") {
      return <span className="state-pill success">{copy.sApproved}</span>;
    }
    if (result === "pending") {
      return <span className="state-pill pending">{copy.sReview}</span>;
    }
    return <span className="state-pill failed">{copy.sObserved}</span>;
  };

  return (
    <section className="section" style={{ direction: isRTL ? "rtl" : "ltr" }}>
      <h2>{copy.title}</h2>
      <p className="muted">{copy.lead}</p>

      {err && (
        <div className="result-box">
          {copy.errorPrefix}: {err}
        </div>
      )}

      {!statsBase ? (
        <div className="result-box">{copy.loading}</div>
      ) : (
        <>
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-label">{copy.kpi1Label}</div>
              <div className="kpi-value">{totalLive}</div>
              <div className="kpi-sub">{copy.kpi1Sub}</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">{copy.kpi2Label}</div>
              <div className="kpi-value">{topService || copy.kpi2Empty}</div>
              <div className="kpi-sub">{copy.kpi2Sub}</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">{copy.kpi3Label}</div>
              <div className="kpi-value">
                {successRate !== null ? `${successRate}%` : "—"}
              </div>
              <div className="kpi-sub">{copy.kpi3Sub}</div>
            </div>
          </div>

          <h3 style={{ marginTop: 18 }}>{copy.last10Title}</h3>
          <table className="table-simple">
            <thead>
              <tr>
                <th>{copy.thId}</th>
                <th>{copy.thService}</th>
                <th>{copy.thDate}</th>
                <th>{copy.thStatus}</th>
              </tr>
            </thead>

            <tbody>
              {activity.map((r) => (
                <tr key={r.simId}>
                  <td className="id-mono">{r.simId.replace("SIM-", "S-")}</td>
                  <td>{serviceLabel(r.service)}</td>
                  <td>{new Date(r.timestamp).toLocaleString()}</td>
                  <td>{renderState(r.result)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="tiny" style={{ marginTop: 10 }}>
            {copy.footnote}
          </p>
        </>
      )}
    </section>
  );
};