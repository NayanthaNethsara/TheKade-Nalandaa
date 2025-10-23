"use client";

import { useEffect, useState } from "react";
import { Book } from "@/types/book";
import { BookGrid } from "@/components/book-grid";
import { useBookmark } from "@/hooks/useBookmark";

export default function BookmarksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { bookmarks } = useBookmark();
  const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;

  useEffect(() => {
    async function fetchBooks() {
      if (!token) return;
      try {
        const res = await fetch("/api/books");
        if (!res.ok) return;
        const allBooks = await res.json();
        // Filter books to only show bookmarked ones
        const bookmarkedBooks = allBooks.filter((book: Book) => 
          book.id && bookmarks.includes(book.id)
        );
        setBooks(bookmarkedBooks);
      } catch (error) {
        console.error("Error fetching bookmarked books:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, [token, bookmarks]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">My Bookmarks</h1>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Bookmarks</h1>
      {books.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>You haven&apos;t bookmarked any books yet.</p>
          <p className="mt-2">Browse books and click the star icon to bookmark them!</p>
        </div>
      ) : (
        <BookGrid books={books} />
      )}
    </div>
  );
}