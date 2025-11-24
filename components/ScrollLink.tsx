"use client";

import Link from "next/link";

type SectionId = "Hero" | "AboutMe" | "Projects" | "Contact";

type Props = React.PropsWithChildren<{
  targetId: SectionId;
  className?: string;
}>;

export default function ScrollLink({ targetId, className, children }: Props) {
  const handleClick = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.button === 1) return;
    if (window.location.pathname !== "/") return;

    e.preventDefault();

    const section = document.getElementById(targetId);
    if (!section) return;

    const scrollRoot = document.getElementById("scroll-root");

    const headerOffset = window.innerWidth < 768 ? 72 : 32;

    if (scrollRoot) {
      const rootRect = scrollRoot.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();

      const currentScroll = scrollRoot.scrollTop;
      const target = currentScroll + (sectionRect.top - rootRect.top) - headerOffset;

      scrollRoot.scrollTo({
        top: target,
        behavior: "smooth",
      });
    } else {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: sectionTop - headerOffset,
        behavior: "smooth",
      });
    }

    history.replaceState(null, "", location.pathname);
  };

  return (
    <Link href={`/#${targetId}`} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
