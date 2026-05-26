"use client";

import React from "react";
import UploadDropzone from "./UploadDropzone";
import { useRouter } from "next/navigation";

export default function UploadWrapper() {
  const router = useRouter();

  const handleUploadSuccess = () => {
    // Refresh the current route to fetch updated data from the server
    router.refresh();
  };

  return <UploadDropzone onUploadSuccess={handleUploadSuccess} />;
}
