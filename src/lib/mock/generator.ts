import { Rng } from "./rng";
import { generateAddressPool } from "./addresses";
import { propertyKey, sha256Hex } from "../hash";
import { computeStabilityIndex } from "../stability";
import { fakeContractId, fakeTxHash } from "../stellar";
import type {
  ConsumerType,
  FeedEntry,
  Property,
  PropertySummary,
  PublishPreview,
  PublishResult,
  ReadEvent,
  Stats,
  StabilityInputs,
  Valuation,
} from "../schemas";

const SEED = "chatarv-oracle-v1";
const PROPERTY_COUNT = 200;
const MODEL_VERSIONS = ["arv-3.2.1", "arv-3.3.0", "arv-3.3.1"] as const;
const CONSUMER_TYPES: readonly ConsumerType[] = ["lending", "tokenization", "vault"];
const DAY_MS = 24 * 60 * 60 * 1000;

const MARKET_BASE_VALUE: Record<string, number> = {
  NV: 380000,
  NY: 650000,
  AZ: 400000,
  NC: 320000,
  FL: 300000,
  OH: 210000,
};

interface MockConsumer {
  address: string;
  type: ConsumerType;
}

function buildConsumers(): MockConsumer[] {
  const consumers: MockConsumer[] = [];
  for (let i = 0; i < 9; i++) {
    const type = CONSUMER_TYPES[i % CONSUMER_TYPES.length];
    consumers.push({ address: fakeContractId(`consumer-${type}-${i}`), type });
  }
  return consumers;
}

function buildStabilityInputs(rng: Rng, compCount: number): StabilityInputs {
  return {
    compDispersion: Math.round(rng.float(2, 35) * 10) / 10,
    compCount,
    compDistance: Math.round(rng.float(0.1, 3.5) * 10) / 10,
    salesVelocity12mo: rng.int(2, 60),
    priceTrend: Math.round(rng.float(-8, 15) * 10) / 10,
    renovatedShare: Math.round(rng.float(0, 80) * 10) / 10,
    modelDrift: Math.round(rng.float(0, 12) * 10) / 10,
  };
}

function buildValuationHistory(
  rng: Rng,
  state: string,
  publishCount: number,
  now: Date,
  key: string,
): Valuation[] {
  const base = (MARKET_BASE_VALUE[state] ?? 350000) * rng.float(0.7, 1.4);

  const timestamps: Date[] = [];
  let cursor = new Date(now.getTime() - rng.int(0, 6) * DAY_MS);
  for (let i = 0; i < publishCount; i++) {
    timestamps.unshift(new Date(cursor));
    cursor = new Date(cursor.getTime() - rng.int(18, 70) * DAY_MS);
  }

  const history: Valuation[] = [];
  let trendValue = base * rng.float(0.85, 1.0);

  for (let i = 0; i < publishCount; i++) {
    const growth = rng.float(-0.01, 0.025);
    trendValue = Math.max(60000, trendValue * (1 + growth));

    const arv = Math.round(trendValue / 500) * 500;
    const repairEstimate = Math.round((arv * rng.float(0.03, 0.18)) / 100) * 100;
    const asIsValue = Math.round((arv - repairEstimate * rng.float(0.9, 1.3)) / 500) * 500;
    const compCount = rng.int(6, 28);
    const stabilityInputs = buildStabilityInputs(rng, compCount);
    const publishedAt = timestamps[i].toISOString();

    history.push({
      asIsValue: Math.max(30000, asIsValue),
      arv,
      repairEstimate,
      compCount,
      confidence: Math.round(rng.float(55, 97)) / 100,
      stabilityIndex: computeStabilityIndex(stabilityInputs),
      stabilityInputs,
      modelVersion: rng.pick(MODEL_VERSIONS),
      publishedAt,
      txHash: fakeTxHash(`${key}:${i}:${publishedAt}`),
    });
  }

  return history;
}

export interface OracleDataset {
  properties: Property[];
  reads: ReadEvent[];
  consumers: MockConsumer[];
}

let cached: OracleDataset | null = null;

