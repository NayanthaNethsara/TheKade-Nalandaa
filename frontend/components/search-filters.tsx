"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import { useState } from "react";

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: string[]) => void;
}

const genres = [
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Biography",
  "History",
  "Self-Help",
];

export function SearchFilters({
  onSearch,
  onFilterChange,
}: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const toggleFilter = (genre: string) => {
    const newFilters = activeFilters.includes(genre)
      ? activeFilters.filter((f) => f !== genre)
      : [...activeFilters, genre];

    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters([]);
    onFilterChange([]);
  };

  return (
    <div className="space-y-4 text-left">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search books, authors..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="bg-white/10 backdrop-blur-sm border-white/20 text-foreground hover:bg-white/20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          Filters
          {activeFilters.length > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 bg-primary text-primary-foreground"
            >
              {activeFilters.length}
            </Badge>
          )}
        </Button>

        {activeFilters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge
              key={filter}
              variant="secondary"
              className="bg-primary/20 text-primary border-primary/30 cursor-pointer hover:bg-primary/30"
              onClick={() => toggleFilter(filter)}
            >
              {filter}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
        </div>
      )}

      {/* Filter Options */}
      {showFilters && (
        <div className="p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
          <h4 className="text-sm font-medium text-foreground mb-3">Genres</h4>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <Badge
                key={genre}
                variant={activeFilters.includes(genre) ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  activeFilters.includes(genre)
                    ? "bg-primary text-primary-foreground"
                    : "bg-white/10 text-foreground border-white/20 hover:bg-white/20"
                }`}
                onClick={() => toggleFilter(genre)}
              >
                {genre}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
