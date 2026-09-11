# Decisions

One line per non-obvious choice, in the order they were made.

- Pinned `next` to 15.5.25 after `create-next-app@latest` installed Next 16 — spec requires Next.js 15.
- `eslint.config.mjs` uses `FlatCompat` from `@eslint/eslintrc` to load `next/core-web-vitals` + `next/typescript`, since `eslint-config-next@15` ships legacy eslintrc-style configs, not flat-config arrays.
- shadcn/ui initialized with the `nova` preset, which uses Base UI (`@base-ui/react`) as its headless primitive layer instead of Radix. Spec only requires "shadcn/ui for primitives"; Base UI is the current shadcn CLI default and the components/API surface (Button, Card, Dialog, etc.) are unaffected.
- Magic UI components installed via their shadcn-compatible registry URLs (`https://magicui.design/r/*.json`) rather than hand-copied, per spec's "install via CLI" rule.
- Reviewed the team's shared UI-platform doc; skipped adding further component libraries beyond Magic UI to avoid unapproved dependencies and because much of that catalog leans on gradient/glow/particle effects the spec explicitly rules out ("no gradient blobs", calm motion). Custom pieces (e.g. the stability radial gauge) are hand-built with SVG + `motion` instead.
- Design tokens use `hsl(...)` color functions (not bare triples) inside Tailwind v4's CSS-variable theme so `--color-primary: var(--primary)` etc. resolve to valid CSS colors.
- Fonts swapped from the scaffold's Geist/Geist Mono to Inter/JetBrains Mono per spec, wired via CSS variables `--font-sans` / `--font-mono`.
- No `.dark` theme block — v1 is light-only, so no dark-mode class or media query is wired up at all (avoids future components accidentally activating a dark variant).
- Property key = `sha256(lowercased, whitespace-collapsed "address, city, state zip")`, computed with Node's `crypto` module server-side only (mock generator + API routes).
- Mock dataset (200 properties across NV/NY/AZ/NC/FL/OH markets) is generated once per server process via a deterministic seeded PRNG (mulberry32) and memoized in a module-level singleton — same seed always reproduces the same data, and repeated API calls don't regenerate it.
- Fake but validly-checksummed Stellar contract/account ids and tx hashes are derived deterministically from seed strings via `@stellar/stellar-sdk`'s `StrKey` encoder — realistic-looking without corresponding to any real deployed contract.
- Every mock API route parses its response through the matching Zod schema before returning it, so a shape mismatch fails loudly in dev rather than shipping bad data to the UI.
- `/api/oracle/publish/preview` and `/api/oracle/publish` accept arbitrary addresses (not just the 200 seeded ones) and derive a preview/publish result deterministically from the input address — supports the `/publish` flow without needing the address to already exist in the dataset.
