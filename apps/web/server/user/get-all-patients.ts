import { User } from "@prisma/client";

export const getAllPatients = async (): Promise<User[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER}/user/patient`
  );
  const patients = await response.json();
  return patients;
};
