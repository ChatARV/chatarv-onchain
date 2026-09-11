"use client";

import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  className?: string;
  label?: string;
}

export function CopyButton({ value, className, label = "Copy" }: CopyButtonProps) {
  const { copied, handleCopy } = useCopy();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn("size-6 shrink-0 text-muted-foreground hover:text-foreground", className)}
      onClick={() => handleCopy(value)}
      aria-label={label}
    >
      {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
    </Button>
  );
}
