import MySquadCaseStudy from "@/components/case-studies/MySquadCaseStudy";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MySquad — Aleks",
  description:
    "Digitizing Army squad leadership without losing what makes it human. Case study by Aleks.",
  openGraph: {
    title: "MySquad — Aleks",
    description:
      "Digitizing Army squad leadership without losing what makes it human.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "MySquad — Aleks",
    description:
      "Digitizing Army squad leadership without losing what makes it human.",
  },
};

export default function MySquadPage() {
  return <MySquadCaseStudy />;
}