export function getDataset(): OracleDataset {
  if (cached) return cached;

  const rng = new Rng(SEED);
  const pool = generateAddressPool(PROPERTY_COUNT, rng);
  const now = new Date();
  const consumers = buildConsumers();

  const properties: Property[] = [];
  const reads: ReadEvent[] = [];

  for (const entry of pool) {
    const key = propertyKey(entry.address, entry.city, entry.state, entry.zip);
    const publishCount = rng.int(3, 8);
    const history = buildValuationHistory(rng, entry.state, publishCount, now, key);
    const latest = history[history.length - 1];

    properties.push({
      key,
      address: entry.address,
      city: entry.city,
      state: entry.state,
      zip: entry.zip,
      latest,
      history,
    });

    const firstPublishMs = new Date(history[0].publishedAt).getTime();
    const readCount = rng.int(0, 40);
    for (let i = 0; i < readCount; i++) {
      const consumer = rng.pick(consumers);
      const readAt = new Date(rng.float(firstPublishMs, now.getTime())).toISOString();
      reads.push({
        id: sha256Hex(`read:${key}:${i}:${readAt}`),
        propertyKey: key,
        address: `${entry.address}, ${entry.city}, ${entry.state}`,
        consumerAddress: consumer.address,
        consumerType: consumer.type,
        timestamp: readAt,
        feeUsdc: Math.round(rng.float(0.01, 0.05) * 1000) / 1000,
      });
    }
  }

  reads.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  cached = { properties, reads, consumers };
  return cached;
}

function toSummary(property: Property): PropertySummary {
  const { key, address, city, state, zip, latest } = property;
  return { key, address, city, state, zip, latest };
}

export function listProperties(query?: string): PropertySummary[] {
  const summaries = getDataset().properties.map(toSummary);
  if (!query?.trim()) return summaries;
  const q = query.trim().toLowerCase();
  return summaries.filter((p) =>
    `${p.address} ${p.city} ${p.state} ${p.zip}`.toLowerCase().includes(q),
  );
}

export function getProperty(key: string): Property | undefined {
  return getDataset().properties.find((p) => p.key === key);
}

export function getReadsForProperty(key: string): ReadEvent[] {
  return getDataset()
    .reads.filter((r) => r.propertyKey === key)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export function getStats(): Stats {
  const { properties, reads } = getDataset();
  const lastPublishAt = properties.reduce(
    (max, p) => (p.latest.publishedAt > max ? p.latest.publishedAt : max),
    properties[0].latest.publishedAt,
  );
  return {
    propertiesPublished: properties.length,
    readsServed: reads.length,
    lastPublishAt,
  };
}

export function generatePreview(
  address: string,
  city: string,
  state: string,
  zip: string,
): PublishPreview {
  const key = propertyKey(address, city, state, zip);
  const rng = new Rng(`preview:${key}`);
  const [valuation] = buildValuationHistory(rng, state, 1, new Date(), key);
  return {
    address,
    city,
    state,
    zip,
    asIsValue: valuation.asIsValue,
    arv: valuation.arv,
    repairEstimate: valuation.repairEstimate,
    compCount: valuation.compCount,
    confidence: valuation.confidence,
    stabilityIndex: valuation.stabilityIndex,
    stabilityInputs: valuation.stabilityInputs,
    modelVersion: valuation.modelVersion,
  };
}

export function generatePublishResult(
  address: string,
  city: string,
  state: string,
  zip: string,
): PublishResult {
  const key = propertyKey(address, city, state, zip);
  const publishedAt = new Date().toISOString();
  return {
    key,
    txHash: fakeTxHash(`publish:${key}:${publishedAt}`),
    publishedAt,
  };
}

export function getFeed(limit = 10): FeedEntry[] {
  return getDataset()
    .properties.map((p) => ({
      key: p.key,
      address: p.address,
      city: p.city,
      state: p.state,
      asIsValue: p.latest.asIsValue,
      arv: p.latest.arv,
      stabilityIndex: p.latest.stabilityIndex,
      publishedAt: p.latest.publishedAt,
      txHash: p.latest.txHash,
    }))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}
