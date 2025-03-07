import { EHRWithMappings, Response } from "@repo/types";

export const getAllEhr = async (
  isWithMappings: boolean = true
): Promise<Response<EHRWithMappings[]>> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER}/ehr?isWithMappings=${isWithMappings}`
  );
  const ehrList = await response.json();
  return ehrList;
};
