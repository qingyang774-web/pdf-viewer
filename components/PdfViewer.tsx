"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Document, pdfjs } from "react-pdf";
import PdfPage from "@/components/PdfPage";
import Loading from "@/components/Loading";
import ErrorState from "@/components/Error";
import type { PdfDocumentInfo, PdfStatus } from "@/types/pdf";

function configureWorker() {
  // Absolute CDN URL — avoids Next.js webpack transforming the worker on Vercel
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

configureWorker();

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
  const [fileData, setFileData] = useState<Uint8Array | string | null>(null);
  const width = usePageWidth();

  useEffect(() => {
    configureWorker();
  }, []);

  // Fetch PDF ourselves so we can fall back to same-origin proxy if CORS blocks
  useEffect(() => {
    let cancelled = false;
    setFileData(null);
    setLoadError(false);
    setNumPages(0);
    onStatusChange("loading");

    async function load() {
      const tryUrls = [pdfUrl, `/api/pdf?url=${encodeURIComponent(pdfUrl)}`];

      for (const url of tryUrls) {
        try {
          const res = await fetch(url);
          if (!res.ok) {
            continue;
          }
          const buffer = await res.arrayBuffer();
          const bytes = new Uint8Array(buffer);
          // Basic PDF magic check
          const head = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
          if (head !== "%PDF") {
            continue;
          }
          if (!cancelled) {
            setFileData(bytes);
          }
          return;
        } catch {
          // try next
        }
      }

      if (!cancelled) {
        setLoadError(true);
        onStatusChange("error");
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [pdfUrl, onStatusChange]);

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

  if (!fileData) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen w-full bg-[#F5F5F5]">
      <Document
        file={{ data: fileData }}
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
