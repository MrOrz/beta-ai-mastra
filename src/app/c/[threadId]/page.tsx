import { MainLayout } from "@/components/layout/MainLayout";

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  return <MainLayout threadId={threadId} />;
}
