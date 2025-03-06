import { CreateEhrDto } from "@repo/api/links/dto/create-ehr.dto";

export const createEhr = async (ehr: CreateEhrDto) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/ehr`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ehr),
  });
  const data = await response.json();
  return data;
};
