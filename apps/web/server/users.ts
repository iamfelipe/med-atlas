import { User } from "@prisma/client";
import { Response } from "@repo/types";

export const getUsers = async (): Promise<Response<User[]>> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/user`);
  const users = await response.json();
  return users;
};

export const getUser = async (id: string): Promise<Response<User>> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER}/user/${id}`
  );
  const user = await response.json();
  return user;
};
