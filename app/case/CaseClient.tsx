"use client";

import dynamic from "next/dynamic";
import Overlay from "./_ui/Overlay";

// The WebGL scene is client-only and heavy; the overlay renders immediately.
const Scene = dynamic(() => import("./_scene/Scene"), { ssr: false });

export default function CaseClient() {
  return (
    <>
      <div className="absolute inset-0">
        <Scene />
      </div>
      <Overlay />
    </>
  );
}
