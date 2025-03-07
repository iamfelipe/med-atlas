import { getEhr } from "@/server/ehr/get-ehr";
import { EditEHR } from "./edit-ehr";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: id } = await params;
  const { data: ehr } = await getEhr(id);

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Edit {ehr.name}</h2>
      </div>
      <EditEHR ehr={ehr} />
    </>
  );
}
