"use client";

import { DataTable } from "@/components/table-ehr/ehr.data-table";
import { Badge } from "@/components/ui/badge";
import { EHRWithMappings } from "@repo/types";
import { ColumnDef } from "@tanstack/react-table";

// Define columns for the EHR detail view
const detailColumns: ColumnDef<any>[] = [
  {
    accessorKey: "key",
    header: "Property",
    cell: ({ row }) => <div className="font-medium">{row.getValue("key")}</div>,
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => {
      const value = row.getValue("value");

      if (Array.isArray(value)) {
        return <Badge variant="outline">{value.length} items</Badge>;
      }

      if (typeof value === "object" && value !== null) {
        return <Badge variant="outline">Object</Badge>;
      }

      return <div>{String(value)}</div>;
    },
  },
];

// Define columns for the mappings table
const mappingColumns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="font-mono text-xs">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "entityType",
    header: "Entity Type",
  },
  {
    accessorKey: "fieldName",
    header: "Field Name",
  },
  {
    accessorKey: "mappingPath",
    header: "Mapping Path",
  },
  {
    accessorKey: "dataType",
    header: "Data Type",
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("dataType")}</Badge>
    ),
  },
  {
    accessorKey: "required",
    header: "Required",
    cell: ({ row }) => (
      <Badge variant={row.getValue("required") ? "default" : "secondary"}>
        {row.getValue("required") ? "Yes" : "No"}
      </Badge>
    ),
  },
  {
    accessorKey: "apiEndpoint",
    header: "API Endpoint",
  },
];

interface EHRDetailViewProps {
  ehr: EHRWithMappings;
}

export function EHRDetailView({ ehr }: EHRDetailViewProps) {
  // Transform EHR data for the detail table
  const ehrDetails = Object.entries(ehr)
    .filter(([key]) => key !== "mappings") // Exclude mappings as we'll show them in a separate table
    .map(([key, value]) => ({
      key,
      value,
    }));

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">EHR Information</h3>
        <DataTable columns={detailColumns} data={ehrDetails} />
      </div>

      {ehr.mappings && ehr.mappings.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">
            Mappings ({ehr.mappings.length})
          </h3>
          <DataTable columns={mappingColumns} data={ehr.mappings} />
        </div>
      )}
    </div>
  );
}
