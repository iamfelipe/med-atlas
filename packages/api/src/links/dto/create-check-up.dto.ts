import { z } from "zod";
import { createEhrMappingDtoSchema } from "./create-ehr.dto";

export const createCheckUpDtoSchema = z.object({
  status: z.enum(["pending", "completed"]),
  questions: z.array(
    z.object({
      mappingId: createEhrMappingDtoSchema.shape.id,
      name: createEhrMappingDtoSchema.shape.fieldName,
      dataType: createEhrMappingDtoSchema.shape.dataType,
      value: z.string(),
      options: createEhrMappingDtoSchema.shape.options,
    }),
  ),
});

export type CreateCheckUpDto = z.infer<typeof createCheckUpDtoSchema>;
