import { EHRWithMappings, Response } from "@repo/types";

export const deleteEhr = async (
  id: string
): Promise<Response<EHRWithMappings>> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER}/ehr/${id}`,
    {
      method: "DELETE",
    }
  );
  const data = await response.json();
  return data;
};
