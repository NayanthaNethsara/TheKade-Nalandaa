"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, ExternalLink, AlertCircle } from "lucide-react";

interface PDFViewerProps {
  bookId: number;
  chunkNumber?: number;
  title: string;
}

export function PDFViewer({ bookId, chunkNumber = 1, title }: PDFViewerProps) {
  const [chunkUrl, setChunkUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChunk() {
      try {
        setLoading(true);
        setError(null);

        // fetching chunk

        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5064";
        const response = await fetch(
          `${backendUrl}/api/Books/${bookId}/chunks/${chunkNumber}`,
          {
            signal: AbortSignal.timeout(5000),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch chunk ${chunkNumber}`);
        }

        // Assuming the API returns the PDF URL or blob
        const chunkData = await response.text();
        setChunkUrl(chunkData);
        // loaded chunk
      } catch {
        // error loading chunk
        setChunkUrl("/pdf-document-placeholder.jpg");
        setError("Backend not available - showing placeholder");
      } finally {
        setLoading(false);
      }
    }

    if (bookId) {
      fetchChunk();
    }
  }, [bookId, chunkNumber]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Loading PDF...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {title} - Chunk {chunkNumber}
          </div>
          {chunkUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(chunkUrl, "_blank")}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open in New Tab
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {chunkUrl ? (
          <div className="w-full h-96 border rounded-lg overflow-hidden bg-muted">
            {chunkUrl.includes("placeholder.svg") ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    PDF Chunk {chunkNumber}
                  </h3>
                  <p className="text-muted-foreground">
                    Connect your backend to view actual PDF content
                  </p>
                </div>
              </div>
            ) : (
              <iframe
                src={chunkUrl}
                className="w-full h-full"
                title={`${title} - Chunk ${chunkNumber}`}
              />
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No PDF chunk available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
