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
import { useGetEhr } from "@/hooks/ehr/use-get-ehr";
import { useGetUser } from "@/hooks/user/use-get-user";
import { useGetUserForm } from "@/hooks/user/use-get-user-form";
import { formatDateToHumanReadable } from "@/lib/utils";
import { FormQuestion } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

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
