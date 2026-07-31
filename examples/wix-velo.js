/**
 * Wix Velo — send a dynamic PDF URL into the viewer iframe.
 *
 * Setup:
 * 1. Add an HTML Component on the page, set its ID to htmlPdf
 * 2. Paste the HTML from examples/wix-embed.html into that component
 *    (viewer: https://pdf-viewer-rho.vercel.app/viewer)
 * 3. Paste this code into the page's Velo code
 */

// @ts-nocheck — paste into Wix Velo editor

$w.onReady(function () {
  const html = $w("#htmlPdf");

  function sendPdf(pdfUrl) {
    if (!pdfUrl) return;
    html.postMessage({ type: "SET_PDF", pdf: pdfUrl });
  }

  // When the viewer is ready, send (or re-send) the current PDF
  html.onMessage((event) => {
    if (event.data?.type === "PDF_VIEWER_READY") {
      // Replace with your dynamic source (CMS, dataset, query, etc.)
      const pdfUrl = $w("#dynamicDataset").getCurrentItem()?.pdfUrl;
      // Or a fixed test URL:
      // const pdfUrl = "https://your-cdn.com/file.pdf";
      sendPdf(pdfUrl);
    }
  });

  // Example: send whenever your data is ready
  // sendPdf("https://your-cdn.com/file.pdf");
});

/**
 * Call this anytime the PDF URL changes (button click, dataset change, etc.):
 *
 *   $w("#htmlPdf").postMessage({
 *     type: "SET_PDF",
 *     pdf: "https://your-cdn.com/new-file.pdf"
 *   });
 */
