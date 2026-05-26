import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import UploadWrapper from "@/components/UploadWrapper";
import { ShieldCheck, FileText, Clock, XCircle, LogOut } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { documents: { orderBy: { uploadedAt: "desc" } } }
  });

  if (!user) {
    redirect("/");
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED": return <ShieldCheck className="text-emerald-500" size={20} />;
      case "REJECTED": return <XCircle className="text-red-500" size={20} />;
      default: return <Clock className="text-amber-500" size={20} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED": return <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">Approuvé</span>;
      case "REJECTED": return <span className="px-2 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium border border-red-200">Rejeté</span>;
      default: return <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium border border-amber-200">En attente</span>;
    }
  };

  const formatDocType = (type: string) => {
    const types: Record<string, string> = {
      "ID_CARD": "Carte d'identité",
      "MEDICAL_LICENSE": "Licence Médicale",
      "PROOF_OF_ADDRESS": "Justificatif de domicile",
      "SUPERVISION_PROOF": "Preuve de supervision"
    };
    return types[type] || type;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
            W
          </div>
          <h1 className="text-xl font-bold tracking-tight">Well Being <span className="text-blue-600">Pro</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600 hidden md:inline-block">{user.email}</span>
          <Link href="/api/auth/signout" className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors">
            <LogOut size={16} /> Déconnexion
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Espace Client</h2>
          <p className="text-slate-500">Gérez vos informations de vérification KYC/KYB pour l'obtention de votre leasing.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold mb-4 border-b border-slate-100 pb-4">Profil</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-500">Rôle</p>
                  <p className="font-medium">{user.role}</p>
                </div>
                <div>
                  <p className="text-slate-500">Juridiction</p>
                  <p className="font-medium">{user.jurisdiction}</p>
                </div>
                {user.professionalId && (
                  <div>
                    <p className="text-slate-500">Identifiant Professionnel</p>
                    <p className="font-medium">{user.professionalId}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Client Wrapper to handle state updates after upload */}
            <UploadWrapper /> 
            {/* Note: The wrapper handles router.refresh() to update the server component's data */}
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <FileText className="text-blue-600" />
                Vos Documents
              </h3>

              {user.documents.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50">
                  <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 font-medium">Aucun document uploadé</p>
                  <p className="text-slate-400 text-sm mt-1">Veuillez envoyer vos documents requis pour procéder au leasing.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {user.documents.map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{formatDocType(doc.documentType)}</p>
                          <p className="text-xs text-slate-500">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(doc.status)}
                        <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 text-sm font-medium hover:underline">
                          Voir
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
