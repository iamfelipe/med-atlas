import { AppHeader } from "@/components/app-header";
import { columns } from "@/components/table-patients/patients.columns";
import { DataTable } from "@/components/table-patients/patients.data-table";
import { Button } from "@/components/ui/button";
import { getAllPatients } from "@/server/user";

export default async function Patient() {
  const { data: patients } = await getAllPatients();

  return (
    <>
      <AppHeader title="Patients">
        <Button>Add patient</Button>
      </AppHeader>
      <DataTable columns={columns} data={patients} />
    </>
  );
}
