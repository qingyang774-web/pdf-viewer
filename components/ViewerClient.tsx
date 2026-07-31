"use client";

import dynamic from "next/dynamic";
import { useCallback } from "react";
import { usePdf } from "@/hooks/usePdf";
import Loading from "@/components/Loading";
import ErrorState from "@/components/Error";
import type { PdfStatus } from "@/types/pdf";

const PdfViewer = dynamic(() => import("@/components/PdfViewer"), {
  ssr: false,
  loading: () => <Loading />,
});

export default function ViewerClient() {
  const { pdfUrl, status, setStatus, errorMessage } = usePdf();

  const onStatusChange = useCallback(
    (next: PdfStatus) => {
      setStatus(next);
    },
    [setStatus]
  );

  if (status === "error" && !pdfUrl) {
    return <ErrorState message={errorMessage ?? "Unable to load PDF"} />;
  }

  if (status === "empty") {
    return <ErrorState message="No PDF selected" />;
  }

  // Waiting for query param hydration or Wix postMessage
  if (!pdfUrl) {
    return <Loading />;
  }

  return <PdfViewer key={pdfUrl} pdfUrl={pdfUrl} onStatusChange={onStatusChange} />;
}
