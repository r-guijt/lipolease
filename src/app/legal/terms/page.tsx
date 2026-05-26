"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Scale, ArrowLeft } from "lucide-react";
import type { Language } from "@/app/page";

function TermsContent() {
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
    router.push(`/legal/terms?lang=${newLang}`);
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
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0 shadow-3xs">
              <Scale size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                {lang === "FR" 
                  ? "CONDITIONS GÉNÉRALES D'UTILISATION ET DE MISE EN RELATION (CGU)" 
                  : "ALGEMENE GEBRUIKS- EN BEMIDDELINGSVOORWAARDEN (AV)"}
              </h1>
              <p className="text-slate-400 text-[10px] font-bold uppercase mt-0.5 tracking-wider">
                {lang === "FR" ? "Plateforme Antigravity B2B" : "Antigravity Platform B2B"}
              </p>
            </div>
          </div>

          {lang === "FR" ? (
            <div className="space-y-6 text-slate-700 leading-relaxed text-sm">
              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-950">1. Statut d'Intermédiaire et Rôle d'Antigravity</h3>
                <p>
                  La plateforme Antigravity, opérée par [Nom de votre Entité Légale], agit exclusivement en tant qu'intermédiaire commercial B2B. Notre rôle se limite à la mise en relation entre des professionnels du secteur médical/clinique d'une part, et des fournisseurs d'équipements de bien-être/médicaux (tels que Cryo-Celsius) ainsi que des organismes de financement (crédit-bail/renting) d'autre part.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-950">2. Exclusion Spécifique de Responsabilité Matérielle (Équipement)</h3>
                <p>
                  Antigravity n'est ni le fabricant, ni le vendeur direct, ni l'installateur des machines présentées sur la plateforme. En conséquence :
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Aucune garantie, expresse ou implicite, n'est fournie par Antigravity quant au fonctionnement, à l'efficacité clinique, aux pannes, ou aux défauts des machines (notamment les équipements Cryo-Celsius).</li>
                  <li>Toute réclamation relative au matériel, au service après-vente (SAV), à la maintenance ou à la conformité technique doit être exclusivement adressée au fabricant/fournisseur agréé.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-950">3. Exclusion Spécifique de Responsabilité Financière (Leasing)</h3>
                <p>
                  Les simulations financières affichées sur notre plateforme sont purement indicatives.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Antigravity n'est pas un établissement de crédit ni un intermédiaire en services bancaires.</li>
                  <li>L'octroi du financement est soumis à l'approbation exclusive de l'organisme de leasing tiers choisi par le client.</li>
                  <li>Antigravity ne saurait être tenu responsable du refus d'un dossier de financement, de la modification des taux d'intérêt, ni de tout litige contractuel survenant entre le professionnel et l'institution financière.</li>
                </ul>
              </section>

              <section className="space-y-3 bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  4. Restriction d'Accès et Décharge Légale
                </h3>
                <p className="text-xs">
                  Conformément à la législation belge (Loi du 10 mai 2015 LEPSS et Avis du CSS n° 9430), l'accès aux équipements de cryolipolyse est strictement réservé aux professionnels de santé autorisés. L'utilisateur de la plateforme est seul responsable de la vérification de ses propres droits d'exercice. Antigravity décline toute responsabilité en cas de fausse déclaration ou d'usage illégal du matériel par un tiers non habilité.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-950">5. Droit Applicable et Juridiction</h3>
                <p>
                  Les présentes conditions sont régies par le droit belge. Tout litige relatif à l'utilisation de la plateforme sera de la compétence exclusive des tribunaux de Bruxelles.
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-6 text-slate-700 leading-relaxed text-sm">
              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-950">1. Status van Tussenpersoon en Rol van Antigravity</h3>
                <p>
                  Het platform Antigravity, geëxploiteerd door [Naam van uw juridische entiteit], treedt uitsluitend op als commerciële B2B-tussenpersoon. Onze rol is strikt beperkt tot het in contact brengen van enerzijds medische en klinische professionals en anderzijds leveranciers van welzijns-/medische apparatuur (zoals Cryo-Celsius) en financieringsmaatschappijen (leasing/renting).
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-950">2. Specifieke Uitsluiting van Materiële Aansprakelijkheid (Apparatuur)</h3>
                <p>
                  Het platform is de fabrikant, noch de directe verkoper, noch de installateur van de op het platform getoonde machines. Bijgevolg:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Wordt door Antigravity geen enkele expliciete of impliciete garantie gegeven met betrekking tot de werking, de klinische effectiviteit, storingen of defecten van de machines (in het bijzonder de Cryo-Celsius-apparatuur).</li>
                  <li>Elke claim met betrekking tot het materiaal, de klantenservice (after-sales), het onderhoud of de technische conformiteit moet uitsluitend worden gericht aan de fabrikant/erkende leverancier.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-950">3. Specifieke Uitsluiting van Financiële Aansprakelijkheid (Leasing)</h3>
                <p>
                  De financiële simulaties die op ons platform worden weergegeven, zijn louter indicatief.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Antigravity is geen kredietinstelling of tussenpersoon in bankdiensten.</li>
                  <li>De toekenning van de financiering is onderworpen aan de exclusieve goedkeuring van de externe leasingmaatschappij die door de klant is gekozen.</li>
                  <li>Antigravity kan niet aansprakelijk worden gesteld voor de afwijzing van een financieringsdossier, wijzigingen in de rentetarieven, of enig contractueel geschil dat ontstaat tussen de professional en de financiële instelling.</li>
                </ul>
              </section>

              <section className="space-y-3 bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  4. Toegangsbeperking en Wettelijke Vrijwaring
                </h3>
                <p className="text-xs">
                  Overeenkomstig de Belgische wetgeving (Wet van 10 mei 2015 WUG en Advies van de Hoge Gezondheidsraad nr. 9430) is de toegang tot cryolipolyse-apparatuur strikt voorbehouden aan bevoegde zorgverleners. De gebruiker van het platform is als enige verantwoordelijk voor de verificatie van zijn eigen uitoefeningsrechten. Antigravity wijst alle aansprakelijkheid af in geval van valse verklaringen of illegaal gebruik van het materiaal door een onbevoegde derde.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-950">5. Toepasselijk Recht en Bevoegde Rechtbank</h3>
                <p>
                  Deze voorwaarden worden beheerst door het Belgisch recht. Elk geschil met betrekking tot het gebruik van het platform valt onder de exclusieve bevoegdheid van de rechtbanken van Brussel.
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

export default function TermsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-medium">Chargement...</div>}>
      <TermsContent />
    </Suspense>
  );
}
