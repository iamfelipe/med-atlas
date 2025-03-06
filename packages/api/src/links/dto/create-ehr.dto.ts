export class CreateLinkDto {}

import { z } from "zod";

export const createEhrMappingDtoSchema = z.object({
  entityType: z.string(),
  fieldName: z.string(),
  mappingPath: z.string(),
  dataType: z.enum(["string", "number", "boolean", "date"]),
});

export const createEhrDtoSchema = z.object({
  name: z.string().min(2).max(30),
  baseUrl: z.string().url(),
  authType: z.enum(["OAuth2", "API_KEY"]),
  mappings: z.array(createEhrMappingDtoSchema).optional(),
});

export type CreateEhrMappingDto = z.infer<typeof createEhrMappingDtoSchema>;
export type CreateEhrDto = z.infer<typeof createEhrDtoSchema>;