import { GetRolesEntity } from "@repo/api/links/entities/get-roles.entity";

export const getRoles = async (): Promise<GetRolesEntity[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KINDE_API_URL}/roles`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_KINDE_AUTHORIZATION}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  return data.roles.map((role: any) => ({
    id: role.id,
    key: role.key,
  }));
};
