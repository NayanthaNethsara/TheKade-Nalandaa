"use client";

import { BookGrid } from "@/components/book-grid";
import { SearchFilters } from "@/components/search-filters";
import { AddBookModal } from "@/components/model/add-book-model";
import { BookOpen, Library, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("recent");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Library className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                My Library
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Your personal reading collection
              </p>
            </div>
            <AddBookModal authorId={0} authorName={""} />
          </div>

          {/* Reading Stats */}
          <div className="flex flex-wrap gap-3 sm:gap-4 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm border border-primary/20">
              <BookOpen className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">
                  Currently Reading
                </p>
                <p className="text-lg font-bold text-foreground">3</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-green-500/20 to-green-500/5 backdrop-blur-sm border border-green-500/20">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">Books Read</p>
                <p className="text-lg font-bold text-foreground">24</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/5 backdrop-blur-sm border border-blue-500/20">
              <Library className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">Total Books</p>
                <p className="text-lg font-bold text-foreground">127</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <SearchFilters
            onSearch={setSearchQuery}
            onFilterChange={setActiveFilters}
            onSortChange={setSortBy}
          />
        </div>

        {/* Results Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-1">
              {searchQuery ? `Results for "${searchQuery}"` : "All Books"}
            </h2>
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {activeFilters.map((filter) => (
                  <Badge key={filter} variant="secondary" className="text-xs">
                    {filter}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <BookGrid searchQuery={searchQuery} filters={activeFilters} />
      </div>
    </div>
  );
}
