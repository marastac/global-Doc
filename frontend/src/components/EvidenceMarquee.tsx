import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { I18nContext, type Locale } from "../i18n";

type Slide = {
  id: string;
  title: string;
  img: string; // ruta en /public
};

type MarqueeDict = {
  sectionTitle: string;
  sectionSub: string;
  tag: string;
  pause: string;
  resume: string;
  ariaCarousel: string;
  // títulos por slide (6)
  slideTitles: [string, string, string, string, string, string];
};

const MARQUEE_COPY: Record<Locale, MarqueeDict> = {
  es: {
    sectionTitle: "Pruebas en Carrusel",
    sectionSub: "Vista rápida de evidencias (mezcladas) en rotación automática.",
    tag: "Evidencia",
    pause: "⏸ Pausar",
    resume: "▶️ Reanudar",
    ariaCarousel: "Carrusel automático de evidencias",
    slideTitles: [
      "Evidencia · Documento",
      "Evidencia · Checklist",
      "Evidencia · Confirmación",
      "Evidencia · Tracking",
      "Evidencia · Comunicación",
      "Evidencia · Resultado",
    ],
  },

  en: {
    sectionTitle: "Carousel Samples",
    sectionSub: "Quick preview of mixed evidence in automatic rotation.",
    tag: "Evidence",
    pause: "⏸ Pause",
    resume: "▶️ Resume",
    ariaCarousel: "Automatic evidence carousel",
    slideTitles: [
      "Evidence · Document",
      "Evidence · Checklist",
      "Evidence · Confirmation",
      "Evidence · Tracking",
      "Evidence · Communication",
      "Evidence · Result",
    ],
  },

  fr: {
    sectionTitle: "Exemples en carrousel",
    sectionSub: "Aperçu rapide des preuves (mélangées) en rotation automatique.",
    tag: "Preuve",
    pause: "⏸ Pause",
    resume: "▶️ Reprendre",
    ariaCarousel: "Carrousel automatique de preuves",
    slideTitles: [
      "Preuve · Document",
      "Preuve · Checklist",
      "Preuve · Confirmation",
      "Preuve · Suivi",
      "Preuve · Communication",
      "Preuve · Résultat",
    ],
  },

  pt: {
    sectionTitle: "Amostras em Carrossel",
    sectionSub: "Visão rápida de evidências (misturadas) em rotação automática.",
    tag: "Evidência",
    pause: "⏸ Pausar",
    resume: "▶️ Retomar",
    ariaCarousel: "Carrossel automático de evidências",
    slideTitles: [
      "Evidência · Documento",
      "Evidência · Checklist",
      "Evidência · Confirmação",
      "Evidência · Tracking",
      "Evidência · Comunicação",
      "Evidência · Resultado",
    ],
  },

  de: {
    sectionTitle: "Karussell-Beispiele",
    sectionSub: "Schnelle Vorschau gemischter Nachweise in automatischer Rotation.",
    tag: "Nachweis",
    pause: "⏸ Pausieren",
    resume: "▶️ Fortsetzen",
    ariaCarousel: "Automatisches Nachweis-Karussell",
    slideTitles: [
      "Nachweis · Dokument",
      "Nachweis · Checkliste",
      "Nachweis · Bestätigung",
      "Nachweis · Tracking",
      "Nachweis · Kommunikation",
      "Nachweis · Ergebnis",
    ],
  },

  it: {
    sectionTitle: "Esempi a carosello",
    sectionSub: "Anteprima rapida di evidenze (miste) in rotazione automatica.",
    tag: "Evidenza",
    pause: "⏸ Pausa",
    resume: "▶️ Riprendi",
    ariaCarousel: "Carosello automatico di evidenze",
    slideTitles: [
      "Evidenza · Documento",
      "Evidenza · Checklist",
      "Evidenza · Conferma",
      "Evidenza · Tracking",
      "Evidenza · Comunicazione",
      "Evidenza · Risultato",
    ],
  },

  ar: {
    sectionTitle: "نماذج على شكل شريط متحرك",
    sectionSub: "عرض سريع لأدلة مختلطة بتدوير تلقائي.",
    tag: "دليل",
    pause: "⏸ إيقاف مؤقت",
    resume: "▶️ متابعة",
    ariaCarousel: "شريط أدلة تلقائي",
    slideTitles: [
      "دليل · مستند",
      "دليل · قائمة تحقق",
      "دليل · تأكيد",
      "دليل · تتبّع",
      "دليل · تواصل",
      "دليل · نتيجة",
    ],
  },

  ru: {
    sectionTitle: "Примеры в карусели",
    sectionSub: "Быстрый просмотр смешанных доказательств в автоматической ротации.",
    tag: "Доказательство",
    pause: "⏸ Пауза",
    resume: "▶️ Продолжить",
    ariaCarousel: "Автоматическая карусель доказательств",
    slideTitles: [
      "Доказательство · Документ",
      "Доказательство · Чек-лист",
      "Доказательство · Подтверждение",
      "Доказательство · Трекинг",
      "Доказательство · Коммуникация",
      "Доказательство · Результат",
    ],
  },
};

