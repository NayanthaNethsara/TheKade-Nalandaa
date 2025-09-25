import { BookGrid } from "@/components/book-grid";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-balance">Book Collection</h1>
          <p className="text-muted-foreground mt-2">
            Manage and explore your digital book library
          </p>
        </div>
        <Link href="/books/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Book
          </Button>
        </Link>
      </div>

      <BookGrid />
    </div>
  );
}
