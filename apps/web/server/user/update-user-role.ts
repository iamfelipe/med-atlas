import { User } from "@prisma/client";
import { Response } from "@repo/types";

export const updateUserRole = async (
  id: string,
  roleId: string,
  currentRoleId: string
): Promise<Response<User>> => {
  // Instead of directly calling Kinde API, we'll use our backend API
  // which will handle the Kinde API call server-side
  const updatedRoleInDb = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER}/user/${id}/role`,
    {
      method: "PUT",
      body: JSON.stringify({ roleId, currentRoleId }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const updatedRoleInDbData = await updatedRoleInDb.json();

  return updatedRoleInDbData;
};
