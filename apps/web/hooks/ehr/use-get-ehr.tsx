import { handleNotFound } from "@/lib/handle-not-found";
import { getEhr } from "@/server/ehr/get-ehr";

export const useGetEhr = async (ehrId: string) => {
  const response = await getEhr(ehrId);

  handleNotFound(response);

  return response.data;
};
