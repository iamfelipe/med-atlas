"use client";

import { Button } from "@/components/ui/button";
import { EHRWithMappings } from "@repo/types";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const ehr = row.original;

      return (
        <Button variant="link" asChild className="p-0">
          <Link href={`/dashboard/ehr/${ehr.id}`}>{ehr.name}</Link>
        </Button>
      );
    },
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
    accessorKey: "mappings",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mappings" />
    ),
    cell: ({ row }) => {
      const ehr = row.original;
      const mappingsTotal = ehr.mappings.length;
      return (
        <Badge variant={mappingsTotal > 0 ? "default" : "outline"}>
          {mappingsTotal}
        </Badge>
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
