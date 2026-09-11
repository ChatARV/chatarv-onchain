import { useState } from "react";

export function useCopy(resetAfterMs = 1500) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), resetAfterMs);
  }

  return { copied, handleCopy };
}
