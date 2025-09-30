"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Search, X } from "lucide-react";
import { useState } from "react";

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: string[]) => void;
  onSortChange: (sort: string) => void;
}

export function SearchFilters({
  onSearch,
  onFilterChange,
}: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const toggleFilter = (category: string) => {
    const newFilters = activeFilters.includes(category)
      ? activeFilters.filter((f) => f !== category)
      : [...activeFilters, category];

    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleStatus = (status: string) => {
    const newStatus = selectedStatus.includes(status)
      ? selectedStatus.filter((s) => s !== status)
      : [...selectedStatus, status];

    setSelectedStatus(newStatus);
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setSelectedStatus([]);
    onFilterChange([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by title, author, or ISBN..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-foreground placeholder:text-muted-foreground h-11"
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {(activeFilters.length > 0 || selectedStatus.length > 0) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {[...activeFilters, ...selectedStatus].map((filter) => (
            <Badge
              key={filter}
              variant="secondary"
              className="bg-primary/20 text-primary border-primary/30 cursor-pointer hover:bg-primary/30"
              onClick={() => {
                if (activeFilters.includes(filter)) toggleFilter(filter);
                if (selectedStatus.includes(filter)) toggleStatus(filter);
              }}
            >
              {filter}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground h-auto py-1"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
