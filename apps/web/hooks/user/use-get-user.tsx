import { handleNotFound } from "@/lib/handle-not-found";
import { getUser } from "@/server/users";

export const useGetUser = async (id: string) => {
  const response = await getUser(id);

  handleNotFound(response);

  return response.data;
};
