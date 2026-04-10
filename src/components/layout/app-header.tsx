"use client";

import { LogOut, Menu } from "lucide-react";

import { BrandMark } from "@/components/shared/brand-mark";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { DemoSession } from "@/types/auth";
import type { NavigationItem } from "@/types/ui";

import { AppSidebarNav } from "./app-sidebar-nav";

type AppHeaderProps = {
  activePath: string;
  currentTitle: string;
  demoBadge: string;
  items: NavigationItem[];
  lastUpdatedLabel: string;
  mobileMenuLabel: string;
  session: DemoSession;
  sessionLabel: string;
  sessionMetaLabel: string;
  signOutLabel: string;
  workspaceLabel: string;
  workspaceValue: string;
  workspaceNote: string;
  logoutHref: string;
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
  session,
  sessionLabel,
  sessionMetaLabel,
  signOutLabel,
  workspaceLabel,
  workspaceValue,
  workspaceNote,
  logoutHref,
  updatedValue,
  languageSwitcher,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/88 backdrop-blur-xl">
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
              <div className="mt-6 section-stack">
                <AppSidebarNav activePath={activePath} items={items} mobile />

                <div className="panel-secondary rounded-3xl px-4 py-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="size-10 rounded-2xl">
                      <AvatarFallback className="rounded-2xl bg-primary text-primary-foreground">
                        {session.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1.5">
                      <p className="subtle-label text-sidebar-foreground/70">
                        {sessionLabel}
                      </p>
                      <p className="text-sm font-semibold text-sidebar-foreground">
                        {session.name}
                      </p>
                      <p className="text-xs text-sidebar-foreground/70">
                        {session.role}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="panel-secondary rounded-3xl px-4 py-4">
                  <p className="subtle-label text-sidebar-foreground/70">
                    {workspaceLabel}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-sidebar-foreground">
                    {workspaceValue}
                  </p>
                  <p className="mt-1 text-xs text-sidebar-foreground/70">
                    {workspaceNote}
                  </p>
                </div>

                <Button asChild variant="outline" className="w-full justify-center">
                  <a href={logoutHref}>
                    <LogOut className="size-4" />
                    {signOutLabel}
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-heading text-lg font-semibold tracking-tight sm:text-xl">
              {currentTitle}
            </h1>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[0.72rem] font-semibold text-primary">
              {demoBadge}
            </span>
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="panel-secondary flex min-w-[13rem] items-center gap-3 px-4 py-2">
            <Avatar className="size-9 rounded-2xl">
              <AvatarFallback className="rounded-2xl bg-primary text-primary-foreground">
                {session.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="subtle-label text-muted-foreground">{sessionLabel}</p>
              <p className="truncate text-sm font-medium text-foreground">
                {session.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {sessionMetaLabel} {session.role}
              </p>
            </div>
          </div>
          <div className="panel-secondary min-w-[12rem] px-4 py-2">
            <p className="subtle-label text-muted-foreground">{workspaceLabel}</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {workspaceValue}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{workspaceNote}</p>
          </div>
          <div className="panel-secondary min-w-[9.5rem] px-4 py-2 text-right">
            <p className="subtle-label text-muted-foreground">
              {lastUpdatedLabel}
            </p>
            <p className="text-sm font-medium">{updatedValue}</p>
          </div>
          {languageSwitcher}
          <Button asChild variant="outline" className="rounded-full px-4">
            <a href={logoutHref}>
              <LogOut className="size-4" />
              {signOutLabel}
            </a>
          </Button>
        </div>
      </div>
      <Separator />
    </header>
  );
}
