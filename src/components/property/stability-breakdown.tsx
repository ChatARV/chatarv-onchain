import { STABILITY_FACTORS, normalizeFactor } from "@/lib/stability";
import type { StabilityInputs } from "@/lib/schemas";

function formatValue(value: number, unit: string): string {
  const rounded = Number.isInteger(value) ? value : Math.round(value * 10) / 10;
  return unit ? `${rounded}${unit}` : `${rounded}`;
}

export function StabilityBreakdown({ inputs }: { inputs: StabilityInputs }) {
  return (
    <ul className="space-y-3">
      {STABILITY_FACTORS.map((factor) => {
        const value = inputs[factor.key];
        const goodness = normalizeFactor(factor, value);
        return (
          <li key={factor.key}>
            <div className="mb-1 flex items-baseline justify-between text-sm">
              <span className="text-muted-foreground">{factor.label}</span>
              <span className="font-mono tabular-nums text-foreground">
                {formatValue(value, factor.unit)}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.round(goodness * 100)}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
