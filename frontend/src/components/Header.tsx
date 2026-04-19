import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  I18nContext,
  type Locale,
  detectLocale,
  localeLabel,
  markLocalePromptDismissed,
  wasLocalePromptDismissed,
} from "../i18n";

export const Header: React.FC = () => {
  // ✅ Fuente única: App.tsx (I18nContext)
  const { locale, setLocale, t, isRTL } = useContext(I18nContext);

  // Prompt UI
  const [showPrompt, setShowPrompt] = useState(false);
  const [suggested, setSuggested] = useState<Locale>("es");

  // ✅ Prompt automático 1 vez
  useEffect(() => {
    const detected = detectLocale();
    setSuggested(detected);

    if (wasLocalePromptDismissed()) return;
    if (detected !== "es" && detected !== locale) setShowPrompt(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const acceptSuggested = () => {
    setLocale(suggested);
    markLocalePromptDismissed();
    setShowPrompt(false);
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    markLocalePromptDismissed();
  };

  const onChangeLocale = (loc: Locale) => {
    setLocale(loc);
    markLocalePromptDismissed();
    setShowPrompt(false);
  };

  // ✅ Opcional: lista de idiomas (memo)
  const options = useMemo(
    () => [
      { v: "es" as const, label: "ES · Español" },
      { v: "en" as const, label: "EN · English" },
      { v: "fr" as const, label: "FR · Français" },
      { v: "pt" as const, label: "PT · Português" },
      { v: "de" as const, label: "DE · Deutsch" },
      { v: "it" as const, label: "IT · Italiano" },
      { v: "ar" as const, label: "AR · العربية" },
      { v: "ru" as const, label: "RU · Русский" },
    ],
    []
  );

  return (
    <>
      {/* Prompt tipo “¿traducir?” */}
      {showPrompt && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Sugerencia de idioma"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            background: "rgba(2,6,23,0.55)",
            backdropFilter: "blur(8px)",
            display: "grid",
            placeItems: "start center",
            padding: "18px 14px",
          }}
          onClick={dismissPrompt}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(560px, 100%)",
              borderRadius: 18,
              border: "1px solid rgba(148,163,184,0.28)",
              background: "rgba(15,23,42,0.92)",
              boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
              padding: 14,
              direction: isRTL ? "rtl" : "ltr",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 900, color: "#e5e7eb", fontSize: 15 }}>
                  {t("prompt.title")}
                </div>
                <div
                  style={{
                    color: "rgba(226,232,240,0.78)",
                    fontSize: 13,
                    marginTop: 6,
                    lineHeight: 1.35,
                  }}
                >
                  {t("prompt.body")} <strong>{localeLabel(suggested)}</strong>?
                </div>
              </div>

              <button
                type="button"
                onClick={dismissPrompt}
                aria-label="Cerrar"
                title="Cerrar"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 14,
                  border: "1px solid rgba(148,163,184,0.28)",
                  background: "rgba(2,6,23,0.35)",
                  color: "#e5e7eb",
                  cursor: "pointer",
                  fontWeight: 900,
                }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
                flexWrap: "wrap",
                marginTop: 12,
              }}
            >
              <button
                type="button"
                onClick={dismissPrompt}
                style={{
                  padding: "9px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(148,163,184,0.55)",
                  background: "transparent",
                  color: "#e5e7eb",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {t("prompt.no")}
              </button>

              <button
                type="button"
                onClick={acceptSuggested}
                style={{
                  padding: "9px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(56,189,248,0.45)",
                  background: "rgba(56,189,248,0.16)",
                  color: "#e5e7eb",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                {t("prompt.yes")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="main-header" style={{ direction: isRTL ? "rtl" : "ltr" }}>
        <div className="logo-area">
          <img
            src="/assets/logo-cubo.png"
            alt="Logo Global Doc Express"
            className="logo-cubo"
          />

          <div className="logo-text">
            <span className="brand">Global Doc Express</span>
            <span className="tagline">{t("brand.tagline")}</span>
          </div>
        </div>

        <nav className="nav">
          <a href="#servicios">{t("nav.services")}</a>
          <a href="#flujo">{t("nav.flow")}</a>
          <a href="#casos">{t("nav.cases")}</a>
          <a href="#indicadores">{t("nav.indicators")}</a>

          {/* Selector de idioma */}
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginLeft: 6,
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: "rgba(156,163,175,0.9)",
                fontWeight: 800,
              }}
            >
              🌐 {t("lang.label")}
            </span>

            <select
              value={locale}
              onChange={(e) => onChangeLocale(e.target.value as Locale)}
              aria-label="Seleccionar idioma"
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                border: "1px solid rgba(148,163,184,0.45)",
                background: "rgba(2,6,23,0.35)",
                color: "#e5e7eb",
                fontWeight: 800,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              {options.map((o) => (
                <option key={o.v} value={o.v}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </nav>
      </header>
    </>
  );
};