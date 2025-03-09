import { AppHeader } from "@/components/app-header";
import { CheckUpTable } from "@/components/table-check-up/check-up.table";
import { Button } from "@/components/ui/button";
import { useGetEhr } from "@/hooks/ehr/use-get-ehr";
import { useGetUser } from "@/hooks/user/use-get-user";
import { useGetUserForm } from "@/hooks/user/use-get-user-form";
import { formatDateToHumanReadable } from "@/lib/utils";
import { EHRMapping } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

const formatCheckUpValue = (
  value: string,
  dataType: EHRMapping["dataType"]
) => {
  switch (dataType) {
    case "date":
      return formatDateToHumanReadable(new Date(value));
    case "string":
      return value;
    case "number":
      return value;
    case "boolean":
      return value;
    case "radio":
      return value;
    case "dropdown":
      return value;
    case "multiple":
      return value;
    default:
      return value;
  }
};

export default async function PatientFormPage({
  params,
}: {
  params: Promise<{ slug: string; formId: string }>;
}) {
  const { slug, formId } = await params;
  const user = await useGetUser(slug);
  const form = await useGetUserForm(slug);

  // Verify that the form ID matches the requested form ID
  if (form.id !== formId) {
    notFound();
  }

  // Fetch the EHR to get mapping information
  const ehr = await useGetEhr(form.ehrId);

  return (
    <div className="space-y-6">
      <AppHeader
        title={`${user.firstName} ${user.lastName}'s check-up form`}
        subtitle={`Form submitted on ${formatDateToHumanReadable(new Date(form.createdAt))}`}
      >
        <Button variant="outline" asChild>
          <Link href={`/dashboard/patient/${slug}`}>Back to Patient</Link>
        </Button>
      </AppHeader>

      {/* Display form questions */}
      <CheckUpTable userForm={form} ehr={ehr} />
    </div>
  );
}
