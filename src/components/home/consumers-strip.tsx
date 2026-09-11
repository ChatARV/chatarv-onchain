import { Landmark, Layers, Vault } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { BlurFade } from "@/components/ui/blur-fade";

const CONSUMERS = [
  { icon: Landmark, label: "Lending protocols" },
  { icon: Layers, label: "Tokenization platforms" },
  { icon: Vault, label: "Vault strategies" },
  { icon: Landmark, label: "Underwriting tools" },
  { icon: Layers, label: "Risk engines" },
  { icon: Vault, label: "Portfolio dashboards" },
];

export function ConsumersStrip() {
  return (
    <section className="border-t border-border/80 bg-muted/40 py-16">
      <BlurFade>
        <p className="text-center text-sm font-medium text-muted-foreground">
          Read by protocols across categories like
        </p>
      </BlurFade>

      <div className="mt-8">
        <Marquee pauseOnHover className="[--duration:30s]">
          {CONSUMERS.map((c) => (
            <div
              key={c.label}
              className="flex items-center gap-2 rounded-full border border-border/80 bg-background px-4 py-2 text-sm text-muted-foreground"
            >
              <c.icon className="size-4" />
              {c.label}
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
