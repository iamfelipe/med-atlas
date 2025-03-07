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
