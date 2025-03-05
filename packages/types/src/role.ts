export interface KindeRole {
  id: string;
  key: RoleType;
  name: string;
}

export enum RoleType {
  PATIENT = "patient",
  ADMIN = "admin",
}
