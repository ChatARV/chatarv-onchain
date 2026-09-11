import { getFeed, getStats } from "@/lib/mock";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { LiveFeed } from "@/components/home/live-feed";
import { ConsumersStrip } from "@/components/home/consumers-strip";

export const dynamic = "force-dynamic";

export default function Home() {
  const stats = getStats();
  const feed = getFeed(10);

  return (
    <>
      <Hero initialStats={stats} />
      <HowItWorks />
      <LiveFeed initialFeed={feed} />
      <ConsumersStrip />
    </>
  );
}
