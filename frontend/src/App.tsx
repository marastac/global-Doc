import React, { useEffect, useMemo, useState } from "react";

import { Layout } from "./components/Layout";
import { AlertBar } from "./components/AlertBar";
import { Hero } from "./components/Hero";
import { AboutSection } from "./components/AboutSection";
import { ServicesSection } from "./components/ServicesSection";
import { GuaranteeSection } from "./components/GuaranteeSection";
import { TeamSection } from "./components/TeamSection";
import { StepsSection } from "./components/StepsSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { EvidenceSection } from "./components/EvidenceSection";
import { IndicatorsSection } from "./components/IndicatorsSection";
import { ChatBotWidget } from "./components/ChatBotWidget";
import { EvidenceMarquee } from "./components/EvidenceMarquee";
import { StatsPanel } from "./components/StatsPanel";
import { Footer } from "./components/Footer";

import {
  DICT,
  I18nContext,
  type I18nContextValue,
  type Locale,
  detectLocale,
  readSavedLocale,
  saveLocale,
} from "./i18n";

const OPERATOR_LS_KEY = "chatbot_operator_mode_v1";
const TRACKING_LS_KEY = "docsim.tracking.v1";

const OPERATOR_AUTH_SS_KEY = "docsim.operator.auth.v1";
const OPERATOR_PIN =
  (import.meta.env.VITE_OPERATOR_PIN as string | undefined)?.trim() || "0000";

const TRACKER_STAGES = [
  { title: "Recepción", desc: "Solicitud registrada." },
  { title: "Validación", desc: "Consistencia de datos verificada." },
  { title: "Documentación", desc: "Checklist y anexos consolidados." },
  { title: "Revisión", desc: "Control interno y observaciones." },
  { title: "Salida", desc: "Resultado generado." },
];

const normalizeSpaces = (s: string) => s.replace(/\s+/g, " ").trim();

const normalizeSimId = (raw: string) => {
  const s = normalizeSpaces(raw);
  if (!s) return "";
  const upper = s.toUpperCase();
  if (upper.startsWith("SIM-")) return upper;
  if (upper.startsWith("S-")) return "SIM-" + upper.slice(2);
  return upper;
};

const publicCodeFromSimId = (simId: string | null) =>
  (simId || "SIM-—").replace("SIM-", "S-");

const simIdFromPublicCode = (code: string) => {
  const c = normalizeSimId(code);
  if (!c) return null;
  if (c.startsWith("SIM-")) return c;
  return null;
};

const clampStage = (n: number) =>
  Math.max(0, Math.min(TRACKER_STAGES.length - 1, n));

const getOperatorRoute = () => {
  const path = window.location.pathname || "";
  const hash = window.location.hash || "";
  const search = window.location.search || "";

  if (path.startsWith("/operator")) return true;
  if (hash.startsWith("#/operator")) return true;
  if (search.includes("operator=1")) return true;

  return false;
};

const goHomeSmart = () => {
  if (window.location.hash.startsWith("#/operator")) {
    window.location.hash = "#/";
    return;
  }
  window.location.href = "/";
};

