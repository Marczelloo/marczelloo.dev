"use client";

import Link from "next/link";

type Props = React.PropsWithChildren<{ targetId: "Hero" | "AboutMe" | "Projects" | "Contact"; className?: string }>;

export default function ScrollLink({ targetId, className, children }: Props) {
  const handleClick = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.button === 1) return;
    if (window.location.pathname !== "/") return;
    e.preventDefault();

    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", location.pathname);
  };

  return (
    <Link href={`/#${targetId}`} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
