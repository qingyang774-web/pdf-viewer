# Minimal PDF Viewer (Next.js + React)

Embeddable PDF reader. Loads a PDF from the `pdf` query parameter — no postMessage.

**Live:** https://pdf-viewer-rho.vercel.app/viewer

## Usage

```text
https://pdf-viewer-rho.vercel.app/viewer?pdf=https%3A%2F%2Fexample.com%2Fsample.pdf
```

Unencoded also works:

```text
https://pdf-viewer-rho.vercel.app/viewer?pdf=https://example.com/sample.pdf
```

### Wix / iframe embed

```html
<iframe
  src="https://pdf-viewer-rho.vercel.app/viewer?pdf=https%3A%2F%2Fexample.com%2Fsample.pdf"
  style="width:100%;height:80vh;border:0;"
  title="PDF Viewer"
></iframe>
```

Build the URL dynamically:

```javascript
const src = `https://pdf-viewer-rho.vercel.app/viewer?pdf=${encodeURIComponent(pdfUrl)}`;
```

## UX states

| State | UI |
| --- | --- |
| Loading | Centered spinner |
| Missing `pdf` param | `No PDF specified` |
| Load failure | `Unable to load PDF` |
| Ready | Vertically stacked pages on `#F5F5F5` |

## Local development

```bash
npm install
npm run dev
```

```
http://localhost:3000/viewer?pdf=https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf
```

## Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- react-pdf + pdfjs-dist

## CORS

The PDF host must allow browser fetches (`Access-Control-Allow-Origin`).

## License

MIT
