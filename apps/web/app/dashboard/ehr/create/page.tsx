import { CreateEhrForm } from "./create-ehr.form";

export default async function CreateEHRPage() {
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Create EHR</h2>
      </div>
      <div>
        <CreateEhrForm />
      </div>
    </>
  );
}
