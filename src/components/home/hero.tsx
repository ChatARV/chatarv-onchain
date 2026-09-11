"use client";

import { DotPattern } from "@/components/ui/dot-pattern";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BlurFade } from "@/components/ui/blur-fade";
import { AddressSearch } from "@/components/search/address-search";
import { useStats } from "@/hooks/use-oracle";
import { formatTimeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Hero() {
  const { data: stats } = useStats();

  return (
    <section className="relative overflow-hidden border-b border-border/80">
      <DotPattern
        className={cn(
          "absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]",
        )}
      />

      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <BlurFade duration={0.5}>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Property values signed by ChatARV, published on Stellar.
          </h1>
        </BlurFade>

        <BlurFade delay={0.1} duration={0.5}>
          <div className="mt-10 flex justify-center">
            <AddressSearch variant="hero" />
          </div>
        </BlurFade>

        <BlurFade delay={0.2} duration={0.5}>
          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-3">
            <div>
              <dt className="text-sm text-muted-foreground">Properties published</dt>
              <dd className="mt-1 font-mono text-3xl font-semibold tabular-nums text-foreground">
                {stats ? (
                  <NumberTicker value={stats.propertiesPublished} className="text-foreground" />
                ) : (
                  "..."
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Reads served</dt>
              <dd className="mt-1 font-mono text-3xl font-semibold tabular-nums text-foreground">
                {stats ? (
                  <NumberTicker value={stats.readsServed} className="text-foreground" />
                ) : (
                  "..."
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Last publish</dt>
              <dd className="mt-1 text-3xl font-semibold text-foreground">
                {stats ? formatTimeAgo(stats.lastPublishAt) : "..."}
              </dd>
            </div>
          </dl>
        </BlurFade>
      </div>
    </section>
  );
}
