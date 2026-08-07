"use client";

import { useEffect } from "react";

const SECTION_IDS = ["hero", "journey", "craft", "about", "contact"] as const;
const WHEEL_THRESHOLD = 36;

export default function SectionScrollController() {
  useEffect(() => {
    const scrollRoot = document.getElementById("page-root");
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!scrollRoot || sections.length !== SECTION_IDS.length) return;

    const desktop = window.matchMedia("(min-width: 1024px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let wheelTotal = 0;
    let wheelResetTimer: number | null = null;
    let unlockTimer: number | null = null;
    let locked = false;
    let animationStartedAt = 0;

    const clearTimer = (timer: number | null) => {
      if (timer !== null) window.clearTimeout(timer);
    };

    const nearestSectionIndex = () => {
      const scrollTop = scrollRoot.scrollTop;
      return sections.reduce((nearest, section, index) => {
        const nearestDistance = Math.abs(sections[nearest].offsetTop - scrollTop);
        const currentDistance = Math.abs(section.offsetTop - scrollTop);
        return currentDistance < nearestDistance ? index : nearest;
      }, 0);
    };

    const scheduleUnlock = () => {
      clearTimer(unlockTimer);
      const minimumMotionTime = reducedMotion.matches ? 80 : 720;
      const remainingMotionTime = Math.max(0, animationStartedAt + minimumMotionTime - performance.now());
      unlockTimer = window.setTimeout(() => {
        locked = false;
        unlockTimer = null;
      }, Math.max(remainingMotionTime, 180));
    };

    const scrollToIndex = (index: number) => {
      const target = sections[index];
      if (!target) return;

      locked = true;
      animationStartedAt = performance.now();
      scrollRoot.scrollTo({
        top: target.offsetTop,
        behavior: reducedMotion.matches ? "auto" : "smooth",
      });
      scheduleUnlock();
    };

    const moveBy = (direction: -1 | 1) => {
      const currentIndex = nearestSectionIndex();
      const nextIndex = Math.min(sections.length - 1, Math.max(0, currentIndex + direction));
      if (nextIndex !== currentIndex) scrollToIndex(nextIndex);
    };

    const normalizeWheelDelta = (event: WheelEvent) => {
      if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return event.deltaY * 16;
      if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) return event.deltaY * scrollRoot.clientHeight;
      return event.deltaY;
    };

    const handleWheel = (event: WheelEvent) => {
      if (!desktop.matches || event.ctrlKey) return;
      event.preventDefault();

      if (locked) {
        scheduleUnlock();
        return;
      }

      wheelTotal += normalizeWheelDelta(event);
      clearTimer(wheelResetTimer);
      wheelResetTimer = window.setTimeout(() => {
        wheelTotal = 0;
        wheelResetTimer = null;
      }, 140);

      if (Math.abs(wheelTotal) < WHEEL_THRESHOLD) return;
      const direction = wheelTotal > 0 ? 1 : -1;
      wheelTotal = 0;
      moveBy(direction);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!desktop.matches || event.defaultPrevented) return;
      const focused = document.activeElement;
      if (
        focused instanceof HTMLInputElement ||
        focused instanceof HTMLTextAreaElement ||
        focused instanceof HTMLSelectElement ||
        (focused instanceof HTMLElement && focused.isContentEditable)
      ) {
        return;
      }

      if (locked && ["ArrowDown", "ArrowUp", "PageDown", "PageUp", " "].includes(event.key)) {
        event.preventDefault();
        return;
      }

      if (event.key === "ArrowDown" || event.key === "PageDown" || (event.key === " " && !event.shiftKey)) {
        event.preventDefault();
        moveBy(1);
      } else if (event.key === "ArrowUp" || event.key === "PageUp" || (event.key === " " && event.shiftKey)) {
        event.preventDefault();
        moveBy(-1);
      } else if (event.key === "Home") {
        event.preventDefault();
        scrollToIndex(0);
      } else if (event.key === "End") {
        event.preventDefault();
        scrollToIndex(sections.length - 1);
      }
    };

    scrollRoot.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      scrollRoot.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      clearTimer(wheelResetTimer);
      clearTimer(unlockTimer);
    };
  }, []);

  return null;
}
