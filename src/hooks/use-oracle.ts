import { useQuery } from "@tanstack/react-query";
import { fetchFeed, fetchProperties, fetchStats } from "@/lib/api-client";
import type { FeedEntry, Stats } from "@/lib/schemas";

export function useStats(initialData: Stats) {
  return useQuery({ queryKey: ["oracle", "stats"], queryFn: fetchStats, initialData });
}

export function useFeed(limit: number, initialData: FeedEntry[]) {
  return useQuery({
    queryKey: ["oracle", "feed", limit],
    queryFn: () => fetchFeed(limit),
    refetchInterval: 8000,
    initialData,
  });
}

export function useProperties(query?: string, limit?: number) {
  return useQuery({
    queryKey: ["oracle", "properties", query ?? "", limit ?? null],
    queryFn: () => fetchProperties(query, limit),
    enabled: query === undefined || query.length > 0,
  });
}
