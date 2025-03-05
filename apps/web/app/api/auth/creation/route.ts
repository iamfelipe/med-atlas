import { createUser } from "@/server/user";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { KindeRole } from "@repo/types";
import { NextResponse } from "next/server";

async function fetchUserData() {
  const { getUser, getAccessToken, getClaim } = getKindeServerSession();
  const user = await getUser();
  const accessToken = await getAccessToken();
  const claim = await getClaim("roles");

  return { user, accessToken, roles: claim?.value as KindeRole[] | undefined };
}

function extractUserDetails(user: any, roles: KindeRole[] | undefined) {
  if (!user || !user.id) {
    throw new Error(
      "Something went wrong with authentication: " + JSON.stringify(user)
    );
  }

  return {
    id: user.id,
    firstName: user.given_name ?? "",
    lastName: user.family_name ?? "",
    email: user.email ?? "",
    role: roles?.map(({ key }) => key).join(",") ?? "patient",
  };
}

export async function GET() {
  const { user, roles } = await fetchUserData();
  const userDetails = extractUserDetails(user, roles);

  await createUser(userDetails);

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`);
}
