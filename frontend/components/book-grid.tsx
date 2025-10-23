"use client";

import type { Book } from "@/types/book";
import { BookCard } from "./book-card";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BookGridProps {
  books?: Book[];
  searchQuery?: string;
  filters?: string[];
}

export function BookGrid({ books: propBooks, searchQuery, filters }: BookGridProps) {
  const [books, setBooks] = useState<Book[]>(propBooks || []);
  const [loading, setLoading] = useState(!propBooks);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propBooks) {
      setBooks(propBooks);
      return;
    }

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
  }, [searchQuery, filters, propBooks]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[3/4] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Error loading books: {error}</AlertDescription>
      </Alert>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-lg font-semibold mb-2">No books found</h3>
        <p className="text-muted-foreground">
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
