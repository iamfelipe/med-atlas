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
