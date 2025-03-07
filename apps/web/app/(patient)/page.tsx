import { AppHeader } from "@/components/app-header";
import { getEhr } from "@/server/ehr/get-ehr";
import { getUser } from "@/server/users";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { CheckUpForm } from "./check-up.form";

const useGetUser = async () => {
  const { getUser: getUserFromKinde } = getKindeServerSession();
  const { id: userId } = await getUserFromKinde();
  const { data: user } = await getUser(userId);

  return user;
};

export default async function ClientPage() {
  const user = await useGetUser();

  if (!user?.ehrId) {
    return <div>No EHR ID found</div>;
  }

  const { data: ehr } = await getEhr(user.ehrId);

  return (
    <>
      <AppHeader
        title={`${user.firstName} ${user.lastName}`}
        subtitle="Patient check up"
      />
      <CheckUpForm userId={user.id} ehr={ehr} />
    </>
  );
}
