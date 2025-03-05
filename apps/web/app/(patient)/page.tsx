import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function ClientPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  return (
    <>
      <h2 className="text-lg font-semibold">Questionnaire</h2>
      <p>{user?.email}</p>
    </>
  );
}
