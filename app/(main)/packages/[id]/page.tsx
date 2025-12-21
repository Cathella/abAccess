export default function PackageDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">Package Detail Page - ID: {params.id}</h1>
    </div>
  );
}
