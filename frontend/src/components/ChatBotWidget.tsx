// frontend/src/components/ChatBotWidget.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";

type Step =
  | "INTRO"
  | "ID"
  | "SERVICE"
  | "PRIORITY"
  | "SUMMARY"
  | "PHONE"
  | "CONFIRM"
  | "PAY_METHOD"
  | "BUY_CRYPTO"
  | "PAY_CRYPTO"
  | "WA_REDIRECT"
  | "TRACK_LOOKUP"
  | "DONE"
  | "FAQ";

type Msg = {
  id: string;
  from: "bot" | "user";
  text: string;
};

const API_BACKEND =
  ((import.meta as any)?.env?.VITE_API_BASE as string | undefined)?.trim?.() ||
  "http://localhost:3000";

const API_PAYMENT = `${API_BACKEND}/api/mock-payment`;

// Número de WhatsApp “de la empresa” (cámbialo tú)
const SUPPORT_WHATSAPP = "51931321064";

// LocalStorage tracking (por sesión / demo)
const TRACKING_LS_KEY = "docsim.tracking.v1";

// Coachmark (guía visual) - se muestra 1 vez
const COACHMARK_KEY = "docsim.coachmark.dismissed.v1";

// ✅ Tutorial (video)
const TUTORIAL_LS_KEY = "docsim.tutorial.dismissed.v1";
const TUTORIAL_VIDEO_SRC =
  ((import.meta as any)?.env?.VITE_TUTORIAL_VIDEO_SRC as string | undefined)
    ?.trim?.() || "/media/tutorial.mp4";

const uid = () => Math.random().toString(16).slice(2) + Date.now().toString(16);
const normalizeSpaces = (s: string) => s.replace(/\s+/g, " ").trim();

// ========= SERVICIOS / PRECIOS =========
const serviceLabel = (s: string) => {
  switch (s) {
    case "pasaporte_eu":
      return "Pasaportes & Nacionalidad";
    case "green_card":
      return "Residencia / Green Card";
    case "visa":
      return "Visa Americana Elite";
    case "licencia":
      return "Licencia Internacional Multipaís";
    default:
      return s;
  }
};

const servicePrice = (s: string) => {
  switch (s) {
    case "pasaporte_eu":
      return 4500;
    case "green_card":
      return 1400;
    case "visa":
      return 950;
    case "licencia":
      return 380;
    default:
      return 0;
  }
};

type PriorityKey = "alta" | "media";

const priorityLabel = (p: PriorityKey) =>
  p === "alta" ? "Prioridad Alta" : "Prioridad Media";

const priorityETA = (p: PriorityKey) => {
  if (p === "alta") return "24–72 horas";
  return "7–12 días";
};

const priorityMultiplier = (p: PriorityKey) => (p === "alta" ? 1.3 : 1);

// ========= VALIDACIONES =========
const isValidFullName = (name: string) => {
  const n = normalizeSpaces(name);
  if (n.length < 8) return false;
  const parts = n.split(" ").filter(Boolean);
  return parts.length >= 2;
};

const isValidDNI = (dni: string) => {
  const d = dni.replace(/\D/g, "");
  return d.length >= 8;
};

// ✅ Debe iniciar con + y tener suficientes dígitos (código + número)
const isValidPhoneIntl = (raw: string) => {
  const s = raw.trim();
  if (!s.startsWith("+")) return false;
  const digits = s.replace(/\D/g, "");
  if (digits.length < 10) return false;
  return true;
};

// ✅ Prefijo por país (para prellenar)
const countryDial = (c: string) => {
  const x = (c || "").toLowerCase();
  if (x.includes("per")) return "+51 ";
  if (x.includes("méx") || x.includes("mex")) return "+52 ";
  if (x.includes("estados") || x.includes("united") || x.includes("usa"))
    return "+1 ";
  if (x.includes("chi")) return "+56 ";
  if (x.includes("col")) return "+57 ";
  if (x.includes("arg")) return "+54 ";
  if (x.includes("esp")) return "+34 ";
  return "+";
};

// ========= TRACKING HELPERS =========
const publicCodeFromSimId = (simId: string | null) => {
  if (!simId) return "S-—";
  return String(simId).replace(/^SIM-/i, "S-");
};

const simIdFromPublicCode = (code: string) => {
  const c = normalizeSpaces(code).toUpperCase();
  if (!c.startsWith("S-")) return null;
  return c.replace(/^S-/, "SIM-");
};

const normalizePublicCode = (code: string) => normalizeSpaces(code).toUpperCase();

const readTrackingMap = (): Record<string, number> => {
  try {
    const raw = localStorage.getItem(TRACKING_LS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof k === "string" && typeof v === "number") out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
};

const TRACKER_STAGES = [
  { title: "Recepción", desc: "Solicitud recibida y registrada." },
  { title: "Validación", desc: "Validación de datos y consistencia." },
  { title: "Revisión documental", desc: "Checklist documental y verificación." },
  { title: "Proceso interno", desc: "Evaluación interna y preparación de salida." },
  { title: "Resultado final", desc: "Resultado emitido / finalizado." },
];

// ========= PAGO (DEMO) =========
// ✅ Lemon: se abre como guía (redirección a tienda según dispositivo).
const LEMON_ANDROID_URL =
  ((import.meta as any)?.env?.VITE_LEMON_ANDROID_URL as string | undefined)?.trim?.() ||
  "https://play.google.com/store/apps/details?id=com.applemoncash"; // <-- ajusta si el id real difiere

const LEMON_IOS_URL =
  ((import.meta as any)?.env?.VITE_LEMON_IOS_URL as string | undefined)?.trim?.() ||
  "https://apps.apple.com/pe/app/lemon-tu-billetera-digital/id1499421511"; // <-- ajusta si el link real difiere

const openLemon = () => {
  const ua = navigator.userAgent || "";
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);

  const url = isIOS ? LEMON_IOS_URL : isAndroid ? LEMON_ANDROID_URL : LEMON_ANDROID_URL;

  try {
    window.open(url, "_blank", "noopener,noreferrer");
  } catch {
    // ignore
  }
};

