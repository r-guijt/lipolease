"use client";

import React, { useState } from "react";
import Link from "next/link";
import RegistrationForm from "@/components/RegistrationForm";
import ROICalculator from "@/components/ROICalculator";
import FeaturesSection from "@/components/FeaturesSection";
import MachineShowcase from "@/components/MachineShowcase";
import ContactForm from "@/components/ContactForm";
import { User, Calculator, ArrowRight, FileText } from "lucide-react";
import type { Language } from "./page";

interface Props {
  initialSettings: Record<string, string>;
  initialProviders?: any[];
}

export default function HomeClient({ initialSettings, initialProviders }: Props) {
  const [lang, setLang] = useState<Language>("FR");
  const [devicePrice, setDevicePrice] = useState(32000); // Defaults to the flagship 4/8 plaques config (€32,000)

  const handleScrollToAgrement = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const element = document.getElementById("agrement");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleScrollToContact = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const element = document.getElementById("contact-documentation");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSimulate = (price: number) => {
    setDevicePrice(price);
    const element = document.getElementById("roi-simulator");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const t = {
    badge: lang === "FR" ? "Distributeur Exclusif — France & Belgique" : "Exclusieve Distributeur — Frankrijk & België",
    title: lang === "FR" ? "Cryo-Celsius®" : "Cryo-Celsius®",
    subtitle: lang === "FR" 
      ? "L'excellence de la cryolipolyse médicale européenne. Acquérez le dispositif CE Médical de référence sans CapEx initial grâce à nos solutions de leasing fiscalement optimisées." 
      : "De uitmuntendheid van Europese medische cryolipolyse. Verwerf het toonaangevende CE Medische apparaat zonder CapEx vooraf dankzij onze fiscaal geoptimaliseerde leasingsoplossingen."
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/30">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/50 via-slate-50 to-emerald-100/50 pointer-events-none"></div>

      {/* Sticky Premium Navbar */}
      <nav className="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white/70 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-xl md:text-2xl bg-gradient-to-r from-blue-900 to-indigo-950 bg-clip-text text-transparent tracking-tight pb-1 leading-normal">
              LipoLease
            </span>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            {/* CTA Button "Créer un compte" / "Account aanmaken" */}
            <a
              href="#agrement"
              onClick={handleScrollToAgrement}
              className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <User size={16} className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span>{lang === "FR" ? "Créer un compte" : "Account aanmaken"}</span>
            </a>

            {/* Language Selector */}
            <div className="inline-flex items-center gap-1 bg-slate-100/85 border border-slate-200/50 rounded-full p-0.5 shadow-2xs">
              <button 
                onClick={() => setLang("FR")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${lang === "FR" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:bg-white/40"}`}
              >
                FR
              </button>
              <button 
                onClick={() => setLang("NL")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${lang === "NL" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:bg-white/40"}`}
              >
                NL
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-6 pb-20 pt-4 space-y-16">
        {/* Split Hero Section */}
        <section className="grid lg:grid-cols-12 gap-12 items-center pt-8">
          {/* Left Column (Content & CTAs) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              {t.badge}
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {t.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
              {t.subtitle}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => handleScrollToContact()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <FileText size={16} />
                {lang === "FR" ? "Obtenir la Documentation" : "Documentatie Aanvragen"}
              </button>
              <button
                onClick={() => handleSimulate(32000)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <Calculator size={16} />
                {lang === "FR" ? "Simuler le Financement" : "Financiering Simuleren"}
              </button>
            </div>
          </div>

          {/* Right Column (Prominent Autoplaying Video) */}
          <div className="lg:col-span-5 w-full">
            <div className="w-full rounded-3xl border border-slate-200/80 bg-slate-950 text-white p-4 shadow-xl shadow-slate-950/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-950/15 z-0 pointer-events-none"></div>

              {/* Video Element */}
              <div className="relative rounded-2xl overflow-hidden aspect-video border border-white/10 bg-slate-900 shadow-inner z-10">
                <video 
                  src="/videos/general-promo.mp4" 
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  preload="metadata"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Lightweight Contact Lead Form Section */}
        <section id="contact-documentation" className="scroll-mt-28 py-4">
          <ContactForm lang={lang} />
        </section>

        {/* 1. Brand Showcase catalog */}
        <MachineShowcase 
          lang={lang} 
          onSimulate={handleSimulate} 
          onRegister={() => handleScrollToAgrement()} 
        />

        {/* 2. Horizontal Simulator Dashboard */}
        <div id="roi-simulator" className="scroll-mt-28 max-w-6xl mx-auto pt-6">
          <ROICalculator 
            lang={lang}
            devicePrice={devicePrice}
            setDevicePrice={setDevicePrice}
            initialSettings={initialSettings}
            initialProviders={initialProviders}
          />
        </div>

        {/* 3. Onboarding Agrément & KYC Form */}
        <div id="agrement" className="scroll-mt-28 max-w-md mx-auto pt-6">
          <RegistrationForm lang={lang} />
        </div>

        {/* 4. Technology Features Highlights */}
        <div className="pt-6">
          <FeaturesSection lang={lang} />
        </div>
      </main>

      {/* Premium B2B Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center justify-between">
          <div className="space-y-3">
            <span className="font-extrabold text-lg text-slate-900 tracking-tight">
              LipoLease
            </span>
            <p className="text-xs text-slate-500 max-w-sm">
              {lang === "FR" 
                ? "Distributeur exclusif de dispositifs médicaux certifiés CE Médical IIa pour la France et la Belgique."
                : "Exclusieve distributeur van CE Medisch IIa gecertificeerde medische apparatuur voor Frankrijk en België."}
            </p>
          </div>

          <div className="flex flex-col md:items-end gap-3">
            <div className="flex flex-wrap gap-6 text-xs font-bold text-slate-600">
              <Link 
                href={`/legal/terms?lang=${lang}`}
                className="hover:text-blue-600 transition-colors"
              >
                {lang === "FR" ? "Conditions Générales de Vente" : "Algemene Voorwaarden"}
              </Link>
              <Link 
                href={`/legal/privacy?lang=${lang}`}
                className="hover:text-blue-600 transition-colors"
              >
                {lang === "FR" ? "Politique de Confidentialité" : "Privacybeleid & GDPR"}
              </Link>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              © {new Date().getFullYear()} Well Being Distribution SRL. {lang === "FR" ? "Tous droits réservés." : "Alle rechten voorbehouden."}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
