"use client";

import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { CopyIcon } from "./ui/icons/akar-icons-copy";
import { CheckIcon } from "./ui/icons/akar-icons-check";

export default function CopyToClipboard({ textToCopy, className }: { textToCopy: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip open={copied}>
        <TooltipTrigger asChild>
          <span onClick={copyToClipboard} className={`${className} cursor-alias flex items-center`}>
            {textToCopy}
            {copied ? (
              <CheckIcon size={14} className="inline-block ml-2 text-(--accent-primary)" />
            ) : (
              <CopyIcon size={14} className="inline-block ml-2 text-(--text-muted)" />
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent sideOffset={6} className="bg-(--bg-tertiary) text-(--text-primary) border border-border">
          <p> Copied to clipboard! </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
