export type PdfSource = string | null;

export type PdfStatus = "idle" | "loading" | "ready" | "error" | "empty";

/** Wix → HTML Component → iframe message */
export interface PdfMessage {
  type?: string;
  pdf?: string;
  url?: string;
  src?: string;
  data?: unknown;
  source?: string;
}

export interface UsePdfResult {
  pdfUrl: PdfSource;
  status: PdfStatus;
  setPdfUrl: (url: string | null) => void;
  setStatus: (status: PdfStatus) => void;
  errorMessage: string | null;
}

export interface PdfDocumentInfo {
  numPages: number;
}
