"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CopyButton } from "@/components/copy-button";
import { StabilityGauge } from "@/components/property/stability-gauge";
import { StabilityBreakdown } from "@/components/property/stability-breakdown";
import { fetchPublishPreview, submitPublish, type AddressInput } from "@/lib/api-client";
import { formatUsd } from "@/lib/format";
import { truncateMiddle } from "@/lib/stellar";
import type { PublishPreview, PublishResult } from "@/lib/schemas";

const ADDRESS_RE = /^(.+),\s*(.+),\s*([A-Za-z]{2})\s+(\d{5})$/;

function parseAddress(raw: string): AddressInput | null {
  const match = raw.trim().match(ADDRESS_RE);
  if (!match) return null;
  const [, address, city, state, zip] = match;
  return { address: address.trim(), city: city.trim(), state: state.toUpperCase(), zip };
}

export default function PublishPage() {
  const [raw, setRaw] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [preview, setPreview] = useState<PublishPreview | null>(null);
  const [result, setResult] = useState<PublishResult | null>(null);

  const previewMutation = useMutation({
    mutationFn: fetchPublishPreview,
    onSuccess: (data) => {
      setPreview(data);
      setResult(null);
    },
  });

  const publishMutation = useMutation({
    mutationFn: submitPublish,
    onSuccess: (data) => setResult(data),
  });

  function onPreview() {
    const parsed = parseAddress(raw);
    if (!parsed) {
      setParseError("Enter the address as: street, city, ST zip");
      return;
    }
    setParseError(null);
    previewMutation.mutate(parsed);
  }

  function onPublish() {
    const parsed = parseAddress(raw);
    if (!parsed) return;
    publishMutation.mutate(parsed);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-12 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Publish a valuation
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Hand a lender a link instead of a PDF. Preview the unbiased-mode
          result, then publish it to Stellar.
        </p>
        <Badge variant="secondary" className="mt-3">
          No ChatARV account needed
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Property address</CardTitle>
          <CardDescription>Format: street, city, ST zip</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder="1240 Sahara Ave, Las Vegas, NV 89104"
          />
          {parseError && <p className="text-xs text-destructive">{parseError}</p>}
          <Button onClick={onPreview} disabled={previewMutation.isPending || !raw}>
            {previewMutation.isPending ? "Running unbiased mode…" : "Preview"}
          </Button>
        </CardContent>
      </Card>

      {preview && !result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Unbiased-mode preview</CardTitle>
            <CardDescription>
              {preview.address}, {preview.city}, {preview.state} {preview.zip}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">As-Is Value</p>
                <p className="font-mono text-2xl font-semibold tabular-nums text-foreground">
                  {formatUsd(preview.asIsValue)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">ARV</p>
                <p className="font-mono text-2xl font-semibold tabular-nums text-foreground">
                  {formatUsd(preview.arv)}
                </p>
              </div>
              <div className="flex items-center">
                <StabilityGauge value={preview.stabilityIndex} size={88} />
              </div>
            </div>

            <StabilityBreakdown inputs={preview.stabilityInputs} />

            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline">{preview.modelVersion}</Badge>
              <span>{preview.compCount} comps</span>
              <span>·</span>
              <span>{Math.round(preview.confidence * 100)}% confidence</span>
            </div>

            <Button onClick={onPublish} disabled={publishMutation.isPending}>
              {publishMutation.isPending ? "Publishing…" : "Publish to Stellar"}
            </Button>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="size-5 text-primary" />
              Published
            </CardTitle>
            <CardDescription>
              Signed by ChatARV and published on Stellar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">{truncateMiddle(result.key, 8, 8)}</span>
              <CopyButton value={result.key} label="Copy property key" />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button render={<Link href={`/property/${result.key}`} />} nativeButton={false}>
                View property page
              </Button>
              <Tooltip>
                <TooltipTrigger render={<Button variant="outline" type="button" />}>
                  View publish tx on stellar.expert
                </TooltipTrigger>
                <TooltipContent>Coming soon</TooltipContent>
              </Tooltip>
            </div>

            <p className="text-xs text-muted-foreground">
              Share the property page link with a lender instead of a PDF. It
              always reflects the latest signed value.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
