import { User } from "@prisma/client";

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/user`);
  const users = await response.json();
  return users;
};
