import {
  LoginLink,
  LogoutLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// type Props = Omit<ImageProps, "src"> & {
//   srcLight: string;
//   srcDark: string;
// };

export default async function Home() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <>
      <h1>Home</h1>
      {user ? (
        <>
          <p>
            {user.given_name} {user.family_name}
          </p>
          <LogoutLink>Logout</LogoutLink>
        </>
      ) : (
        <>
          <LoginLink>Sign in</LoginLink>

          <RegisterLink>Sign up</RegisterLink>
        </>
      )}
    </>
  );
}
