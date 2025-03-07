"use client";

import { EHRForm } from "@/components/ehr.form";
import { createEhr } from "@/server/ehr/create-ehr";
import { CreateEhrDto } from "@repo/api/links/dto/create-ehr.dto";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CreateEHR = ({ ehr }: { ehr: CreateEhrDto }) => {
  const router = useRouter();
  const handleSubmit = async (values: CreateEhrDto) => {
    const response = await createEhr(values);
    if (response.statusCode === 201) {
      toast.success(response.message);
      router.push("/dashboard/ehr");
    } else {
      toast.error(response.message);
    }
  };

  return <EHRForm ehr={ehr as CreateEhrDto} handleSubmit={handleSubmit} />;
};
