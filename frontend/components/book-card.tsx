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
      className="group relative overflow-hidden border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-md hover:shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/books/${book.id}-${book.titleSlug}`}>
        <div className="aspect-[3/4] relative overflow-hidden cursor-pointer bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
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
            className={`absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 mb-3">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg border-0"
                  onClick={(e) => e.preventDefault()}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Read
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/90 backdrop-blur-sm border-white/50 text-slate-700 hover:bg-white"
                  onClick={(e) => e.preventDefault()}
                >
                  <Highlight className="w-4 h-4 mr-2" />
                  Highlights
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-amber-400/90 px-2 py-1 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-amber-900 text-amber-900" />
                    <span className="text-xs font-bold text-amber-900">
                      4.8
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-blue-500/90 text-white border-0 text-xs"
                  >
                    Fiction
                  </Badge>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20 p-2 h-8 w-8"
                  onClick={(e) => e.preventDefault()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Link>

      <div className="p-4 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/50">
        <Link href={`/book/${book.titleSlug}`}>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1.5 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer">
            {book.title}
          </h3>
        </Link>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-1">
          by {book.authorName}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-500 line-clamp-2 leading-relaxed">
          {book.description}
        </p>
      </div>
    </Card>
  );
}
