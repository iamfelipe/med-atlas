import { FormWithQuestions, Response } from "@repo/types";

/**
 * Fetches a form for a specific user
 * @param userId The ID of the user
 * @returns The response from the API
 */
export const getUserForm = async (
  userId: string
): Promise<Response<FormWithQuestions>> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER}/forms/user/${userId}`
  );
  const data = await response.json();
  return data;
};
