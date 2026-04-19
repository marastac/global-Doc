import React, { useContext, useMemo } from "react";
import { I18nContext, type Locale } from "../i18n";

type AlertCopy = {
  text: string;
};

const ALERT_COPY: Record<Locale, AlertCopy> = {
  es: { text: "Más de 3 mil clientes satisfechos" },
  en: { text: "More than 3 thousand satisfied customers" },
  fr: { text: "Plus de 3 mille clients satisfaits" },
  pt: { text: "Mais de 3 mil clientes satisfeitos" },
  de: { text: "Mehr als 3 Tausend zufriedene Kunden" },
  it: { text: "Oltre 3 mila clienti soddisfatti" },
  ar: { text: "أكثر من 3 آلاف عميل راضٍ" },
  ru: { text: "Более 3 тысяч довольных клиентов" },
};
export const AlertBar: React.FC = () => {
  const { locale, isRTL } = useContext(I18nContext);
  const copy = useMemo(() => ALERT_COPY[locale] || ALERT_COPY.es, [locale]);

  return (
    <div className="top-alert" style={{ direction: isRTL ? "rtl" : "ltr" }}>
      {copy.text}
    </div>
  );
};