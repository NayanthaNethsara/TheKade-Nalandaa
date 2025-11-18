"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Book } from "@/types/book";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  BookOpen,
  Edit,
  Trash2,
  Plus,
  Clock,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export default function MyBooksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  const fetchMyBooks = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BOOK_SERVICE_URL}/api/books/my-books`,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      } else {
        toast.error("Failed to fetch your books");
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("An error occurred while fetching books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchMyBooks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router]);

  const handleDelete = async (bookId: number) => {
    setDeleteLoading(bookId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BOOK_SERVICE_URL}/api/books/${bookId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        }
      );

      if (response.ok || response.status === 204) {
        toast.success("Book deleted successfully");
        setBooks(books.filter((book) => book.id !== bookId));
      } else {
        const error = await response.text();
        toast.error(error || "Failed to delete book");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("An error occurred while deleting the book");
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            My Books
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your published and pending books
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/upload-book")}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Book
        </Button>
      </div>

      {books.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No books yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding your first book
            </p>
            <Button
              onClick={() => router.push("/dashboard/upload-book")}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Book
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Card
              key={book.id}
              className="group overflow-hidden border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300"
            >
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

              <CardHeader>
                <CardTitle className="line-clamp-1">{book.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {book.description}
                </CardDescription>
              </CardHeader>

              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() =>
                    router.push(`/books/${book.id}-${book.titleSlug}`)
                  }
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => router.push(`/dashboard/edit-book/${book.id}`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      disabled={deleteLoading === book.id}
                    >
                      {deleteLoading === book.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to delete this book?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete &quot;{book.title}&quot; and all its associated
                        data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => book.id && handleDelete(book.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
