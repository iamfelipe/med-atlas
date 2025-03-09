"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserRole } from "@/server/user/update-user-role";
import { GetRolesEntity } from "@repo/api/links/entities/get-roles.entity";
import { useState } from "react";
import { toast } from "sonner";

interface RoleDropdownProps {
  userId: string;
  currentRoleId: string;
  roles: GetRolesEntity[];
}

export function RoleDropdown({
  userId,
  currentRoleId,
  roles,
}: RoleDropdownProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>(currentRoleId || "");

  // Find the current role name
  const currentRole = roles.find((role) => role.id === selectedRole);
  const currentRoleName = currentRole?.key || "Unknown";

  const handleRoleChange = async (roleId: string) => {
    if (roleId === selectedRole) return;

    setIsLoading(true);
    try {
      await updateUserRole(userId, roleId, currentRoleId);
      setSelectedRole(roleId);
      toast.success("User role updated successfully");
    } catch (error) {
      console.error("Failed to update user role:", error);
      toast.error("Failed to update user role");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[180px]">
      <Select
        disabled={isLoading}
        defaultValue={selectedRole}
        onValueChange={handleRoleChange}
      >
        <SelectTrigger>
          <SelectValue>{currentRoleName}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role.id} value={role.id || ""}>
              {role.key}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
