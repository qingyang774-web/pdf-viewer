"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { usePdf } from "@/hooks/usePdf";
import Loading from "@/components/Loading";
import ErrorState from "@/components/Error";
import type { PdfStatus } from "@/types/pdf";

const PdfViewer = dynamic(() => import("@/components/PdfViewer"), {
  ssr: false,
  loading: () => <Loading />,
});

export default function ViewerClient() {
  const { pdfUrl, status, errorMessage } = usePdf();
  const [viewerStatus, setViewerStatus] = useState<PdfStatus>("loading");

  useEffect(() => {
    setViewerStatus("loading");
  }, [pdfUrl]);

  const onStatusChange = useCallback((next: PdfStatus) => {
    setViewerStatus(next);
  }, []);

  if (status === "empty") {
    return <ErrorState message="No PDF specified" />;
  }

  if (status === "error" || !pdfUrl) {
    return <ErrorState message={errorMessage ?? "Unable to load PDF"} />;
  }

  if (viewerStatus === "error") {
    return <ErrorState message="Unable to load PDF" />;
  }

  return <PdfViewer key={pdfUrl} pdfUrl={pdfUrl} onStatusChange={onStatusChange} />;
}
