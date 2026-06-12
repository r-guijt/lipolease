"use client";

import React, { useState, useEffect } from "react";
import { Calculator, Euro, Users, TrendingUp, Info } from "lucide-react";
import type { Language } from "@/app/page";

interface Props {
  lang: Language;
  devicePrice?: number;
  setDevicePrice?: (price: number) => void;
  initialSettings?: Record<string, string>;
  initialProviders?: any[];
}

export default function ROICalculator({ 
  lang, 
  devicePrice: externalDevicePrice, 
  setDevicePrice: externalSetDevicePrice,
  initialSettings,
  initialProviders
}: Props) {
  // Use local state if no external state is passed, but support dynamic external state
  const [localDevicePrice, localSetDevicePrice] = useState(30000);
  const devicePrice = externalDevicePrice !== undefined ? externalDevicePrice : localDevicePrice;
  const setDevicePrice = externalSetDevicePrice !== undefined ? externalSetDevicePrice : localSetDevicePrice;

  const [monthlyPatients, setMonthlyPatients] = useState(5);
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  
  // Set default session price based on lang & settings
  const [sessionPrice, setSessionPrice] = useState(() => {
    return lang === "FR" 
      ? parseFloat(initialSettings?.fr_default_price || "400") 
      : parseFloat(initialSettings?.be_default_national_price || "250");
  });

  // Simulation Lead states
  const [leadEmail, setLeadEmail] = useState("");
  const [leadConsent, setLeadConsent] = useState(false);
  const [isLeadLoading, setIsLeadLoading] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  // Dynamically update default session price when language changes
  useEffect(() => {
    setSessionPrice(
      lang === "FR" 
        ? parseFloat(initialSettings?.fr_default_price || "400") 
        : parseFloat(initialSettings?.be_default_national_price || "250")
    );
  }, [lang, initialSettings]);

  const DEFAULT_LEASING_RATE = parseFloat(initialSettings?.leasing_rate || "0.0216");

  // Filter and compute rates from database providers
  const availableRates = (initialProviders || [])
    .filter((p: any) => p.isActive)
    .map((p: any) => {
      const rateObj = p.rates.find((r: any) => r.durationMonths === selectedDuration);
      return {
        providerName: p.name,
        apr: rateObj ? rateObj.apr : null
      };
    })
    .filter((item: any) => item.apr !== null);

  const bestRateObj = availableRates.length > 0 
    ? availableRates.reduce((prev: any, curr: any) => (prev.apr < curr.apr ? prev : curr))
    : null;

  const leasingRate = bestRateObj ? bestRateObj.apr : DEFAULT_LEASING_RATE;

  const monthlyLease = devicePrice * leasingRate;
  const monthlyRevenue = sessionPrice * monthlyPatients;
  const breakEvenPatients = monthlyLease / sessionPrice;

  // Tax Logic
  const taxDeductionRentFR = monthlyLease * parseFloat(initialSettings?.fr_tax_deduction_rate || "1.00");
  const basicInvestmentDeductionBE = devicePrice * parseFloat(initialSettings?.be_tax_deduction_rate || "0.10");

  const t = {
    title: lang === "FR" ? "Simulateur de Rentabilité & Financement" : "Rentabiliteit & Financieringscalculator",
    subtitle: lang === "FR" ? "Optimisez votre acquisition de matériel médical sans mobiliser votre trésorerie grâce au renting / crédit-bail fiscal." : "Optimaliseer uw aankoop van medische apparatuur zonder uw cashflow aan te spreken dankzij fiscale leasing/renting.",
    devicePrice: lang === "FR" ? "Prix d'acquisition (€ HT)" : "Aankooprijs (€ Excl. btw)",
    monthlyPatients: lang === "FR" ? "Patients / Cures mensuels" : "Patiënten / Kuren per maand",
    sessionPrice: lang === "FR" ? "Tarif séance (€)" : "Tarief per sessie (€)",
    leasingCostTitle: lang === "FR" ? "Mensualité Estimée" : "Geschatte Maandtermijn",
    monthlyRevTitle: lang === "FR" ? "Revenu Mensuel Brut" : "Bruto Maandomzet",
    breakEvenTitle: lang === "FR" ? "Seuil de Rentabilité Cryo-Celsius®" : "Break-evenpunt Cryo-Celsius®",
    breakEvenDesc: lang === "FR" ? `Il vous suffit de` : `U heeft slechts`,
    breakEvenDesc2: lang === "FR" ? `séance(s) par mois pour couvrir le financement.` : `sessie(s) per maand nodig om de financiering te dekken.`,
    cashflowDesc: lang === "FR"
      ? `Avec ${monthlyPatients} patients, votre flux de trésorerie net positif est de`
      : `Met ${monthlyPatients} patiënten is uw netto positieve cashflow`,
    cashflowDesc2: lang === "FR" ? `avant impôts.` : `vóór belastingen.`,
    taxOptimization: lang === "FR" ? "Optimisation Fiscale & Financement" : "Fiscale Optimalisatie & Renting",
    // Simulation Lead Translations
    leadTitle: lang === "FR" ? "Recevoir cette simulation par email" : "Ontvang deze simulatie per e-mail",
    leadDesc: lang === "FR" ? "Envoyez-vous les détails complets de cette simulation (loyer, chiffre d'affaires, seuil de rentabilité)." : "Stuur uzelf de volledige details van deze simulatie (lease, omzet, break-even).",
    leadEmailPlaceholder: lang === "FR" ? "votre@email.com" : "uw@e-mail.com",
    leadConsentText: lang === "FR"
      ? "J'accepte de recevoir ma simulation par email et que mes données soient traitées conformément à la"
      : "Ik ga ermee akkoord mijn simulatie per e-mail te ontvangen en dat mijn gegevens worden verwerkt in overeenstemming met de",
    leadPrivacyLink: lang === "FR" ? "Politique de Confidentialité" : "Privacybeleid & GDPR",
    leadSubmitBtn: lang === "FR" ? "Envoyer" : "Verzenden",
    leadErrorEmail: lang === "FR" ? "Veuillez entrer une adresse email valide." : "Voer een geldig e-mailadres in.",
    leadErrorConsent: lang === "FR" ? "Vous devez accepter la politique de confidentialité." : "U moet akkoord gaan met het privacybeleid.",
    leadErrorSubmit: lang === "FR" ? "Erreur lors de l'envoi. Veuillez réessayer." : "Fout bij het verzenden. Probeer het opnieuw.",
    leadSuccessMsg: lang === "FR" ? "Simulation envoyée avec succès !" : "Simulatie succesvol verzonden!"
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadError(null);

    if (!leadEmail || !leadEmail.includes("@")) {
      setLeadError(t.leadErrorEmail);
      return;
    }

    if (!leadConsent) {
      setLeadError(t.leadErrorConsent);
      return;
    }

    setIsLeadLoading(true);

    try {
      const res = await fetch("/api/leads/simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: leadEmail,
          devicePrice,
          duration: selectedDuration,
          monthlyPatients,
          sessionPrice,
          monthlyLease,
          monthlyRevenue,
          breakEvenPatients: Math.ceil(breakEvenPatients),
          consent: leadConsent
        })
      });

      if (!res.ok) {
        throw new Error("Simulation lead submission failed");
      }

      setLeadSuccess(true);
      setLeadEmail("");
      setLeadConsent(false);
    } catch (err) {
      setLeadError(t.leadErrorSubmit);
    } finally {
      setIsLeadLoading(false);
    }
  };

  return (
    <div className="w-full bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200/80">
      {/* Title block */}
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-2xl md:text-3xl font-extrabold flex items-center gap-3 text-slate-900 tracking-tight">
          <Calculator className="text-blue-600 shrink-0" size={28} />
          <span>{t.title}</span>
        </h2>
        <p className="text-slate-500 text-sm mt-1 leading-relaxed max-w-4xl">{t.subtitle}</p>
      </div>

      {/* Inputs block (Horizontal layout) */}
      <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 items-end">
          {/* Config Price Input */}
          <div className="space-y-2 lg:col-span-3">
            <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">{t.devicePrice}</label>
            <div className="relative">
              <Euro className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="number"
                value={devicePrice}
                onChange={(e) => setDevicePrice(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
              />
            </div>
          </div>

          {/* Patients Input */}
          <div className="space-y-2 lg:col-span-3">
            <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">{t.monthlyPatients}</label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="number"
                value={monthlyPatients}
                onChange={(e) => setMonthlyPatients(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
              />
            </div>
          </div>

          {/* Session Price Input */}
          <div className="space-y-2 lg:col-span-3">
            <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">{t.sessionPrice}</label>
            <div className="relative">
              <Euro className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="number"
                value={sessionPrice}
                onChange={(e) => setSessionPrice(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
              />
            </div>
          </div>

          {/* Duration Selector */}
          <div className="space-y-2 lg:col-span-3">
            <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              {lang === "FR" ? "Durée du Leasing" : "Leaseperiode"}
            </label>
            <div className="flex bg-slate-200/60 p-1 rounded-xl border border-slate-300 shadow-2xs h-[45px] items-center">
              {[24, 36, 48, 60].map((months) => (
                <button
                  key={months}
                  type="button"
                  onClick={() => setSelectedDuration(months)}
                  className={`flex-1 text-center py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedDuration === months
                      ? "bg-white text-blue-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {months}m
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Outputs / Results Block (Horizontal layouts) */}
      <div className="p-6 md:p-8 bg-white">
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Output stats (Leasing and Revenues) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Estimated Lease Cost Card */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 shadow-2xs">
                <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1 flex justify-between">
                  <span>{t.leasingCostTitle}</span>
                  <span className="text-[9px] text-blue-700 px-1.5 py-0.5 bg-blue-100 rounded font-bold uppercase">
                    {lang === "FR" ? "Renting / Crédit-Bail" : "Renting / Leasing"}
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  ~€{monthlyLease.toFixed(0)} 
                  <span className="text-xs text-slate-400 font-normal"> / mo</span>
                </div>
              </div>

              {/* Monthly Revenue Card */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 shadow-2xs">
                <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1">{t.monthlyRevTitle}</div>
                <div className="text-3xl font-extrabold text-emerald-600 tracking-tight">
                  €{monthlyRevenue.toFixed(0)}
                  <span className="text-xs text-slate-400 font-normal"> / mo</span>
                </div>
              </div>
            </div>

            {/* Break-Even Panel */}
            <div className="bg-emerald-50 border border-emerald-200/60 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-emerald-800 flex items-center gap-2 mb-2">
                <TrendingUp size={16} />
                {t.breakEvenTitle}
              </h3>
              <p className="text-slate-800 text-sm leading-relaxed">
                {t.breakEvenDesc} <span className="font-extrabold text-emerald-600 text-2xl px-1">{Math.ceil(breakEvenPatients)}</span> {t.breakEvenDesc2}
              </p>
              <div className="mt-3 pt-3 border-t border-emerald-200/40 text-xs font-semibold text-emerald-800">
                {t.cashflowDesc} <span className="text-emerald-600 text-sm font-extrabold">€{(monthlyRevenue - monthlyLease).toFixed(0)}/mo</span> {t.cashflowDesc2}
              </div>
            </div>

            {/* Lenders rates detail list */}
            {availableRates.length > 0 && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 space-y-3 shadow-2xs">
                <h4 className="text-[10px] font-bold tracking-wider text-slate-400 uppercase flex justify-between">
                  <span>{lang === "FR" ? "Comparatif des Prêteurs" : "Lenders Vergelijking"} ({selectedDuration}m)</span>
                  <span className="text-blue-600 lowercase font-semibold">{lang === "FR" ? "loyer mensuel" : "maandelijkse kost"}</span>
                </h4>
                <div className="divide-y divide-slate-200/60 text-xs font-semibold">
                  {availableRates.map((item: any, idx: number) => {
                    const providerCost = devicePrice * item.apr;
                    const isBest = item.providerName === bestRateObj?.providerName;
                    return (
                      <div key={idx} className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isBest ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`}></span>
                          <span className="text-slate-700 font-bold">{item.providerName}</span>
                          {isBest && (
                            <span className="text-[9px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-extrabold uppercase tracking-wide">
                              {lang === "FR" ? "Meilleur" : "Beste"}
                            </span>
                          )}
                        </div>
                        <div className="text-slate-900 font-extrabold font-mono">
                          ~€{providerCost.toFixed(0)}/mo <span className="text-[10px] text-slate-400 font-normal">({(item.apr * 100).toFixed(2)}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Lead Capture for Simulation */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 space-y-3 shadow-2xs mt-4">
              <div>
                <h4 className="text-xs font-bold text-slate-800 tracking-tight">{t.leadTitle}</h4>
                <p className="text-slate-500 text-[10px] leading-relaxed mt-0.5">{t.leadDesc}</p>
              </div>

              {leadError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200/50 rounded-lg text-rose-700 text-[11px] font-semibold">
                  {leadError}
                </div>
              )}

              {leadSuccess ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200/50 rounded-lg text-emerald-800 text-xs font-bold text-center">
                  ✓ {t.leadSuccessMsg}
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-2.5">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder={t.leadEmailPlaceholder}
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-800"
                    />
                    <button
                      type="submit"
                      disabled={isLeadLoading}
                      className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      {isLeadLoading ? "..." : t.leadSubmitBtn}
                    </button>
                  </div>
                  <div>
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={leadConsent}
                        onChange={(e) => setLeadConsent(e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500/20 mt-0.5 shrink-0"
                      />
                      <span className="text-slate-500 text-[9px] leading-relaxed select-none">
                        {t.leadConsentText}{" "}
                        <a href={`/legal/privacy?lang=${lang}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">
                          {t.leadPrivacyLink}
                        </a>
                        .
                      </span>
                    </label>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Tax Advisor / Optimization */}
          <div className="lg:col-span-7 flex">
            <div className="w-full bg-indigo-50/65 border border-indigo-100 rounded-xl p-6 flex flex-col justify-between shadow-2xs">
              <div>
                <h4 className="font-bold flex items-center gap-2 mb-3 text-indigo-900 text-sm tracking-tight">
                  <Info size={16} className="text-indigo-600 shrink-0" /> 
                  <span>{t.taxOptimization}</span>
                </h4>
                
                {lang === "FR" ? (
                  <ul className="space-y-3.5 text-xs text-slate-700 font-medium">
                    <li className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                      <span>
                        <strong>Déductibilité intégrale ({(parseFloat(initialSettings?.fr_tax_deduction_rate || "1.00") * 100).toFixed(0)}%)</strong> de la charge de financement mensuelle (soit <strong>€{taxDeductionRentFR.toFixed(0)}/mois</strong>) directement sur votre compte de résultat pour réduire votre impôt (BNC ou IS).
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                      <span>
                        <strong>Trésorerie préservée :</strong> Pas de décaissement de TVA initial sur le matériel. La TVA est étalée mensuellement sur chaque loyer, éliminant tout besoin d'avance.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                      <span>
                        <strong>Préservation de vos ratios d'endettement :</strong> Les loyers apparaissent en charges d'exploitation et non en dettes financières au bilan.
                      </span>
                    </li>
                  </ul>
                ) : (
                  <ul className="space-y-3.5 text-xs text-slate-700 font-medium">
                    <li className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                      <span>
                        <strong>100% Fiscaal Aftrekbaar :</strong> De maandelijke renting- of leasingfacturen zijn voor 100% aftrekbaar als bedrijfskosten van uw belastbaar inkomen.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                      <span>
                        <strong>Investeringsaftrek (Fiscale aftrek) :</strong> Mogelijk recht op een eenmalige investeringsaftrek van <strong>{(parseFloat(initialSettings?.be_tax_deduction_rate || "0.10") * 100).toFixed(0)}%</strong> (bruto besparing van <strong>€{basicInvestmentDeductionBE.toFixed(0)}</strong>).
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                      <span>
                        <strong>Buitenbalansfinanciering :</strong> De leasing- of rentingtermijnen worden geboekt als operationele kosten, waardoor uw schuldgraad niet stijgt.
                      </span>
                    </li>
                  </ul>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-indigo-200/40 text-[10px] font-semibold text-indigo-700/80">
                * Estimations données à titre indicatif sous réserve de validation par votre expert-comptable ou notre partenaire financier.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
