import { z } from "zod";
import { createEhrMappingDtoSchema } from "./create-ehr.dto";

export const createCheckUpDtoSchema = z.object({
  questions: z.array(
    z.object({
      id: z.string(),
      name: createEhrMappingDtoSchema.shape.fieldName,
      dataType: createEhrMappingDtoSchema.shape.dataType,
      value: z.string(),
    }),
  ),
});

export type CreateCheckUpDto = z.infer<typeof createCheckUpDtoSchema>;
