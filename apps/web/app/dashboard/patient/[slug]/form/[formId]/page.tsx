import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateToHumanReadable } from "@/lib/utils";
import { getEhr } from "@/server/ehr/get-ehr";
import { getUserForm } from "@/server/form/get-user-form";
import { getUser } from "@/server/users";
import { FormQuestion } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

// Define the FormQuestion type based on the schema

export default async function PatientFormPage({
  params,
}: {
  params: { slug: string; formId: string };
}) {
  // Fetch the user, form, and EHR data
  const { data: user } = await getUser(params.slug);

  if (!user) {
    notFound();
  }

  const formResponse = await getUserForm(params.slug);

  if (formResponse.statusCode !== 200 || !formResponse.data) {
    notFound();
  }

  const form = formResponse.data;

  // Verify that the form ID matches the requested form ID
  if (form.id !== params.formId) {
    notFound();
  }

  // Fetch the EHR to get mapping information
  const ehrResponse = await getEhr(form.ehrId);
  const ehr = ehrResponse.data;

  return (
    <div className="space-y-6">
      <AppHeader
        title={`${user.firstName} ${user.lastName}'s Form`}
        subtitle={`Form submitted on ${formatDateToHumanReadable(new Date(form.createdAt))}`}
      >
        <Button variant="outline" asChild>
          <Link href={`/dashboard/patient/${params.slug}`}>
            Back to Patient
          </Link>
        </Button>
      </AppHeader>

      <div className="rounded-md border">
        <Table>
          <TableCaption>
            Form Status:{" "}
            <span className="font-medium text-green-600">{form.status}</span>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Field</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {form.questions.map((question: FormQuestion) => {
              // Find the mapping to get the field name
              const mapping = ehr.mappings?.find(
                (m) => m.id === question.mappingId
              );
              const fieldName = mapping?.fieldName || "Unknown Field";

              return (
                <TableRow key={question.id}>
                  <TableCell className="font-medium">{fieldName}</TableCell>
                  <TableCell>{question.value || "Not provided"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
