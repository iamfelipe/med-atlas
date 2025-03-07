import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
      <AppHeader
        title={`${user.firstName} ${user.lastName}`}
        subtitle="Patient information"
      />
      <div>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Account</h3>
            <p className="text-sm text-muted-foreground">
              Update your account settings. Set your preferred language and
              timezone.
            </p>
            <Separator />
            {/* TODO: Form */}
          </div>
        </div>
      </div>
    </div>
  );
}
