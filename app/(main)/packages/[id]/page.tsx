import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Package Details - ABA Access",
  description: "Package details and coverage",
};

export default async function PackageDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">Package Detail Page - ID: {id}</h1>
    </div>
  );
}
