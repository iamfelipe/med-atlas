import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPatients } from "@/server/user";

export default async function Patient() {
  const patients = await getPatients();

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
          <ol>
            {patients.map((patient) => (
              <li key={patient.id} className="flex gap-4 items-center">
                <p>{patient.firstName}</p>
                <p>{patient.lastName}</p>
                <p>{patient.email}</p>
                <p>{patient.ehrId}</p>
                <Button size="sm" variant="ghost">
                  Add EHR
                </Button>
              </li>
            ))}
          </ol>
        </TabsContent>
        <TabsContent value="Pending">
          <p>Pending</p>
        </TabsContent>
      </Tabs>
    </>
  );
}
