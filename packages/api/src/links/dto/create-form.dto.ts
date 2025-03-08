import { z } from "zod";
import { createEhrMappingDtoSchema } from "./create-ehr.dto";

export const createFormQuestionDtoSchema = z.object({
  mappingId: createEhrMappingDtoSchema.shape.id,
  value: z.string().optional(),
});

export const createFormDtoSchema = z.object({
  name: z.string().min(2).max(100),
  userId: z.string(),
  ehrId: z.string(),
  status: z.enum(["pending", "completed"]).default("pending"),
  questions: z.array(createFormQuestionDtoSchema),
});

export type CreateFormQuestionDto = z.infer<typeof createFormQuestionDtoSchema>;
export type CreateFormDto = z.infer<typeof createFormDtoSchema>;