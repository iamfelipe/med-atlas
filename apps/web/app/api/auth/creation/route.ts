import { createUser } from "@/server/user";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { KindeRole, RoleType } from "@repo/types";
import { NextResponse } from "next/server";

async function fetchUserData() {
  const { getUser, getAccessToken, getClaim } = getKindeServerSession();
  const user = await getUser();
  const accessToken = await getAccessToken();
  const rolesClaim = await getClaim("roles");

  return {
    user,
    accessToken,
    roles: rolesClaim?.value as KindeRole[] | undefined,
  };
}

function extractUserDetails(user: any, roles: KindeRole[] | undefined) {
  if (!user?.id) {
    throw new Error("Authentication failed: " + JSON.stringify(user));
  }

  return {
    id: user.id,
    firstName: user.given_name || "",
    lastName: user.family_name || "",
    email: user.email || "",
    role: roles?.map(({ id }) => id).join(",") || "",
  };
}

export async function GET() {
  const { user, roles } = await fetchUserData();
  const userDetails = extractUserDetails(user, roles);

  await createUser(userDetails);

  console.log({ userDetails, roles });

  const redirectUrl = roles?.some((role) => role.key === RoleType.PATIENT)
    ? `${process.env.NEXT_PUBLIC_APP_URL}/`
    : `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;

  return NextResponse.redirect(redirectUrl);
}
