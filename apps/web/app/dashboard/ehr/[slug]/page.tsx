import { getEhr } from "@/server/ehr/get-ehr";

export default async function EHRDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: id } = await params;
  const { data: ehr } = await getEhr(id);

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">View</h2>
      </div>
      <pre>{JSON.stringify(ehr, null, 2)}</pre>
    </>
  );
}
