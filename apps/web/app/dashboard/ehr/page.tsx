import { columns } from "@/components/table-ehr/ehr.columns";
import { DataTable } from "@/components/table-ehr/ehr.data-table";
import { Button } from "@/components/ui/button";
import { getAllEhr } from "@/server/ehr";
import Link from "next/link";

export default async function EHRPage() {
  const { data: ehrList } = await getAllEhr();

  if (ehrList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2>No EHRs found</h2>
        <Button asChild>
          <Link href="/dashboard/ehr/create">Start Creating EHR</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Electronic Health Records
        </h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/dashboard/ehr/create">Create EHR</Link>
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={ehrList} />
    </>
  );
}
