export type PdfSource = string | null;

export type PdfStatus = "idle" | "loading" | "ready" | "error" | "empty";

export interface UsePdfResult {
  pdfUrl: PdfSource;
  status: PdfStatus;
  errorMessage: string | null;
}

export interface PdfDocumentInfo {
  numPages: number;
}
