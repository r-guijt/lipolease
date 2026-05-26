import React from "react";
import { Activity, Snowflake, RefreshCcw, TrendingUp, ShieldCheck } from "lucide-react";
import type { Language } from "@/app/page";

interface Props {
  lang: Language;
}

export default function FeaturesSection({ lang }: Props) {
  const t = {
    title: lang === "FR" ? "La Technologie Cryo-Celsius®" : "Cryo-Celsius® Technologie",
    subtitle: lang === "FR" 
      ? "L'ingénierie médicale européenne de pointe au service du remodelage corporel." 
      : "Geavanceerde Europese medische engineering ten dienste van lichaamscontouren.",
    features: [
      {
        icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
        title: lang === "FR" ? "CE Médical Class IIa (2460)" : "CE Medisch Klasse IIa (2460)",
        desc: lang === "FR" 
          ? "Dispositif médical certifié sous la directive 93/42/CEE, assurant une sécurité thérapeutique totale et des résultats cliniquement prouvés." 
          : "Gecertificeerd medisch hulpmiddel onder Richtlijn 93/42/EEG, wat absolute therapeutische veiligheid en klinisch bewezen resultaten garandeert."
      },
      {
        icon: <Snowflake className="w-8 h-8 text-blue-600" />,
        title: lang === "FR" ? "4 Applicateurs en Simultané" : "4 Simultane Applicatoren",
        desc: lang === "FR"
          ? "Traitez jusqu'à 4 zones distinctes en une seule séance. Divisez par deux le temps de traitement et doublez le rendement horaire de votre cabine."
          : "Behandel tot 4 verschillende zones in één enkele sessie. Halveer de behandeltijd en verdubbel het uurrendement van uw praktijk."
      },
      {
        icon: <RefreshCcw className="w-8 h-8 text-blue-600" />,
        title: lang === "FR" ? "Double Choc Thermique" : "Dubbele Thermische Schok",
        desc: lang === "FR"
          ? "Chauffage initial à 42°C pour assouplir les tissus puis refroidissement contrôlé à -10°C, maximisant l'apoptose des adipocytes."
          : "Initiële opwarming tot 42°C om weefsels te versoepelen, gevolgd door gecontroleerde afkoeling tot -10°C om adipocyt-apoptose te maximaliseren."
      },
      {
        icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
        title: lang === "FR" ? "Conception Européenne" : "Europees Ontwerp & Kwaliteit",
        desc: lang === "FR"
          ? "Conçu, fabriqué et assemblé en Europe. Matériaux biocompatibles haut de gamme, fiabilité inégalée et logiciel clinique de pointe."
          : "Ontworpen, vervaardigd en geassembleerd in Europa. Hoogwaardige biocompatibele materialen, ongeëvenaarde betrouwbaarheid en geavanceerde klinische software."
      }
    ]
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/50 to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            {t.title}
          </h2>
          <p className="text-lg text-slate-600">
            {t.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.features.map((feature, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
