import { z } from "zod";

export const getRolesEntity = z.object({
  id: z.string(),
  key: z.string(),
});

export type GetRolesEntity = z.infer<typeof getRolesEntity>;