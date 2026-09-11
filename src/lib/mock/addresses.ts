import { Rng } from "./rng";

export interface MarketAddress {
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface Market {
  city: string;
  state: string;
  zips: string[];
  streets: string[];
}

// Street-number + street-name combinations are procedurally generated per
// market; none of these correspond to a specific real property record.
const MARKETS: Market[] = [
  {
    city: "Las Vegas",
    state: "NV",
    zips: ["89104", "89108", "89115", "89121", "89131", "89142", "89156"],
    streets: [
      "Sahara Ave",
      "Charleston Blvd",
      "Eastern Ave",
      "Rainbow Blvd",
      "Vegas Valley Dr",
      "Bonanza Rd",
      "Nellis Blvd",
      "Tropicana Ave",
      "Flamingo Rd",
      "Cheyenne Ave",
    ],
  },
  {
    city: "Henderson",
    state: "NV",
    zips: ["89011", "89014", "89015", "89052"],
    streets: [
      "Horizon Ridge Pkwy",
      "Sunset Rd",
      "Green Valley Pkwy",
      "Wigwam Pkwy",
      "Boulder Hwy",
    ],
  },
  {
    city: "North Las Vegas",
    state: "NV",
    zips: ["89030", "89031", "89032", "89081"],
    streets: ["Lake Mead Blvd", "Craig Rd", "Camino Al Norte", "Losee Rd", "Simmons St"],
  },
  {
    city: "Huntington",
    state: "NY",
    zips: ["11743"],
    streets: [
      "New York Ave",
      "Park Ave",
      "Main St",
      "Woodbury Rd",
      "Pulaski Rd",
      "Vineyard Rd",
      "Old Country Rd",
    ],
  },
  {
    city: "Huntington Station",
    state: "NY",
    zips: ["11746"],
    streets: ["Depot Rd", "Broadway", "Lowndes Ave", "East 5th St", "Nathan Hale Dr"],
  },
  {
    city: "Melville",
    state: "NY",
    zips: ["11747"],
    streets: ["Ruland Rd", "Sweet Hollow Rd", "Old Walt Whitman Rd", "Round Swamp Rd"],
  },
  {
    city: "Phoenix",
    state: "AZ",
    zips: ["85008", "85015", "85033", "85041", "85051"],
    streets: [
      "Camelback Rd",
      "Indian School Rd",
      "Thomas Rd",
      "McDowell Rd",
      "Van Buren St",
      "Bethany Home Rd",
    ],
  },
  {
    city: "Charlotte",
    state: "NC",
    zips: ["28205", "28208", "28212", "28216", "28269"],
    streets: [
      "Central Ave",
      "Freedom Dr",
      "Albemarle Rd",
      "Sugar Creek Rd",
      "The Plaza",
      "Beatties Ford Rd",
    ],
  },
  {
    city: "Jacksonville",
    state: "FL",
    zips: ["32205", "32208", "32210", "32218", "32244"],
    streets: [
      "Blanding Blvd",
      "Beach Blvd",
      "Lem Turner Rd",
      "Normandy Blvd",
      "Soutel Dr",
    ],
  },
  {
    city: "Columbus",
    state: "OH",
    zips: ["43204", "43207", "43211", "43219", "43227"],
    streets: [
      "Sullivant Ave",
      "Cleveland Ave",
      "Livingston Ave",
      "Parsons Ave",
      "Refugee Rd",
    ],
  },
];

export function generateAddressPool(count: number, rng: Rng): MarketAddress[] {
  const seen = new Set<string>();
  const pool: MarketAddress[] = [];

  let guard = 0;
  while (pool.length < count && guard < count * 20) {
    guard++;
    const market = rng.pick(MARKETS);
    const street = rng.pick(market.streets);
    const zip = rng.pick(market.zips);
    const number = rng.int(100, 9999);
    const address = `${number} ${street}`;
    const dedupeKey = `${address}|${market.city}|${zip}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    pool.push({ address, city: market.city, state: market.state, zip });
  }

  return pool;
}
