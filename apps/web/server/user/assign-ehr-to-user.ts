import { User } from "@prisma/client";
import { Response } from "@repo/types";

export async function assignEhrToUser(
  userId: string,
  ehrId: string
): Promise<Response<User>> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER}/user/${userId}/ehr`,
    {
      method: "PATCH",
      body: JSON.stringify({ ehrId }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.json();
}
