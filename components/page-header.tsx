"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, LayoutGrid, List, ArrowUpDown, Kanban } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ViewType } from "@/types";

interface PageHeaderAction {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  onClick: () => void;
  variant?: "default" | "outline";
  dropdown?: React.ReactNode;
}

interface SortOption {
  value: string;
  label: string;
}

interface PageHeaderProps {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  viewType: ViewType;
  onViewTypeChange: (type: ViewType) => void;
  sortOptions: SortOption[];
  currentSort: string;
  onSortChange: (sort: string) => void;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  primaryAction?: PageHeaderAction;
  statsContent?: React.ReactNode;
  viewTypes?: ViewType[];
  children?: React.ReactNode;
}

const viewTypeIcons: Record<ViewType, React.ComponentType<{ size?: number; className?: string }>> = {
  grid: LayoutGrid,
  cards: LayoutGrid,
  list: List,
  kanban: Kanban,
};

export function PageHeader({
  title,
  icon: Icon,
  viewType,
  onViewTypeChange,
  sortOptions,
  currentSort,
  onSortChange,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  primaryAction,
  statsContent,
  viewTypes = ["cards", "list"],
  children,
}: PageHeaderProps) {
  return (
    <div className="border-b border-border/40 p-4">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Icon size={20} />
          {title}
        </h1>
        <div className="flex items-center gap-2">
          {/* Primary Action Button */}
          {primaryAction && (
            primaryAction.dropdown ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="gap-2 h-9 rounded-full bg-foreground text-white hover:bg-foreground/90">
                    <primaryAction.icon size={14} />
                    {primaryAction.label}
                  </Button>
                </DropdownMenuTrigger>
                {primaryAction.dropdown}
              </DropdownMenu>
            ) : (
              <Button
                className="gap-2 h-9 rounded-full bg-foreground text-white hover:bg-foreground/90"
                onClick={primaryAction.onClick}
              >
                <primaryAction.icon size={14} />
                {primaryAction.label}
              </Button>
            )
          )}

          {/* View Type Toggle */}
          <div className="flex items-center gap-1 border border-border rounded-full p-1">
            {viewTypes.map((type) => {
              const ViewIcon = viewTypeIcons[type];
              return (
                <Button
                  key={type}
                  variant="ghost"
                  size="icon"
                  onClick={() => onViewTypeChange(type)}
                  className={cn(
                    "size-7 rounded-full hover:bg-muted",
                    viewType === type && "bg-foreground text-white hover:bg-foreground/90"
                  )}
                >
                  <ViewIcon size={16} />
                </Button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent h-9 rounded-full hover:bg-muted">
                <ArrowUpDown size={14} />
                Ordenar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortOptions.map((option) => (
                <DropdownMenuItem key={option.value} onClick={() => onSortChange(option.value)}>
                  {option.label} {currentSort === option.value && "•"}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Content */}
      {statsContent && (
        <div className="mb-3">
          {statsContent}
        </div>
      )}

      {/* Additional Children (for custom elements before search) */}
      {children}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 rounded-full"
        />
      </div>
    </div>
  );
}
