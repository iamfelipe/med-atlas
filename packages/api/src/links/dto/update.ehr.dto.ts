import { z } from "zod";
import {
  createEhrDtoSchema,
  createEhrMappingDtoSchema,
} from "./create-ehr.dto";


export const updateEhrDtoSchema = z.object({
  ...createEhrDtoSchema.shape,
  mappings: z.array(createEhrMappingDtoSchema.partial())
}).partial();

export type UpdateEhrDto = z.infer<
  typeof updateEhrDtoSchema
>;
