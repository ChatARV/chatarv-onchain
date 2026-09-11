import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <Logo />
            <p className="max-w-sm text-sm text-muted-foreground">
              A public explorer for property values signed by ChatARV and
              published on Stellar. Not a wallet. Not a payments product.
            </p>
          </div>

          <nav className="flex gap-8 text-sm">
            <div className="space-y-2">
              <p className="font-medium text-foreground">Explorer</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-foreground">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/developers" className="hover:text-foreground">
                    Developers
                  </Link>
                </li>
                <li>
                  <Link href="/publish" className="hover:text-foreground">
                    Publish
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  );
}
