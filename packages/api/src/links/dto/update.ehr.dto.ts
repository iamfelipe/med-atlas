import { z } from "zod";
import {
  createEhrDtoSchema,
  createEhrMappingDtoSchema,
} from "./create-ehr.dto";


export const updateEhrDtoSchema = z.object({
  id: z.string(),
  ...createEhrDtoSchema.shape,
  mappings: z.array(createEhrMappingDtoSchema.extend({ id: z.string().optional(), ehrId: z.string().optional() }))
});

export type UpdateEhrDto = z.infer<
  typeof updateEhrDtoSchema
>;
