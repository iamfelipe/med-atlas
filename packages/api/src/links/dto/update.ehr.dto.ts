import { z } from "zod";
import {
  createEhrDtoSchema,
  createEhrMappingDtoSchema,
} from "./create-ehr.dto";


export const updateEhrDtoSchemaWithMappings = z.object({
  ...createEhrDtoSchema.shape,
  mappings: z.array(createEhrMappingDtoSchema.partial())
}).partial();

export type UpdateEhrDtoWithMappings = z.infer<
  typeof updateEhrDtoSchemaWithMappings
>;
