import { z } from "zod";
import { createFormDtoSchema } from "./create-form.dto";

export const updateFormQuestionDtoSchema = z.object({
  id: z.string().optional(),
  mappingId: z.string(),
  value: z.string().optional(),
});

export const updateFormDtoSchema = createFormDtoSchema.partial().extend({
  name: z.string().min(2).max(100).optional(),
  status: z.enum(["pending", "completed"]).optional(),
  questions: z.array(updateFormQuestionDtoSchema).optional(),
});

export type UpdateFormQuestionDto = z.infer<typeof updateFormQuestionDtoSchema>;
export type UpdateFormDto = z.infer<typeof updateFormDtoSchema>;