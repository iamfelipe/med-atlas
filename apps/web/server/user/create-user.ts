import { User } from "@prisma/client";
export const createUser = async (user: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}): Promise<User> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/user`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const newUser = await response.json();
  return newUser;
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
