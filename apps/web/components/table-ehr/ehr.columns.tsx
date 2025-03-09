"use client";

import { Button } from "@/components/ui/button";
import { deleteEhr } from "@/server/ehr/delete-ehr";
import { EHRWithMappings } from "@repo/types";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
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
    header: "Name",
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
    header: "Base URL",
  },
  {
    accessorKey: "authType",
    header: "Auth type",
  },
  {
    accessorKey: "mappings",
    header: "Mappings",
    cell: ({ row }) => {
      const ehr = row.original;
      const mappingsTotal = ehr.mappings?.length || 0;
      return (
        <Badge variant={mappingsTotal > 0 ? "default" : "outline"}>
          {mappingsTotal}
        </Badge>
      );
    },
  },
  {
    accessorKey: "users",
    header: "Users",
    cell: ({ row }) => {
      const ehr = row.original;
      const usersTotal = "TODO";
      return usersTotal;
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
              variant="destructive"
              onClick={async () => {
                const response = await deleteEhr(ehr.id);
                if (response.statusCode === 200) {
                  toast.success(response.message);
                  router.refresh();
                } else {
                  toast.error(response.message);
                }
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
