import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { formatDateToHumanReadable } from "@/lib/utils";
import { getEhr } from "@/server/ehr/get-ehr";
import { getUserForm } from "@/server/form/get-user-form";
import { getUser } from "@/server/users";
import Link from "next/link";

export default async function PatientEhrPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: id } = await params;
  const { data: user } = await getUser(id);
  const { data: userForm } = await getUserForm(id);
  const { data: ehr } = await getEhr(user.ehrId || "");
  return (
    <div>
      <AppHeader
        title={`${user.firstName} ${user.lastName}`}
        subtitle="Patient information"
      />
      <div>
        <Table>
          <TableCaption>User information</TableCaption>

          <TableBody>
            <TableRow>
              <TableCell className="font-medium">ID</TableCell>
              <TableCell>{user.id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Role</TableCell>
              <TableCell>{user.role}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">First Name</TableCell>
              <TableCell>{user.firstName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Last Name</TableCell>
              <TableCell>{user.lastName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Email</TableCell>
              <TableCell>{user.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Created At</TableCell>
              <TableCell>
                {formatDateToHumanReadable(new Date(user.createdAt))}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Updated At</TableCell>
              <TableCell>
                {formatDateToHumanReadable(new Date(user.updatedAt))}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">EHR</TableCell>
              <TableCell>
                {ehr.name ? (
                  <Button variant="outline" asChild>
                    <Link href={`/dashboard/ehr/${ehr.id}`}>{ehr.name}</Link>
                  </Button>
                ) : (
                  "N/A"
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Form</TableCell>
              <TableCell>
                {userForm?.name ? (
                  <Button variant="outline" asChild>
                    <Link href={`/dashboard/patient/${id}/form/${userForm.id}`}>
                      {userForm.name}
                    </Link>
                  </Button>
                ) : (
                  "N/A"
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
