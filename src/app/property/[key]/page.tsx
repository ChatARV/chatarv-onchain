"use client";

import { use } from "react";
import { useProperty, useReads } from "@/hooks/use-oracle";
import { CopyButton } from "@/components/copy-button";
import { StellarLink } from "@/components/stellar-link";
import { StabilityGauge } from "@/components/property/stability-gauge";
import { StabilityBreakdown } from "@/components/property/stability-breakdown";
import { ValuationChart } from "@/components/property/valuation-chart";
import { ReadsTable } from "@/components/property/reads-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { formatDateTime, formatTimeAgo, formatUsd } from "@/lib/format";
import { truncateMiddle } from "@/lib/stellar";

export default function PropertyPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = use(params);
  const { data: property, isLoading, isError } = useProperty(key);
  const { data: reads } = useReads(key);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-12 sm:px-6">
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-xl font-semibold text-foreground">Property not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No published value exists for this property key.
        </p>
      </div>
    );
  }

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
          <CardContent className="flex items-center justify-center">
            <StabilityGauge value={latest.stabilityIndex} />
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
          <ReadsTable reads={reads ?? []} />
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
