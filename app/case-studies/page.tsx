"use client";
import PortfolioMock from "../../components/PortfolioMock";
import PasswordGate from "@/components/PasswordGate";

export default function CaseStudiesPage() {
  return (
    <PasswordGate storageKey="auth-case-studies">
      <PortfolioMock initialRoute="work" />
    </PasswordGate>
  );
}
