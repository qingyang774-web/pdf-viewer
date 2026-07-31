# Minimal PDF Viewer (Next.js + React)

Embeddable PDF reader for Wix. Display only — no toolbar or editing.

**Live:** https://pdf-viewer-rho.vercel.app/viewer

## Message flow

```
Wix Page (Velo)
    │  postMessage({ type: "SET_PDF", pdf })
    ▼
HTML Component
    │  forwards to iframe
    ▼
Next.js Viewer
    │
    ▼
Displays PDF
```

---

## 1. Wix Page Code (Velo)

```javascript
$w.onReady(function () {
  const pdfUrl = "https://your-cdn.com/file.pdf";

  setTimeout(() => {
    $w("#htmlPdf").postMessage({
      type: "SET_PDF",
      pdf: pdfUrl,
    });
  }, 800);
});
```

Replace `#htmlPdf` if your HTML Component ID is different.

---

## 2. HTML Component Code

Paste into the Wix HTML Component:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; }
    iframe { width: 100%; height: 100vh; border: none; }
  </style>
</head>
<body>
  <iframe
    id="pdfViewer"
    src="https://pdf-viewer-rho.vercel.app/viewer"
  ></iframe>
  <script>
    const iframe = document.getElementById("pdfViewer");
    window.onmessage = function (event) {
      iframe.contentWindow.postMessage(event.data, "*");
    };
  </script>
</body>
</html>
```

---

## 3. Next.js (already implemented)

The viewer listens for:

```javascript
{ type: "SET_PDF", pdf: "https://example.com/file.pdf" }
```

Changing `pdfUrl` in Velo immediately updates the displayed PDF.

Optional query-param fallback:

```
https://pdf-viewer-rho.vercel.app/viewer?pdf=https://example.com/file.pdf
```

---

## Local development

```bash
npm install
npm run dev
```

## CORS

The PDF host must allow browser fetches (`Access-Control-Allow-Origin`). Wix Media (`usrfiles.com`) usually allows this.

## License

MIT
