import { EHRWithMappings, Response } from "@repo/types";

export const getAllEhr = async (): Promise<Response<EHRWithMappings[]>> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/ehr`);
  const ehrList = await response.json();
  return ehrList;
};
