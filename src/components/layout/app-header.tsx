"use client";

import { Menu, Search } from "lucide-react";

import { BrandMark } from "@/components/shared/brand-mark";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { NavigationItem } from "@/types/ui";

import { AppSidebarNav } from "./app-sidebar-nav";

type AppHeaderProps = {
  activePath: string;
  currentTitle: string;
  demoBadge: string;
  items: NavigationItem[];
  lastUpdatedLabel: string;
  mobileMenuLabel: string;
  searchActionLabel: string;
  searchHint: string;
  updatedValue: string;
  languageSwitcher: React.ReactNode;
};

export function AppHeader({
  activePath,
  currentTitle,
  demoBadge,
  items,
  lastUpdatedLabel,
  mobileMenuLabel,
  searchActionLabel,
  searchHint,
  updatedValue,
  languageSwitcher,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/84 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label={mobileMenuLabel}>
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="border-none bg-sidebar p-6 text-sidebar-foreground"
            >
              <BrandMark />
              <AppSidebarNav activePath={activePath} items={items} mobile />
            </SheetContent>
          </Sheet>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            {searchHint}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
              {currentTitle}
            </h1>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {demoBadge}
            </span>
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="outline"
            className="h-11 rounded-2xl border-border/70 bg-card/80 px-4 text-muted-foreground shadow-sm"
          >
            <Search className="size-4" />
            {searchActionLabel}
          </Button>
          <div className="rounded-2xl border border-border/70 bg-card/80 px-4 py-2 text-right shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {lastUpdatedLabel}
            </p>
            <p className="text-sm font-medium">{updatedValue}</p>
          </div>
          {languageSwitcher}
        </div>
      </div>
      <Separator />
    </header>
  );
}
