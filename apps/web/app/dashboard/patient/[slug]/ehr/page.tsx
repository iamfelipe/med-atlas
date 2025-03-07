import { Button } from "@/components/ui/button";
import { getEhr } from "@/server/ehr/get-ehr";
import { getUser } from "@/server/users";

export default async function PatientEhrPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: id } = await params;
  const { data: user } = await getUser(id);

  if (!user.ehrId) {
    return (
      <div>
        No EHR assigned
        <Button>Assign EHR</Button>
      </div>
    );
  }

  const ehr = await getEhr(user.ehrId);
  return (
    <div>
      <h1 className="text-2xl font-bold">
        {user.firstName} {user.lastName}
      </h1>
      <div>
        <h2>EHR</h2>
        <pre>{JSON.stringify(ehr, null, 2)}</pre>
      </div>
    </div>
  );
}
