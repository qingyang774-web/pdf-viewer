/**
 * Wix HTML Component bridge (already included in wix-embed.html)
 *
 * Iframe src = Vercel viewer only (no ?pdf=)
 * Dynamic PDF URL is sent from Velo via postMessage.
 *
 * Velo:
 *   $w("#htmlPdf").postMessage({ type: "SET_PDF", pdf: dynamicPdfUrl });
 */

const VIEWER_URL = "https://pdf-viewer-rho.vercel.app/viewer";
