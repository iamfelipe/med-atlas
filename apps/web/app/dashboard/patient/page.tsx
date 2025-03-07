import { columns } from "@/components/table-patients/patients.columns";
import { DataTable } from "@/components/table-patients/patients.data-table";
import { Button } from "@/components/ui/button";
import { getAllPatients } from "@/server/user";

export default async function Patient() {
  const patients = await getAllPatients();

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Patients</h2>
        <div className="flex items-center space-x-2">
          <Button>Add patient</Button>
        </div>
      </div>
      <DataTable columns={columns} data={patients} />
    </>
  );
}
