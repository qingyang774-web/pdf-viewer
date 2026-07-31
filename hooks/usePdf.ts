"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { PdfSource, PdfStatus, UsePdfResult } from "@/types/pdf";

function isValidPdfUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function decodePdfParam(raw: string): string {
  let value = raw.trim();

  // Decode if the value was percent-encoded in the query string
  try {
    if (/%[0-9A-Fa-f]{2}/.test(value)) {
      value = decodeURIComponent(value);
    }
  } catch {
    // keep raw value
  }

  return value.trim();
}

/**
 * Reads the PDF URL from the `pdf` query parameter.
 *
 * Example: /viewer?pdf=https%3A%2F%2Fexample.com%2Fsample.pdf
 */
export function usePdf(): UsePdfResult {
  const searchParams = useSearchParams();
  const raw = searchParams.get("pdf");

  return useMemo((): UsePdfResult => {
    if (!raw || raw.trim() === "") {
      return {
        pdfUrl: null,
        status: "empty",
        errorMessage: null,
      };
    }

    const decoded = decodePdfParam(raw);

    if (!isValidPdfUrl(decoded)) {
      return {
        pdfUrl: null,
        status: "error",
        errorMessage: "Unable to load PDF",
      };
    }

    return {
      pdfUrl: decoded as PdfSource,
      status: "loading",
      errorMessage: null,
    };
  }, [raw]);
}
