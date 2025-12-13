import PortfolioMock from "../../../components/PortfolioMock";

export default async function CaseStudyPage({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  const { slug } = await Promise.resolve(params);

  return <PortfolioMock initialRoute="work" initialCaseId={slug} />;
}
