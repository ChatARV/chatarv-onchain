"use client";

import { Check, Copy } from "lucide-react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import rust from "react-syntax-highlighter/dist/esm/languages/prism/rust";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import { useCopy } from "@/hooks/use-copy";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("rust", rust);

type Language = "tsx" | "typescript" | "bash" | "json" | "rust";

const SHELL_LANGUAGES: readonly Language[] = ["bash"];

function buildSyntaxTheme(base: typeof oneLight) {
  return {
    ...base,
    'pre[class*="language-"]': {
      ...base['pre[class*="language-"]'],
      background: "transparent",
      margin: 0,
      padding: "1rem",
      minWidth: "100%",
      width: "max-content",
      overflow: "visible",
    },
    'code[class*="language-"]': {
      ...base['code[class*="language-"]'],
      background: "transparent",
      fontSize: "0.75rem",
      fontFamily: "var(--font-mono)",
    },
  };
}

const LIGHT_SYNTAX_THEME = buildSyntaxTheme(oneLight);
const DARK_SYNTAX_THEME = buildSyntaxTheme(oneDark);

interface CodeBlockProps {
  code: string;
  language: Language;
  filename?: string;
  comingSoon?: boolean;
  className?: string;
}

export function CodeBlock({ code, language, filename, comingSoon, className }: CodeBlockProps) {
  const mounted = useMounted();
  const { copied, handleCopy } = useCopy();
  const { resolvedTheme } = useTheme();

  const isShell = SHELL_LANGUAGES.includes(language);
  const showHeader = comingSoon || !isShell || Boolean(filename);

  if (!mounted) {
    return <div className={cn("h-24 w-full animate-pulse rounded-lg bg-muted", className)} />;
  }

  const syntaxTheme = resolvedTheme === "dark" ? DARK_SYNTAX_THEME : LIGHT_SYNTAX_THEME;

  return (
    <div
      className={cn(
        "relative flex w-full flex-col overflow-hidden rounded-lg border border-border bg-muted/40",
        className,
      )}
    >
      {showHeader && (
        <div className="flex items-center justify-between gap-2 border-b border-border/80 px-3 py-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
              {filename ?? language}
            </span>
            {comingSoon && (
              <Badge variant="secondary" className="text-[10px]">
                Coming soon
              </Badge>
            )}
          </div>
          <CopyAction copied={copied} onClick={() => handleCopy(code)} />
        </div>
      )}

      <ScrollArea className="w-full">
        <SyntaxHighlighter
          language={language}
          style={syntaxTheme}
          customStyle={{ display: "block", margin: 0 }}
        >
          {code.trim()}
        </SyntaxHighlighter>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {!showHeader && (
        <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100 hover:opacity-100">
          <CopyAction copied={copied} onClick={() => handleCopy(code)} floating />
        </div>
      )}
    </div>
  );
}

function CopyAction({
  copied,
  onClick,
  floating,
}: {
  copied: boolean;
  onClick: () => void;
  floating?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            type="button"
            aria-label={copied ? "Copied" : "Copy code"}
            className={cn(
              "size-6 text-muted-foreground hover:text-foreground",
              floating && "border border-border bg-background/80 backdrop-blur-sm",
            )}
            onClick={onClick}
          />
        }
      >
        {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
      </TooltipTrigger>
      <TooltipContent>{copied ? "Copied!" : "Copy code"}</TooltipContent>
    </Tooltip>
  );
}
