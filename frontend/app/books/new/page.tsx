import { BookForm } from "@/components/book-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewBookPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Books
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-balance">Add New Book</h1>
        <p className="text-muted-foreground mt-2">
          Upload a new book to your collection with PDF chunks and cover image
        </p>
      </div>

      <BookForm />
    </div>
  )
}
