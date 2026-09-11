import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Image
        src="/logo.png"
        alt="ChatARV"
        width={28}
        height={28}
        className="shrink-0 rounded-full"
        priority
      />
      <span className="flex items-baseline gap-1 text-lg leading-none">
        <span className="font-semibold tracking-tight text-foreground">ChatARV</span>
        <span className="font-normal text-muted-foreground">Oracle</span>
      </span>
    </Link>
  );
}
