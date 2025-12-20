"use client";

import dynamic from "next/dynamic";

const DesignSkillsMatrix = dynamic(
  () => import("@/components/DesignSkillsMatrix"),
  { ssr: false }
);

export default function SkillsMatrixClient() {
  return <DesignSkillsMatrix />;
}
