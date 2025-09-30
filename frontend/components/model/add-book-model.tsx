"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload, X, Loader2, BookOpen } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface AddBookModalProps {
  authorId: number;
  authorName: string;
  onBookAdded?: () => void;
}

export function AddBookModal({
  authorId,
  authorName,
  onBookAdded,
}: AddBookModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast("Invalid file type");
        return;
      }
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const pdfFiles = files.filter((file) => file.type === "application/pdf");

    if (pdfFiles.length !== files.length) {
      toast("Only PDF are allowed");
    }

    setPdfFiles((prev) => [...prev, ...pdfFiles]);
  };

  const removePdfFile = (index: number) => {
    setPdfFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      toast("Please enter a book title");
      return;
    }

    if (!description.trim()) {
      toast("Please enter a book description");
      return;
    }

    if (!coverImage) {
      toast("Please upload a cover image");
      return;
    }

    if (pdfFiles.length === 0) {
      toast("Please upload at least one PDF file");
      return;
    }

    setLoading(true);

    try {
      // Upload cover image
      const coverFormData = new FormData();
      coverFormData.append("file", coverImage);

      const coverResponse = await fetch("/api/upload/cover", {
        method: "POST",
        body: coverFormData,
      });

      if (!coverResponse.ok) throw new Error("Failed to upload cover image");

      const { url: coverImagePath } = await coverResponse.json();

      // Upload PDF chunks
      const chunkUrls: string[] = [];

      for (const pdfFile of pdfFiles) {
        const pdfFormData = new FormData();
        pdfFormData.append("file", pdfFile);

        const pdfResponse = await fetch("/api/upload/pdf", {
          method: "POST",
          body: pdfFormData,
        });

        if (!pdfResponse.ok) throw new Error("Failed to upload PDF");

        const { url } = await pdfResponse.json();
        chunkUrls.push(url);
      }

      // Create book
      const bookData = {
        title,
        description,
        authorId,
        authorName,
        chunkUrls,
        titleSlug: generateSlug(title),
        coverImagePath,
      };

      const bookResponse = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      if (!bookResponse.ok) throw new Error("Failed to create book");

      toast(`"${title}" has been added to your library`);

      // Reset form
      setTitle("");
      setDescription("");
      setCoverImage(null);
      setCoverPreview(null);
      setPdfFiles([]);
      setOpen(false);

      onBookAdded?.();
    } catch (error) {
      console.error("[v0] Error adding book:", error);
      toast("Failed to add book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary/20 backdrop-blur-md border border-primary/30 hover:bg-primary/30 transition-all">
          <Plus className="h-4 w-4" />
          Add New Book
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-primary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <BookOpen className="h-6 w-6 text-primary" />
            Add New Book
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new book to your library
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Book Title *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter book title"
              className="bg-background/50 backdrop-blur-sm border-primary/20"
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description *
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter book description"
              rows={4}
              className="bg-background/50 backdrop-blur-sm border-primary/20 resize-none"
              disabled={loading}
            />
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="cover" className="text-sm font-medium">
              Cover Image *
            </Label>
            <div className="flex items-start gap-4">
              {coverPreview ? (
                <div className="relative w-32 h-48 rounded-lg overflow-hidden border-2 border-primary/20">
                  <Image
                    src={coverPreview || "/placeholder.svg"}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                    fill
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCoverImage(null);
                      setCoverPreview(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-destructive/90 backdrop-blur-sm rounded-full hover:bg-destructive transition-colors"
                    disabled={loading}
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="cover"
                  className="w-32 h-48 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-primary/30 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground text-center px-2">
                    Upload Cover
                  </span>
                </label>
              )}
              <input
                id="cover"
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="hidden"
                disabled={loading}
              />
              <div className="flex-1 text-sm text-muted-foreground">
                <p>Upload a cover image for your book</p>
                <p className="text-xs mt-1">
                  Recommended: 400x600px, JPG or PNG
                </p>
              </div>
            </div>
          </div>

          {/* PDF Upload */}
          <div className="space-y-2">
            <Label htmlFor="pdf" className="text-sm font-medium">
              Book PDF Files *
            </Label>
            <div className="space-y-3">
              <label
                htmlFor="pdf"
                className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-primary/30 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to upload PDF files (you can upload multiple)
                </span>
              </label>
              <input
                id="pdf"
                type="file"
                accept="application/pdf"
                multiple
                onChange={handlePdfFilesChange}
                className="hidden"
                disabled={loading}
              />

              {pdfFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Uploaded files ({pdfFiles.length}):
                  </p>
                  <div className="space-y-2">
                    {pdfFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-primary/5 backdrop-blur-sm border border-primary/20 rounded-lg"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <BookOpen className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-sm truncate">{file.name}</span>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePdfFile(index)}
                          className="p-1 hover:bg-destructive/20 rounded transition-colors flex-shrink-0"
                          disabled={loading}
                        >
                          <X className="h-4 w-4 text-destructive" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-primary/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="border-primary/20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding Book...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Book
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
