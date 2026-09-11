import { useQuery } from "@tanstack/react-query";
import {
  fetchFeed,
  fetchProperties,
  fetchProperty,
  fetchReads,
  fetchStats,
} from "@/lib/api-client";

export function useStats() {
  return useQuery({ queryKey: ["oracle", "stats"], queryFn: fetchStats });
}

export function useFeed(limit = 10) {
  return useQuery({
    queryKey: ["oracle", "feed", limit],
    queryFn: () => fetchFeed(limit),
    refetchInterval: 8000,
  });
}

export function useProperties(query?: string, limit?: number) {
  return useQuery({
    queryKey: ["oracle", "properties", query ?? "", limit ?? null],
    queryFn: () => fetchProperties(query, limit),
    enabled: query === undefined || query.length > 0,
  });
}

export function useProperty(key: string) {
  return useQuery({
    queryKey: ["oracle", "property", key],
    queryFn: () => fetchProperty(key),
    enabled: Boolean(key),
  });
}

export function useReads(key: string) {
  return useQuery({
    queryKey: ["oracle", "reads", key],
    queryFn: () => fetchReads(key),
    enabled: Boolean(key),
  });
}
