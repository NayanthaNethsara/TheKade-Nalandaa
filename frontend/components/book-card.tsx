"use client";

import type { Book } from "@/types/book";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Highlighter as Highlight, Plus, Star } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/books/${book.titleSlug}`}>
        <div className="aspect-[3/4] relative overflow-hidden cursor-pointer">
          <Image
            src={
              book.coverImagePath ||
              `/placeholder.svg?height=400&width=300&query=${
                encodeURIComponent(book.title + " book cover") ||
                "/placeholder.svg"
              }`
            }
            fill
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 mb-3">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={(e) => e.preventDefault()}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Read
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                  onClick={(e) => e.preventDefault()}
                >
                  <Highlight className="w-4 h-4 mr-2" />
                  Highlights
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-white/90">4.8</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-0 text-xs"
                  >
                    Fiction
                  </Badge>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20 p-2"
                  onClick={(e) => e.preventDefault()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/book/${book.titleSlug}`}>
          <h3 className="font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors cursor-pointer">
            {book.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
          by {book.authorName}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {book.description}
        </p>
      </div>
    </Card>
  );
}
