/**
 * Wix — embed via query parameter (no postMessage).
 *
 * Build the iframe src with an encoded PDF URL and set it on the HTML Component.
 */

// @ts-nocheck — paste into Wix Velo editor

$w.onReady(function () {
  const viewerBase = "https://pdf-viewer-rho.vercel.app/viewer";
  const pdfUrl =
    "https://d717d48e-b445-452c-9b92-b21ab8056a14.usrfiles.com/ugd/e90510_0f81439048824f27a888593683d53751.pdf";

  const src = `${viewerBase}?pdf=${encodeURIComponent(pdfUrl)}`;

  // Put this URL in your HTML Component iframe src attribute:
  // <iframe src="..." style="width:100%;height:100vh;border:none;"></iframe>
  console.log("PDF Viewer URL:", src);
});
