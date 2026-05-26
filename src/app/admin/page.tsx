"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password
      });

      if (result?.error) {
        throw new Error("Identifiants incorrects ou accès refusé.");
      }

      // Check user session
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      if (session?.user?.role !== "ADMIN") {
        throw new Error("Accès refusé. Réservé aux administrateurs.");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse delay-1000"></div>

      <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative">
        {/* Brand/Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 mb-4 border border-white/10">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight text-center">
            LipoLease <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Operations</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1.5 text-center uppercase tracking-widest font-bold">
            Dashboard d'administration sécurisé
          </p>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-500/35 text-red-300 p-4 rounded-2xl text-xs font-semibold mb-6 animate-shake leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider pl-1">
              Adresse Email Admin
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lipolease.com"
                className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500/80 transition-all font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider pl-1">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500/80 transition-all font-medium"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold py-3.5 px-4 rounded-2xl transition-all flex justify-center items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 mt-8"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>
                <span>Se connecter</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-semibold"
          >
            ← Retourner sur le site public
          </a>
        </div>
      </div>
    </div>
  );
}
