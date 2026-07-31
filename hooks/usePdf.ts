"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { PdfMessage, PdfSource, PdfStatus, UsePdfResult } from "@/types/pdf";

function isValidPdfUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.trim() === "") {
    return false;
  }

  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Extract PDF URL from Wix postMessage payloads.
 * Primary shape: { type: "SET_PDF", pdf: "https://..." }
 */
export function extractPdfUrlFromMessage(data: unknown): string | null {
  if (data == null) {
    return null;
  }

  let payload: unknown = data;

  if (typeof payload === "string") {
    const trimmed = payload.trim();
    if (!trimmed) {
      return null;
    }
    if (isValidPdfUrl(trimmed)) {
      return trimmed;
    }
    try {
      payload = JSON.parse(trimmed);
    } catch {
      return null;
    }
  }

  if (typeof payload !== "object") {
    return null;
  }

  const message = payload as PdfMessage & Record<string, unknown>;

  // Ignore noise / handshake echoes
  if (message.type === "PDF_VIEWER_READY" || message.source === "react-devtools-bridge") {
    return null;
  }

  // Preferred: { type: "SET_PDF", pdf: "..." }
  if (message.type === "SET_PDF" && isValidPdfUrl(message.pdf)) {
    return message.pdf.trim();
  }

  const candidates = [message.pdf, message.url, message.src];

  if (message.data && typeof message.data === "object") {
    const nested = message.data as PdfMessage;
    candidates.push(nested.pdf, nested.url, nested.src);
  }

  for (const candidate of candidates) {
    if (isValidPdfUrl(candidate)) {
      return candidate.trim();
    }
  }

  return null;
}

/**
 * Resolves PDF URL from:
 * 1. ?pdf= query param
 * 2. postMessage { type: "SET_PDF", pdf } from Wix → HTML Component → iframe
 */
export function usePdf(): UsePdfResult {
  const searchParams = useSearchParams();
  const [pdfUrl, setPdfUrlState] = useState<PdfSource>(null);
  const [status, setStatus] = useState<PdfStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const setPdfUrl = useCallback((url: string | null) => {
    if (!url) {
      setPdfUrlState(null);
      setStatus("empty");
      setErrorMessage(null);
      return;
    }

    if (!isValidPdfUrl(url)) {
      setPdfUrlState(null);
      setStatus("error");
      setErrorMessage("Unable to load PDF");
      return;
    }

    setPdfUrlState(url.trim());
    setStatus("loading");
    setErrorMessage(null);
  }, []);

  // Optional: ?pdf= query parameter
  useEffect(() => {
    const fromQuery = searchParams.get("pdf");
    if (fromQuery) {
      let value = fromQuery.trim();
      try {
        if (value.includes("%3A") || value.includes("%2F")) {
          value = decodeURIComponent(value);
        }
      } catch {
        // keep raw value
      }
      setPdfUrl(value);
    } else if (!hydrated) {
      const embedded = window.parent !== window;
      setStatus(embedded ? "idle" : "empty");
    }
    setHydrated(true);
  }, [searchParams, setPdfUrl, hydrated]);

  // Wix → HTML Component → iframe postMessage
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === "SET_PDF" && typeof event.data?.pdf === "string") {
        setPdfUrl(event.data.pdf);
        return;
      }

      const nextUrl = extractPdfUrlFromMessage(event.data);
      if (nextUrl) {
        setPdfUrl(nextUrl);
      }
    };

    window.addEventListener("message", onMessage);

    const emptyTimeoutId = window.setTimeout(() => {
      setPdfUrlState((current) => {
        if (!current) {
          setStatus("empty");
        }
        return current;
      });
    }, 15000);

    return () => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(emptyTimeoutId);
    };
  }, [setPdfUrl]);

  return {
    pdfUrl,
    status,
    setPdfUrl,
    setStatus,
    errorMessage,
  };
}
