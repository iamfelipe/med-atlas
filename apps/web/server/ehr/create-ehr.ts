import { EHRWithMappings } from "@repo/types";

export const createEhr = async (ehr: EHRWithMappings) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/ehr`, {
    method: "POST",
    body: JSON.stringify(ehr),
  });
  const data = await response.json();
  return data;
};
