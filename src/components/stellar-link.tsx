"use client";

import { ExternalLink } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface StellarLinkProps {
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

export function StellarLink({ children, className, showIcon = true }: StellarLinkProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            className={cn(
              "inline-flex cursor-pointer items-center gap-1 text-muted-foreground hover:text-primary",
              className,
            )}
          />
        }
      >
        {children}
        {showIcon && <ExternalLink className="size-3.5" />}
      </TooltipTrigger>
      <TooltipContent>Coming soon</TooltipContent>
    </Tooltip>
  );
}
