import { z } from "zod";
import {
  FeedEntrySchema,
  PropertySchema,
  PropertySummarySchema,
  PublishPreviewSchema,
  PublishResultSchema,
  ReadEventSchema,
  StatsSchema,
  type FeedEntry,
  type Property,
  type PropertySummary,
  type PublishPreview,
  type PublishResult,
  type ReadEvent,
  type Stats,
} from "./schemas";

async function fetchJson<T>(url: string, schema: z.ZodType<T>, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `Request to ${url} failed with ${res.status}`);
  }
  return schema.parse(await res.json());
}

export function fetchStats(): Promise<Stats> {
  return fetchJson("/api/oracle/stats", StatsSchema);
}

export function fetchFeed(limit = 10): Promise<FeedEntry[]> {
  return fetchJson(`/api/oracle/feed?limit=${limit}`, z.array(FeedEntrySchema));
}

export function fetchProperties(query?: string, limit?: number): Promise<PropertySummary[]> {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (limit) params.set("limit", String(limit));
  const qs = params.toString();
  return fetchJson(
    `/api/oracle/properties${qs ? `?${qs}` : ""}`,
    z.array(PropertySummarySchema),
  );
}

export function fetchProperty(key: string): Promise<Property> {
  return fetchJson(`/api/oracle/properties/${key}`, PropertySchema);
}

export function fetchReads(key: string): Promise<ReadEvent[]> {
  return fetchJson(`/api/oracle/properties/${key}/reads`, z.array(ReadEventSchema));
}

export interface AddressInput {
  address: string;
  city: string;
  state: string;
  zip: string;
}

export function fetchPublishPreview(input: AddressInput): Promise<PublishPreview> {
  return fetchJson("/api/oracle/publish/preview", PublishPreviewSchema, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function submitPublish(input: AddressInput): Promise<PublishResult> {
  return fetchJson("/api/oracle/publish", PublishResultSchema, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}
