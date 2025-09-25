"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Book } from "@/lib/types";
import { BookChunks } from "@/components/book-chunks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, User, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBook() {
      try {
        const response = await fetch("/api/books");
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        const books: Book[] = await response.json();
        const foundBook = books.find((b) => b.titleSlug === slug);

        if (!foundBook) {
          throw new Error("Book not found");
        }

        setBook(foundBook);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchBook();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-32 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Skeleton className="aspect-[3/4] w-full mb-4" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="gap-2 mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to Books
          </Button>
        </Link>
        <Alert variant="destructive">
          <AlertDescription>{error || "Book not found"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/">
        <Button variant="ghost" className="gap-2 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Books
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Book Info Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-4">
              <div className="aspect-[3/4] relative mb-4 overflow-hidden rounded-lg bg-muted">
                {book.coverImagePath ? (
                  <Image
                    src={book.coverImagePath || "/placeholder.svg"}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-primary/20 mb-4">
                        📚
                      </div>
                      <div className="text-sm text-muted-foreground">
                        No Cover
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <CardTitle className="text-balance">{book.title}</CardTitle>
              <CardDescription>{book.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{book.authorName}</span>
                <Badge variant="outline" className="text-xs">
                  ID: {book.authorId}
                </Badge>
              </div>

              {book.createdAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Added {new Date(book.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}

              <div className="pt-2">
                <Badge variant="secondary">1 </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Book Chunks */}
        <div className="lg:col-span-2">
          <BookChunks chunkUrls={book.chunkUrls} title={book.title} />
        </div>
      </div>
    </div>
  );
}
