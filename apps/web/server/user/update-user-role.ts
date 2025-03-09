import { User } from "@prisma/client";
import { Response } from "@repo/types";

export const updateUserRole = async (
  id: string,
  roleId: string
): Promise<Response<User>> => {
  const updatedRoleInAuth = await fetch(
    `${process.env.KINDE_API_URL}/organization/${process.env.KINDE_ORGANIZATION}/users/${id}/roles`,
    {
      headers: {
        Authorization: `Bearer ${process.env.KINDE_AUTHORIZATION}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ roleId }),
    }
  );

  const updatedRoleInAuthData = await updatedRoleInAuth.json();

  if (updatedRoleInAuthData.code !== "OK") {
    throw new Error(updatedRoleInAuthData.error);
  }

  const updatedRoleInDb = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER}/user/${id}/role`,
    {
      method: "PUT",
      body: JSON.stringify({ roleId }),
    }
  );
  const updatedRoleInDbData = await updatedRoleInDb.json();

  return updatedRoleInDbData;
};
