import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { I18nContext } from "../i18n";

type RecordItem = {
  simId: string;
  service: string;
  timestamp: string;
  result: "success" | "failed" | "pending";
};

type StoredRequest = {
  simId?: string;
  name?: string;
  passport?: string;
  service?: string;
  serviceLabel?: string;
  contact?: string;
  status?: string;
  createdAt?: string;
  timestamp?: string;
  country?: string;
  result?: string;
};

type StatsDict = {
  title: string;
  lead: string;
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

const STORAGE_KEY = "docsim.requests.v1";

const DISPLAY_BASE_TOTAL = 890;

const DISPLAY_BASE_BY_SERVICE: Record<string, number> = {
  visa: 312,
  green_card: 244,
  pasaporte_eu: 168,
  passport_nationality: 104,
  licencia: 62,
};

const serviceKeys = [
  "visa",
  "green_card",
  "pasaporte_eu",
  "passport_nationality",
  "licencia",
] as const;

const STATS_COPY: Record<string, StatsDict> = {
  es: {
    title: "Panel de Actividad",
    lead: "Resumen de solicitudes registradas y últimos movimientos en la plataforma.",
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
      "La tabla se actualiza en tiempo real y conserva solo las últimas 10 entradas de esta demostración.",
  },

  en: {
    title: "Activity Dashboard",
    lead: "Summary of registered requests and latest activity on the platform.",
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
      "The table updates in real time and keeps only the last 10 demo entries.",
  },
};

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
      return s || "Servicio";
  }
};

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pick = <T,>(arr: readonly T[]) => arr[randInt(0, arr.length - 1)];

const nowISO = () => new Date().toISOString();

const makeSimId = () => {
  const n = randInt(100000, 999999);
  return `SIM-${n}`;
};

const weightedResult = (): RecordItem["result"] => {
  const roll = Math.random();
  if (roll < 0.74) return "success";
  if (roll < 0.88) return "pending";
  return "failed";
};

const weightedPickDelayMs = () => {
  const roll = Math.random();

  let baseMs = 60_000;
  if (roll < 0.52) baseMs = 60_000;
  else if (roll < 0.78) baseMs = 5 * 60_000;
  else if (roll < 0.93) baseMs = 15 * 60_000;
  else if (roll < 0.99) baseMs = 60 * 60_000;
  else baseMs = 5 * 60 * 60_000;

  const jitter = 1 + (Math.random() * 0.36 - 0.18);
  const ms = Math.max(45_000, Math.floor(baseMs * jitter));

  return ms;
};

const normalizeStoredRequest = (item: StoredRequest): RecordItem | null => {
  if (!item) return null;

  const simId = item.simId || makeSimId();
  const service = item.service || "visa";
  const timestamp = item.createdAt || item.timestamp || nowISO();

  let result: RecordItem["result"] = "pending";

  if (item.result === "success" || item.status?.toLowerCase().includes("aprob")) {
    result = "success";
  } else if (
    item.result === "failed" ||
    item.status?.toLowerCase().includes("observ")
  ) {
    result = "failed";
  } else {
    result = "pending";
  }

  return {
    simId,
    service,
    timestamp,
    result,
  };
};

const makeInitialDemoActivity = (): RecordItem[] => {
  const now = Date.now();

  return [
    {
      simId: "SIM-884291",
      service: "visa",
      timestamp: new Date(now - 4 * 60_000).toISOString(),
      result: "success",
    },
    {
      simId: "SIM-773104",
      service: "green_card",
      timestamp: new Date(now - 13 * 60_000).toISOString(),
      result: "pending",
    },
    {
      simId: "SIM-665930",
      service: "pasaporte_eu",
      timestamp: new Date(now - 26 * 60_000).toISOString(),
      result: "success",
    },
    {
      simId: "SIM-548802",
      service: "passport_nationality",
      timestamp: new Date(now - 45 * 60_000).toISOString(),
      result: "pending",
    },
    {
      simId: "SIM-421775",
      service: "licencia",
      timestamp: new Date(now - 72 * 60_000).toISOString(),
      result: "failed",
    },
  ];
};

export const StatsPanel = () => {
  const { locale, isRTL } = useContext(I18nContext);
  const copy = useMemo(
    () => STATS_COPY[String(locale)] || STATS_COPY.es,
    [locale]
  );

  const [activity, setActivity] = useState<RecordItem[]>([]);
  const [totalLive, setTotalLive] = useState<number>(DISPLAY_BASE_TOTAL);
  const [byServiceLive, setByServiceLive] =
    useState<Record<string, number>>(DISPLAY_BASE_BY_SERVICE);

  const seenIdsRef = useRef<Set<string>>(new Set());
  const fakeTimerRef = useRef<number | null>(null);

  const pushRecord = (rec: RecordItem) => {
    if (!rec?.simId) return;
    if (seenIdsRef.current.has(rec.simId)) return;

    seenIdsRef.current.add(rec.simId);

    setActivity((prev) => [rec, ...prev].slice(0, 10));

    setTotalLive((t) => t + 1);

    setByServiceLive((map) => ({
      ...map,
      [rec.service]: (map[rec.service] || 0) + 1,
    }));
  };

  useEffect(() => {
    const demoActivity = makeInitialDemoActivity();

    let savedActivity: RecordItem[] = [];

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];

      if (Array.isArray(parsed)) {
        savedActivity = parsed
          .map((item) => normalizeStoredRequest(item))
          .filter(Boolean) as RecordItem[];
      }
    } catch {
      savedActivity = [];
    }

    const merged = [...savedActivity, ...demoActivity]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 10);

    merged.forEach((r) => {
      if (r.simId) seenIdsRef.current.add(r.simId);
    });

    setActivity(merged);
    setTotalLive(DISPLAY_BASE_TOTAL + savedActivity.length);

    const extraByService: Record<string, number> = { ...DISPLAY_BASE_BY_SERVICE };

    savedActivity.forEach((r) => {
      extraByService[r.service] = (extraByService[r.service] || 0) + 1;
    });

    setByServiceLive(extraByService);
  }, []);

  useEffect(() => {
    const handleRequestCreated = (event: Event) => {
      const custom = event as CustomEvent<StoredRequest>;
      const normalized = normalizeStoredRequest(custom.detail);

      if (normalized) {
        pushRecord(normalized);
      }
    };

    window.addEventListener("docsim:request-created", handleRequestCreated);

    return () => {
      window.removeEventListener("docsim:request-created", handleRequestCreated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
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
      if (fakeTimerRef.current) {
        window.clearTimeout(fakeTimerRef.current);
      }

      fakeTimerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);

      return date.toLocaleString(String(locale) === "en" ? "en-US" : "es-PE");
    } catch {
      return timestamp;
    }
  };

  return (
    <section className="section" style={{ direction: isRTL ? "rtl" : "ltr" }}>
      <h2>{copy.title}</h2>
      <p className="muted">{copy.lead}</p>

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
              <td>{formatDate(r.timestamp)}</td>
              <td>{renderState(r.result)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="tiny" style={{ marginTop: 10 }}>
        {copy.footnote}
      </p>
    </section>
  );
};