"use client"

import type React from "react"

import { useState } from "react"
import type { BookFormData } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, ImageIcon, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function BookForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    description: "",
    authorId: 0,
    authorName: "",
    titleSlug: "",
  })
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleInputChange = (field: keyof BookFormData, value: string | number) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      if (field === "title") {
        updated.titleSlug = generateSlug(value as string)
      }
      return updated
    })
  }

  const handleFileChange = (type: "pdf" | "cover", file: File | null) => {
    if (type === "pdf") {
      setPdfFile(file)
    } else {
      setCoverImage(file)
    }
  }

  const uploadFile = async (file: File, type: "pdf" | "image"): Promise<string> => {
    const uploadFormData = new FormData()
    uploadFormData.append("file", file)
    uploadFormData.append("type", type)

    const response = await fetch("/api/upload", {
      method: "POST",
      body: uploadFormData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Upload failed")
    }

    const { url } = await response.json()
    return url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.authorName) {
        throw new Error("Please fill in all required fields")
      }

      let chunkUrls: string[] = []
      let coverImagePath = ""

      // Upload PDF if provided
      if (pdfFile) {
        try {
          const pdfUrl = await uploadFile(pdfFile, "pdf")
          chunkUrls = [pdfUrl]
        } catch (uploadError) {
          console.log("[v0] PDF upload failed, continuing without file:", uploadError)
          // Continue without PDF for now since Supabase isn't set up
        }
      }

      // Upload cover image if provided
      if (coverImage) {
        try {
          coverImagePath = await uploadFile(coverImage, "image")
        } catch (uploadError) {
          console.log("[v0] Cover image upload failed, continuing without file:", uploadError)
          // Continue without cover image for now since Supabase isn't set up
        }
      }

      // Create book via API
      const bookData = {
        title: formData.title,
        description: formData.description,
        authorId: formData.authorId || 1, // Default to 1 if not provided
        authorName: formData.authorName,
        chunkUrls,
        titleSlug: formData.titleSlug,
        coverImagePath,
      }

      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      })

      if (!response.ok) {
        throw new Error("Failed to create book")
      }

      // Redirect to books list
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Book</CardTitle>
        <CardDescription>Upload a book with PDF chunks and cover image to your collection.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter book title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="authorName">Author Name *</Label>
              <Input
                id="authorName"
                value={formData.authorName}
                onChange={(e) => handleInputChange("authorName", e.target.value)}
                placeholder="Enter author name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter book description"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="authorId">Author ID</Label>
              <Input
                id="authorId"
                type="number"
                value={formData.authorId}
                onChange={(e) => handleInputChange("authorId", Number.parseInt(e.target.value) || 0)}
                placeholder="Enter author ID (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="titleSlug">URL Slug</Label>
              <Input
                id="titleSlug"
                value={formData.titleSlug}
                onChange={(e) => handleInputChange("titleSlug", e.target.value)}
                placeholder="auto-generated-from-title"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>PDF File</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange("pdf", e.target.files?.[0] || null)}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium">{pdfFile ? pdfFile.name : "Upload PDF"}</p>
                  <p className="text-xs text-muted-foreground">Click to select PDF file</p>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cover Image</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange("cover", e.target.files?.[0] || null)}
                  className="hidden"
                  id="cover-upload"
                />
                <label htmlFor="cover-upload" className="cursor-pointer">
                  <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium">{coverImage ? coverImage.name : "Upload Cover"}</p>
                  <p className="text-xs text-muted-foreground">Click to select image</p>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Book...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Create Book
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/")} disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
