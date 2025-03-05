import { User } from "@prisma/client";

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/user`);
  const users = await response.json();
  return users;
};

export const getUser = async (id: string): Promise<User> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER}/user/${id}`
  );
  const user = await response.json();
  return user;
};
