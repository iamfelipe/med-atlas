import { EHRWithMappings, Response } from "@repo/types";

export const getEhr = async (
  id: string
): Promise<Response<EHRWithMappings>> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER}/ehr/${id}`
  );
  const data = await response.json();
  return data;
};
