import { User } from "@prisma/client";
import { Response } from "@repo/types";

export const deleteUser = async (userId: string): Promise<Response<User>> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER}/user/${userId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const deletedUser = await response.json();
  return deletedUser;
};

// private async updateRoleInKinde(userId: string, role: string): Promise<void> {
//   const { getAccessToken } = getKindeServerSession();

//   const accessToken = await getAccessToken();

//   const resp = await fetch(
//     `${process.env.KINDE_DOMAIN_URL}/api/v1/users/${userId}/properties/roles`,
//     {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${accessToken}`,
//       },
//       body: JSON.stringify({
//         properties: {
//           role,
//         },
//       }),
//     },
//   );
// }
