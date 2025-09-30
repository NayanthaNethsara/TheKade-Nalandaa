"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

// Dynamically import react-pdf components to avoid SSR issues
const PDFDocument = dynamic(
  async () => {
    const { Document, pdfjs } = await import("react-pdf");

    // Set local worker
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();

    return Document;
  },
  { ssr: false }
);

const PDFPage = dynamic(
  async () => {
    const { Page } = await import("react-pdf");
    return Page;
  },
  { ssr: false }
);

interface BookChunksProps {
  chunkUrl: string;
  title: string;
}

export function BookChunks({ chunkUrl, title }: BookChunksProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(600);

  // Update container width for responsive rendering
  useEffect(() => {
    if (!containerRef.current) return;

    const handleResize = () => {
      const width = containerRef.current?.clientWidth || 600;
      setContainerWidth(Math.min(width, 800));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextPage();
      if (e.key === "ArrowLeft") prevPage();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [pageNumber, numPages]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const nextPage = () => {
    if (pageNumber < numPages) setPageNumber(pageNumber + 1);
  };

  const prevPage = () => {
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {title} - Reader
        </CardTitle>
      </CardHeader>
      <CardContent ref={containerRef} className="flex flex-col items-center">
        <PDFDocument file={chunkUrl} onLoadSuccess={onDocumentLoadSuccess}>
          <PDFPage
            pageNumber={pageNumber}
            width={containerWidth}
            scale={scale}
            renderAnnotationLayer={false}
            renderTextLayer={false} // removes warnings
          />
        </PDFDocument>

        <div className="flex gap-2 mt-2 items-center">
          <button
            onClick={prevPage}
            disabled={pageNumber === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {pageNumber} of {numPages}
          </span>
          <button
            onClick={nextPage}
            disabled={pageNumber === numPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>

          <button
            onClick={() => setScale(scale + 0.1)}
            className="px-3 py-1 border rounded"
          >
            Zoom In
          </button>
          <button
            onClick={() => setScale(scale - 0.1)}
            className="px-3 py-1 border rounded"
          >
            Zoom Out
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
