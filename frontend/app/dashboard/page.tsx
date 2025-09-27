"use client";

import { BookGrid } from "@/components/book-grid";
import { SearchFilters } from "@/components/search-filters";
import { BookOpen } from "lucide-react";
import { useState } from "react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchFilters
            onSearch={setSearchQuery}
            onFilterChange={setActiveFilters}
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {searchQuery || activeFilters.length > 0
              ? "Search Results"
              : "All Books"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {activeFilters.length > 0 &&
              `Filtered by: ${activeFilters.join(", ")}`}
          </p>
        </div>

        <BookGrid searchQuery={searchQuery} filters={activeFilters} />
      </div>
    </div>
  );
}
