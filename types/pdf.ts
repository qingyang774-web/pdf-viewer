export type PdfSource = string | null;

export type PdfStatus = "idle" | "loading" | "ready" | "error" | "empty";

/** Incoming message shapes accepted from a Wix parent (or any embedder). */
export interface PdfMessage {
  type?: string;
  pdf?: string;
  url?: string;
  src?: string;
}

/** Outgoing handshake so the parent knows the iframe is ready to receive a PDF URL. */
export interface PdfViewerReadyMessage {
  type: "PDF_VIEWER_READY";
  source: "pdf-viewer";
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
