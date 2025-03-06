export class CreateLinkDto {}

import { z } from "zod";

export const createEhrMappingDtoSchema = z.object({
  entityType: z.string(),
  fieldName: z.string(),
  mappingPath: z.string(),
  dataType: z.enum(["string", "number", "boolean", "date"]),
  required: z.boolean().default(true),
  apiEndpoint: z.string().optional(),
});

export const createEhrDtoSchema = z.object({
  name: z.string().min(2).max(30),
  baseUrl: z.string().url(),
  authType: z.enum(["OAuth2", "API_KEY"]).default("API_KEY"),
  mappings: z.array(createEhrMappingDtoSchema).min(1),
});

export type CreateEhrMappingDto = z.infer<typeof createEhrMappingDtoSchema>;
export type CreateEhrDto = z.infer<typeof createEhrDtoSchema>;