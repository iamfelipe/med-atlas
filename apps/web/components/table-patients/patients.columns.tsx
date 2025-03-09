"use client";

import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatDateToHumanReadable } from "@/lib/utils";
import { getEhr } from "@/server/ehr/get-ehr";
import { getUserForm } from "@/server/form/get-user-form";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AssignEHR from "../assign-ehr";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row }) =>
      formatDateToHumanReadable(new Date(row.original.createdAt)),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated at",
    cell: ({ row }) =>
      formatDateToHumanReadable(new Date(row.original.updatedAt)),
  },
  {
    accessorKey: "ehrId",
    header: "EHR",
    cell: ({ row }) => {
      const patient = row.original;
      const [EHR, setEHR] = useState<{ id: string; name: string } | null>(null);

      useEffect(() => {
        const fetchEhrName = async () => {
          if (patient.ehrId) {
            const resp = await getEhr(patient.ehrId);
            setEHR({
              id: resp.data.id,
              name: resp.data.name,
            });
          }
        };
        fetchEhrName();
      }, [patient.ehrId]);

      if (!patient.ehrId) {
        return <AssignEHR userId={patient.id} />;
      }

      return (
        <Button
          variant="secondary"
          size="sm"
          className={cn(!EHR && "pointer-events-none")}
          asChild
        >
          <Link href={`/dashboard/ehr/${EHR?.id}`}>
            {EHR?.name || "Loading..."}
          </Link>
        </Button>
      );
    },
  },
  {
    accessorKey: "form",
    header: "Check-up form",
    cell: ({ row }) => {
      const patient = row.original;
      const [formStatus, setFormStatus] = useState<
        "loading" | "needs_ehr" | "pending" | "completed"
      >("loading");
      const [formId, setFormId] = useState<string | null>(null);

      useEffect(() => {
        const fetchFormStatus = async () => {
          // If no EHR is assigned, form status is "needs_ehr"
          if (!patient.ehrId) {
            setFormStatus("needs_ehr");
            return;
          }

          try {
            // Fetch the user's form
            const response = await getUserForm(patient.id);

            if (response.statusCode === 200) {
              // Form exists, set status based on form status
              setFormStatus(response.data.status);
              setFormId(response.data.id);
            } else {
              // No form exists yet, status is "pending"
              setFormStatus("pending");
            }
          } catch (error) {
            console.error("Error fetching form status:", error);
            setFormStatus("pending");
          }
        };

        fetchFormStatus();
      }, [patient.id, patient.ehrId]);

      // If no EHR is assigned, show message that EHR needs to be assigned first
      if (formStatus === "needs_ehr") {
        return (
          <div className="text-sm text-amber-600 font-medium">
            EHR needs to be assigned first
          </div>
        );
      }

      // If loading, show loading state
      if (formStatus === "loading") {
        return <div className="text-sm text-gray-500">Loading...</div>;
      }

      // If form is completed, show "Completed" as a link to the form
      if (formStatus === "completed" && formId) {
        return (
          <Button
            variant="outline"
            size="sm"
            className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-600"
            asChild
          >
            <Link href={`/dashboard/patient/${patient.id}/form/${formId}`}>
              Completed
            </Link>
          </Button>
        );
      }

      // Otherwise, show "Pending" status
      return <div className="text-sm text-amber-600 font-medium">Pending</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const ehr = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                router.push(`/dashboard/patient/${ehr.id}`);
              }}
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                router.push(`/dashboard/patient/${ehr.id}`);
              }}
            >
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              variant="destructive"
              onClick={async () => {
                console.log("delete patient");
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
