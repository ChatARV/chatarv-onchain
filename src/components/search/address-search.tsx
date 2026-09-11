"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { BorderBeam } from "@/components/ui/border-beam";
import { useProperties } from "@/hooks/use-oracle";
import { cn } from "@/lib/utils";
import { formatUsd } from "@/lib/format";

interface AddressSearchProps {
  variant?: "header" | "hero";
  className?: string;
}

export function AddressSearch({ variant = "header", className }: AddressSearchProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { data: properties } = useProperties();

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function onSelect(key: string) {
    setOpen(false);
    router.push(`/property/${key}`);
  }

  return (
    <>
      {variant === "header" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "flex h-9 w-full max-w-64 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground shadow-xs transition-colors hover:bg-accent/50",
            className,
          )}
        >
          <Search className="size-4 shrink-0" />
          <span className="truncate">Search an address…</span>
          <kbd className="ml-auto hidden shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-block">
            ⌘K
          </kbd>
        </button>
      ) : (
        <div className={cn("relative w-full max-w-xl", className)}>
          <div className="relative overflow-hidden rounded-xl">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              readOnly
              onClick={() => setOpen(true)}
              placeholder="Search any US property address…"
              className="h-14 cursor-pointer rounded-xl border-border/80 bg-card pl-12 text-base shadow-sm"
            />
            <BorderBeam size={120} duration={8} />
          </div>
        </div>
      )}

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search an address"
        description="Search properties published to ChatARV Oracle"
      >
        <Command shouldFilter>
          <CommandInput placeholder="Search by address, city, or zip…" />
          <CommandList>
            <CommandEmpty>No properties found.</CommandEmpty>
            <CommandGroup heading="Properties">
              {properties?.map((p) => (
                <CommandItem
                  key={p.key}
                  value={`${p.address} ${p.city} ${p.state} ${p.zip}`}
                  onSelect={() => onSelect(p.key)}
                >
                  <div className="flex w-full items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{p.address}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {p.city}, {p.state} {p.zip}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                      {formatUsd(p.latest.arv)}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
