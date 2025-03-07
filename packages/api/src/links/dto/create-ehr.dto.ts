import { z } from "zod";

export const createEhrMappingDtoSchema = z.object({
  id: z.string().optional(),
  ehrId: z.string().optional(),
  entityType: z.string().min(1),
  fieldName: z.string().min(1),
  mappingPath: z.string().min(1),
  dataType: z.enum(["string", "number", "date", "boolean", "multiple", "radio", "dropdown"]).default("string"),
  required: z.boolean().default(true),
  apiEndpoint: z.string().min(2).default("/"),
});

export const createEhrDtoSchema = z.object({
  name: z.string().min(2).max(30),
  baseUrl: z.string().url(),
  authType: z.enum(["OAuth2", "API_KEY"]).default("API_KEY"),
  mappings: z.array(createEhrMappingDtoSchema).min(1),
});

export type CreateEhrMappingDto = z.infer<typeof createEhrMappingDtoSchema>;
export type CreateEhrDto = z.infer<typeof createEhrDtoSchema>;