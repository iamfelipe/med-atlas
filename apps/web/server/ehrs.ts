import { EHR } from "@prisma/client";

export const getEhrList = async (): Promise<EHR[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/ehr`);
  const ehrList = await response.json();
  return ehrList;
};
