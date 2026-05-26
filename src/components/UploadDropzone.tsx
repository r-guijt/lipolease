"use client";

import React, { useState, useCallback } from "react";
import { UploadCloud, File as FileIcon, X, Loader2, CheckCircle } from "lucide-react";

interface UploadDropzoneProps {
  onUploadSuccess: () => void;
}

export default function UploadDropzone({ onUploadSuccess }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("ID_CARD");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
      setSuccess(false);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", documentType);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(await res.text() || "Upload failed");
      }

      setSuccess(true);
      setFile(null);
      onUploadSuccess();
    } catch (err: any) {
      setError(err.message || "Something went wrong during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Uploader un document</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Type de document</label>
        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="w-full bg-white border border-slate-300 rounded-xl py-2 px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        >
          <option value="ID_CARD">Carte d'identité / Passeport</option>
          <option value="MEDICAL_LICENSE">Licence Médicale / Attestation d'inscription</option>
          <option value="PROOF_OF_ADDRESS">Justificatif de domicile</option>
          <option value="SUPERVISION_PROOF">Preuve de supervision médicale</option>
        </select>
      </div>

      {!file ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50 hover:bg-slate-100"
          }`}
        >
          <UploadCloud className={`w-12 h-12 mx-auto mb-4 ${isDragging ? "text-blue-500" : "text-slate-400"}`} />
          <p className="text-slate-600 mb-2">Glissez-déposez votre fichier ici</p>
          <p className="text-slate-400 text-sm mb-4">ou</p>
          <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors inline-block font-medium">
            Parcourir les fichiers
            <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
          </label>
          <p className="text-xs text-slate-400 mt-4">Formats acceptés : PDF, JPG, PNG. Max 5MB.</p>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                <FileIcon size={20} />
              </div>
              <div className="truncate">
                <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              onClick={() => setFile(null)}
              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors"
              disabled={isUploading}
            >
              <X size={16} />
            </button>
          </div>

          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="animate-spin" size={18} /> : <UploadCloud size={18} />}
            {isUploading ? "Upload en cours..." : "Confirmer et Envoyer"}
          </button>
        </div>
      )}

      {success && (
        <div className="mt-4 flex items-center gap-2 text-emerald-600 bg-emerald-50 p-3 rounded-lg text-sm">
          <CheckCircle size={18} />
          Document envoyé avec succès.
        </div>
      )}
    </div>
  );
}
