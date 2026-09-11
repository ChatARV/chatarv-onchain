import { z } from "zod";

export const PropertyKeySchema = z.string().length(64);
export type PropertyKey = z.infer<typeof PropertyKeySchema>;

export const StabilityInputsSchema = z.object({
  compDispersion: z.number(),
  compCount: z.number(),
  compDistance: z.number(),
  salesVelocity12mo: z.number(),
  priceTrend: z.number(),
  renovatedShare: z.number(),
  modelDrift: z.number(),
});
export type StabilityInputs = z.infer<typeof StabilityInputsSchema>;

export const ValuationSchema = z.object({
  asIsValue: z.number(),
  arv: z.number(),
  repairEstimate: z.number(),
  compCount: z.number(),
  confidence: z.number(),
  stabilityIndex: z.number(),
  stabilityInputs: StabilityInputsSchema,
  modelVersion: z.string(),
  publishedAt: z.string(),
  txHash: z.string(),
});
export type Valuation = z.infer<typeof ValuationSchema>;

export const PropertySchema = z.object({
  key: PropertyKeySchema,
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  latest: ValuationSchema,
  history: z.array(ValuationSchema),
});
export type Property = z.infer<typeof PropertySchema>;

export const PropertySummarySchema = PropertySchema.omit({ history: true });
export type PropertySummary = z.infer<typeof PropertySummarySchema>;

export const ConsumerTypeSchema = z.enum(["lending", "tokenization", "vault"]);
export type ConsumerType = z.infer<typeof ConsumerTypeSchema>;

export const ReadEventSchema = z.object({
  id: z.string(),
  propertyKey: PropertyKeySchema,
  address: z.string(),
  consumerAddress: z.string(),
  consumerType: ConsumerTypeSchema,
  timestamp: z.string(),
  feeUsdc: z.number(),
});
export type ReadEvent = z.infer<typeof ReadEventSchema>;

export const StatsSchema = z.object({
  propertiesPublished: z.number(),
  readsServed: z.number(),
  lastPublishAt: z.string(),
});
export type Stats = z.infer<typeof StatsSchema>;

export const FeedEntrySchema = z.object({
  key: PropertyKeySchema,
  address: z.string(),
  city: z.string(),
  state: z.string(),
  asIsValue: z.number(),
  arv: z.number(),
  stabilityIndex: z.number(),
  publishedAt: z.string(),
  txHash: z.string(),
});
export type FeedEntry = z.infer<typeof FeedEntrySchema>;

export const PublishPreviewSchema = z.object({
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  asIsValue: z.number(),
  arv: z.number(),
  repairEstimate: z.number(),
  compCount: z.number(),
  confidence: z.number(),
  stabilityIndex: z.number(),
  stabilityInputs: StabilityInputsSchema,
  modelVersion: z.string(),
});
export type PublishPreview = z.infer<typeof PublishPreviewSchema>;

export const PublishResultSchema = z.object({
  key: PropertyKeySchema,
  txHash: z.string(),
  publishedAt: z.string(),
});
export type PublishResult = z.infer<typeof PublishResultSchema>;
