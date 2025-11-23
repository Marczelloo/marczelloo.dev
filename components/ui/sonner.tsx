"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from "lucide-react";

export function Toaster(props: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group rounded-lg border border-border bg-card/95 text-[var(--text-primary)] shadow-lg shadow-black/30 backdrop-blur supports-[backdrop-filter]:bg-card/80",
          title: "font-semibold",
          description: "text-(--text-secondary)",
          actionButton: "bg-primary text-primary-foreground hover:bg-primary/90",
          cancelButton: "bg-accent text-accent-foreground hover:bg-accent/80",
        },
      }}
      style={
        {
          "--normal-bg": "var(--bg-card)",
          "--normal-text": "var(--text-primary)",
          "--normal-border": "var(--border-subtle)",
          "--success-bg": "var(--bg-card)",
          "--info-bg": "var(--bg-card)",
          "--warning-bg": "var(--bg-card)",
          "--error-bg": "var(--bg-card)",
          "--success-text": "var(--text-primary)",
          "--info-text": "var(--text-primary)",
          "--warning-text": "var(--text-primary)",
          "--error-text": "var(--text-primary)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
}
