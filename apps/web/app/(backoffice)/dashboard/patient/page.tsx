import { columns } from "@/components/table-patients/patients.columns";
import { DataTable } from "@/components/table-patients/patients.data-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="Pending">Pending</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <DataTable columns={columns} data={patients} />
        </TabsContent>
        <TabsContent value="Pending">
          <p>Pending</p>
        </TabsContent>
      </Tabs>
    </>
  );
}