export const ChatBotWidget = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("INTRO");
  const historyRef = useRef<Step[]>([]);

  const [messages, setMessages] = useState<Msg[]>([
    {
      id: uid(),
      from: "bot",
      text:
        "👋 <strong>Asesor IA</strong> listo.\n" +
        "Pulsa <strong>Iniciar solicitud</strong> y completa todo en una sola conversación.",
    },
  ]);

  const [botTyping, setBotTyping] = useState(false);

  // ✅ Coachmark (guía visual) - NO tapa el botón y se muestra 1 vez
  const [showCoachmark, setShowCoachmark] = useState(false);

  // ✅ Tutorial modal
  const [showTutorial, setShowTutorial] = useState(false);
  const [dontShowTutorialAgain, setDontShowTutorialAgain] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(COACHMARK_KEY);
      if (!dismissed) setShowCoachmark(true);
    } catch {
      setShowCoachmark(true);
    }
  }, []);

  const dismissCoachmark = () => {
    setShowCoachmark(false);
    try {
      localStorage.setItem(COACHMARK_KEY, "1");
    } catch {
      // ignore
    }
  };

  const openFromCoachmark = () => {
    dismissCoachmark();
    setOpen(true);
  };

  // ✅ Si el chat se abre, abre tutorial (si no está deshabilitado)
  useEffect(() => {
    if (!open) return;

    // oculta coachmark si se abrió chat
    dismissCoachmark();

    // tutorial solo si no fue deshabilitado
    try {
      const dismissedTutorial = localStorage.getItem(TUTORIAL_LS_KEY);
      if (dismissedTutorial !== "1") {
        setShowTutorial(true);
      }
    } catch {
      setShowTutorial(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ✅ Cuando aparece el tutorial: intenta autoplay (iOS puede bloquear, pero con muted suele ir)
  useEffect(() => {
    if (!showTutorial) return;
    const v = videoRef.current;
    if (!v) return;

    // reset a inicio
    try {
      v.currentTime = 0;
    } catch {}

    // intenta autoplay
    const tryPlay = async () => {
      try {
        await v.play();
      } catch {
        // si iOS bloquea, controles permiten iniciar manual
      }
    };
    tryPlay();
  }, [showTutorial]);

  const closeTutorial = (persist?: boolean) => {
    setShowTutorial(false);

    if (persist) {
      try {
        localStorage.setItem(TUTORIAL_LS_KEY, "1");
      } catch {}
    }
  };

  const openTutorialManual = () => {
    setShowTutorial(true);
  };

  // ========= DATOS =========
  const [fullName, setFullName] = useState("");
  const [dni, setDni] = useState("");
  const [country, setCountry] = useState("Perú");

  const [service, setService] = useState<string | null>(null);
  const [priority, setPriority] = useState<PriorityKey | null>(null);

  // ✅ inicia con "+"
  const [phoneInput, setPhoneInput] = useState("+");
  const [phone, setPhone] = useState<string | null>(null);

  // Orden simulada
  const [processingSale, setProcessingSale] = useState(false);
  const [lastSimId, setLastSimId] = useState<string | null>(null);

  // Control WA (para obligar click antes de finalizar)
  const [waClicked, setWaClicked] = useState(false);

  // Tracking: mapa por ID (persistente)
  const [trackingMap, setTrackingMap] = useState<Record<string, number>>(() =>
    readTrackingMap()
  );
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [activeSimId, setActiveSimId] = useState<string | null>(null);

  // Lookup de tracking por código
  const [trackCodeInput, setTrackCodeInput] = useState("");

  // Operador (panel privado oculto)
  const [operatorOpen, setOperatorOpen] = useState(false);
  const [operatorSelected, setOperatorSelected] = useState<string | null>(null);

  const chatBodyRef = useRef<HTMLDivElement | null>(null);

  // ========= NOWPAYMENTS (INVOICE REAL) =========
  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);

  // Abrir chatbot desde fuera
  useEffect(() => {
    const onOpen = () => {
      dismissCoachmark();
      setOpen(true);
    };
    window.addEventListener("open-chatbot", onOpen as EventListener);
    return () =>
      window.removeEventListener("open-chatbot", onOpen as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll bottom
  useEffect(() => {
    const el = chatBodyRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, botTyping, trackerOpen, step, activeSimId, operatorOpen]);

  // Persist tracking map
  useEffect(() => {
    try {
      localStorage.setItem(TRACKING_LS_KEY, JSON.stringify(trackingMap));
    } catch {
      // ignore
    }
  }, [trackingMap]);

  // Hotkeys operador (privado)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = String(e.key || "").toLowerCase();
      if (e.ctrlKey && e.shiftKey && key === "o") {
        e.preventDefault();
        setOperatorOpen((v) => !v);
      }
      if (key === "escape") {
        setOperatorOpen(false);
        if (showTutorial) closeTutorial(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTutorial]);

  const pushUserMessage = (text: string) => {
    setMessages((m) => [...m, { id: uid(), from: "user", text }]);
  };

  const pushBotMessages = (lines: string[]) => {
    setBotTyping(true);
    window.setTimeout(() => {
      setMessages((m) => [
        ...m,
        ...lines.map((t) => ({ id: uid(), from: "bot" as const, text: t })),
      ]);
      setBotTyping(false);
    }, 360);
  };

  const goStep = (next: Step) => {
    historyRef.current.push(step);
    setStep(next);
  };

  const goBack = () => {
    const prev = historyRef.current.pop();
    if (!prev) return;
    setStep(prev);
    pushUserMessage("⬅️ Atrás");
    pushBotMessages(["Listo, volvimos al paso anterior."]);
  };

  const resetAll = () => {
    historyRef.current = [];
    setStep("INTRO");
    setProcessingSale(false);
    setLastSimId(null);
    setWaClicked(false);

    setTrackerOpen(false);
    setActiveSimId(null);

    setFullName("");
    setDni("");
    setCountry("Perú");
    setService(null);
    setPriority(null);

    setPhoneInput("+");
    setPhone(null);

    setTrackCodeInput("");

    setCreatingInvoice(false);
    setInvoiceUrl(null);
    setInvoiceId(null);

    setMessages([
      {
        id: uid(),
        from: "bot",
        text: "🔄 Reiniciado.\nPulsa <strong>Iniciar solicitud</strong> para comenzar.",
      },
    ]);
  };

  const handleStart = () => {
    pushUserMessage("🧾 Iniciar solicitud");
    pushBotMessages([
      "Perfecto. Empezamos en menos de 1 minuto.",
      "✅ Escribe <strong>nombre completo</strong>, <strong>DNI</strong> y <strong>país</strong> para generar el registro.",
    ]);
    goStep("ID");
  };

  const handleConfirmIdentity = () => {
    const n = normalizeSpaces(fullName);
    const d = dni.replace(/\D/g, "");

    pushUserMessage("✅ Continuar");

    if (!isValidFullName(n)) {
      pushBotMessages([
        "⚠️ Necesito tu <strong>nombre completo</strong> (mínimo 2 palabras: nombre + apellido).",
        "Ejemplo: <em>María Fernanda Pérez López</em>.",
      ]);
      return;
    }
    if (!isValidDNI(d)) {
      pushBotMessages([
        "⚠️ DNI inválido. Debe tener mínimo <strong>8 dígitos</strong>.",
      ]);
      return;
    }

    setFullName(n);
    setDni(d);

    pushBotMessages([
      `Listo, <strong>${n}</strong> (${country}).`,
      "Ahora elige el servicio (ordenado por inversión).",
    ]);
    goStep("SERVICE");
  };

  const handleServiceSelect = (s: string) => {
    setService(s);
    pushUserMessage(
      `${serviceLabel(s)} — USD ${servicePrice(s).toLocaleString()}`
    );
    pushBotMessages([
      "Perfecto. Ahora elige la prioridad.",
      "📌 <strong>Prioridad Alta</strong>: 24–72h y recargo <strong>+30%</strong>.\n📌 <strong>Prioridad Media</strong>: 7–12 días sin recargo.",
    ]);
    goStep("PRIORITY");
  };

  const handlePriority = (p: PriorityKey) => {
    setPriority(p);
    pushUserMessage(`${priorityLabel(p)} (${priorityETA(p)})`);
    pushBotMessages(["Listo. Te muestro el resumen final."]);
    goStep("SUMMARY");
  };

  const basePrice = useMemo(
    () => (service ? servicePrice(service) : 0),
    [service]
  );

  const finalPrice = useMemo(() => {
    if (!service || !priority) return 0;
    return Math.round(basePrice * priorityMultiplier(priority));
  }, [service, priority, basePrice]);

  const summaryLines = useMemo(() => {
    const s = service ? serviceLabel(service) : "—";
    const p = service ? `USD ${basePrice.toLocaleString()}` : "—";
    const pr = priority
      ? `${priorityLabel(priority)} (${priorityETA(priority)})`
      : "—";
    const mult = priority === "alta" ? "+30%" : "—";
    const fp = service && priority ? `USD ${finalPrice.toLocaleString()}` : "—";

    return [
      `• <strong>Nombre</strong>: ${fullName || "—"}`,
      `• <strong>DNI</strong>: ${dni || "—"}`,
      `• <strong>País</strong>: ${country || "—"}`,
      `• <strong>Servicio</strong>: ${s} (${p})`,
      `• <strong>Prioridad</strong>: ${pr}`,
      `• <strong>Ajuste</strong>: ${mult}`,
      `• <strong>Total estimado</strong>: ${fp}`,
    ];
  }, [service, basePrice, priority, finalPrice, fullName, dni, country]);

  // ✅ Pide WhatsApp y prellena el prefijo por país
  const handleAskPhone = () => {
    pushUserMessage("Continuar");
    pushBotMessages([
      "📲 Escribe tu WhatsApp con <strong>código de país</strong>.",
      "Ejemplo: <strong>+51 987 654 321</strong>",
    ]);

    setPhoneInput((prev) => {
      const p = (prev || "").trim();
      if (!p || p === "+") return countryDial(country);
      return prev;
    });

    goStep("PHONE");
  };

  const handleConfirmPhone = () => {
    pushUserMessage("Confirmar");

    if (!isValidPhoneIntl(phoneInput)) {
      pushBotMessages([
        "⚠️ WhatsApp inválido. Debe incluir <strong>+</strong> y el código de país.",
        "Ejemplo: <strong>+51 987 654 321</strong>",
      ]);
      return;
    }

    const cleaned = phoneInput.trim();
    setPhone(cleaned);
    pushBotMessages([
      `Perfecto. Registrado: <strong>${cleaned}</strong>`,
      "Último paso: generar orden.",
    ]);
    goStep("CONFIRM");
  };

  const buildSupportWhatsAppLink = (simId: string | null) => {
    const text = encodeURIComponent(
      [
        "Hola, deseo coordinar mi solicitud (simulación):",
        `• ID: ${publicCodeFromSimId(simId)}`,
        `• Nombre: ${fullName}`,
        `• País: ${country}`,
        `• Servicio: ${service ? serviceLabel(service) : "—"}`,
        `• Prioridad: ${
          priority ? `${priorityLabel(priority)} (${priorityETA(priority)})` : "—"
        }`,
        `• Total estimado: ${
          service && priority ? `USD ${finalPrice.toLocaleString()}` : "—"
        }`,
        `• WhatsApp: ${phone || "—"}`,
      ].join("\n")
    );

    return `https://wa.me/${SUPPORT_WHATSAPP}?text=${text}`;
  };

  // Tracking UI (usuario)
  const trackerStep = useMemo(() => {
    if (!activeSimId) return 0;
    const v = trackingMap[activeSimId];
    return typeof v === "number" ? v : 0;
  }, [activeSimId, trackingMap]);

  const trackerProgress = useMemo(() => {
    const total = TRACKER_STAGES.length - 1;
    const p = total <= 0 ? 0 : Math.round((trackerStep * 100) / total);
    return Math.max(0, Math.min(100, p));
  }, [trackerStep]);

  // ✅ Genera la orden (demo backend existente) y luego pasa al checkout cripto
  const handleSimulatedSale = async () => {
    if (!service) return;

    setProcessingSale(true);
    pushUserMessage("Generar orden");

    try {
      const payload = { name: fullName.trim(), emailHash: null, service };

      const r = await fetch(API_PAYMENT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Error desconocido");

      const simId = (data.simId || null) as string | null;

      setLastSimId(simId);
      setWaClicked(false);

      // reset invoice
      setInvoiceUrl(null);
      setInvoiceId(null);

      if (simId) {
        setTrackingMap((m) => {
          if (typeof m[simId] === "number") return m;
          return { ...m, [simId]: 0 };
        });
      }

      setActiveSimId(simId);
      setTrackerOpen(true);

      pushBotMessages([
        `✅ Orden creada.\nID: <span class="id-mono">${publicCodeFromSimId(
          simId
        )}</span>`,
        "Ahora elige cómo deseas pagar (cripto).",
        "*Lemon se usa para <strong>comprar cripto</strong>. El pago final se hace con <strong>NOWPayments</strong>.",
      ]);

      setStep("PAY_METHOD");
    } catch (e: any) {
      pushBotMessages([
        `⚠️ No se pudo generar la orden: <strong>${String(
          e?.message || e
        )}</strong>`,
      ]);
      setStep("DONE");
    } finally {
      setProcessingSale(false);
    }
  };

  // ========= CHECKOUT CRIPTO =========
  const waHelpLink = useMemo(
    () => buildSupportWhatsAppLink(lastSimId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lastSimId, fullName, country, service, priority, finalPrice, phone]
  );

  const openHelpWhatsApp = () => {
    pushUserMessage("💬 Tengo una duda → WhatsApp");
    try {
      window.open(waHelpLink, "_blank", "noopener,noreferrer");
    } catch {
      // ignore
    }
  };

  const openBuyWithLemon = () => {
    pushUserMessage("📲 Comprar cripto desde la app (Lemon)");
    pushBotMessages([
      "✅ Se abrirá Lemon (descarga/tienda) en una pestaña nueva.",
      "Cuando termines de comprar tu saldo en Lemon, vuelve aquí y pulsa <strong>“Ya compré, continuar al pago”</strong>.",
    ]);

    openLemon();
    setStep("BUY_CRYPTO");
  };

  const createNowPaymentsInvoiceAndOpen = async (originLabel: string) => {
    if (!service || !priority || !lastSimId) {
      pushBotMessages([
        "⚠️ Falta información para crear el pago. Reinicia y vuelve a intentar.",
      ]);
      return;
    }

    setCreatingInvoice(true);
    pushUserMessage(originLabel);

    try {
      const orderId = `ORDER-${publicCodeFromSimId(lastSimId)}`;

      const r = await fetch(`${API_BACKEND}/api/nowpayments/invoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          price_amount: finalPrice,
          price_currency: "usd",
          order_description: `${serviceLabel(service)} (${priorityLabel(
            priority
          )}) - Demo`,
        }),
      });

      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "No se pudo crear la invoice");

      const url: string | null =
        data?.invoice_url || data?.invoiceUrl || data?.payment_url || null;

      const id: string | null = data?.invoice_id || data?.id || null;

      if (!url) throw new Error("NOWPayments no devolvió invoice_url");

      setInvoiceUrl(url);
      setInvoiceId(id);

      pushBotMessages([
        "✅ Invoice creada en NOWPayments.",
        `🔗 <a href="${url}" target="_blank" rel="noreferrer">Abrir checkout con QR</a>`,
        "Ahí verás el QR y el monto exacto del pago.",
      ]);

      try {
        window.open(url, "_blank", "noopener,noreferrer");
      } catch {
        // ignore
      }

      setStep("PAY_CRYPTO");
    } catch (e: any) {
      pushBotMessages([
        `⚠️ Error creando invoice: <strong>${String(
          e?.message || e
        )}</strong>`,
      ]);
    } finally {
      setCreatingInvoice(false);
    }
  };

  const openNowPayments = () =>
    createNowPaymentsInvoiceAndOpen("🔐 Ya tengo cripto → Pagar (NOWPayments)");

  const continueAfterLemon = () =>
    createNowPaymentsInvoiceAndOpen(
      "✅ Ya compré → Continuar al pago (NOWPayments)"
    );

  const finishPayment = () => {
    pushUserMessage("Continuar");
    pushBotMessages([
      "✅ Perfecto. Tu pago puede quedar <strong>en verificación</strong> unos minutos (según red).",
      "Tu seguimiento queda disponible con tu código cuando lo necesites.",
      "Si necesitas ayuda, usa el botón de WhatsApp.",
    ]);
    setStep("WA_REDIRECT");
  };

  const openWhatsAppCTA = () => {
    if (!lastSimId) return;

    pushUserMessage("💬 Coordinar por WhatsApp");

    try {
      window.open(waHelpLink, "_blank", "noopener,noreferrer");
    } catch {
      // ignore
    }

    setWaClicked(true);
    pushBotMessages([
      "✅ Listo. Cuando termines de coordinar, pulsa <strong>Continuar</strong>.",
    ]);
  };

  const finishAfterWhatsApp = () => {
    pushUserMessage("Continuar");
    pushBotMessages([
      "Perfecto. Flujo completado. Puedes reiniciar cuando quieras.",
    ]);
    setStep("DONE");
  };

  const faq = [
    {
      q: "¿Qué significa Prioridad Alta?",
      a: "Atención prioritaria con tiempo estimado de 24–72 horas. Incluye recargo +30% sobre el precio base.",
    },
    {
      q: "¿Qué significa Prioridad Media?",
      a: "Flujo estándar con tiempo estimado de 7–12 días, sin recargo.",
    },
    {
      q: "¿Cómo veo el estado del trámite?",
      a: "Usa “📍 Ver el proceso” y escribe tu código (S-...).",
    },
    {
      q: "¿Puedo volver al inicio?",
      a: "Sí: usa 🏠 Inicio en cualquier momento.",
    },
  ];

  const canContinueID = useMemo(() => {
    const n = normalizeSpaces(fullName);
    const d = dni.replace(/\D/g, "");
    return isValidFullName(n) && isValidDNI(d);
  }, [fullName, dni]);

  const onEnter = (fn: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter") fn();
  };

  // Tracking lookup
  const handleOpenTrackingLookup = () => {
    pushUserMessage("📍 Ver el proceso de mi documento");
    pushBotMessages([
      "🔎 Ingresa tu <strong>código</strong> para ver el estado.",
      "Ejemplo: <strong>S-1234ABCD</strong>",
    ]);
    goStep("TRACK_LOOKUP");
  };

  const handleViewTrackingByCode = () => {
    const normalized = normalizePublicCode(trackCodeInput);
    const simId = simIdFromPublicCode(normalized);

    pushUserMessage("Ver proceso");

    if (!simId) {
      pushBotMessages([
        "⚠️ Código inválido. Debe empezar con <strong>S-</strong>.",
        "Ejemplo: <strong>S-1234ABCD</strong>",
      ]);
      return;
    }

    if (typeof trackingMap[simId] !== "number") {
      pushBotMessages([
        "⚠️ No encontré ese código en esta sesión.",
        "Verifica que esté bien escrito o genera una orden para obtener uno nuevo.",
      ]);
      return;
    }

    setActiveSimId(simId);
    setTrackerOpen(true);

    pushBotMessages([
      `📍 Mostrando tracking para: <span class="id-mono">${publicCodeFromSimId(
        simId
      )}</span>`,
    ]);
    setStep("DONE");
  };

  // Operador (privado)
  const operatorCodes = useMemo(() => {
    const keys = Object.keys(trackingMap || {});
    return keys.sort((a, b) => (a < b ? 1 : -1));
  }, [trackingMap]);

  const operatorSetStage = (simId: string, nextStage: number) => {
    const safe = Math.max(0, Math.min(TRACKER_STAGES.length - 1, nextStage));
    setTrackingMap((m) => ({ ...m, [simId]: safe }));
  };

  const operatorAdvance = (simId: string) => {
    const cur = typeof trackingMap[simId] === "number" ? trackingMap[simId] : 0;
    operatorSetStage(simId, cur + 1);
  };

  const operatorReset = (simId: string) => operatorSetStage(simId, 0);

  // ========= UI =========
  return (
    <div className="chat-widget">
      {!open && (
        <>
          {showCoachmark && (
            <div
              className="chat-coachmark"
              role="dialog"
              aria-label="Guía para iniciar solicitud"
            >
              <button
                type="button"
                className="chat-coachmark-x"
                onClick={dismissCoachmark}
                aria-label="Cerrar"
                title="Cerrar"
              >
                ✕
              </button>

              <div className="chat-coachmark-title">
                👉 Aquí puedes solicitar tu trámite
              </div>
              <div className="chat-coachmark-text">
                Haz clic en <strong>Asesor IA</strong> para iniciar tu solicitud
                automática.
              </div>

              <div className="chat-coachmark-actions">
                <button
                  type="button"
                  className="chat-coachmark-btn"
                  onClick={openFromCoachmark}
                >
                  Iniciar ahora
                </button>
                <button
                  type="button"
                  className="chat-coachmark-btn ghost"
                  onClick={dismissCoachmark}
                >
                  Entendido
                </button>
              </div>

              <span className="chat-coachmark-arrow" aria-hidden="true" />
            </div>
          )}

          <button
            className="chat-toggle chat-toggle-pro"
            type="button"
            onClick={() => setOpen(true)}
          >
            <span className="chat-avatar" aria-hidden="true">
              <svg
                viewBox="0 0 64 64"
                className="chat-avatar-svg chat-avatar-anim"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#0ea5e9" />
                    <stop offset="1" stopColor="#22c55e" />
                  </linearGradient>
                </defs>
                <circle cx="32" cy="32" r="28" fill="url(#g1)" opacity="0.18" />
                <rect
                  x="16"
                  y="18"
                  width="32"
                  height="28"
                  rx="10"
                  fill="url(#g1)"
                />
                <circle
                  cx="26"
                  cy="32"
                  r="4"
                  className="bot-eye"
                  fill="#020617"
                  opacity="0.92"
                />
                <circle
                  cx="38"
                  cy="32"
                  r="4"
                  className="bot-eye"
                  fill="#020617"
                  opacity="0.92"
                />
                <rect
                  x="26"
                  y="40"
                  width="12"
                  height="3"
                  rx="2"
                  fill="#020617"
                  opacity="0.9"
                />
                <rect
                  x="29"
                  y="12"
                  width="6"
                  height="6"
                  rx="2"
                  fill="url(#g1)"
                />
              </svg>
            </span>

            <span className="chat-toggle-text">
              <span className="chat-toggle-title">
                Asesor IA <span className="chat-cta-hint">Haz clic para iniciar</span>
              </span>
              <span className="chat-toggle-sub chat-toggle-sub-strong">
                Solicitud 100% automática · 1 conversación
              </span>
            </span>

            <span className="chat-toggle-badge chat-toggle-badge-pro">
              <span className="live-dot" aria-hidden="true" />
              Online
            </span>
          </button>
        </>
      )}

      {open && (
        <div
          className="chat-panel"
          style={{
            width: "min(980px, 96vw)",
            maxWidth: 980,
            height: "min(78vh, 760px)",
            maxHeight: 760,
          }}
        >
          {/* ✅ TUTORIAL MODAL (superpuesto sobre el chat) */}
          {showTutorial && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Tutorial de uso"
              onClick={() => closeTutorial(false)}
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 9999,
                background: "rgba(0,0,0,0.62)",
                backdropFilter: "blur(10px)",
                display: "grid",
                placeItems: "center",
                padding: 14,
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "min(420px, 96vw)",
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.16)",
                  background: "rgba(10,10,10,0.78)",
                  boxShadow: "0 30px 80px rgba(0,0,0,0.65)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 12px 10px",
                    borderBottom: "1px solid rgba(255,255,255,0.10)",
                  }}
                >
                  <div style={{ display: "grid", gap: 2 }}>
                    <div style={{ fontWeight: 900, letterSpacing: 0.2 }}>
                      🎥 Tutorial rápido
                    </div>
                    <div style={{ opacity: 0.8, fontSize: 12 }}>
                      Mira esto 15–30s y luego usa el chat abajo.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => closeTutorial(false)}
                    aria-label="Cerrar tutorial"
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.16)",
                      background: "rgba(255,255,255,0.06)",
                      color: "white",
                      cursor: "pointer",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 18,
                    }}
                    title="Cerrar"
                  >
                    ✕
                  </button>
                </div>

                <div style={{ padding: 12 }}>
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "9 / 16",
                      borderRadius: 16,
                      overflow: "hidden",
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(2,6,23,0.65)",
                      maxHeight: "68vh",
                    }}
                  >
                    <video
                      ref={videoRef}
                      src={TUTORIAL_VIDEO_SRC}
                      muted
                      playsInline
                      autoPlay
                      controls
                      preload="metadata"
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "block",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  <div style={{ marginTop: 10, opacity: 0.86, fontSize: 13, lineHeight: 1.35 }}>
                    Tip: si el video no inicia solo en iPhone, toca <strong>Play</strong>. (Es normal por políticas del navegador.)
                  </div>

                  <label
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      marginTop: 10,
                      fontSize: 13,
                      opacity: 0.9,
                      userSelect: "none",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={dontShowTutorialAgain}
                      onChange={(e) => setDontShowTutorialAgain(e.target.checked)}
                    />
                    No volver a mostrar automáticamente
                  </label>

                  <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      className="chat-btn ghost"
                      onClick={() => closeTutorial(dontShowTutorialAgain)}
                      style={{ flex: "1 1 160px" }}
                    >
                      Saltar tutorial
                    </button>
                    <button
                      type="button"
                      className="chat-btn"
                      onClick={() => closeTutorial(dontShowTutorialAgain)}
                      style={{ flex: "1 1 160px" }}
                    >
                      ✅ Listo, abrir chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="chat-header chat-header-pro">
            <div className="chat-header-left">
              <span className="chat-avatar small" aria-hidden="true">
                <svg
                  viewBox="0 0 64 64"
                  className="chat-avatar-svg chat-avatar-anim"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#0ea5e9" />
                      <stop offset="1" stopColor="#22c55e" />
                    </linearGradient>
                  </defs>
                  <circle cx="32" cy="32" r="28" fill="url(#g2)" opacity="0.16" />
                  <rect
                    x="16"
                    y="18"
                    width="32"
                    height="28"
                    rx="10"
                    fill="url(#g2)"
                  />
                  <circle
                    cx="26"
                    cy="32"
                    r="4"
                    className="bot-eye"
                    fill="#020617"
                    opacity="0.92"
                  />
                  <circle
                    cx="38"
                    cy="32"
                    r="4"
                    className="bot-eye"
                    fill="#020617"
                    opacity="0.92"
                  />
                  <rect
                    x="26"
                    y="40"
                    width="12"
                    height="3"
                    rx="2"
                    fill="#020617"
                    opacity="0.9"
                  />
                </svg>
              </span>

              <div>
                <div className="chat-title">
                  Asesor IA{" "}
                  <span className="status-pill">
                    {processingSale ? "Procesando" : "Online"}
                  </span>
                </div>
                <div className="chat-subtitle">
                  Flujo automático · sin intervención humana
                </div>
              </div>
            </div>

            <div className="chat-header-actions">
              <button
                className="chat-mini"
                type="button"
                onClick={resetAll}
                title="Reiniciar"
              >
                ↺
              </button>
              <button
                className="chat-close"
                type="button"
                onClick={() => setOpen(false)}
                title="Cerrar"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="chat-body" ref={chatBodyRef} style={{ minHeight: 0 }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={
                  "chat-message " +
                  (msg.from === "bot" ? "chat-bot" : "chat-user")
                }
              >
                <div
                  className={
                    "chat-bubble " +
                    (msg.from === "bot" ? "bot-bubble" : "user-bubble")
                  }
                  dangerouslySetInnerHTML={{
                    __html: msg.text.replace(/\n/g, "<br />"),
                  }}
                />
              </div>
            ))}

            {botTyping && (
              <div className="chat-message chat-bot">
                <div className="chat-bubble bot-bubble typing">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </div>
            )}

            {/* TRACKING (usuario): solo visual */}
            {trackerOpen && activeSimId && (
              <div className="chat-inline-card">
                <div className="chat-inline-title">📍 Tracking de solicitud</div>
                <div className="chat-inline-text">
                  ID:{" "}
                  <span className="id-mono">
                    {publicCodeFromSimId(activeSimId)}
                  </span>
                </div>

                <div className="tracker-progress" aria-hidden="true">
                  <div
                    className="tracker-progress-bar"
                    style={{ width: `${trackerProgress}%` }}
                  />
                </div>

                <div className="tracker">
                  {TRACKER_STAGES.map((st, idx) => {
                    const done = idx < trackerStep;
                    const active = idx === trackerStep;
                    return (
                      <div
                        key={st.title}
                        className={
                          "tracker-row " +
                          (active ? "active" : done ? "done" : "")
                        }
                      >
                        <span className="tracker-dot" aria-hidden="true" />
                        <div className="tracker-content">
                          <div className="tracker-title">{st.title}</div>
                          <div className="tracker-desc">{st.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ✅ CHECKOUT CRIPTO (visual dentro del chat) */}
            {(step === "PAY_METHOD" ||
              step === "BUY_CRYPTO" ||
              step === "PAY_CRYPTO") && (
              <div className="chat-inline-card" style={{ marginTop: 10 }}>
                <div className="chat-inline-title">💳 Checkout Cripto (Demo)</div>
                <div className="chat-inline-text" style={{ lineHeight: 1.4 }}>
                  <div>
                    <strong>Orden:</strong>{" "}
                    <span className="id-mono">
                      {publicCodeFromSimId(lastSimId)}
                    </span>
                  </div>
                  <div style={{ opacity: 0.9, marginTop: 6 }}>
                    <strong>Producto:</strong>{" "}
                    {service ? serviceLabel(service) : "—"}
                  </div>
                  <div style={{ opacity: 0.9 }}>
                    <strong>Total:</strong>{" "}
                    {service && priority
                      ? `USD ${finalPrice.toLocaleString()}`
                      : "—"}
                  </div>

                  <div style={{ marginTop: 10, opacity: 0.88, fontSize: 13 }}>
                    <em>Lemon</em> se usa para <strong>comprar cripto</strong>.
                    El pago final se hace con <strong>NOWPayments</strong>.
                  </div>

                  {!!invoiceUrl && (
                    <div style={{ marginTop: 10, opacity: 0.92, fontSize: 13 }}>
                      ✅ <strong>Invoice lista:</strong>{" "}
                      <a href={invoiceUrl} target="_blank" rel="noreferrer">
                        Abrir checkout con QR
                      </a>{" "}
                      {invoiceId ? (
                        <span style={{ opacity: 0.75 }}>
                          · ID: <span className="id-mono">{invoiceId}</span>
                        </span>
                      ) : null}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    marginTop: 12,
                  }}
                >
                  <button
                    type="button"
                    className="chat-btn"
                    onClick={openNowPayments}
                    disabled={creatingInvoice || !lastSimId}
                    title={!lastSimId ? "Primero genera una orden" : "Crear invoice y pagar"}
                  >
                    {creatingInvoice
                      ? "Creando pago…"
                      : "🔐 Ya tengo cripto → Pagar (NOWPayments)"}
                  </button>

                  <button type="button" className="chat-btn ghost" onClick={openBuyWithLemon}>
                    📲 No tengo cripto → Comprar en app (Lemon)
                  </button>

                  <button type="button" className="chat-btn ghost" onClick={openHelpWhatsApp}>
                    💬 Tengo una duda → WhatsApp
                  </button>
                </div>

                {step === "BUY_CRYPTO" && (
                  <div className="chat-hint" style={{ marginTop: 10 }}>
                    ✅ Cuando termines de comprar, pulsa:
                    <div style={{ marginTop: 8 }}>
                      <button
                        type="button"
                        className="chat-btn"
                        onClick={continueAfterLemon}
                        disabled={creatingInvoice || !lastSimId}
                      >
                        {creatingInvoice
                          ? "Creando pago…"
                          : "✅ Ya compré → Continuar al pago (NOWPayments)"}
                      </button>
                    </div>
                  </div>
                )}

                {step === "PAY_CRYPTO" && (
                  <div className="chat-hint" style={{ marginTop: 10 }}>
                    ✅ Cuando completes el pago en NOWPayments, pulsa:
                    <div style={{ marginTop: 8 }}>
                      <button type="button" className="chat-btn" onClick={finishPayment}>
                        Continuar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="chat-actions">
            {/* Barra constante */}
            <div className="chat-nav">
              <button
                className="chat-chip"
                type="button"
                onClick={goBack}
                disabled={!historyRef.current.length}
              >
                ⬅️ Atrás
              </button>

              <button className="chat-chip ghost" type="button" onClick={resetAll}>
                🏠 Inicio
              </button>

              <button className="chat-chip ghost" type="button" onClick={handleOpenTrackingLookup}>
                📍 Ver el proceso
              </button>

              {/* ✅ NUEVO: abrir tutorial manual */}
              <button className="chat-chip ghost" type="button" onClick={openTutorialManual}>
                🎥 Tutorial
              </button>

              <button
                className="chat-chip ghost"
                type="button"
                onClick={() => {
                  pushUserMessage("❓ FAQ");
                  pushBotMessages(["Aquí tienes respuestas rápidas."]);
                  goStep("FAQ");
                }}
              >
                ❓ FAQ
              </button>
            </div>

            {step === "INTRO" && (
              <div className="chat-buttons">
                <button type="button" className="chat-btn" onClick={handleStart}>
                  🧾 Iniciar solicitud
                </button>
              </div>
            )}

            {step === "FAQ" && (
              <div className="chat-faq">
                {faq.map((x) => (
                  <div key={x.q} className="faq-item">
                    <div className="faq-q">{x.q}</div>
                    <div className="faq-a">{x.a}</div>
                  </div>
                ))}
              </div>
            )}

            {step === "TRACK_LOOKUP" && (
              <div className="chat-phone-row">
                <input
                  type="text"
                  className="chat-phone-input"
                  placeholder="Código (Ej: S-1234ABCD)"
                  aria-label="Código de seguimiento"
                  autoComplete="off"
                  value={trackCodeInput}
                  onChange={(e) => setTrackCodeInput(e.target.value)}
                  onKeyDown={onEnter(handleViewTrackingByCode)}
                />
                <button
                  type="button"
                  className="chat-btn small"
                  onClick={handleViewTrackingByCode}
                >
                  Ver
                </button>
              </div>
            )}

            {step === "ID" && (
              <div className="chat-id-grid-3" style={{ gridTemplateColumns: "1fr", alignItems: "stretch" }}>
                <input
                  type="text"
                  className="chat-phone-input"
                  placeholder="Nombre completo (Ej: María Pérez)"
                  aria-label="Nombre completo"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onKeyDown={onEnter(handleConfirmIdentity)}
                />

                <input
                  type="text"
                  className="chat-phone-input"
                  placeholder="DNI (8+ dígitos)"
                  aria-label="DNI"
                  inputMode="numeric"
                  autoComplete="off"
                  value={dni}
                  onChange={(e) => setDni(e.target.value.replace(/\D/g, "").slice(0, 12))}
                  onKeyDown={onEnter(handleConfirmIdentity)}
                />

                <select className="chat-phone-input" aria-label="País" value={country} onChange={(e) => setCountry(e.target.value)}>
                  <option>Perú</option>
                  <option>México</option>
                  <option>Estados Unidos</option>
                  <option>Chile</option>
                  <option>Colombia</option>
                  <option>Argentina</option>
                  <option>España</option>
                  <option>Otro</option>
                </select>

                <button
                  type="button"
                  className="chat-btn chat-btn-continue"
                  style={{ gridColumn: "1 / -1", minHeight: 42 }}
                  onClick={handleConfirmIdentity}
                  disabled={!canContinueID}
                  title={!canContinueID ? "Completa nombre completo y DNI válido" : "Continuar"}
                >
                  ✅ Continuar
                </button>

                {!canContinueID && (
                  <div className="chat-hint" style={{ gridColumn: "1 / -1", minHeight: 42 }}>
                    Escribe <strong>nombre completo</strong> (2+ palabras) y un{" "}
                    <strong>DNI</strong> válido (8+ dígitos).
                  </div>
                )}
              </div>
            )}

            {step === "SERVICE" && (
              <div className="chat-buttons">
                <button className="chat-btn" type="button" onClick={() => handleServiceSelect("pasaporte_eu")}>
                  Pasaportes & Nacionalidad — USD 4,500
                </button>
                <button className="chat-btn" type="button" onClick={() => handleServiceSelect("green_card")}>
                  Residencia / Green Card — USD 1,400
                </button>
                <button className="chat-btn" type="button" onClick={() => handleServiceSelect("visa")}>
                  Visa Americana Elite — USD 950
                </button>
                <button className="chat-btn ghost" type="button" onClick={() => handleServiceSelect("licencia")}>
                  Licencia Internacional Multipaís — USD 380
                </button>
              </div>
            )}

            {step === "PRIORITY" && (
              <div className="chat-buttons">
                <button className="chat-btn" type="button" onClick={() => handlePriority("alta")}>
                  ⚡ Prioridad Alta — {priorityETA("alta")} (+30%)
                </button>
                <button className="chat-btn ghost" type="button" onClick={() => handlePriority("media")}>
                  ✅ Prioridad Media — {priorityETA("media")}
                </button>
              </div>
            )}

            {step === "SUMMARY" && (
              <div className="chat-summary">
                <div className="chat-inline-card" style={{ margin: "0 0 10px" }}>
                  <div className="chat-inline-title">✅ Resumen final</div>
                  <div className="chat-inline-text">
                    {summaryLines.map((l) => (
                      <div key={l} dangerouslySetInnerHTML={{ __html: l }} />
                    ))}
                  </div>
                </div>

                <div className="chat-buttons">
                  <button className="chat-btn" type="button" onClick={handleAskPhone}>
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {step === "PHONE" && (
              <div className="chat-phone-row">
                <input
                  type="text"
                  className="chat-phone-input"
                  placeholder="+51 987 654 321"
                  aria-label="WhatsApp"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phoneInput}
                  onChange={(e) => {
                    const v = e.target.value;

                    if (!v.startsWith("+")) {
                      const onlyNums = v.replace(/\D/g, "");
                      setPhoneInput("+" + onlyNums);
                      return;
                    }

                    const cleaned = v.replace(/[^\d+\s]/g, "");
                    setPhoneInput(cleaned);
                  }}
                  onKeyDown={onEnter(handleConfirmPhone)}
                />

                <button
                  type="button"
                  className="chat-btn small"
                  onClick={handleConfirmPhone}
                  disabled={!isValidPhoneIntl(phoneInput)}
                  title={!isValidPhoneIntl(phoneInput) ? "Escribe tu WhatsApp con +código de país" : "Confirmar"}
                >
                  Confirmar
                </button>
              </div>
            )}

            {step === "CONFIRM" && (
              <div className="chat-buttons">
                <button className="chat-btn" type="button" onClick={handleSimulatedSale} disabled={processingSale}>
                  {processingSale ? "Generando…" : "Generar orden"}
                </button>

                <button
                  className="chat-btn ghost"
                  type="button"
                  onClick={() => {
                    pushUserMessage("Terminar");
                    setStep("DONE");
                    pushBotMessages(["Listo. Puedes reiniciar cuando quieras."]);
                  }}
                >
                  Terminar
                </button>
              </div>
            )}

            {step === "WA_REDIRECT" && (
              <div className="chat-buttons">
                <button className="chat-btn" type="button" onClick={openWhatsAppCTA} disabled={!lastSimId}>
                  💬 Abrir WhatsApp para coordinar
                </button>

                <button className="chat-btn ghost" type="button" onClick={finishAfterWhatsApp} disabled={!waClicked}>
                  Continuar
                </button>

                {!waClicked && (
                  <div className="chat-hint" style={{ marginTop: 6 }}>
                    Para completar la coordinación debes presionar <strong>“Abrir WhatsApp”</strong>.
                  </div>
                )}
              </div>
            )}

            {step === "DONE" && (
              <div className="chat-footer-note">
                Flujo completado. Usa 🏠 Inicio o ↺ para reiniciar.
              </div>
            )}
          </div>

          {/* PANEL PRIVADO OPERADOR (Ctrl+Shift+O) */}
          {operatorOpen && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(2, 6, 23, 0.72)",
                zIndex: 9999,
                display: "grid",
                placeItems: "center",
                padding: 16,
              }}
              role="dialog"
              aria-modal="true"
            >
              <div
                className="card"
                style={{
                  width: "min(980px, 96vw)",
                  borderRadius: 18,
                  border: "1px solid rgba(148,163,184,0.25)",
                  background: "rgba(15,23,42,0.92)",
                  padding: 16,
                  boxShadow: "0 18px 60px rgba(0,0,0,0.55)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 800, color: "#e5e7eb", fontSize: 16 }}>
                      Panel privado · Operador
                    </div>
                    <div style={{ color: "#9ca3af", fontSize: 12, marginTop: 4 }}>
                      Control manual del tracking (usuario no ve estos controles). Cerrar: <strong>Esc</strong>.
                    </div>
                  </div>
                  <button className="chat-close" type="button" onClick={() => setOperatorOpen(false)} title="Cerrar">
                    ✕
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
                  <div
                    style={{
                      border: "1px solid rgba(148,163,184,0.22)",
                      borderRadius: 14,
                      padding: 12,
                      background: "rgba(2,6,23,0.35)",
                    }}
                  >
                    <div style={{ color: "#e5e7eb", fontWeight: 800, marginBottom: 8 }}>Códigos registrados</div>

                    {operatorCodes.length === 0 ? (
                      <div style={{ color: "#9ca3af", fontSize: 13 }}>Aún no hay solicitudes en esta sesión.</div>
                    ) : (
                      <div style={{ display: "grid", gap: 8, maxHeight: 260, overflow: "auto", paddingRight: 6 }}>
                        {operatorCodes.map((id) => {
                          const pub = publicCodeFromSimId(id);
                          const st = typeof trackingMap[id] === "number" ? trackingMap[id] : 0;
                          const isActive = operatorSelected === id;
                          return (
                            <button
                              key={id}
                              type="button"
                              className={"chat-btn " + (isActive ? "" : "ghost")}
                              style={{
                                textAlign: "left",
                                padding: "10px 12px",
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 10,
                              }}
                              onClick={() => setOperatorSelected(id)}
                            >
                              <span>
                                <span className="id-mono">{pub}</span>
                                <span style={{ display: "block", fontSize: 12, opacity: 0.85, marginTop: 2 }}>
                                  Etapa: {TRACKER_STAGES[st]?.title || "—"}
                                </span>
                              </span>
                              <span style={{ fontSize: 12, opacity: 0.75 }}>Seleccionar</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      border: "1px solid rgba(148,163,184,0.22)",
                      borderRadius: 14,
                      padding: 12,
                      background: "rgba(2,6,23,0.35)",
                    }}
                  >
                    <div style={{ color: "#e5e7eb", fontWeight: 800, marginBottom: 8 }}>Control de etapas</div>

                    {!operatorSelected ? (
                      <div style={{ color: "#9ca3af", fontSize: 13 }}>Selecciona un código de la lista.</div>
                    ) : (
                      <>
                        <div style={{ color: "#9ca3af", fontSize: 13, marginBottom: 10 }}>
                          Código: <span className="id-mono">{publicCodeFromSimId(operatorSelected)}</span>
                        </div>

                        <div style={{ display: "grid", gap: 8 }}>
                          {TRACKER_STAGES.map((st, idx) => {
                            const cur =
                              typeof trackingMap[operatorSelected] === "number"
                                ? trackingMap[operatorSelected]
                                : 0;
                            const active = idx === cur;
                            return (
                              <button
                                key={st.title}
                                type="button"
                                className={"chat-btn " + (active ? "" : "ghost")}
                                onClick={() => operatorSetStage(operatorSelected, idx)}
                                style={{ textAlign: "left", padding: "10px 12px" }}
                              >
                                <strong>{st.title}</strong>
                                <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>{st.desc}</div>
                              </button>
                            );
                          })}
                        </div>

                        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                          <button className="chat-btn" type="button" onClick={() => operatorAdvance(operatorSelected)}>
                            Avanzar 1 etapa
                          </button>
                          <button className="chat-btn ghost" type="button" onClick={() => operatorReset(operatorSelected)}>
                            Reiniciar a Recepción
                          </button>
                          <button
                            className="chat-btn ghost"
                            type="button"
                            onClick={() => {
                              setActiveSimId(operatorSelected);
                              setTrackerOpen(true);
                            }}
                          >
                            Mostrar en tracking del chat
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div style={{ color: "#9ca3af", fontSize: 12, marginTop: 12 }}>
                  Atajo: <strong>Ctrl + Shift + O</strong> abre/cierra este panel.
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};