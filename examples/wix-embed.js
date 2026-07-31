/**
 * Build a viewer URL with an encoded PDF query param.
 *
 * Example:
 *   https://pdf-viewer-rho.vercel.app/viewer?pdf=https%3A%2F%2Fexample.com%2Fsample.pdf
 */

const VIEWER_BASE = "https://pdf-viewer-rho.vercel.app/viewer";

function buildViewerUrl(pdfUrl) {
  return `${VIEWER_BASE}?pdf=${encodeURIComponent(pdfUrl)}`;
}

// const src = buildViewerUrl("https://example.com/sample.pdf");
