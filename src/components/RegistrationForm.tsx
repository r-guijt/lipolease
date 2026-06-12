"use client";

import React, { useState } from "react";
import { User, Stethoscope, ShieldAlert, CheckCircle2, Mail, Lock, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { Language } from "@/app/page";

type Role = "DOCTOR" | "CLINIC" | "NURSE_UNDER_SUPERVISION" | "ESTHETICIAN" | "PHARMACIST" | "OTHER";

interface Props {
  lang: Language;
}

export default function RegistrationForm({ lang }: Props) {
  const router = useRouter();
  const [jurisdiction, setJurisdiction] = useState<"FR" | "BE">("FR");
  const [role, setRole] = useState<Role | "">("");
  const [professionalId, setProfessionalId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const t = {
    header: lang === "FR" ? "Agrément Cryo-Celsius® & KYC" : "Cryo-Celsius® Erkenning & KYC",
    subHeader: lang === "FR" ? "Onboarding officiel réservé aux praticiens autorisés pour l'acquisition du Cryo-Celsius®." : "Officiële onboarding uitsluitend voor bevoegde behandelaars voor de aankoop van Cryo-Celsius®.",
    jurisdiction: lang === "FR" ? "Juridiction" : "Rechtsgebied",
    france: lang === "FR" ? "France" : "Frankrijk",
    belgium: lang === "FR" ? "Belgique" : "België",
    roleLabel: lang === "FR" ? "Profession / Rôle" : "Beroep / Rol",
    roleSelect: lang === "FR" ? "Sélectionnez votre profession" : "Selecteer uw beroep",
    roleDoctor: lang === "FR" ? "Médecin Esthétique / Dermatologue / Chirurgien" : "Esthetisch Arts / Dermatoloog / Chirurg",
    roleClinic: lang === "FR" ? "Clinique Médicale" : "Medische Kliniek",
    roleNurse: lang === "FR" ? "Infirmier(ère) (sous supervision stricte)" : "Verpleegkundige (onder strikt toezicht)",
    roleEsthetician: lang === "FR" ? "Esthéticienne Indépendante / Institut de Beauté" : "Zelfstandig Schoonheidsspecialiste / Schoonheidssalon",
    rolePharmacist: lang === "FR" ? "Pharmacien" : "Apotheker",
    roleOther: lang === "FR" ? "Autre" : "Ander",
    emailLabel: lang === "FR" ? "Adresse Email" : "E-mailadres",
    passwordLabel: lang === "FR" ? "Mot de passe" : "Wachtwoord",
    errorUnauthorized: lang === "FR" 
      ? `Inscription refusée. En vertu de la réglementation (${jurisdiction}), votre profession n'est pas autorisée à exploiter le dispositif Cryo-Celsius®.` 
      : `Registratie geweigerd. Krachtens de regelgeving (${jurisdiction}) is uw beroep niet gemachtigd om het Cryo-Celsius®-apparaat te bedienen.`,
    errorNurseBE: lang === "FR"
      ? "Exception belge : Les infirmiers doivent fournir un numéro INAMI valide et une preuve de supervision médicale."
      : "Belgische uitzondering: Verpleegkundigen moeten een geldig RIZIV-nummer en een bewijs van medisch toezicht overleggen.",
    errorNurseFR: lang === "FR"
      ? "Inscription refusée. En France, l'utilisation par un infirmier sous supervision est soumise à des conditions strictes non prises en charge par l'intégration par défaut."
      : "Registratie geweigerd. In Frankrijk is de bediening door een verpleegkundige onder toezicht onderworpen aan strikte voorwaarden die niet worden ondersteund door de standaard onboarding.",
    errorInvalidId: lang === "FR"
      ? `Veuillez entrer un numéro ${jurisdiction === "FR" ? "RPPS" : "INAMI"} valide.`
      : `Voer een geldig ${jurisdiction === "FR" ? "RPPS" : "RIZIV"}-nummer in.`,
    placeholderId: lang === "FR"
      ? (jurisdiction === "FR" ? "Entrez votre RPPS à 11 chiffres" : "Entrez votre INAMI")
      : (jurisdiction === "FR" ? "Voer uw 11-cijferige RPPS in" : "Voer uw RIZIV in"),
    exceptionNurseDescBE: lang === "FR"
      ? "* Exception belge : Vous devez fournir la preuve de l'utilisation sous la supervision stricte d'un médecin inscrit."
      : "* Belgische uitzondering: U moet het bewijs leveren van bediening onder strikt toezicht van een geregistreerde arts.",
    submitBtn: lang === "FR" ? "Créer mon compte" : "Account aanmaken",
    loadingBtn: lang === "FR" ? "Création en cours..." : "Aanmaken...",
    successTitle: lang === "FR" ? "Compte Créé" : "Account Aangemaakt",
    successDesc: lang === "FR"
      ? `Vos informations ont été enregistrées. Redirection vers votre tableau de bord...`
      : `Uw gegevens zijn opgeslagen. U wordt doorgestuurd naar uw dashboard...`,
    continueBtn: lang === "FR" ? "Aller au Tableau de Bord" : "Naar het Dashboard",
    consentText: lang === "FR"
      ? "J'accepte la création de mon compte et le traitement de mes données conformément à la"
      : "Ik ga akkoord met het aanmaken van mijn account en de verwerking van mijn gegevens in overeenstemming met de",
    privacyLinkText: lang === "FR" ? "Politique de Confidentialité" : "Privacybeleid & GDPR",
    errorConsent: lang === "FR"
      ? "Vous devez accepter la politique de confidentialité pour vous inscrire."
      : "U moet akkoord gaan met het privacybeleid om u te registreren."
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!consent) {
      setError(t.errorConsent);
      return;
    }

    // Hard Blocks (Legal Compliance)
    if (role === "ESTHETICIAN" || role === "PHARMACIST" || role === "OTHER") {
      setError(t.errorUnauthorized);
      return;
    }

    if (jurisdiction === "BE" && role === "NURSE_UNDER_SUPERVISION") {
      if (!professionalId) {
        setError(t.errorNurseBE);
        return;
      }
    }

    if (jurisdiction === "FR" && role === "NURSE_UNDER_SUPERVISION") {
      setError(t.errorNurseFR);
      return;
    }

    if (!professionalId || professionalId.length < 5) {
      setError(t.errorInvalidId);
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create User
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role, jurisdiction, professionalId })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Registration failed");
      }

      // 2. Sign In automatically
      const signInResult = await signIn("credentials", {
        redirect: false,
        email,
        password
      });

      if (signInResult?.error) {
        throw new Error(signInResult.error);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);

    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4 shadow-xl">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900">{t.successTitle}</h2>
        <p className="text-slate-600">{t.successDesc}</p>
        <div className="mt-6 flex justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl p-8 border border-slate-200 shadow-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="text-blue-600" />
          {t.header}
        </h2>
        <p className="text-slate-500 text-sm mt-2">{t.subHeader}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.emailLabel}</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="dr.smith@clinic.com"
              className="w-full bg-white border border-slate-300 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.passwordLabel}</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white border border-slate-300 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.jurisdiction}</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => { setJurisdiction("FR"); setError(null); }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all border ${jurisdiction === "FR" ? "bg-blue-50 border-blue-600 text-blue-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              {t.france}
            </button>
            <button
              type="button"
              onClick={() => { setJurisdiction("BE"); setError(null); }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all border ${jurisdiction === "BE" ? "bg-red-50 border-red-600 text-red-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              {t.belgium}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.roleLabel}</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="w-full bg-white border border-slate-300 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            required
          >
            <option value="" disabled>{t.roleSelect}</option>
            <option value="DOCTOR">{t.roleDoctor}</option>
            <option value="CLINIC">{t.roleClinic}</option>
            <option value="NURSE_UNDER_SUPERVISION">{t.roleNurse}</option>
            <option value="ESTHETICIAN">{t.roleEsthetician}</option>
            <option value="PHARMACIST">{t.rolePharmacist}</option>
            <option value="OTHER">{t.roleOther}</option>
          </select>
        </div>

        {(role === "DOCTOR" || role === "CLINIC" || role === "NURSE_UNDER_SUPERVISION") && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {jurisdiction === "FR" ? "RPPS" : "INAMI"}
            </label>
            <div className="relative">
              <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={professionalId}
                onChange={(e) => setProfessionalId(e.target.value)}
                placeholder={t.placeholderId}
                className="w-full bg-white border border-slate-300 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                required
              />
            </div>
            {jurisdiction === "BE" && role === "NURSE_UNDER_SUPERVISION" && (
              <p className="text-xs text-amber-600 mt-2">
                {t.exceptionNurseDescBE}
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500/20 mt-0.5 shrink-0"
            />
            <span className="text-slate-500 text-xs leading-relaxed select-none">
              {t.consentText}{" "}
              <a href={`/legal/privacy?lang=${lang}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">
                {t.privacyLinkText}
              </a>
              .
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <User size={18} />
          )}
          {isLoading ? t.loadingBtn : t.submitBtn}
        </button>
      </form>
    </div>
  );
}
