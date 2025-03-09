import { AppHeader } from "@/components/app-header";
import { columns } from "@/components/table-patients/patients.columns";
import { DataTable } from "@/components/table-patients/patients.data-table";
import { getRoles } from "@/server/user/get-roles";
import { getUsers } from "@/server/users";

export default async function Patient() {
  const { data: users } = await getUsers();
  const roles = await getRoles();

  // Filter the users to only include patients
  const patients = users.filter((user) => {
    const role = roles.find((role) => role.id === user.role);
    return role?.key === "patient";
  });

  return (
    <>
      <AppHeader title="Patients" />
      <DataTable columns={columns} data={patients} />
    </>
  );
}
