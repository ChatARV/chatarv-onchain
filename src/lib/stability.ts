import type { StabilityInputs } from "./schemas";

type Direction = "higher" | "lower";

interface StabilityFactor {
  key: keyof StabilityInputs;
  label: string;
  weight: number;
  unit: string;
  better: Direction;
  range: readonly [number, number];
}

export const STABILITY_FACTORS: readonly StabilityFactor[] = [
  {
    key: "compDispersion",
    label: "Comp dispersion",
    weight: 0.2,
    unit: "%",
    better: "lower",
    range: [2, 35],
  },
  {
    key: "compCount",
    label: "Comp count",
    weight: 0.15,
    unit: "",
    better: "higher",
    range: [4, 30],
  },
  {
    key: "compDistance",
    label: "Comp distance",
    weight: 0.15,
    unit: "mi",
    better: "lower",
    range: [0.1, 3.5],
  },
  {
    key: "salesVelocity12mo",
    label: "12-month sales velocity",
    weight: 0.15,
    unit: "sales",
    better: "higher",
    range: [2, 60],
  },
  {
    key: "priceTrend",
    label: "Price trend",
    weight: 0.15,
    unit: "%",
    better: "higher",
    range: [-8, 15],
  },
  {
    key: "renovatedShare",
    label: "Renovated share",
    weight: 0.1,
    unit: "%",
    better: "higher",
    range: [0, 80],
  },
  {
    key: "modelDrift",
    label: "Model drift",
    weight: 0.1,
    unit: "%",
    better: "lower",
    range: [0, 12],
  },
] as const;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/** Normalizes a raw factor value to a 0-1 "goodness" score for stability weighting. */
export function normalizeFactor(factor: StabilityFactor, value: number): number {
  const [min, max] = factor.range;
  const t = clamp01((value - min) / (max - min));
  return factor.better === "higher" ? t : 1 - t;
}

export function computeStabilityIndex(inputs: StabilityInputs): number {
  const score = STABILITY_FACTORS.reduce((sum, factor) => {
    return sum + factor.weight * normalizeFactor(factor, inputs[factor.key]);
  }, 0);
  return Math.round(clamp01(score) * 100);
}
