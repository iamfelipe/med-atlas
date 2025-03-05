import { EHR, EHRMapping } from "@prisma/client";

export type EHRWithMappings = EHR & {
  mappings: EHRMapping[];
};
