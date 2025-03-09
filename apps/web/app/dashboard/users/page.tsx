import { AppHeader } from "@/components/app-header";
import { getUsers } from "@/server/users";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getRoles } from "@/server/user/get-roles";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { DeleteUser } from "./delete-user";
import { RoleDropdown } from "./role-dropdown";

export default async function UsersPage() {
  const { getUser: getUserFromKinde } = getKindeServerSession();
  const { id: userId } = await getUserFromKinde();
  const { data: users } = await getUsers();

  const roles = await getRoles();

  return (
    <>
      <AppHeader title="Users" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <RoleDropdown
                  userId={user.id}
                  currentRoleId={user.role}
                  roles={roles}
                />
              </TableCell>
              <TableCell>
                <DeleteUser userId={user.id} currentUserId={userId} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
