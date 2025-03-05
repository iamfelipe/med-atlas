import { Button } from "@/components/ui/button";
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
      <ol>
        {patients.map((patient) => (
          <li key={patient.id} className="flex gap-4">
            <p>{patient.firstName}</p>
            <p>{patient.lastName}</p>
            <p>{patient.email}</p>
          </li>
        ))}
      </ol>
    </>
  );
}
