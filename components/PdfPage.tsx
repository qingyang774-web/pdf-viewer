"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Page } from "react-pdf";

interface PdfPageProps {
  pageNumber: number;
  width: number;
}

function PageSkeleton({ width }: { width: number }) {
  const height = Math.round(width * 1.414);

  return (
    <div
      className="animate-pulse rounded-sm bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
      style={{ width, height }}
      aria-hidden
    />
  );
}

function PdfPage({ pageNumber, width }: PdfPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(pageNumber <= 2);
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || shouldRender) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "400px 0px",
        threshold: 0.01,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldRender]);

  return (
    <div
      ref={containerRef}
      className="mx-auto w-full max-w-[900px] overflow-hidden rounded-sm bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
    >
      {shouldRender ? (
        <div className="relative">
          {!pageReady && (
            <div className="absolute inset-0 z-10">
              <PageSkeleton width={width} />
            </div>
          )}
          <Page
            pageNumber={pageNumber}
            width={width}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            loading={<PageSkeleton width={width} />}
            onRenderSuccess={() => setPageReady(true)}
            className={pageReady ? "opacity-100" : "opacity-0"}
          />
        </div>
      ) : (
        <PageSkeleton width={width} />
      )}
    </div>
  );
}

export default memo(PdfPage);
