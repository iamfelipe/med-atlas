import { handleNotFound } from "@/lib/handle-not-found";
import { getUserForm } from "@/server/form/get-user-form";

export const useGetUserForm = async (userId: string) => {
  const response = await getUserForm(userId);

  handleNotFound(response);

  return response.data;
};
