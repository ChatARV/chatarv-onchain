import { Cpu, Link2, ShieldCheck } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { Card, CardContent } from "@/components/ui/card";

const STEPS = [
  {
    icon: Cpu,
    title: "Engine runs in unbiased mode",
    description:
      "ChatARV's underwriting engine produces an ARV, as-is value, repair estimate, and comp set with no manual override.",
  },
  {
    icon: ShieldCheck,
    title: "Signed value published to Soroban",
    description:
      "The result is signed by ChatARV and written to a Soroban smart contract on Stellar, along with a Stability Index.",
  },
  {
    icon: Link2,
    title: "Any contract reads it",
    description:
      "Lending, tokenization, or vault protocols read the published value directly from the contract, or pay per read over x402.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <BlurFade>
        <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground">
          How it works
        </h2>
      </BlurFade>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {STEPS.map((step, i) => (
          <BlurFade key={step.title} delay={i * 0.1}>
            <Card className="h-full border-border/80">
              <CardContent className="flex flex-col gap-4 pt-2">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <step.icon className="size-5" />
                </div>
                <div className="text-xs font-medium text-muted-foreground">
                  Step {i + 1}
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
