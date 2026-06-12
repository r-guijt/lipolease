"use client";

import React, { useState } from "react";
import { User, Mail, Phone, Globe, Loader2, CheckCircle2 } from "lucide-react";
import type { Language } from "@/app/page";

interface Props {
  lang: Language;
}

export default function ContactForm({ lang }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState<"FR" | "BE">("FR");
  const [consent, setConsent] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const t = {
    title: lang === "FR" ? "Recevoir la documentation & être recontacté" : "Documentatie ontvangen & gecontacteerd worden",
    subtitle: lang === "FR" 
      ? "Remplissez ce formulaire rapide pour recevoir notre brochure complète et simuler votre éligibilité au leasing."
      : "Vul dit korte formulier in om onze volledige brochure te ontvangen en uw lease-geschiktheid te simuleren.",
    nameLabel: lang === "FR" ? "Nom complet" : "Volledige naam",
    emailLabel: lang === "FR" ? "Adresse Email" : "E-mailadres",
    phoneLabel: lang === "FR" ? "Numéro de téléphone" : "Telefoonnummer",
    countryLabel: lang === "FR" ? "Pays de pratique" : "Land van praktijk",
    france: lang === "FR" ? "France" : "Frankrijk",
    belgium: lang === "FR" ? "Belgique" : "België",
    consentText: lang === "FR"
      ? "J'accepte que Well Being Distribution SRL me recontacte et traite mes données conformément à la"
      : "Ik ga ermee akkoord dat Well Being Distribution SRL contact met mij opneemt en mijn gegevens verwerkt in overeenstemming met het",
    privacyLinkText: lang === "FR" ? "Politique de Confidentialité" : "Privacybeleid & GDPR",
    submitBtn: lang === "FR" ? "Recevoir la documentation" : "Documentatie ontvangen",
    loadingBtn: lang === "FR" ? "Envoi en cours..." : "Verzenden...",
    successTitle: lang === "FR" ? "Demande Enregistrée" : "Aanvraag Geregistreerd",
    successDesc: lang === "FR"
      ? "Merci pour votre intérêt ! Un conseiller LipoLease va vous recontacter par email ou par téléphone sous 24h ouvrées."
      : "Bedankt voor uw interesse! Een LipoLease-adviseur neemt binnen 24 werkuren telefonisch of via e-mail contact met u op.",
    shortcutText: lang === "FR" ? "Déjà décidé ?" : "Al beslist?",
    shortcutLink: lang === "FR" ? "Demandez votre agrément officiel" : "Vraag uw officiële erkenning aan",
    errorEmail: lang === "FR" ? "Veuillez entrer une adresse email valide." : "Voer een geldig e-mailadres in.",
    errorPhoneFR: lang === "FR" ? "Numéro français invalide (ex: 0612345678 ou +33612345678)." : "Ongeldig Frans nummer (bijv. +33612345678).",
    errorPhoneBE: lang === "FR" ? "Numéro belge invalide (ex: 0489819521 ou +32489819521)." : "Ongeldig Belgisch nummer (bijv. +32489819521).",
    errorConsent: lang === "FR" ? "Veuillez accepter la politique de confidentialité." : "U moet akkoord gaan met het privacybeleid.",
    errorSubmit: lang === "FR" ? "Une erreur réseau est survenue. Veuillez réessayer." : "Er is een netwerkfout opgetreden. Probeer het opnieuw."
  };

  const handleScrollToAgrement = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("agrement");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const validatePhone = (num: string, cntry: "FR" | "BE") => {
    // Basic formatting clean: remove spaces, dots, dashes
    const cleanNum = num.replace(/[\s.\-\(\)]/g, "");
    if (cntry === "FR") {
      // +33 or 0, followed by 1-9, then 8 digits
      const frRegex = /^(?:\+33|0)[1-9]\d{8}$/;
      return frRegex.test(cleanNum);
    } else {
      // +32 or 0, followed by 1-9, then 7 or 8 digits
      const beRegex = /^(?:\+32|0)[1-9]\d{7,8}$/;
      return beRegex.test(cleanNum);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validations
    if (!email || !email.includes("@")) {
      setError(t.errorEmail);
      return;
    }

    if (!validatePhone(phone, country)) {
      setError(country === "FR" ? t.errorPhoneFR : t.errorPhoneBE);
      return;
    }

    if (!consent) {
      setError(t.errorConsent);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/leads/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, country, consent })
      });

      if (!res.ok) {
        throw new Error("Submission failed");
      }

      setSuccess(true);
    } catch (err) {
      setError(t.errorSubmit);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4 shadow-xl">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900">{t.successTitle}</h2>
        <p className="text-slate-600 text-sm leading-relaxed">{t.successDesc}</p>
        <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
          <span>{t.shortcutText} </span>
          <a href="#agrement" onClick={handleScrollToAgrement} className="text-blue-600 hover:text-blue-700 font-bold underline">
            {t.shortcutLink}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl p-8 border border-slate-200 shadow-xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{t.title}</h2>
        <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">{t.subtitle}</p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200/50 rounded-xl text-rose-700 text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name input */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.nameLabel}</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-800"
              placeholder="e.g. Dr. Jean Dupont"
            />
          </div>
        </div>

        {/* Email input */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.emailLabel}</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-800"
              placeholder="e.g. j.dupont@clinique.fr"
            />
          </div>
        </div>

        {/* Phone input */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.phoneLabel}</label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-800"
              placeholder={country === "FR" ? "e.g. 06 12 34 56 78" : "e.g. 0489 81 95 21"}
            />
          </div>
        </div>

        {/* Country dropdown */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.countryLabel}</label>
          <div className="relative">
            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value as "FR" | "BE")}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-800 appearance-none cursor-pointer"
            >
              <option value="FR">{t.france}</option>
              <option value="BE">{t.belgium}</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 border-l border-slate-200 pl-2 text-xs font-semibold">
              ▼
            </div>
          </div>
        </div>

        {/* GDPR consent */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500/20 mt-0.5 shrink-0"
            />
            <span className="text-slate-500 text-2xs leading-relaxed select-none">
              {t.consentText}{" "}
              <a href={`/legal/privacy?lang=${lang}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">
                {t.privacyLinkText}
              </a>
              .
            </span>
          </label>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 active:shadow-md transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t.loadingBtn}</span>
            </>
          ) : (
            <span>{t.submitBtn}</span>
          )}
        </button>
      </form>

      <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
        <span>{t.shortcutText} </span>
        <a href="#agrement" onClick={handleScrollToAgrement} className="text-blue-600 hover:text-blue-700 font-bold underline">
          {t.shortcutLink}
        </a>
      </div>
    </div>
  );
}
