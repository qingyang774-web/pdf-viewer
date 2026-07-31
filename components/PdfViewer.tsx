"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Document, pdfjs } from "react-pdf";
import PdfPage from "@/components/PdfPage";
import Loading from "@/components/Loading";
import ErrorState from "@/components/Error";
import type { PdfDocumentInfo, PdfStatus } from "@/types/pdf";

// Served from /public — Next.js webpack breaks import.meta.url worker bundles on Vercel
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface PdfViewerProps {
  pdfUrl: string;
  onStatusChange: (status: PdfStatus) => void;
}

function usePageWidth() {
  const [width, setWidth] = useState(900);

  useEffect(() => {
    const update = () => {
      const padding = window.innerWidth < 640 ? 32 : 48;
      const available = window.innerWidth - padding;
      setWidth(Math.min(900, Math.max(280, available)));
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return width;
}

export default function PdfViewer({ pdfUrl, onStatusChange }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [loadError, setLoadError] = useState(false);
  const width = usePageWidth();

  const onLoadSuccess = useCallback(
    ({ numPages: pages }: PdfDocumentInfo) => {
      setNumPages(pages);
      setLoadError(false);
      onStatusChange("ready");
    },
    [onStatusChange]
  );

  const onLoadError = useCallback(() => {
    setNumPages(0);
    setLoadError(true);
    onStatusChange("error");
  }, [onStatusChange]);

  useEffect(() => {
    setNumPages(0);
    setLoadError(false);
    onStatusChange("loading");
  }, [pdfUrl, onStatusChange]);

  const pages = useMemo(() => {
    if (!numPages) {
      return null;
    }

    return Array.from({ length: numPages }, (_, index) => (
      <PdfPage key={`${pdfUrl}-${index + 1}`} pageNumber={index + 1} width={width} />
    ));
  }, [numPages, pdfUrl, width]);

  if (loadError) {
    return <ErrorState message="Unable to load PDF" />;
  }

  return (
    <div className="min-h-screen w-full bg-[#F5F5F5]">
      <Document
        file={pdfUrl}
        onLoadSuccess={onLoadSuccess}
        onLoadError={onLoadError}
        loading={<Loading />}
        error={<ErrorState message="Unable to load PDF" />}
        className="mx-auto flex w-full max-w-[960px] flex-col items-center gap-6 px-4 py-6 sm:gap-7 sm:px-6 sm:py-8"
      >
        {pages}
      </Document>
    </div>
  );
}
