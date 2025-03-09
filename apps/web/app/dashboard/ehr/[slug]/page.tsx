import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { getEhr } from "@/server/ehr/get-ehr";
import Link from "next/link";
import { EHRDetailView } from "./ehr-detail-view";

export default async function EHRDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: id } = await params;
  const { data: ehr } = await getEhr(id);

  return (
    <>
      <AppHeader title={`${ehr.name} Details`}>
        <Button variant="outline" asChild>
          <Link href={`/dashboard/ehr/${id}/edit`}>Edit EHR</Link>
        </Button>
      </AppHeader>

      <EHRDetailView ehr={ehr} />
    </>
  );
}
