# Minimal PDF Viewer (Next.js + React)

Embeddable PDF reader for Wix iframes. Display only — no toolbar, download, zoom, or editing.

## Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- react-pdf `10.1.0` + pdfjs-dist `5.3.93`

## Quick start

```bash
npm install
npm run dev
```

```
http://localhost:3000/viewer?pdf=https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf
```

---

## Wix embed (dynamic PDF via postMessage)

### 1. HTML Component

Add an **HTML Component** (id: `htmlPdf`) and paste:

```html
<iframe
  id="pdf-viewer"
  src="https://pdf-viewer-rho.vercel.app/viewer"
  style="width:100%;height:80vh;border:0;"
  title="PDF Viewer"
></iframe>
<script>
  const iframe = document.getElementById("pdf-viewer");

  window.onmessage = (event) => {
    const data = event.data;
    if (!data || !iframe?.contentWindow) return;
    if (data.type === "PDF_VIEWER_READY") {
      window.parent.postMessage(data, "*");
      return;
    }
    iframe.contentWindow.postMessage(data, "*");
  };

  window.addEventListener("message", (event) => {
    if (event.data?.type === "PDF_VIEWER_READY" && event.data?.source === "pdf-viewer") {
      window.parent.postMessage(event.data, "*");
    }
  });
</script>
```

Replace `YOUR-APP.vercel.app` with your Vercel URL. No PDF in the `src`.

### 2. Velo — send the dynamic PDF URL

```javascript
$w.onReady(function () {
  const html = $w("#htmlPdf");

  function sendPdf(pdfUrl) {
    if (!pdfUrl) return;
    html.postMessage({ type: "SET_PDF", pdf: pdfUrl });
  }

  html.onMessage((event) => {
    if (event.data?.type === "PDF_VIEWER_READY") {
      sendPdf(yourDynamicPdfUrl); // ← your CMS / dataset / variable
    }
  });

  // Also send when your data is ready:
  // sendPdf(yourDynamicPdfUrl);
});
```

Whenever the PDF changes:

```javascript
$w("#htmlPdf").postMessage({
  type: "SET_PDF",
  pdf: "https://your-cdn.com/new-file.pdf"
});
```

The viewer replaces the document immediately.

---

## UX states

| State | UI |
| --- | --- |
| Loading | Centered spinner |
| Missing URL | `No PDF selected` |
| Load failure | `Unable to load PDF` |
| Ready | Pages on `#F5F5F5` |

## CORS

The PDF host must allow browser fetches (`Access-Control-Allow-Origin`).

## Deploy

```bash
npx vercel
```

`Content-Security-Policy: frame-ancestors *` is set so Wix can iframe the app.

## License

MIT
