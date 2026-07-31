"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type {
  PdfMessage,
  PdfSource,
  PdfStatus,
  PdfViewerReadyMessage,
  UsePdfResult,
} from "@/types/pdf";

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
 * Extract a PDF URL from common Wix / iframe postMessage payloads.
 * Supports objects and JSON strings; ignores unrelated traffic (HMR, analytics, etc.).
 */
export function extractPdfUrlFromMessage(data: unknown): string | null {
  if (data == null) {
    return null;
  }

  let payload: unknown = data;

  // Wix / some embeds send JSON strings
  if (typeof payload === "string") {
    const trimmed = payload.trim();
    if (!trimmed) {
      return null;
    }

    // Plain URL string
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

  // Ignore our own ready handshake and other noise
  if (message.type === "PDF_VIEWER_READY" || message.source === "react-devtools-bridge") {
    return null;
  }

  const candidates = [message.pdf, message.url, message.src];

  // Nested: { data: { pdf: "..." } } (some Wix bridges)
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

function announceReadyToParent() {
  if (typeof window === "undefined" || window.parent === window) {
    return;
  }

  const ready: PdfViewerReadyMessage = {
    type: "PDF_VIEWER_READY",
    source: "pdf-viewer",
  };

  try {
    window.parent.postMessage(ready, "*");
  } catch {
    // Cross-origin parent may still receive it; ignore rare failures
  }
}

/**
 * Resolves the PDF URL from the `pdf` query param and parent postMessage (Wix).
 * postMessage updates replace the current document immediately.
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

  // Primary: ?pdf= query parameter (Wix embed URL)
  useEffect(() => {
    const fromQuery = searchParams.get("pdf");
    if (fromQuery) {
      // decode once more in case the value was double-encoded in the embed URL
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
      // Inside an iframe (Wix), wait for postMessage instead of flashing empty
      const embedded = window.parent !== window;
      setStatus(embedded ? "idle" : "empty");
    }
    setHydrated(true);
  }, [searchParams, setPdfUrl, hydrated]);

  // Secondary: postMessage from Wix / parent page
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const nextUrl = extractPdfUrlFromMessage(event.data);
      if (nextUrl) {
        setPdfUrl(nextUrl);
      }
    };

    window.addEventListener("message", onMessage);

    // Tell the parent we are listening (handles race if parent posted early)
    announceReadyToParent();
    // Re-announce shortly after in case the parent listener attached late
    const retryId = window.setTimeout(announceReadyToParent, 500);

    // If embedded and nothing arrives, fall back to empty state
    const emptyTimeoutId = window.setTimeout(() => {
      setPdfUrlState((current) => {
        if (!current) {
          setStatus("empty");
        }
        return current;
      });
    }, 12000);

    return () => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(retryId);
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
