"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(600);

  // Update container width for responsive rendering
  useEffect(() => {
    if (!containerRef.current) return;

    const handleResize = () => {
      const width = containerRef.current?.clientWidth || 600;
      setContainerWidth(Math.min(width - 40, 900));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextPage = useCallback(() => {
    if (pageNumber < numPages) setPageNumber(pageNumber + 1);
  }, [pageNumber, numPages]);

  const prevPage = useCallback(() => {
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
  }, [pageNumber]);

  const zoomIn = useCallback(() => {
    setScale((s) => Math.min(s + 0.2, 3));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((s) => Math.max(s - 0.2, 0.5));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        nextPage();
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prevPage();
      }
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        zoomIn();
      }
      if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        zoomOut();
      }
      if (e.key === "0") {
        e.preventDefault();
        resetZoom();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextPage, prevPage, zoomIn, zoomOut, resetZoom]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Card
      className={`shadow-xl border-2 transition-all ${
        isFullscreen ? "fixed inset-4 z-50" : ""
      }`}
    >
      <CardHeader className="border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" />
            <span className="font-semibold">{title}</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1">
              Page {pageNumber} of {numPages || "..."}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="h-8 w-8 p-0"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent
        ref={containerRef}
        className={`flex flex-col items-center bg-gradient-to-b from-background to-muted/10 ${
          isFullscreen
            ? "h-[calc(100vh-12rem)] overflow-y-auto"
            : "min-h-[600px]"
        }`}
      >
        <div className="py-6 flex-1 flex items-center justify-center">
          <PDFDocument file={chunkUrl} onLoadSuccess={onDocumentLoadSuccess}>
            <div className="shadow-2xl rounded-lg overflow-hidden border-4 border-border/50">
              <PDFPage
                pageNumber={pageNumber}
                width={containerWidth}
                scale={scale}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            </div>
          </PDFDocument>
        </div>

        {/* Enhanced Controls */}
        <div className="w-full py-4 border-t bg-background/80 backdrop-blur-sm sticky bottom-0">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Page Navigation */}
            <div className="flex items-center gap-2">
              <Button
                onClick={prevPage}
                disabled={pageNumber === 1}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md min-w-[140px] justify-center">
                <input
                  type="number"
                  min={1}
                  max={numPages}
                  value={pageNumber}
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    if (page >= 1 && page <= numPages) setPageNumber(page);
                  }}
                  className="w-12 text-center bg-background rounded px-2 py-0.5 text-sm"
                />
                <span className="text-sm text-muted-foreground">
                  / {numPages}
                </span>
              </div>

              <Button
                onClick={nextPage}
                disabled={pageNumber === numPages}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2 border-l pl-3">
              <Button
                onClick={zoomOut}
                disabled={scale <= 0.5}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>

              <Button
                onClick={resetZoom}
                variant="ghost"
                size="sm"
                className="min-w-[80px]"
              >
                {Math.round(scale * 100)}%
              </Button>

              <Button
                onClick={zoomIn}
                disabled={scale >= 3}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="text-xs text-muted-foreground text-center mt-3">
            <kbd className="px-1.5 py-0.5 bg-muted rounded border">←</kbd>{" "}
            <kbd className="px-1.5 py-0.5 bg-muted rounded border">→</kbd>{" "}
            Navigate •{" "}
            <kbd className="px-1.5 py-0.5 bg-muted rounded border">+</kbd>{" "}
            <kbd className="px-1.5 py-0.5 bg-muted rounded border">-</kbd> Zoom
            • <kbd className="px-1.5 py-0.5 bg-muted rounded border">0</kbd>{" "}
            Reset
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
