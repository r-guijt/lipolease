"use client";

import React from "react";
import { Snowflake, Sparkles, Activity, Zap, Play, Calculator, ArrowRight, X } from "lucide-react";
import type { Language } from "@/app/page";

interface Props {
  lang: Language;
  onSimulate: (price: number) => void;
  onRegister: () => void;
}

export default function MachineShowcase({ lang, onSimulate, onRegister }: Props) {
  const [activeVideo, setActiveVideo] = React.useState<string | null>(null);
  const [activeVideoTitle, setActiveVideoTitle] = React.useState<string>("");

  const t = {
    title: lang === "FR" ? "Gamme Cryo-Celsius® & Technologies" : "Cryo-Celsius® Assortiment & Technologie",
    subtitle: lang === "FR" 
      ? "Des dispositifs CE Médicaux de pointe conçus pour maximiser l'efficience de votre cabine sans investissement initial."
      : "Geavanceerde CE Medische apparaten ontworpen om de efficiëntie van uw praktijk te maximaliseren zonder voorafgaande investering.",
    flagshipTitle: lang === "FR" ? "Équipements Phares — Cryolipolyse" : "Flagship Apparatuur — Cryolipolyse",
    complementaryTitle: lang === "FR" ? "Technologies Complémentaires" : "Aanvullende Technologieën",
    flagshipBadge: lang === "FR" ? "PRODUIT PHARE" : "FLAGSHIP",
    ceBadge: "CE Médical IIa",
    simulateBtn: lang === "FR" ? "Simuler le Financement" : "Financiering Simuleren",
    agreeBtn: lang === "FR" ? "Demander l'Agrément" : "Erkenning Aanvragen",
    videoTitle: lang === "FR" ? "Démonstration Vidéo Officielle" : "Officiële Videodemonstratie",
    monthSuffix: lang === "FR" ? "/ mois" : "/ ma",
    startingFrom: lang === "FR" ? "À partir de" : "Vanaf",
    acquisitionPrice: lang === "FR" ? "Valeur d'acquisition :" : "Aankoopwaarde :",
  };

  const flagships = [
    {
      id: "plaques",
      title: lang === "FR" ? "Cryolipolyse Statique 4 / 8 Plaques" : "Statische Cryolipolyse 4 / 8 Platen",
      tagline: lang === "FR" ? "Sécurité thérapeutique absolue, zéro risque de relâchement cutané." : "Absolute therapeutische veiligheid, nul risico op huidverslapping.",
      desc: lang === "FR"
        ? "Technologie exclusive par plaques (sans aspiration) évitant tout traumatisme tissulaire. Permet de traiter jusqu'à 8 zones en simultané avec un refroidissement homogène et doux."
        : "Exclusieve platentechnologie (zonder zuigkracht) die weefseltrauma voorkomt. Hiermee kunnen tot 8 zones tegelijkertijd worden behandeld met een homogene en zachte koeling.",
      specs: lang === "FR" 
        ? ["4 à 8 plaques en simultané", "Zéro CapEx initial requis", "CE Médical Class IIa", "Traitement 100% mains libres"]
        : ["4 tot 8 platen tegelijkertijd", "Geen startinvestering vereist", "CE Medisch Klasse IIa", "100% handsfree behandeling"],
      price: 32000,
      monthlyEst: 690,
      icon: <Snowflake className="w-6 h-6 text-blue-600" />,
      colorClass: "from-blue-50 to-indigo-50 border-blue-200/80 shadow-blue-500/5",
      videoUrl: "/videos/cryo-plates.mp4",
    },
    {
      id: "vacuum",
      title: lang === "FR" ? "Cryolipolyse Vacuum 4D" : "Vacuum Cryolipolyse 4D",
      tagline: lang === "FR" ? "Refroidissement Surround 360° pour zones rebelles." : "360° Surround Koeling voor hardnekkige zones.",
      desc: lang === "FR"
        ? "Système d'aspiration contrôlée avec applicateurs thermo-conducteurs à 360° en silicone médical souple. Destruction maximale des adipocytes sur les zones localisées tenaces."
        : "Gecontroleerd vacuümsysteem met 360° warmtegeleidende applicatoren van zacht medisch silicone. Maximale vernietiging van vetcellen in hardnekkige lokale zones.",
      specs: lang === "FR"
        ? ["Applicateurs 360° Surround", "Cryo-visage & double menton", "Silicone médical souple", "Thermorégulation active"]
        : ["360° Surround Applicatoren", "Cryo-gezicht & onderkin", "Zacht medisch silicone", "Actieve warmteregulatie"],
      price: 35000,
      monthlyEst: 755,
      icon: <Snowflake className="w-6 h-6 text-indigo-600" />,
      colorClass: "from-indigo-50 to-blue-50 border-indigo-200/80 shadow-indigo-500/5",
      videoUrl: "/videos/cryo-vacuum.mp4",
    }
  ];

  const technologies = [
    {
      id: "slim",
      title: "Slim Celsius®",
      tagline: lang === "FR" ? "Radiofréquence, Cavitation & Vacuum LED" : "Radiofrequentie, Cavitatie & Vacuum LED",
      desc: lang === "FR" ? "La synergie ultime pour éliminer la cellulite rebelle, lifter et raffermir la peau en profondeur." : "De ultieme synergie om hardnekkige cellulitis te elimineren, de huid diep te liften en te verstrakken.",
      price: 19900,
      monthlyEst: 430,
      icon: <Sparkles className="w-5 h-5 text-emerald-600" />,
      bgIcon: "bg-emerald-50 text-emerald-700",
      videoUrl: "/videos/slim-celsius.mp4",
    },
    {
      id: "ems",
      title: lang === "FR" ? "Cryo-Électrostimulation" : "Cryo-Elektrostimulatie",
      tagline: lang === "FR" ? "Technologie HI-EMT Ondes Électromagnétiques" : "HI-EMT Elektromagnetische Golventechnologie",
      desc: lang === "FR" ? "Déclenche 30 000 contractions supramaximales en 30 minutes pour tonifier les muscles et brûler les graisses." : "Veroorzaakt 30.000 supramaximale contracties in 30 minuten om spieren te versterken en vet te verbranden.",
      price: 14900,
      monthlyEst: 320,
      icon: <Activity className="w-5 h-5 text-purple-600" />,
      bgIcon: "bg-purple-50 text-purple-700",
      videoUrl: "/videos/ems.mp4",
    },
    {
      id: "laser",
      title: lang === "FR" ? "Laser Diode Triple Onde" : "Triple Golflengte Diodelaser",
      tagline: lang === "FR" ? "755nm + 808nm + 1064nm" : "755nm + 808nm + 1064nm",
      desc: lang === "FR" ? "Épilation définitive ultra-rapide et totalement indolore, hautement efficace sur tous les phototypes de peau." : "Ultrasnelle en volledig pijnloze permanente ontharing, zeer effectief op alle huidtypes.",
      price: 24900,
      monthlyEst: 538,
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      bgIcon: "bg-amber-50 text-amber-700",
      videoUrl: "/videos/diode-laser.mp4",
    },
    {
      id: "lipolaser",
      title: "Laser Slim Celsius",
      tagline: lang === "FR" ? "Laser Lipolyse LLLT Basse Intensité" : "LLLT Koude Laser met Lage Intensiteit",
      desc: lang === "FR" ? "Traitement minceur totalement indolore stimulant la libération d'acides gras et raffermissant le collagène." : "Volledig pijnloze afslankbehandeling die de afgifte van vetzuren stimuleert en collageen verstevigt.",
      price: 11900,
      monthlyEst: 257,
      icon: <Sparkles className="w-5 h-5 text-rose-600" />,
      bgIcon: "bg-rose-50 text-rose-700",
      videoUrl: "/videos/lipo-laser.mp4",
    }
  ];

  return (
    <section className="py-12 space-y-16">
      {/* Introduction */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-indigo-950">
          {t.title}
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Flagships (Cryolipolyse) & Video Demo Side-By-Side */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
          <h3 className="text-2xl font-bold text-slate-900">{t.flagshipTitle}</h3>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Flagship Cards */}
          <div className="lg:col-span-8 grid md:grid-cols-2 gap-6">
            {flagships.map((item) => (
              <div 
                key={item.id}
                className={`relative flex flex-col justify-between rounded-2xl border p-6 bg-gradient-to-br ${item.colorClass} shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-sm">
                      {item.icon}
                      {t.flagshipBadge}
                    </span>
                    <span className="px-2.5 py-0.5 rounded border border-slate-200 text-slate-500 text-[10px] uppercase font-bold bg-white/80 shadow-2xs">
                      {t.ceBadge}
                    </span>
                  </div>

                  <h4 className="text-2xl font-extrabold text-slate-950 tracking-tight mb-2 group-hover:text-blue-950 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-sm font-semibold text-blue-700/90 mb-4">{item.tagline}</p>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">{item.desc}</p>

                  <div className="space-y-2 mb-8 bg-white/60 backdrop-blur-xs rounded-xl p-4 border border-slate-200/50 shadow-3xs">
                    {item.specs.map((spec, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        {spec}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-200/60">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-500 font-medium">{t.acquisitionPrice}</span>
                    <span className="text-lg font-bold text-slate-900">€{item.price.toLocaleString(lang === "FR" ? "fr-FR" : "nl-NL")} <span className="text-[10px] text-slate-400 font-normal">HT</span></span>
                  </div>
                  
                  <div className="flex justify-between items-baseline bg-blue-600/5 p-3 rounded-lg border border-blue-600/10">
                    <span className="text-xs font-semibold text-blue-800">{t.startingFrom}</span>
                    <span className="text-xl font-extrabold text-blue-700">~€{item.monthlyEst} <span className="text-xs font-semibold text-blue-500/80">{t.monthSuffix}</span></span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => onSimulate(item.price)}
                        className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 active:bg-black shadow-sm transition-all duration-200 cursor-pointer"
                      >
                        <Calculator size={13} />
                        {t.simulateBtn}
                      </button>
                      <button
                        onClick={onRegister}
                        className="inline-flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl text-xs font-bold text-blue-700 bg-white hover:bg-slate-50 border border-blue-200 shadow-3xs transition-all duration-200 cursor-pointer"
                      >
                        {t.agreeBtn}
                        <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                    {item.videoUrl && (
                      <button
                        onClick={() => {
                          setActiveVideo(item.videoUrl!);
                          setActiveVideoTitle(item.title);
                        }}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-all duration-200 cursor-pointer border border-slate-200/50"
                      >
                        <Play size={13} className="fill-slate-600 text-slate-600" />
                        {lang === "FR" ? "Voir la démo vidéo" : "Bekijk videodemonstratie"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Official IFrame Video Card */}
          <div className="lg:col-span-4 flex">
            <div className="w-full flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-950 text-white p-6 shadow-lg shadow-slate-900/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-950/20 z-0 pointer-events-none"></div>
              
              <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-blue-400 border border-white/5 shadow-inner">
                    <Play size={12} className="fill-blue-400" />
                    LIVE DEMO
                  </span>
                  <span className="px-2 py-0.5 rounded border border-white/10 text-white/50 text-[9px] uppercase font-bold bg-white/5">
                    HD 1080p
                  </span>
                </div>

                <div>
                  <h4 className="text-xl font-bold tracking-tight text-white">{t.videoTitle}</h4>
                  <p className="text-xs text-white/60 mt-1">
                    {lang === "FR" 
                      ? "Visualisez l'application clinique et l'ergonomie de l'appareil en situation réelle." 
                      : "Bekijk de klinische toepassing en ergonomie van het apparaat in een echte situatie."}
                  </p>
                </div>
              </div>

              {/* Video Container */}
              <div className="relative rounded-xl overflow-hidden aspect-video border border-white/10 shadow-inner bg-slate-900 my-4 z-10">
                <video 
                  src="/videos/general-promo.mp4" 
                  className="w-full h-full object-cover relative z-0"
                  controls
                  preload="metadata"
                />
              </div>

              <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50 font-medium">
                <span>Cryo-Celsius® Liège</span>
                <span className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  {lang === "FR" ? "Actif" : "Actief"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Other Technologies Grid */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <div className="w-2 h-6 bg-slate-400 rounded-full"></div>
          <h3 className="text-2xl font-bold text-slate-950">{t.complementaryTitle}</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {technologies.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bgIcon}`}>
                    {item.icon}
                  </div>
                  <span className="px-2 py-0.5 rounded border border-slate-100 text-slate-400 text-[9px] uppercase font-bold bg-slate-50">
                    {t.ceBadge}
                  </span>
                </div>

                <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors mb-1">{item.title}</h4>
                <p className="text-xs font-semibold text-slate-500 mb-2 leading-snug">{item.tagline}</p>
                <p className="text-slate-600 text-xs leading-relaxed mb-6">{item.desc}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex justify-between items-baseline text-xs text-slate-400 font-medium">
                  <span>{t.acquisitionPrice}</span>
                  <span className="font-bold text-slate-700">€{item.price.toLocaleString(lang === "FR" ? "fr-FR" : "nl-NL")} <span className="text-[9px] font-normal text-slate-400">HT</span></span>
                </div>
                
                <div className="flex justify-between items-baseline bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-semibold text-slate-500">{t.startingFrom}</span>
                  <span className="text-base font-extrabold text-slate-800">~€{item.monthlyEst} <span className="text-[10px] font-semibold text-slate-500/80">{t.monthSuffix}</span></span>
                </div>

                {item.videoUrl ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSimulate(item.price)}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 active:bg-black transition-all cursor-pointer"
                    >
                      <Calculator size={12} />
                      {t.simulateBtn}
                    </button>
                    <button
                      onClick={() => {
                        setActiveVideo(item.videoUrl!);
                        setActiveVideoTitle(item.title);
                      }}
                      className="inline-flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-all cursor-pointer border border-slate-200/40"
                    >
                      <Play size={12} className="fill-slate-600 text-slate-600" />
                      {lang === "FR" ? "Vidéo" : "Video"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onSimulate(item.price)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 active:bg-black transition-all cursor-pointer"
                  >
                    <Calculator size={12} />
                    {t.simulateBtn}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Overlay */}
      {activeVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setActiveVideo(null)}
        >
          <div 
            className="relative max-w-4xl w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800/60 bg-slate-900/40">
              <h4 className="text-lg font-bold text-white tracking-tight">{activeVideoTitle}</h4>
              <button 
                onClick={() => setActiveVideo(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Video Element */}
            <div className="aspect-video bg-black flex items-center justify-center">
              <video 
                src={activeVideo} 
                controls 
                autoPlay 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
