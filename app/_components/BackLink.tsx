"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// The two versions of the portfolio. Pages like /cv and /privacy lead back to whichever one the visitor came from.
const ORIGINS = { "/": "Case file", "/classic": "Portfolio" } as const;
type Origin = keyof typeof ORIGINS;
const STORAGE_KEY = "portfolio-origin";

const isOrigin = (path: string | null): path is Origin => path !== null && path in ORIGINS;

/** Remembers the last portfolio version visited in this tab. Rendered once in the root layout. */
export function OriginTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (!isOrigin(pathname)) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, pathname);
    } catch {
      // Storage can be blocked; the back links then fall back to the case board.
    }
  }, [pathname]);
  return null;
}

function readOrigin(): Origin {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (isOrigin(stored)) return stored;
  } catch {
    // Keep the default.
  }
  return "/";
}

// The stored origin only changes on another page, so there is nothing to subscribe to.
const subscribe = () => () => {};

/** A link back to the portfolio version the visitor came from; the case board when unknown. */
export default function BackLink({ className, icon }: { className: string; icon: ReactNode }) {
  const origin = useSyncExternalStore(subscribe, readOrigin, () => "/" as const);

  return (
    <Link href={origin} className={className}>
      {icon}
      {ORIGINS[origin]}
    </Link>
  );
}
