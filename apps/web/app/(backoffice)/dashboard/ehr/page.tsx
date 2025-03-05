import { Button } from "@/components/ui/button";
import { getAllEhr } from "@/server/ehr";

export default async function Ehr() {
  const ehrList = await getAllEhr();

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Electronic Health Records
        </h2>
        <div className="flex items-center space-x-2">
          <Button>Add EHR</Button>
        </div>
      </div>
      <ol>
        {ehrList.map((ehr) => (
          <li key={ehr.id} className="flex gap-2">
            <p>{ehr.name}</p>
            <p>{ehr.baseUrl}</p>
            <p>{ehr.authType}</p>
            <p>{JSON.stringify(ehr.mappings, null, 2)}</p>
          </li>
        ))}
      </ol>
    </>
  );
}
