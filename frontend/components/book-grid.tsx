"use client";

import type { Book } from "@/types/book";
import { BookCard } from "./book-card";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BookGridProps {
  searchQuery?: string;
  filters?: string[];
}

export function BookGrid({ searchQuery, filters }: BookGridProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append("search", searchQuery);
        if (filters && filters.length > 0)
          params.append("filters", filters.join(","));

        const response = await fetch(`/api/books?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, [searchQuery, filters]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-3 animate-pulse">
            <Skeleton className="aspect-[3/4] w-full rounded-xl bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900" />
            <Skeleton className="h-5 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-4 w-1/2 rounded-lg bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        variant="destructive"
        className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20"
      >
        <AlertDescription className="text-red-800 dark:text-red-200">
          Error loading books: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 rounded-2xl mb-6">
          <div className="text-5xl">📚</div>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          No books found
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          {searchQuery || filters?.length
            ? "Try adjusting your search or filters."
            : "Start by adding your first book to the collection."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {books.map((book) => (
        <BookCard key={book.id || book.titleSlug} book={book} />
      ))}
    </div>
  );
}
