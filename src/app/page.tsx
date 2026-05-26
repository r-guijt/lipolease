"use client";

import React, { useState } from "react";
import Link from "next/link";
import RegistrationForm from "@/components/RegistrationForm";
import ROICalculator from "@/components/ROICalculator";
import FeaturesSection from "@/components/FeaturesSection";
import MachineShowcase from "@/components/MachineShowcase";
import { User } from "lucide-react";

export type Language = "FR" | "NL";

export default function Home() {
  const [lang, setLang] = useState<Language>("FR");
  const [devicePrice, setDevicePrice] = useState(32000); // Defaults to the flagship 4/8 plaques config (€32,000)

  const handleScrollToAgrement = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const element = document.getElementById("agrement");
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
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-xl md:text-2xl bg-gradient-to-r from-blue-900 to-indigo-950 bg-clip-text text-transparent tracking-tight">
              Cryo-Celsius®
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* CTA Button "Créer un compte" / "Account aanmaken" */}
            <a
              href="#agrement"
              onClick={handleScrollToAgrement}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <User size={16} />
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
        <header className="text-center mb-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            {t.badge}
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-900 via-slate-900 to-slate-700 drop-shadow-sm">
            {t.title}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </header>

        {/* 1. Brand Showcase catalog (with Flagship focus & Embedded Video) */}
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
              Cryo-Celsius® <span className="text-slate-400 font-normal text-xs">by Well Being Distribution</span>
            </span>
            <p className="text-xs text-slate-500 max-w-sm">
              {lang === "FR" 
                ? "Distributeur exclusif de dispositifs médicaux certifiés CE Médical IIa pour la France et la Belgique."
                : "Exclusieve distributeur van CE Medisch IIa gecertificeerde medische apparatuur voor Frankrijk en België."}
            </p>
            <p className="text-[10px] text-slate-400">
              Chaussée de Tongres 482, 4000 Liège, Belgique | info@cryo-celsius.be | +32 489 81 95 21
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
