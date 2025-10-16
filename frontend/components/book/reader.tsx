"use client";
import { BookWithChunk } from "@/types/book";
import { Link, ArrowLeft, User, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { BookChunks } from "../book-chunks";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import Reviews from "./reviews";

interface ReaderProps {
  bookId: string;
  bookName: string;
}

export default function Reader({ bookId, bookName }: ReaderProps) {
  const [book, setBook] = useState<BookWithChunk | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBook() {
      try {
        const response = await fetch("/api/books/" + bookId);
        if (!response.ok) {
          throw new Error("Failed to fetch book" + bookName);
        }
        const books: BookWithChunk = await response.json();

        console.log("Fetched book:", books);

        setBook(books);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    if (bookId) {
      fetchBook();
    }
  }, [bookId, bookName]);

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
        <div className="lg:col-span-2 space-y-6">
          <BookChunks chunkUrl={book.chunkPath} title={book.title} />
          <Reviews bookId={Number(book.id ?? bookId)} />
        </div>
      </div>
    </div>
  );
}
