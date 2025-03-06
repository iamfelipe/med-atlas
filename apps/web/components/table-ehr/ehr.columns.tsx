"use client";

import { Button } from "@/components/ui/button";
import { EHRWithMappings } from "@repo/types";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { DataTableColumnHeader } from "../ui/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<EHRWithMappings>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "baseUrl",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Base URL" />
    ),
  },
  {
    accessorKey: "authType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Auth type" />
    ),
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
                router.push(`/dashboard/ehr/${ehr.id}`);
              }}
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                router.push(`/dashboard/ehr/${ehr.id}/edit`);
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                router.push(`/dashboard/ehr/${ehr.id}/delete`);
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
