import { createHash } from "crypto";

export function normalizeAddress(
  address: string,
  city: string,
  state: string,
  zip: string,
): string {
  return `${address}, ${city}, ${state} ${zip}`.trim().toLowerCase().replace(/\s+/g, " ");
}

export function propertyKey(address: string, city: string, state: string, zip: string): string {
  const normalized = normalizeAddress(address, city, state, zip);
  return createHash("sha256").update(normalized).digest("hex");
}

export function sha256Hex(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}
