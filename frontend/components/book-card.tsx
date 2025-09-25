import type { Book } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/books/${book.titleSlug}`}>
      <Card className="group cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]">
        <CardHeader className="pb-3">
          <div className="aspect-[3/4] relative mb-3 overflow-hidden rounded-md bg-muted">
            {book.coverImagePath ? (
              <Image
                src={book.coverImagePath || "/placeholder.svg"}
                alt={book.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary/20 mb-2">📚</div>
                  <div className="text-sm text-muted-foreground">No Cover</div>
                </div>
              </div>
            )}
          </div>
          <CardTitle className="line-clamp-2 text-balance">{book.title}</CardTitle>
          <CardDescription className="line-clamp-2">{book.description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {book.authorName}
            </Badge>
            <div className="text-xs text-muted-foreground">
              {book.chunkUrls.length} chunk{book.chunkUrls.length !== 1 ? "s" : ""}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
