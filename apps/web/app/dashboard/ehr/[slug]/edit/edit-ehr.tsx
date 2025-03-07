"use client";

import { EHRForm } from "@/components/ehr.form";
import { updateEhr } from "@/server/ehr/update-ehr";
import { UpdateEhrDto } from "@repo/api/links/dto/update.ehr.dto";
import { EHRWithMappings } from "@repo/types";
import { toast } from "sonner";

export const EditEHR = ({ ehr }: { ehr: EHRWithMappings }) => {
  const handleSubmit = async (values: UpdateEhrDto) => {
    const response = await updateEhr(ehr.id, values);
    if (response.statusCode === 200) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <EHRForm
      ehr={ehr as UpdateEhrDto}
      handleSubmit={handleSubmit}
      submitButtonText="Update"
    />
  );
};
