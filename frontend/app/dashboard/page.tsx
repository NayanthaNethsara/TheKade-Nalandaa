"use client";

import { BookGrid } from "@/components/book-grid";
import { AddBookModal } from "@/components/model/add-book-model";
import { Library, BookOpen } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Book } from "@/types/book";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [loadingMyBooks, setLoadingMyBooks] = useState(false);

  const fetchMyBooks = async () => {
    if (!session?.user?.accessToken) return;

    setLoadingMyBooks(true);
    try {
      const response = await fetch("/api/books/my-books");

      if (response.ok) {
        const data = await response.json();
        setMyBooks(data.slice(0, 3)); // Show only first 3 books
      }
    } catch (error) {
      console.error("Error fetching my books:", error);
    } finally {
      setLoadingMyBooks(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (!session) {
      router.push("/");
      return;
    }

    // Fetch author's books if user is an author
    if (session.user.role === "Author") {
      fetchMyBooks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-t-transparent border-gray-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const userId = session.user.sub;
  const userRole = session.user.role;
  const userName = session.user.name;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20">
              <Library className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-slate-100 dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                My Library
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5">
                Your personal reading collection
              </p>
            </div>
            {userRole === "Author" && (
              <AddBookModal
                authorId={userId}
                authorName={userName}
                onBookAdded={fetchMyBooks}
              />
            )}
          </div>
        </div>

        {/* Author's Books Section */}
        {userRole === "Author" && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  My Published Books
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Manage and track your authored books
                </p>
              </div>
              <Link href="/dashboard/my-books">
                <Button variant="outline" className="gap-2">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {loadingMyBooks ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-slate-200 dark:bg-slate-800" />
                    <CardHeader>
                      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mt-2" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : myBooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myBooks.map((book) => (
                  <Card
                    key={book.id}
                    className="group overflow-hidden border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300"
                  >
                    <Link href={`/books/${book.id}-${book.titleSlug}`}>
                      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                        <Image
                          src={
                            book.coverImagePath ||
                            `/placeholder.svg?height=400&width=300&text=${encodeURIComponent(
                              book.title
                            )}`
                          }
                          fill
                          alt={book.title}
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-4 right-4">
                          {book.isApproved ? (
                            <Badge className="bg-green-500 hover:bg-green-600">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Approved
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="bg-yellow-500/90 text-white hover:bg-yellow-600"
                            >
                              <Clock className="mr-1 h-3 w-3" />
                              Pending
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Link>

                    <CardHeader>
                      <CardTitle className="line-clamp-1">
                        {book.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {book.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent className="pt-6">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No books yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by adding your first book
                  </p>
                  <AddBookModal
                    authorId={userId}
                    authorName={userName}
                    onBookAdded={fetchMyBooks}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <BookGrid />
      </div>
    </div>
  );
}
