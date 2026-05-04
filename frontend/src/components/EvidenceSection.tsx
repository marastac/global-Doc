import { useEffect, useMemo, useRef, useState } from "react";

type EvidenceKey = "passport" | "green" | "visa" | "comms";

type EvidenceImage = {
  src: string; // /assets/evidence/...
  title: string; // título corto
  note?: string; // opcional
};

type EvidenceItem = {
  key: EvidenceKey;
  badge: string;
  title: string;
  cardTitle: string;
  desc: string;
  footer: string;
  imageUrl: string; // portada (public/)
  thumbClassName?: string;
  gallery: EvidenceImage[]; // ✅ NUEVO: imágenes por categoría
};

export const EvidenceSection = () => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  // Modal / Galería
  const [isOpen, setIsOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<EvidenceKey>("passport");

  // ✅ NUEVO: índice de imagen activa dentro de la categoría
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const items: EvidenceItem[] = useMemo(
    () => [
      {
        key: "passport",
        badge: "Imagen",
        title: "Pasaportes & Nacionalidad",
        cardTitle: "Pasaportes & Nacionalidad",
        desc: "Referencias visuales asociadas a identidad, documentación oficial y gestión de nacionalidad.",
        footer: "Documentación, estados de proceso y soporte visual.",
        imageUrl: "/assets/evidence/passport.jpg",
        gallery: [
          { src: "/assets/evidence/passport-1.jpg", title: "Registro — Identidad" },
          { src: "/assets/evidence/passport-2.jpg", title: "Checklist — Requisitos" },
          { src: "/assets/evidence/passport-3.jpg", title: "Validación — Datos" },
          { src: "/assets/evidence/passport-4.jpg", title: "Proceso — Seguimiento" },
          { src: "/assets/evidence/passport-5.jpg", title: "Resultado — Emisión" },
          { src: "/assets/evidence/passport-6.jpg", title: "Entrega — Confirmación" },
        ],
      },
      {
        key: "green",
        badge: "Imagen",
        title: "Residencia / Green Card",
        cardTitle: "Residencia / Green Card",
        desc: "Material visual relacionado con expedientes, estados de trámite y documentación de residencia.",
        footer: "Seguimiento, validación y control documental.",
        imageUrl: "/assets/evidence/green-card.jpg",
        gallery: [
          { src: "/assets/evidence/green-1.jpg", title: "Expediente — Recepción" },
          { src: "/assets/evidence/green-2.jpg", title: "Validación — Checklist" },
          { src: "/assets/evidence/green-3.jpg", title: "Documentación — Adjuntos" },
          { src: "/assets/evidence/green-4.jpg", title: "Proceso — Estado" },
          { src: "/assets/evidence/green-5.jpg", title: "Resultado — Notificación" },
          { src: "/assets/evidence/green-6.jpg", title: "Cierre — Resumen" },
        ],
      },
      {
        key: "visa",
        badge: "Imagen",
        title: "Visas",
        cardTitle: "Visas",
        desc: "Evidencia visual de procesos consulares, estados de solicitud y documentación asociada.",
        footer: "Preparación, revisión y comunicación de resultados.",
        imageUrl: "/assets/evidence/visa.jpg",
        gallery: [
          { src: "/assets/evidence/visa-1.jpg", title: "Solicitud — Registro" },
          { src: "/assets/evidence/visa-2.jpg", title: "Validación — Formato" },
          { src: "/assets/evidence/visa-3.jpg", title: "Revisión — Documentos" },
          { src: "/assets/evidence/visa-4.jpg", title: "Proceso — Observaciones" },
          { src: "/assets/evidence/visa-5.jpg", title: "Resultado — Estado" },
          { src: "/assets/evidence/visa-6.jpg", title: "Entrega — Confirmación" },
        ],
      },
      {
        key: "comms",
        badge: "Capturas",
        title: "Comunicaciones & Entregas",
        cardTitle: "Comunicaciones & Entregas",
        desc: "Registros visuales de coordinación, comprobantes y entregas documentarias.",
        footer: "Gestión operativa y trazabilidad.",
        imageUrl: "/assets/evidence/comms.jpg",
        thumbClassName: "chat",
        gallery: [
          { src: "/assets/evidence/comms-1.jpg", title: "WhatsApp — Coordinación" },
          { src: "/assets/evidence/comms-2.jpg", title: "Confirmación — Datos" },
          { src: "/assets/evidence/comms-3.jpg", title: "Seguimiento — Código" },
          { src: "/assets/evidence/comms-4.jpg", title: "Entrega — Evidencia" },
          { src: "/assets/evidence/comms-5.jpg", title: "Cierre — Resumen" },
          { src: "/assets/evidence/comms-6.jpg", title: "Recepción — Registro" },
        ],
      },
    ],
    []
  );

  const active = useMemo(
    () => items.find((x) => x.key === activeKey) || items[0],
    [activeKey, items]
  );

  // ✅ Imagen activa (fallback a portada si no hay gallery)
  const activeImages = active.gallery?.length
    ? active.gallery
    : [{ src: active.imageUrl, title: active.cardTitle }];

  const safeIndex = Math.max(0, Math.min(activeImgIndex, activeImages.length - 1));
  const bigImage = activeImages[safeIndex];

  const openGallery = (key?: EvidenceKey) => {
    if (key) setActiveKey(key);
    setActiveImgIndex(0);
    setIsOpen(true);
  };

  const closeGallery = () => setIsOpen(false);

  const scrollByCard = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;

    const firstCard = el.querySelector<HTMLElement>(".evidence-card");
    const cardWidth = firstCard?.offsetWidth || 340;
    const gap = 18;
    const amount = cardWidth + gap;

    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  // ✅ Navegación dentro de la galería
  const prevImg = () => {
    setActiveImgIndex((i) => (i - 1 + activeImages.length) % activeImages.length);
  };
  const nextImg = () => {
    setActiveImgIndex((i) => (i + 1) % activeImages.length);
  };

  // ✅ Teclas: ESC cierra, flechas navegan
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeGallery();
      if (e.key === "ArrowLeft") prevImg();
      if (e.key === "ArrowRight") nextImg();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeKey, activeImages.length]);

  // ✅ Si cambias de categoría dentro del modal, reinicia índice
  useEffect(() => {
    setActiveImgIndex(0);
  }, [activeKey]);

  return (
    <section id="evidencia" className="section">
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ marginBottom: 8 }}>Casos Documentados & Evidencia Visual</h2>
          <p className="muted" style={{ marginBottom: 0 }}>
            Galería visual organizada por tipo de trámite, con referencias documentarias y
            comunicaciones de coordinación.
          </p>
        </div>

        <button
          type="button"
          className="btn-outline"
          onClick={() => openGallery()}
          style={{ whiteSpace: "nowrap" }}
          aria-label="Ver evidencias"
        >
          Ver evidencias
        </button>
      </div>

      <div style={{ position: "relative", marginTop: 16 }}>
        <button
          type="button"
          aria-label="Desplazar evidencias a la izquierda"
          onClick={() => scrollByCard("left")}
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
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
          }}
        >
          ‹
        </button>

        <button
          type="button"
          aria-label="Desplazar evidencias a la derecha"
          onClick={() => scrollByCard("right")}
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
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
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
            background: "linear-gradient(90deg, rgba(10,10,10,0.85), rgba(10,10,10,0))",
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
            background: "linear-gradient(270deg, rgba(10,10,10,0.85), rgba(10,10,10,0))",
            borderRadius: 16,
          }}
        />

        <div
          ref={scrollerRef}
          className="evidence-grid"
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
          {items.map((it) => (
            <div key={it.key} className="evidence-card">
              <div className={`evidence-thumb ${it.thumbClassName || ""}`.trim()}>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    overflow: "hidden",
                    borderRadius: "inherit",
                  }}
                >
                  <img
                    src={it.imageUrl}
                    alt={`Portada evidencia ${it.cardTitle}`}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "block",
                      objectFit: "cover",
                      objectPosition: "center",
                      transform: "scale(1.02)",
                      opacity: 0.88,
                      mixBlendMode: "soft-light",
                      filter: "saturate(1.1)",
                    }}
                  />
                </div>

                <div className="thumb-overlay">
                  <span className="media-badge">{it.badge}</span>
                  <span className="thumb-title">{it.title}</span>
                </div>
              </div>

              <div className="evidence-meta">
                <h3>{it.cardTitle}</h3>
                <p>{it.desc}</p>
                <p className="evidence-footer">{it.footer}</p>

                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => openGallery(it.key)}
                  aria-label={`Ver evidencias de ${it.cardTitle}`}
                >
                  Ver evidencias
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal / Galería */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Galería de evidencias"
          onClick={closeGallery}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.62)",
            backdropFilter: "blur(10px)",
            display: "grid",
            placeItems: "center",
            padding: 16,
          }}
        >
          {/* ✅ FIX RESPONSIVE (solo para el modal, sin tocar tu CSS global) */}
          <style>{`
            .evid-modal-card{
              width:min(1040px, 100%);
              max-height:calc(100dvh - 32px);
              display:flex;
              flex-direction:column;
              overflow:hidden;
            }
            .evid-modal-body{
              overflow:auto;
              -webkit-overflow-scrolling:touch;
              padding:14px;
              padding-bottom:max(14px, env(safe-area-inset-bottom));
            }
            .evid-modal-grid{
              display:grid;
              grid-template-columns: 1.35fr 0.65fr;
              gap:14px;
            }

            @media (max-width: 900px){
              .evid-modal-grid{
                grid-template-columns: 1fr;
              }
              .evid-right{
                order:2;
              }
              .evid-left{
                order:1;
              }
            }

            @media (max-width: 640px){
              .evid-modal-body{
                padding:12px;
              }
              .evid-big{
                min-height: 240px !important;
                height: auto !important;
              }
              .evid-thumbs{
                grid-template-columns: repeat(2, 1fr) !important;
              }
              .evid-cat-btn{
                grid-template-columns: 52px 1fr !important;
              }
            }
          `}</style>

          <div
            onClick={(e) => e.stopPropagation()}
            className="evid-modal-card"
            style={{
              borderRadius: 18,
              border: "1px solid rgba(255,255,255,0.16)",
              background: "rgba(10,10,10,0.78)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.65)",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "14px 14px 12px",
                borderBottom: "1px solid rgba(255,255,255,0.10)",
                flex: "0 0 auto",
              }}
            >
              <div style={{ display: "grid", gap: 2 }}>
                <div style={{ fontWeight: 900, letterSpacing: 0.2 }}>Evidencias</div>
                <div style={{ opacity: 0.8, fontSize: 13 }}>
                  {active.cardTitle} · {safeIndex + 1}/{activeImages.length}
                </div>
              </div>

              <button
                type="button"
                onClick={closeGallery}
                aria-label="Cerrar evidencias"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.16)",
                  background: "rgba(255,255,255,0.06)",
                  color: "white",
                  cursor: "pointer",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 18,
                }}
              >
                ✕
              </button>
            </div>

            {/* ✅ cuerpo con scroll interno */}
            <div className="evid-modal-body">
              <div className="evid-modal-grid">
                {/* Vista grande + navegación */}
                <div
                  className="evid-left"
                  style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.04)",
                    minHeight: 340,
                    position: "relative",
                  }}
                >
                  <button
                    type="button"
                    onClick={prevImg}
                    aria-label="Imagen anterior"
                    style={{
                      position: "absolute",
                      left: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 2,
                      width: 44,
                      height: 44,
                      borderRadius: 999,
                      border: "1px solid rgba(255,255,255,0.18)",
                      background: "rgba(10,10,10,0.35)",
                      color: "white",
                      backdropFilter: "blur(8px)",
                      cursor: "pointer",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 22,
                    }}
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    onClick={nextImg}
                    aria-label="Siguiente imagen"
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 2,
                      width: 44,
                      height: 44,
                      borderRadius: 999,
                      border: "1px solid rgba(255,255,255,0.18)",
                      background: "rgba(10,10,10,0.35)",
                      color: "white",
                      backdropFilter: "blur(8px)",
                      cursor: "pointer",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 22,
                    }}
                  >
                    ›
                  </button>

                  <img
                    className="evid-big"
                    src={bigImage.src}
                    alt={bigImage.title}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: 340,
                      display: "block",
                      objectFit: "contain",
                      objectPosition: "center",
                      background: "rgba(2,6,23,0.65)",
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      padding: "10px 12px",
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.10))",
                    }}
                  >
                    <div style={{ fontWeight: 900 }}>{bigImage.title}</div>
                    {bigImage.note ? (
                      <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>
                        {bigImage.note}
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Panel derecho */}
                <div className="evid-right" style={{ display: "grid", gap: 10 }}>
                  {/* Detalle */}
                  <div
                    style={{
                      border: "1px solid rgba(255,255,255,0.10)",
                      borderRadius: 16,
                      background: "rgba(255,255,255,0.04)",
                      padding: 12,
                    }}
                  >
                    <div style={{ fontWeight: 800, marginBottom: 6 }}>Detalle</div>
                    <div style={{ opacity: 0.86, fontSize: 13, lineHeight: 1.45 }}>
                      {active.desc}
                    </div>
                  </div>

                  {/* Miniaturas */}
                  <div
                    style={{
                      border: "1px solid rgba(255,255,255,0.10)",
                      borderRadius: 16,
                      background: "rgba(255,255,255,0.04)",
                      padding: 12,
                    }}
                  >
                    <div style={{ fontWeight: 800, marginBottom: 10 }}>Imágenes</div>

                    <div
                      className="evid-thumbs"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 10,
                      }}
                    >
                      {activeImages.map((img, idx) => {
                        const selected = idx === safeIndex;
                        return (
                          <button
                            key={img.src + idx}
                            type="button"
                            onClick={() => setActiveImgIndex(idx)}
                            aria-label={`Ver ${img.title}`}
                            title={img.title}
                            style={{
                              borderRadius: 14,
                              border: selected
                                ? "1px solid rgba(56,189,248,0.85)"
                                : "1px solid rgba(255,255,255,0.12)",
                              background: selected
                                ? "rgba(56,189,248,0.10)"
                                : "rgba(255,255,255,0.03)",
                              padding: 6,
                              cursor: "pointer",
                            }}
                          >
                            <div
                              style={{
                                width: "100%",
                                aspectRatio: "16/10",
                                borderRadius: 10,
                                overflow: "hidden",
                                border: "1px solid rgba(255,255,255,0.10)",
                                background: "rgba(255,255,255,0.03)",
                              }}
                            >
                              <img
                                src={img.src}
                                alt={img.title}
                                loading="lazy"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  display: "block",
                                  objectFit: "cover",
                                  objectPosition: "center",
                                }}
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div style={{ fontSize: 12, opacity: 0.75, marginTop: 10 }}>
                      Tip: usa <strong>←</strong> / <strong>→</strong> para navegar y{" "}
                      <strong>ESC</strong> para cerrar.
                    </div>
                  </div>

                  {/* Categorías */}
                  <div
                    style={{
                      border: "1px solid rgba(255,255,255,0.10)",
                      borderRadius: 16,
                      background: "rgba(255,255,255,0.04)",
                      padding: 12,
                    }}
                  >
                    <div style={{ fontWeight: 800, marginBottom: 10 }}>Categorías</div>

                    <div style={{ display: "grid", gap: 10 }}>
                      {items.map((it) => {
                        const selected = it.key === active.key;
                        return (
                          <button
                            key={it.key}
                            type="button"
                            onClick={() => setActiveKey(it.key)}
                            className="evid-cat-btn"
                            style={{
                              textAlign: "left",
                              display: "grid",
                              gridTemplateColumns: "52px 1fr",
                              gap: 10,
                              alignItems: "center",
                              borderRadius: 14,
                              padding: 10,
                              border: selected
                                ? "1px solid rgba(56,189,248,0.75)"
                                : "1px solid rgba(255,255,255,0.10)",
                              background: selected
                                ? "rgba(56,189,248,0.10)"
                                : "rgba(255,255,255,0.03)",
                              color: "white",
                              cursor: "pointer",
                            }}
                            aria-label={`Abrir ${it.cardTitle}`}
                          >
                            <div
                              style={{
                                width: 52,
                                height: 38,
                                borderRadius: 10,
                                overflow: "hidden",
                                border: "1px solid rgba(255,255,255,0.10)",
                                background: "rgba(255,255,255,0.03)",
                              }}
                            >
                              <img
                                src={it.imageUrl}
                                alt={it.cardTitle}
                                loading="lazy"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  display: "block",
                                  objectFit: "cover",
                                  objectPosition: "center",
                                }}
                              />
                            </div>

                            <div style={{ display: "grid", gap: 2 }}>
                              <div style={{ fontWeight: 800, fontSize: 13 }}>
                                {it.cardTitle}
                              </div>
                              <div style={{ opacity: 0.75, fontSize: 12 }}>{it.footer}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button type="button" className="btn-outline" onClick={closeGallery}>
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: 0 }} />
          </div>
        </div>
      )}
    </section>
  );
};