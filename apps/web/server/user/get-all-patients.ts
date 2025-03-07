import { User } from "@prisma/client";
import { Response } from "@repo/types";

export const getAllPatients = async (): Promise<Response<User[]>> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER}/user/patient`
  );
  const patients = await response.json();
  return patients;
};
