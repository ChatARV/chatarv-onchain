import { CopyButton } from "@/components/copy-button";
import { CodeBlock } from "@/components/code-block";
import { StellarLink } from "@/components/stellar-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ORACLE_CONTRACT_IDS, truncateMiddle } from "@/lib/stellar";
import { STABILITY_FACTORS } from "@/lib/stability";
import { X402_FEE_USDC } from "@/lib/pricing";
import { formatUsdFee } from "@/lib/format";

const SEP40_INTERFACE = `// SEP-40-style read interface
fn lastprice(asset: Asset) -> Option<PriceData>;
fn price(asset: Asset, timestamp: u64) -> Option<PriceData>;
fn prices(asset: Asset, records: u32) -> Option<Vec<PriceData>>;

// ChatARV extended fields, returned alongside PriceData
struct ChatArvValuation {
    as_is_value: i128,
    arv: i128,
    repair_estimate: i128,
    comp_count: u32,
    confidence: u32,       // basis points, 0-10000
    stability_index: u32,  // 0-100
    model_version: Symbol,
    published_at: u64,
}`;

const CURL_402_EXAMPLE = `# 1. Request without payment: the API responds 402 with payment terms
curl -i https://api.chatarv.ai/oracle/v1/valuation/{propertyKey}

HTTP/1.1 402 Payment Required
X-Payment-Address: <oracle payment account>
X-Payment-Amount: ${X402_FEE_USDC}
X-Payment-Asset: USDC

# 2. Retry with a signed payment authorization attached
curl https://api.chatarv.ai/oracle/v1/valuation/{propertyKey} \\
  -H "X-Payment-Signature: <auth-entry signature>"

# 200 OK: valuation JSON is returned once payment is verified`;

const TS_SNIPPET = `import { Contract, rpc, xdr } from "@stellar/stellar-sdk";

const server = new rpc.Server("https://soroban-rpc.mainnet.stellar.org");
const oracle = new Contract("${ORACLE_CONTRACT_IDS.public}");

async function readLastPrice(propertyKey: string) {
  const asset = xdr.ScVal.scvBytes(Buffer.from(propertyKey, "hex"));
  const tx = await server.simulateTransaction(
    // build & simulate a call to oracle.call("lastprice", asset)
    // omitted here, see the Soroban client docs for building the
    // TransactionBuilder + auth entries this call needs.
  );
  return tx;
}`;

const STABILITY_FORMULA = `interface StabilityFactor {
  key: keyof StabilityInputs;
  weight: number;              // all 7 weights sum to 1
  better: "higher" | "lower";
  range: [min: number, max: number]; // observed low/high for this factor
}

// Rescales a raw value to a 0-1 "goodness" score: min maps to the worst
// score, max maps to the best, and anything outside the range is clamped
// so a single outlier can't blow up the index.
function normalizeFactor(factor: StabilityFactor, value: number): number {
  const [min, max] = factor.range;
  const t = Math.min(1, Math.max(0, (value - min) / (max - min)));
  return factor.better === "higher" ? t : 1 - t;
}

// Weighted sum of every factor's 0-1 score, scaled to 0-100 and rounded.
// Deterministic: the same 7 inputs always produce the same index.
function computeStabilityIndex(
  inputs: StabilityInputs,
  factors: StabilityFactor[],
): number {
  const score = factors.reduce(
    (sum, factor) => sum + factor.weight * normalizeFactor(factor, inputs[factor.key]),
    0,
  );
  return Math.round(Math.min(1, Math.max(0, score)) * 100);
}`;

const NETWORKS = [
  {
    key: "testnet" as const,
    label: "Testnet",
    id: ORACLE_CONTRACT_IDS.testnet,
  },
  { key: "public" as const, label: "Mainnet", id: ORACLE_CONTRACT_IDS.public },
];

export default function DevelopersPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-12 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Developers</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Read published property valuations directly from the ChatARV Oracle contract on Stellar,
          or pay per read over the ChatARV API using x402.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contract id</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="testnet">
            <TabsList>
              {NETWORKS.map((n) => (
                <TabsTrigger key={n.key} value={n.key}>
                  {n.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {NETWORKS.map((n) => (
              <TabsContent key={n.key} value={n.key} className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
                  <span className="font-mono text-sm">{truncateMiddle(n.id, 10, 10)}</span>
                  <CopyButton value={n.id} label="Copy contract id" />
                  <Badge variant="secondary" className="text-[10px]">
                    Placeholder
                  </Badge>
                  <StellarLink className="ml-auto text-xs">stellar.expert</StellarLink>
                </div>
                <p className="text-xs text-muted-foreground">
                  Placeholder id for v1. No contract is deployed at this address yet.
                </p>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Stability Index formula</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The index is a weighted average of seven inputs, each normalized to a 0-1
            &quot;goodness&quot; score before weighting, then scaled to 0-100. It is derived, not
            random: two properties with the same inputs always get the same index.
          </p>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Factor</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead className="text-right">Range</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {STABILITY_FACTORS.map((factor) => (
                  <TableRow key={factor.key}>
                    <TableCell>{factor.label}</TableCell>
                    <TableCell>{Math.round(factor.weight * 100)}%</TableCell>
                    <TableCell>
                      {factor.better === "higher" ? "Higher is better" : "Lower is better"}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      {factor.range[0]}–{factor.range[1]}
                      {factor.unit}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <CodeBlock code={STABILITY_FORMULA} language="typescript" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Read interface</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeBlock code={SEP40_INTERFACE} language="rust" comingSoon />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            x402 pay-per-read
            <Badge variant="secondary">{formatUsdFee(X402_FEE_USDC)} / read</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The same valuation data is available over HTTP for agents and services that would rather
            pay per call than read on-chain. Endpoint:{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              GET /oracle/v1/valuation/:propertyKey
            </code>
          </p>
          <CodeBlock code={CURL_402_EXAMPLE} language="bash" comingSoon />
          <p className="text-xs text-muted-foreground">
            Paying requires a Stellar wallet that supports auth-entry signing. The API does not
            accept raw account keys.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reading from a Soroban contract client</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeBlock code={TS_SNIPPET} language="typescript" comingSoon />
        </CardContent>
      </Card>
    </div>
  );
}
