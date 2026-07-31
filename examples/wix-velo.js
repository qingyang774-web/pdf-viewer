/**
 * Wix Page Code (Velo)
 *
 * Setup:
 * 1. Add an HTML Component, set ID to htmlPdf
 * 2. Paste examples/wix-embed.html into that component
 * 3. Paste this into the page's Velo code
 *
 * Flow: Wix → HTML Component → Next.js iframe → displays PDF
 */

// @ts-nocheck — paste into Wix Velo editor

$w.onReady(function () {
  const pdfUrl =
    "https://d717d48e-b445-452c-9b92-b21ab8056a14.usrfiles.com/ugd/e90510_0f81439048824f27a888593683d53751.pdf";

  // Small delay so the HTML Component iframe can finish loading
  setTimeout(() => {
    $w("#htmlPdf").postMessage({
      type: "SET_PDF",
      pdf: pdfUrl,
    });
  }, 800);
});

/**
 * Update the PDF anytime:
 *
 *   $w("#htmlPdf").postMessage({
 *     type: "SET_PDF",
 *     pdf: "https://your-cdn.com/new-file.pdf"
 *   });
 */
