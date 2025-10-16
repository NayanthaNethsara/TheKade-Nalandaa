"use client";
import { BookWithChunk } from "@/types/book";
import { ArrowLeft, User, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { BookChunks } from "../book-chunks";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import Reviews from "./reviews";
import Link from "next/link";

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

        // fetched successfully

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
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  <Skeleton className="aspect-[2/3] w-full mb-6 rounded-lg" />
                  <Skeleton className="h-8 w-full mb-3" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-6" />
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-3">
              <Skeleton className="h-[600px] w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <Link href="/">
            <Button variant="ghost" className="gap-2 mb-8 hover:bg-accent">
              <ArrowLeft className="h-4 w-4" />
              Back to Library
            </Button>
          </Link>
          <Alert variant="destructive" className="max-w-2xl">
            <AlertDescription>{error || "Book not found"}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Link href="/">
          <Button
            variant="ghost"
            className="gap-2 mb-8 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Library
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Book Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden bg-white dark:bg-slate-900">
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                {book.coverImagePath ? (
                  <Image
                    src={book.coverImagePath}
                    alt={book.title}
                    fill
                    className="object-cover transition-transform hover:scale-105 duration-300"
                    priority
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950/40 dark:to-indigo-950/40">
                    <div className="text-center p-6">
                      <div className="text-7xl mb-4">📚</div>
                      <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                        No Cover Image
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <CardContent className="p-6 space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-balance leading-tight mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                    {book.title}
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                    {book.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200/50 dark:border-blue-800/50 hover:shadow-md transition-all">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wide">
                        Author
                      </div>
                      <div className="text-sm font-semibold truncate text-slate-900 dark:text-slate-100">
                        {book.authorName}
                      </div>
                    </div>
                  </div>

                  {book.createdAt && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200/50 dark:border-indigo-800/50 hover:shadow-md transition-all">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium uppercase tracking-wide">
                          Published
                        </div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {new Date(book.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <Badge
                      variant="secondary"
                      className="w-full justify-center py-2 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/50 dark:to-purple-900/50 text-violet-700 dark:text-violet-300 border border-violet-300/50 dark:border-violet-500/30"
                    >
                      <span className="text-xs font-semibold">
                        ID: {book.authorId}
                      </span>
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Reading Area */}
          <div className="lg:col-span-3 space-y-8">
            <BookChunks chunkUrl={book.chunkPath} title={book.title} />
            <Reviews bookId={Number(book.id ?? bookId)} />
          </div>
        </div>
      </div>
    </div>
  );
}
