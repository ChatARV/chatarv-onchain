import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { LiveFeed } from "@/components/home/live-feed";
import { ConsumersStrip } from "@/components/home/consumers-strip";

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <LiveFeed />
      <ConsumersStrip />
    </>
  );
}
