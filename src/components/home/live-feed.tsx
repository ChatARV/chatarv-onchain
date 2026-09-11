"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatedList } from "@/components/ui/animated-list";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useFeed } from "@/hooks/use-oracle";
import { formatTimeAgo, formatUsd } from "@/lib/format";
import type { FeedEntry } from "@/lib/schemas";

function FeedRow({ entry }: { entry: FeedEntry }) {
  return (
    <Link
      href={`/property/${entry.key}`}
      className="flex w-full items-center gap-4 rounded-lg border border-border/80 bg-card px-4 py-3 text-sm shadow-xs transition-colors hover:border-primary/40"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">{entry.address}</p>
        <p className="truncate text-xs text-muted-foreground">
          {entry.city}, {entry.state} · {formatTimeAgo(entry.publishedAt)}
        </p>
      </div>
      <div className="hidden shrink-0 text-right sm:block">
        <p className="font-mono text-sm tabular-nums text-foreground">{formatUsd(entry.arv)}</p>
        <p className="text-xs text-muted-foreground">ARV</p>
      </div>
      <Badge variant="secondary" className="shrink-0 tabular-nums">
        SI {entry.stabilityIndex}
      </Badge>
      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}

export function LiveFeed() {
  const { data: feed, isLoading } = useFeed(10);

  return (
    <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Recent publishes</h2>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full rounded-full bg-primary" />
          </span>
          Live
        </span>
      </div>

      {isLoading || !feed ? (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <AnimatedList delay={700} className="!items-stretch gap-3">
          {[...feed].reverse().map((entry) => (
            <FeedRow key={`${entry.key}-${entry.publishedAt}`} entry={entry} />
          ))}
        </AnimatedList>
      )}
    </section>
  );
}
