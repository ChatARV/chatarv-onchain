"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { AddressSearch } from "@/components/search/address-search";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/developers", label: "Developers" },
  { href: "/publish", label: "Publish" },
];

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Logo />

        {!isHome && (
          <div className="hidden flex-1 justify-center md:flex">
            <AddressSearch variant="header" />
          </div>
        )}

        <nav className="ml-auto flex items-center gap-1">
          {!isHome && (
            <div className="mr-1 md:hidden">
              <AddressSearch variant="header" className="max-w-40" />
            </div>
          )}
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                pathname === link.href && "bg-accent text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
