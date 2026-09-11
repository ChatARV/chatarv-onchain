# ChatARV Oracle Explorer

Public explorer and developer portal for ChatARV Oracle. ChatARV publishes property valuations (ARV, as-is value, repair estimate, comp set) signed by ChatARV to a Soroban smart contract on Stellar, along with a Stability Index. This app lets anyone browse those published values, see how contracts read them, and get set up as a developer.

It is not a wallet, not a deal tool, and not a payments product. Nobody deposits, escrows, or moves money here.

## Pages

- Home: search for a property, see recent publishes, and a quick overview of how the oracle works
- Property: valuation history, stability breakdown, and reads for a single property
- Developers: contract ids, the read interface, and the x402 pay-per-read setup
- Publish: preview and publish a valuation for a property

## Running locally

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000 in your browser.

All data in this app is mocked and deterministic. It comes from local API routes under `src/app/api/oracle`, backed by a seeded generator in `src/lib/mock`, so it can later be swapped for a real indexer without touching the UI.