const OperatorLogin: React.FC<{ onAuthed: () => void }> = ({ onAuthed }) => {
  const [pin, setPin] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lock, setLock] = useState(false);

  const hint =
    OPERATOR_PIN === "0000"
      ? "Tip: configura VITE_OPERATOR_PIN en tu .env para usar una clave real."
      : "Acceso restringido para control del tracking en exposición.";

  const submit = () => {
    if (lock) return;

    const typed = (pin || "").trim();
    if (!typed) {
      setError("Ingresa la clave de operador.");
      return;
    }

    if (typed !== OPERATOR_PIN) {
      setError("Clave incorrecta.");
      setLock(true);
      window.setTimeout(() => setLock(false), 900);
      return;
    }

    try {
      sessionStorage.setItem(OPERATOR_AUTH_SS_KEY, "1");
    } catch {}

    setError(null);
    onAuthed();
  };

  return (
    <div className="operator-dashboard">
      <Layout>
        <section className="section" style={{ paddingTop: 28 }}>
          <div className="container">
            <div className="section-head" style={{ alignItems: "flex-start" }}>
              <div>
                <div className="eyebrow">Acceso Operador</div>
                <h2 className="h2" style={{ marginTop: 8 }}>
                  Panel privado
                </h2>
                <p className="sub" style={{ marginTop: 8, maxWidth: 820 }}>
                  {hint}
                </p>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  className="btn ghost"
                  type="button"
                  onClick={goHomeSmart}
                >
                  ← Volver al sitio
                </button>
              </div>
            </div>

            <div className="card" style={{ padding: 16, maxWidth: 560 }}>
              <div className="card-title">Verificación</div>
              <div className="card-sub" style={{ marginTop: 6 }}>
                Ingresa tu clave para acceder al control de tracking.
              </div>

              <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <input
                    className="input"
                    type={show ? "text" : "password"}
                    placeholder="Clave de operador"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                  />
                  <button
                    className="btn ghost"
                    type="button"
                    onClick={() => setShow((v) => !v)}
                  >
                    {show ? "Ocultar" : "Mostrar"}
                  </button>
                </div>

                {error && (
                  <div
                    style={{
                      color: "#f97373",
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    {error}
                  </div>
                )}

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    className="btn"
                    type="button"
                    onClick={submit}
                    disabled={lock}
                  >
                    🔒 Ingresar
                  </button>
                  <button
                    className="btn ghost"
                    type="button"
                    onClick={() => setPin("")}
                  >
                    Limpiar
                  </button>
                </div>

                <div className="muted" style={{ fontSize: 12 }}>
                  Ruta del panel: <strong>/operator</strong> o{" "}
                  <strong>#/operator</strong>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </div>
  );
};

const OperatorDashboard: React.FC<{ onLogout?: () => void }> = ({
  onLogout,
}) => {
  const [operatorMode, setOperatorMode] = useState(false);

  const [trackingMap, setTrackingMap] = useState<Record<string, number>>({});
  const [selectedSimId, setSelectedSimId] = useState<string | null>(null);

  const [codeInput, setCodeInput] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    try {
      setOperatorMode(localStorage.getItem(OPERATOR_LS_KEY) === "1");
    } catch {}

    try {
      const raw = localStorage.getItem(TRACKING_LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") setTrackingMap(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(TRACKING_LS_KEY, JSON.stringify(trackingMap));
    } catch {}
  }, [trackingMap]);

  const codes = useMemo(() => {
    const ids = Object.keys(trackingMap);
    const filtered = searchText.trim()
      ? ids.filter((id) =>
          publicCodeFromSimId(id)
            .toUpperCase()
            .includes(searchText.trim().toUpperCase())
        )
      : ids;
    return filtered.slice().sort().reverse();
  }, [trackingMap, searchText]);

  const selectedStage = useMemo(() => {
    if (!selectedSimId) return 0;
    const v = trackingMap[selectedSimId];
    return typeof v === "number" ? v : 0;
  }, [trackingMap, selectedSimId]);

  const progressPct = useMemo(() => {
    const total = TRACKER_STAGES.length - 1;
    if (total <= 0) return 0;
    return Math.round((selectedStage * 100) / total);
  }, [selectedStage]);

  const toggleOperatorMode = () => {
    setOperatorMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(OPERATOR_LS_KEY, next ? "1" : "0");
      } catch {}
      return next;
    });
  };

  const loadByCode = () => {
    const simId = simIdFromPublicCode(codeInput);
    if (!simId) return;

    setTrackingMap((m) => {
      if (typeof m[simId] === "number") return m;
      return { ...m, [simId]: 0 };
    });

    setSelectedSimId(simId);
  };

  const setStage = (idx: number) => {
    if (!selectedSimId) return;
    setTrackingMap((m) => ({ ...m, [selectedSimId]: clampStage(idx) }));
  };

  const logout = () => {
    try {
      sessionStorage.removeItem(OPERATOR_AUTH_SS_KEY);
    } catch {}
    onLogout?.();
  };

  return (
    <div className="operator-dashboard">
      <Layout>
        <section className="section" style={{ paddingTop: 28 }}>
          <div className="container">
            <div className="section-head" style={{ alignItems: "flex-start" }}>
              <div>
                <div className="eyebrow">Panel de Operación</div>
                <h2 className="h2" style={{ marginTop: 8 }}>
                  Control de Tracking (privado)
                </h2>
                <p className="sub" style={{ marginTop: 8, maxWidth: 820 }}>
                  Aquí puedes buscar por código y controlar etapas del tracking.
                  Este panel no aparece para usuarios normales.
                </p>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  className="btn ghost"
                  type="button"
                  onClick={goHomeSmart}
                >
                  ← Volver al sitio
                </button>
                <button className="btn ghost" type="button" onClick={logout}>
                  🚪 Cerrar sesión
                </button>
                <button
                  className={"btn " + (operatorMode ? "" : "ghost")}
                  type="button"
                  onClick={toggleOperatorMode}
                >
                  {operatorMode ? "🛡 Operador: ON" : "🛡 Operador: OFF"}
                </button>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.05fr 1.2fr",
                gap: 16,
              }}
            >
              <div className="card" style={{ padding: 16 }}>
                <div className="card-title">Solicitudes en sesión</div>
                <div className="card-sub" style={{ marginTop: 6 }}>
                  Filtra por código y selecciona para editar.
                </div>

                <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
                  <input
                    className="input"
                    placeholder="Buscar código (ej: S-AB12...)"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />

                  <div style={{ display: "flex", gap: 10 }}>
                    <input
                      className="input"
                      placeholder="Cargar por código (ej: S-1234ABCD)"
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && loadByCode()}
                    />
                    <button className="btn" type="button" onClick={loadByCode}>
                      Cargar
                    </button>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {codes.length === 0 && (
                      <div className="muted">
                        Aún no hay solicitudes en esta sesión.
                      </div>
                    )}

                    {codes.slice(0, 18).map((id) => {
                      const isActive = id === selectedSimId;
                      const stage =
                        typeof trackingMap[id] === "number" ? trackingMap[id] : 0;
                      return (
                        <button
                          key={id}
                          type="button"
                          className={"chip " + (isActive ? "active" : "")}
                          onClick={() => setSelectedSimId(id)}
                        >
                          <span
                            style={{
                              fontFamily:
                                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                            }}
                          >
                            {publicCodeFromSimId(id)}
                          </span>
                          <span style={{ opacity: 0.75, marginLeft: 8 }}>
                            {stage + 1}/{TRACKER_STAGES.length}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: 16 }}>
                <div className="card-title">Editor de etapas</div>
                <div className="card-sub" style={{ marginTop: 6 }}>
                  Selecciona una solicitud para controlar el avance.
                </div>

                {!selectedSimId ? (
                  <div className="muted" style={{ padding: 10 }}>
                    Selecciona una solicitud de la izquierda o carga por código.
                  </div>
                ) : (
                  <>
                    <div className="tracker-progress" style={{ marginTop: 14 }}>
                      <div
                        className="tracker-progress-bar"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    <div className="tracker" style={{ marginTop: 10 }}>
                      {TRACKER_STAGES.map((st, idx) => {
                        const done = idx < selectedStage;
                        const active = idx === selectedStage;

                        return (
                          <div
                            key={st.title}
                            className={
                              "tracker-row " +
                              (active ? "active" : done ? "done" : "")
                            }
                            style={{ cursor: "pointer" }}
                            onClick={() => setStage(idx)}
                          >
                            <span className="tracker-dot" aria-hidden="true" />
                            <div className="tracker-content">
                              <div className="tracker-title">
                                {idx + 1}. {st.title}
                              </div>
                              <div className="tracker-desc">{st.desc}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </div>
  );
};

const App: React.FC = () => {
  const [isOperator, setIsOperator] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  const [locale, setLocaleState] = useState<Locale>(
    () => readSavedLocale() ?? detectLocale()
  );
  const isRTL = locale === "ar";

  const t = useMemo(() => {
    const dict = DICT[locale] || DICT.es;
    return (key: string) => dict[key] ?? DICT.es[key] ?? key;
  }, [locale]);

  const setLocale = (loc: Locale) => {
    setLocaleState(loc);
    saveLocale(loc);
  };

  // ✅ Aplica lang/dir al documento
  useEffect(() => {
    try {
      document.documentElement.lang = locale;
      document.documentElement.dir = isRTL ? "rtl" : "ltr";
    } catch {}
  }, [locale, isRTL]);

  // ✅ Detecta ruta de operador
  useEffect(() => {
    const sync = () => setIsOperator(getOperatorRoute());
    sync();
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
    };
  }, []);

  // ✅ Auth panel operador (session)
  useEffect(() => {
    if (!isOperator) return;
    try {
      setIsAuthed(sessionStorage.getItem(OPERATOR_AUTH_SS_KEY) === "1");
    } catch {
      setIsAuthed(false);
    }
  }, [isOperator]);

  const i18nValue = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t, isRTL }),
    [locale, isRTL, t]
  );

  if (isOperator) {
    return (
      <I18nContext.Provider value={i18nValue}>
        <AlertBar />
        {!isAuthed ? (
          <OperatorLogin onAuthed={() => setIsAuthed(true)} />
        ) : (
          <OperatorDashboard onLogout={() => setIsAuthed(false)} />
        )}
      </I18nContext.Provider>
    );
  }

  return (
    <I18nContext.Provider value={i18nValue}>
      <AlertBar />
      <Layout>
        <Hero />
        <EvidenceMarquee />
        <EvidenceSection />
        <ServicesSection />
        <AboutSection />
        <TeamSection />
        <GuaranteeSection />
        <StepsSection />
        <TestimonialsSection />
        <IndicatorsSection />
        <StatsPanel />
        <ChatBotWidget />
        <Footer />
      </Layout>
    </I18nContext.Provider>
  );
};

export default App;