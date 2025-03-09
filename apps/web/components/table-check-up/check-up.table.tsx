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
import { EHRMapping } from "@prisma/client";
import { EHRWithMappings, FormWithQuestions } from "@repo/types";
import Link from "next/link";
import { Button } from "../ui/button";

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

export const CheckUpTable = ({
  userForm,
  ehr,
}: {
  userForm: FormWithQuestions;
  ehr: EHRWithMappings;
}) => {
  if (!userForm || !userForm.questions || userForm.questions.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg font-medium text-gray-600">
          No form data available
        </p>
        <p className="text-sm text-gray-500 mt-2">
          There seems to be an issue with the form data. Please try again.
        </p>
      </div>
    );
  }

  console.log("Rendering CheckUpTable with data:", userForm);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Check-up form</h2>
        {/* TODO: Render link only if the user is an admin */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">EHR:</span>
          <span className="text-sm font-medium">
            <Button variant="secondary" asChild size="sm">
              <Link href={`/dashboard/ehr/${ehr.id}`}>{ehr.name}</Link>
            </Button>
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Status:</span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {userForm.status === "completed" ? "Completed" : userForm.status}
          </span>
        </div>
      </div>

      <Table>
        <TableCaption>
          Check-up form submitted on{" "}
          {formatDateToHumanReadable(new Date(userForm.createdAt))}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Question</TableHead>
            <TableHead>Answer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userForm.questions.map((question) => {
            // Find the mapping to get the field name
            const mapping = ehr.mappings?.find(
              (m) => m.id === question.mappingId
            );
            if (!question.value || !mapping) {
              return null;
            }
            const fieldName = mapping?.fieldName || "Unknown Question";

            return (
              <TableRow key={question.id}>
                <TableCell className="font-medium">{fieldName}</TableCell>
                <TableCell>
                  {formatCheckUpValue(question.value, mapping.dataType)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
