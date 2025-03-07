"use client";

import { EHRForm } from "@/components/ehr.form";
import { updateEhr } from "@/server/ehr/update-ehr";
import { UpdateEhrDto } from "@repo/api/links/dto/update.ehr.dto";
import { EHRWithMappings } from "@repo/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const EditEHR = ({ ehr }: { ehr: EHRWithMappings }) => {
  const router = useRouter();
  const handleSubmit = async (values: UpdateEhrDto) => {
    const response = await updateEhr(ehr.id, values);
    if (response.statusCode === 200) {
      toast.success(response.message);
      router.push("/dashboard/ehr");
    } else {
      toast.error(response.message);
    }
  };

  return <EHRForm ehr={ehr as UpdateEhrDto} handleSubmit={handleSubmit} />;
};
