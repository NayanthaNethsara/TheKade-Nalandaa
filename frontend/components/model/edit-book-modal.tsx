"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Loader2, BookOpen, Save, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface EditBookModalProps {
  bookId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookUpdated?: () => void;
}

interface BookData {
  id: number;
  title: string;
  description: string;
  authorId: number;
  authorName: string;
  titleSlug: string;
  coverImagePath: string;
  chunks: { id: number; chunkNumber: number; pdfUrl: string }[];
}

export function EditBookModal({
  bookId,
  open,
  onOpenChange,
  onBookUpdated,
}: EditBookModalProps) {
  const [loading, setLoading] = useState(false);
  const [fetchingBook, setFetchingBook] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [authorId, setAuthorId] = useState<number>(0);
  const [authorName, setAuthorName] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [existingCoverPath, setExistingCoverPath] = useState<string>("");
  const [existingChunks, setExistingChunks] = useState<
    { id: number; chunkNumber: number; pdfUrl: string }[]
  >([]);

  // Fetch book data when modal opens
  const fetchBookData = useCallback(async () => {
    setFetchingBook(true);
    try {
      const response = await fetch(`/api/books/${bookId}`);
      if (!response.ok) throw new Error("Failed to fetch book");

      const book: BookData = await response.json();
      setTitle(book.title);
      setDescription(book.description);
      setAuthorId(book.authorId);
      setAuthorName(book.authorName);
      setExistingCoverPath(book.coverImagePath);
      setCoverPreview(book.coverImagePath);
      setExistingChunks(book.chunks || []);
    } catch (error) {
      console.error("Error fetching book:", error);
      toast.error("Failed to load book data");
      onOpenChange(false);
    } finally {
      setFetchingBook(false);
    }
  }, [bookId, onOpenChange]);

  useEffect(() => {
    if (open && bookId) {
      fetchBookData();
    }
  }, [open, bookId, fetchBookData]);

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type");
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
      toast.error("Please enter a book title");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter a book description");
      return;
    }

    if (!coverPreview) {
      toast.error("Please upload a cover image");
      return;
    }

    setLoading(true);

    try {
      let coverImagePath = existingCoverPath;

      // Upload new cover image if changed
      if (coverImage) {
        const coverFormData = new FormData();
        coverFormData.append("file", coverImage);

        const coverResponse = await fetch("/api/upload/cover", {
          method: "POST",
          body: coverFormData,
        });

        if (!coverResponse.ok) throw new Error("Failed to upload cover image");

        const { url } = await coverResponse.json();
        coverImagePath = url;
      }

      // Keep existing chunks (PDFs are not updatable)
      const allChunkUrls = existingChunks.map((chunk) => chunk.pdfUrl);

      // Update book
      const bookData = {
        title,
        description,
        authorId,
        authorName,
        chunkUrls: allChunkUrls,
        titleSlug: generateSlug(title),
        coverImagePath,
      };

      const bookResponse = await fetch(`/api/books/${bookId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      if (!bookResponse.ok) throw new Error("Failed to update book");

      toast.success(`"${title}" has been updated successfully`);

      onOpenChange(false);
      onBookUpdated?.();
    } catch (error) {
      console.error("Error updating book:", error);
      toast.error("Failed to update book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-primary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <BookOpen className="h-6 w-6 text-primary" />
            Edit Book
          </DialogTitle>
          <DialogDescription>
            Update the details of your book
          </DialogDescription>
        </DialogHeader>

        {fetchingBook ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
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
                      src={coverPreview}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                      fill
                    />
                    {coverImage && (
                      <button
                        type="button"
                        onClick={() => {
                          setCoverImage(null);
                          setCoverPreview(existingCoverPath);
                        }}
                        className="absolute top-2 right-2 p-1 bg-destructive/90 backdrop-blur-sm rounded-full hover:bg-destructive transition-colors"
                        disabled={loading}
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    )}
                  </div>
                ) : (
                  <label
                    htmlFor="cover"
                    className="w-32 h-48 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-primary/30 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground text-center px-2">
                      Change Cover
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
                  <p>
                    {coverImage
                      ? "New cover will replace existing one"
                      : "Upload a new cover image or keep the existing one"}
                  </p>
                  <p className="text-xs mt-1">
                    Recommended: 400x600px, JPG or PNG
                  </p>
                </div>
              </div>
            </div>

          {/* PDF Files (Read-only) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Book PDF Files (Not Editable)
            </Label>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                PDF files cannot be modified after book creation. To change PDFs, you need to create a new book.
              </p>
              {existingChunks.length > 0 && (
                <div className="space-y-2">
                  {existingChunks.map((chunk) => (
                    <div
                      key={chunk.id}
                      className="flex items-center gap-2 p-3 bg-muted/50 backdrop-blur-sm border border-muted rounded-lg"
                    >
                      <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm">
                        Chunk {chunk.chunkNumber}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (Read-only)
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4 border-t border-primary/10">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
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
                    Updating Book...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Update Book
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
