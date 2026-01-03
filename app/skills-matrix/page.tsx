"use client";
import DesignSkillsMatrix from "@/components/DesignSkillsMatrix";
import PasswordGate from "@/components/PasswordGate";

export default function SkillsMatrixPage() {
  return (
    <PasswordGate storageKey="auth-skills-matrix">
      <DesignSkillsMatrix />
    </PasswordGate>
  );
}
