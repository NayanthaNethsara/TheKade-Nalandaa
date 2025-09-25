"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, FileText } from "lucide-react"

interface BookChunksProps {
  chunkUrls: string[]
  title: string
}

export function BookChunks({ chunkUrls, title }: BookChunksProps) {
  const [loadingChunk, setLoadingChunk] = useState<string | null>(null)

  const handleChunkClick = async (url: string) => {
    setLoadingChunk(url)
    try {
      // Open PDF in new tab
      window.open(url, "_blank")
    } catch (error) {
      console.error("Error opening chunk:", error)
    } finally {
      setLoadingChunk(null)
    }
  }

  if (chunkUrls.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No chunks available</h3>
            <p className="text-muted-foreground">This book doesn't have any PDF chunks yet.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Book Chunks
          <Badge variant="secondary">{chunkUrls.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {chunkUrls.map((url, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="font-medium">
                    {title} - Part {index + 1}
                  </p>
                  <p className="text-sm text-muted-foreground">PDF Document</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleChunkClick(url)}
                disabled={loadingChunk === url}
                className="gap-2"
              >
                {loadingChunk === url ? (
                  "Opening..."
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4" />
                    Open
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
