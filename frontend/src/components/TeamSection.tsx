import React, { useContext, useMemo } from "react";
import { I18nContext, type Locale } from "../i18n";

type TeamMemberKey = "alexander" | "laura" | "samuel" | "maria";

type TeamMember = {
  key: TeamMemberKey;
  name: string;
  photo: string;
};

type TeamDict = {
  title: string;
  lead: string;
  roles: Record<TeamMemberKey, string>;
};

const TEAM_COPY: Record<Locale, TeamDict> = {
  es: {
    title: "Equipo Ejecutivo Internacional",
    lead: "Equipo de coordinación y control de proceso, con seguimiento por etapas.",
    roles: {
      alexander: "Director General de Operaciones",
      laura: "Gerente de Tramitación Internacional",
      samuel: "Coordinador de Análisis Legal",
      maria: "Asesora Ejecutiva Senior",
    },
  },

  en: {
    title: "International Executive Team",
    lead: "Coordination and process control team with stage-by-stage tracking.",
    roles: {
      alexander: "Director of Operations",
      laura: "International Processing Manager",
      samuel: "Legal Analysis Coordinator",
      maria: "Senior Executive Advisor",
    },
  },

  fr: {
    title: "Équipe Exécutive Internationale",
    lead: "Équipe de coordination et de contrôle du processus, avec suivi par étapes.",
    roles: {
      alexander: "Directeur des Opérations",
      laura: "Responsable de la gestion internationale",
      samuel: "Coordinateur d’analyse juridique",
      maria: "Conseillère exécutive senior",
    },
  },

  pt: {
    title: "Equipe Executiva Internacional",
    lead: "Equipe de coordenação e controle do processo, com acompanhamento por etapas.",
    roles: {
      alexander: "Diretor de Operações",
      laura: "Gerente de Tramitação Internacional",
      samuel: "Coordenador de Análise Jurídica",
      maria: "Consultora Executiva Sênior",
    },
  },

  de: {
    title: "Internationales Executive-Team",
    lead: "Team für Koordination und Prozesskontrolle mit Tracking nach Phasen.",
    roles: {
      alexander: "Leiter Operations",
      laura: "Managerin Internationale Abwicklung",
      samuel: "Koordinator Rechtliche Analyse",
      maria: "Senior Executive Advisor",
    },
  },

  it: {
    title: "Team Esecutivo Internazionale",
    lead: "Team di coordinamento e controllo del processo, con tracciamento per fasi.",
    roles: {
      alexander: "Direttore Operativo",
      laura: "Responsabile pratiche internazionali",
      samuel: "Coordinatore analisi legale",
      maria: "Consulente esecutiva senior",
    },
  },

  ar: {
    title: "فريق تنفيذي دولي",
    lead: "فريق للتنسيق والتحكم في العملية مع تتبّع حسب المراحل.",
    roles: {
      alexander: "مدير العمليات العام",
      laura: "مديرة المعاملات الدولية",
      samuel: "منسّق التحليل القانوني",
      maria: "مستشارة تنفيذية أولى",
    },
  },

  ru: {
    title: "Международная исполнительная команда",
    lead: "Команда координации и контроля процесса с отслеживанием по этапам.",
    roles: {
      alexander: "Директор по операциям",
      laura: "Руководитель международного оформления",
      samuel: "Координатор юридического анализа",
      maria: "Старший исполнительный консультант",
    },
  },
};

export const TeamSection: React.FC = () => {
  const { locale, isRTL } = useContext(I18nContext);

  const copy = useMemo(() => TEAM_COPY[locale] || TEAM_COPY.es, [locale]);

  const team: TeamMember[] = [
    { key: "alexander", name: "Alexander M.", photo: "/assets/team/alexander-moretti.jpg" },
    { key: "laura", name: "Laura B.", photo: "/assets/team/laura-benavides.jpg" },
    { key: "samuel", name: "Samuel D.", photo: "/assets/team/samuel-duarte.jpg" },
    { key: "maria", name: "María S.", photo: "/assets/team/maria-soliani.jpg" },
  ];

  return (
    <section id="equipo" className="section" style={{ direction: isRTL ? "rtl" : "ltr" }}>
      <h2>{copy.title}</h2>
      <p className="muted">{copy.lead}</p>

      <div className="team-grid">
        {team.map((m) => {
          const role = copy.roles[m.key];

          return (
            <div key={m.name} className="team-card">
              {/* Foto grande (cuadrada) */}
              <div className="team-photo" aria-hidden="true">
                <img
                  src={m.photo}
                  alt={`${m.name} - ${role}`}
                  className="team-photo-img"
                  loading="lazy"
                  onError={(e) => {
                    const img = e.currentTarget;
                    img.style.display = "none";
                    const parent = img.parentElement as HTMLElement | null;
                    if (parent) parent.classList.add("team-photo-fallback");
                  }}
                />
              </div>

              <div className="team-meta">
                <h3 className="team-name">{m.name}</h3>
                <p className="team-role">{role}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};