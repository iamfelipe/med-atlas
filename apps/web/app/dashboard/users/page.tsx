import { AppHeader } from "@/components/app-header";
import { getUsers } from "@/server/users";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getRoles } from "@/server/user/get-roles";

export default async function UsersPage() {
  const { data: users } = await getUsers();
  const response = await getRoles();

  console.log(response.map((role) => role.key));
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
                {response.find((role) => role.id === user.role)?.key}
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Change role
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
