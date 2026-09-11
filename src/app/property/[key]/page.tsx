import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProperty, getReadsForProperty } from "@/lib/mock";
import { CopyButton } from "@/components/copy-button";
import { StellarLink } from "@/components/stellar-link";
import { StabilityGauge } from "@/components/property/stability-gauge";
import { StabilityBreakdown } from "@/components/property/stability-breakdown";
import { ValuationChart } from "@/components/property/valuation-chart";
import { ReadsTable } from "@/components/property/reads-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatDateTime, formatTimeAgo, formatUsd } from "@/lib/format";
import { truncateMiddle } from "@/lib/stellar";

interface PropertyPageProps {
  params: Promise<{ key: string }>;
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { key } = await params;
  const property = getProperty(key);

  if (!property) {
    return { title: "Property not found | ChatARV Oracle" };
  }

  const { latest } = property;
  const title = `${property.address}, ${property.city}, ${property.state}`;
  const description = `As-is ${formatUsd(latest.asIsValue)} · ARV ${formatUsd(latest.arv)} · Stability ${latest.stabilityIndex} · published on Stellar ${formatDate(latest.publishedAt)}`;

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: "summary", title, description },
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { key } = await params;
  const property = getProperty(key);

  if (!property) {
    notFound();
  }

  const reads = getReadsForProperty(key);
  const { latest } = property;

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {property.address}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {property.city}, {property.state} {property.zip}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-1">
              <span className="font-mono text-xs text-muted-foreground">
                {truncateMiddle(property.key, 8, 8)}
              </span>
              <CopyButton value={property.key} label="Copy property key" />
            </div>
            <Badge variant="outline">{latest.modelVersion}</Badge>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xs text-muted-foreground">Last published</p>
          <p className="text-sm font-medium text-foreground">{formatTimeAgo(latest.publishedAt)}</p>
          <p className="text-xs text-muted-foreground">{formatDateTime(latest.publishedAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">As-Is Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-3xl font-semibold tabular-nums text-foreground">
              {formatUsd(latest.asIsValue)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {latest.compCount} comps · {Math.round(latest.confidence * 100)}% confidence
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">ARV</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-3xl font-semibold tabular-nums text-foreground">
              {formatUsd(latest.arv)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Repair estimate {formatUsd(latest.repairEstimate)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Stability Index
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-2">
            <StabilityGauge value={latest.stabilityIndex} />
            <p className="text-center text-[11px] leading-snug text-muted-foreground">
              Confidence is the engine&apos;s certainty in the comp match. Stability is how much the
              value should be trusted over time.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Stability breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <StabilityBreakdown inputs={latest.stabilityInputs} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Valuation history</CardTitle>
          </CardHeader>
          <CardContent>
            <ValuationChart history={property.history} />
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-primary" /> ARV
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-muted-foreground" /> As-Is
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reads</CardTitle>
        </CardHeader>
        <CardContent>
          <ReadsTable reads={reads} />
        </CardContent>
      </Card>

      <Separator />

      <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-6">
        <StellarLink>View oracle contract on stellar.expert</StellarLink>
        <StellarLink>View latest publish tx on stellar.expert</StellarLink>
      </div>
    </div>
  );
}
