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
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
          <Input
            placeholder="Search by title, author, or ISBN..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-12 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl shadow-sm focus:shadow-md focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {(activeFilters.length > 0 || selectedStatus.length > 0) && (
        <div className="flex flex-wrap items-center gap-2 p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200/50 dark:border-blue-800/30">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Active filters:
          </span>
          {[...activeFilters, ...selectedStatus].map((filter) => (
            <Badge
              key={filter}
              variant="secondary"
              className="bg-blue-500 hover:bg-blue-600 text-white border-0 cursor-pointer shadow-sm hover:shadow-md transition-all"
              onClick={() => {
                if (activeFilters.includes(filter)) toggleFilter(filter);
                if (selectedStatus.includes(filter)) toggleStatus(filter);
              }}
            >
              {filter}
              <X className="w-3 h-3 ml-1.5" />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 h-auto py-1.5 px-3 rounded-lg"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
