"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Building2, 
  Settings2, 
  Search, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  FileText, 
  ExternalLink, 
  Save, 
  Loader2, 
  Check,
  TrendingUp,
  Percent,
  Power
} from "lucide-react";

interface Document {
  id: string;
  documentType: string;
  fileName: string;
  fileUrl: string;
  status: string;
  uploadedAt: string;
}

interface Applicant {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  jurisdiction: string | null;
  professionalId: string | null;
  companyName: string | null;
  verificationStatus: string;
  applicationStatus: string;
  selectedModel: string | null;
  leaseDuration: number | null;
  documents: Document[];
  createdAt: string;
}

interface Rate {
  id: string;
  durationMonths: number;
  apr: number;
}

interface Provider {
  id: string;
  name: string;
  isActive: boolean;
  rates: Rate[];
}

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState<"applicants" | "providers" | "parameters">("applicants");
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [countryFilter, setCountryFilter] = useState<string>("ALL");

  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsNotification, setSettingsNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Dynamic state for rates edit matrix
  const [editedRates, setEditedRates] = useState<Record<string, string>>({});
  const [editedSettings, setEditedSettings] = useState<Record<string, string>>({});

  // Account Password Change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Applicants
      const applicantsRes = await fetch("/api/admin/applicants");
      if (applicantsRes.ok) {
        const applicantsData = await applicantsRes.json();
        setApplicants(applicantsData);
      }

      // 2. Fetch Settings and Providers
      const settingsRes = await fetch("/api/admin/settings/rates");
      if (settingsRes.ok) {
        const { settings: settingsData, providers: providersData } = await settingsRes.json();
        setSettings(settingsData);
        setEditedSettings(settingsData);
        setProviders(providersData);

        // Prepopulate edited rates matrix
        const ratesMap: Record<string, string> = {};
        providersData.forEach((prov: Provider) => {
          prov.rates.forEach((r: Rate) => {
            ratesMap[r.id] = (r.apr * 100).toFixed(2); // Convert to percent string for UI edit, e.g. 2.16
          });
        });
        setEditedRates(ratesMap);
      }
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Provider Activation
  const handleToggleProvider = async (providerId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/providers/${providerId}/toggle`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (res.ok) {
        setProviders(prev => prev.map(p => p.id === providerId ? { ...p, isActive: !currentStatus } : p));
      }
    } catch (e) {
      console.error("Failed to toggle provider status", e);
    }
  };

  // Update Applicant Verification/Application workflow status
  const handleUpdateApplicantStatus = async (applicantId: string, updates: { verificationStatus?: string; applicationStatus?: string }) => {
    try {
      const res = await fetch(`/api/admin/applicants/${applicantId}/verify`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });

      if (res.ok) {
        const updated = await res.json();
        setApplicants(prev => prev.map(a => a.id === applicantId ? { ...a, ...updates } : a));
        if (selectedApplicant?.id === applicantId) {
          setSelectedApplicant(prev => prev ? { ...prev, ...updates } : null);
        }
      }
    } catch (e) {
      console.error("Failed to update applicant status", e);
    }
  };

  // Save Settings & APR Rates Matrix
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsNotification(null);

    try {
      // Structure rates for API submission
      const ratesPayload = Object.entries(editedRates).map(([id, val]) => ({
        id,
        apr: parseFloat(val) / 100 // Convert percent back to float coefficient, e.g. 2.16 -> 0.0216
      }));

      const res = await fetch("/api/admin/settings/rates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: editedSettings,
          rates: ratesPayload
        })
      });

      if (res.ok) {
        setSettingsNotification({ type: "success", message: "Paramètres financiers mis à jour avec succès !" });
        fetchData(); // Refresh values from DB
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (err) {
      setSettingsNotification({ type: "error", message: "Erreur lors de la sauvegarde des paramètres." });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: "error", message: "Les mots de passe ne correspondent pas." });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      if (res.ok) {
        setPasswordStatus({ type: "success", message: "Mot de passe modifié avec succès !" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const txt = await res.text();
        throw new Error(txt || "Erreur de mise à jour");
      }
    } catch (err: any) {
      setPasswordStatus({ type: "error", message: err.message || "Erreur lors de la modification du mot de passe." });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-semibold border border-emerald-500/20 flex items-center gap-1 w-fit"><CheckCircle size={12} /> Approuvé</span>;
      case "REJECTED":
        return <span className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded-full text-xs font-semibold border border-red-500/20 flex items-center gap-1 w-fit"><XCircle size={12} /> Rejeté</span>;
      default:
        return <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded-full text-xs font-semibold border border-amber-500/20 flex items-center gap-1 w-fit"><AlertCircle size={12} /> En attente</span>;
    }
  };

  const getApplicationStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      "SUBMITTED": "Soumis",
      "UNDER_REVIEW": "En cours de revue",
      "LENDER_MATCHING": "Sélection du prêteur",
      "APPROVED": "Accord de financement",
      "REJECTED": "Refus de financement"
    };
    return labels[status] || status;
  };

  // Filters logic
  const filteredApplicants = applicants.filter(app => {
    const searchString = `${app.companyName || ""} ${app.name || ""} ${app.email || ""} ${app.professionalId || ""}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || app.verificationStatus === statusFilter;
    const matchesCountry = countryFilter === "ALL" || app.jurisdiction === countryFilter;
    return matchesSearch && matchesStatus && matchesCountry;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-blue-500" size={36} />
        <p className="text-slate-400 text-sm font-semibold tracking-wide">Chargement du centre d'opérations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Banner Control Center */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/10 border border-white/10">
            👑
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">LipoLease Center</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Embedded Finance Admin Dashboard</p>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-slate-950/60 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => { setActiveTab("applicants"); setSelectedApplicant(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === "applicants" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-slate-100"}`}
          >
            <Users size={14} />
            <span>Machine Buyers (Leads)</span>
          </button>
          <button
            onClick={() => { setActiveTab("providers"); setSelectedApplicant(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === "providers" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-slate-100"}`}
          >
            <Building2 size={14} />
            <span>Lenders Management</span>
          </button>
          <button
            onClick={() => { setActiveTab("parameters"); setSelectedApplicant(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === "parameters" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-slate-100"}`}
          >
            <Settings2 size={14} />
            <span>The Brain (Params)</span>
          </button>
        </div>
      </header>

      {/* Main Control Panel */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto relative">
        
        {/* TAB 1: APPLICANTS */}
        {activeTab === "applicants" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Table Container */}
            <div className={`${selectedApplicant ? "lg:col-span-8" : "lg:col-span-12"} bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300`}>
              
              {/* Header & Filters */}
              <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/50">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par société, praticien, ID..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="flex gap-3">
                  {/* Country Filter */}
                  <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="ALL">Tous Pays</option>
                    <option value="FR">France</option>
                    <option value="BE">Belgique</option>
                  </select>

                  {/* Verification Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="ALL">Tout KYC</option>
                    <option value="PENDING">KYC En attente</option>
                    <option value="APPROVED">KYC Approuvé</option>
                    <option value="REJECTED">KYC Rejeté</option>
                  </select>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-950/40 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-4 px-5">Société / Candidat</th>
                      <th className="py-4 px-4">Identifiant Prof.</th>
                      <th className="py-4 px-4 text-center">Pays</th>
                      <th className="py-4 px-4">Dispositif</th>
                      <th className="py-4 px-4 text-center">Durée</th>
                      <th className="py-4 px-4">Statut KYC</th>
                      <th className="py-4 px-5">Étape Financement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                    {filteredApplicants.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500 text-sm font-semibold">
                          Aucun prospect trouvé
                        </td>
                      </tr>
                    ) : (
                      filteredApplicants.map((app) => (
                        <tr
                          key={app.id}
                          onClick={() => setSelectedApplicant(app)}
                          className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${selectedApplicant?.id === app.id ? "bg-blue-600/5 border-l-2 border-l-blue-500" : ""}`}
                        >
                          <td className="py-4 px-5">
                            <div className="font-bold text-slate-100">{app.companyName || app.name || "N/A"}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">{app.email}</div>
                          </td>
                          <td className="py-4 px-4 text-slate-400 font-mono">
                            {app.professionalId || "Aucun"}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${app.jurisdiction === "FR" ? "bg-blue-500/10 text-blue-400" : "bg-red-500/10 text-red-400"}`}>
                              {app.jurisdiction}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-200">
                            {app.selectedModel || "Non spécifié"}
                          </td>
                          <td className="py-4 px-4 text-center text-slate-400 font-bold">
                            {app.leaseDuration ? `${app.leaseDuration}m` : "60m"}
                          </td>
                          <td className="py-4 px-4">
                            {getVerificationBadge(app.verificationStatus)}
                          </td>
                          <td className="py-4 px-5">
                            <span className="text-blue-400 bg-blue-500/5 px-2 py-1 rounded border border-blue-500/10 text-[10px] font-bold">
                              {getApplicationStatusLabel(app.applicationStatus)}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sidebar Details Drawer */}
            {selectedApplicant && (
              <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-6 shadow-2xl relative animate-fadeIn">
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="absolute top-4 right-4 text-slate-500 hover:text-white text-xs font-bold bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800"
                >
                  Fermer
                </button>

                <div>
                  <h2 className="text-base font-bold text-slate-100 mb-1">{selectedApplicant.companyName || selectedApplicant.name || "Détails prospect"}</h2>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold font-mono">ID: {selectedApplicant.id}</p>
                </div>

                <hr className="border-slate-800" />

                {/* Workflow status selectors */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider">Vérification KYC/KYB</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateApplicantStatus(selectedApplicant.id, { verificationStatus: "APPROVED" })}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${selectedApplicant.verificationStatus === "APPROVED" ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/10" : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"}`}
                      >
                        <CheckCircle size={14} /> Approuver
                      </button>
                      <button
                        onClick={() => handleUpdateApplicantStatus(selectedApplicant.id, { verificationStatus: "REJECTED" })}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${selectedApplicant.verificationStatus === "REJECTED" ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-500/10" : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"}`}
                      >
                        <XCircle size={14} /> Rejeter
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider">Étape du Pipeline</label>
                    <select
                      value={selectedApplicant.applicationStatus}
                      onChange={(e) => handleUpdateApplicantStatus(selectedApplicant.id, { applicationStatus: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 font-bold"
                    >
                      <option value="SUBMITTED">Soumis (Nouveau lead)</option>
                      <option value="UNDER_REVIEW">En cours d'étude réglementaire</option>
                      <option value="LENDER_MATCHING">Sélection et envoi aux banques</option>
                      <option value="APPROVED">Financement Accordé</option>
                      <option value="REJECTED">Financement Refusé</option>
                    </select>
                  </div>
                </div>

                <hr className="border-slate-800" />

                {/* Profile Overview */}
                <div className="space-y-3.5 text-xs">
                  <h3 className="font-bold text-slate-400 uppercase text-[9px] tracking-wider">Fiche d'information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-slate-500 text-[10px]">Email</div>
                      <div className="font-semibold text-slate-200 mt-0.5 break-all">{selectedApplicant.email}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px]">{selectedApplicant.jurisdiction === "FR" ? "RPPS" : "INAMI"}</div>
                      <div className="font-mono text-slate-200 mt-0.5 font-bold">{selectedApplicant.professionalId || "Aucun"}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px]">Modèle Choisi</div>
                      <div className="font-semibold text-slate-200 mt-0.5">{selectedApplicant.selectedModel || "Non défini"}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px]">Durée Demandée</div>
                      <div className="font-semibold text-slate-200 mt-0.5">{selectedApplicant.leaseDuration ? `${selectedApplicant.leaseDuration} mois` : "60 mois"}</div>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-800" />

                {/* KYC Legal Documents Review */}
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-400 uppercase text-[9px] tracking-wider flex items-center gap-1.5">
                    <FileText size={12} />
                    <span>Documents Légaux (Kbis / BCE)</span>
                  </h3>
                  
                  {selectedApplicant.documents.length === 0 ? (
                    <div className="text-center py-6 bg-slate-950/40 rounded-xl border border-slate-800/60 text-slate-500 text-xs">
                      Aucun document n'a encore été déposé.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {selectedApplicant.documents.map((doc) => (
                        <div key={doc.id} className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 flex items-center justify-between hover:border-slate-700 transition-colors">
                          <div className="min-w-0 flex-1 pr-3">
                            <p className="font-semibold text-slate-200 truncate text-xs">{doc.fileName}</p>
                            <p className="text-[9px] text-slate-500 mt-0.5 uppercase font-bold tracking-wide">{doc.documentType.replace("_", " ")}</p>
                          </div>
                          
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 p-1.5 bg-blue-500/5 hover:bg-blue-500/10 rounded-lg transition-colors shrink-0 flex items-center gap-1"
                          >
                            <span className="text-[10px] font-bold">Ouvrir</span>
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROVIDERS */}
        {activeTab === "providers" && (
          <div className="space-y-6">
            {/* Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Prêteurs intégrés</p>
                  <p className="text-2xl font-extrabold text-white">{providers.length}</p>
                </div>
                <Building2 className="text-blue-500" size={32} />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Prêteurs Actifs</p>
                  <p className="text-2xl font-extrabold text-emerald-500">{providers.filter(p => p.isActive).length}</p>
                </div>
                <CheckCircle className="text-emerald-500" size={32} />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Désactivés</p>
                  <p className="text-2xl font-extrabold text-red-400">{providers.filter(p => !p.isActive).length}</p>
                </div>
                <XCircle className="text-red-400" size={32} />
              </div>
            </div>

            {/* Providers List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((provider) => (
                <div 
                  key={provider.id}
                  className={`bg-slate-900 border rounded-2xl p-6 transition-all relative ${provider.isActive ? "border-slate-800 hover:border-slate-700" : "border-red-950/30 opacity-75"}`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-bold text-slate-100 text-sm">{provider.name}</h3>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono font-bold mt-0.5">ID: {provider.id}</p>
                    </div>

                    {/* Active Status Switcher Toggle */}
                    <button
                      onClick={() => handleToggleProvider(provider.id, provider.isActive)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors relative flex items-center focus:outline-none ${provider.isActive ? "bg-emerald-600" : "bg-slate-800"}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${provider.isActive ? "translate-x-4" : "translate-x-0"}`}></div>
                    </button>
                  </div>

                  {/* Rates matrix list for this provider */}
                  <div className="space-y-3.5 bg-slate-950/50 rounded-xl p-4 border border-slate-800/40">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Percent size={12} className="text-blue-500" /> Matrix de taux d'intérêt (APR)
                    </p>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      {provider.rates.map(rate => (
                        <div key={rate.id} className="bg-slate-900 border border-slate-800/60 p-2 rounded-lg">
                          <div className="text-[10px] text-slate-500 font-bold">{rate.durationMonths}m</div>
                          <div className="font-bold text-slate-200 mt-1 font-mono">{(rate.apr * 100).toFixed(2)}%</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-[10px] font-semibold">
                    <span className="text-slate-500">API Status</span>
                    <span className={`flex items-center gap-1 ${provider.isActive ? "text-emerald-500" : "text-red-500"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${provider.isActive ? "bg-emerald-500 animate-ping" : "bg-red-500"}`}></span>
                      {provider.isActive ? "ONLINE" : "OFFLINE"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: THE BRAIN PARAMETERS */}
        {activeTab === "parameters" && (
          <div className="space-y-8 max-w-5xl mx-auto">
            
            {/* Notification alert */}
            {settingsNotification && (
              <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${settingsNotification.type === "success" ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300" : "bg-red-950/40 border-red-500/30 text-red-300"}`}>
                {settingsNotification.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                <span>{settingsNotification.message}</span>
              </div>
            )}
            <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Parameters Forms */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* Module C1: Price Overrides Assumptions */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                  <h2 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
                    <TrendingUp className="text-blue-500" size={16} />
                    <span>Hypothèses Tarifs Séances (BE & FR)</span>
                  </h2>

                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Belgique National (€)</label>
                      <input
                        type="number"
                        value={editedSettings["be_default_national_price"] || ""}
                        onChange={(e) => setEditedSettings(prev => ({ ...prev, be_default_national_price: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-blue-500 font-semibold font-mono"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bruxelles Métropole (€)</label>
                      <input
                        type="number"
                        value={editedSettings["be_default_brussels_price"] || ""}
                        onChange={(e) => setEditedSettings(prev => ({ ...prev, be_default_brussels_price: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-blue-500 font-semibold font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">France (National) (€)</label>
                    <input
                      type="number"
                      value={editedSettings["fr_default_price"] || ""}
                      onChange={(e) => setEditedSettings(prev => ({ ...prev, fr_default_price: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-blue-500 font-semibold font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Module C2: Tax Settings */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <h2 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
                  <Percent className="text-indigo-500" size={16} />
                  <span>Paramètres Fiscaux (Loi de Finances)</span>
                </h2>

                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Belgique: Investeringsaftrek 2026 (%)</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        value={parseFloat(editedSettings["be_tax_deduction_rate"] || "0") * 100}
                        onChange={(e) => setEditedSettings(prev => ({ ...prev, be_tax_deduction_rate: (parseFloat(e.target.value) / 100).toString() }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-3 pr-8 text-slate-200 focus:outline-none focus:border-blue-500 font-semibold font-mono"
                        required
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">%</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">France: Taux Déductibilité BNC (%)</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        value={parseFloat(editedSettings["fr_tax_deduction_rate"] || "0") * 100}
                        onChange={(e) => setEditedSettings(prev => ({ ...prev, fr_tax_deduction_rate: (parseFloat(e.target.value) / 100).toString() }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-3 pr-8 text-slate-200 focus:outline-none focus:border-blue-500 font-semibold font-mono"
                        required
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Module C3: Global Rate Setting */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <h2 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
                  <TrendingUp className="text-blue-500" size={16} />
                  <span>Multiplicateur Global du Public Calculator</span>
                </h2>

                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Taux Mensuel (Coefficient Leasing)</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.0001"
                        value={editedSettings["leasing_rate"] || ""}
                        onChange={(e) => setEditedSettings(prev => ({ ...prev, leasing_rate: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-blue-500 font-semibold font-mono"
                        required
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                      * Le coefficient `0.0216` correspond à une mensualité d'environ 650 € par tranche de 30 000 € financée.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Matrix Editor */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Matrix of APR by duration & provider */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <h2 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
                  <Percent className="text-blue-500" size={16} />
                  <span>Matrice d'Intérêts APR des Prêteurs (%)</span>
                </h2>

                <div className="space-y-6">
                  {providers.map((provider) => (
                    <div key={provider.id} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${provider.isActive ? "bg-emerald-500" : "bg-red-500"}`}></span>
                        <h3 className="font-bold text-xs text-slate-300">{provider.name}</h3>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        {provider.rates.map((rate) => (
                          <div key={rate.id} className="space-y-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">{rate.durationMonths}m</label>
                            <div className="relative flex items-center">
                              <input
                                type="number"
                                step="0.01"
                                value={editedRates[rate.id] || ""}
                                onChange={(e) => setEditedRates(prev => ({ ...prev, [rate.id]: e.target.value }))}
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1 text-center text-xs text-slate-200 font-semibold focus:outline-none focus:border-blue-500 font-mono pr-4"
                                required
                              />
                              <span className="absolute right-1 text-[9px] text-slate-600 font-extrabold">%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 cursor-pointer disabled:opacity-50"
                >
                  {isSavingSettings ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Save size={16} />
                  )}
                  <span>Sauvegarder les Paramètres</span>
                </button>
              </div>

            </div>

          </form>

          <hr className="border-slate-800 my-8" />

          {/* Change Password Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl space-y-5">
            <h2 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
              🔐 <span>Sécurité du Compte (Changer le mot de passe)</span>
            </h2>

            {passwordStatus && (
              <div className={`p-3.5 rounded-xl border text-xs font-semibold ${passwordStatus.type === "success" ? "bg-emerald-950/40 border-emerald-500/35 text-emerald-300" : "bg-red-950/40 border-red-500/35 text-red-300"}`}>
                {passwordStatus.message}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Mot de passe actuel</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl py-2.5 px-3 focus:outline-none focus:border-blue-500 font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nouveau mot de passe</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl py-2.5 px-3 focus:outline-none focus:border-blue-500 font-semibold"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl py-2.5 px-3 focus:outline-none focus:border-blue-500 font-semibold"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 cursor-pointer disabled:opacity-50"
              >
                {isUpdatingPassword ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : null}
                <span>Modifier le mot de passe</span>
              </button>
            </form>
          </div>

        </div>
      )}

      </main>
    </div>
  );
}
