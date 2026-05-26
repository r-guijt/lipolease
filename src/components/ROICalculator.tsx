"use client";

import React, { useState, useEffect } from "react";
import { Calculator, Euro, Users, TrendingUp, Info } from "lucide-react";
import type { Language } from "@/app/page";

interface Props {
  lang: Language;
  devicePrice?: number;
  setDevicePrice?: (price: number) => void;
}

export default function ROICalculator({ lang, devicePrice: externalDevicePrice, setDevicePrice: externalSetDevicePrice }: Props) {
  const [jurisdiction, setJurisdiction] = useState<"FR" | "BE">("FR");
  
  // Use local state if no external state is passed, but support dynamic external state
  const [localDevicePrice, localSetDevicePrice] = useState(30000);
  const devicePrice = externalDevicePrice !== undefined ? externalDevicePrice : localDevicePrice;
  const setDevicePrice = externalSetDevicePrice !== undefined ? externalSetDevicePrice : localSetDevicePrice;

  const [monthlyPatients, setMonthlyPatients] = useState(5);
  const [sessionPrice, setSessionPrice] = useState(400);
  const [location, setLocation] = useState<"National" | "Brussels">("National");

  const LEASING_RATE = 0.0216; // approx 650/month for 30k

  useEffect(() => {
    if (jurisdiction === "FR") {
      setSessionPrice(400);
    } else {
      setSessionPrice(location === "Brussels" ? 1000 : 250);
    }
  }, [jurisdiction, location]);

  const monthlyLease = devicePrice * LEASING_RATE;
  const monthlyRevenue = sessionPrice * monthlyPatients;
  const breakEvenPatients = monthlyLease / sessionPrice;

  // Tax Logic
  const taxDeductionRentFR = monthlyLease; // 100% deductible from BNC
  const taxDeductionRentBE = monthlyLease; // 100% deductible as prof expenses
  const basicInvestmentDeductionBE = jurisdiction === "BE" ? devicePrice * 0.10 : 0; // 10% deduction

  const t = {
    title: lang === "FR" ? "Simulateur de Rentabilité & Financement" : "Rentabiliteit & Financieringscalculator",
    subtitle: lang === "FR" ? "Optimisez votre acquisition de matériel médical sans mobiliser votre trésorerie grâce au renting / crédit-bail fiscal." : "Optimaliseer uw aankoop van medische apparatuur zonder uw cashflow aan te spreken dankzij fiscale leasing/renting.",
    jurisdictionLabel: lang === "FR" ? "Juridiction" : "Rechtsgebied",
    france: lang === "FR" ? "France" : "Frankrijk",
    belgium: lang === "FR" ? "Belgique" : "België",
    locationLabel: lang === "FR" ? "Localisation (BE)" : "Locatie (BE)",
    national: lang === "FR" ? "National" : "Nationaal",
    brussels: lang === "FR" ? "Bruxelles" : "Brussel",
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
    taxOptimization: lang === "FR" ? `Optimisation Fiscale & Renting (${jurisdiction})` : `Fiscale Optimalisatie & Renting (${jurisdiction})`,
    frTax1: lang === "FR" 
      ? `100% de la mensualité de financement (€${taxDeductionRentFR.toFixed(0)}) est déductible de votre revenu imposable (BNC/IS).`
      : `100% van de maandelijkse termijn (€${taxDeductionRentFR.toFixed(0)}) is aftrekbaar van uw belastbaar inkomen (BNC/Vennootschapsbelasting).`,
    frTax2: lang === "FR" ? `Lissage intégral de l'impact de la TVA sur votre trésorerie.` : `Volledige spreiding van de btw-impact op uw cashflow.`,
    beTax1: lang === "FR" 
      ? `Déduction à 100% des loyers de renting en tant que frais professionnels.`
      : `100% aftrek van rentinghuren als dekkingskosten/beroepskosten.`,
    beTax2: lang === "FR" 
      ? `Éligible à la Déduction pour Investeringsaftrek de 10% (€${basicInvestmentDeductionBE.toFixed(0)} en une fois).`
      : `Komt in aanmerking voor de Basis Investeringsaftrek van 10% (€${basicInvestmentDeductionBE.toFixed(0)} eenmalig).`,
    beTax3: lang === "FR" ? `Parfaitement conforme aux nouvelles réformes fiscales belges.` : `Volledig in overeenstemming met de nieuwe Belgische belastinghervormingen.`,
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-6 items-end">
          {/* Jurisdiction selector */}
          <div className="space-y-2 lg:col-span-2">
            <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">{t.jurisdictionLabel}</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setJurisdiction("FR")}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all border ${jurisdiction === "FR" ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"}`}
              >
                {t.france}
              </button>
              <button
                type="button"
                onClick={() => setJurisdiction("BE")}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all border ${jurisdiction === "BE" ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-500/20" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"}`}
              >
                {t.belgium}
              </button>
            </div>
          </div>

          {/* BE Location Toggle (Conditional) */}
          {jurisdiction === "BE" ? (
            <div className="space-y-2 lg:col-span-2">
              <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">{t.locationLabel}</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLocation("National")}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-[11px] font-bold transition-all border ${location === "National" ? "bg-slate-900 border-slate-900 text-white shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"}`}
                >
                  {t.national}
                </button>
                <button
                  type="button"
                  onClick={() => setLocation("Brussels")}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-[11px] font-bold transition-all border ${location === "Brussels" ? "bg-slate-900 border-slate-900 text-white shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"}`}
                >
                  {t.brussels}
                </button>
              </div>
            </div>
          ) : (
            // Spacer to keep layout clean
            <div className="hidden lg:block lg:col-span-2"></div>
          )}

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
          <div className="space-y-2 lg:col-span-2">
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
                  {jurisdiction === "FR" ? (
                    <span className="text-[9px] text-blue-700 px-1.5 py-0.5 bg-blue-100 rounded font-bold uppercase">Crédit-Bail</span>
                  ) : (
                    <span className="text-[9px] text-red-700 px-1.5 py-0.5 bg-red-100 rounded font-bold uppercase">Renting</span>
                  )}
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
          </div>

          {/* Tax Advisor / Optimization */}
          <div className="lg:col-span-7 flex">
            <div className="w-full bg-indigo-50/65 border border-indigo-100 rounded-xl p-6 flex flex-col justify-between shadow-2xs">
              <div>
                <h4 className="font-bold flex items-center gap-2 mb-3 text-indigo-900 text-sm tracking-tight">
                  <Info size={16} className="text-indigo-600 shrink-0" /> 
                  <span>{t.taxOptimization}</span>
                </h4>
                
                {jurisdiction === "FR" ? (
                  <ul className="space-y-3.5 text-xs text-slate-700 font-medium">
                    <li className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                      <span>
                        <strong>Déductibilité intégrale (100%)</strong> de la charge de financement mensuelle (soit <strong>€{taxDeductionRentFR.toFixed(0)}/mois</strong>) directement sur votre compte de résultat pour réduire votre impôt (BNC ou IS).
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
                        <strong>Renting fiscalement avantageux :</strong> Déduction à 100% des loyers du renting financier en charges d'exploitation professionnelles.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                      <span>
                        <strong>Investeringsaftrek (Déduction pour investissement) :</strong> Éligible à une déduction fiscale unique de 10%, soit une économie brute de <strong>€{basicInvestmentDeductionBE.toFixed(0)}</strong>.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                      <span>
                        <strong>Conforme 2025/2026 :</strong> Entièrement optimisé selon les réglementations fiscales belges les plus récentes.
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