export const EvidenceMarquee: React.FC = () => {
  const { locale, isRTL } = useContext(I18nContext);
  const copy = useMemo(() => MARQUEE_COPY[locale] || MARQUEE_COPY.es, [locale]);

  const viewportRef = useRef<HTMLDivElement | null>(null);

  // Ajusta estas rutas a tus imágenes reales (en /frontend/public)
  const slides = useMemo<Slide[]>(
    () => [
      { id: "ev-1", title: copy.slideTitles[0], img: "/assets/evidence-marquee/1.jpg" },
      { id: "ev-2", title: copy.slideTitles[1], img: "/assets/evidence-marquee/2.jpg" },
      { id: "ev-3", title: copy.slideTitles[2], img: "/assets/evidence-marquee/3.jpg" },
      { id: "ev-4", title: copy.slideTitles[3], img: "/assets/evidence-marquee/4.jpg" },
      { id: "ev-5", title: copy.slideTitles[4], img: "/assets/evidence-marquee/5.jpg" },
      { id: "ev-6", title: copy.slideTitles[5], img: "/assets/evidence-marquee/6.jpg" },
    ],
    [copy]
  );

  // duplicamos para loop suave (sin salto visual)
  const loopSlides = useMemo(() => [...slides, ...slides], [slides]);

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Config: cada 3s
  useEffect(() => {
    if (isPaused) return;

    const t = window.setInterval(() => {
      setIndex((i) => i + 1);
    }, 3000);

    return () => window.clearInterval(t);
  }, [isPaused]);

  // Aplicar transform y reset de loop cuando pase la mitad
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    // Medimos un slide (incluye gap)
    const first = viewport.querySelector<HTMLElement>(".evm2-slide");
    const slideW = first?.offsetWidth || 280;

    // gap definido en CSS .evm2-track { gap: 14px; }
    const gap = 14;
    const step = slideW + gap;

    // Si llegamos al final de la primera tanda, reseteamos sin animación
    if (index >= slides.length) {
      const track = viewport.querySelector<HTMLElement>(".evm2-track");
      if (!track) return;

      track.style.transition = "transform 500ms ease";
      // ✅ RTL: invertimos dirección visual
      const dir = isRTL ? 1 : -1;
      track.style.transform = `translateX(${dir * step * index}px)`;

      const raf = requestAnimationFrame(() => {
        const timeout = window.setTimeout(() => {
          track.style.transition = "none";
          track.style.transform = `translateX(0px)`;
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          track.offsetHeight;

          setIndex(0);
          window.clearTimeout(timeout);
          cancelAnimationFrame(raf);
        }, 520);
      });

      return;
    }

    const track = viewport.querySelector<HTMLElement>(".evm2-track");
    if (!track) return;

    track.style.transition = "transform 500ms ease";
    const dir = isRTL ? 1 : -1;
    track.style.transform = `translateX(${dir * step * index}px)`;
  }, [index, slides.length, isRTL]);

  return (
    <section
      id="pruebas-moviles"
      className="section alt"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      <style>{`
        .evm2-wrap{
          margin-top: 14px;
          border-radius: 16px;
          border: 1px solid rgba(148,163,184,0.18);
          background: rgba(2,6,23,0.28);
          overflow: hidden;
          position: relative;
        }
        .evm2-head{
          display:flex;
          align-items:flex-end;
          justify-content:space-between;
          gap: 12px;
          flex-wrap: wrap;
          padding: 14px 14px 0;
        }
        .evm2-title{ margin:0; }
        .evm2-sub{ margin: 6px 0 0; opacity:.85; }
        .evm2-viewport{
          overflow: hidden;
          padding: 14px;
        }
        .evm2-track{
          display:flex;
          gap: 14px;
          will-change: transform;
          transform: translateX(0px);
        }
        .evm2-slide{
          flex: 0 0 auto;
          width: 270px;
          border-radius: 14px;
          border: 1px solid rgba(148,163,184,0.18);
          background:
            radial-gradient(circle at top, rgba(56,189,248,0.14), rgba(15,23,42,0.96));
          box-shadow: 0 18px 40px rgba(15,23,42,0.55);
          overflow: hidden;
        }

        /* ✅ FIX PRINCIPAL: contenedor fijo + <img> real */
        .evm2-img{
          height: 160px;
          position: relative;
          border-bottom: 1px solid rgba(148,163,184,0.14);
          overflow: hidden;
          background: rgba(2,6,23,0.35);
        }
        .evm2-img > img{
          width: 100%;
          height: 100%;
          display: block;
          object-fit: contain;
          object-position: center;
          background: rgba(2,6,23,0.65);
          transform: scale(1.02);
          filter: saturate(1.05);
        }

        .evm2-watermark{
          position:absolute;
          inset: 0;
          display:flex;
          align-items:center;
          justify-content:center;
          font-weight: 1000;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-size: 12px;
          color: rgba(226,232,240,0.80);
          text-shadow: 0 10px 30px rgba(0,0,0,0.7);
          background: linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.10));
          user-select: none;
          pointer-events: none;
        }
        .evm2-body{
          padding: 10px 12px 12px;
        }
        .evm2-tag{
          display:inline-flex;
          align-items:center;
          padding: 3px 10px;
          border-radius: 999px;
          border: 1px solid rgba(148,163,184,0.18);
          background: rgba(2,6,23,0.55);
          font-size: 12px;
          font-weight: 800;
          opacity: .95;
        }
        .evm2-caption{
          margin: 8px 0 0;
          font-size: 13px;
          font-weight: 800;
          line-height: 1.25;
        }
        .evm2-actions{
          padding: 0 14px 14px;
          display:flex;
          gap: 10px;
          justify-content: flex-end;
          flex-wrap: wrap;
        }
        .evm2-fadeL, .evm2-fadeR{
          position:absolute;
          top:0; bottom:0;
          width: 86px;
          pointer-events:none;
          z-index: 3;
        }
        .evm2-fadeL{
          left:0;
          background: linear-gradient(90deg, rgba(2,6,23,0.95), rgba(2,6,23,0));
        }
        .evm2-fadeR{
          right:0;
          background: linear-gradient(270deg, rgba(2,6,23,0.95), rgba(2,6,23,0));
        }
        @media (max-width: 560px){
          .evm2-slide{ width: 240px; }
          .evm2-img{ height: 150px; }
        }
        @media (prefers-reduced-motion: reduce){
          .evm2-track{ transition: none !important; }
        }
      `}</style>

      <div className="evm2-head">
        <div>
          <h2 className="evm2-title">{copy.sectionTitle}</h2>
          <p className="muted evm2-sub">{copy.sectionSub}</p>
        </div>
      </div>

      <div
        className="evm2-wrap"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="evm2-fadeL" aria-hidden="true" />
        <div className="evm2-fadeR" aria-hidden="true" />

        <div className="evm2-viewport" ref={viewportRef} aria-label={copy.ariaCarousel}>
          <div className="evm2-track">
            {loopSlides.map((s, i) => (
              <article className="evm2-slide" key={`${s.id}-${i}`}>
                <div className="evm2-img">
                  <img src={s.img} alt={s.title} loading="lazy" />
                  <div className="evm2-watermark">G D</div>
                </div>

                <div className="evm2-body">
                  <span className="evm2-tag">{copy.tag}</span>
                  <div className="evm2-caption">{s.title}</div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="evm2-actions">
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setIsPaused((p) => !p)}
            aria-label={isPaused ? copy.resume : copy.pause}
          >
            {isPaused ? copy.resume : copy.pause}
          </button>
        </div>
      </div>
    </section>
  );
};