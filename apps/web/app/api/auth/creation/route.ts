import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { createUser } from "../../../../server/users";

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user == null || !user.id)
    throw new Error("something went wrong with authentication" + user);

  await createUser({
    id: user.id,
    firstName: user.given_name ?? "",
    lastName: user.family_name ?? "",
    email: user.email ?? "",
  });

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}`);
}
