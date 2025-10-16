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
  const [pdfError, setPdfError] = useState<string | null>(null);
  // Track loading implicitly via numPages and error states (no explicit isLoading)
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(600);

  // Basic URL validation (no console logs)
  useEffect(() => {
    if (!chunkUrl) {
      setPdfError("No PDF URL provided");
    } else if (!chunkUrl.startsWith("http")) {
      setPdfError("Invalid PDF URL format");
    }
  }, [chunkUrl]);

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
    setPdfError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    setPdfError(
      `Failed to load PDF: ${error.message}. The file may be unavailable or the link has expired.`
    );
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Card
      className={`shadow-lg border border-slate-200/50 dark:border-slate-700/50 transition-all bg-white dark:bg-slate-900 ${
        isFullscreen ? "fixed inset-4 z-50" : ""
      }`}
    >
      <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-950/20">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-slate-100 dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
              {title}
            </span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-sm">
              Page {pageNumber} of {numPages || "..."}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="h-9 w-9 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              ) : (
                <Maximize2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent
        ref={containerRef}
        className={`flex flex-col items-center bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 ${
          isFullscreen
            ? "h-[calc(100vh-12rem)] overflow-y-auto"
            : "min-h-[600px]"
        }`}
      >
        <div className="py-6 flex-1 flex items-center justify-center w-full">
          {pdfError ? (
            <div className="text-center max-w-md p-8">
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="text-red-600 dark:text-red-400 font-semibold mb-2">
                  Unable to Load PDF
                </div>
                <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                  {pdfError}
                </p>
                <Button
                  onClick={() => {
                    setPdfError(null);
                    window.location.reload();
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Reload Page
                </Button>
              </div>
            </div>
          ) : (
            <PDFDocument
              file={chunkUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="text-center p-8">
                  <div className="inline-flex items-center gap-3 px-6 py-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="w-5 h-5 border-2 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
                    <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                      Loading PDF document...
                    </span>
                  </div>
                </div>
              }
            >
              <div className="shadow-xl rounded-lg overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
                <PDFPage
                  pageNumber={pageNumber}
                  width={containerWidth}
                  scale={scale}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  loading={
                    <div
                      className="flex items-center justify-center p-8 bg-slate-100 dark:bg-slate-800"
                      style={{
                        width: containerWidth,
                        height: containerWidth * 1.414,
                      }}
                    >
                      <div className="text-center">
                        <div className="w-8 h-8 border-2 border-t-transparent border-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Rendering page {pageNumber}...
                        </span>
                      </div>
                    </div>
                  }
                />
              </div>
            </PDFDocument>
          )}
        </div>

        {/* Enhanced Controls */}
        <div className="w-full py-4 border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm sticky bottom-0">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Page Navigation */}
            <div className="flex items-center gap-2">
              <Button
                onClick={prevPage}
                disabled={pageNumber === 1}
                variant="outline"
                size="sm"
                className="gap-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg min-w-[140px] justify-center border border-slate-200 dark:border-slate-700">
                <input
                  type="number"
                  min={1}
                  max={numPages}
                  value={pageNumber}
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    if (page >= 1 && page <= numPages) setPageNumber(page);
                  }}
                  className="w-12 text-center bg-white dark:bg-slate-950 rounded px-2 py-1 text-sm font-semibold border border-slate-300 dark:border-slate-600"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  / {numPages}
                </span>
              </div>

              <Button
                onClick={nextPage}
                disabled={pageNumber === numPages}
                variant="outline"
                size="sm"
                className="gap-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2 border-l border-slate-300 dark:border-slate-600 pl-3">
              <Button
                onClick={zoomOut}
                disabled={scale <= 0.5}
                variant="outline"
                size="sm"
                className="gap-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>

              <Button
                onClick={resetZoom}
                variant="ghost"
                size="sm"
                className="min-w-[80px] font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30"
              >
                {Math.round(scale * 100)}%
              </Button>

              <Button
                onClick={zoomIn}
                disabled={scale >= 3}
                variant="outline"
                size="sm"
                className="gap-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="text-xs text-slate-600 dark:text-slate-400 text-center mt-3">
            <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-600">
              ←
            </kbd>{" "}
            <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-600">
              →
            </kbd>{" "}
            Navigate •{" "}
            <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-600">
              +
            </kbd>{" "}
            <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-600">
              -
            </kbd>{" "}
            Zoom •{" "}
            <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-600">
              0
            </kbd>{" "}
            Reset
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
