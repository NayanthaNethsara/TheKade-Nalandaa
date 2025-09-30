"use client";

import { BookGrid } from "@/components/book-grid";
import { SearchFilters } from "@/components/search-filters";
import { AddBookModal } from "@/components/model/add-book-model";
import { Library } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("recent");

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (!session) {
      router.push("/");
      return;
    }
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
