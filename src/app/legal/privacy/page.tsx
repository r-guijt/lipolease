"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import type { Language } from "@/app/page";

function PrivacyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [lang, setLang] = useState<Language>("FR");

  useEffect(() => {
    const l = searchParams.get("lang");
    if (l === "NL" || l === "FR") {
      setLang(l);
    }
  }, [searchParams]);

  const handleLangChange = (newLang: Language) => {
    setLang(newLang);
    router.push(`/legal/privacy?lang=${newLang}`);
  };

  const handleBack = () => {
    router.push(`/?lang=${lang}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/30">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/50 via-slate-50 to-emerald-100/50 pointer-events-none"></div>

      {/* Sticky Premium Navbar */}
      <nav className="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white/70 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold text-sm transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>{lang === "FR" ? "Retour au site" : "Terug naar site"}</span>
          </button>
          
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="inline-flex items-center gap-1 bg-slate-100/85 border border-slate-200/50 rounded-full p-0.5 shadow-2xs">
              <button 
                onClick={() => handleLangChange("FR")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${lang === "FR" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:bg-white/40"}`}
              >
                FR
              </button>
              <button 
                onClick={() => handleLangChange("NL")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${lang === "NL" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:bg-white/40"}`}
              >
                NL
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-6 max-w-4xl py-12">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-8 md:p-12">
          
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0 shadow-3xs">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                {lang === "FR" ? "POLITIQUE DE CONFIDENTIALITÉ (RGPD)" : "PRIVACYVERKLARING (AVG/GDPR)"}
              </h1>
              <p className="text-slate-400 text-[10px] font-bold uppercase mt-0.5 tracking-wider">
                {lang === "FR" ? "Well Being Distribution SRL" : "Well Being Distribution SRL"}
              </p>
            </div>
          </div>

          {lang === "FR" ? (
            <div className="space-y-6 text-slate-700 leading-relaxed text-sm">
              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-950">1. Données Collectées</h3>
                <p>
                  Dans le cadre de notre activité d'intermédiation B2B, nous collectons les données suivantes : Nom, Prénom, Adresse e-mail professionnelle, Numéro de téléphone, Numéro de TVA/BCE, ainsi que vos identifiants professionnels de santé (Numéro INAMI en Belgique ou Numéro RPPS en France).
                </p>
              </section>

              <section className="space-y-3 bg-emerald-50/50 p-5 rounded-xl border border-emerald-100">
                <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  2. Finalité du Traitement
                </h3>
                <p>Ces données sont collectées et traitées uniquement pour :</p>
                <ol className="list-decimal pl-5 space-y-1.5">
                  <li>Vérifier votre éligibilité légale à l'achat ou au leasing de matériel médical (Gating Réglementaire).</li>
                  <li>Transmettre votre dossier de demande de leasing aux partenaires financiers sélectionnés, uniquement après votre accord exprès via le simulateur.</li>
                </ol>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-950">3. Partage des Données avec des Tiers</h3>
                <p>
                  En tant qu'intermédiaire, vos données d'identification et les informations financières de votre demande seront transmises de manière sécurisée aux tiers indispensables à l'exécution de votre demande : le fournisseur de la machine (Cryo-Celsius) et l'organisme de financement partenaire.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-950">4. Vos Droits</h3>
                <p>
                  Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de portabilité et de suppression de vos données personnelles. Vous pouvez exercer ces droits en nous contactant.
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-6 text-slate-700 leading-relaxed text-sm">
              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-950">1. Verzamelde Gegevens</h3>
                <p>
                  In het kader van onze B2B-bemiddelingsactiviteiten verzamelen wij de volgende gegevens: Naam, Voornaam, Zakelijk e-mailadres, Telefoonnummer, BTW-/KBO-nummer, evenals uw professionele identificatiegegevens als zorgverlener (RIZIV-nummer in België of RPPS-nummer in Frankrijk).
                </p>
              </section>

              <section className="space-y-3 bg-emerald-50/50 p-5 rounded-xl border border-emerald-100">
                <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  2. Doel van de Verwerking
                </h3>
                <p>Deze gegevens worden uitsluitend verzameld en verwerkt om:</p>
                <ol className="list-decimal pl-5 space-y-1.5">
                  <li>Uw wettelijke geschiktheid voor de aankoop of leasing van medische apparatuur te verifiëren (Regulatorische Gating).</li>
                  <li>Uw leaseaanvraag door te sturen naar de geselecteerde financiële partners, uitsluitend na uw uitdrukkelijke toestemming via de simulator.</li>
                </ol>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-950">3. Delen van Gegevens met Derden</h3>
                <p>
                  Als tussenpersoon worden uw identificatiegegevens en de financiële informatie van uw aanvraag veilig doorgegeven aan de derden die essentieel zijn voor de uitvoering van uw aanvraag: de leverancier van de machine (Cryo-Celsius) en de partner-financieringsinstelling.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-950">4. Uw Rechten</h3>
                <p>
                  In overeenstemming met de AVG (GDPR) heeft u recht op inzage, rectificatie, overdraagbaarheid en het wissen van uw persoonsgegevens. U kunt deze rechten uitoefenen door contact met ons op te nemen.
                </p>
              </section>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>© Copyright 2026 Well Being Distribution SRL. Tous droits réservés.</span>
            <span>v1.3 (2026-05)</span>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-medium">Chargement...</div>}>
      <PrivacyContent />
    </Suspense>
  );
}
